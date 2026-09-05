import type { OptimizeApiError } from "@/lib/image-optimizer/types";
import { MIN_CROP_PX } from "@/lib/image-cropper/constants";
import type { PixelCrop } from "@/lib/image-cropper/types";

export type CroppedImage = {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
  filename: string;
};

function headerNumber(headers: Headers, name: string): number {
  const value = Number(headers.get(name));
  return Number.isFinite(value) ? value : 0;
}

export function validatePixelCrop(
  crop: PixelCrop | null,
  imageWidth: number,
  imageHeight: number,
): string | null {
  if (!crop) {
    return "Draw a crop area first.";
  }

  if (crop.width < MIN_CROP_PX || crop.height < MIN_CROP_PX) {
    return `Crop must be at least ${MIN_CROP_PX}×${MIN_CROP_PX} pixels.`;
  }

  if (
    crop.left < 0 ||
    crop.top < 0 ||
    crop.left + crop.width > imageWidth ||
    crop.top + crop.height > imageHeight
  ) {
    return "Crop area sits outside the image.";
  }

  return null;
}

export async function cropImageRequest(input: {
  file: File;
  crop: PixelCrop;
  format: string;
  quality: number;
  signal?: AbortSignal;
}): Promise<CroppedImage> {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("left", String(input.crop.left));
  formData.append("top", String(input.crop.top));
  formData.append("width", String(input.crop.width));
  formData.append("height", String(input.crop.height));
  formData.append("format", input.format);
  formData.append("quality", String(input.quality));

  const response = await fetch("/api/crop", {
    method: "POST",
    body: formData,
    signal: input.signal,
  });

  if (!response.ok) {
    let message = "Could not crop this image.";

    try {
      const payload = (await response.json()) as OptimizeApiError;
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Keep the fallback message when the body is not JSON.
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  return {
    blob,
    width: headerNumber(response.headers, "X-Image-Width"),
    height: headerNumber(response.headers, "X-Image-Height"),
    bytes: headerNumber(response.headers, "X-Image-Bytes") || blob.size,
    originalWidth: headerNumber(response.headers, "X-Original-Width"),
    originalHeight: headerNumber(response.headers, "X-Original-Height"),
    originalBytes: headerNumber(response.headers, "X-Original-Bytes") || input.file.size,
    filename: response.headers.get("X-Output-Filename") ?? "cropped-image.png",
  };
}
