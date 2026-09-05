import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Image Tools",
  description: "Resize and crop images in the browser. Fast, private, production-grade tools.",
};

const TOOLS = [
  {
    href: "/image-optimizer",
    label: "Resize",
    title: "Image optimizer",
    body: "Set an exact width. Get a compressed image back at that size.",
  },
  {
    href: "/image-cropper",
    label: "Crop",
    title: "Image cropper",
    body: "Drag a frame over the photo. Keep only the part you want.",
  },
  {
    href: "/ai-bots",
    label: "Bots",
    title: "AI bots",
    body: "Six mascot variants — Vio, Nova, Pulse, Pip, Mochi, and Bean.",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-800 dark:text-teal-300">
          Image tools
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
          Resize and crop, on separate pages.
        </h1>
        <p className="text-base leading-7 text-stone-600 dark:text-zinc-400">
          Pick a tool. Your image stays on this machine until you choose to process it.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-teal-700/40 hover:shadow-[0_20px_50px_-28px_rgba(28,25,23,0.35)] dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-800 dark:text-teal-300">
              {tool.label}
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-zinc-400">{tool.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
