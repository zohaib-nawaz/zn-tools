"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ImageOptimizerError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Image optimizer page error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-start justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
        Something went wrong
      </h1>
      <p className="text-sm leading-6 text-stone-600 dark:text-zinc-400">
        The optimizer could not load. Try again, or refresh the page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-11 items-center rounded-full bg-stone-900 px-5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
      >
        Try again
      </button>
    </main>
  );
}
