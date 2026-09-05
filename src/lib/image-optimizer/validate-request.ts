import {
  ALLOWED_MIME_TYPES,
  DEFAULT_QUALITY,
  MAX_QUALITY,
  MAX_TARGET_WIDTH,
  MAX_UPLOAD_BYTES,
  MIN_QUALITY,
  MIN_TARGET_WIDTH,
  OUTPUT_FORMATS,
} from "@/lib/image-optimizer/constants";
import { OptimizerError, OPTIMIZER_ERROR_CODES } from "@/lib/image-optimizer/errors";
import { hasAllowedImageSignature } from "@/lib/image-optimizer/signatures";
import type { OptimizeRequest, OutputFormat } from "@/lib/image-optimizer/types";

function isOutputFormat(value: string): value is OutputFormat {
  return (OUTPUT_FORMATS as readonly string[]).includes(value);
}

function parseInteger(value: FormDataEntryValue | null, fallback?: number): number | null {
  if (value == null || value === "") {
    return fallback ?? null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return null;
  }

  return parsed;
}

function normalizeMimeType(type: string): string {
  return type.toLowerCase() === "image/jpg" ? "image/jpeg" : type.toLowerCase();
}

export async function parseOptimizeRequest(formData: FormData): Promise<OptimizeRequest> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.MISSING_FILE,
      "Please choose an image first.",
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.FILE_TOO_LARGE,
      "Image is larger than 20MB.",
    );
  }

  const mimeType = normalizeMimeType(file.type);
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.UNSUPPORTED_TYPE,
      "Use a JPEG, PNG, WebP, AVIF, GIF, or TIFF image.",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!hasAllowedImageSignature(buffer)) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.INVALID_IMAGE,
      "That file is not a valid image.",
    );
  }

  const width = parseInteger(formData.get("width"));
  if (width == null || width < MIN_TARGET_WIDTH || width > MAX_TARGET_WIDTH) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.INVALID_WIDTH,
      `Width must be a whole number between ${MIN_TARGET_WIDTH} and ${MAX_TARGET_WIDTH} pixels.`,
    );
  }

  const formatValue = String(formData.get("format") ?? "webp");
  if (!isOutputFormat(formatValue)) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.INVALID_FORMAT,
      "Choose WebP, JPEG, PNG, or AVIF.",
    );
  }

  const quality = parseInteger(formData.get("quality"), DEFAULT_QUALITY);
  if (quality == null || quality < MIN_QUALITY || quality > MAX_QUALITY) {
    throw new OptimizerError(
      OPTIMIZER_ERROR_CODES.INVALID_QUALITY,
      `Quality must be between ${MIN_QUALITY} and ${MAX_QUALITY}.`,
    );
  }

  return {
    buffer,
    originalBytes: file.size,
    originalName: file.name,
    width,
    quality,
    format: formatValue,
  };
}
