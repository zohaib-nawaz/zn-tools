import sharp from "sharp";
import {
  CONTENT_TYPES,
  FILE_EXTENSIONS,
  MAX_INPUT_PIXELS,
} from "@/lib/image-optimizer/constants";
import { MIN_CROP_PX } from "@/lib/image-cropper/constants";
import { CropperError, CROPPER_ERROR_CODES } from "@/lib/image-cropper/errors";
import { clampPixelCrop } from "@/lib/image-cropper/geometry";
import type { CropRequest, CropResult } from "@/lib/image-cropper/types";

type SharpPipeline = ReturnType<typeof sharp>;

function applyOutputFormat(pipeline: SharpPipeline, request: CropRequest): SharpPipeline {
  switch (request.format) {
    case "jpeg":
      return pipeline.jpeg({
        quality: request.quality,
        mozjpeg: true,
        progressive: true,
      });
    case "webp":
      return pipeline.webp({
        quality: request.quality,
        effort: 4,
      });
    case "avif":
      return pipeline.avif({
        quality: request.quality,
        effort: 4,
      });
    case "png":
    default:
      return pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
      });
  }
}

export async function cropImage(request: CropRequest): Promise<CropResult> {
  try {
    const image = sharp(request.buffer, {
      failOn: "truncated",
      limitInputPixels: MAX_INPUT_PIXELS,
      sequentialRead: true,
      animated: false,
    }).rotate();

    const metadata = await image.metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;

    if (!originalWidth || !originalHeight) {
      throw new CropperError(
        CROPPER_ERROR_CODES.INVALID_IMAGE,
        "Could not read image dimensions.",
      );
    }

    const crop = clampPixelCrop(request.crop, originalWidth, originalHeight);

    if (crop.width < MIN_CROP_PX || crop.height < MIN_CROP_PX) {
      throw new CropperError(
        CROPPER_ERROR_CODES.INVALID_CROP,
        `Crop must be at least ${MIN_CROP_PX}×${MIN_CROP_PX} pixels.`,
      );
    }

    if (
      crop.left + crop.width > originalWidth ||
      crop.top + crop.height > originalHeight
    ) {
      throw new CropperError(
        CROPPER_ERROR_CODES.INVALID_CROP,
        "Crop area sits outside the image.",
      );
    }

    const pipeline = applyOutputFormat(
      image.extract({
        left: crop.left,
        top: crop.top,
        width: crop.width,
        height: crop.height,
      }),
      request,
    );

    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

    if (!info.width || !info.height) {
      throw new CropperError(
        CROPPER_ERROR_CODES.CROP_FAILED,
        "Crop did not produce a valid image.",
        500,
      );
    }

    return {
      buffer: data,
      contentType: CONTENT_TYPES[request.format],
      extension: FILE_EXTENSIONS[request.format],
      width: info.width,
      height: info.height,
      bytes: info.size,
      originalWidth,
      originalHeight,
      originalBytes: request.originalBytes,
    };
  } catch (error) {
    if (error instanceof CropperError) {
      throw error;
    }

    throw new CropperError(
      CROPPER_ERROR_CODES.CROP_FAILED,
      "Could not crop this image. Try another file.",
      500,
    );
  }
}
