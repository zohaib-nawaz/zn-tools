"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  containedFrame,
  cropToPercent,
  moveCrop,
  resizeCrop,
} from "@/lib/image-cropper/geometry";
import type { CropHandle, PixelCrop } from "@/lib/image-cropper/types";

type CropStageProps = {
  src: string;
  imageWidth: number;
  imageHeight: number;
  crop: PixelCrop;
  aspect: number | null;
  disabled?: boolean;
  onCropChange: (crop: PixelCrop) => void;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  origin: PixelCrop;
  mode: "move" | CropHandle;
};

const HANDLES: CropHandle[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const HANDLE_CLASS: Record<CropHandle, string> = {
  n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
  ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize",
  e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize",
  s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize",
  sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize",
  w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
  nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize",
};

export function CropStage({
  src,
  imageWidth,
  imageHeight,
  crop,
  aspect,
  disabled = false,
  onCropChange,
}: CropStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [frame, setFrame] = useState({ width: 0, height: 0 });

  const updateFrame = useCallback(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    setFrame(containedFrame(imageWidth, imageHeight, rect.width, rect.height));
  }, [imageHeight, imageWidth]);

  useEffect(() => {
    updateFrame();
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateFrame();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [updateFrame]);

  const applyDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      if (!drag || frame.width === 0 || frame.height === 0) {
        return;
      }

      const dx = ((clientX - drag.startX) * imageWidth) / frame.width;
      const dy = ((clientY - drag.startY) * imageHeight) / frame.height;

      if (drag.mode === "move") {
        onCropChange(moveCrop(drag.origin, dx, dy, imageWidth, imageHeight));
        return;
      }

      onCropChange(
        resizeCrop(drag.origin, drag.mode, dx, dy, imageWidth, imageHeight, aspect),
      );
    },
    [aspect, frame.height, frame.width, imageHeight, imageWidth, onCropChange],
  );

  function startDrag(mode: DragState["mode"], event: React.PointerEvent<HTMLElement>) {
    if (disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: crop,
      mode,
    };
  }

  useEffect(() => {
    function onMove(event: PointerEvent) {
      if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      applyDrag(event.clientX, event.clientY);
    }

    function onUp(event: PointerEvent) {
      if (dragRef.current?.pointerId === event.pointerId) {
        dragRef.current = null;
      }
    }

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [applyDrag]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    const step = event.shiftKey ? 10 : 1;
    let next: PixelCrop | null = null;

    if (event.key === "ArrowLeft") {
      next = moveCrop(crop, -step, 0, imageWidth, imageHeight);
    } else if (event.key === "ArrowRight") {
      next = moveCrop(crop, step, 0, imageWidth, imageHeight);
    } else if (event.key === "ArrowUp") {
      next = moveCrop(crop, 0, -step, imageWidth, imageHeight);
    } else if (event.key === "ArrowDown") {
      next = moveCrop(crop, 0, step, imageWidth, imageHeight);
    }

    if (!next) {
      return;
    }

    event.preventDefault();
    onCropChange(next);
  }

  const percent = cropToPercent(crop, imageWidth, imageHeight);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[min(70vh,640px)] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-950"
    >
      {frame.width > 0 ? (
        <div
          className="relative touch-none"
          style={{ width: frame.width, height: frame.height }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Image to crop"
            draggable={false}
            onLoad={updateFrame}
            className="h-full w-full select-none object-contain"
          />
          <div
            className="absolute inset-0 outline-none"
            tabIndex={disabled ? -1 : 0}
            role="group"
            aria-label="Crop area. Drag to move, use handles to resize, arrow keys to nudge."
            onKeyDown={handleKeyDown}
          >
            <div
              className="absolute cursor-move"
              style={{
                left: `${percent.left}%`,
                top: `${percent.top}%`,
                width: `${percent.width}%`,
                height: `${percent.height}%`,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
              }}
              onPointerDown={(event) => startDrag("move", event)}
            >
              <div className="absolute inset-0 border border-white/90" />
              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span key={index} className="border border-white/25" />
                ))}
              </div>
              {HANDLES.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  aria-label={`Resize crop ${handle}`}
                  disabled={disabled}
                  className={`absolute size-4 rounded-sm border border-teal-900 bg-white shadow ${HANDLE_CLASS[handle]}`}
                  onPointerDown={(event) => startDrag(handle, event)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
