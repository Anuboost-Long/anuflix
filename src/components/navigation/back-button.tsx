"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/icon";

export function BackButton({
  fallbackHref,
  label
}: Readonly<{ fallbackHref: string; label: string }>) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={clsx(
        "inline-flex h-11 items-center gap-2 rounded-full",
        "bg-black/35 backdrop-blur-sm",
        "border border-white/10",
        "text-sm font-medium text-white",
        "px-4",
        "transition-colors hover:bg-black/60"
      )}
    >
      <Icon name="arrow-left" className={clsx("size-5")} />
      {label}
    </button>
  );
}
