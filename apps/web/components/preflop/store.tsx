"use client"

import * as React from "react"
import { toast } from "sonner"
import type { EarlyAccessRole } from "./data"
import {
  PERSON_PROFILES,
  formatCurrency,
  type FullMilestone,
  type PersonProfile,
} from "./market-catalog"

export interface UserProfile {
  onboarded: boolean
  name: string
  email: string
  role: EarlyAccessRole
  watchlist: string[]
  createdAt: string
}

export interface MilestonePosition {
  key: string // `${personSlug}:${milestoneId}:${side}`
  personSlug: string
  personName: string
  milestoneId: string
  milestoneTitle: string
  side: "Yes" | "No"
  contracts: number
  avgPriceCents: number
  totalCost: number
}

export interface TrajectoryPosition {
  personSlug: string
  personName: string
  ticker: string
  units: number
  avgPrice: number
  totalCost: number
}

export interface TradeFill {
  id: string
  timestamp: string
  personSlug: string
  personName: string
  instrument: string
  kind: "milestone" | "trajectory"
  action: "Buy" | "Sell"
  side: "Yes" | "No" | "Units"
  priceDisplay: string
  quantity: number
  notional: number
  fee: number
  realizedPnl?: number
  isUser: boolean
}

export interface CovenantDraft {
  id: string
  mode: "covenant" | "direct"
  builderName: string
  projectTitle: string
  ticker?: string
  raiseAmount?: number
  incomeSharePct?: number
  termYears?: number
  conversionUnitsPct?: number
  retainedPct: number
  createdAt: string
}

interface PersistedState {
  user: UserProfile
  cashBalance: number
  realizedPnl: number
  milestonePositions: MilestonePosition[]
  trajectoryPositions: TrajectoryPosition[]
  fills: TradeFill[]
  drafts: CovenantDraft[]
}

const STORAGE_KEY = "preflop_live_desk_v1"
const INITIAL_CASH = 100_000

const DEFAULT_USER: UserProfile = {
  onboarded: false,
  name: "",
  email: "",
  role: "back",
  watchlist: ["brendan-foody", "mrbeast", "tanay-kothari"],
  createdAt: "",
}

function buildInitialPrices(): Record<string, number> {
  const prices: Record<string, number> = {}
  for (const person of PERSON_PROFILES) {
    for (const m of person.milestones) {
      prices[m.id] = m.baseYesCents
    }
  }
  return prices
}

function buildInitialTrajectoryPrices(): Record<string, number> {
  const prices: Record<string, number> = {}
  for (const person of PERSON_PROFILES) {
    prices[person.slug] = person.trajectory.spotPrice
  }
  return prices
}

function buildInitialVolumes(): Record<string, number> {
  const vols: Record<string, number> = {}
  for (const person of PERSON_PROFILES) {
    for (const m of person.milestones) {
      vols[m.id] = m.baseVolume
    }
  }
  return vols
}

