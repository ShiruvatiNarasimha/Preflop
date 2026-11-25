"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Layers,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  ConvictionRadarChart,
  MilestoneTradingChart,
  TrajectoryTradingChart,
  type CrosshairReadout,
} from "./charts"
import {
  formatCompactVolume,
  formatCurrency,
  formatMultiplier,
  generateTradingViewCandles,
  generateTradingViewProbabilitySeries,
  generateTrajectoryPriceSeries,
  type PersonProfile,
  type TimeframeKey,
} from "./market-catalog"
import { usePreflop } from "./store"

interface PersonTerminalProps {
  person: PersonProfile
}

const PRESET_AMOUNTS = [100, 500, 1000, 2500] as const

export function PersonTerminal({ person }: PersonTerminalProps) {
  const searchParams = useSearchParams()
  const {
    user,
    cashBalance,
    toggleWatchlist,
    getMilestoneYesCents,
    getMilestoneVolume,
    getTrajectoryPrice,
    milestonePositions,
    trajectoryPositions,
    liveTape,
    buyMilestone,
    sellMilestone,
    buyTrajectoryUnits,
    sellTrajectoryUnits,
  } = usePreflop()

  const initialView =
    searchParams.get("view") === "trajectory" ? "trajectory" : "milestones"
  const initialMilestoneId = searchParams.get("milestone")
  const initialSide = searchParams.get("side") === "No" ? "No" : "Yes"

  const [marketMode, setMarketMode] = React.useState<
    "milestones" | "trajectory"
  >(initialView)
  const [selectedMilestoneId, setSelectedMilestoneId] = React.useState(
    person.milestones.some((m) => m.id === initialMilestoneId)
      ? initialMilestoneId!
      : person.milestones[0]!.id
  )
  const [chartMode, setChartMode] = React.useState<
    "compare" | "price" | "candles"
  >("price")
  const [timeframe, setTimeframe] = React.useState<TimeframeKey>("1M")
  const [crosshair, setCrosshair] = React.useState<CrosshairReadout | null>(
    null
  )
  const [trajCrosshair, setTrajCrosshair] =
    React.useState<CrosshairReadout | null>(null)
  const [bookSide, setBookSide] = React.useState<"Yes" | "No">("Yes")

  // Order ticket state
  const [ticketAction, setTicketAction] = React.useState<"Buy" | "Sell">("Buy")
  const [orderType, setOrderType] = React.useState<"Market" | "Limit">("Market")
  const [outcomeSide, setOutcomeSide] = React.useState<"Yes" | "No">(
    initialSide
  )
  const [stakeStr, setStakeStr] = React.useState("500")
  const [limitCentsStr, setLimitCentsStr] = React.useState("")
  const [sellQtyStr, setSellQtyStr] = React.useState("")
  const [trajAction, setTrajAction] = React.useState<"Buy" | "Sell">("Buy")
  const [trajUnitsStr, setTrajUnitsStr] = React.useState("10")

  const activeMilestone =
    person.milestones.find((m) => m.id === selectedMilestoneId) ??
    person.milestones[0]!
  const activeYesCents = getMilestoneYesCents(
    activeMilestone.id,
    activeMilestone.baseYesCents
  )
  const activeNoCents = 100 - activeYesCents
  const activeVolume = getMilestoneVolume(
    activeMilestone.id,
    activeMilestone.baseVolume
  )

  const currentMarketCents =
    outcomeSide === "Yes" ? activeYesCents : activeNoCents
  const effectiveLimitCents =
    orderType === "Limit"
      ? Math.max(1, Math.min(99, Number(limitCentsStr) || currentMarketCents))
      : currentMarketCents

  React.useEffect(() => {
    setLimitCentsStr(String(currentMarketCents))
  }, [activeMilestone.id, outcomeSide, currentMarketCents])

  const activePosition = milestonePositions.find(
    (p) =>
      p.personSlug === person.slug &&
      p.milestoneId === activeMilestone.id &&
      p.side === outcomeSide
  )

  React.useEffect(() => {
    if (activePosition) {
      setSellQtyStr(String(activePosition.contracts))
    } else {
      setSellQtyStr("")
    }
  }, [activePosition])

  const trajPosition = trajectoryPositions.find(
    (p) => p.personSlug === person.slug
  )
  const trajSpot = getTrajectoryPrice(person.slug, person.trajectory.spotPrice)

  // High-density TradingView series
  const activeTvSeries = React.useMemo(
    () =>
      generateTradingViewProbabilitySeries(
        activeMilestone.id,
        activeYesCents,
        activeMilestone.delta24h,
        timeframe
      ),
    [activeMilestone.id, activeMilestone.delta24h, activeYesCents, timeframe]
  )

  const activeTvCandles = React.useMemo(
    () =>
      generateTradingViewCandles(
        activeMilestone.id,
        activeYesCents,
        activeMilestone.delta24h,
        timeframe
      ),
    [activeMilestone.id, activeMilestone.delta24h, activeYesCents, timeframe]
  )

  const compareTvSeries = React.useMemo(
    () =>
      person.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        color: m.seriesColor,
        isActive: m.id === activeMilestone.id,
        data: generateTradingViewProbabilitySeries(
          m.id,
          getMilestoneYesCents(m.id, m.baseYesCents),
          m.delta24h,
          timeframe
        ),
      })),
    [person.milestones, activeMilestone.id, timeframe, getMilestoneYesCents]
  )

  const trajTvSeries = React.useMemo(
    () =>
      generateTrajectoryPriceSeries(
        person.slug,
        trajSpot,
        person.trajectory.change24hPct,
        timeframe
      ),
    [person.slug, person.trajectory.change24hPct, trajSpot, timeframe]
  )

  // Dynamic two-sided order book
  const bookCenter = bookSide === "Yes" ? activeYesCents : activeNoCents
  const asks = [5, 4, 3, 2, 1]
    .map((offset) => {
      const price = Math.min(99, bookCenter + offset)
      const contracts = 620 + offset * 240 + activeMilestone.index * 85
      return { price, contracts, total: (price / 100) * contracts }
    })
    .filter(
      (row, idx, arr) => arr.findIndex((r) => r.price === row.price) === idx
    )

  const bids = [0, 1, 2, 3, 4]
    .map((offset) => {
      const price = Math.max(1, bookCenter - offset)
      const contracts = 780 + offset * 290 + activeMilestone.index * 70
      return { price, contracts, total: (price / 100) * contracts }
    })
    .filter(
      (row, idx, arr) => arr.findIndex((r) => r.price === row.price) === idx
    )

  const maxDepth = Math.max(
    ...asks.map((a) => a.contracts),
    ...bids.map((b) => b.contracts),
    1
  )

  const personTrades = React.useMemo(() => {
    const matched = liveTape.filter((t) => t.personSlug === person.slug)
    return matched.length >= 3 ? matched.slice(0, 8) : liveTape.slice(0, 8)
  }, [liveTape, person.slug])

  // Buy math
  const stakeUsd = Math.max(0, Number(stakeStr) || 0)
  const estContracts = Math.floor(stakeUsd / (effectiveLimitCents / 100 + 0.01))
  const estNotional = estContracts * (effectiveLimitCents / 100)
  const estFee = estContracts * 0.01
  const estTotalDebit = estNotional + estFee
  const estMaxPayout = estContracts
  const estProfit = Math.max(0, estMaxPayout - estTotalDebit)
  const estRoi = estTotalDebit > 0 ? (estProfit / estTotalDebit) * 100 : 0

  // Trajectory math
  const trajUnits = Math.max(0, Math.floor(Number(trajUnitsStr) || 0))
  const trajNotional = trajUnits * trajSpot
  const trajFee = trajNotional * 0.0025
  const trajTebPct = trajUnits * person.trajectory.tebPerUnitPct

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ticketAction === "Buy") {
      buyMilestone({
        person,
        milestone: activeMilestone,
        side: outcomeSide,
        stakeUsd,
        limitPriceCents:
          orderType === "Limit" ? effectiveLimitCents : undefined,
      })
    } else if (activePosition) {
      sellMilestone(
        activePosition.key,
        Number(sellQtyStr) || activePosition.contracts
      )
    }
  }

  const handleTrajectorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trajAction === "Buy") {
      buyTrajectoryUnits({ person, units: trajUnits })
    } else if (trajPosition) {
      sellTrajectoryUnits(person.slug, trajUnits || trajPosition.units)
    }
  }

  const isFollowed = user.watchlist.includes(person.slug)
  const personTotalVol = person.milestones.reduce(
    (sum, m) => sum + getMilestoneVolume(m.id, m.baseVolume),
    0
  )

  const displayedCents = crosshair?.value ?? activeYesCents
  const displayedTraj = trajCrosshair?.value ?? trajSpot

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Person Profile Card */}
      <Card className="rounded-[20px] bg-white ring-1 ring-black/[0.07] py-5">
        <CardContent className="px-5 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-4 max-w-[660px]">
              <Avatar size="lg" className="h-14 w-14 shrink-0">
                <AvatarFallback className="bg-opus-gradient text-white text-[17px] font-semibold">
                  {person.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[26px] sm:text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
                    {person.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="bg-[#fff5f8] text-[#ff4665] border border-[#ff4665]/15"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Charter Verified
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => toggleWatchlist(person.slug)}
                    className={`rounded-full cursor-pointer ${
                      isFollowed
                        ? "border-[#ff4665]/30 bg-[#fff5f8] text-[#ff4665] hover:bg-[#ffedf4]"
                        : ""
                    }`}
                  >
                    <Star
                      className="h-3 w-3"
                      fill={isFollowed ? "currentColor" : "none"}
                    />
                    <span>{isFollowed ? "Following" : "Follow"}</span>
                  </Button>
                </div>
                <div className="mt-1 text-[13.5px] font-medium text-black/65">
                  {person.role} · {person.company}
                </div>
                <p className="mt-2 text-[13.5px] leading-[1.5] text-[#666]">
                  {person.bio}
                </p>
                <div className="mt-1.5 text-[11.5px] text-[#808080]">
                  {person.credentials}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              {/* Two-Layer Preflop Switcher */}
              <div className="inline-flex items-center bg-[#F4F4F6] rounded-full p-1 text-[12.5px]">
                <button
                  type="button"
                  onClick={() => setMarketMode("milestones")}
                  className={`h-[30px] px-4 rounded-full font-medium transition-colors cursor-pointer ${
                    marketMode === "milestones"
                      ? "bg-black text-white shadow-xs"
                      : "text-black/65 hover:text-black"
                  }`}
                >
                  Milestones (5)
                </button>
                <button
                  type="button"
                  onClick={() => setMarketMode("trajectory")}
                  className={`h-[30px] px-4 rounded-full font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 tabular-nums ${
                    marketMode === "trajectory"
                      ? "bg-black text-white shadow-xs"
                      : "text-black/65 hover:text-black"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>
                    {person.trajectory.ticker} · {formatCurrency(trajSpot)}
                  </span>
                </button>
              </div>

              {/* Verified Track Record Facts */}
              <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto sm:min-w-[320px]">
                {person.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[12px] bg-[#FAFAFB] border border-black/[0.06] px-3 py-2.5"
                  >
                    <div className="text-[16px] font-medium text-black tracking-[-0.02em] tabular-nums">
                      {fact.value}
                    </div>
                    <div className="text-[10.5px] leading-[1.3] text-[#808080]">
                      {fact.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main 2-Column Institutional Workspace */}
      {marketMode === "milestones" ? (
        <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_356px] gap-5 items-start">
          {/* Left Column: TradingView Chart + All 5 Milestones + Order Book/Trades/Rules/Charter */}
          <div className="space-y-5 min-w-0">
            {/* TradingView Lightweight Charts Terminal Card */}
            <Card className="rounded-[20px] bg-white ring-1 ring-black/[0.07] py-5">
              <CardContent className="px-5 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11.5px] font-medium text-[#808080] tabular-nums">
                      <span className="text-[#ff4665]">
                        MILESTONE 0{activeMilestone.index}
                      </span>
                      <span>·</span>
                      <span>Closes {activeMilestone.closes}</span>
                      <span>·</span>
                      <span>{formatCompactVolume(activeVolume)} vol</span>
                    </div>
                    <h2 className="mt-1.5 text-[19px] sm:text-[21px] font-medium tracking-[-0.02em] text-black leading-[1.24]">
                      {activeMilestone.question}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-baseline gap-3 tabular-nums">
                      <span className="text-[32px] font-medium tracking-[-0.03em] text-black">
                        {displayedCents}%{" "}
                        <span className="text-[15px] font-normal text-[#808080]">
                          chance
                        </span>
                      </span>
                      <span
                        className={`text-[13px] font-medium ${
                          activeMilestone.delta24h >= 0
                            ? "text-emerald-600"
                            : "text-[#ff4665]"
                        }`}
                      >
                        {activeMilestone.delta24h >= 0 ? "▲ +" : "▼ "}
                        {activeMilestone.delta24h} pts (24h)
                      </span>
                      {crosshair && (
                        <span className="text-[11.5px] font-mono text-[#71717A]">
                          {crosshair.timeLabel} UTC
                          {crosshair.ohlc
                            ? ` · O ${crosshair.ohlc.open}¢ H ${crosshair.ohlc.high}¢ L ${crosshair.ohlc.low}¢ C ${crosshair.ohlc.close}¢`
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chart Controls */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <Tabs
                      value={chartMode}
                      onValueChange={(v) =>
                        setChartMode(v as "compare" | "price" | "candles")
                      }
                    >
                      <TabsList className="rounded-full bg-[#F4F4F6] p-0.5 h-8">
                        <TabsTrigger
                          value="price"
                          className="rounded-full px-3 text-[11.5px] cursor-pointer"
                        >
                          Area
                        </TabsTrigger>
                        <TabsTrigger
                          value="candles"
                          className="rounded-full px-3 text-[11.5px] cursor-pointer"
                        >
                          Candles
                        </TabsTrigger>
                        <TabsTrigger
                          value="compare"
                          className="rounded-full px-3 text-[11.5px] cursor-pointer"
                        >
                          Compare 5
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-1 text-[11.5px]">
                      {(["1D", "1W", "1M", "All"] as const).map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setTimeframe(tf)}
                          className={`px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                            timeframe === tf
                              ? "bg-[#fff0f5] text-[#ff4665]"
                              : "text-[#808080] hover:text-black"
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real TradingView Canvas */}
                <div className="mt-4">
                  <MilestoneTradingChart
                    mode={chartMode}
                    activeSeries={activeTvSeries}
                    candles={activeTvCandles}
                    compareSeries={compareTvSeries}
                    onCrosshairMove={setCrosshair}
                  />
                </div>

                {/* Compare Mode Series Selector Legend */}
                {chartMode === "compare" && (
                  <div className="mt-3 pt-3 border-t border-black/[0.06] flex flex-wrap items-center gap-2">
                    {person.milestones.map((m) => {
                      const cents = getMilestoneYesCents(m.id, m.baseYesCents)
                      const isFocus = m.id === activeMilestone.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMilestoneId(m.id)}
                          className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium flex items-center gap-1.5 border transition-colors cursor-pointer tabular-nums ${
                            isFocus
                              ? "border-black bg-black text-white"
                              : "border-black/[0.08] bg-[#FAFAFB] text-black/75 hover:border-black/25"
                          }`}
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: m.seriesColor }}
                          />
                          <span>{m.title}</span>
                          <span
                            className={
                              isFocus ? "text-white/80" : "text-black/50"
                            }
                          >
                            {cents}%
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All 5 Milestones Interactive Card */}
            <Card className="rounded-[20px] bg-white ring-1 ring-black/[0.07] py-5">
              <CardHeader className="px-5 sm:px-6 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-[16px] font-medium tracking-[-0.02em] text-black">
                  All Milestones ({person.milestones.length})
                </CardTitle>
                <span className="text-[12px] text-[#808080] tabular-nums">
                  Total volume: {formatCompactVolume(personTotalVol)}
                </span>
              </CardHeader>
              <CardContent className="px-5 sm:px-6">
                <div className="divide-y divide-black/[0.05]">
                  {person.milestones.map((m) => {
                    const yesCents = getMilestoneYesCents(m.id, m.baseYesCents)
                    const noCents = 100 - yesCents
                    const isSelected = m.id === activeMilestone.id
                    const myYes = milestonePositions.find(
                      (p) =>
                        p.personSlug === person.slug &&
                        p.milestoneId === m.id &&
                        p.side === "Yes"
                    )
                    const myNo = milestonePositions.find(
                      (p) =>
                        p.personSlug === person.slug &&
                        p.milestoneId === m.id &&
                        p.side === "No"
                    )

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMilestoneId(m.id)}
                        className={`py-3 px-3 -mx-3 rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected ? "bg-[#FFF8FB]" : "hover:bg-[#FAFAFB]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: m.seriesColor }}
                            />
                            <span className="text-[14px] font-medium text-black truncate">
                              {m.title}
                            </span>
                            {myYes && (
                              <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[10.5px] tabular-nums">
                                You: {myYes.contracts} Yes
                              </Badge>
                            )}
                            {myNo && (
                              <Badge className="bg-[#fff0f5] text-[#ff4665] hover:bg-[#fff0f5] text-[10.5px] tabular-nums">
                                You: {myNo.contracts} No
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 pl-4.5 flex flex-wrap items-center gap-2.5 text-[12px] text-[#808080] tabular-nums">
                            <span className="font-medium text-black">
                              {yesCents}%
                            </span>
                            <span
                              className={
                                m.delta24h >= 0
                                  ? "text-emerald-600"
                                  : "text-[#ff4665]"
                              }
                            >
                              {m.delta24h >= 0 ? "+" : ""}
                              {m.delta24h} pts
                            </span>
                            <span>·</span>
                            <span>Closes {m.closes}</span>
                            <span>·</span>
                            <span>
                              {formatCompactVolume(
                                getMilestoneVolume(m.id, m.baseVolume)
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pl-4.5 sm:pl-0 shrink-0 tabular-nums">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMilestoneId(m.id)
                              setOutcomeSide("Yes")
                              setTicketAction("Buy")
                            }}
                            className={`h-8 px-3.5 rounded-full text-[12px] font-medium cursor-pointer ${
                              isSelected && outcomeSide === "Yes"
                                ? "bg-[#ff4665] text-white hover:bg-[#e53554] hover:text-white"
                                : "bg-[#fff0f5] text-[#ff4665] hover:bg-[#ff4665] hover:text-white"
                            }`}
                          >
                            Yes {yesCents}¢
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMilestoneId(m.id)
                              setOutcomeSide("No")
                              setTicketAction("Buy")
                            }}
                            className={`h-8 px-3.5 rounded-full text-[12px] font-medium cursor-pointer ${
                              isSelected && outcomeSide === "No"
                                ? "bg-black text-white hover:bg-neutral-800 hover:text-white"
                                : "bg-[#F4F4F6] text-black/80 hover:bg-black hover:text-white"
                            }`}
                          >
                            No {noCents}¢
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Inside the Market: Order Book / Recent Trades / Rules / Charter using shadcn Tabs */}
            <Card className="rounded-[20px] bg-white ring-1 ring-black/[0.07] py-5">
              <CardContent className="px-5 sm:px-6">
                <Tabs defaultValue="book">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
                    <TabsList className="bg-[#F4F4F6] rounded-full p-0.5 h-8">
                      <TabsTrigger
                        value="book"
                        className="rounded-full px-3 text-[12.5px] cursor-pointer"
                      >
                        Order Book
                      </TabsTrigger>
                      <TabsTrigger
                        value="trades"
                        className="rounded-full px-3 text-[12.5px] cursor-pointer"
                      >
                        Recent Trades
                      </TabsTrigger>
                      <TabsTrigger
                        value="rules"
                        className="rounded-full px-3 text-[12.5px] cursor-pointer"
                      >
                        Rules
                      </TabsTrigger>
                      <TabsTrigger
                        value="charter"
                        className="rounded-full px-3 text-[12.5px] cursor-pointer"
                      >
                        Charter
                      </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center bg-[#F4F4F6] rounded-full p-0.5 text-[11.5px]">
                      {(["Yes", "No"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBookSide(s)}
                          className={`px-3 py-1 rounded-full font-medium cursor-pointer ${
                            bookSide === s
                              ? "bg-white text-black shadow-xs"
                              : "text-black/55"
                          }`}
                        >
                          {s} Book
                        </button>
                      ))}
                    </div>
                  </div>

                  <TabsContent value="book" className="mt-4 tabular-nums">
                    <div className="grid grid-cols-3 text-[11.5px] text-[#808080] px-2 pb-2">
                      <span>Price ({bookSide})</span>
                      <span className="text-right">Contracts</span>
                      <span className="text-right">Total</span>
                    </div>

                    <div className="space-y-1">
                      {asks.map((row) => (
                        <button
                          key={`ask-${row.price}`}
                          type="button"
                          onClick={() => {
                            setOutcomeSide(bookSide)
                            setOrderType("Limit")
                            setLimitCentsStr(String(row.price))
                          }}
                          title="Click to populate Limit order price"
                          className="w-full relative grid grid-cols-3 items-center px-2.5 py-1.5 rounded-[8px] text-[13px] overflow-hidden hover:ring-1 hover:ring-[#ff4665]/40 transition-all cursor-pointer"
                        >
                          <span
                            style={{
                              width: `${(row.contracts / maxDepth) * 100}%`,
                            }}
                            className="pointer-events-none absolute inset-y-0 right-0 bg-[#fff0f4]"
                          />
                          <span className="relative z-10 text-left font-medium text-[#ff4665]">
                            {row.price}¢
                          </span>
                          <span className="relative z-10 text-right text-black/80">
                            {row.contracts.toLocaleString()}
                          </span>
                          <span className="relative z-10 text-right font-mono text-[12px] text-black/65">
                            {formatCurrency(row.total, 0)}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="my-2 px-3 py-2 rounded-[10px] bg-[#F7F7F8] flex items-center justify-between text-[12px]">
                      <span className="font-medium text-black">
                        Last {bookCenter}¢
                      </span>
                      <span className="text-[#808080]">
                        Spread {person.spreadCents}¢ · Click any level to set
                        limit price
                      </span>
                    </div>

                    <div className="space-y-1">
                      {bids.map((row) => (
                        <button
                          key={`bid-${row.price}`}
                          type="button"
                          onClick={() => {
                            setOutcomeSide(bookSide)
                            setOrderType("Limit")
                            setLimitCentsStr(String(row.price))
                          }}
                          title="Click to populate Limit order price"
                          className="w-full relative grid grid-cols-3 items-center px-2.5 py-1.5 rounded-[8px] text-[13px] overflow-hidden hover:ring-1 hover:ring-emerald-500/40 transition-all cursor-pointer"
                        >
                          <span
                            style={{
                              width: `${(row.contracts / maxDepth) * 100}%`,
                            }}
                            className="pointer-events-none absolute inset-y-0 right-0 bg-[#ecfdf5]"
                          />
                          <span className="relative z-10 text-left font-medium text-emerald-600">
                            {row.price}¢
                          </span>
                          <span className="relative z-10 text-right text-black/80">
                            {row.contracts.toLocaleString()}
                          </span>
                          <span className="relative z-10 text-right font-mono text-[12px] text-black/65">
                            {formatCurrency(row.total, 0)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="trades"
                    className="mt-4 divide-y divide-black/[0.05] text-[13px] tabular-nums"
                  >
                    <div className="grid grid-cols-4 pb-2 text-[11.5px] text-[#808080]">
                      <span>Time</span>
                      <span>Contract</span>
                      <span className="text-right">Side / Price</span>
                      <span className="text-right">Size</span>
                    </div>
                    {personTrades.map((t) => (
                      <div
                        key={t.id}
                        className="py-2.5 grid grid-cols-4 items-center gap-2"
                      >
                        <span className="text-[#808080] flex items-center gap-1.5">
                          {t.isUser && (
                            <Badge className="bg-[#ff4665] text-white text-[9.5px] px-1.5 h-4">
                              YOU
                            </Badge>
                          )}
                          <span>{t.timestamp}</span>
                        </span>
                        <span className="text-black font-medium truncate">
                          {t.instrument}
                        </span>
                        <span
                          className={`text-right font-medium ${
                            t.side === "No"
                              ? "text-[#ff4665]"
                              : "text-emerald-600"
                          }`}
                        >
                          {t.action} {t.side} · {t.priceDisplay}
                        </span>
                        <span className="text-right font-mono text-[12px] text-black/75">
                          {t.quantity.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent
                    value="rules"
                    className="mt-4 space-y-4 text-[13.5px] leading-[1.55] text-[#555]"
                  >
                    <div className="rounded-[14px] bg-[#FAFAFB] border border-black/[0.06] p-4">
                      <div className="text-[11px] uppercase tracking-[0.06em] text-[#808080]">
                        Resolution Criteria
                      </div>
                      <p className="mt-1.5 text-black font-medium">
                        Resolves Yes if &ldquo;{activeMilestone.title}&rdquo; is
                        publicly confirmed on or before {activeMilestone.closes}{" "}
                        at 23:59 UTC. An announcement of plans alone does not
                        qualify.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12.5px]">
                      <div className="rounded-[12px] border border-black/[0.06] p-3">
                        <div className="text-[#808080] text-[11px]">
                          Primary Source
                        </div>
                        <div className="mt-1 text-black font-medium">
                          {activeMilestone.verificationSource}
                        </div>
                      </div>
                      <div className="rounded-[12px] border border-black/[0.06] p-3">
                        <div className="text-[#808080] text-[11px]">
                          Cutoff Time
                        </div>
                        <div className="mt-1 text-black font-medium tabular-nums">
                          {activeMilestone.closes} · 23:59 UTC
                        </div>
                      </div>
                      <div className="rounded-[12px] border border-black/[0.06] p-3">
                        <div className="text-[#808080] text-[11px]">
                          Settlement Value
                        </div>
                        <div className="mt-1 text-black font-medium">
                          $1.00 per winning contract
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="charter"
                    className="mt-4 space-y-3 text-[13.5px] leading-[1.55] text-[#555]"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#ff4665] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-black">
                          Explicit Issuer Consent:
                        </strong>{" "}
                        Every listed individual approves their market charter
                        and permitted milestone scope before live trading opens.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#ff4665] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-black">
                          Hard ≤25% Ownership Cap:
                        </strong>{" "}
                        Across Covenants and Direct Listings combined, every
                        builder permanently retains at least 75% of their Total
                        Economic Benefit.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#ff4665] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-black">
                          Permanent Red Lines:
                        </strong>{" "}
                        Preflop will never list health or injury, relationships
                        or family, legal matters, or any unapproved topic.
                      </span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Sticky Institutional Order Ticket */}
          <Card className="xl:sticky xl:top-[78px] rounded-[20px] bg-white ring-1 ring-black/[0.08] py-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.16)]">
            <CardContent className="px-5">
              <div className="flex items-center justify-between">
                <Tabs
                  value={ticketAction}
                  onValueChange={(v) => setTicketAction(v as "Buy" | "Sell")}
                >
                  <TabsList className="rounded-full bg-[#F4F4F6] p-0.5 h-8">
                    <TabsTrigger
                      value="Buy"
                      className="rounded-full px-4 text-[12.5px] cursor-pointer"
                    >
                      Buy
                    </TabsTrigger>
                    <TabsTrigger
                      value="Sell"
                      className="rounded-full px-4 text-[12.5px] cursor-pointer"
                    >
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-1 text-[12px]">
                  {(["Market", "Limit"] as const).map((ot) => (
                    <button
                      key={ot}
                      type="button"
                      onClick={() => setOrderType(ot)}
                      className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        orderType === ot
                          ? "bg-[#fff0f5] text-[#ff4665]"
                          : "text-[#808080] hover:text-black"
                      }`}
                    >
                      {ot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3.5 text-[13px] font-medium text-black truncate">
                {activeMilestone.title}
              </div>

              {/* Outcome Selector */}
              <div className="mt-3 grid grid-cols-2 gap-2.5 tabular-nums">
                <button
                  type="button"
                  onClick={() => setOutcomeSide("Yes")}
                  className={`rounded-[14px] p-3 text-left border transition-all cursor-pointer ${
                    outcomeSide === "Yes"
                      ? "border-[#FF4665] bg-[#fff5f8]"
                      : "border-black/[0.09] hover:border-black/25"
                  }`}
                >
                  <div className="flex items-center justify-between text-[12px]">
                    <span
                      className={
                        outcomeSide === "Yes"
                          ? "font-semibold text-[#ff4665]"
                          : "font-medium text-black"
                      }
                    >
                      Yes
                    </span>
                    <span className="text-[#808080]">
                      {formatMultiplier(activeYesCents)}
                    </span>
                  </div>
                  <div className="mt-1 text-[21px] font-medium text-black">
                    {activeYesCents}¢
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOutcomeSide("No")}
                  className={`rounded-[14px] p-3 text-left border transition-all cursor-pointer ${
                    outcomeSide === "No"
                      ? "border-black bg-[#F7F7F8]"
                      : "border-black/[0.09] hover:border-black/25"
                  }`}
                >
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-black">No</span>
                    <span className="text-[#808080]">
                      {formatMultiplier(activeNoCents)}
                    </span>
                  </div>
                  <div className="mt-1 text-[21px] font-medium text-black">
                    {activeNoCents}¢
                  </div>
                </button>
              </div>

              <form onSubmit={handleMilestoneSubmit} className="mt-4 space-y-4">
                {orderType === "Limit" && ticketAction === "Buy" && (
                  <div>
                    <label
                      htmlFor="limit-cents-input"
                      className="block text-[12px] font-medium text-black/65 mb-1.5"
                    >
                      Limit Price (¢)
                    </label>
                    <div className="relative">
                      <Input
                        id="limit-cents-input"
                        type="number"
                        min={1}
                        max={99}
                        value={limitCentsStr}
                        onChange={(e) => setLimitCentsStr(e.target.value)}
                        className="h-10 rounded-[12px] pr-8 text-[15px] font-medium tabular-nums"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13.5px] text-black/45">
                        ¢
                      </span>
                    </div>
                  </div>
                )}

                {ticketAction === "Buy" ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <label
                          htmlFor="ticket-stake"
                          className="font-medium text-black/65"
                        >
                          Amount (USD)
                        </label>
                        <span className="text-[#808080] tabular-nums">
                          Cash: {formatCurrency(cashBalance)}
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14.5px] text-black/45">
                          $
                        </span>
                        <Input
                          id="ticket-stake"
                          name="stakeUsd"
                          type="number"
                          min={5}
                          max={Math.max(1000, Math.floor(cashBalance))}
                          step={5}
                          value={stakeStr}
                          onChange={(e) => setStakeStr(e.target.value)}
                          className="h-11 rounded-[12px] pl-7 text-[15.5px] font-medium tabular-nums"
                        />
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-1.5">
                        {PRESET_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setStakeStr(String(amt))}
                            className={`h-[28px] rounded-full text-[11.5px] font-medium cursor-pointer tabular-nums transition-colors ${
                              Number(stakeStr) === amt
                                ? "bg-black text-white"
                                : "bg-[#F4F4F6] text-black/75 hover:bg-black/10"
                            }`}
                          >
                            ${amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[14px] bg-[#FAFAFB] border border-black/[0.06] p-3.5 space-y-2 text-[12.5px] tabular-nums">
                      <div className="flex items-center justify-between">
                        <span className="text-[#808080]">Est. contracts</span>
                        <span className="font-medium text-black">
                          {estContracts.toLocaleString()} {outcomeSide}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#808080]">Price / contract</span>
                        <span className="font-medium text-black">
                          {effectiveLimitCents}¢
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#808080]">
                          Clearing fee (1¢/ct)
                        </span>
                        <span className="text-black/75">
                          {formatCurrency(estFee)}
                        </span>
                      </div>
                      <Separator className="my-1 bg-black/[0.06]" />
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-black">
                          Max payout
                        </span>
                        <span>
                          <span className="font-semibold text-black">
                            {formatCurrency(estMaxPayout)}
                          </span>
                          <span className="ml-1.5 text-[11.5px] font-medium text-emerald-600">
                            +{estRoi.toFixed(1)}%
                          </span>
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={estContracts < 1 || estTotalDebit > cashBalance}
                      className="h-11 w-full rounded-full bg-black text-white hover:bg-neutral-800 text-[14px] font-medium cursor-pointer tabular-nums"
                    >
                      Buy {outcomeSide} · {formatCurrency(estTotalDebit)}
                    </Button>
                  </>
                ) : (
                  <>
                    {activePosition ? (
                      <>
                        <div className="rounded-[14px] bg-[#FFF8FB] border border-[#ff4665]/18 p-3.5 text-[12.5px] space-y-1.5 tabular-nums">
                          <div className="flex justify-between">
                            <span className="text-[#808080]">Your position</span>
                            <span className="font-medium text-black">
                              {activePosition.contracts.toLocaleString()}{" "}
                              {activePosition.side}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#808080]">Avg entry</span>
                            <span className="font-medium text-black">
                              {activePosition.avgPriceCents}¢
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#808080]">Current mark</span>
                            <span className="font-medium text-[#ff4665]">
                              {currentMarketCents}¢
                            </span>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="sell-qty"
                            className="block text-[12px] font-medium text-black/65 mb-1.5"
                          >
                            Contracts to Sell
                          </label>
                          <Input
                            id="sell-qty"
                            type="number"
                            min={1}
                            max={activePosition.contracts}
                            value={sellQtyStr}
                            onChange={(e) => setSellQtyStr(e.target.value)}
                            className="h-11 rounded-[12px] text-[15.5px] font-medium tabular-nums"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="h-11 w-full rounded-full bg-[#ff4665] text-white hover:bg-[#e53554] text-[14px] font-medium cursor-pointer tabular-nums"
                        >
                          Sell {Number(sellQtyStr) || activePosition.contracts}{" "}
                          {outcomeSide} @ {currentMarketCents}¢
                        </Button>
                      </>
                    ) : (
                      <div className="rounded-[14px] bg-[#FAFAFB] p-5 text-center text-[13px] text-[#808080]">
                        You do not hold any{" "}
                        <span className="text-black font-medium">
                          {outcomeSide}
                        </span>{" "}
                        contracts on {activeMilestone.title} yet.
                      </div>
                    )}
                  </>
                )}

                <p className="text-[11.5px] text-center text-[#808080]">
                  Instant paper settlement into{" "}
                  <Link
                    href="/portfolio"
                    className="text-black underline underline-offset-2"
                  >
                    Portfolio
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Trajectory Unit Mode (TradingView AreaSeries + Recharts Conviction Radar) */
        <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_356px] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            {/* Trajectory Price Terminal Card */}
            <Card className="rounded-[20px] bg-white ring-1 ring-black/[0.07] py-5">
              <CardContent className="px-5 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-[11.5px] uppercase tracking-[0.08em] text-[#ff4665] font-medium">
                      Perpetual Trajectory Unit · {person.trajectory.ticker}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-baseline gap-3 tabular-nums">
                      <span className="text-[34px] font-medium tracking-[-0.03em] text-black">
                        {formatCurrency(displayedTraj)}
                      </span>
                      <span className="text-[13.5px] font-medium text-emerald-600">
                        ▲ +{person.trajectory.change24hPct}% (24h)
                      </span>
                      {trajCrosshair && (
                        <span className="text-[11.5px] font-mono text-[#71717A]">
                          {trajCrosshair.timeLabel} UTC
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] text-[#808080]">
                      0.0025% claim on Total Economic Benefit per unit · Next
                      simulated clearing: {person.trajectory.nextClearing}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11.5px]">
                    {(["1D", "1W", "1M", "All"] as const).map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                          timeframe === tf
                            ? "bg-[#fff0f5] text-[#ff4665]"
                            : "text-[#808080] hover:text-black"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <TrajectoryTradingChart
                    data={trajTvSeries}
                    onCrosshairMove={setTrajCrosshair}
                  />
                </div>

                {/* 4 Invariants + 25% Cap Progress */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
                  <div className="rounded-[12px] bg-[#FAFAFB] border border-black/[0.05] p-3">
                    <div className="text-[11px] text-[#808080]">Max Supply</div>
                    <div className="mt-0.5 text-[16px] font-medium text-black">
                      {person.trajectory.authorizedUnits.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-[12px] bg-[#FAFAFB] border border-black/[0.05] p-3">
                    <div className="text-[11px] text-[#808080]">
                      Share / Unit
                    </div>
                    <div className="mt-0.5 text-[16px] font-medium text-black">
                      {person.trajectory.tebPerUnitPct}%
                    </div>
                  </div>
                  <div className="rounded-[12px] bg-[#FAFAFB] border border-black/[0.05] p-3">
                    <div className="text-[11px] text-[#808080]">
                      Builder Retains
                    </div>
                    <div className="mt-0.5 text-[16px] font-medium text-[#ff4665]">
                      {(100 - person.trajectory.listedPct).toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-[12px] bg-[#FAFAFB] border border-black/[0.05] p-3">
                    <div className="text-[11px] text-[#808080]">
                      Conviction Score
                    </div>
                    <div className="mt-0.5 text-[16px] font-medium text-black">
                      {person.trajectory.convictionScore} / 100
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[12px] mb-1.5 tabular-nums">
                    <span className="font-medium text-black">
                      Hard 25% Ownership Cap Invariant
                    </span>
                    <span className="text-[#808080]">
                      {person.trajectory.listedPct}% listed / 25% ceiling
                    </span>
                  </div>
                  <Progress
                    value={(person.trajectory.listedPct / 25) * 100}
                    className="h-2 bg-[#F1F1F4] [&>[data-slot=progress-indicator]]:bg-opus-gradient"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recharts Conviction Engine Card */}
            <Card className="rounded-[20px] bg-white ring-1 ring-black/[0.07] py-5">
              <CardHeader className="px-5 sm:px-6 pb-2 flex flex-row flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-[16px] font-medium tracking-[-0.02em] text-black flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#ff4665]" />
                  <span>Conviction Engine Breakdown</span>
                </CardTitle>
                <span className="text-[12px] text-[#808080] tabular-nums">
                  Backward (60%):{" "}
                  <strong className="text-black">
                    {person.trajectory.backwardScore}
                  </strong>{" "}
                  · Forward (40%):{" "}
                  <strong className="text-black">
                    {person.trajectory.forwardScore}
                  </strong>
                </span>
              </CardHeader>
              <CardContent className="px-5 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5 items-center">
                  <ConvictionRadarChart signals={person.trajectory.signals} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {person.trajectory.signals.map((sig) => (
                      <div
                        key={sig.name}
                        className="rounded-[12px] border border-black/[0.06] p-3"
                      >
                        <div className="flex items-center justify-between text-[12.5px] tabular-nums">
                          <span className="font-medium text-black">
                            {sig.name}
                          </span>
                          <span className="font-semibold text-[#ff4665]">
                            {sig.score}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[#808080] mt-0.5">
                          {sig.group}
                        </div>
                        <Progress
                          value={sig.score}
                          className="mt-2 h-1.5 bg-[#F3F3F5] [&>[data-slot=progress-indicator]]:bg-opus-gradient"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sticky Trajectory Ticket */}
          <Card className="xl:sticky xl:top-[78px] rounded-[20px] bg-white ring-1 ring-black/[0.08] py-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.16)]">
            <CardContent className="px-5">
              <Tabs
                value={trajAction}
                onValueChange={(v) => setTrajAction(v as "Buy" | "Sell")}
              >
                <TabsList className="rounded-full bg-[#F4F4F6] p-0.5 h-8">
                  <TabsTrigger
                    value="Buy"
                    className="rounded-full px-4 text-[12.5px] cursor-pointer"
                  >
                    Buy {person.trajectory.ticker}
                  </TabsTrigger>
                  <TabsTrigger
                    value="Sell"
                    className="rounded-full px-4 text-[12.5px] cursor-pointer"
                  >
                    Sell {person.trajectory.ticker}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {trajPosition && (
                <div className="mt-4 rounded-[12px] bg-[#FFF8FB] border border-[#ff4665]/18 px-3.5 py-2.5 text-[12px] flex items-center justify-between tabular-nums">
                  <span className="text-[#808080]">Your holding</span>
                  <span className="font-medium text-black">
                    {trajPosition.units} units (
                    {(
                      trajPosition.units * person.trajectory.tebPerUnitPct
                    ).toFixed(4)}
                    % TEB)
                  </span>
                </div>
              )}

              <form onSubmit={handleTrajectorySubmit} className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <label
                      htmlFor="traj-units-input"
                      className="font-medium text-black/65"
                    >
                      Trajectory Units
                    </label>
                    <span className="text-[#808080] tabular-nums">
                      Spot: {formatCurrency(trajSpot)}
                    </span>
                  </div>
                  <Input
                    id="traj-units-input"
                    type="number"
                    min={1}
                    max={trajAction === "Sell" ? trajPosition?.units ?? 1 : 500}
                    value={trajUnitsStr}
                    onChange={(e) => setTrajUnitsStr(e.target.value)}
                    className="h-11 rounded-[12px] text-[15.5px] font-medium tabular-nums"
                  />
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {[1, 5, 10, 25].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setTrajUnitsStr(String(u))}
                        className={`h-[28px] rounded-full text-[11.5px] font-medium cursor-pointer tabular-nums ${
                          trajUnits === u
                            ? "bg-black text-white"
                            : "bg-[#F4F4F6] text-black/75 hover:bg-black/10"
                        }`}
                      >
                        {u} {u === 1 ? "unit" : "units"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[14px] bg-[#FAFAFB] border border-black/[0.06] p-3.5 space-y-2 text-[12.5px] tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-[#808080]">TEB claim</span>
                    <span className="font-medium text-[#ff4665]">
                      {trajTebPct.toFixed(4)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#808080]">Order value</span>
                    <span className="font-medium text-black">
                      {formatCurrency(trajNotional)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#808080]">Clearing fee (0.25%)</span>
                    <span className="text-black/75">
                      {formatCurrency(trajFee)}
                    </span>
                  </div>
                  <Separator className="my-1 bg-black/[0.06]" />
                  <div className="flex justify-between font-medium text-black">
                    <span>
                      {trajAction === "Buy" ? "Total debit" : "Est. proceeds"}
                    </span>
                    <span>
                      {formatCurrency(
                        trajAction === "Buy"
                          ? trajNotional + trajFee
                          : Math.max(0, trajNotional - trajFee)
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    trajUnits < 1 ||
                    (trajAction === "Buy" &&
                      trajNotional + trajFee > cashBalance) ||
                    (trajAction === "Sell" && !trajPosition)
                  }
                  className="h-11 w-full rounded-full bg-black text-white hover:bg-neutral-800 text-[14px] font-medium cursor-pointer tabular-nums"
                >
                  {trajAction === "Buy"
                    ? `Buy ${trajUnits} ${person.trajectory.ticker} · ${formatCurrency(trajNotional + trajFee)}`
                    : `Sell ${trajUnits} ${person.trajectory.ticker}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
