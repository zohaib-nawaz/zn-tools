import type { Metadata } from "next";
import { ImageOptimizer } from "@/components/image-optimizer/image-optimizer";

export const metadata: Metadata = {
  title: "Image Optimizer",
  description:
    "Resize and compress any image to an exact target width. Choose a photo, enter a size, and download the optimized result.",
};

export default function ImageOptimizerPage() {
  return <ImageOptimizer />;
}
