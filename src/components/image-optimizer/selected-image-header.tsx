"use client";

import { useId, useRef } from "react";
import { formatBytes } from "@/lib/image-optimizer/format-bytes";
import type { SourceImage } from "@/lib/image-optimizer/client";

type SelectedImageHeaderProps = {
  image: SourceImage;
  previewUrl: string;
  disabled?: boolean;
  onReplace: (file: File) => void;
};

export function SelectedImageHeader({
  image,
  previewUrl,
  disabled = false,
  onReplace,
}: SelectedImageHeaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onReplace(file);
    }
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt="Selected original"
        className="h-20 w-20 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-stone-900 dark:text-zinc-50">{image.file.name}</p>
        <p className="mt-1 text-sm text-stone-500 dark:text-zinc-400">
          {image.width} × {image.height} · {formatBytes(image.file.size)}
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-10 items-center justify-center rounded-full border border-stone-200 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Change image
      </button>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/tiff"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
}
