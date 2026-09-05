import { AiBot } from "./ai-bot";
import {
  AI_BOT_VARIANTS,
  getAiBotLabel,
  type AiBotVariant,
} from "./variants";

const DESCRIPTIONS: Record<AiBotVariant, string> = {
  vio: "Rounded body, happy eyes, waving hello.",
  nova: "Soft oval build, round eyes, open arms.",
  pulse: "Angular frame, bright oval eyes, waving arm.",
  pip: "Chubby circle, heart antenna, playful wink.",
  mochi: "Squishy green, bunny ears, big shiny eyes.",
  bean: "Honey bean shape, sleepy smile, star hat.",
};

type AiBotsProps = {
  size?: number;
  animated?: boolean;
};

export function AiBots({ size = 150, animated = true }: AiBotsProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {AI_BOT_VARIANTS.map((variant) => (
        <figure
          key={variant}
          className="flex flex-col items-center gap-3 text-center"
        >
          <AiBot variant={variant} size={size} animated={animated} />
          <figcaption>
            <p className="text-base font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
              {getAiBotLabel(variant)}
            </p>
            <p className="mt-1 text-sm text-stone-600 dark:text-zinc-400">
              {DESCRIPTIONS[variant]}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
