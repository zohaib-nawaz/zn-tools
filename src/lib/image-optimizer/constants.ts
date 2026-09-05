export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const MAX_INPUT_PIXELS = 50_000_000;
export const MIN_TARGET_WIDTH = 16;
export const MAX_TARGET_WIDTH = 8192;
export const MIN_QUALITY = 1;
export const MAX_QUALITY = 100;
export const DEFAULT_QUALITY = 80;

export const OUTPUT_FORMATS = ["webp", "jpeg", "png", "avif"] as const;

export const SIZE_PRESETS = [
  { label: "640px", width: 640 },
  { label: "1280px", width: 1280 },
  { label: "1920px", width: 1920 },
] as const;

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
] as const;

export const CONTENT_TYPES = {
  webp: "image/webp",
  jpeg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
} as const;

export const FILE_EXTENSIONS = {
  webp: "webp",
  jpeg: "jpg",
  png: "png",
  avif: "avif",
} as const;
