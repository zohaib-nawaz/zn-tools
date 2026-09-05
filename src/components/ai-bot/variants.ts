export type AiBotVariant = "vio" | "nova" | "pulse" | "pip" | "mochi" | "bean";

export const AI_BOT_VARIANTS: AiBotVariant[] = [
  "vio",
  "nova",
  "pulse",
  "pip",
  "mochi",
  "bean",
];

export const AI_BOT_LABELS: Record<AiBotVariant, string> = {
  vio: "Vio",
  nova: "Nova",
  pulse: "Pulse",
  pip: "Pip",
  mochi: "Mochi",
  bean: "Bean",
};

export function getAiBotLabel(variant: AiBotVariant) {
  return AI_BOT_LABELS[variant];
}
