import type { Metadata } from "next";
import { ImageCropper } from "@/components/image-cropper/image-cropper";

export const metadata: Metadata = {
  title: "Image Cropper",
  description:
    "Crop any image with drag handles and aspect-ratio presets. Download the exact frame you choose.",
};

export default function ImageCropperPage() {
  return <ImageCropper />;
}
