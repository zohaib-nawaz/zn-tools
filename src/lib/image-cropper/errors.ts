export const CROPPER_ERROR_CODES = {
  MISSING_FILE: "MISSING_FILE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_TYPE: "UNSUPPORTED_TYPE",
  INVALID_IMAGE: "INVALID_IMAGE",
  INVALID_CROP: "INVALID_CROP",
  INVALID_FORMAT: "INVALID_FORMAT",
  INVALID_QUALITY: "INVALID_QUALITY",
  CROP_FAILED: "CROP_FAILED",
} as const;

export type CropperErrorCode =
  (typeof CROPPER_ERROR_CODES)[keyof typeof CROPPER_ERROR_CODES];

export class CropperError extends Error {
  readonly code: CropperErrorCode;
  readonly status: number;

  constructor(code: CropperErrorCode, message: string, status = 400) {
    super(message);
    this.name = "CropperError";
    this.code = code;
    this.status = status;
  }
}
