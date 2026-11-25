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
import { SectionEyebrow } from "./brand-marks"
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

export function RaiseStudio() {
  const { user, drafts, saveDraft } = usePreflop()

  const [mode, setMode] = React.useState<"covenant" | "direct">("covenant")

  // Covenant Modeler State (matching Preflop's real /raise defaults!)
  const [builderName, setBuilderName] = React.useState(user.name || "")
  const [projectTitle, setProjectTitle] = React.useState("")
  const [raiseAmount, setRaiseAmount] = React.useState(100_000)
  const [incomeSharePct, setIncomeSharePct] = React.useState(5)
  const [termYears, setTermYears] = React.useState(7)
  const [conversionUnitsPct, setConversionUnitsPct] = React.useState(2)
  const [charterAgreed, setCharterAgreed] = React.useState(true)

  // Direct Listing State (matching Preflop's real /list 7 Hard Gates!)
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
  const reservedUnits = Math.round((conversionUnitsPct / 0.0025))
  const maxActiveCommitPct = Math.min(25, incomeSharePct + conversionUnitsPct)
  const retainedPct = Number((100 - maxActiveCommitPct).toFixed(1))

  // Derived Direct Listing Math
  const passedGatesCount = checkedGates.filter(Boolean).length
  const allGatesPassed = passedGatesCount === ELIGIBILITY_GATES.length
  const directUnitsToList = Math.round(directFloatPct / 0.0025)
  const impliedUnitPrice = Number(
    (((annualTebUsd * 8.5) * 0.000025)).toFixed(2)
  )
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
    <div className="opus-container px-5 md:px-8 xl:px-0 py-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <SectionEyebrow text="Primary Issuance Studio" />
          <h1 className="mt-3 text-[34px] sm:text-[40px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
            Raise or Direct List
          </h1>
          <p className="mt-2 max-w-[560px] text-[15px] leading-[1.4] text-[#808080]">
            Model a finite Covenant raise against your future potential or check
            Direct Listing eligibility for perpetual Trajectory Units. Private
            browser preview — nothing is published.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-white border border-black/[0.08] rounded-full p-1 text-[13px] shrink-0">
          <button
            type="button"
            onClick={() => setMode("covenant")}
            className={`h-[34px] px-5 rounded-full font-medium transition-colors cursor-pointer ${
              mode === "covenant"
                ? "bg-black text-white"
                : "text-black/65 hover:text-black"
            }`}
          >
            Raise (Covenant)
          </button>
          <button
            type="button"
            onClick={() => setMode("direct")}
            className={`h-[34px] px-5 rounded-full font-medium transition-colors cursor-pointer ${
              mode === "direct"
                ? "bg-black text-white"
                : "text-black/65 hover:text-black"
            }`}
          >
            Direct List
          </button>
        </div>
      </div>

      {/* Main 2-Column Interactive Studio */}
      {mode === "covenant" ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          {/* Left Interactive Covenant Parameters */}
          <form
            onSubmit={handleSaveCovenant}
            className="rounded-[24px] bg-white border border-black/[0.07] p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#ff4665]" />
                <h2 className="text-[19px] font-medium tracking-[-0.02em] text-black">
                  Model Your Covenant Terms
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fff5f8] text-[11px] font-medium text-[#ff4665]">
                Hard ≤25% Cap Enforced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cov-name"
                  className="block text-[12.5px] font-medium text-black/70 mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="cov-name"
                  type="text"
                  placeholder="e.g. Jordan Kim"
                  value={builderName}
                  onChange={(e) => setBuilderName(e.target.value)}
                  className="h-[42px] w-full rounded-[12px] border border-black/12 px-4 text-[14px] text-black focus:border-[#ff4665] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="cov-project"
                  className="block text-[12.5px] font-medium text-black/70 mb-1.5"
                >
                  What You&apos;re Building
                </label>
                <input
                  id="cov-project"
                  type="text"
                  placeholder="e.g. Autonomous Robotics Lab"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="h-[42px] w-full rounded-[12px] border border-black/12 px-4 text-[14px] text-black focus:border-[#ff4665] focus:outline-none"
                />
              </div>
            </div>

            {/* Slider 1: Raise Amount */}
            <div>
              <div className="flex items-center justify-between text-[13.5px] mb-2 tabular-nums">
                <label htmlFor="slider-raise" className="font-medium text-black">
                  Target Raise Amount
                </label>
                <span className="font-semibold text-[#ff4665]">
                  {formatCurrency(raiseAmount, 0)}
                </span>
              </div>
              <input
                id="slider-raise"
                type="range"
                min={25000}
                max={500000}
                step={25000}
                value={raiseAmount}
                onChange={(e) => setRaiseAmount(Number(e.target.value))}
                className="w-full accent-[#ff4665] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#808080] mt-1 tabular-nums">
                <span>$25K</span>
                <span>$100K</span>
                <span>$250K</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Slider 2: Income / TEB Share */}
            <div>
              <div className="flex items-center justify-between text-[13.5px] mb-2 tabular-nums">
                <label htmlFor="slider-share" className="font-medium text-black">
                  Finite Income / TEB Share
                </label>
                <span className="font-semibold text-black">
                  {incomeSharePct}% for {termYears} years
                </span>
              </div>
              <input
                id="slider-share"
                type="range"
                min={1}
                max={12}
                step={0.5}
                value={incomeSharePct}
                onChange={(e) => setIncomeSharePct(Number(e.target.value))}
                className="w-full accent-[#ff4665] cursor-pointer"
              />
            </div>

            {/* Slider 3 & 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between text-[13px] mb-2 tabular-nums">
                  <label htmlFor="slider-term" className="font-medium text-black">
                    Covenant Term
                  </label>
                  <span className="font-semibold text-black">
                    {termYears} years
                  </span>
                </div>
                <input
                  id="slider-term"
                  type="range"
                  min={3}
                  max={10}
                  step={1}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full accent-[#ff4665] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[13px] mb-2 tabular-nums">
                  <label htmlFor="slider-conv" className="font-medium text-black">
                    Post-Term Conversion
                  </label>
                  <span className="font-semibold text-black">
                    {conversionUnitsPct}% Units
                  </span>
                </div>
                <input
                  id="slider-conv"
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={conversionUnitsPct}
                  onChange={(e) =>
                    setConversionUnitsPct(Number(e.target.value))
                  }
                  className="w-full accent-[#ff4665] cursor-pointer"
                />
              </div>
            </div>

            {/* Milestone Charter Consent */}
            <label className="rounded-[16px] bg-[#FFF8FB] border border-[#ff4665]/18 p-4 flex items-start gap-3 cursor-pointer select-none">
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
                <strong className="text-black">Issuer Consent &amp; Milestone Charter:</strong>{" "}
                Preflop will never list health or injury, relationships or
                family, legal matters, or any topic I have not specifically
                approved.
              </span>
            </label>

            <button
              type="submit"
              disabled={!charterAgreed}
              className="h-[44px] w-full rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 disabled:opacity-45 transition-colors cursor-pointer"
            >
              Save Covenant Term Sheet Preview
            </button>
          </form>

          {/* Right Live Term Sheet Preview Card */}
          <div className="space-y-5">
            <div className="rounded-[24px] bg-white border border-black/[0.08] p-6 sm:p-7 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.14)]">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] uppercase tracking-[0.08em] text-[#ff4665] font-medium">
                  Live Covenant Preview
                </span>
                <span className="text-[11.5px] text-[#808080]">
                  Private browser model
                </span>
              </div>

              <div className="mt-3 text-[28px] font-medium tracking-[-0.03em] text-black tabular-nums">
                {formatCurrency(raiseAmount, 0)}{" "}
                <span className="text-[15px] font-normal text-[#808080]">
                  upfront
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-[#808080]">
                {incomeSharePct}% TEB share for {termYears} years, converting to{" "}
                <span className="text-black font-medium">
                  {conversionUnitsPct}% in perpetual Trajectory Units
                </span>{" "}
                after Year {termYears}.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 tabular-nums">
                <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
                  <div className="text-[11px] text-[#808080]">
                    Backer Payback Threshold
                  </div>
                  <div className="mt-1 text-[18px] font-medium text-black">
                    ~{formatCurrency(annualPaybackThreshold, 0)} / yr
                  </div>
                </div>
                <div className="rounded-[14px] bg-[#FFF8FB] border border-[#ff4665]/15 p-3.5">
                  <div className="text-[11px] text-[#808080]">
                    You Permanently Retain
                  </div>
                  <div className="mt-1 text-[18px] font-medium text-[#ff4665]">
                    {retainedPct}%+
                  </div>
                </div>
                <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
                  <div className="text-[11px] text-[#808080]">
                    Units Reserved
                  </div>
                  <div className="mt-1 text-[16px] font-medium text-black">
                    {reservedUnits.toLocaleString()} / 10,000
                  </div>
                </div>
                <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
                  <div className="text-[11px] text-[#808080]">
                    25% Cap Status
                  </div>
                  <div className="mt-1 text-[16px] font-medium text-emerald-600 inline-flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Compliant</span>
                  </div>
                </div>
              </div>

              {/* Cap Progress Bar */}
              <div className="mt-5">
                <div className="flex justify-between text-[12px] mb-1.5 tabular-nums">
                  <span className="text-black font-medium">
                    Obligation Ledger Ceiling (≤25%)
                  </span>
                  <span className="text-[#808080]">
                    {maxActiveCommitPct}% / 25% max
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#F1F1F4] overflow-hidden">
                  <div
                    style={{ width: `${(maxActiveCommitPct / 25) * 100}%` }}
                    className="h-full rounded-full bg-opus-gradient transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* 6-Stage Institutional Review Pipeline */}
            <div className="rounded-[22px] bg-white border border-black/[0.07] p-5">
              <div className="text-[12px] font-medium text-black mb-3 flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-[#ff4665]" />
                <span>Proposed 6-Stage Issuance Pipeline</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REVIEW_PIPELINE.map((stage, i) => (
                  <div
                    key={stage}
                    className="rounded-[10px] bg-[#FAFAFB] border border-black/[0.05] px-2.5 py-2 text-[11.5px]"
                  >
                    <span className="text-[#ff4665] font-medium mr-1">
                      0{i + 1}
                    </span>
                    <span className="text-black/80">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Listing Tab: 7 Real Hard Eligibility Gates + Ticker Modeler */
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <div className="rounded-[24px] bg-white border border-black/[0.07] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[20px] font-medium tracking-[-0.02em] text-black">
                  7 Hard Eligibility Gates
                </h2>
                <p className="mt-1 text-[13.5px] text-[#808080]">
                  Direct Listing is built for established builders, creators,
                  and talent with 5+ years of documented trajectory.
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#fff5f8] text-[#ff4665] text-[12.5px] font-medium tabular-nums shrink-0">
                {passedGatesCount} / 7 Met
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
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
          </div>

          {/* Right Direct List Ticker & Reference Valuation Preview */}
          <form
            onSubmit={handleSaveDirect}
            className="rounded-[24px] bg-white border border-black/[0.08] p-6 sm:p-7 space-y-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.14)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#ff4665]" />
                <h3 className="text-[18px] font-medium text-black">
                  Trajectory Unit Preview
                </h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  allGatesPassed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-[#F5F5F7] text-[#808080]"
                }`}
              >
                {allGatesPassed ? "Eligible" : "Complete 7/7 gates"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="direct-ticker"
                  className="block text-[12px] font-medium text-black/65 mb-1.5"
                >
                  Personal Ticker (3–5 chars)
                </label>
                <input
                  id="direct-ticker"
                  type="text"
                  maxLength={5}
                  value={ticker}
                  onChange={(e) =>
                    setTicker(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
                  }
                  className="h-[42px] w-full rounded-[12px] border border-black/12 px-4 text-[15px] font-mono font-semibold uppercase text-black focus:border-[#ff4665] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="direct-teb"
                  className="block text-[12px] font-medium text-black/65 mb-1.5"
                >
                  Est. Annual TEB ($)
                </label>
                <input
                  id="direct-teb"
                  type="number"
                  min={100000}
                  step={20000}
                  value={annualTebUsd}
                  onChange={(e) =>
                    setAnnualTebUsd(Math.max(50000, Number(e.target.value) || 0))
                  }
                  className="h-[42px] w-full rounded-[12px] border border-black/12 px-4 text-[15px] font-medium text-black tabular-nums focus:border-[#ff4665] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[13px] mb-1.5 tabular-nums">
                <label htmlFor="slider-float" className="font-medium text-black">
                  Initial Float Listed (Hard ≤25% Cap)
                </label>
                <span className="font-semibold text-[#ff4665]">
                  {directFloatPct}% ({directUnitsToList.toLocaleString()} units)
                </span>
              </div>
              <input
                id="slider-float"
                type="range"
                min={2}
                max={20}
                step={0.5}
                value={directFloatPct}
                onChange={(e) => setDirectFloatPct(Number(e.target.value))}
                className="w-full accent-[#ff4665] cursor-pointer"
              />
            </div>

            <div className="rounded-[16px] bg-[#F9F9FA] border border-black/[0.06] p-4 space-y-2 text-[13px] tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#808080]">Ticker</span>
                <span className="font-mono font-semibold text-black">
                  ${ticker || "PREF"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Illustrative ref. price</span>
                <span className="font-medium text-black">
                  {formatCurrency(impliedUnitPrice)} / unit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#808080]">Est. auction proceeds</span>
                <span className="font-semibold text-black">
                  {formatCurrency(estDirectProceeds, 0)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-black/[0.06]">
                <span className="text-[#808080]">You permanently retain</span>
                <span className="font-semibold text-[#ff4665]">
                  {(100 - directFloatPct).toFixed(1)}%
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!allGatesPassed}
              className="h-[44px] w-full rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {allGatesPassed
                ? `Save $${ticker || "PREF"} Direct Listing Preview`
                : `Confirm All 7 Gates (${passedGatesCount}/7)`}
            </button>
          </form>
        </div>
      )}

      {/* Saved Drafts Strip */}
      {drafts.length > 0 && (
        <section className="mt-8 rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-4 w-4 text-[#ff4665]" />
            <h3 className="text-[16px] font-medium text-black">
              Saved Private Previews ({drafts.length})
            </h3>
          </div>
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
                  <div className="mt-0.5 text-[12px] text-[#808080]">
                    {d.mode === "covenant"
                      ? `${formatCurrency(d.raiseAmount ?? 100000, 0)} · ${d.incomeSharePct}% / ${d.termYears}yr → ${d.conversionUnitsPct}% Units`
                      : `Ticker $${d.ticker} · Est. ${formatCurrency(d.raiseAmount ?? 0, 0)}`}{" "}
                    · Saved {d.createdAt}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#fff0f5] text-[#ff4665] text-[11.5px] font-medium shrink-0">
                  {d.retainedPct}% kept
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
