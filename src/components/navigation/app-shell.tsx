import type { ReactNode } from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileNav />
    </div>
  )
}
