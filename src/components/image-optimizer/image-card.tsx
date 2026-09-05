import { formatBytes } from "@/lib/image-optimizer/format-bytes";

type ImageCardProps = {
  title: string;
  src: string;
  width: number;
  height: number;
  bytes: number;
  alt: string;
};

export function ImageCard({ title, src, width, height, bytes, alt }: ImageCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 dark:border-zinc-800">
        <h3 className="text-sm font-medium text-stone-800 dark:text-zinc-100">{title}</h3>
        <p className="text-xs tabular-nums text-stone-500">
          {width} × {height} · {formatBytes(bytes)}
        </p>
      </div>
      <div className="flex min-h-56 items-center justify-center bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-4 dark:bg-zinc-950">
        {/* Object URLs and API blobs are not known to next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-80 w-auto max-w-full rounded-lg object-contain shadow-sm"
        />
      </div>
    </article>
  );
}
