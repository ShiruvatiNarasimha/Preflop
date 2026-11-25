"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, ShieldCheck } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  formatCurrency,
  formatMultiplier,
  type FullMilestone,
  type PersonProfile,
} from "./market-catalog"
import { usePreflop } from "./store"

export interface QuickTradeTarget {
  person: PersonProfile
  milestone: FullMilestone
  side: "Yes" | "No"
}

interface QuickTradeDrawerProps {
  target: QuickTradeTarget | null
  onClose: () => void
}

const PRESET_STAKES = [100, 500, 1000, 2500] as const

export function QuickTradeDrawer({ target, onClose }: QuickTradeDrawerProps) {
  const { cashBalance, getMilestoneYesCents, buyMilestone } = usePreflop()
  const [side, setSide] = React.useState<"Yes" | "No">("Yes")
  const [stakeStr, setStakeStr] = React.useState("500")

  React.useEffect(() => {
    if (target) {
      setSide(target.side)
      setStakeStr("500")
    }
  }, [target])

  if (!target) {
    return (
      <Sheet open={false} onOpenChange={() => {}}>
        <SheetContent />
      </Sheet>
    )
  }

  const { person, milestone } = target
  const yesCents = getMilestoneYesCents(milestone.id, milestone.baseYesCents)
  const noCents = 100 - yesCents
  const execCents = side === "Yes" ? yesCents : noCents
  const stake = Math.max(0, Number(stakeStr) || 0)
  const contracts = Math.floor(stake / (execCents / 100 + 0.01))
  const notional = contracts * (execCents / 100)
  const fee = contracts * 0.01
  const totalCost = notional + fee
  const maxPayout = contracts * 1.0
  const estProfit = Math.max(0, maxPayout - totalCost)
  const roiPct = totalCost > 0 ? (estProfit / totalCost) * 100 : 0

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = buyMilestone({
      person,
      milestone,
      side,
      stakeUsd: stake,
    })
    if (ok) {
      onClose()
    }
  }

  return (
    <Sheet open={!!target} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-[430px] bg-white border-l border-black/[0.08] p-0 flex flex-col">
        <div className="p-6 border-b border-black/[0.07]">
          <SheetHeader className="p-0 text-left">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-full bg-opus-gradient text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                {person.initials}
              </span>
              <div className="min-w-0">
                <div className="text-[12px] text-[#808080] truncate">
                  {person.name} · {person.company}
                </div>
                <SheetTitle className="text-[19px] font-medium tracking-[-0.02em] text-black leading-snug">
                  {milestone.title}
                </SheetTitle>
              </div>
            </div>
            <SheetDescription className="mt-2.5 text-[13.5px] leading-[1.45] text-[#666]">
              {milestone.question}
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="flex-1 overflow-y-auto p-6 flex flex-col justify-between gap-6"
        >
          <div className="space-y-5">
            {/* Side Picker */}
            <div>
              <div className="text-[12px] font-medium text-black/60 mb-2">
                Choose Outcome
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSide("Yes")}
                  className={`rounded-[14px] p-3.5 text-left border transition-all cursor-pointer tabular-nums ${
                    side === "Yes"
                      ? "border-[#FF4665] bg-[#fff5f8] shadow-[0_8px_24px_-12px_rgba(255,70,101,0.35)]"
                      : "border-black/[0.09] bg-white hover:border-black/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[13px] font-medium ${
                        side === "Yes" ? "text-[#ff4665]" : "text-black"
                      }`}
                    >
                      Yes
                    </span>
                    <span className="text-[11px] text-[#808080]">
                      {formatMultiplier(yesCents)}
                    </span>
                  </div>
                  <div className="mt-1 text-[22px] font-medium text-black tracking-[-0.02em]">
                    {yesCents}¢
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSide("No")}
                  className={`rounded-[14px] p-3.5 text-left border transition-all cursor-pointer tabular-nums ${
                    side === "No"
                      ? "border-black bg-[#F7F7F8] shadow-[0_8px_24px_-14px_rgba(0,0,0,0.2)]"
                      : "border-black/[0.09] bg-white hover:border-black/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-black">
                      No
                    </span>
                    <span className="text-[11px] text-[#808080]">
                      {formatMultiplier(noCents)}
                    </span>
                  </div>
                  <div className="mt-1 text-[22px] font-medium text-black tracking-[-0.02em]">
                    {noCents}¢
                  </div>
                </button>
              </div>
            </div>

            {/* Stake Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="quick-stake-input"
                  className="text-[12px] font-medium text-black/60"
                >
                  Order Amount (USD)
                </label>
                <span className="text-[12px] text-[#808080] tabular-nums">
                  Buying power: {formatCurrency(cashBalance)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-black/45">
                  $
                </span>
                <input
                  id="quick-stake-input"
                  type="number"
                  min={5}
                  step={5}
                  value={stakeStr}
                  onChange={(e) => setStakeStr(e.target.value)}
                  className="h-[46px] w-full rounded-[14px] border border-black/12 bg-white pl-8 pr-4 text-[16px] font-medium text-black tabular-nums focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>

              <div className="mt-2.5 grid grid-cols-4 gap-2">
                {PRESET_STAKES.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setStakeStr(String(amt))}
                    className={`h-[30px] rounded-full text-[12px] font-medium transition-colors cursor-pointer tabular-nums ${
                      Number(stakeStr) === amt
                        ? "bg-black text-white"
                        : "bg-[#F5F5F6] text-black/75 hover:bg-black/10"
                    }`}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Breakdown */}
            <div className="rounded-[16px] bg-[#F9F9F9] border border-black/[0.06] p-4 space-y-2.5 text-[13px] tabular-nums">
              <div className="flex items-center justify-between">
                <span className="text-[#808080]">Estimated contracts</span>
                <span className="font-medium text-black">
                  {contracts.toLocaleString()} {side}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#808080]">Avg price per contract</span>
                <span className="font-medium text-black">{execCents}¢</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#808080]">Clearing fee (1¢/contract)</span>
                <span className="text-black/75">{formatCurrency(fee)}</span>
              </div>
              <div className="pt-2.5 border-t border-black/[0.06] flex items-center justify-between">
                <span className="text-black font-medium">
                  Max payout if {side}
                </span>
                <span className="text-right">
                  <span className="font-semibold text-black">
                    {formatCurrency(maxPayout)}
                  </span>
                  <span className="ml-1.5 text-[12px] font-medium text-emerald-600">
                    +{roiPct.toFixed(1)}%
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[12px] leading-[1.45] text-[#808080]">
              <ShieldCheck className="h-4 w-4 text-[#ff4665] shrink-0 mt-0.5" />
              <span>
                Closes {milestone.closes} · 23:59 UTC. Resolves Yes on public
                confirmation ({milestone.verificationSource}).
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={contracts < 1 || totalCost > cashBalance}
              className="h-[44px] w-full rounded-full bg-black text-white text-[14.5px] font-medium hover:bg-neutral-800 disabled:opacity-40 transition-colors cursor-pointer tabular-nums"
            >
              Buy {side} · {formatCurrency(totalCost)}
            </button>
            <Link
              href={`/person/${person.slug}?milestone=${milestone.id}&side=${side}`}
              onClick={onClose}
              className="h-[40px] w-full rounded-full border border-black/12 text-[13.5px] font-medium text-black hover:border-black/35 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Full Terminal &amp; Order Book</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
