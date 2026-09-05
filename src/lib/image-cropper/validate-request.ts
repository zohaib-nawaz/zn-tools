import {
  ALLOWED_MIME_TYPES,
  DEFAULT_QUALITY,
  MAX_QUALITY,
  MAX_UPLOAD_BYTES,
  MIN_QUALITY,
  OUTPUT_FORMATS,
} from "@/lib/image-optimizer/constants";
import { hasAllowedImageSignature } from "@/lib/image-optimizer/signatures";
import type { OutputFormat } from "@/lib/image-optimizer/types";
import { MIN_CROP_PX } from "@/lib/image-cropper/constants";
import { CropperError, CROPPER_ERROR_CODES } from "@/lib/image-cropper/errors";
import type { CropRequest } from "@/lib/image-cropper/types";

function isOutputFormat(value: string): value is OutputFormat {
  return (OUTPUT_FORMATS as readonly string[]).includes(value);
}

function parseInteger(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "" || typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

function parseIntegerWithFallback(
  value: FormDataEntryValue | null,
  fallback: number,
): number | null {
  if (value == null || value === "") {
    return fallback;
  }

  return parseInteger(value);
}

function normalizeMimeType(type: string): string {
  return type.toLowerCase() === "image/jpg" ? "image/jpeg" : type.toLowerCase();
}

export async function parseCropRequest(formData: FormData): Promise<CropRequest> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new CropperError(CROPPER_ERROR_CODES.MISSING_FILE, "Please choose an image first.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new CropperError(CROPPER_ERROR_CODES.FILE_TOO_LARGE, "Image is larger than 20MB.");
  }

  const mimeType = normalizeMimeType(file.type);
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    throw new CropperError(
      CROPPER_ERROR_CODES.UNSUPPORTED_TYPE,
      "Use a JPEG, PNG, WebP, AVIF, GIF, or TIFF image.",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!hasAllowedImageSignature(buffer)) {
    throw new CropperError(CROPPER_ERROR_CODES.INVALID_IMAGE, "That file is not a valid image.");
  }

  const left = parseInteger(formData.get("left"));
  const top = parseInteger(formData.get("top"));
  const width = parseInteger(formData.get("width"));
  const height = parseInteger(formData.get("height"));

  if (left == null || top == null || width == null || height == null) {
    throw new CropperError(CROPPER_ERROR_CODES.INVALID_CROP, "Crop area is missing.");
  }

  if (left < 0 || top < 0 || width < MIN_CROP_PX || height < MIN_CROP_PX) {
    throw new CropperError(
      CROPPER_ERROR_CODES.INVALID_CROP,
      `Crop must be at least ${MIN_CROP_PX}×${MIN_CROP_PX} pixels.`,
    );
  }

  const formatValue = String(formData.get("format") ?? "png");
  if (!isOutputFormat(formatValue)) {
    throw new CropperError(
      CROPPER_ERROR_CODES.INVALID_FORMAT,
      "Choose WebP, JPEG, PNG, or AVIF.",
    );
  }

  const quality = parseIntegerWithFallback(formData.get("quality"), DEFAULT_QUALITY);
  if (quality == null || quality < MIN_QUALITY || quality > MAX_QUALITY) {
    throw new CropperError(
      CROPPER_ERROR_CODES.INVALID_QUALITY,
      `Quality must be between ${MIN_QUALITY} and ${MAX_QUALITY}.`,
    );
  }

  return {
    buffer,
    originalBytes: file.size,
    originalName: file.name,
    crop: { left, top, width, height },
    quality,
    format: formatValue,
  };
}
