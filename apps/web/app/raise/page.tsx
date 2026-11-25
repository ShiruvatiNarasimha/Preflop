import type { Metadata } from "next"
import { AppShell } from "@/components/preflop/app-shell"
import { RaiseStudio } from "@/components/preflop/raise-studio"

export const metadata: Metadata = {
  title: "Raise & Direct List | Preflop",
  description:
    "Model a finite Covenant raise or preview Direct Listing eligibility for perpetual Trajectory Units on Preflop.",
}

export default function RaisePage() {
  return (
    <AppShell>
      <RaiseStudio />
    </AppShell>
  )
}
