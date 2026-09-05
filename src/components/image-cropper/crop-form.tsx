"use client";

import { ASPECT_RATIOS, type AspectRatioId } from "@/lib/image-cropper/constants";
import type { PixelCrop } from "@/lib/image-cropper/types";
import type { OutputFormat } from "@/lib/image-optimizer/types";
import { SpinnerIcon } from "@/components/image-optimizer/icons";

type CropFormProps = {
  crop: PixelCrop;
  aspectId: AspectRatioId;
  format: OutputFormat;
  quality: number;
  isPending: boolean;
  onAspectChange: (id: AspectRatioId) => void;
  onFormatChange: (format: OutputFormat) => void;
  onQualityChange: (quality: number) => void;
  onSubmit: () => void;
};

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPEG" },
  { value: "avif", label: "AVIF" },
];

export function CropForm({
  crop,
  aspectId,
  format,
  quality,
  isPending,
  onAspectChange,
  onFormatChange,
  onQualityChange,
  onSubmit,
}: CropFormProps) {
  const showQuality = format !== "png";

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-stone-800 dark:text-zinc-200">
          Aspect ratio
        </legend>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => {
            const selected = ratio.id === aspectId;
            return (
              <button
                key={ratio.id}
                type="button"
                onClick={() => onAspectChange(ratio.id)}
                className={`h-8 rounded-full border px-3 text-xs font-medium transition ${
                  selected
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }`}
              >
                {ratio.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="text-sm tabular-nums text-stone-500 dark:text-zinc-400">
        Crop {crop.width} × {crop.height}px
      </p>

      <details className="group rounded-xl border border-stone-200 bg-stone-50/80 dark:border-zinc-800 dark:bg-zinc-950/50">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-stone-700 marker:content-none [&::-webkit-details-marker]:hidden dark:text-zinc-300">
          <span className="flex items-center justify-between gap-3">
            More options
            <span className="text-xs font-normal text-stone-400">
              <span className="group-open:hidden">Format and quality</span>
              <span className="hidden group-open:inline">Hide</span>
            </span>
          </span>
        </summary>
        <div className="grid gap-5 border-t border-stone-200 px-4 py-4 sm:grid-cols-2 dark:border-zinc-800">
          <div className="space-y-2">
            <label htmlFor="crop-format" className="text-sm font-medium text-stone-800 dark:text-zinc-200">
              Format
            </label>
            <select
              id="crop-format"
              value={format}
              onChange={(event) => onFormatChange(event.target.value as OutputFormat)}
              className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-900 outline-none ring-teal-700/30 focus:border-teal-700 focus:ring-4 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showQuality ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="crop-quality" className="text-sm font-medium text-stone-800 dark:text-zinc-200">
                  Quality
                </label>
                <span className="text-sm tabular-nums text-stone-500">{quality}</span>
              </div>
              <input
                id="crop-quality"
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(event) => onQualityChange(Number(event.target.value))}
                className="h-11 w-full accent-teal-700"
              />
            </div>
          ) : (
            <p className="self-end text-sm text-stone-500 dark:text-zinc-400">PNG stays lossless.</p>
          )}
        </div>
      </details>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <>
            <SpinnerIcon className="size-4 animate-spin" />
            Cropping…
          </>
        ) : (
          `Crop to ${crop.width} × ${crop.height}`
        )}
      </button>
    </form>
  );
}
