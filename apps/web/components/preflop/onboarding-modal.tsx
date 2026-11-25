"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { PreflopEmblem } from "./brand-marks"
import type { EarlyAccessRole } from "./data"
import { PERSON_PROFILES } from "./market-catalog"
import { usePreflop } from "./store"

const ROLES: {
  id: EarlyAccessRole
  title: string
  subtitle: string
  tag: string
  icon: typeof Compass
}[] = [
  {
    id: "back",
    title: "Back people",
    subtitle:
      "Trade Yes/No milestones and Trajectory Units with $100,000.00 in live simulated buying power.",
    tag: "Instant $100K desk",
    icon: Compass,
  },
  {
    id: "list",
    title: "List myself",
    subtitle:
      "Model a finite Covenant raise or check Direct Listing eligibility with a hard 25% cap.",
    tag: "Keep ≥75% forever",
    icon: UserCheck,
  },
  {
    id: "liquidity",
    title: "Provide liquidity",
    subtitle:
      "Inspect two-sided order books, 1¢ spreads, and market maker workflows ahead of real-money launch.",
    tag: "Order book desk",
    icon: Activity,
  },
]

export function OnboardingModal() {
  const router = useRouter()
  const {
    onboardingOpen,
    setOnboardingOpen,
    onboardingDefaultRole,
    user,
    completeOnboarding,
    getMilestoneYesCents,
  } = usePreflop()

  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [role, setRole] = React.useState<EarlyAccessRole>(onboardingDefaultRole)
  const [selectedSlugs, setSelectedSlugs] = React.useState<string[]>(
    user.watchlist.length > 0
      ? user.watchlist
      : ["brendan-foody", "mrbeast", "tanay-kothari"]
  )
  const [name, setName] = React.useState(user.name)
  const [email, setEmail] = React.useState(user.email)
  const [agreed, setAgreed] = React.useState(true)

  React.useEffect(() => {
    if (onboardingOpen) {
      setStep(1)
      setRole(onboardingDefaultRole)
      setName(user.name)
      setEmail(user.email)
      setSelectedSlugs(
        user.watchlist.length > 0
          ? user.watchlist
          : ["brendan-foody", "mrbeast", "tanay-kothari"]
      )
    }
  }, [onboardingOpen, onboardingDefaultRole, user.name, user.email, user.watchlist])

  const togglePerson = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((id) => id !== slug) : [...prev, slug]
    )
  }

  const finish = (useGuest = false) => {
    completeOnboarding({
      name: useGuest ? "Alex Rivera" : name.trim() || "Alex Rivera",
      email: useGuest ? "alex@preflop.co" : email.trim() || "alex@preflop.co",
      role,
      watchlist: selectedSlugs,
    })
    router.push(role === "list" ? "/raise" : "/markets")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    finish(false)
  }

  return (
    <Dialog open={onboardingOpen} onOpenChange={setOnboardingOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[580px] rounded-[24px] bg-white border-none p-6 sm:p-9 shadow-[0_32px_96px_rgba(0,0,0,0.22)] max-h-[92vh] overflow-y-auto"
      >
        <DialogTitle className="sr-only">Get Started with Preflop</DialogTitle>
        <DialogDescription className="sr-only">
          Set up your Preflop account, choose people you have conviction in, and
          open the live simulated desk.
        </DialogDescription>

        {/* Top Chrome & Progress Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-[8px] bg-[#fff0f5] flex items-center justify-center">
              <PreflopEmblem gradient className="h-4 w-4" />
            </div>
            <span className="text-[12.5px] font-medium text-black/55 tabular-nums">
              Step {step} of 3
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOnboardingOpen(false)}
            aria-label="Close onboarding"
            className="h-8 w-8 rounded-full hover:bg-black/[0.05] text-black/75 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 stroke-[1.6]" />
          </button>
        </div>

        {/* 3-Segment Progress Indicator */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-[3px] rounded-full bg-black/[0.08] overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  idx <= step ? "w-full bg-opus-gradient" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="mt-7">
            <h2 className="text-[26px] sm:text-[30px] font-medium leading-[1.12] tracking-[-0.03em] text-black">
              Take your seat at the table.
            </h2>
            <p className="mt-2 text-[14.5px] leading-[1.4] text-[#808080]">
              How do you want to use Preflop today? You can switch roles anytime
              inside the desk.
            </p>

            <div className="mt-6 space-y-3" role="radiogroup">
              {ROLES.map((item) => {
                const Icon = item.icon
                const active = role === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setRole(item.id)}
                    className={`w-full rounded-[16px] p-4 text-left border transition-all cursor-pointer flex items-start gap-3.5 ${
                      active
                        ? "border-[#FF4665] bg-[#fffbfc] shadow-[0_10px_28px_-14px_rgba(255,70,101,0.3)]"
                        : "border-black/[0.08] bg-white hover:border-black/25"
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-10 w-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors ${
                        active
                          ? "bg-[#fff0f5] text-[#ff4665]"
                          : "bg-[#F7F7F7] text-black/65"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[15.5px] font-medium ${
                            active ? "text-[#ff4665]" : "text-black"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F7F7F7] text-[11px] font-medium text-black/65">
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-[1.4] text-[#808080]">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setOnboardingOpen(false)
                  router.push("/markets")
                }}
                className="text-[13.5px] text-[#808080] hover:text-black transition-colors cursor-pointer"
              >
                Explore markets first
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-[40px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Watchlist Selection */}
        {step === 2 && (
          <div className="mt-7">
            <h2 className="text-[26px] sm:text-[30px] font-medium leading-[1.12] tracking-[-0.03em] text-black">
              Who do you have conviction in?
            </h2>
            <p className="mt-2 text-[14.5px] leading-[1.4] text-[#808080]">
              Follow people to pin their live milestones and Trajectory Units to
              your desk.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PERSON_PROFILES.map((person) => {
                const isSelected = selectedSlugs.includes(person.slug)
                const lead = person.milestones[0]!
                const yesCents = getMilestoneYesCents(lead.id, lead.baseYesCents)
                return (
                  <button
                    key={person.slug}
                    type="button"
                    onClick={() => togglePerson(person.slug)}
                    className={`rounded-[14px] p-3 text-left border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "border-[#FF4665] bg-[#fffbfc]"
                        : "border-black/[0.08] bg-white hover:border-black/25"
                    }`}
                  >
                    <span
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 transition-colors ${
                        isSelected
                          ? "bg-opus-gradient text-white"
                          : "bg-[#F4F4F5] text-black/75"
                      }`}
                    >
                      {person.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-black truncate">
                        {person.name}
                      </div>
                      <div className="text-[11.5px] text-[#808080] truncate">
                        {person.company} ·{" "}
                        <span className="text-[#ff4665] font-medium tabular-nums">
                          {yesCents}¢
                        </span>
                      </div>
                    </div>
                    <span
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#ff4665] border-[#ff4665] text-white"
                          : "border-black/15 text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3 stroke-[2.8]" />
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-[40px] px-4 rounded-full border border-black/12 text-[13.5px] font-medium text-black hover:border-black/35 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="h-[40px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>
                  Continue ({selectedSlugs.length || 3} selected)
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Activate Paper Desk */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="mt-7">
            <h2 className="text-[26px] sm:text-[30px] font-medium leading-[1.12] tracking-[-0.03em] text-black">
              Activate your Preflop desk.
            </h2>
            <p className="mt-2 text-[14.5px] leading-[1.4] text-[#808080]">
              Your account starts with $100,000.00 in live simulated buying
              power and reserves your spot for real-money launch.
            </p>

            {/* Instant Buying Power Banner */}
            <div className="mt-5 rounded-[16px] bg-[#FFF8FB] border border-[#ff4665]/18 p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.06em] text-[#ff4665] font-medium">
                  Simulated Paper Desk
                </div>
                <div className="mt-0.5 text-[22px] font-medium text-black tracking-[-0.02em] tabular-nums">
                  $100,000.00
                </div>
              </div>
              <div className="text-right text-[12px] text-[#808080]">
                <div>40 live markets</div>
                <div>8 Trajectory Units</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="onboard-name"
                  className="block text-[13px] text-black mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="onboard-name"
                  type="text"
                  placeholder="Raghav Mundara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/12 px-5 text-[14px] text-black placeholder:text-[#999] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="onboard-email"
                  className="block text-[13px] text-black mb-1.5"
                >
                  Work or Personal Email
                </label>
                <input
                  id="onboard-email"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/12 px-5 text-[14px] text-black placeholder:text-[#999] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <label className="mt-4 flex items-start gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreed}
                onClick={() => setAgreed((v) => !v)}
                className={`mt-0.5 h-[16px] w-[16px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  agreed
                    ? "bg-[#FF4665] border-[#FF4665] text-white"
                    : "bg-white border-[#FF4665]/75 text-transparent"
                }`}
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </button>
              <span className="text-[12.5px] leading-[1.4] text-[#808080]">
                I am 18+ and acknowledge Preflop&apos;s{" "}
                <span className="text-black font-medium">Milestone Charter</span>{" "}
                — simulated prices today, issuer consent first, never health,
                family, or legal markets.
              </span>
            </label>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="h-[40px] px-4 rounded-full border border-black/12 text-[13.5px] font-medium text-black hover:border-black/35 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => finish(true)}
                  className="h-[40px] px-4 rounded-full text-[13px] font-medium text-[#808080] hover:text-black transition-colors cursor-pointer"
                >
                  Quick Demo Entry
                </button>
                <button
                  type="submit"
                  disabled={!agreed}
                  className="h-[40px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 disabled:opacity-45 transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {role === "list"
                      ? "Open Issuance Studio"
                      : "Open Preflop Desk"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
