"use client";

import { useEffect, useRef, useState } from "react";
import { FilePicker } from "@/components/image-optimizer/file-picker";
import { ImageCard } from "@/components/image-optimizer/image-card";
import { OptimizeForm } from "@/components/image-optimizer/optimize-form";
import { SelectedImageHeader } from "@/components/image-optimizer/selected-image-header";
import { DownloadIcon } from "@/components/image-optimizer/icons";
import { useObjectUrl } from "@/hooks/use-object-url";
import { DEFAULT_QUALITY } from "@/lib/image-optimizer/constants";
import {
  downloadBlob,
  optimizeImageRequest,
  readImageDimensions,
  validateSelectedFile,
  validateTargetWidth,
  type OptimizedImage,
  type SourceImage,
} from "@/lib/image-optimizer/client";
import { formatBytes, formatSavings } from "@/lib/image-optimizer/format-bytes";
import type { OutputFormat } from "@/lib/image-optimizer/types";

export function ImageOptimizer() {
  const [source, setSource] = useState<SourceImage | null>(null);
  const [result, setResult] = useState<OptimizedImage | null>(null);
  const [width, setWidth] = useState("");
  const [format, setFormat] = useState<OutputFormat>("webp");
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
      setError(fileError);
      return;
    }

    try {
      const dimensions = await readImageDimensions(file);
      setSource({ file, ...dimensions });
      setWidth("");
    } catch {
      setSource(null);
      setError("Could not read this image. Try another file.");
    }
  }

  async function handleOptimize() {
    if (!source || isPending) {
      return;
    }

    const widthError = validateTargetWidth(width);
    if (widthError) {
      setError(widthError);
      return;
    }

    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsPending(true);

    try {
      const optimized = await optimizeImageRequest({
        file: source.file,
        width: Number(width),
        format,
        quality,
        signal: controller.signal,
      });
      setResult(optimized);
    } catch (optimizeError) {
      if (controller.signal.aborted) {
        return;
      }

      const message =
        optimizeError instanceof Error
          ? optimizeError.message
          : "Could not resize this image.";
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
          Image optimizer
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
          Pick a width. Get that size back.
        </h1>
        <p className="text-base leading-7 text-stone-600 dark:text-zinc-400">
          Choose a photo, type the width you want, then resize. Format and quality stay optional.
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

      {!source ? (
        <FilePicker disabled={isPending} onFile={handleFile} />
      ) : (
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            {sourceUrl ? (
              <SelectedImageHeader
                image={source}
                previewUrl={sourceUrl}
                disabled={isPending}
                onReplace={handleFile}
              />
            ) : null}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <OptimizeForm
                width={width}
                originalWidth={source.width}
                format={format}
                quality={quality}
                isPending={isPending}
                onWidthChange={setWidth}
                onFormatChange={setFormat}
                onQualityChange={setQuality}
                onSubmit={handleOptimize}
              />
            </div>
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

            {sourceUrl ? (
              <ImageCard
                title="Original"
                src={sourceUrl}
                width={source.width}
                height={source.height}
                bytes={source.file.size}
                alt="Original selected image"
              />
            ) : null}

            {result && resultUrl ? (
              <div className="space-y-3">
                <ImageCard
                  title="Result"
                  src={resultUrl}
                  width={result.width}
                  height={result.height}
                  bytes={result.bytes}
                  alt="Resized image"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm text-stone-600 dark:text-zinc-300">
                    {formatBytes(result.originalBytes)} → {formatBytes(result.bytes)} ·{" "}
                    {formatSavings(result.originalBytes, result.bytes)}
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
                Resized image will appear here.
              </p>
            )}
          </aside>
        </section>
      )}
    </main>
  );
}
