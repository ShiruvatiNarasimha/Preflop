"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Layers,
  PieChart as PieChartIcon,
  RotateCcw,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { SectionEyebrow } from "./brand-marks"
import { PortfolioAllocationChart, PortfolioEquityChart } from "./charts"
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

  // Split positions value into Milestones vs Trajectory Units for the Recharts Donut
  const { milestoneValue, trajectoryValue } = React.useMemo(() => {
    let mVal = 0
    for (const pos of milestonePositions) {
      const yesCents = getMilestoneYesCents(pos.milestoneId, pos.avgPriceCents)
      const markCents = pos.side === "Yes" ? yesCents : 100 - yesCents
      mVal += pos.contracts * (markCents / 100)
    }
    let tVal = 0
    for (const tp of trajectoryPositions) {
      const spot = getTrajectoryPrice(tp.personSlug, tp.avgPrice)
      tVal += tp.units * spot
    }
    return { milestoneValue: mVal, trajectoryValue: tVal }
  }, [
    milestonePositions,
    trajectoryPositions,
    getMilestoneYesCents,
    getTrajectoryPrice,
  ])

  // Realistic session equity time series for Recharts AreaChart
  const equityData = React.useMemo(() => {
    const start = 100_000
    const diff = totalEquity - start
    const labels = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "Now",
    ]
    const weights = [0, 0.08, 0.22, 0.17, 0.42, 0.56, 0.74, 0.88, 1]
    return labels.map((label, i) => ({
      label,
      equity: Number((start + diff * weights[i]!).toFixed(2)),
    }))
  }, [totalEquity])

  const followedPeople = PERSON_PROFILES.filter((p) =>
    user.watchlist.includes(p.slug)
  )

  const openPositionsCount =
    milestonePositions.length + trajectoryPositions.length
  const safeTotal = Math.max(1, cashBalance + milestoneValue + trajectoryValue)

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <SectionEyebrow text="Account & Positions" />
          <h1 className="mt-2.5 text-[32px] sm:text-[38px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
            Portfolio
          </h1>
          <p className="mt-1.5 text-[14.5px] text-[#71717A]">
            Live paper-desk equity, allocation breakdown, open positions, and
            fill ledger.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!user.onboarded && (
            <Button
              type="button"
              onClick={() => openOnboarding("back")}
              className="h-9 px-4 rounded-full bg-black text-white hover:bg-neutral-800 text-[13px] font-medium cursor-pointer"
            >
              Personalize Account
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={resetAccount}
            className="h-9 px-4 rounded-full bg-white border-black/12 text-[13px] font-medium text-black/75 hover:text-black cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset $100K</span>
          </Button>
        </div>
      </div>

      {/* 4 Institutional KPI Cards */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 tabular-nums">
        <Card className="rounded-[18px] bg-white border-black/[0.07] shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Total Equity</span>
              <Wallet className="h-3.5 w-3.5 text-[#ff4665]" />
            </div>
            <div className="mt-2 text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
              {formatCurrency(totalEquity)}
            </div>
            <div
              className={`mt-1 text-[11.5px] font-medium ${
                totalPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
              }`}
            >
              {totalPnl >= 0 ? "+" : ""}
              {totalPnlPct.toFixed(2)}% vs. $100K start
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] bg-white border-black/[0.07] shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Cash Available</span>
              <Activity className="h-3.5 w-3.5 text-black/45" />
            </div>
            <div className="mt-2 text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
              {formatCurrency(cashBalance)}
            </div>
            <div className="mt-1 text-[11.5px] text-[#71717A]">
              {((cashBalance / safeTotal) * 100).toFixed(1)}% buying power
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] bg-white border-black/[0.07] shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Positions Value</span>
              <Layers className="h-3.5 w-3.5 text-[#ff4665]" />
            </div>
            <div className="mt-2 text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
              {formatCurrency(positionsValue)}
            </div>
            <div className="mt-1 text-[11.5px] text-[#71717A]">
              {openPositionsCount} active{" "}
              {openPositionsCount === 1 ? "position" : "positions"}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] bg-white border-black/[0.07] shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Net Session P&amp;L</span>
              <TrendingUp className="h-3.5 w-3.5 text-[#ff4665]" />
            </div>
            <div
              className={`mt-2 text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] ${
                totalPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
              }`}
            >
              {totalPnl >= 0 ? "+" : ""}
              {formatCurrency(totalPnl)}
            </div>
            <div className="mt-1 text-[11.5px] text-[#71717A]">
              Unrealized {unrealizedPnl >= 0 ? "+" : ""}
              {formatCurrency(unrealizedPnl)} · Realized{" "}
              {realizedPnl >= 0 ? "+" : ""}
              {formatCurrency(realizedPnl)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Analytics Row: Equity Curve + Allocation Donut */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-4">
        <Card className="rounded-[20px] bg-white border-black/[0.07] shadow-none py-0">
          <CardHeader className="px-5 pt-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-[16px] font-medium tracking-[-0.015em] text-black">
                Account Equity Curve
              </CardTitle>
              <CardDescription className="text-[12.5px] text-[#71717A]">
                Mark-to-market simulated desk performance vs. $100,000 baseline
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#fff0f5] text-[#ff4665] border-0 font-mono text-[11px]"
            >
              Live MTM
            </Badge>
          </CardHeader>
          <CardContent className="px-3 sm:px-5 pb-5 pt-2">
            <PortfolioEquityChart data={equityData} />
          </CardContent>
        </Card>

        <Card className="rounded-[20px] bg-white border-black/[0.07] shadow-none py-0 flex flex-col justify-between">
          <CardHeader className="px-5 pt-5 pb-1 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-[16px] font-medium tracking-[-0.015em] text-black flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-[#ff4665]" />
                <span>Capital Allocation</span>
              </CardTitle>
              <CardDescription className="text-[12.5px] text-[#71717A]">
                Cash vs. binary milestones &amp; perpetual units
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
            <div className="w-[180px] shrink-0">
              <PortfolioAllocationChart
                cash={cashBalance}
                milestones={milestoneValue}
                trajectory={trajectoryValue}
              />
            </div>

            <div className="w-full space-y-2.5 text-[12.5px] tabular-nums">
              {[
                {
                  label: "Cash Available",
                  value: cashBalance,
                  color: "#D4D4D8",
                },
                {
                  label: "Milestone Contracts",
                  value: milestoneValue,
                  color: "#FF4665",
                },
                {
                  label: "Trajectory Units",
                  value: trajectoryValue,
                  color: "#7D2BC4",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-2 rounded-[10px] bg-[#FAFAFB] border border-black/[0.05] px-3 py-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-black/80 truncate">{item.label}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-medium text-black">
                      {formatCurrency(item.value, 0)}
                    </div>
                    <div className="text-[10.5px] text-[#71717A]">
                      {((item.value / safeTotal) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institutional Tabbed Positions, Ledger, Watchlist & Drafts */}
      <Card className="mt-5 rounded-[20px] bg-white border-black/[0.07] shadow-none py-0">
        <Tabs defaultValue="positions" className="w-full">
          <div className="px-5 pt-5 pb-3 border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="h-9 rounded-full bg-[#F5F5F7] p-1 w-fit">
              <TabsTrigger
                value="positions"
                className="rounded-full px-3.5 text-[12.5px] font-medium data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                Open Positions ({openPositionsCount})
              </TabsTrigger>
              <TabsTrigger
                value="fills"
                className="rounded-full px-3.5 text-[12.5px] font-medium data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                Fill Ledger ({fills.length})
              </TabsTrigger>
              <TabsTrigger
                value="watchlist"
                className="rounded-full px-3.5 text-[12.5px] font-medium data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                Following ({followedPeople.length})
              </TabsTrigger>
              <TabsTrigger
                value="drafts"
                className="rounded-full px-3.5 text-[12.5px] font-medium data-[state=active]:bg-white data-[state=active]:text-black cursor-pointer"
              >
                Issuance Drafts ({drafts.length})
              </TabsTrigger>
            </TabsList>

            <Link
              href="/markets"
              className="text-[12.5px] font-medium text-[#ff4665] hover:underline inline-flex items-center gap-1"
            >
              <span>Browse 40 Markets</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Tab 1: Open Positions (Milestones + Trajectory Units in shadcn Tables) */}
          <TabsContent value="positions" className="p-5 mt-0 space-y-6">
            {openPositionsCount === 0 ? (
              <div className="rounded-[16px] bg-[#FAFAFB] border border-dashed border-black/10 p-8 text-center">
                <div className="text-[16px] font-medium text-black">
                  No open positions yet
                </div>
                <p className="mt-1.5 text-[13.5px] text-[#71717A] max-w-[430px] mx-auto">
                  Put your $100,000.00 simulated desk to work. Pick a person and
                  trade any binary milestone or perpetual Trajectory Unit.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  {PERSON_PROFILES.slice(0, 3).map((p) => (
                    <Button
                      key={p.slug}
                      asChild
                      variant="outline"
                      className="h-9 rounded-full bg-white border-black/12 text-[13px] font-medium hover:border-[#ff4665] hover:text-[#ff4665]"
                    >
                      <Link href={`/person/${p.slug}`}>
                        <span>{p.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {milestonePositions.length > 0 && (
                  <div>
                    <div className="text-[12px] uppercase tracking-[0.06em] font-medium text-[#71717A] mb-3">
                      Milestone Contracts ({milestonePositions.length})
                    </div>
                    <Table className="tabular-nums">
                      <TableHeader>
                        <TableRow className="border-black/[0.06] hover:bg-transparent">
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal">
                            Market
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal">
                            Side
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Contracts
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Avg → Mark
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Value
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Live P&amp;L
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {milestonePositions.map((pos) => {
                          const yesCents = getMilestoneYesCents(
                            pos.milestoneId,
                            pos.avgPriceCents
                          )
                          const markCents =
                            pos.side === "Yes" ? yesCents : 100 - yesCents
                          const value = pos.contracts * (markCents / 100)
                          const pnl = value - pos.totalCost
                          const pnlPct =
                            pos.totalCost > 0 ? (pnl / pos.totalCost) * 100 : 0

                          return (
                            <TableRow
                              key={pos.key}
                              className="border-black/[0.05]"
                            >
                              <TableCell className="py-3.5">
                                <Link
                                  href={`/person/${pos.personSlug}?milestone=${pos.milestoneId}`}
                                  className="font-medium text-black hover:text-[#ff4665] transition-colors"
                                >
                                  {pos.milestoneTitle}
                                </Link>
                                <div className="text-[11.5px] text-[#71717A]">
                                  {pos.personName}
                                </div>
                              </TableCell>
                              <TableCell className="py-3.5">
                                <Badge
                                  className={`rounded-full border-0 text-[11px] font-medium ${
                                    pos.side === "Yes"
                                      ? "bg-[#fff0f5] text-[#ff4665]"
                                      : "bg-[#F3F3F5] text-black"
                                  }`}
                                >
                                  {pos.side}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3.5 text-right font-medium text-black">
                                {pos.contracts.toLocaleString()}
                              </TableCell>
                              <TableCell className="py-3.5 text-right text-black/75 font-mono text-[12.5px]">
                                {pos.avgPriceCents}¢ →{" "}
                                <strong className="text-black">
                                  {markCents}¢
                                </strong>
                              </TableCell>
                              <TableCell className="py-3.5 text-right font-medium text-black">
                                {formatCurrency(value)}
                              </TableCell>
                              <TableCell
                                className={`py-3.5 text-right font-medium ${
                                  pnl >= 0
                                    ? "text-emerald-600"
                                    : "text-[#ff4665]"
                                }`}
                              >
                                {pnl >= 0 ? "+" : ""}
                                {formatCurrency(pnl)} ({pnl >= 0 ? "+" : ""}
                                {pnlPct.toFixed(1)}%)
                              </TableCell>
                              <TableCell className="py-3.5 text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => sellMilestone(pos.key)}
                                  className="h-7 px-3 rounded-full bg-black text-white hover:bg-[#ff4665] text-[11.5px] font-medium cursor-pointer"
                                >
                                  Close
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {trajectoryPositions.length > 0 && (
                  <div>
                    <div className="text-[12px] uppercase tracking-[0.06em] font-medium text-[#71717A] mb-3">
                      Perpetual Trajectory Units ({trajectoryPositions.length})
                    </div>
                    <Table className="tabular-nums">
                      <TableHeader>
                        <TableRow className="border-black/[0.06] hover:bg-transparent">
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal">
                            Issuer &amp; Ticker
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Units
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            TEB Claim
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Avg → Spot
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Value
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Live P&amp;L
                          </TableHead>
                          <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trajectoryPositions.map((tp) => {
                          const spot = getTrajectoryPrice(
                            tp.personSlug,
                            tp.avgPrice
                          )
                          const val = tp.units * spot
                          const pnl = val - tp.totalCost
                          const tebClaim = (tp.units * 0.0025).toFixed(4)
                          return (
                            <TableRow
                              key={tp.personSlug}
                              className="border-black/[0.05]"
                            >
                              <TableCell className="py-3.5">
                                <Link
                                  href={`/person/${tp.personSlug}?view=trajectory`}
                                  className="font-medium text-black hover:text-[#ff4665] inline-flex items-center gap-2"
                                >
                                  <span>{tp.personName}</span>
                                  <Badge
                                    variant="secondary"
                                    className="font-mono text-[10.5px] bg-[#F5F5F7] text-black border-0"
                                  >
                                    {tp.ticker}
                                  </Badge>
                                </Link>
                              </TableCell>
                              <TableCell className="py-3.5 text-right font-medium text-black">
                                {tp.units}
                              </TableCell>
                              <TableCell className="py-3.5 text-right text-[#71717A] font-mono text-[12px]">
                                {tebClaim}%
                              </TableCell>
                              <TableCell className="py-3.5 text-right font-mono text-[12.5px] text-black/75">
                                {formatCurrency(tp.avgPrice)} →{" "}
                                <strong className="text-black">
                                  {formatCurrency(spot)}
                                </strong>
                              </TableCell>
                              <TableCell className="py-3.5 text-right font-medium text-black">
                                {formatCurrency(val)}
                              </TableCell>
                              <TableCell
                                className={`py-3.5 text-right font-medium ${
                                  pnl >= 0
                                    ? "text-emerald-600"
                                    : "text-[#ff4665]"
                                }`}
                              >
                                {pnl >= 0 ? "+" : ""}
                                {formatCurrency(pnl)}
                              </TableCell>
                              <TableCell className="py-3.5 text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    sellTrajectoryUnits(tp.personSlug)
                                  }
                                  className="h-7 px-3 rounded-full bg-black text-white hover:bg-[#ff4665] text-[11.5px] font-medium cursor-pointer"
                                >
                                  Sell All
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Tab 2: Fill Ledger */}
          <TabsContent value="fills" className="p-5 mt-0">
            {fills.length === 0 ? (
              <div className="rounded-[14px] bg-[#FAFAFB] p-8 text-center text-[13.5px] text-[#71717A]">
                Your executed orders and realized P&amp;L fills will appear here
                automatically.
              </div>
            ) : (
              <Table className="tabular-nums">
                <TableHeader>
                  <TableRow className="border-black/[0.06] hover:bg-transparent">
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal">
                      Time
                    </TableHead>
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal">
                      Instrument
                    </TableHead>
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal">
                      Order
                    </TableHead>
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                      Qty
                    </TableHead>
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                      Price
                    </TableHead>
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                      Fee
                    </TableHead>
                    <TableHead className="text-[11.5px] text-[#71717A] font-normal text-right">
                      Notional / P&amp;L
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fills.map((f) => {
                    const p = getPersonBySlug(f.personSlug)
                    return (
                      <TableRow key={f.id} className="border-black/[0.05]">
                        <TableCell className="py-3 text-[12px] font-mono text-[#71717A]">
                          {f.timestamp}
                        </TableCell>
                        <TableCell className="py-3">
                          <Link
                            href={`/person/${f.personSlug}`}
                            className="font-medium text-black hover:text-[#ff4665]"
                          >
                            {f.instrument}
                          </Link>
                          <div className="text-[11.5px] text-[#71717A]">
                            {p?.name ?? f.personName}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            className={`rounded-full border-0 text-[11px] font-medium ${
                              f.action === "Buy"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-[#fff0f5] text-[#ff4665]"
                            }`}
                          >
                            {f.action} {f.side}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-right font-medium text-black">
                          {f.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-right font-mono text-[12.5px] text-black">
                          {f.priceDisplay}
                        </TableCell>
                        <TableCell className="py-3 text-right text-[#71717A]">
                          {formatCurrency(f.fee)}
                        </TableCell>
                        <TableCell className="py-3 text-right">
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
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          {/* Tab 3: Watchlist */}
          <TabsContent value="watchlist" className="p-5 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {followedPeople.map((p) => {
                const lead = p.milestones[0]!
                const cents = getMilestoneYesCents(lead.id, lead.baseYesCents)
                return (
                  <Link
                    key={p.slug}
                    href={`/person/${p.slug}`}
                    className="rounded-[14px] border border-black/[0.07] p-3.5 flex items-center justify-between gap-3 hover:border-black/25 hover:bg-[#FAFAFB] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-opus-gradient text-white text-[11px] font-semibold">
                          {p.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium text-black truncate">
                          {p.name}
                        </div>
                        <div className="text-[12px] text-[#71717A] truncate">
                          {lead.title}
                        </div>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-[#fff0f5] text-[#ff4665] border-0 font-mono text-[11.5px] shrink-0">
                      {cents}¢ Yes
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </TabsContent>

          {/* Tab 4: Saved Issuance Drafts */}
          <TabsContent value="drafts" className="p-5 mt-0">
            {drafts.length === 0 ? (
              <div className="rounded-[14px] bg-[#FAFAFB] p-8 text-center">
                <FileText className="h-5 w-5 text-[#ff4665] mx-auto" />
                <div className="mt-2 text-[14.5px] font-medium text-black">
                  No saved Covenant or Direct Listing previews
                </div>
                <p className="mt-1 text-[13px] text-[#71717A]">
                  Model a raise or run the 7-gate Direct Listing check in the
                  Issuance Studio.
                </p>
                <Button
                  asChild
                  className="mt-4 h-9 rounded-full bg-black text-white hover:bg-neutral-800 text-[13px]"
                >
                  <Link href="/raise">Open Issuance Studio</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 tabular-nums">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-[14px] bg-[#FAFAFB] border border-black/[0.06] p-4 flex items-center justify-between gap-3"
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
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
