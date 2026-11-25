"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Activity,
  Bell,
  BookOpen,
  Layers,
  LayoutGrid,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"
import { PreflopEmblem, SectionEyebrow } from "./brand-marks"
import {
  FEATURED_PEOPLE,
  formatPayoutMultiplier,
  type FeaturedPerson,
  type MarketPick,
} from "./data"

interface PlatformsSectionProps {
  onSelectPick: (pick: MarketPick) => void
}

/**
 * Card 1: Live Markets on Real People (all 8 featured Preflop profiles)
 */
function MilestoneMarketsCard({
  person,
  onSelectPerson,
  onSelectPick,
}: {
  person: FeaturedPerson
  onSelectPerson: (id: string) => void
  onSelectPick: (pick: MarketPick) => void
}) {
  const leadMilestone = person.milestones[0]!
  const leadNoCents = 100 - leadMilestone.yesCents
  const chartGradId = React.useId()
  const peakLeftPct = Math.min(72, Math.max(22, (person.peak.x / 280) * 100))

  return (
    <div className="flex flex-col shrink-0 w-full lg:w-[645px]">
      <div className="relative h-[376px] sm:h-[372px] w-full rounded-[20px] overflow-hidden select-none">
        {/* Flowing Pink Silk Backdrop */}
        <img
          src="/media/silk-card-1.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Glass Institutional Trading Desk Shell */}
        <div className="absolute inset-x-3.5 sm:inset-x-5 top-3.5 bottom-3 rounded-[16px] bg-white/30 backdrop-blur-md border border-white/60 shadow-[0_20px_50px_rgba(180,30,80,0.16)] overflow-hidden flex">
          {/* Left Narrow Icon Sidebar */}
          <div className="w-[36px] sm:w-[44px] bg-white/95 border-r border-black/[0.05] py-3 flex flex-col items-center justify-between shrink-0">
            <div className="flex flex-col items-center gap-3.5">
              <div className="h-6 w-6 rounded-[7px] bg-[#fff0f5] flex items-center justify-center">
                <PreflopEmblem gradient className="h-4 w-4" />
              </div>
              <LayoutGrid className="h-3.5 w-3.5 text-black/65" />
              <Activity className="h-3.5 w-3.5 text-black/45" />
              <Layers className="h-3.5 w-3.5 text-black/45" />
              <Shield className="h-3.5 w-3.5 text-black/45" />
            </div>
            <Settings className="h-3.5 w-3.5 text-black/45" />
          </div>

          {/* Right Main Workspace */}
          <div className="flex-1 p-2.5 sm:p-3 flex flex-col gap-2 min-w-0">
            {/* Desk Header Row */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[11px] sm:text-[12px] font-medium text-black/85 truncate">
                  {person.name}
                </span>
                <span className="hidden sm:inline text-[9px] text-black/50 truncate">
                  · {person.company}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 text-[7.5px] font-medium text-black/70 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  LIVE SIM
                </span>
                <span className="h-5 w-5 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                  <Bell className="h-2.5 w-2.5 text-black/70" />
                </span>
                <span className="h-5 w-5 rounded-full bg-gradient-to-tr from-[#ff4665] to-[#fe7ac6] text-[8px] font-semibold text-white flex items-center justify-center">
                  {person.initials}
                </span>
              </div>
            </div>

            {/* Interactive 8-Person Selector Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-white/90 rounded-full px-1.5 py-1 overflow-x-auto no-scrollbar flex-1">
                {FEATURED_PEOPLE.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectPerson(item.id)}
                    className={`px-2 py-0.5 rounded-full text-[8.5px] whitespace-nowrap transition-colors cursor-pointer ${
                      person.id === item.id
                        ? "bg-[#fff0f5] text-[#ff4665] font-medium"
                        : "text-black/65 hover:text-black"
                    }`}
                  >
                    {item.shortTab}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1 w-[96px] shrink-0">
                <Search className="h-2.5 w-2.5 text-black/45" />
                <span className="text-[8.5px] text-black/50 tabular-nums">
                  {person.totalVolume}
                </span>
              </div>
            </div>

            {/* Middle Charts Row */}
            <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
              {/* Lead Milestone Probability Chart */}
              <div className="col-span-8 rounded-[12px] bg-white/95 p-2.5 flex flex-col justify-between shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9.5px] font-medium text-black truncate">
                    {leadMilestone.title}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 rounded-full bg-[#fff5f8] text-[7.5px] font-medium text-[#ff4665] tabular-nums">
                      {leadMilestone.yesCents}% ·{" "}
                      {formatPayoutMultiplier(leadMilestone.yesCents)}
                    </span>
                    <span className="h-4 w-4 rounded bg-[#fff0f5] flex items-center justify-center">
                      <PreflopEmblem gradient className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>

                {/* Dual Yes/No Probability Curve */}
                <div className="relative flex-1 min-h-[76px] pt-3 mt-0.5">
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: [0, -1.5, 0] }}
                    transition={{
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 0.25 },
                    }}
                    style={{ left: `${peakLeftPct}%` }}
                    className="absolute top-0 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-black text-white text-[7.5px] font-medium shadow-sm whitespace-nowrap tabular-nums"
                  >
                    {leadMilestone.yesCents}¢ Yes · {person.leadDelta}
                  </motion.div>

                  <svg
                    viewBox="0 0 280 96"
                    fill="none"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id={chartGradId}
                        x1="140"
                        y1="15"
                        x2="140"
                        y2="92"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset="0%"
                          stopColor="#FE7AC6"
                          stopOpacity="0.28"
                        />
                        <stop
                          offset="100%"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <line
                      x1="0"
                      y1="22"
                      x2="280"
                      y2="22"
                      stroke="#000"
                      strokeOpacity="0.05"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1="0"
                      y1="48"
                      x2="280"
                      y2="48"
                      stroke="#000"
                      strokeOpacity="0.05"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1="0"
                      y1="74"
                      x2="280"
                      y2="74"
                      stroke="#000"
                      strokeOpacity="0.05"
                      strokeDasharray="2 2"
                    />
                    <path d={person.yesAreaPath} fill={`url(#${chartGradId})`} />
                    <path
                      d={person.noPath}
                      stroke="#FE7AC6"
                      strokeWidth="1.2"
                      strokeOpacity="0.65"
                    />
                    <path
                      d={person.yesPath}
                      stroke="#FF4665"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx={person.peak.x}
                      cy={person.peak.y}
                      r="3"
                      fill="#FFF"
                      stroke="#FF4665"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[7.5px] font-medium text-black/55 pt-1">
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>24h</span>
                  <span>Now</span>
                </div>
              </div>

              {/* Right Column: Payout Split (Yes vs No) */}
              <div className="col-span-4 rounded-[12px] bg-white/95 p-2.5 flex flex-col justify-between shadow-xs">
                <div className="text-[8.5px] font-medium text-black leading-tight">
                  Yes vs No Odds
                </div>

                <div className="flex items-end gap-2 pt-2 pb-1">
                  <div className="flex-1 flex flex-col">
                    <span className="text-[7px] text-black/50">Yes</span>
                    <span className="text-[8.5px] font-medium text-black mb-1 tabular-nums">
                      {leadMilestone.yesCents}¢
                    </span>
                    <div className="h-[50px] sm:h-[66px] w-full flex items-end">
                      <motion.div
                        key={`yes-${person.id}`}
                        initial={{ height: "25%" }}
                        animate={{ height: `${leadMilestone.yesCents}%` }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full rounded-[6px] bg-gradient-to-b from-[#FF5D8F] via-[#FE95B8] to-[#FFEBF2]"
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-[7px] text-black/50">No</span>
                    <span className="text-[8.5px] font-medium text-black mb-1 tabular-nums">
                      {leadNoCents}¢
                    </span>
                    <div className="h-[50px] sm:h-[66px] w-full flex items-end">
                      <motion.div
                        key={`no-${person.id}`}
                        initial={{ height: "15%" }}
                        animate={{
                          height: `${Math.max(24, leadNoCents + 14)}%`,
                        }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full rounded-[6px] bg-gradient-to-b from-[#FF99BA] via-[#FFC9DB] to-[#FFF2F6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 text-[7px] text-black/55 pt-1 border-t border-black/[0.05] tabular-nums whitespace-nowrap">
                  <span>{formatPayoutMultiplier(leadMilestone.yesCents)} Yes</span>
                  <span className="hidden sm:inline text-[#ff4665] font-medium">
                    {formatPayoutMultiplier(leadNoCents)} No
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Interactive Milestone Contract Table */}
            <div className="rounded-[12px] bg-white/95 px-2.5 py-2 shadow-xs">
              <div className="grid grid-cols-12 text-[7px] text-black/50 pb-1 border-b border-black/[0.05]">
                <span className="col-span-5">Milestone</span>
                <span className="hidden sm:inline sm:col-span-2">Closes</span>
                <span className="col-span-4 sm:col-span-3">Take a Side</span>
                <span className="col-span-3 sm:col-span-2 text-right">
                  Volume
                </span>
              </div>
              <div className="divide-y divide-black/[0.04] text-[7.5px]">
                {person.milestones.map((m) => {
                  const noCents = 100 - m.yesCents
                  return (
                    <div
                      key={m.id}
                      className="grid grid-cols-12 items-center py-1 text-black/80"
                    >
                      <span className="col-span-5 flex items-center gap-1.5 font-medium truncate pr-1">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${m.dotClass}`}
                        />
                        <span className="truncate">{m.title}</span>
                      </span>
                      <span className="hidden sm:inline sm:col-span-2 text-black/55">
                        {m.closes}
                      </span>
                      <span className="col-span-4 sm:col-span-3 flex items-center gap-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            onSelectPick({
                              personSlug: person.id,
                              personName: person.name,
                              milestoneId: m.id,
                              milestoneTitle: m.title,
                              side: "Yes",
                              priceCents: m.yesCents,
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-[#fff0f5] hover:bg-[#ff4665] text-[#ff4665] hover:text-white font-medium transition-colors cursor-pointer tabular-nums whitespace-nowrap shrink-0"
                        >
                          Y {m.yesCents}¢
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onSelectPick({
                              personSlug: person.id,
                              personName: person.name,
                              milestoneId: m.id,
                              milestoneTitle: m.title,
                              side: "No",
                              priceCents: noCents,
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-black/[0.05] hover:bg-black text-black/75 hover:text-white font-medium transition-colors cursor-pointer tabular-nums whitespace-nowrap shrink-0"
                        >
                          N {noCents}¢
                        </button>
                      </span>
                      <span className="col-span-3 sm:col-span-2 text-right font-mono text-[7px] tabular-nums">
                        {m.volume}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <h3 className="mt-5 text-[18px] font-medium leading-[1.22] tracking-[-0.02em] text-black">
        Live Markets on{" "}
        <span className="text-opus-gradient">Real People</span>
      </h3>
      <p className="mt-2 max-w-[430px] text-[14px] leading-[1.35] text-[#808080]">
        Follow founders, creators, athletes, and artists. Switch people above,
        compare milestone probabilities, and click Yes or No to back your view.
      </p>
    </div>
  )
}

/**
 * Card 2: Preflop's real "Inside the Market" — Live Order Book, Recent Trades & Clear Rules
 * (Built directly on Opusgen's frosted pink-silk vertical card shell, 100% real Preflop product)
 */
function InsideMarketCard({ person }: { person: FeaturedPerson }) {
  const [tab, setTab] = React.useState<"book" | "trades" | "rules">("book")
  const [tickOffset, setTickOffset] = React.useState(0)

  const lead = person.milestones[0]!
  const basePrice = Math.min(92, Math.max(8, lead.yesCents + tickOffset))

  const asks = [
    { price: basePrice + 2, contracts: 1420, depthPct: 82 },
    { price: basePrice + 1, contracts: 890, depthPct: 54 },
  ]
  const bids = [
    { price: basePrice, contracts: 1180, depthPct: 68 },
    { price: basePrice - 1, contracts: 1940, depthPct: 92 },
  ]

  const recentTrades = [
    {
      time: "Just now",
      outcome: "Yes",
      price: `${basePrice}¢`,
      contracts: 250 + Math.abs(tickOffset) * 40,
    },
    {
      time: "18s ago",
      outcome: "No",
      price: `${100 - basePrice}¢`,
      contracts: 140,
    },
    {
      time: "42s ago",
      outcome: "Yes",
      price: `${basePrice}¢`,
      contracts: 480,
    },
    {
      time: "1m ago",
      outcome: "Yes",
      price: `${basePrice - 1}¢`,
      contracts: 310,
    },
  ] as const

  const handleSimulateTick = () => {
    setTickOffset((prev) => (prev === 1 ? -1 : prev + 1))
  }

  return (
    <div className="flex flex-col shrink-0 w-full lg:w-[345px]">
      <div className="relative h-[376px] sm:h-[372px] w-full rounded-[20px] overflow-hidden select-none flex items-center justify-center p-4">
        <img
          src="/media/silk-card-2.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Glass Inside-the-Market Card */}
        <div className="relative z-10 w-full rounded-[16px] bg-white/30 backdrop-blur-md border border-white/60 p-2.5 shadow-[0_20px_48px_rgba(180,30,80,0.18)] flex flex-col gap-2">
          {/* Top Market Status Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-1 rounded-[7px] bg-white text-[9.5px] font-medium text-black shadow-xs tabular-nums">
              Last {basePrice}¢
            </span>
            <span className="px-2 py-1 rounded-[7px] bg-white text-[9.5px] font-medium text-black shadow-xs tabular-nums">
              Spread 1¢
            </span>
            <span className="px-2 py-1 rounded-[7px] bg-white text-[9.5px] font-medium text-[#ff4665] shadow-xs">
              Simulated
            </span>
            <button
              type="button"
              onClick={handleSimulateTick}
              title="Simulate market tick"
              aria-label="Simulate market tick"
              className="ml-auto h-6 w-6 rounded-[7px] bg-white flex items-center justify-center text-black/75 hover:text-[#ff4665] transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          {/* Tabbed Order Book / Trades / Rules Panel */}
          <div className="rounded-[12px] bg-white p-3 shadow-xs">
            <div className="flex items-center gap-3.5 border-b border-black/[0.06] pb-2 text-[10.5px] font-medium">
              {(
                [
                  { id: "book", label: "Order Book" },
                  { id: "trades", label: "Recent Trades" },
                  { id: "rules", label: "Rules" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`transition-colors cursor-pointer rounded px-1 -mx-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff4665] ${
                    tab === item.id
                      ? "text-[#ff4665]"
                      : "text-black/65 hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === "book" && (
              <div className="mt-2.5 space-y-1.5 tabular-nums">
                <div className="grid grid-cols-3 text-[8.5px] text-black/45 px-1">
                  <span>Price</span>
                  <span className="text-right">Contracts</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Ask Depth Rows */}
                <div className="space-y-1">
                  {asks.map((row) => (
                    <div
                      key={`ask-${row.price}`}
                      className="relative grid grid-cols-3 items-center px-1.5 py-1 rounded-[6px] text-[9.5px] overflow-hidden"
                    >
                      <span
                        style={{ width: `${row.depthPct}%` }}
                        className="pointer-events-none absolute inset-y-0 right-0 bg-[#fff0f4]"
                      />
                      <span className="relative z-10 font-medium text-[#ff4665]">
                        {row.price}¢
                      </span>
                      <span className="relative z-10 text-right text-black/75">
                        {row.contracts.toLocaleString()}
                      </span>
                      <span className="relative z-10 text-right font-mono text-[8.5px] text-black/60">
                        ${Math.round((row.price * row.contracts) / 100)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mid Spread Bar */}
                <div className="flex items-center justify-between px-1.5 py-1 rounded-[6px] bg-[#F7F7F8] text-[8.5px] font-medium text-black/70">
                  <span className="truncate pr-2">{lead.title}</span>
                  <span className="shrink-0 text-black">
                    {formatPayoutMultiplier(basePrice)} Yes
                  </span>
                </div>

                {/* Bid Depth Rows */}
                <div className="space-y-1">
                  {bids.map((row) => (
                    <div
                      key={`bid-${row.price}`}
                      className="relative grid grid-cols-3 items-center px-1.5 py-1 rounded-[6px] text-[9.5px] overflow-hidden"
                    >
                      <span
                        style={{ width: `${row.depthPct}%` }}
                        className="pointer-events-none absolute inset-y-0 right-0 bg-[#ecfdf5]"
                      />
                      <span className="relative z-10 font-medium text-emerald-600">
                        {row.price}¢
                      </span>
                      <span className="relative z-10 text-right text-black/75">
                        {row.contracts.toLocaleString()}
                      </span>
                      <span className="relative z-10 text-right font-mono text-[8.5px] text-black/60">
                        ${Math.round((row.price * row.contracts) / 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "trades" && (
              <div className="mt-2.5 space-y-1.5 tabular-nums">
                <div className="grid grid-cols-4 text-[8.5px] text-black/45 px-1">
                  <span>Time</span>
                  <span>Side</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">Qty</span>
                </div>
                <div className="divide-y divide-black/[0.04]">
                  {recentTrades.map((trade, idx) => (
                    <div
                      key={`${trade.time}-${idx}`}
                      className="grid grid-cols-4 items-center py-1.5 px-1 text-[9.5px]"
                    >
                      <span className="text-black/50 text-[8.5px]">
                        {trade.time}
                      </span>
                      <span
                        className={
                          trade.outcome === "Yes"
                            ? "font-medium text-emerald-600"
                            : "font-medium text-[#ff4665]"
                        }
                      >
                        {trade.outcome}
                      </span>
                      <span className="text-right font-medium text-black">
                        {trade.price}
                      </span>
                      <span className="text-right font-mono text-[8.5px] text-black/65">
                        {trade.contracts}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 text-[8px] text-black/45">
                  Illustrative tape for {person.name} · {lead.title}
                </div>
              </div>
            )}

            {tab === "rules" && (
              <div className="mt-2.5 space-y-2.5 text-[10px] leading-[1.48] text-black/75">
                <div className="rounded-[8px] bg-[#F7F7F8] p-2.5">
                  <div className="text-[9.5px] font-medium text-black">
                    {lead.question}
                  </div>
                  <div className="mt-1 text-[8.5px] text-black/50 tabular-nums">
                    Closes {lead.closesFull} · 23:59 UTC · {lead.traders}{" "}
                    traders
                  </div>
                </div>
                <p className="text-[9.5px] text-black/70">
                  Resolves <span className="font-medium text-black">Yes</span>{" "}
                  if the stated milestone is publicly confirmed on or before the
                  close date. An announcement of plans alone does not qualify.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caption */}
      <h3 className="mt-5 text-[18px] font-medium leading-[1.22] tracking-[-0.02em] text-black">
        Inside the Market:{" "}
        <span className="text-opus-gradient">Depth &amp; Clear Rules</span>
      </h3>
      <p className="mt-2 text-[14px] leading-[1.35] text-[#808080]">
        Inspect live Yes/No order book depth, recent trade prints, and objective
        public-confirmation resolution rules before taking a side.
      </p>
    </div>
  )
}

/**
 * Card 3: Preflop's real /raise (Covenant) & /list (Direct Listing) Issuance Preview
 */
function TrajectoryIssuanceCard() {
  const [mode, setMode] = React.useState<"covenant" | "direct">("covenant")
  const areaGradId = React.useId()

  return (
    <div className="flex flex-col shrink-0 w-full lg:w-[645px]">
      <div className="relative h-[376px] sm:h-[372px] w-full rounded-[20px] bg-[#F7F7F7] flex items-center justify-center p-5 sm:p-10 select-none overflow-hidden">
        {/* Centered Elevated Pure-White Workspace Card */}
        <div className="w-full max-w-[445px] rounded-[16px] bg-white p-5 sm:p-6 shadow-[0_14px_40px_rgba(0,0,0,0.04)] border border-black/[0.03] flex flex-col justify-between gap-4">
          {/* Top-Right Issuance Mode Switcher & Term Pill */}
          <div className="self-end w-[88%] sm:w-[80%]">
            <div className="rounded-[12px] bg-[#F6F6F7] px-3.5 py-2.5 text-[11.5px] sm:text-[12.5px] leading-[1.42] text-black/75 tabular-nums">
              {mode === "covenant" ? (
                <>
                  <span className="text-[#ff4665] font-medium">
                    $100K Covenant Raise
                  </span>{" "}
                  · 5% share over 7 years, converting into{" "}
                  <span className="text-black font-medium">
                    2% Trajectory Units
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#ff4665] font-medium">
                    Direct Listing
                  </span>{" "}
                  · 5+ years documented trajectory ·{" "}
                  <span className="text-black font-medium">
                    ≥$250K lifetime output
                  </span>
                </>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setMode("covenant")}
                className={`text-[9.5px] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                  mode === "covenant"
                    ? "bg-[#fff0f5] text-[#ff4665] font-medium"
                    : "text-black/50 hover:text-black"
                }`}
              >
                Raise (Covenant)
              </button>
              <button
                type="button"
                onClick={() => setMode("direct")}
                className={`text-[9.5px] px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                  mode === "direct"
                    ? "bg-[#fff0f5] text-[#ff4665] font-medium"
                    : "text-black/50 hover:text-black"
                }`}
              >
                Direct List
              </button>
              <SlidersHorizontal className="h-3 w-3 text-black/40 ml-0.5" />
            </div>
          </div>

          {/* Bottom-Left Soft Pink-Bordered Trajectory & Safeguards Widget */}
          <div className="self-start w-[90%] sm:w-[80%] rounded-[14px] bg-[#FFF8FB] border border-[#ff4665]/12 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="text-[11px] sm:text-[12px] font-medium text-black tabular-nums">
                {mode === "covenant" ? (
                  <>
                    Builder Retains:{" "}
                    <span className="text-[#ff4665]">≥75% Forever</span>
                  </>
                ) : (
                  <>
                    Hard Ownership Cap:{" "}
                    <span className="text-[#ff4665]">≤25% Listed</span>
                  </>
                )}
              </div>
              <ShieldCheck className="h-3.5 w-3.5 text-[#ff4665] shrink-0" />
            </div>

            <div className="rounded-[10px] bg-white p-2.5 border border-black/[0.03]">
              <svg
                viewBox="0 0 240 86"
                fill="none"
                className="w-full h-[76px]"
              >
                <defs>
                  <linearGradient
                    id={areaGradId}
                    x1="120"
                    y1="12"
                    x2="120"
                    y2="72"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#FE7AC6" stopOpacity="0.38" />
                    <stop
                      offset="100%"
                      stopColor="#FF4665"
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                </defs>
                <text x="2" y="14" fontSize="6.5" fill="#9A9A9A">
                  25%
                </text>
                <text x="2" y="34" fontSize="6.5" fill="#9A9A9A">
                  15%
                </text>
                <text x="2" y="53" fontSize="6.5" fill="#9A9A9A">
                  5%
                </text>
                <text x="2" y="71" fontSize="6.5" fill="#9A9A9A">
                  0
                </text>

                <line
                  x1="22"
                  y1="12"
                  x2="232"
                  y2="12"
                  stroke="#F0F0F2"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="32"
                  x2="232"
                  y2="32"
                  stroke="#F0F0F2"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="51"
                  x2="232"
                  y2="51"
                  stroke="#F0F0F2"
                  strokeWidth="1"
                />
                <line
                  x1="22"
                  y1="70"
                  x2="232"
                  y2="70"
                  stroke="#F0F0F2"
                  strokeWidth="1"
                />

                <path
                  d="M28 66 C 46 62, 58 52, 74 50 C 94 48, 110 38, 126 32 C 144 26, 160 34, 178 24 C 198 14, 214 20, 232 16 L 232 70 L 28 70 Z"
                  fill={`url(#${areaGradId})`}
                />
                <motion.path
                  d="M28 66 C 46 62, 58 52, 74 50 C 94 48, 110 38, 126 32 C 144 26, 160 34, 178 24 C 198 14, 214 20, 232 16"
                  stroke="#FF5992"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0.2 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {[
                  [56, 54],
                  [94, 44],
                  [126, 32],
                  [178, 24],
                  [214, 18],
                ].map(([cx, cy]) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r="2.4"
                    fill="#FFFFFF"
                    stroke="#FF5992"
                    strokeWidth="1.2"
                  />
                ))}

                {[
                  [28, "Yr 1"],
                  [70, "Yr 3"],
                  [116, "Yr 5"],
                  [164, "Yr 7"],
                  [206, "Units"],
                ].map(([x, label]) => (
                  <text
                    key={String(label)}
                    x={Number(x)}
                    y="82"
                    fontSize="6.5"
                    fill="#9A9A9A"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>

            <div className="mt-2 flex items-center justify-between text-[8.5px] text-black/55">
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-2.5 w-2.5 text-[#ff4665]" />
                Consent-first listing
              </span>
              <span>Never health, family, or legal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <h3 className="mt-5 text-[18px] font-medium leading-[1.22] tracking-[-0.02em] text-black">
        Raise or Direct List{" "}
        <span className="text-opus-gradient">Your Trajectory</span>
      </h3>
      <p className="mt-2 max-w-[440px] text-[14px] leading-[1.35] text-[#808080]">
        Model a finite Covenant raise against your future potential or Direct
        List perpetual Trajectory Units—with explicit consent and a hard 25%
        cap.
      </p>
    </div>
  )
}

export function PlatformsSection({ onSelectPick }: PlatformsSectionProps) {
  const [selectedPersonId, setSelectedPersonId] = React.useState(
    FEATURED_PEOPLE[0]!.id
  )
  const activePerson =
    FEATURED_PEOPLE.find((p) => p.id === selectedPersonId) ??
    FEATURED_PEOPLE[0]!

  const trackSectionRef = React.useRef<HTMLDivElement>(null)
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [maxTravel, setMaxTravel] = React.useState(560)

  React.useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current
      const content = contentRef.current
      if (!vp || !content) return
      const overflow = Math.max(0, content.scrollWidth - vp.clientWidth)
      setMaxTravel(overflow > 0 ? overflow : 560)
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (viewportRef.current) observer.observe(viewportRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    window.addEventListener("resize", measure)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackSectionRef,
    offset: ["start start", "end end"],
  })

  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -maxTravel])

  return (
    <section id="platforms" className="bg-white">
      {/* Desktop Sticky Scroll-Driven Horizontal Track */}
      <div ref={trackSectionRef} className="hidden lg:block relative h-[215vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div ref={viewportRef} className="opus-container px-8 xl:px-0">
            {/* 2-Column Split Section Header */}
            <div className="flex items-end justify-between gap-8 mb-11">
              <div>
                <SectionEyebrow text="Inside Preflop" />
                <h2 className="mt-4 text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
                  Three Views.
                  <br />
                  One Human Capital Market
                </h2>
              </div>
              <p className="max-w-[330px] text-[16px] leading-[1.3] text-[#808080] pb-1">
                Live milestone markets, transparent order books, and
                consent-first trajectory issuance
              </p>
            </div>

            {/* Horizontal Sliding Track */}
            <motion.div
              ref={contentRef}
              style={{ x }}
              className="flex items-start gap-6 will-change-transform w-max"
            >
              <MilestoneMarketsCard
                person={activePerson}
                onSelectPerson={setSelectedPersonId}
                onSelectPick={onSelectPick}
              />
              <InsideMarketCard person={activePerson} />
              <TrajectoryIssuanceCard />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Carousel View */}
      <div className="lg:hidden py-16 px-5 md:px-8">
        <div className="opus-container">
          <SectionEyebrow text="Inside Preflop" />
          <h2 className="mt-4 text-[32px] sm:text-[36px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
            Three Views.
            <br />
            One Human Capital Market
          </h2>
          <p className="mt-3 max-w-[340px] text-[15px] leading-[1.3] text-[#808080]">
            Live milestone markets, transparent order books, and consent-first
            trajectory issuance
          </p>

          <Carousel
            opts={{ align: "start", loop: false }}
            className="mt-9 w-full"
          >
            <CarouselContent className="-ml-4">
              <CarouselItem className="pl-4 basis-[94%] sm:basis-[82%]">
                <MilestoneMarketsCard
                  person={activePerson}
                  onSelectPerson={setSelectedPersonId}
                  onSelectPick={onSelectPick}
                />
              </CarouselItem>
              <CarouselItem className="pl-4 basis-[94%] sm:basis-[68%]">
                <InsideMarketCard person={activePerson} />
              </CarouselItem>
              <CarouselItem className="pl-4 basis-[94%] sm:basis-[82%]">
                <TrajectoryIssuanceCard />
              </CarouselItem>
            </CarouselContent>

            <div className="mt-6 flex items-center justify-end gap-2">
              <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-full border-[#d6d6d6] bg-white text-black hover:bg-neutral-100" />
              <CarouselNext className="static translate-y-0 h-9 w-9 rounded-full border-[#d6d6d6] bg-white text-black hover:bg-neutral-100" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
