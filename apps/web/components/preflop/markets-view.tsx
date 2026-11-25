"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Flame,
  Layers,
  Search,
  Star,
  TrendingUp,
  Wallet,
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
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { SectionEyebrow } from "./brand-marks"
import { MiniSparklineChart } from "./charts"
import {
  PERSON_PROFILES,
  formatCompactVolume,
  formatCurrency,
  formatMultiplier,
  generateProbabilitySeries,
  generateTrajectoryPriceSeries,
  type PersonCategory,
} from "./market-catalog"
import { QuickTradeDrawer, type QuickTradeTarget } from "./quick-trade-drawer"
import { usePreflop } from "./store"

type CategoryFilter = "All" | "Following" | PersonCategory
type SortKey = "volume" | "movers" | "closing"

export function MarketsView() {
  const {
    user,
    totalEquity,
    unrealizedPnl,
    realizedPnl,
    toggleWatchlist,
    getMilestoneYesCents,
    getMilestoneVolume,
    getTrajectoryPrice,
    liveTape,
    milestonePositions,
    trajectoryPositions,
  } = usePreflop()

  const [category, setCategory] = React.useState<CategoryFilter>("All")
  const [sortBy, setSortBy] = React.useState<SortKey>("volume")
  const [search, setSearch] = React.useState("")
  const [quickTrade, setQuickTrade] = React.useState<QuickTradeTarget | null>(
    null
  )

  const totalPlatformVolume = React.useMemo(() => {
    let sum = 0
    for (const p of PERSON_PROFILES) {
      for (const m of p.milestones) {
        sum += getMilestoneVolume(m.id, m.baseVolume)
      }
    }
    return sum
  }, [getMilestoneVolume])

  const filteredPeople = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = PERSON_PROFILES.filter((p) => {
      if (category === "Following" && !user.watchlist.includes(p.slug)) {
        return false
      }
      if (
        category !== "All" &&
        category !== "Following" &&
        p.category !== category
      ) {
        return false
      }
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.trajectory.ticker.toLowerCase().includes(q) ||
        p.milestones.some(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.question.toLowerCase().includes(q)
        )
      )
    })

    return [...list].sort((a, b) => {
      if (sortBy === "volume") {
        const volA = a.milestones.reduce(
          (acc, m) => acc + getMilestoneVolume(m.id, m.baseVolume),
          0
        )
        const volB = b.milestones.reduce(
          (acc, m) => acc + getMilestoneVolume(m.id, m.baseVolume),
          0
        )
        return volB - volA
      }
      if (sortBy === "movers") {
        const moveA = Math.max(...a.milestones.map((m) => Math.abs(m.delta24h)))
        const moveB = Math.max(...b.milestones.map((m) => Math.abs(m.delta24h)))
        return moveB - moveA
      }
      const closeA = Math.min(
        ...a.milestones.map((m) => Date.parse(m.closesIso))
      )
      const closeB = Math.min(
        ...b.milestones.map((m) => Date.parse(m.closesIso))
      )
      return closeA - closeB
    })
  }, [category, search, sortBy, user.watchlist, getMilestoneVolume])

  const spotlightPerson =
    PERSON_PROFILES.find((p) => p.slug === user.watchlist[0]) ??
    PERSON_PROFILES[0]!
  const spotlightLead = spotlightPerson.milestones[0]!
  const spotlightYes = getMilestoneYesCents(
    spotlightLead.id,
    spotlightLead.baseYesCents
  )
  const spotlightNo = 100 - spotlightYes
  const spotlightSparkline = React.useMemo(
    () =>
      generateProbabilitySeries(
        spotlightLead.id,
        spotlightYes,
        spotlightLead.delta24h,
        "1M"
      ).map((v, i) => ({ i, v })),
    [spotlightLead.id, spotlightYes, spotlightLead.delta24h]
  )

  const closingSoonList = React.useMemo(() => {
    return PERSON_PROFILES.flatMap((p) =>
      p.milestones.map((m) => ({ person: p, milestone: m }))
    )
      .sort(
        (a, b) =>
          Date.parse(a.milestone.closesIso) - Date.parse(b.milestone.closesIso)
      )
      .slice(0, 5)
  }, [])

  const openPositionsCount =
    milestonePositions.length + trajectoryPositions.length
  const netPnl = unrealizedPnl + realizedPnl

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Institutional Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SectionEyebrow text="Human Capital Exchange" />
          <h1 className="mt-2.5 text-[32px] sm:text-[38px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
            Live Markets
          </h1>
          <p className="mt-1.5 max-w-[540px] text-[14.5px] leading-[1.45] text-[#71717A]">
            Trade verified milestone contracts and perpetual Trajectory Units on
            founders, creators, athletes, and artists.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-full border-black/12 bg-white text-[13px] font-medium text-black hover:border-black/30"
          >
            <Link href="/raise">
              <Layers className="h-3.5 w-3.5 text-[#ff4665]" />
              <span>Model a Raise</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-9 rounded-full bg-black text-white hover:bg-neutral-800 text-[13px] font-medium"
          >
            <Link href="/portfolio">
              <Wallet className="h-3.5 w-3.5" />
              <span>Portfolio</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Institutional 4-Card KPI Strip */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5 tabular-nums">
        <Card className="rounded-[18px] border-black/[0.07] bg-white shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Simulated Volume</span>
              <Activity className="h-3.5 w-3.5 text-[#ff4665]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
                {formatCompactVolume(totalPlatformVolume)}
              </span>
              <span className="text-[11.5px] font-medium text-emerald-600">
                +14.2%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] border-black/[0.07] bg-white shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Active Markets</span>
              <TrendingUp className="h-3.5 w-3.5 text-black/45" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
                40
              </span>
              <span className="text-[11.5px] text-[#71717A]">
                across {PERSON_PROFILES.length} people
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] border-black/[0.07] bg-white shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Your Desk Equity</span>
              <Wallet className="h-3.5 w-3.5 text-[#ff4665]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
                {formatCurrency(totalEquity, 0)}
              </span>
              <span
                className={`text-[11.5px] font-medium ${
                  netPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
                }`}
              >
                {netPnl >= 0 ? "+" : ""}
                {formatCurrency(netPnl)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] border-black/[0.07] bg-white shadow-none py-0">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-[11.5px] text-[#71717A]">
              <span>Open Positions</span>
              <Star className="h-3.5 w-3.5 text-[#ff4665]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[22px] sm:text-[24px] font-medium tracking-[-0.025em] text-black">
                {openPositionsCount}
              </span>
              <span className="text-[11.5px] text-[#71717A]">
                {user.watchlist.length} followed
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Spotlight Banner (Signature Pink-Silk Frosted Aesthetic) */}
      <div className="mt-5 relative rounded-[22px] overflow-hidden border border-black/[0.07]">
        <img
          src="/media/silk-card-1.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 p-5 sm:p-6 bg-white/80 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-[590px]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-[#fff0f5] text-[#ff4665] border border-[#ff4665]/15 hover:bg-[#fff0f5] text-[11px] font-medium">
                <Flame className="h-3 w-3 mr-1" />
                Featured · {spotlightPerson.company}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-white/90 text-black/75 border border-black/[0.08] font-mono text-[11px]"
              >
                {spotlightPerson.trajectory.ticker} ·{" "}
                {formatCurrency(
                  getTrajectoryPrice(
                    spotlightPerson.slug,
                    spotlightPerson.trajectory.spotPrice
                  )
                )}
              </Badge>
            </div>
            <h2 className="mt-2.5 text-[21px] sm:text-[25px] font-medium tracking-[-0.025em] text-black leading-[1.2]">
              {spotlightPerson.name}: {spotlightLead.question}
            </h2>
            <p className="mt-1.5 text-[13.5px] text-black/65 leading-[1.45]">
              {spotlightPerson.bio}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-3 shrink-0 tabular-nums">
            <div className="hidden sm:flex items-center gap-2.5 rounded-[14px] bg-white/90 border border-black/[0.07] px-3 py-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.06em] text-[#71717A]">
                  1M Trend
                </div>
                <div className="text-[14px] font-semibold text-[#ff4665]">
                  {spotlightYes}% Yes
                </div>
              </div>
              <MiniSparklineChart
                data={spotlightSparkline}
                positive={spotlightLead.delta24h >= 0}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={() =>
                  setQuickTrade({
                    person: spotlightPerson,
                    milestone: spotlightLead,
                    side: "Yes",
                  })
                }
                className="h-10 px-4 rounded-full bg-[#ff4665] hover:bg-[#e53554] text-white text-[13px] font-medium cursor-pointer shadow-[0_10px_24px_-8px_rgba(255,70,101,0.55)]"
              >
                Buy Yes · {spotlightYes}¢ ({formatMultiplier(spotlightYes)})
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setQuickTrade({
                    person: spotlightPerson,
                    milestone: spotlightLead,
                    side: "No",
                  })
                }
                className="h-10 px-4 rounded-full bg-white border-black/12 text-black hover:border-black/35 text-[13px] font-medium cursor-pointer"
              >
                Buy No · {spotlightNo}¢
              </Button>
              <Button
                asChild
                className="h-10 px-4 rounded-full bg-black hover:bg-neutral-800 text-white text-[13px] font-medium"
              >
                <Link href={`/person/${spotlightPerson.slug}`}>
                  <span>Terminal</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Controls */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <Tabs
            value={category}
            onValueChange={(v) => setCategory(v as CategoryFilter)}
          >
            <TabsList className="h-9 rounded-full bg-white border border-black/[0.08] p-1">
              {(
                [
                  "All",
                  "Following",
                  "Founder",
                  "Creator",
                  "Athlete",
                  "Artist",
                ] as const
              ).map((cat) => {
                const label =
                  cat === "All"
                    ? `All (${PERSON_PROFILES.length})`
                    : cat === "Following"
                      ? `Following (${user.watchlist.length})`
                      : `${cat}s`
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-full px-3.5 text-[12.5px] font-medium data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    {label}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              id="markets-search"
              name="marketsSearch"
              aria-label="Search people or milestones"
              type="text"
              placeholder="Search people or tickers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-[240px] rounded-full bg-white border-black/[0.1] pl-9 pr-4 text-[13px] text-black placeholder:text-[#808080] focus-visible:ring-[#ff4665]/25 focus-visible:border-[#ff4665]"
            />
          </div>

          <Tabs
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortKey)}
          >
            <TabsList className="h-9 rounded-full bg-white border border-black/[0.08] p-1">
              {(
                [
                  { id: "volume", label: "Volume" },
                  { id: "movers", label: "Movers" },
                  { id: "closing", label: "Closing Soon" },
                ] as const
              ).map((opt) => (
                <TabsTrigger
                  key={opt.id}
                  value={opt.id}
                  className="rounded-full px-3 text-[12px] font-medium data-[state=active]:bg-[#fff0f5] data-[state=active]:text-[#ff4665] cursor-pointer"
                >
                  {opt.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 2-Column Person Markets Grid */}
      {filteredPeople.length === 0 ? (
        <Card className="mt-6 rounded-[20px] border-black/[0.07] bg-white shadow-none">
          <CardContent className="p-12 text-center">
            <div className="text-[18px] font-medium text-black">
              No matching markets
            </div>
            <p className="mt-1.5 text-[14px] text-[#71717A]">
              Try clearing your search or switching back to All categories.
            </p>
            <Button
              type="button"
              onClick={() => {
                setCategory("All")
                setSearch("")
              }}
              className="mt-4 h-9 px-5 rounded-full bg-black text-white hover:bg-neutral-800 text-[13px] cursor-pointer"
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPeople.map((person) => {
            const isFollowed = user.watchlist.includes(person.slug)
            const personVolume = person.milestones.reduce(
              (acc, m) => acc + getMilestoneVolume(m.id, m.baseVolume),
              0
            )
            const trajSpot = getTrajectoryPrice(
              person.slug,
              person.trajectory.spotPrice
            )
            const userPosCount = milestonePositions.filter(
              (p) => p.personSlug === person.slug
            ).length

            const sparkData = generateTrajectoryPriceSeries(
              person.slug,
              trajSpot,
              person.trajectory.change24hPct,
              "1W"
            )
              .filter((_, i) => i % 4 === 0)
              .map((pt, i) => ({ i, v: pt.value }))

            return (
              <Card
                key={person.slug}
                className="rounded-[20px] bg-white border-black/[0.07] shadow-none hover:border-black/20 hover:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.16)] transition-all py-0 flex flex-col justify-between"
              >
                <CardContent className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Card Header with Trajectory Sparkline */}
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/person/${person.slug}`}
                        className="flex items-center gap-3 group min-w-0"
                      >
                        <Avatar className="h-11 w-11 shrink-0 shadow-[0_6px_16px_-6px_rgba(255,70,101,0.45)]">
                          <AvatarFallback className="bg-opus-gradient text-white text-[13px] font-semibold">
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <h3 className="text-[17.5px] font-medium tracking-[-0.02em] text-black group-hover:text-[#ff4665] transition-colors truncate">
                              {person.name}
                            </h3>
                            {userPosCount > 0 && (
                              <Badge className="rounded-full bg-[#fff0f5] text-[#ff4665] border-0 px-2 py-0 text-[10.5px] font-medium">
                                {userPosCount} open
                              </Badge>
                            )}
                          </div>
                          <div className="text-[12.5px] text-[#71717A] truncate">
                            {person.role} · {person.company}
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/person/${person.slug}?view=trajectory`}
                          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-[12px] bg-[#F8F8FA] hover:bg-[#fff5f8] border border-black/[0.06] transition-colors tabular-nums"
                          title={`Open ${person.trajectory.ticker} Trajectory Unit terminal`}
                        >
                          <MiniSparklineChart
                            data={sparkData}
                            positive={person.trajectory.change24hPct >= 0}
                          />
                          <div className="text-right leading-tight">
                            <div className="text-[10.5px] font-mono font-semibold text-black/55">
                              {person.trajectory.ticker}
                            </div>
                            <div className="text-[12px] font-medium text-black">
                              {formatCurrency(trajSpot)}
                            </div>
                          </div>
                        </Link>

                        <Link
                          href={`/person/${person.slug}?view=trajectory`}
                          className="sm:hidden px-2.5 py-1 rounded-full bg-[#F7F7F8] border border-black/[0.06] text-[11px] font-medium text-black tabular-nums"
                        >
                          {person.trajectory.ticker} {formatCurrency(trajSpot)}
                        </Link>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => toggleWatchlist(person.slug)}
                          aria-label={
                            isFollowed
                              ? `Unfollow ${person.name}`
                              : `Follow ${person.name}`
                          }
                          className={`h-8 w-8 rounded-full cursor-pointer ${
                            isFollowed
                              ? "border-[#ff4665]/30 bg-[#fff5f8] text-[#ff4665] hover:bg-[#fff0f5] hover:text-[#ff4665]"
                              : "border-black/10 bg-white text-black/40 hover:text-black"
                          }`}
                        >
                          <Star
                            className="h-3.5 w-3.5"
                            fill={isFollowed ? "currentColor" : "none"}
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Top 3 Milestones with Instant Yes/No Trade Triggers */}
                    <div className="mt-4 divide-y divide-black/[0.05]">
                      {person.milestones.slice(0, 3).map((m) => {
                        const yesCents = getMilestoneYesCents(
                          m.id,
                          m.baseYesCents
                        )
                        const noCents = 100 - yesCents
                        return (
                          <div
                            key={m.id}
                            className="py-2.5 flex items-center justify-between gap-3"
                          >
                            <Link
                              href={`/person/${person.slug}?milestone=${m.id}`}
                              className="min-w-0 flex-1 group"
                            >
                              <div className="text-[13.5px] font-medium text-black group-hover:text-[#ff4665] transition-colors truncate">
                                {m.title}
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-[#71717A] tabular-nums">
                                <span className="font-semibold text-black">
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
                                <span>
                                  {m.closes
                                    .replace(", 2026", "")
                                    .replace(", 2027", "")}
                                </span>
                              </div>
                            </Link>

                            <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setQuickTrade({
                                    person,
                                    milestone: m,
                                    side: "Yes",
                                  })
                                }
                                className="h-[30px] px-3 rounded-full bg-[#fff0f5] hover:bg-[#ff4665] text-[#ff4665] hover:text-white text-[12px] font-medium cursor-pointer whitespace-nowrap"
                              >
                                Yes {yesCents}¢
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setQuickTrade({
                                    person,
                                    milestone: m,
                                    side: "No",
                                  })
                                }
                                className="h-[30px] px-3 rounded-full bg-[#F4F4F6] hover:bg-black text-black/80 hover:text-white text-[12px] font-medium cursor-pointer whitespace-nowrap"
                              >
                                No {noCents}¢
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[12px]">
                    <div className="text-[#71717A] tabular-nums flex items-center gap-2">
                      <span>
                        Vol{" "}
                        <strong className="text-black font-medium">
                          {formatCompactVolume(personVolume)}
                        </strong>
                      </span>
                      <Separator orientation="vertical" className="h-3 bg-black/10" />
                      <span>5 milestones</span>
                    </div>
                    <Link
                      href={`/person/${person.slug}`}
                      className="font-medium text-black hover:text-[#ff4665] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Open Terminal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Bottom 2-Column Live Tape & Closing Soon Strip */}
      <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-[20px] bg-white border-black/[0.07] shadow-none py-0">
          <CardHeader className="px-5 pt-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[15.5px] font-medium tracking-[-0.015em] text-black flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#ff4665]" />
              <span>Live Order Flow</span>
            </CardTitle>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#F5F5F7] text-[#71717A] border-0 text-[10.5px] font-normal"
            >
              Real fills marked YOU
            </Badge>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-1">
            <div className="divide-y divide-black/[0.05] text-[13px] tabular-nums">
              {liveTape.slice(0, 6).map((fill) => (
                <Link
                  key={fill.id}
                  href={`/person/${fill.personSlug}`}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAFAFB] -mx-2 px-2 rounded-[10px] transition-colors"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    {fill.isUser && (
                      <Badge className="rounded bg-[#ff4665] text-white border-0 px-1.5 py-0 text-[9.5px] font-semibold">
                        YOU
                      </Badge>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-black truncate">
                        {fill.personName} · {fill.instrument}
                      </div>
                      <div className="text-[11.5px] text-[#71717A]">
                        {fill.timestamp} · {fill.quantity.toLocaleString()}{" "}
                        {fill.kind === "trajectory" ? "units" : "contracts"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-medium ${
                        fill.side === "No"
                          ? "text-[#ff4665]"
                          : "text-emerald-600"
                      }`}
                    >
                      {fill.action} {fill.side} @ {fill.priceDisplay}
                    </div>
                    <div className="text-[11.5px] text-[#71717A]">
                      {formatCurrency(fill.notional)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] bg-white border-black/[0.07] shadow-none py-0">
          <CardHeader className="px-5 pt-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-[15.5px] font-medium tracking-[-0.015em] text-black flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#ff4665]" />
              <span>Closing Soonest</span>
            </CardTitle>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#F5F5F7] text-[#71717A] border-0 text-[10.5px] font-normal"
            >
              23:59 UTC cutoff
            </Badge>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-1">
            <div className="divide-y divide-black/[0.05] text-[13px] tabular-nums">
              {closingSoonList.map(({ person, milestone }) => {
                const yesCents = getMilestoneYesCents(
                  milestone.id,
                  milestone.baseYesCents
                )
                return (
                  <div
                    key={milestone.id}
                    className="py-2.5 flex items-center justify-between gap-3"
                  >
                    <Link
                      href={`/person/${person.slug}?milestone=${milestone.id}`}
                      className="min-w-0 flex-1 group"
                    >
                      <div className="font-medium text-black group-hover:text-[#ff4665] transition-colors truncate">
                        {person.name} — {milestone.title}
                      </div>
                      <div className="text-[11.5px] text-[#71717A]">
                        Closes {milestone.closes} ·{" "}
                        {formatCompactVolume(
                          getMilestoneVolume(milestone.id, milestone.baseVolume)
                        )}{" "}
                        vol
                      </div>
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setQuickTrade({ person, milestone, side: "Yes" })
                      }
                      className="h-[30px] px-3.5 rounded-full bg-[#fff0f5] hover:bg-[#ff4665] text-[#ff4665] hover:text-white text-[12px] font-medium cursor-pointer shrink-0"
                    >
                      {yesCents}¢ Yes
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <QuickTradeDrawer
        target={quickTrade}
        onClose={() => setQuickTrade(null)}
      />
    </div>
  )
}
