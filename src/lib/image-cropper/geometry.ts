import { MIN_CROP_PX } from "@/lib/image-cropper/constants";
import type { CropHandle, PixelCrop } from "@/lib/image-cropper/types";

export function clampPixelCrop(
  crop: PixelCrop,
  imageWidth: number,
  imageHeight: number,
  minSize = MIN_CROP_PX,
): PixelCrop {
  const maxWidth = Math.max(minSize, imageWidth);
  const maxHeight = Math.max(minSize, imageHeight);
  const min = Math.min(minSize, maxWidth, maxHeight);

  let width = Math.round(Math.min(Math.max(crop.width, min), maxWidth));
  let height = Math.round(Math.min(Math.max(crop.height, min), maxHeight));
  let left = Math.round(crop.left);
  let top = Math.round(crop.top);

  left = Math.min(Math.max(0, left), imageWidth - width);
  top = Math.min(Math.max(0, top), imageHeight - height);
  width = Math.min(width, imageWidth - left);
  height = Math.min(height, imageHeight - top);

  return { left, top, width, height };
}

export function createCenteredCrop(
  imageWidth: number,
  imageHeight: number,
  aspect: number | null,
  coverage = 0.8,
): PixelCrop {
  const min = Math.min(MIN_CROP_PX, imageWidth, imageHeight);

  if (aspect == null) {
    const width = Math.max(min, Math.round(imageWidth * coverage));
    const height = Math.max(min, Math.round(imageHeight * coverage));
    return clampPixelCrop(
      {
        left: (imageWidth - width) / 2,
        top: (imageHeight - height) / 2,
        width,
        height,
      },
      imageWidth,
      imageHeight,
      min,
    );
  }

  const imageAspect = imageWidth / imageHeight;
  let width: number;
  let height: number;

  if (imageAspect > aspect) {
    height = Math.max(min, Math.round(imageHeight * coverage));
    width = Math.max(min, Math.round(height * aspect));
  } else {
    width = Math.max(min, Math.round(imageWidth * coverage));
    height = Math.max(min, Math.round(width / aspect));
  }

  if (width > imageWidth) {
    width = imageWidth;
    height = Math.max(min, Math.round(width / aspect));
  }

  if (height > imageHeight) {
    height = imageHeight;
    width = Math.max(min, Math.round(height * aspect));
  }

  return clampPixelCrop(
    {
      left: (imageWidth - width) / 2,
      top: (imageHeight - height) / 2,
      width,
      height,
    },
    imageWidth,
    imageHeight,
    min,
  );
}

export function moveCrop(
  origin: PixelCrop,
  dx: number,
  dy: number,
  imageWidth: number,
  imageHeight: number,
): PixelCrop {
  return clampPixelCrop(
    {
      ...origin,
      left: origin.left + dx,
      top: origin.top + dy,
    },
    imageWidth,
    imageHeight,
  );
}

function fitSizeToAspect(
  width: number,
  height: number,
  aspect: number,
  prefer: "width" | "height",
): { width: number; height: number } {
  if (prefer === "width") {
    return { width, height: width / aspect };
  }

  return { height, width: height * aspect };
}

export function resizeCrop(
  origin: PixelCrop,
  handle: CropHandle,
  dx: number,
  dy: number,
  imageWidth: number,
  imageHeight: number,
  aspect: number | null,
): PixelCrop {
  const min = Math.min(MIN_CROP_PX, imageWidth, imageHeight);
  const east = handle === "e" || handle === "ne" || handle === "se";
  const west = handle === "w" || handle === "nw" || handle === "sw";
  const north = handle === "n" || handle === "ne" || handle === "nw";
  const south = handle === "s" || handle === "se" || handle === "sw";

  let left = origin.left;
  let top = origin.top;
  let width = origin.width;
  let height = origin.height;

  if (east) {
    width = origin.width + dx;
  }
  if (west) {
    left = origin.left + dx;
    width = origin.width - dx;
  }
  if (south) {
    height = origin.height + dy;
  }
  if (north) {
    top = origin.top + dy;
    height = origin.height - dy;
  }

  if (width < min) {
    if (west) {
      left = origin.left + origin.width - min;
    }
    width = min;
  }

  if (height < min) {
    if (north) {
      top = origin.top + origin.height - min;
    }
    height = min;
  }

  if (aspect) {
    const preferWidth = east || west || Math.abs(dx) >= Math.abs(dy);
    const fitted = fitSizeToAspect(width, height, aspect, preferWidth ? "width" : "height");
    width = fitted.width;
    height = fitted.height;

    if (west) {
      left = origin.left + origin.width - width;
    }
    if (north) {
      top = origin.top + origin.height - height;
    }
    if (!north && !south) {
      top = origin.top + (origin.height - height) / 2;
    }
    if (!east && !west) {
      left = origin.left + (origin.width - width) / 2;
    }

    if (left < 0) {
      width += left;
      left = 0;
      height = width / aspect;
    }
    if (top < 0) {
      height += top;
      top = 0;
      width = height * aspect;
    }
    if (left + width > imageWidth) {
      width = imageWidth - left;
      height = width / aspect;
    }
    if (top + height > imageHeight) {
      height = imageHeight - top;
      width = height * aspect;
    }
  }

  return clampPixelCrop({ left, top, width, height }, imageWidth, imageHeight, min);
}

export function cropToPercent(crop: PixelCrop, imageWidth: number, imageHeight: number) {
  return {
    left: (crop.left / imageWidth) * 100,
    top: (crop.top / imageHeight) * 100,
    width: (crop.width / imageWidth) * 100,
    height: (crop.height / imageHeight) * 100,
  };
}

export function containedFrame(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
) {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { width: 0, height: 0 };
  }

  const scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
  };
}
