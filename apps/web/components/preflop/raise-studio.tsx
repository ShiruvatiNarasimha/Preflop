"use client"

import * as React from "react"
import {
  Check,
  CheckCircle2,
  FileCheck2,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Progress } from "@workspace/ui/components/progress"
import { Slider } from "@workspace/ui/components/slider"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { SectionEyebrow } from "./brand-marks"
import { CovenantProjectionChart } from "./charts"
import { formatCurrency } from "./market-catalog"
import { usePreflop } from "./store"

const ELIGIBILITY_GATES = [
  "≥5 years of documented income history (W-2, 1099, K-1, or brokerage)",
  "≥$250,000 cumulative lifetime Total Economic Benefit (TEB)",
  "Willing to share annual tax attestations with Preflop",
  "Willing to grant read-only cap-table verification (Carta / Pulley / AngelList) where applicable",
  "No active Chapter 7 or Chapter 13 bankruptcy proceedings",
  "No current fraud or financial-crime indictments or convictions",
  "US person or US tax nexus (Phase A launch scope)",
] as const

const REVIEW_PIPELINE = [
  "Application",
  "Automated screening",
  "Data audit",
  "Counsel review",
  "Reference price",
  "Pre-trading lockup",
] as const

const CORAL_SLIDER_CLASS =
  "[&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-[#EFEFF2] [&_[data-slot=slider-range]]:bg-[#ff4665] [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[#ff4665] [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-sm cursor-pointer"

