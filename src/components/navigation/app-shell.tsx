"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const previousPath = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      pathname.startsWith("/watch/") &&
      previousPath.current &&
      !previousPath.current.startsWith("/watch/")
    ) {
      window.history.replaceState(
        { ...window.history.state, anuflixPlayerReturnPath: previousPath.current },
        "",
        window.location.href
      );
    }

    previousPath.current = pathname;
  }, [pathname]);

  if (pathname.startsWith("/watch/")) {
    return <main className={clsx("min-h-dvh bg-player")}>{children}</main>;
  }

  return (
    <div className={clsx("min-h-screen bg-background text-text-primary")}>
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
