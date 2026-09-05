export const MIN_CROP_PX = 16;

export const ASPECT_RATIOS = [
  { id: "free", label: "Free", value: null },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:5", label: "4:5", value: 4 / 5 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
] as const;

export type AspectRatioId = (typeof ASPECT_RATIOS)[number]["id"];
export type AspectValue = number | null;
