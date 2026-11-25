"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArenasSculptureSection } from "./arenas-sculpture-section"
import { AudienceSection } from "./audience-section"
import { ContactSection } from "./contact-section"
import { FooterSection } from "./footer-section"
import { HeroSection } from "./hero-section"
import { ManifestoSection } from "./manifesto-section"
import { CookieBanner, EarlyAccessModal, FounderPreviewModal } from "./modals"
import { PreflopNavbar } from "./navbar"
import { OnboardingModal } from "./onboarding-modal"
import { PlatformsSection } from "./platforms-section"
import { usePreflop } from "./store"
import { WhyPreflopSection } from "./why-preflop-section"
import type { EarlyAccessRole, MarketPick } from "./data"

export function PreflopLandingPage() {
  const router = useRouter()
  const { openOnboarding } = usePreflop()

  const [earlyAccessOpen, setEarlyAccessOpen] = React.useState(false)
  const [earlyAccessRole, setEarlyAccessRole] =
    React.useState<EarlyAccessRole>("back")
  const [selectedPick, setSelectedPick] = React.useState<MarketPick | null>(
    null
  )
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [previewTab, setPreviewTab] = React.useState<"preview" | "letter">(
    "preview"
  )

  const handleOpenGetStarted = React.useCallback(
    (defaultRole: EarlyAccessRole = "back") => {
      openOnboarding(defaultRole)
    },
    [openOnboarding]
  )

  const handleSelectPick = React.useCallback(
    (pick: MarketPick) => {
      if (pick.personSlug) {
        const params = new URLSearchParams()
        if (pick.milestoneId) params.set("milestone", pick.milestoneId)
        params.set("side", pick.side)
        router.push(`/person/${pick.personSlug}?${params.toString()}`)
        return
      }
      setSelectedPick(pick)
      setEarlyAccessRole("back")
      setEarlyAccessOpen(true)
    },
    [router]
  )

  const handleOpenPreview = React.useCallback(
    (tab: "preview" | "letter" = "preview") => {
      setPreviewTab(tab)
      setPreviewOpen(true)
    },
    []
  )

  return (
    <div className="min-h-screen bg-white text-black">
      <PreflopNavbar
        onOpenGetStarted={handleOpenGetStarted}
        onOpenFounderLetter={handleOpenPreview}
      />

      <main>
        <HeroSection onOpenPreview={handleOpenPreview} />
        <ManifestoSection />
        <WhyPreflopSection onOpenEarlyAccess={handleOpenGetStarted} />
        <ArenasSculptureSection />
        <PlatformsSection onSelectPick={handleSelectPick} />
        <AudienceSection
          onOpenEarlyAccess={handleOpenGetStarted}
          onOpenFounderLetter={handleOpenPreview}
        />
        <ContactSection />
      </main>

      <FooterSection
        onOpenEarlyAccess={handleOpenGetStarted}
        onOpenFounderLetter={handleOpenPreview}
      />

      <OnboardingModal />
      <EarlyAccessModal
        open={earlyAccessOpen}
        onOpenChange={setEarlyAccessOpen}
        defaultRole={earlyAccessRole}
        selectedPick={selectedPick}
      />
      <FounderPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        initialTab={previewTab}
        onOpenEarlyAccess={handleOpenGetStarted}
      />
      <CookieBanner />
    </div>
  )
}