export function RaiseStudio() {
  const { user, drafts, saveDraft } = usePreflop()

  const [mode, setMode] = React.useState<"covenant" | "direct">("covenant")

  // Covenant Modeler State (matching Preflop's real /raise defaults)
  const [builderName, setBuilderName] = React.useState(user.name || "")
  const [projectTitle, setProjectTitle] = React.useState("")
  const [raiseAmount, setRaiseAmount] = React.useState(100_000)
  const [incomeSharePct, setIncomeSharePct] = React.useState(5)
  const [termYears, setTermYears] = React.useState(7)
  const [conversionUnitsPct, setConversionUnitsPct] = React.useState(2)
  const [charterAgreed, setCharterAgreed] = React.useState(true)

  // Direct Listing State (matching Preflop's real /list 7 Hard Gates)
  const [checkedGates, setCheckedGates] = React.useState<boolean[]>(() =>
    ELIGIBILITY_GATES.map((_, i) => i < 4)
  )
  const [ticker, setTicker] = React.useState("RAGH")
  const [directFloatPct, setDirectFloatPct] = React.useState(6)
  const [annualTebUsd, setAnnualTebUsd] = React.useState(320_000)

  // Derived Covenant Math (exact Preflop breakeven: Raise / (share% * termYears))
  const annualPaybackThreshold = Math.round(
    raiseAmount / Math.max(0.01, (incomeSharePct / 100) * termYears)
  )
  const reservedUnits = Math.round(conversionUnitsPct / 0.0025)
  const maxActiveCommitPct = Math.min(25, incomeSharePct + conversionUnitsPct)
  const retainedPct = Number((100 - maxActiveCommitPct).toFixed(1))

  // Derived Direct Listing Math
  const passedGatesCount = checkedGates.filter(Boolean).length
  const allGatesPassed = passedGatesCount === ELIGIBILITY_GATES.length
  const directUnitsToList = Math.round(directFloatPct / 0.0025)
  const impliedUnitPrice = Number((annualTebUsd * 8.5 * 0.000025).toFixed(2))
  const estDirectProceeds = Math.round(directUnitsToList * impliedUnitPrice)

  const toggleGate = (index: number) => {
    setCheckedGates((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  const handleSaveCovenant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!charterAgreed) return
    saveDraft({
      mode: "covenant",
      builderName: builderName.trim() || "Founder Draft",
      projectTitle:
        projectTitle.trim() || "Human Capital Covenant Financing Model",
      raiseAmount,
      incomeSharePct,
      termYears,
      conversionUnitsPct,
      retainedPct,
    })
  }

  const handleSaveDirect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!allGatesPassed || !charterAgreed) return
    saveDraft({
      mode: "direct",
      builderName: builderName.trim() || "Direct Listing Draft",
      projectTitle: `Direct Listing ($${ticker.toUpperCase() || "PREF"})`,
      ticker: ticker.toUpperCase() || "PREF",
      raiseAmount: estDirectProceeds,
      retainedPct: Number((100 - directFloatPct).toFixed(1)),
    })
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionEyebrow text="Primary Issuance Studio" />
          <h1 className="mt-2.5 text-[32px] sm:text-[38px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
            Raise or Direct List
          </h1>
          <p className="mt-1.5 max-w-[560px] text-[14.5px] leading-[1.45] text-[#71717A]">
            Model a finite Covenant raise against your future potential or verify
            Direct Listing eligibility for perpetual Trajectory Units. Private
            browser preview — nothing is published.
          </p>
        </div>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "covenant" | "direct")}
        >
          <TabsList className="h-10 rounded-full bg-white border border-black/[0.08] p-1">
            <TabsTrigger
              value="covenant"
              className="rounded-full px-5 text-[13px] font-medium data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Raise (Covenant)
            </TabsTrigger>
            <TabsTrigger
              value="direct"
              className="rounded-full px-5 text-[13px] font-medium data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
            >
              Direct List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main 2-Column Interactive Studio */}
      {mode === "covenant" ? (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-5 items-start">
          {/* Left Interactive Covenant Parameters */}
          <Card className="rounded-[22px] bg-white border-black/[0.07] shadow-none py-0">
            <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[18px] font-medium tracking-[-0.02em] text-black flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#ff4665]" />
                <span>Model Your Covenant Terms</span>
              </CardTitle>
              <Badge className="rounded-full bg-[#fff5f8] text-[#ff4665] border-0 text-[11px] font-medium">
                Hard ≤25% Cap Enforced
              </Badge>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-3">
              <form onSubmit={handleSaveCovenant} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cov-name"
                      className="block text-[12.5px] font-medium text-black/75 mb-1.5"
                    >
                      Your Name
                    </label>
                    <Input
                      id="cov-name"
                      type="text"
                      placeholder="e.g. Jordan Kim"
                      value={builderName}
                      onChange={(e) => setBuilderName(e.target.value)}
                      className="h-10 rounded-[12px] border-black/12 text-[14px] focus-visible:ring-[#ff4665]/25 focus-visible:border-[#ff4665]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cov-project"
                      className="block text-[12.5px] font-medium text-black/75 mb-1.5"
                    >
                      What You&apos;re Building
                    </label>
                    <Input
                      id="cov-project"
                      type="text"
                      placeholder="e.g. Autonomous Robotics Lab"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="h-10 rounded-[12px] border-black/12 text-[14px] focus-visible:ring-[#ff4665]/25 focus-visible:border-[#ff4665]"
                    />
                  </div>
                </div>

                {/* Shadcn Slider 1: Raise Amount */}
                <div>
                  <div className="flex items-center justify-between text-[13.5px] mb-3 tabular-nums">
                    <span className="font-medium text-black">
                      Target Raise Amount
                    </span>
                    <span className="font-semibold text-[#ff4665]">
                      {formatCurrency(raiseAmount, 0)}
                    </span>
                  </div>
                  <Slider
                    name="raiseAmount"
                    aria-label="Target Raise Amount"
                    min={25000}
                    max={500000}
                    step={25000}
                    value={[raiseAmount]}
                    onValueChange={([val]) => {
                      if (typeof val === "number") setRaiseAmount(val)
                    }}
                    className={CORAL_SLIDER_CLASS}
                  />
                  <div className="flex justify-between text-[11px] text-[#71717A] mt-2 tabular-nums">
                    <span>$25K</span>
                    <span>$100K</span>
                    <span>$250K</span>
                    <span>$500K</span>
                  </div>
                </div>

                {/* Shadcn Slider 2: Income / TEB Share */}
                <div>
                  <div className="flex items-center justify-between text-[13.5px] mb-3 tabular-nums">
                    <span className="font-medium text-black">
                      Finite Income / TEB Share
                    </span>
                    <span className="font-semibold text-black">
                      {incomeSharePct}% for {termYears} years
                    </span>
                  </div>
                  <Slider
                    name="incomeSharePct"
                    aria-label="Finite Income or TEB Share"
                    min={1}
                    max={12}
                    step={0.5}
                    value={[incomeSharePct]}
                    onValueChange={([val]) => {
                      if (typeof val === "number") setIncomeSharePct(val)
                    }}
                    className={CORAL_SLIDER_CLASS}
                  />
                </div>

                {/* Shadcn Sliders 3 & 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between text-[13px] mb-3 tabular-nums">
                      <span className="font-medium text-black">
                        Covenant Term
                      </span>
                      <span className="font-semibold text-black">
                        {termYears} years
                      </span>
                    </div>
                    <Slider
                      name="termYears"
                      aria-label="Covenant Term Years"
                      min={3}
                      max={10}
                      step={1}
                      value={[termYears]}
                      onValueChange={([val]) => {
                        if (typeof val === "number") setTermYears(val)
                      }}
                      className={CORAL_SLIDER_CLASS}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[13px] mb-3 tabular-nums">
                      <span className="font-medium text-black">
                        Post-Term Conversion
                      </span>
                      <span className="font-semibold text-black">
                        {conversionUnitsPct}% Units
                      </span>
                    </div>
                    <Slider
                      name="conversionUnitsPct"
                      aria-label="Post-Term Conversion Units"
                      min={0.5}
                      max={5}
                      step={0.5}
                      value={[conversionUnitsPct]}
                      onValueChange={([val]) => {
                        if (typeof val === "number") setConversionUnitsPct(val)
                      }}
                      className={CORAL_SLIDER_CLASS}
                    />
                  </div>
                </div>

                {/* Milestone Charter Consent */}
                <label className="rounded-[14px] bg-[#FFF8FB] border border-[#ff4665]/18 p-4 flex items-start gap-3 cursor-pointer select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={charterAgreed}
                    onClick={() => setCharterAgreed((v) => !v)}
                    className={`mt-0.5 h-[16px] w-[16px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      charterAgreed
                        ? "bg-[#FF4665] border-[#FF4665] text-white"
                        : "bg-white border-[#FF4665]/75 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </button>
                  <span className="text-[12.5px] leading-[1.45] text-black/75">
                    <strong className="text-black">
                      Issuer Consent &amp; Milestone Charter:
                    </strong>{" "}
                    Preflop will never list health or injury, relationships or
                    family, legal matters, or any topic I have not specifically
                    approved.
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={!charterAgreed}
                  className="h-11 w-full rounded-full bg-black text-white hover:bg-neutral-800 text-[14px] font-medium cursor-pointer"
                >
                  Save Covenant Term Sheet Preview
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Live Term Sheet Preview + Recharts Cashflow Projection */}
          <div className="space-y-4">
            <Card className="rounded-[22px] bg-white border-black/[0.08] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.14)] py-0">
              <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#ff4665] font-semibold">
                  Live Covenant Preview
                </span>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-[#F5F5F7] text-[#71717A] border-0 text-[11px] font-normal"
                >
                  Private browser model
                </Badge>
              </CardHeader>

              <CardContent className="px-6 pb-6 pt-1">
                <div className="text-[30px] font-medium tracking-[-0.03em] text-black tabular-nums">
                  {formatCurrency(raiseAmount, 0)}{" "}
                  <span className="text-[15px] font-normal text-[#71717A]">
                    upfront
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] text-[#71717A]">
                  {incomeSharePct}% TEB share for {termYears} years, converting
                  to{" "}
                  <span className="text-black font-medium">
                    {conversionUnitsPct}% in perpetual Trajectory Units
                  </span>{" "}
                  after Year {termYears}.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 tabular-nums">
                  <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
                    <div className="text-[11px] text-[#71717A]">
                      Backer Payback Threshold
                    </div>
                    <div className="mt-1 text-[17px] font-medium text-black">
                      ~{formatCurrency(annualPaybackThreshold, 0)} / yr
                    </div>
                  </div>
                  <div className="rounded-[14px] bg-[#FFF8FB] border border-[#ff4665]/15 p-3.5">
                    <div className="text-[11px] text-[#71717A]">
                      You Permanently Retain
                    </div>
                    <div className="mt-1 text-[17px] font-medium text-[#ff4665]">
                      {retainedPct}%+
                    </div>
                  </div>
                  <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
                    <div className="text-[11px] text-[#71717A]">
                      Units Reserved
                    </div>
                    <div className="mt-1 text-[15.5px] font-medium text-black">
                      {reservedUnits.toLocaleString()} / 10,000
                    </div>
                  </div>
                  <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
                    <div className="text-[11px] text-[#71717A]">
                      25% Cap Status
                    </div>
                    <div className="mt-1 text-[15.5px] font-medium text-emerald-600 inline-flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Live Recharts ComposedChart: Projected TEB vs Covenant Payout */}
                <div className="mt-5 rounded-[16px] bg-[#FAFAFB] border border-black/[0.06] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[12px] font-medium text-black">
                      Projected {termYears}-Year TEB &amp; Covenant Payout
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-[#71717A]">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-xs bg-[#E4E4E7]" />
                        Est. TEB
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff4665]" />
                        {incomeSharePct}% Payout
                      </span>
                    </div>
                  </div>
                  <CovenantProjectionChart
                    raiseAmount={raiseAmount}
                    incomeSharePct={incomeSharePct}
                    termYears={termYears}
                  />
                </div>

                {/* Obligation Ledger Ceiling Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-[12px] mb-1.5 tabular-nums">
                    <span className="text-black font-medium">
                      Obligation Ledger Ceiling (≤25%)
                    </span>
                    <span className="text-[#71717A]">
                      {maxActiveCommitPct}% / 25% max
                    </span>
                  </div>
                  <Progress
                    value={(maxActiveCommitPct / 25) * 100}
                    className="h-2 bg-[#F1F1F4] [&_[data-slot=progress-indicator]]:bg-opus-gradient"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 6-Stage Institutional Review Pipeline */}
            <Card className="rounded-[20px] bg-white border-black/[0.07] shadow-none py-0">
              <CardContent className="p-5">
                <div className="text-[12.5px] font-medium text-black mb-3 flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-[#ff4665]" />
                  <span>Proposed 6-Stage Issuance Pipeline</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {REVIEW_PIPELINE.map((stage, i) => (
                    <div
                      key={stage}
                      className="rounded-[10px] bg-[#FAFAFB] border border-black/[0.05] px-2.5 py-2 text-[11.5px]"
                    >
                      <span className="text-[#ff4665] font-mono font-semibold mr-1.5">
                        0{i + 1}
                      </span>
                      <span className="text-black/80">{stage}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Direct Listing Tab: 7 Real Hard Eligibility Gates + Ticker Modeler */
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 items-start">
          <Card className="rounded-[22px] bg-white border-black/[0.07] shadow-none py-0">
            <CardHeader className="px-6 pt-6 pb-3 flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle className="text-[19px] font-medium tracking-[-0.02em] text-black">
                  7 Hard Eligibility Gates
                </CardTitle>
                <CardDescription className="mt-1 text-[13.5px] text-[#71717A]">
                  Direct Listing is built for established builders, creators,
                  and talent with 5+ years of documented trajectory.
                </CardDescription>
              </div>
              <Badge className="rounded-full bg-[#fff5f8] text-[#ff4665] border-0 text-[12px] font-medium tabular-nums shrink-0">
                {passedGatesCount} / 7 Met
              </Badge>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-1 space-y-4">
              <Progress
                value={(passedGatesCount / ELIGIBILITY_GATES.length) * 100}
                className="h-1.5 bg-[#F1F1F4] [&_[data-slot=progress-indicator]]:bg-[#ff4665]"
              />

              <div className="space-y-2.5">
                {ELIGIBILITY_GATES.map((gate, idx) => {
                  const checked = checkedGates[idx] ?? false
                  return (
                    <button
                      key={gate}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggleGate(idx)}
                      className={`w-full rounded-[14px] p-3.5 text-left border transition-all cursor-pointer flex items-start gap-3 ${
                        checked
                          ? "border-[#ff4665]/30 bg-[#fffbfc]"
                          : "border-black/[0.08] bg-white hover:border-black/25"
                      }`}
                    >
                      <span
                        className={`mt-0.5 h-5 w-5 rounded-[6px] border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? "bg-[#ff4665] border-[#ff4665] text-white"
                            : "border-black/20 text-transparent"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.8]" />
                      </span>
                      <span className="text-[13.5px] leading-[1.4] text-black/85">
                        {gate}
                      </span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right Direct List Ticker & Reference Valuation Preview */}
          <Card className="rounded-[22px] bg-white border-black/[0.08] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.14)] py-0">
            <CardHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[18px] font-medium text-black flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#ff4665]" />
                <span>Trajectory Unit Preview</span>
              </CardTitle>
              <Badge
                className={`rounded-full border-0 text-[11px] font-medium ${
                  allGatesPassed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-[#F5F5F7] text-[#71717A]"
                }`}
              >
                {allGatesPassed ? "Eligible" : "Complete 7/7 gates"}
              </Badge>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-3">
              <form onSubmit={handleSaveDirect} className="space-y-5">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="direct-ticker"
                      className="block text-[12px] font-medium text-black/70 mb-1.5"
                    >
                      Personal Ticker (3–5 chars)
                    </label>
                    <Input
                      id="direct-ticker"
                      type="text"
                      maxLength={5}
                      value={ticker}
                      onChange={(e) =>
                        setTicker(
                          e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase()
                        )
                      }
                      className="h-10 rounded-[12px] border-black/12 text-[15px] font-mono font-semibold uppercase focus-visible:ring-[#ff4665]/25 focus-visible:border-[#ff4665]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="direct-teb"
                      className="block text-[12px] font-medium text-black/70 mb-1.5"
                    >
                      Est. Annual TEB ($)
                    </label>
                    <Input
                      id="direct-teb"
                      type="number"
                      min={100000}
                      step={20000}
                      value={annualTebUsd}
                      onChange={(e) =>
                        setAnnualTebUsd(
                          Math.max(50000, Number(e.target.value) || 0)
                        )
                      }
                      className="h-10 rounded-[12px] border-black/12 text-[15px] font-medium tabular-nums focus-visible:ring-[#ff4665]/25 focus-visible:border-[#ff4665]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[13px] mb-3 tabular-nums">
                    <span className="font-medium text-black">
                      Initial Float Listed (Hard ≤25% Cap)
                    </span>
                    <span className="font-semibold text-[#ff4665]">
                      {directFloatPct}% ({directUnitsToList.toLocaleString()}{" "}
                      units)
                    </span>
                  </div>
                  <Slider
                    name="directFloatPct"
                    aria-label="Initial Float Listed"
                    min={2}
                    max={20}
                    step={0.5}
                    value={[directFloatPct]}
                    onValueChange={([val]) => {
                      if (typeof val === "number") setDirectFloatPct(val)
                    }}
                    className={CORAL_SLIDER_CLASS}
                  />
                </div>

                <div className="rounded-[16px] bg-[#F9F9FA] border border-black/[0.06] p-4 space-y-2.5 text-[13px] tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Ticker</span>
                    <span className="font-mono font-semibold text-black">
                      ${ticker || "PREF"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">
                      Illustrative ref. price
                    </span>
                    <span className="font-medium text-black">
                      {formatCurrency(impliedUnitPrice)} / unit
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">
                      Est. auction proceeds
                    </span>
                    <span className="font-semibold text-black">
                      {formatCurrency(estDirectProceeds, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-black/[0.06]">
                    <span className="text-[#71717A]">
                      You permanently retain
                    </span>
                    <span className="font-semibold text-[#ff4665]">
                      {(100 - directFloatPct).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!allGatesPassed}
                  className="h-11 w-full rounded-full bg-black text-white hover:bg-neutral-800 text-[14px] font-medium cursor-pointer"
                >
                  {allGatesPassed
                    ? `Save $${ticker || "PREF"} Direct Listing Preview`
                    : `Confirm All 7 Gates (${passedGatesCount}/7)`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Saved Drafts Strip */}
      {drafts.length > 0 && (
        <Card className="mt-6 rounded-[20px] bg-white border-black/[0.07] shadow-none py-0">
          <CardHeader className="px-6 pt-5 pb-2">
            <CardTitle className="text-[15.5px] font-medium text-black flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#ff4665]" />
              <span>Saved Private Previews ({drafts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  className="rounded-[14px] bg-[#FAFAFB] border border-black/[0.06] p-4 flex items-center justify-between gap-4 tabular-nums"
                >
                  <div>
                    <div className="text-[14px] font-medium text-black">
                      {d.builderName} · {d.projectTitle}
                    </div>
                    <div className="mt-0.5 text-[12px] text-[#71717A]">
                      {d.mode === "covenant"
                        ? `${formatCurrency(d.raiseAmount ?? 100000, 0)} · ${d.incomeSharePct}% / ${d.termYears}yr → ${d.conversionUnitsPct}% Units`
                        : `Ticker $${d.ticker} · Est. ${formatCurrency(d.raiseAmount ?? 0, 0)}`}{" "}
                      · Saved {d.createdAt}
                    </div>
                  </div>
                  <Badge className="rounded-full bg-[#fff0f5] text-[#ff4665] border-0 shrink-0">
                    {d.retainedPct}% kept
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
