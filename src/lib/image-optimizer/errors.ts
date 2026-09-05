export const OPTIMIZER_ERROR_CODES = {
  MISSING_FILE: "MISSING_FILE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_TYPE: "UNSUPPORTED_TYPE",
  INVALID_IMAGE: "INVALID_IMAGE",
  INVALID_WIDTH: "INVALID_WIDTH",
  INVALID_FORMAT: "INVALID_FORMAT",
  INVALID_QUALITY: "INVALID_QUALITY",
  OPTIMIZE_FAILED: "OPTIMIZE_FAILED",
} as const;

export type OptimizerErrorCode =
  (typeof OPTIMIZER_ERROR_CODES)[keyof typeof OPTIMIZER_ERROR_CODES];

export class OptimizerError extends Error {
  readonly code: OptimizerErrorCode;
  readonly status: number;

  constructor(code: OptimizerErrorCode, message: string, status = 400) {
    super(message);
    this.name = "OptimizerError";
    this.code = code;
    this.status = status;
  }
}
