"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Layers,
  RotateCcw,
  Star,
  Wallet,
} from "lucide-react"
import { SectionEyebrow } from "./brand-marks"
import {
  PERSON_PROFILES,
  formatCurrency,
  getPersonBySlug,
} from "./market-catalog"
import { usePreflop } from "./store"

export function PortfolioView() {
  const {
    user,
    cashBalance,
    positionsValue,
    unrealizedPnl,
    realizedPnl,
    totalEquity,
    milestonePositions,
    trajectoryPositions,
    fills,
    drafts,
    getMilestoneYesCents,
    getTrajectoryPrice,
    sellMilestone,
    sellTrajectoryUnits,
    resetAccount,
    openOnboarding,
  } = usePreflop()

  const totalPnl = unrealizedPnl + realizedPnl
  const totalPnlPct = (totalPnl / 100_000) * 100

  // Smooth account equity curve derived cleanly from starting $100K -> current totalEquity
  const equityPoints = React.useMemo(() => {
    const start = 100_000
    const end = totalEquity
    const diff = end - start
    return [
      start,
      start + diff * 0.12,
      start + diff * 0.28,
      start + diff * 0.21,
      start + diff * 0.48,
      start + diff * 0.62,
      start + diff * 0.78,
      start + diff * 0.89,
      end,
    ]
  }, [totalEquity])

  const minEq = Math.min(...equityPoints) - 80
  const maxEq = Math.max(...equityPoints) + 80
  const eqRange = Math.max(1, maxEq - minEq)

  const polyline = equityPoints
    .map((val, idx) => {
      const x = 10 + (idx / (equityPoints.length - 1)) * 340
      const y = 78 - ((val - minEq) / eqRange) * 62
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  const followedPeople = PERSON_PROFILES.filter((p) =>
    user.watchlist.includes(p.slug)
  )

  return (
    <div className="opus-container px-5 md:px-8 xl:px-0 py-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <SectionEyebrow text="Account & Positions" />
          <h1 className="mt-3 text-[34px] sm:text-[40px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
            Portfolio
          </h1>
          <p className="mt-1.5 text-[15px] text-[#808080]">
            Live paper-desk equity, open positions, watchlist, and settled trade
            history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {!user.onboarded && (
            <button
              type="button"
              onClick={() => openOnboarding("back")}
              className="h-[36px] px-5 rounded-full bg-black text-white text-[13.5px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Personalize Account
            </button>
          )}
          <button
            type="button"
            onClick={resetAccount}
            className="h-[36px] px-4 rounded-full bg-white border border-black/10 text-[13px] font-medium text-black/70 hover:text-black hover:border-black/30 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset $100K</span>
          </button>
        </div>
      </div>

      {/* Hero Equity Card */}
      <div className="mt-7 rounded-[24px] bg-white border border-black/[0.07] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[12px] font-medium text-[#808080]">
            <Wallet className="h-3.5 w-3.5 text-[#ff4665]" />
            <span>Total Account Value</span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-3 tabular-nums">
            <span className="text-[40px] sm:text-[46px] font-medium leading-none tracking-[-0.03em] text-black">
              {formatCurrency(totalEquity)}
            </span>
            <span
              className={`text-[15px] font-medium ${
                totalPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
              }`}
            >
              {totalPnl >= 0 ? "+" : ""}
              {formatCurrency(totalPnl)} ({totalPnl >= 0 ? "+" : ""}
              {totalPnlPct.toFixed(2)}%)
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5 tabular-nums">
            <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
              <div className="text-[11px] text-[#808080]">Cash Available</div>
              <div className="mt-1 text-[16px] font-medium text-black">
                {formatCurrency(cashBalance)}
              </div>
            </div>
            <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
              <div className="text-[11px] text-[#808080]">Positions Value</div>
              <div className="mt-1 text-[16px] font-medium text-black">
                {formatCurrency(positionsValue)}
              </div>
            </div>
            <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
              <div className="text-[11px] text-[#808080]">Unrealized P&amp;L</div>
              <div
                className={`mt-1 text-[16px] font-medium ${
                  unrealizedPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
                }`}
              >
                {unrealizedPnl >= 0 ? "+" : ""}
                {formatCurrency(unrealizedPnl)}
              </div>
            </div>
            <div className="rounded-[14px] bg-[#F9F9FA] border border-black/[0.05] p-3.5">
              <div className="text-[11px] text-[#808080]">Realized P&amp;L</div>
              <div
                className={`mt-1 text-[16px] font-medium ${
                  realizedPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
                }`}
              >
                {realizedPnl >= 0 ? "+" : ""}
                {formatCurrency(realizedPnl)}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Minimal Equity Curve */}
        <div className="rounded-[18px] bg-[#FFF8FB] border border-[#ff4665]/15 p-4">
          <div className="flex items-center justify-between text-[12px] mb-2">
            <span className="font-medium text-black">Session Equity Curve</span>
            <span className="text-[#808080] tabular-nums">
              Starting: $100,000.00
            </span>
          </div>
          <div className="rounded-[12px] bg-white p-3 border border-black/[0.04]">
            <svg viewBox="0 0 360 92" className="w-full h-[96px]">
              <line
                x1="10"
                y1="47"
                x2="350"
                y2="47"
                stroke="#000"
                strokeOpacity="0.06"
                strokeDasharray="3 3"
              />
              <polyline
                fill="none"
                stroke="#FF4665"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polyline}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Open Milestone Positions */}
      <section className="mt-8 rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[19px] font-medium tracking-[-0.02em] text-black">
            Open Milestone Positions ({milestonePositions.length})
          </h2>
          <Link
            href="/markets"
            className="text-[13px] font-medium text-[#ff4665] hover:underline inline-flex items-center gap-1"
          >
            <span>Browse 40 Markets</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {milestonePositions.length === 0 ? (
          <div className="mt-5 rounded-[16px] bg-[#FAFAFB] border border-dashed border-black/10 p-8 text-center">
            <div className="text-[16px] font-medium text-black">
              No open milestone positions yet
            </div>
            <p className="mt-1.5 text-[13.5px] text-[#808080] max-w-[420px] mx-auto">
              Put your $100,000.00 simulated desk to work. Pick a person and
              take a Yes or No view on any live milestone.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {PERSON_PROFILES.slice(0, 3).map((p) => (
                <Link
                  key={p.slug}
                  href={`/person/${p.slug}`}
                  className="h-[34px] px-4 rounded-full bg-white border border-black/12 text-[13px] font-medium text-black hover:border-[#ff4665] hover:text-[#ff4665] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{p.name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-[13.5px] tabular-nums min-w-[680px]">
              <thead>
                <tr className="border-b border-black/[0.06] text-[11.5px] font-normal text-[#808080]">
                  <th className="pb-2.5 font-normal">Market</th>
                  <th className="pb-2.5 font-normal">Side</th>
                  <th className="pb-2.5 font-normal text-right">Contracts</th>
                  <th className="pb-2.5 font-normal text-right">Avg / Mark</th>
                  <th className="pb-2.5 font-normal text-right">Value</th>
                  <th className="pb-2.5 font-normal text-right">Live P&amp;L</th>
                  <th className="pb-2.5 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05]">
                {milestonePositions.map((pos) => {
                  const yesCents = getMilestoneYesCents(
                    pos.milestoneId,
                    pos.avgPriceCents
                  )
                  const markCents =
                    pos.side === "Yes" ? yesCents : 100 - yesCents
                  const value = pos.contracts * (markCents / 100)
                  const pnl = value - pos.totalCost
                  const pnlPct = pos.totalCost > 0 ? (pnl / pos.totalCost) * 100 : 0

                  return (
                    <tr key={pos.key}>
                      <td className="py-3.5 pr-4">
                        <Link
                          href={`/person/${pos.personSlug}?milestone=${pos.milestoneId}`}
                          className="font-medium text-black hover:text-[#ff4665] transition-colors"
                        >
                          {pos.milestoneTitle}
                        </Link>
                        <div className="text-[11.5px] text-[#808080]">
                          {pos.personName}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${
                            pos.side === "Yes"
                              ? "bg-[#fff0f5] text-[#ff4665]"
                              : "bg-[#F3F3F5] text-black"
                          }`}
                        >
                          {pos.side}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-medium text-black">
                        {pos.contracts.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right text-black/75">
                        {pos.avgPriceCents}¢ →{" "}
                        <strong className="text-black">{markCents}¢</strong>
                      </td>
                      <td className="py-3.5 text-right font-medium text-black">
                        {formatCurrency(value)}
                      </td>
                      <td
                        className={`py-3.5 text-right font-medium ${
                          pnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {formatCurrency(pnl)} ({pnl >= 0 ? "+" : ""}
                        {pnlPct.toFixed(1)}%)
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => sellMilestone(pos.key)}
                          className="h-[30px] px-3.5 rounded-full bg-black text-white text-[12px] font-medium hover:bg-[#ff4665] transition-colors cursor-pointer"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Trajectory Unit Holdings */}
      {trajectoryPositions.length > 0 && (
        <section className="mt-6 rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#ff4665]" />
            <h2 className="text-[19px] font-medium tracking-[-0.02em] text-black">
              Trajectory Unit Holdings ({trajectoryPositions.length})
            </h2>
          </div>

          <div className="mt-4 divide-y divide-black/[0.05] tabular-nums">
            {trajectoryPositions.map((tp) => {
              const spot = getTrajectoryPrice(tp.personSlug, tp.avgPrice)
              const val = tp.units * spot
              const pnl = val - tp.totalCost
              const tebClaim = (tp.units * 0.0025).toFixed(4)
              return (
                <div
                  key={tp.personSlug}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-4 text-[13.5px]"
                >
                  <div>
                    <Link
                      href={`/person/${tp.personSlug}?view=trajectory`}
                      className="font-medium text-black hover:text-[#ff4665]"
                    >
                      {tp.personName} ({tp.ticker})
                    </Link>
                    <div className="text-[12px] text-[#808080]">
                      {tp.units} units · {tebClaim}% TEB claim · Avg{" "}
                      {formatCurrency(tp.avgPrice)}
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <div className="font-medium text-black">
                        {formatCurrency(val)}
                      </div>
                      <div
                        className={`text-[12px] font-medium ${
                          pnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}
                        {formatCurrency(pnl)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => sellTrajectoryUnits(tp.personSlug)}
                      className="h-[30px] px-3.5 rounded-full bg-black text-white text-[12px] font-medium hover:bg-[#ff4665] transition-colors cursor-pointer"
                    >
                      Sell All
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Watchlist & Saved Covenant/Direct List Drafts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watchlist */}
        <section className="rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[#ff4665]" />
              <h2 className="text-[17px] font-medium tracking-[-0.02em] text-black">
                Following ({followedPeople.length})
              </h2>
            </div>
            <Link
              href="/markets"
              className="text-[12.5px] text-[#808080] hover:text-black"
            >
              Manage
            </Link>
          </div>

          <div className="mt-4 divide-y divide-black/[0.05]">
            {followedPeople.map((p) => {
              const lead = p.milestones[0]!
              const cents = getMilestoneYesCents(lead.id, lead.baseYesCents)
              return (
                <Link
                  key={p.slug}
                  href={`/person/${p.slug}`}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAFAFB] -mx-2 px-2 rounded-[10px] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-8 w-8 rounded-full bg-opus-gradient text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                      {p.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-medium text-black truncate">
                        {p.name}
                      </div>
                      <div className="text-[11.5px] text-[#808080] truncate">
                        {lead.title}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#fff0f5] text-[#ff4665] text-[12px] font-medium tabular-nums shrink-0">
                    {cents}¢ Yes
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Trade History OR Saved Issuance Drafts */}
        <section className="rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#ff4665]" />
              <h2 className="text-[17px] font-medium tracking-[-0.02em] text-black">
                Recent Account Fills ({fills.length})
              </h2>
            </div>
            {drafts.length > 0 && (
              <Link
                href="/raise"
                className="text-[12px] font-medium text-[#ff4665]"
              >
                {drafts.length} saved issuance draft{drafts.length > 1 ? "s" : ""}
              </Link>
            )}
          </div>

          {fills.length === 0 ? (
            <div className="mt-5 rounded-[14px] bg-[#FAFAFB] p-6 text-center text-[13px] text-[#808080]">
              Your executed trades and realized P&amp;L fills will appear here
              automatically.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-black/[0.05] text-[13px] tabular-nums">
              {fills.slice(0, 7).map((f) => {
                const p = getPersonBySlug(f.personSlug)
                return (
                  <div
                    key={f.id}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-black truncate">
                        {f.action} {f.quantity.toLocaleString()} {f.side} ·{" "}
                        {f.instrument}
                      </div>
                      <div className="text-[11.5px] text-[#808080]">
                        {p?.name ?? f.personName} · @ {f.priceDisplay} · Fee{" "}
                        {formatCurrency(f.fee)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium text-black">
                        {formatCurrency(f.notional)}
                      </div>
                      {typeof f.realizedPnl === "number" && (
                        <div
                          className={`text-[11.5px] font-medium ${
                            f.realizedPnl >= 0
                              ? "text-emerald-600"
                              : "text-[#ff4665]"
                          }`}
                        >
                          {f.realizedPnl >= 0 ? "+" : ""}
                          {formatCurrency(f.realizedPnl)} P&amp;L
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
