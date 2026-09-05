"use client";

import { useEffect, useRef, useState } from "react";
import { CropForm } from "@/components/image-cropper/crop-form";
import { CropStage } from "@/components/image-cropper/crop-stage";
import { FilePicker } from "@/components/image-optimizer/file-picker";
import { ImageCard } from "@/components/image-optimizer/image-card";
import { SelectedImageHeader } from "@/components/image-optimizer/selected-image-header";
import { DownloadIcon } from "@/components/image-optimizer/icons";
import { useObjectUrl } from "@/hooks/use-object-url";
import {
  downloadBlob,
  readImageDimensions,
  validateSelectedFile,
  type SourceImage,
} from "@/lib/image-optimizer/client";
import { DEFAULT_QUALITY } from "@/lib/image-optimizer/constants";
import { formatBytes } from "@/lib/image-optimizer/format-bytes";
import type { OutputFormat } from "@/lib/image-optimizer/types";
import { ASPECT_RATIOS, type AspectRatioId } from "@/lib/image-cropper/constants";
import {
  cropImageRequest,
  validatePixelCrop,
  type CroppedImage,
} from "@/lib/image-cropper/client";
import { createCenteredCrop } from "@/lib/image-cropper/geometry";
import type { PixelCrop } from "@/lib/image-cropper/types";

function aspectValue(id: AspectRatioId): number | null {
  return ASPECT_RATIOS.find((item) => item.id === id)?.value ?? null;
}

export function ImageCropper() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [crop, setCrop] = useState<PixelCrop | null>(null);
  const [result, setResult] = useState<CroppedImage | null>(null);
  const [aspectId, setAspectId] = useState<AspectRatioId>("free");
  const [format, setFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sourceUrl = useObjectUrl(source?.file ?? null);
  const resultUrl = useObjectUrl(result?.blob ?? null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function handleFile(file: File) {
    abortRef.current?.abort();
    setIsPending(false);
    setError(null);
    setResult(null);

    const fileError = validateSelectedFile(file);
    if (fileError) {
      setSource(null);
      setCrop(null);
      setError(fileError);
      return;
    }

    try {
      const dimensions = await readImageDimensions(file);
      setSource({ file, ...dimensions });
      setAspectId("free");
      setCrop(createCenteredCrop(dimensions.width, dimensions.height, null));
    } catch {
      setSource(null);
      setCrop(null);
      setError("Could not read this image. Try another file.");
    }
  }

  function handleAspectChange(id: AspectRatioId) {
    setAspectId(id);
    if (!source) {
      return;
    }

    setCrop(createCenteredCrop(source.width, source.height, aspectValue(id)));
  }

  async function handleCrop() {
    if (!source || !crop || isPending) {
      return;
    }

    const cropError = validatePixelCrop(crop, source.width, source.height);
    if (cropError) {
      setError(cropError);
      return;
    }

    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsPending(true);

    try {
      const cropped = await cropImageRequest({
        file: source.file,
        crop,
        format,
        quality,
        signal: controller.signal,
      });
      setResult(cropped);
    } catch (cropRequestError) {
      if (controller.signal.aborted) {
        return;
      }

      const message =
        cropRequestError instanceof Error
          ? cropRequestError.message
          : "Could not crop this image.";
      setResult(null);
      setError(message);
    } finally {
      if (!controller.signal.aborted) {
        setIsPending(false);
      }
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-16">
      <header className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-800 dark:text-teal-300">
          Image cropper
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
          Drag the box. Keep only what you need.
        </h1>
        <p className="text-base leading-7 text-stone-600 dark:text-zinc-400">
          Choose a photo, frame the crop, then download. Aspect ratio is optional.
        </p>
      </header>

      {error && !source ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
        >
          {error}
        </p>
      ) : null}

      {!source || !crop || !sourceUrl ? (
        <FilePicker disabled={isPending} title="Choose an image to crop" onFile={handleFile} />
      ) : (
        <section className="space-y-6">
          <SelectedImageHeader
            image={source}
            previewUrl={sourceUrl}
            disabled={isPending}
            onReplace={handleFile}
          />

          <CropStage
            src={sourceUrl}
            imageWidth={source.width}
            imageHeight={source.height}
            crop={crop}
            aspect={aspectValue(aspectId)}
            disabled={isPending}
            onCropChange={setCrop}
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <CropForm
                crop={crop}
                aspectId={aspectId}
                format={format}
                quality={quality}
                isPending={isPending}
                onAspectChange={handleAspectChange}
                onFormatChange={setFormat}
                onQualityChange={setQuality}
                onSubmit={handleCrop}
              />
            </div>

            <aside className="space-y-4">
              {error ? (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
                >
                  {error}
                </p>
              ) : null}

              {result && resultUrl ? (
                <div className="space-y-3">
                  <ImageCard
                    title="Cropped"
                    src={resultUrl}
                    width={result.width}
                    height={result.height}
                    bytes={result.bytes}
                    alt="Cropped image"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-sm text-stone-600 dark:text-zinc-300">
                      {result.width} × {result.height} · {formatBytes(result.bytes)}
                    </p>
                    <button
                      type="button"
                      onClick={() => downloadBlob(result.blob, result.filename)}
                      className="inline-flex h-10 items-center gap-2 rounded-full bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-800 dark:bg-zinc-100 dark:text-zinc-950"
                    >
                      <DownloadIcon className="size-4" />
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500 dark:border-zinc-700 dark:text-zinc-400">
                  Cropped image will appear here.
                </p>
              )}
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
