import type { OutputFormat } from "@/lib/image-optimizer/types";

export type PixelCrop = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type CropHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

export type CropRequest = {
  buffer: Buffer;
  originalBytes: number;
  originalName: string;
  crop: PixelCrop;
  quality: number;
  format: OutputFormat;
};

export type CropResult = {
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
