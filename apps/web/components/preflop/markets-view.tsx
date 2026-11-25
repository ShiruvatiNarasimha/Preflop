"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Flame,
  Search,
  Star,
  TrendingUp,
} from "lucide-react"
import { SectionEyebrow } from "./brand-marks"
import {
  PERSON_PROFILES,
  formatCompactVolume,
  formatCurrency,
  formatMultiplier,
  type PersonCategory,
} from "./market-catalog"
import { QuickTradeDrawer, type QuickTradeTarget } from "./quick-trade-drawer"
import { usePreflop } from "./store"

type CategoryFilter = "All" | "Following" | PersonCategory
type SortKey = "volume" | "movers" | "closing"

export function MarketsView() {
  const {
    user,
    toggleWatchlist,
    getMilestoneYesCents,
    getMilestoneVolume,
    getTrajectoryPrice,
    liveTape,
    milestonePositions,
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

  return (
    <div className="opus-container px-5 md:px-8 xl:px-0 py-8 md:py-10">
      {/* Top Editorial Exchange Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <SectionEyebrow text="Human Capital Exchange" />
          <h1 className="mt-3 text-[34px] sm:text-[40px] font-medium leading-[1.08] tracking-[-0.03em] text-black">
            Live Markets
          </h1>
          <p className="mt-2 max-w-[520px] text-[15px] leading-[1.4] text-[#808080]">
            Follow founders, creators, athletes, and artists. Click Yes or No to
            place an instant simulated order, or open any person&apos;s full
            order book.
          </p>
        </div>

        {/* Quiet Institutional KPI Strip */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-4 sm:gap-8 pb-1 tabular-nums">
          <div>
            <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.06em] text-[#808080]">
              Total Sim Vol
            </div>
            <div className="mt-0.5 text-[18px] sm:text-[20px] font-medium text-black tracking-[-0.02em]">
              {formatCompactVolume(totalPlatformVolume)}
            </div>
          </div>
          <div className="hidden sm:block h-7 w-px bg-black/[0.08]" />
          <div>
            <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.06em] text-[#808080]">
              Active Markets
            </div>
            <div className="mt-0.5 text-[18px] sm:text-[20px] font-medium text-black tracking-[-0.02em]">
              40
            </div>
          </div>
          <div className="hidden sm:block h-7 w-px bg-black/[0.08]" />
          <div>
            <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.06em] text-[#808080]">
              People Listed
            </div>
            <div className="mt-0.5 text-[18px] sm:text-[20px] font-medium text-black tracking-[-0.02em]">
              {PERSON_PROFILES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Banner (Signature Pink-Silk Frosted Aesthetic) */}
      <div className="mt-8 relative rounded-[24px] overflow-hidden border border-black/[0.06]">
        <img
          src="/media/silk-card-1.avif"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-10 p-5 sm:p-7 bg-white/75 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[600px]">
            <div className="inline-flex items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#ff4665]">
              <Flame className="h-3.5 w-3.5" />
              <span>Featured Market · {spotlightPerson.company}</span>
            </div>
            <h2 className="mt-2 text-[22px] sm:text-[26px] font-medium tracking-[-0.025em] text-black leading-[1.18]">
              {spotlightPerson.name}: {spotlightLead.question}
            </h2>
            <p className="mt-2 text-[13.5px] text-black/65">
              {spotlightPerson.bio}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 tabular-nums">
            <button
              type="button"
              onClick={() =>
                setQuickTrade({
                  person: spotlightPerson,
                  milestone: spotlightLead,
                  side: "Yes",
                })
              }
              className="h-[42px] px-5 rounded-full bg-[#ff4665] text-white text-[13.5px] font-medium hover:bg-[#e53554] transition-colors cursor-pointer shadow-[0_10px_24px_-8px_rgba(255,70,101,0.55)]"
            >
              Buy Yes · {spotlightYes}¢ ({formatMultiplier(spotlightYes)})
            </button>
            <button
              type="button"
              onClick={() =>
                setQuickTrade({
                  person: spotlightPerson,
                  milestone: spotlightLead,
                  side: "No",
                })
              }
              className="h-[42px] px-5 rounded-full bg-white text-black border border-black/12 text-[13.5px] font-medium hover:border-black/35 transition-colors cursor-pointer"
            >
              Buy No · {spotlightNo}¢
            </button>
            <Link
              href={`/person/${spotlightPerson.slug}`}
              className="h-[42px] px-5 rounded-full bg-black text-white text-[13.5px] font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Terminal</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sort Controls */}
      <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
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
            const active = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`h-[34px] px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "bg-black text-white"
                    : "bg-white border border-black/[0.08] text-black/70 hover:text-black hover:border-black/25"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-black/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="markets-search"
              name="marketsSearch"
              aria-label="Search people or milestones"
              type="text"
              placeholder="Search people or milestones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[36px] w-full sm:w-[240px] rounded-full bg-white border border-black/[0.09] pl-9 pr-4 text-[13px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center bg-white border border-black/[0.08] rounded-full p-0.5 text-[12px]">
            {(
              [
                { id: "volume", label: "Volume" },
                { id: "movers", label: "Movers" },
                { id: "closing", label: "Closing Soon" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={`h-[28px] px-3 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  sortBy === opt.id
                    ? "bg-[#fff0f5] text-[#ff4665]"
                    : "text-black/60 hover:text-black"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Person Markets Grid */}
      {filteredPeople.length === 0 ? (
        <div className="mt-8 rounded-[20px] bg-white border border-black/[0.07] p-12 text-center">
          <div className="text-[18px] font-medium text-black">
            No matching markets
          </div>
          <p className="mt-1.5 text-[14px] text-[#808080]">
            Try clearing your search or switching back to All categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("All")
              setSearch("")
            }}
            className="mt-4 h-[34px] px-5 rounded-full bg-black text-white text-[13px] font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
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

            return (
              <article
                key={person.slug}
                className="rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-6 hover:border-black/20 hover:shadow-[0_20px_48px_-28px_rgba(0,0,0,0.16)] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/person/${person.slug}`}
                      className="flex items-center gap-3 group min-w-0"
                    >
                      <span className="h-11 w-11 rounded-full bg-opus-gradient text-white text-[13px] font-semibold flex items-center justify-center shrink-0 shadow-[0_6px_16px_-6px_rgba(255,70,101,0.5)]">
                        {person.initials}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <h3 className="text-[18px] sm:text-[19px] font-medium tracking-[-0.02em] text-black group-hover:text-[#ff4665] transition-colors truncate">
                            {person.name}
                          </h3>
                          {userPosCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#fff0f5] text-[10.5px] font-medium text-[#ff4665] shrink-0">
                              {userPosCount} open
                            </span>
                          )}
                        </div>
                        <div className="text-[12.5px] text-[#808080] truncate">
                          {person.role} · {person.company}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/person/${person.slug}?view=trajectory`}
                        className="px-2.5 py-1 rounded-full bg-[#F7F7F8] hover:bg-[#fff0f5] border border-black/[0.06] text-[11.5px] font-medium text-black transition-colors tabular-nums"
                        title="Open Trajectory Unit market"
                      >
                        <span className="text-black/50 mr-1">
                          {person.trajectory.ticker}
                        </span>
                        {formatCurrency(trajSpot)}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleWatchlist(person.slug)}
                        aria-label={
                          isFollowed
                            ? `Unfollow ${person.name}`
                            : `Follow ${person.name}`
                        }
                        className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                          isFollowed
                            ? "border-[#ff4665]/30 bg-[#fff5f8] text-[#ff4665]"
                            : "border-black/10 bg-white text-black/40 hover:text-black"
                        }`}
                      >
                        <Star
                          className="h-3.5 w-3.5"
                          fill={isFollowed ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Top 3 Milestones with Instant Yes/No Trade Triggers */}
                  <div className="mt-5 divide-y divide-black/[0.05]">
                    {person.milestones.slice(0, 3).map((m) => {
                      const yesCents = getMilestoneYesCents(m.id, m.baseYesCents)
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
                            <div className="mt-1 flex items-center gap-2 text-[11.5px] text-[#808080] tabular-nums">
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
                              <span>{m.closes.replace(", 2026", "").replace(", 2027", "")}</span>
                            </div>
                          </Link>

                          <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
                            <button
                              type="button"
                              onClick={() =>
                                setQuickTrade({
                                  person,
                                  milestone: m,
                                  side: "Yes",
                                })
                              }
                              className="h-[30px] px-3 rounded-full bg-[#fff0f5] hover:bg-[#ff4665] text-[#ff4665] hover:text-white text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Yes {yesCents}¢
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setQuickTrade({
                                  person,
                                  milestone: m,
                                  side: "No",
                                })
                              }
                              className="h-[30px] px-3 rounded-full bg-[#F4F4F6] hover:bg-black text-black/80 hover:text-white text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                            >
                              No {noCents}¢
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3.5 border-t border-black/[0.06] flex items-center justify-between text-[12.5px]">
                  <div className="text-[#808080] tabular-nums">
                    Vol{" "}
                    <span className="text-black font-medium">
                      {formatCompactVolume(personVolume)}
                    </span>{" "}
                    · 5 milestones
                  </div>
                  <Link
                    href={`/person/${person.slug}`}
                    className="font-medium text-black hover:text-[#ff4665] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Open Terminal</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Bottom 2-Column Live Tape & Closing Soon Strip */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Market Activity Tape */}
        <div className="rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#ff4665]" />
              <h3 className="text-[16px] font-medium tracking-[-0.02em] text-black">
                Live Order Flow
              </h3>
            </div>
            <span className="text-[11.5px] text-[#808080]">
              Simulated tape · Real fills marked YOU
            </span>
          </div>

          <div className="mt-4 divide-y divide-black/[0.05] text-[13px] tabular-nums">
            {liveTape.slice(0, 6).map((fill) => (
              <Link
                key={fill.id}
                href={`/person/${fill.personSlug}`}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FAFAFB] -mx-2 px-2 rounded-[10px] transition-colors"
              >
                <div className="min-w-0 flex items-center gap-2">
                  {fill.isUser && (
                    <span className="px-1.5 py-0.5 rounded bg-[#ff4665] text-white text-[9.5px] font-semibold">
                      YOU
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-black truncate">
                      {fill.personName} · {fill.instrument}
                    </div>
                    <div className="text-[11.5px] text-[#808080]">
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
                  <div className="text-[11.5px] text-[#808080]">
                    {formatCurrency(fill.notional)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Closing Soon */}
        <div className="rounded-[22px] bg-white border border-black/[0.07] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#ff4665]" />
              <h3 className="text-[16px] font-medium tracking-[-0.02em] text-black">
                Closing Soonest
              </h3>
            </div>
            <span className="text-[11.5px] text-[#808080]">
              23:59 UTC cutoff
            </span>
          </div>

          <div className="mt-4 divide-y divide-black/[0.05] text-[13px] tabular-nums">
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
                    <div className="text-[11.5px] text-[#808080]">
                      Closes {milestone.closes} ·{" "}
                      {formatCompactVolume(
                        getMilestoneVolume(milestone.id, milestone.baseVolume)
                      )}{" "}
                      vol
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      setQuickTrade({ person, milestone, side: "Yes" })
                    }
                    className="h-[30px] px-3.5 rounded-full bg-[#fff0f5] hover:bg-[#ff4665] text-[#ff4665] hover:text-white text-[12px] font-medium transition-colors cursor-pointer shrink-0"
                  >
                    {yesCents}¢ Yes
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <QuickTradeDrawer
        target={quickTrade}
        onClose={() => setQuickTrade(null)}
      />
    </div>
  )
}
