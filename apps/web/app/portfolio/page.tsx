import type { Metadata } from "next"
import { AppShell } from "@/components/preflop/app-shell"
import { PortfolioView } from "@/components/preflop/portfolio-view"

export const metadata: Metadata = {
  title: "Portfolio | Preflop",
  description:
    "Track your simulated $100,000 Preflop paper desk equity, open milestone contracts, Trajectory Unit holdings, and fill history.",
}

export default function PortfolioPage() {
  return (
    <AppShell>
      <PortfolioView />
    </AppShell>
  )
}
