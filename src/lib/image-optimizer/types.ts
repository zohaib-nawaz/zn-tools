import type { OUTPUT_FORMATS } from "@/lib/image-optimizer/constants";

export type OutputFormat = (typeof OUTPUT_FORMATS)[number];

export type OptimizeRequest = {
  buffer: Buffer;
  originalBytes: number;
  originalName: string;
  width: number;
  quality: number;
  format: OutputFormat;
};

export type OptimizeResult = {
  buffer: Buffer;
  contentType: string;
  extension: string;
  width: number;
  height: number;
  bytes: number;
  originalWidth: number;
  originalHeight: number;
  originalBytes: number;
};

export type OptimizeApiError = {
  error: string;
  code: string;
};
