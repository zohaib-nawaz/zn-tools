"use client";

import { SIZE_PRESETS } from "@/lib/image-optimizer/constants";
import type { OutputFormat } from "@/lib/image-optimizer/types";
import { SpinnerIcon } from "@/components/image-optimizer/icons";

type OptimizeFormProps = {
  width: string;
  originalWidth: number;
  format: OutputFormat;
  quality: number;
  isPending: boolean;
  onWidthChange: (value: string) => void;
  onFormatChange: (format: OutputFormat) => void;
  onQualityChange: (quality: number) => void;
  onSubmit: () => void;
};

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "avif", label: "AVIF" },
];

export function OptimizeForm({
  width,
  originalWidth,
  format,
  quality,
  isPending,
  onWidthChange,
  onFormatChange,
  onQualityChange,
  onSubmit,
}: OptimizeFormProps) {
  const parsedWidth = Number(width);
  const showQuality = format !== "png";
  const submitLabel =
    Number.isInteger(parsedWidth) && parsedWidth > 0
      ? `Resize to ${parsedWidth}px`
      : "Resize image";

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <label htmlFor="target-width" className="text-sm font-medium text-stone-800 dark:text-zinc-200">
          How wide should it be?
        </label>
        <div className="relative">
          <input
            id="target-width"
            type="number"
            inputMode="numeric"
            min={16}
            max={8192}
            step={1}
            value={width}
            onChange={(event) => onWidthChange(event.target.value)}
            placeholder={`Original is ${originalWidth}px`}
            className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 pr-12 text-base text-stone-900 outline-none ring-teal-700/30 transition placeholder:text-stone-400 focus:border-teal-700 focus:ring-4 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-stone-400">
            px
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {SIZE_PRESETS.map((preset) => {
            const selected = parsedWidth === preset.width;
            return (
              <button
                key={preset.width}
                type="button"
                onClick={() => onWidthChange(String(preset.width))}
                className={`h-8 rounded-full border px-3 text-xs font-medium transition ${
                  selected
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => onWidthChange(String(originalWidth))}
            className={`h-8 rounded-full border px-3 text-xs font-medium transition ${
              parsedWidth === originalWidth
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
            }`}
          >
            Original ({originalWidth}px)
          </button>
        </div>
        <p className="text-xs text-stone-500 dark:text-zinc-400">
          Height follows automatically so the image is not stretched.
        </p>
      </div>

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
            <label htmlFor="output-format" className="text-sm font-medium text-stone-800 dark:text-zinc-200">
              Format
            </label>
            <select
              id="output-format"
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
                <label htmlFor="output-quality" className="text-sm font-medium text-stone-800 dark:text-zinc-200">
                  Quality
                </label>
                <span className="text-sm tabular-nums text-stone-500">{quality}</span>
              </div>
              <input
                id="output-quality"
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(event) => onQualityChange(Number(event.target.value))}
                className="h-11 w-full accent-teal-700"
              />
            </div>
          ) : (
            <p className="self-end text-sm text-stone-500 dark:text-zinc-400">
              PNG stays lossless.
            </p>
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
            Resizing…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
