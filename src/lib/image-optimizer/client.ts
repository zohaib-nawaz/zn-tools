import {
  ALLOWED_MIME_TYPES,
  MAX_TARGET_WIDTH,
  MAX_UPLOAD_BYTES,
  MIN_TARGET_WIDTH,
} from "@/lib/image-optimizer/constants";
import type { OptimizeApiError } from "@/lib/image-optimizer/types";

export type SourceImage = {
  file: File;
  width: number;
  height: number;
};

export type OptimizedImage = {
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
  filename: string;
};

function isAllowedFile(file: File): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(file.type);
}

export function validateSelectedFile(file: File): string | null {
  if (!isAllowedFile(file)) {
    return "Use a JPEG, PNG, WebP, AVIF, GIF, or TIFF image.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "Image is larger than 20MB.";
  }

  return null;
}

export function validateTargetWidth(value: string): string | null {
  if (value.trim() === "") {
    return "Enter the width you want.";
  }

  const width = Number(value);
  if (!Number.isInteger(width)) {
    return "Width must be a whole number.";
  }

  if (width < MIN_TARGET_WIDTH || width > MAX_TARGET_WIDTH) {
    return `Width must be between ${MIN_TARGET_WIDTH} and ${MAX_TARGET_WIDTH} pixels.`;
  }

  return null;
}

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };

    image.src = url;
  });
}

function headerNumber(headers: Headers, name: string): number {
  const value = Number(headers.get(name));
  return Number.isFinite(value) ? value : 0;
}

export async function optimizeImageRequest(input: {
  file: File;
  width: number;
  format: string;
  quality: number;
  signal?: AbortSignal;
}): Promise<OptimizedImage> {
  const formData = new FormData();
  formData.append("file", input.file);
  formData.append("width", String(input.width));
  formData.append("format", input.format);
  formData.append("quality", String(input.quality));

  const response = await fetch("/api/optimize", {
    method: "POST",
    body: formData,
    signal: input.signal,
  });

  if (!response.ok) {
    let message = "Could not optimize this image.";

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
    filename: response.headers.get("X-Output-Filename") ?? "optimized-image.webp",
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
