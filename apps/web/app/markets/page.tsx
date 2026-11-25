import type { Metadata } from "next"
import { AppShell } from "@/components/preflop/app-shell"
import { MarketsView } from "@/components/preflop/markets-view"

export const metadata: Metadata = {
  title: "Live Markets | Preflop",
  description:
    "Trade simulated milestone contracts and Trajectory Units across startup founders, creators, athletes, and artists on Preflop.",
}

export default function MarketsPage() {
  return (
    <AppShell>
      <MarketsView />
    </AppShell>
  )
}
