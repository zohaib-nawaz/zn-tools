import sharp from "sharp";
import {
  CONTENT_TYPES,
  FILE_EXTENSIONS,
  MAX_INPUT_PIXELS,
} from "@/lib/image-optimizer/constants";
import { OptimizerError, OPTIMIZER_ERROR_CODES } from "@/lib/image-optimizer/errors";
import type { OptimizeRequest, OptimizeResult } from "@/lib/image-optimizer/types";

type SharpPipeline = ReturnType<typeof sharp>;

function applyOutputFormat(
  pipeline: SharpPipeline,
  request: OptimizeRequest,
): SharpPipeline {
  switch (request.format) {
    case "jpeg":
      return pipeline.jpeg({
        quality: request.quality,
        mozjpeg: true,
        progressive: true,
      });
    case "png":
      return pipeline.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
      });
    case "avif":
      return pipeline.avif({
        quality: request.quality,
        effort: 4,
      });
    case "webp":
    default:
      return pipeline.webp({
        quality: request.quality,
        effort: 4,
      });
  }
}

export async function optimizeImage(request: OptimizeRequest): Promise<OptimizeResult> {
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
      throw new OptimizerError(
        OPTIMIZER_ERROR_CODES.INVALID_IMAGE,
        "Could not read image dimensions.",
      );
    }

    const pipeline = applyOutputFormat(
      image.resize({
        width: request.width,
        withoutEnlargement: false,
        kernel: "lanczos3",
      }),
      request,
    );

    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

    if (!info.width || !info.height) {
      throw new OptimizerError(
        OPTIMIZER_ERROR_CODES.OPTIMIZE_FAILED,
        "Optimization did not produce a valid image.",
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
    if (error instanceof OptimizerError) {
      throw error;
    }

    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.OPTIMIZE_FAILED,
      "Could not optimize this image. Try another file.",
      500,
    );
  }
}