function buildSeedTape(): TradeFill[] {
  return [
    {
      id: "seed-1",
      timestamp: "12s ago",
      personSlug: "brendan-foody",
      personName: "Brendan Foody",
      instrument: "Research platform",
      kind: "milestone",
      action: "Buy",
      side: "Yes",
      priceDisplay: "74¢",
      quantity: 320,
      notional: 236.8,
      fee: 3.2,
      isUser: false,
    },
    {
      id: "seed-2",
      timestamp: "28s ago",
      personSlug: "mrbeast",
      personName: "MrBeast",
      instrument: "100M-view next upload",
      kind: "milestone",
      action: "Buy",
      side: "Yes",
      priceDisplay: "78¢",
      quantity: 500,
      notional: 390,
      fee: 5.0,
      isUser: false,
    },
    {
      id: "seed-3",
      timestamp: "49s ago",
      personSlug: "tanay-kothari",
      personName: "Tanay Kothari",
      instrument: "Public developer API",
      kind: "milestone",
      action: "Buy",
      side: "No",
      priceDisplay: "29¢",
      quantity: 210,
      notional: 60.9,
      fee: 2.1,
      isUser: false,
    },
    {
      id: "seed-4",
      timestamp: "1m ago",
      personSlug: "sabrina-carpenter",
      personName: "Sabrina Carpenter",
      instrument: "A new lead single",
      kind: "milestone",
      action: "Buy",
      side: "Yes",
      priceDisplay: "72¢",
      quantity: 440,
      notional: 316.8,
      fee: 4.4,
      isUser: false,
    },
    {
      id: "seed-5",
      timestamp: "2m ago",
      personSlug: "fernando-mendoza",
      personName: "Fernando Mendoza",
      instrument: "Next regular-season start",
      kind: "milestone",
      action: "Buy",
      side: "Yes",
      priceDisplay: "72¢",
      quantity: 275,
      notional: 198,
      fee: 2.75,
      isUser: false,
    },
    {
      id: "seed-6",
      timestamp: "3m ago",
      personSlug: "roy-lee",
      personName: "Roy Lee",
      instrument: "Enterprise launch",
      kind: "milestone",
      action: "Buy",
      side: "Yes",
      priceDisplay: "76¢",
      quantity: 190,
      notional: 144.4,
      fee: 1.9,
      isUser: false,
    },
  ]
}

interface PreflopContextValue {
  hydrated: boolean
  user: UserProfile
  cashBalance: number
  realizedPnl: number
  positionsValue: number
  unrealizedPnl: number
  totalEquity: number
  milestonePositions: MilestonePosition[]
  trajectoryPositions: TrajectoryPosition[]
  fills: TradeFill[]
  liveTape: TradeFill[]
  drafts: CovenantDraft[]
  onboardingOpen: boolean
  setOnboardingOpen: (open: boolean) => void
  onboardingDefaultRole: EarlyAccessRole
  openOnboarding: (role?: EarlyAccessRole) => void
  completeOnboarding: (payload: {
    name: string
    email: string
    role: EarlyAccessRole
    watchlist: string[]
  }) => void
  toggleWatchlist: (slug: string) => void
  getMilestoneYesCents: (milestoneId: string, fallback: number) => number
  getMilestoneVolume: (milestoneId: string, fallback: number) => number
  getTrajectoryPrice: (personSlug: string, fallback: number) => number
  buyMilestone: (params: {
    person: PersonProfile
    milestone: FullMilestone
    side: "Yes" | "No"
    stakeUsd: number
    limitPriceCents?: number
  }) => boolean
  sellMilestone: (positionKey: string, contractsToSell?: number) => boolean
  buyTrajectoryUnits: (params: {
    person: PersonProfile
    units: number
  }) => boolean
  sellTrajectoryUnits: (personSlug: string, unitsToSell?: number) => boolean
  saveDraft: (draft: Omit<CovenantDraft, "id" | "createdAt">) => CovenantDraft
  resetAccount: () => void
}

const PreflopContext = React.createContext<PreflopContextValue | null>(null)

