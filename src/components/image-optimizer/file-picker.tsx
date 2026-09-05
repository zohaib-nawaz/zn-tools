"use client";

import { useId, useRef } from "react";
import { ImagePlusIcon } from "@/components/image-optimizer/icons";

type FilePickerProps = {
  disabled?: boolean;
  title?: string;
  onFile: (file: File) => void;
};

export function FilePicker({
  disabled = false,
  title = "Choose an image",
  onFile,
}: FilePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }
    event.target.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-stone-300 bg-white/70 px-6 py-14 text-center shadow-[0_20px_50px_-28px_rgba(28,25,23,0.35)] dark:border-zinc-700 dark:bg-zinc-900/60">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
        <ImagePlusIcon className="size-7" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-medium tracking-tight text-stone-900 dark:text-zinc-50">
          {title}
        </p>
        <p className="text-sm text-stone-500 dark:text-zinc-400">
          JPEG, PNG, WebP, AVIF, GIF, or TIFF up to 20MB
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
      >
        Select image
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
