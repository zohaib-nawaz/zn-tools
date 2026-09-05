"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Tools" },
  { href: "/image-optimizer", label: "Resize" },
  { href: "/image-cropper", label: "Crop" },
  { href: "/ai-bots", label: "Bots" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-stone-200/80 bg-background/80 backdrop-blur-md dark:border-zinc-800">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-stone-900 dark:text-zinc-50">
          Image tools
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-stone-600 hover:bg-stone-200/70 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
