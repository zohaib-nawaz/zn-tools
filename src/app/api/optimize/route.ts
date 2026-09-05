import { NextResponse } from "next/server";
import { OptimizerError } from "@/lib/image-optimizer/errors";
import { optimizeImage } from "@/lib/image-optimizer/optimize-image";
import { parseOptimizeRequest } from "@/lib/image-optimizer/validate-request";

export const runtime = "nodejs";
export const maxDuration = 60;

function jsonError(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return jsonError("Send the image as multipart form data.", "INVALID_FORMAT", 415);
  }

  try {
    const formData = await request.formData();
    const input = await parseOptimizeRequest(formData);
    const result = await optimizeImage(input);
    const filename = `optimized-${result.width}w.${result.extension}`;

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Image-Width": String(result.width),
        "X-Image-Height": String(result.height),
        "X-Image-Bytes": String(result.bytes),
        "X-Original-Width": String(result.originalWidth),
        "X-Original-Height": String(result.originalHeight),
        "X-Original-Bytes": String(result.originalBytes),
        "X-Output-Filename": filename,
      },
    });
  } catch (error) {
    if (error instanceof OptimizerError) {
      return jsonError(error.message, error.code, error.status);
    }

    console.error("Image optimize failed:", error);
    return jsonError("Could not optimize this image.", "OPTIMIZE_FAILED", 500);
  }
}