export function PreflopProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = React.useState(false)
  const [user, setUser] = React.useState<UserProfile>(DEFAULT_USER)
  const [cashBalance, setCashBalance] = React.useState<number>(INITIAL_CASH)
  const [realizedPnl, setRealizedPnl] = React.useState<number>(0)
  const [milestonePositions, setMilestonePositions] = React.useState<
    MilestonePosition[]
  >([])
  const [trajectoryPositions, setTrajectoryPositions] = React.useState<
    TrajectoryPosition[]
  >([])
  const [fills, setFills] = React.useState<TradeFill[]>([])
  const [drafts, setDrafts] = React.useState<CovenantDraft[]>([])

  const [liveYesPrices, setLiveYesPrices] =
    React.useState<Record<string, number>>(buildInitialPrices)
  const [liveTrajectoryPrices, setLiveTrajectoryPrices] = React.useState<
    Record<string, number>
  >(buildInitialTrajectoryPrices)
  const [liveVolumes, setLiveVolumes] =
    React.useState<Record<string, number>>(buildInitialVolumes)
  const [marketTape, setMarketTape] = React.useState<TradeFill[]>(buildSeedTape)

  const [onboardingOpen, setOnboardingOpen] = React.useState(false)
  const [onboardingDefaultRole, setOnboardingDefaultRole] =
    React.useState<EarlyAccessRole>("back")

  // Hydrate persisted desk state from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>
        if (parsed.user) setUser({ ...DEFAULT_USER, ...parsed.user })
        if (typeof parsed.cashBalance === "number")
          setCashBalance(parsed.cashBalance)
        if (typeof parsed.realizedPnl === "number")
          setRealizedPnl(parsed.realizedPnl)
        if (Array.isArray(parsed.milestonePositions))
          setMilestonePositions(parsed.milestonePositions)
        if (Array.isArray(parsed.trajectoryPositions))
          setTrajectoryPositions(parsed.trajectoryPositions)
        if (Array.isArray(parsed.fills)) setFills(parsed.fills)
        if (Array.isArray(parsed.drafts)) setDrafts(parsed.drafts)
      }
    } catch {
      // Ignore storage parse errors
    } finally {
      setHydrated(true)
    }
  }, [])

  // Persist account state
  React.useEffect(() => {
    if (!hydrated) return
    try {
      const state: PersistedState = {
        user,
        cashBalance,
        realizedPnl,
        milestonePositions,
        trajectoryPositions,
        fills,
        drafts,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore quota errors
    }
  }, [
    hydrated,
    user,
    cashBalance,
    realizedPnl,
    milestonePositions,
    trajectoryPositions,
    fills,
    drafts,
  ])

  // Gentle realistic live order-flow ticks (every 4.5s)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const personIdx = Math.floor(Math.random() * PERSON_PROFILES.length)
      const person = PERSON_PROFILES[personIdx]
      if (!person) return
      const mIdx = Math.floor(Math.random() * person.milestones.length)
      const milestone = person.milestones[mIdx]
      if (!milestone) return

      const step = Math.random() > 0.48 ? 1 : -1
      const tradeQty = [60, 110, 180, 240, 350, 500][
        Math.floor(Math.random() * 6)
      ]!
      const tradeSide: "Yes" | "No" = Math.random() > 0.42 ? "Yes" : "No"

      setLiveYesPrices((prev) => {
        const current = prev[milestone.id] ?? milestone.baseYesCents
        const minBound = Math.max(8, milestone.baseYesCents - 5)
        const maxBound = Math.min(92, milestone.baseYesCents + 5)
        const nextVal = Math.max(minBound, Math.min(maxBound, current + step))

        const execCents = tradeSide === "Yes" ? nextVal : 100 - nextVal
        const notional = Number(((execCents / 100) * tradeQty).toFixed(2))

        setMarketTape((tapePrev) =>
          [
            {
              id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              timestamp: "Just now",
              personSlug: person.slug,
              personName: person.name,
              instrument: milestone.title,
              kind: "milestone" as const,
              action: "Buy" as const,
              side: tradeSide,
              priceDisplay: `${execCents}¢`,
              quantity: tradeQty,
              notional,
              fee: Number((tradeQty * 0.01).toFixed(2)),
              isUser: false,
            },
            ...tapePrev,
          ].slice(0, 30)
        )

        return { ...prev, [milestone.id]: nextVal }
      })

      setLiveVolumes((prev) => ({
        ...prev,
        [milestone.id]:
          (prev[milestone.id] ?? milestone.baseVolume) +
          Math.round(tradeQty * 0.65),
      }))

      // Gentle trajectory unit tick
      setLiveTrajectoryPrices((prev) => {
        const cur = prev[person.slug] ?? person.trajectory.spotPrice
        const delta = Number(((Math.random() - 0.48) * 0.65).toFixed(2))
        const nextSpot = Math.max(10, Number((cur + delta).toFixed(2)))
        return { ...prev, [person.slug]: nextSpot }
      })
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  const getMilestoneYesCents = React.useCallback(
    (milestoneId: string, fallback: number) =>
      liveYesPrices[milestoneId] ?? fallback,
    [liveYesPrices]
  )

  const getMilestoneVolume = React.useCallback(
    (milestoneId: string, fallback: number) =>
      liveVolumes[milestoneId] ?? fallback,
    [liveVolumes]
  )

  const getTrajectoryPrice = React.useCallback(
    (personSlug: string, fallback: number) =>
      liveTrajectoryPrices[personSlug] ?? fallback,
    [liveTrajectoryPrices]
  )

  // Live portfolio valuation
  const { positionsValue, unrealizedPnl } = React.useMemo(() => {
    let val = 0
    let cost = 0

    for (const pos of milestonePositions) {
      const yesCents = liveYesPrices[pos.milestoneId] ?? pos.avgPriceCents
      const markCents = pos.side === "Yes" ? yesCents : 100 - yesCents
      val += pos.contracts * (markCents / 100)
      cost += pos.totalCost
    }

    for (const pos of trajectoryPositions) {
      const spot = liveTrajectoryPrices[pos.personSlug] ?? pos.avgPrice
      val += pos.units * spot
      cost += pos.totalCost
    }

    return {
      positionsValue: Number(val.toFixed(2)),
      unrealizedPnl: Number((val - cost).toFixed(2)),
    }
  }, [
    milestonePositions,
    trajectoryPositions,
    liveYesPrices,
    liveTrajectoryPrices,
  ])

  const totalEquity = Number((cashBalance + positionsValue).toFixed(2))

  const openOnboarding = React.useCallback(
    (role: EarlyAccessRole = "back") => {
      setOnboardingDefaultRole(role)
      setOnboardingOpen(true)
    },
    []
  )

  const completeOnboarding = React.useCallback(
    (payload: {
      name: string
      email: string
      role: EarlyAccessRole
      watchlist: string[]
    }) => {
      setUser({
        onboarded: true,
        name: payload.name.trim() || "Trader",
        email: payload.email.trim(),
        role: payload.role,
        watchlist:
          payload.watchlist.length > 0
            ? payload.watchlist
            : ["brendan-foody", "mrbeast", "tanay-kothari"],
        createdAt: new Date().toISOString(),
      })
      setOnboardingOpen(false)
      toast.success("Preflop desk activated · $100,000.00 buying power ready")
    },
    []
  )

  const toggleWatchlist = React.useCallback((slug: string) => {
    setUser((prev) => {
      const exists = prev.watchlist.includes(slug)
      const next = exists
        ? prev.watchlist.filter((id) => id !== slug)
        : [...prev.watchlist, slug]
      return { ...prev, watchlist: next }
    })
  }, [])

  const buyMilestone = React.useCallback(
    ({
      person,
      milestone,
      side,
      stakeUsd,
      limitPriceCents,
    }: {
      person: PersonProfile
      milestone: FullMilestone
      side: "Yes" | "No"
      stakeUsd: number
      limitPriceCents?: number
    }) => {
      if (!Number.isFinite(stakeUsd) || stakeUsd < 5) {
        toast.error("Minimum order size is $5.00.")
        return false
      }

      const currentYes = liveYesPrices[milestone.id] ?? milestone.baseYesCents
      const marketCents = side === "Yes" ? currentYes : 100 - currentYes
      const execCents = Math.max(
        1,
        Math.min(99, limitPriceCents ?? marketCents)
      )
      const pricePerContract = execCents / 100
      const contracts = Math.floor(stakeUsd / (pricePerContract + 0.01))

      if (contracts < 1) {
        toast.error("Increase your stake to buy at least 1 contract.")
        return false
      }

      const notional = Number((contracts * pricePerContract).toFixed(2))
      const fee = Number((contracts * 0.01).toFixed(2))
      const totalDebit = Number((notional + fee).toFixed(2))

      if (totalDebit > cashBalance) {
        toast.error(
          `Insufficient buying power (${formatCurrency(cashBalance)} available).`
        )
        return false
      }

      const posKey = `${person.slug}:${milestone.id}:${side}`

      setCashBalance((prev) => Number((prev - totalDebit).toFixed(2)))
      setMilestonePositions((prev) => {
        const existing = prev.find((p) => p.key === posKey)
        if (!existing) {
          return [
            {
              key: posKey,
              personSlug: person.slug,
              personName: person.name,
              milestoneId: milestone.id,
              milestoneTitle: milestone.title,
              side,
              contracts,
              avgPriceCents: execCents,
              totalCost: totalDebit,
            },
            ...prev,
          ]
        }
        const totalContracts = existing.contracts + contracts
        const totalCost = Number((existing.totalCost + totalDebit).toFixed(2))
        const weightedAvg = Math.round(
          (existing.avgPriceCents * existing.contracts +
            execCents * contracts) /
            totalContracts
        )
        return prev.map((p) =>
          p.key === posKey
            ? {
                ...p,
                contracts: totalContracts,
                avgPriceCents: weightedAvg,
                totalCost,
              }
            : p
        )
      })

      // Subtle realistic price impact on larger fills
      if (contracts >= 400) {
        setLiveYesPrices((prev) => {
          const cur = prev[milestone.id] ?? milestone.baseYesCents
          const impact = side === "Yes" ? 1 : -1
          return {
            ...prev,
            [milestone.id]: Math.max(5, Math.min(95, cur + impact)),
          }
        })
      }

      setLiveVolumes((prev) => ({
        ...prev,
        [milestone.id]:
          (prev[milestone.id] ?? milestone.baseVolume) + Math.round(notional),
      }))

      const newFill: TradeFill = {
        id: `usr-${Date.now()}`,
        timestamp: "Just now",
        personSlug: person.slug,
        personName: person.name,
        instrument: milestone.title,
        kind: "milestone",
        action: "Buy",
        side,
        priceDisplay: `${execCents}¢`,
        quantity: contracts,
        notional,
        fee,
        isUser: true,
      }

      setFills((prev) => [newFill, ...prev])
      setMarketTape((prev) => [newFill, ...prev].slice(0, 30))

      toast.success(
        `Filled: ${contracts.toLocaleString()} ${side} @ ${execCents}¢ · ${milestone.title}`
      )
      return true
    },
    [cashBalance, liveYesPrices]
  )

  const sellMilestone = React.useCallback(
    (positionKey: string, contractsToSell?: number) => {
      const existing = milestonePositions.find((p) => p.key === positionKey)
      if (!existing) return false

      const qty = Math.min(
        existing.contracts,
        Math.max(1, contractsToSell ?? existing.contracts)
      )
      const currentYes =
        liveYesPrices[existing.milestoneId] ?? existing.avgPriceCents
      const markCents =
        existing.side === "Yes" ? currentYes : 100 - currentYes
      const grossProceeds = Number((qty * (markCents / 100)).toFixed(2))
      const fee = Number((qty * 0.01).toFixed(2))
      const netProceeds = Math.max(0, Number((grossProceeds - fee).toFixed(2)))
      const proportionalCost = Number(
        (existing.totalCost * (qty / existing.contracts)).toFixed(2)
      )
      const pnl = Number((netProceeds - proportionalCost).toFixed(2))

      setCashBalance((prev) => Number((prev + netProceeds).toFixed(2)))
      setRealizedPnl((prev) => Number((prev + pnl).toFixed(2)))

      setMilestonePositions((prev) => {
        if (qty >= existing.contracts) {
          return prev.filter((p) => p.key !== positionKey)
        }
        const remaining = existing.contracts - qty
        return prev.map((p) =>
          p.key === positionKey
            ? {
                ...p,
                contracts: remaining,
                totalCost: Number(
                  (existing.totalCost - proportionalCost).toFixed(2)
                ),
              }
            : p
        )
      })

      const fill: TradeFill = {
        id: `usr-sell-${Date.now()}`,
        timestamp: "Just now",
        personSlug: existing.personSlug,
        personName: existing.personName,
        instrument: existing.milestoneTitle,
        kind: "milestone",
        action: "Sell",
        side: existing.side,
        priceDisplay: `${markCents}¢`,
        quantity: qty,
        notional: grossProceeds,
        fee,
        realizedPnl: pnl,
        isUser: true,
      }

      setFills((prev) => [fill, ...prev])
      setMarketTape((prev) => [fill, ...prev].slice(0, 30))

      const pnlPrefix = pnl >= 0 ? "+" : ""
      toast.success(
        `Closed ${qty.toLocaleString()} ${existing.side} @ ${markCents}¢ (${pnlPrefix}${formatCurrency(pnl)})`
      )
      return true
    },
    [milestonePositions, liveYesPrices]
  )

  const buyTrajectoryUnits = React.useCallback(
    ({ person, units }: { person: PersonProfile; units: number }) => {
      if (!Number.isFinite(units) || units < 1) {
        toast.error("Minimum order is 1 Trajectory Unit.")
        return false
      }
      const spot = liveTrajectoryPrices[person.slug] ?? person.trajectory.spotPrice
      const notional = Number((units * spot).toFixed(2))
      const fee = Number((notional * 0.0025).toFixed(2))
      const totalDebit = Number((notional + fee).toFixed(2))

      if (totalDebit > cashBalance) {
        toast.error(
          `Insufficient buying power (${formatCurrency(cashBalance)} available).`
        )
        return false
      }

      setCashBalance((prev) => Number((prev - totalDebit).toFixed(2)))
      setTrajectoryPositions((prev) => {
        const existing = prev.find((p) => p.personSlug === person.slug)
        if (!existing) {
          return [
            {
              personSlug: person.slug,
              personName: person.name,
              ticker: person.trajectory.ticker,
              units,
              avgPrice: spot,
              totalCost: totalDebit,
            },
            ...prev,
          ]
        }
        const nextUnits = existing.units + units
        const nextCost = Number((existing.totalCost + totalDebit).toFixed(2))
        return prev.map((p) =>
          p.personSlug === person.slug
            ? {
                ...p,
                units: nextUnits,
                avgPrice: Number((nextCost / nextUnits).toFixed(2)),
                totalCost: nextCost,
              }
            : p
        )
      })

      const fill: TradeFill = {
        id: `usr-traj-${Date.now()}`,
        timestamp: "Just now",
        personSlug: person.slug,
        personName: person.name,
        instrument: `${person.trajectory.ticker} Trajectory Unit`,
        kind: "trajectory",
        action: "Buy",
        side: "Units",
        priceDisplay: formatCurrency(spot),
        quantity: units,
        notional,
        fee,
        isUser: true,
      }

      setFills((prev) => [fill, ...prev])
      setMarketTape((prev) => [fill, ...prev].slice(0, 30))

      toast.success(
        `Acquired ${units} ${person.trajectory.ticker} @ ${formatCurrency(spot)}`
      )
      return true
    },
    [cashBalance, liveTrajectoryPrices]
  )

  const sellTrajectoryUnits = React.useCallback(
    (personSlug: string, unitsToSell?: number) => {
      const existing = trajectoryPositions.find(
        (p) => p.personSlug === personSlug
      )
      if (!existing) return false

      const qty = Math.min(
        existing.units,
        Math.max(1, unitsToSell ?? existing.units)
      )
      const spot = liveTrajectoryPrices[personSlug] ?? existing.avgPrice
      const gross = Number((qty * spot).toFixed(2))
      const fee = Number((gross * 0.0025).toFixed(2))
      const net = Math.max(0, Number((gross - fee).toFixed(2)))
      const proportionalCost = Number(
        (existing.totalCost * (qty / existing.units)).toFixed(2)
      )
      const pnl = Number((net - proportionalCost).toFixed(2))

      setCashBalance((prev) => Number((prev + net).toFixed(2)))
      setRealizedPnl((prev) => Number((prev + pnl).toFixed(2)))
      setTrajectoryPositions((prev) => {
        if (qty >= existing.units) {
          return prev.filter((p) => p.personSlug !== personSlug)
        }
        return prev.map((p) =>
          p.personSlug === personSlug
            ? {
                ...p,
                units: existing.units - qty,
                totalCost: Number(
                  (existing.totalCost - proportionalCost).toFixed(2)
                ),
              }
            : p
        )
      })

      const fill: TradeFill = {
        id: `usr-traj-sell-${Date.now()}`,
        timestamp: "Just now",
        personSlug: existing.personSlug,
        personName: existing.personName,
        instrument: `${existing.ticker} Trajectory Unit`,
        kind: "trajectory",
        action: "Sell",
        side: "Units",
        priceDisplay: formatCurrency(spot),
        quantity: qty,
        notional: gross,
        fee,
        realizedPnl: pnl,
        isUser: true,
      }

      setFills((prev) => [fill, ...prev])
      setMarketTape((prev) => [fill, ...prev].slice(0, 30))

      const pnlPrefix = pnl >= 0 ? "+" : ""
      toast.success(
        `Sold ${qty} ${existing.ticker} @ ${formatCurrency(spot)} (${pnlPrefix}${formatCurrency(pnl)})`
      )
      return true
    },
    [trajectoryPositions, liveTrajectoryPrices]
  )

  const saveDraft = React.useCallback(
    (draft: Omit<CovenantDraft, "id" | "createdAt">) => {
      const created: CovenantDraft = {
        ...draft,
        id: `draft-${Date.now()}`,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }
      setDrafts((prev) => [created, ...prev])
      toast.success(
        draft.mode === "covenant"
          ? "Covenant term sheet preview saved to your account"
          : "Direct Listing preview saved to your account"
      )
      return created
    },
    []
  )

  const resetAccount = React.useCallback(() => {
    setUser(DEFAULT_USER)
    setCashBalance(INITIAL_CASH)
    setRealizedPnl(0)
    setMilestonePositions([])
    setTrajectoryPositions([])
    setFills([])
    setDrafts([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
    toast.info("Paper desk reset to $100,000.00")
  }, [])

  const value = React.useMemo<PreflopContextValue>(
    () => ({
      hydrated,
      user,
      cashBalance,
      realizedPnl,
      positionsValue,
      unrealizedPnl,
      totalEquity,
      milestonePositions,
      trajectoryPositions,
      fills,
      liveTape: marketTape,
      drafts,
      onboardingOpen,
      setOnboardingOpen,
      onboardingDefaultRole,
      openOnboarding,
      completeOnboarding,
      toggleWatchlist,
      getMilestoneYesCents,
      getMilestoneVolume,
      getTrajectoryPrice,
      buyMilestone,
      sellMilestone,
      buyTrajectoryUnits,
      sellTrajectoryUnits,
      saveDraft,
      resetAccount,
    }),
    [
      hydrated,
      user,
      cashBalance,
      realizedPnl,
      positionsValue,
      unrealizedPnl,
      totalEquity,
      milestonePositions,
      trajectoryPositions,
      fills,
      marketTape,
      drafts,
      onboardingOpen,
      onboardingDefaultRole,
      openOnboarding,
      completeOnboarding,
      toggleWatchlist,
      getMilestoneYesCents,
      getMilestoneVolume,
      getTrajectoryPrice,
      buyMilestone,
      sellMilestone,
      buyTrajectoryUnits,
      sellTrajectoryUnits,
      saveDraft,
      resetAccount,
    ]
  )

  return (
    <PreflopContext.Provider value={value}>{children}</PreflopContext.Provider>
  )
}

export function usePreflop() {
  const ctx = React.useContext(PreflopContext)
  if (!ctx) {
    throw new Error("usePreflop must be used inside <PreflopProvider>")
  }
  return ctx
}
