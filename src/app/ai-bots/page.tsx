import type { Metadata } from "next";
import Image from "next/image";
import { AiBots } from "@/components/ai-bot/ai-bots";
import { GlowBot } from "@/components/ai-bot/glow-bot";

export const metadata: Metadata = {
  title: "AI Bots",
  description: "3D glow mascot plus colorful AI bot variants.",
};

export default function AiBotsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-4 py-12 sm:px-6 lg:py-16">
      <header className="max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-800 dark:text-teal-300">
          Mascots
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
          Glow bot + colorful crew.
        </h1>
        <p className="text-base leading-7 text-stone-600 dark:text-zinc-400">
          A glossy 3D-style screen bot, plus six colorful character variants.
        </p>
      </header>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
            Glow
          </h2>
          <p className="text-sm text-stone-600 dark:text-zinc-400">
            Animated SVG recreation of the white glossy mascot — floating hands, scanline face, soft 3D shading.
          </p>
        </div>

        <div className="grid items-center gap-8 sm:grid-cols-2">
          <figure className="flex flex-col items-center gap-3">
            <GlowBot size={260} />
            <figcaption className="text-sm text-stone-500 dark:text-zinc-400">
              SVG · animated
            </figcaption>
          </figure>

          <figure className="flex flex-col items-center gap-3">
            <Image
              src="/glow-bot.png"
              alt="Original glow bot 3D render"
              width={280}
              height={280}
              className="h-auto w-[260px]"
              priority
            />
            <figcaption className="text-sm text-stone-500 dark:text-zinc-400">
              Original PNG · exact render
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
            Color crew
          </h2>
          <p className="text-sm text-stone-600 dark:text-zinc-400">
            Vio, Nova, Pulse, Pip, Mochi, and Bean.
          </p>
        </div>
        <AiBots />
      </section>
    </main>
  );
}
