import * as React from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { AppShell } from "@/components/preflop/app-shell"
import {
  PERSON_PROFILES,
  getPersonBySlug,
} from "@/components/preflop/market-catalog"
import { PersonTerminal } from "@/components/preflop/person-terminal"

export function generateStaticParams() {
  return PERSON_PROFILES.map((person) => ({ slug: person.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const person = getPersonBySlug(slug)
  if (!person) {
    return { title: "Market Not Found | Preflop" }
  }
  return {
    title: `${person.name} (${person.trajectory.ticker}) | Preflop`,
    description: `Trade ${person.name}'s five milestone markets and perpetual Trajectory Units on Preflop.`,
  }
}

export default async function PersonMarketPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const person = getPersonBySlug(slug)

  if (!person) {
    notFound()
  }

  return (
    <AppShell>
      <React.Suspense
        fallback={
          <div className="opus-container px-5 md:px-8 xl:px-0 py-16 text-[14px] text-[#808080]">
            Loading market terminal...
          </div>
        }
      >
        <PersonTerminal person={person} />
      </React.Suspense>
    </AppShell>
  )
}
