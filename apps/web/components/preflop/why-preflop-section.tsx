"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileCheck2,
  Layers,
  Plus,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { PreflopEmblem, SectionEyebrow } from "./brand-marks"
import type { EarlyAccessRole } from "./data"

interface WhyPreflopSectionProps {
  onOpenEarlyAccess: (defaultRole?: EarlyAccessRole) => void
}

/**
 * Card 1 Visual: Conviction signals (Track Record, Network, Pipeline) converging into
 * the Preflop Pf hub and clearing into a live "74¢ Yes" market price pill.
 */
function ConvictionSignalVisual() {
  const gradId = React.useId()
  const pathTopId = React.useId()
  const pathBottomId = React.useId()
  const pathOutId = React.useId()

  return (
    <div className="relative h-[252px] w-full rounded-[20px] bg-[#F7F7F7] overflow-hidden select-none">
      <svg
        viewBox="0 0 360 252"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="0"
            y1="0"
            x2="360"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FE7AC6" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#FF5D8F" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF4665" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Top curved input path */}
        <path
          id={pathTopId}
          d="M-8 40 C 56 46, 86 92, 152 122"
          stroke={`url(#${gradId})`}
          strokeWidth="1.6"
        />
        {/* Upper-mid curved input path */}
        <path
          d="M-8 144 C 34 140, 48 64, 90 74 C 118 80, 126 118, 152 126"
          stroke={`url(#${gradId})`}
          strokeWidth="1.6"
        />
        {/* Lower curved input path */}
        <path
          id={pathBottomId}
          d="M-8 214 C 54 214, 70 158, 108 144 C 126 138, 138 134, 152 132"
          stroke={`url(#${gradId})`}
          strokeWidth="1.6"
        />
        {/* Output path to price pill & right edge */}
        <path
          id={pathOutId}
          d="M196 126 L 366 126"
          stroke={`url(#${gradId})`}
          strokeWidth="1.6"
        />

        {/* Resolution-independent SVG motion pulses locked strictly to viewBox paths */}
        <circle r="3.2" fill="#FF4665">
          <animateMotion dur="3.2s" repeatCount="indefinite">
            <mpath href={`#${pathTopId}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="3.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3" fill="#FE7AC6">
          <animateMotion dur="3.6s" begin="0.9s" repeatCount="indefinite">
            <mpath href={`#${pathBottomId}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="3.6s"
            begin="0.9s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="3.4" fill="#FF4665">
          <animateMotion dur="2.4s" begin="0.5s" repeatCount="indefinite">
            <mpath href={`#${pathOutId}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="2.4s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Small node anchors */}
        <circle
          cx="196"
          cy="126"
          r="3"
          fill="#FFF"
          stroke="#FF5E8E"
          strokeWidth="1.5"
        />
        <circle
          cx="240"
          cy="126"
          r="2.8"
          fill="#FFF"
          stroke="#FF5E8E"
          strokeWidth="1.3"
        />
      </svg>

      {/* Left Signal Node Chips */}
      <motion.div
        animate={{ y: [0, -2.5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        title="Track Record"
        className="absolute left-[22%] top-[39%] h-7 w-7 rounded-[8px] bg-white/95 border border-[#ff4665]/15 shadow-[0_6px_18px_rgba(255,70,101,0.12)] flex items-center justify-center"
      >
        <TrendingUp className="h-3.5 w-3.5 text-[#ff5a8b]" />
      </motion.div>

      <div
        title="Network & Reputation"
        className="absolute left-[5.5%] top-[51%] h-7 w-7 rounded-[8px] bg-white/95 border border-[#ff4665]/15 shadow-[0_4px_12px_rgba(255,70,101,0.1)] flex items-center justify-center"
      >
        <Users className="h-3.5 w-3.5 text-[#fe7ac6]" />
      </div>

      <div
        title="Milestone Pipeline"
        className="absolute left-[5.5%] bottom-[11.5%] h-7 w-7 rounded-[8px] bg-white/95 border border-[#ff4665]/15 shadow-[0_4px_12px_rgba(255,70,101,0.1)] flex items-center justify-center"
      >
        <Target className="h-3.5 w-3.5 text-[#ff4665]" />
      </div>

      {/* Central Elevated Glass Preflop Hub */}
      <motion.div
        animate={{
          boxShadow: [
            "0 12px 28px -8px rgba(255,70,101,0.22)",
            "0 16px 34px -6px rgba(255,70,101,0.34)",
            "0 12px 28px -8px rgba(255,70,101,0.22)",
          ],
        }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[54px] w-[54px] rounded-[14px] bg-gradient-to-br from-white via-white to-[#ffe6f0] border border-white flex items-center justify-center"
      >
        <PreflopEmblem gradient className="h-[26px] w-[26px]" />
      </motion.div>

      {/* Output Pill Badge: Live Market Price */}
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{
          duration: 3.4,
          delay: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[9%] top-1/2 -translate-y-1/2 h-[28px] px-3 rounded-full bg-gradient-to-r from-[#fff5f9] to-[#ffedf4] border border-[#ff4665]/15 shadow-[0_6px_16px_rgba(255,70,101,0.1)] flex items-center gap-1.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff4665]" />
        <span className="text-[11.5px] font-medium text-[#ff4665] tracking-[-0.01em] tabular-nums">
          74¢ Yes
        </span>
      </motion.div>
    </div>
  )
}

/**
 * Card 2 Visual: Trajectory & Milestone Catalyst Spline with floating Series C breakout pill
 * and top-right glass Preflop tile.
 */
function CatalystCurveVisual() {
  const areaGradId = React.useId()
  const strokeGradId = React.useId()

  return (
    <div className="relative h-[252px] w-full rounded-[20px] bg-[#F7F7F7] overflow-hidden select-none">
      {/* Top-Right Elevated Glass Preflop Tile */}
      <div className="absolute right-4 top-4 z-10 h-[38px] w-[38px] rounded-[10px] bg-gradient-to-br from-white via-white to-[#ffe8f1] border border-white shadow-[0_8px_20px_rgba(255,70,101,0.16)] flex items-center justify-center">
        <PreflopEmblem gradient className="h-[19px] w-[19px]" />
      </div>

      {/* Floating Catalyst Pill */}
      <motion.div
        animate={{ y: [0, -3.5, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[22%] top-[26%] z-10 h-[28px] px-3 rounded-full bg-[#f3e9ee]/92 backdrop-blur-sm border border-white/80 shadow-[0_4px_14px_rgba(0,0,0,0.04)] flex items-center gap-1.5"
      >
        <TrendingUp className="h-3 w-3 text-[#ff4665]" />
        <span className="text-[11px] font-medium text-[#3f3f46] tabular-nums">
          Series C · +14 pts
        </span>
      </motion.div>

      {/* Trajectory Probability Area Spline */}
      <svg
        viewBox="0 0 360 252"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient
            id={areaGradId}
            x1="180"
            y1="100"
            x2="180"
            y2="252"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF5992" stopOpacity="0.34" />
            <stop offset="70%" stopColor="#FE7AC6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id={strokeGradId}
            x1="0"
            y1="150"
            x2="360"
            y2="150"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FE7AC6" />
            <stop offset="50%" stopColor="#FF5288" />
            <stop offset="100%" stopColor="#FF4665" />
          </linearGradient>
        </defs>

        {/* Gradient Area */}
        <path
          d="M-5 162 C 25 168, 36 174, 52 172 C 66 170, 74 148, 86 144 C 102 138, 118 106, 134 106 C 148 106, 158 176, 178 174 C 194 172, 210 138, 224 134 C 236 130, 242 108, 250 108 C 260 108, 266 138, 278 136 C 292 134, 316 154, 330 150 C 344 146, 355 130, 366 124 L 366 256 L -5 256 Z"
          fill={`url(#${areaGradId})`}
        />

        {/* Animated Crisp Pink Spline Curve */}
        <motion.path
          d="M-5 162 C 25 168, 36 174, 52 172 C 66 170, 74 148, 86 144 C 102 138, 118 106, 134 106 C 148 106, 158 176, 178 174 C 194 172, 210 138, 224 134 C 236 130, 242 108, 250 108 C 260 108, 266 138, 278 136 C 292 134, 316 154, 330 150 C 344 146, 355 130, 366 124"
          stroke={`url(#${strokeGradId})`}
          strokeWidth="1.9"
          strokeLinecap="round"
          initial={{ pathLength: 0.2, opacity: 0.6 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Pulsing Breakout Marker */}
        <motion.circle
          cx="134"
          cy="106"
          r="9"
          fill="#FF4665"
          animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.28, 0, 0.28] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "134px 106px" }}
        />
        <circle
          cx="134"
          cy="106"
          r="4"
          fill="#FFFFFF"
          stroke="#FF4665"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

/**
 * Card 3 Visual: Soft lavender Protocol & Ethics Dock showing Preflop's modular
 * human-capital safeguards (Milestones, Trajectory Units, Covenants, Milestone Charter).
 */
function ProtocolDockVisual() {
  const [activeIdx, setActiveIdx] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % 4)
    }, 2400)
    return () => clearInterval(interval)
  }, [isPaused])

  const pillars = [
    { icon: BarChart3, label: "Milestone Markets" },
    { icon: Layers, label: "Trajectory Units · ≤25% Cap" },
    { icon: FileCheck2, label: "Issuer Consent" },
    { icon: ShieldCheck, label: "Milestone Charter" },
  ] as const

  const activePillar = pillars[activeIdx] ?? pillars[0]

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[252px] w-full rounded-[20px] bg-[#F4EFFC] overflow-hidden flex flex-col items-center justify-center px-5 select-none"
    >
      {/* Subtle Ambient Soft Glow */}
      <div className="pointer-events-none absolute -top-12 right-6 h-40 w-40 rounded-full bg-[#fe7ac6]/15 blur-3xl" />

      <div className="relative w-full max-w-[295px] flex flex-col items-start">
        {/* Floating White Preflop Pill */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-3.5 px-4 py-1.5 rounded-[10px] bg-white shadow-[0_6px_18px_rgba(125,43,196,0.08)] text-[12px] font-medium text-black tracking-[-0.01em] flex items-center gap-2"
        >
          <span>Preflop</span>
          <span className="text-black/25">·</span>
          <span className="text-[#ff4665]">{activePillar.label}</span>
        </motion.div>

        {/* Frosted Protocol Dock */}
        <div className="w-full rounded-[16px] bg-white/75 backdrop-blur-md border border-white p-2.5 shadow-[0_10px_28px_rgba(125,43,196,0.06)] flex items-center justify-between gap-2">
          {/* Core Preflop Emblem Tile */}
          <div className="h-[38px] w-[38px] rounded-[10px] bg-gradient-to-br from-[#fff3f8] to-[#ffe1ee] border border-[#ff4665]/15 flex items-center justify-center shrink-0">
            <PreflopEmblem gradient className="h-[19px] w-[19px]" />
          </div>

          <Plus className="h-3.5 w-3.5 text-black/60 shrink-0" />

          {/* 4 Modular Protocol Tiles */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              const isHighlighted = activeIdx === index
              return (
                <motion.button
                  key={pillar.label}
                  type="button"
                  onMouseEnter={() => setActiveIdx(index)}
                  onFocus={() => setActiveIdx(index)}
                  onClick={() => setActiveIdx(index)}
                  animate={{
                    scale: isHighlighted ? 1.07 : 1,
                    backgroundColor: isHighlighted
                      ? "rgba(255, 224, 237, 0.95)"
                      : "rgba(252, 232, 241, 0.72)",
                  }}
                  transition={{ duration: 0.3 }}
                  title={pillar.label}
                  aria-label={pillar.label}
                  className="h-[38px] w-[38px] rounded-[10px] border border-[#ff4665]/10 flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4665]/40"
                >
                  <Icon
                    className={`h-[17px] w-[17px] transition-colors duration-300 ${
                      isHighlighted ? "text-[#ff4665]" : "text-[#e56d96]"
                    }`}
                    strokeWidth={1.7}
                  />
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Quiet Invariant Caption */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-black/45 pl-1">
          <BookOpen className="h-3 w-3 text-[#7d2bc4]/65" />
          <span>Issuer retains ≥75% · Never health, family, or legal</span>
        </div>
      </div>
    </div>
  )
}

export function WhyPreflopSection({
  onOpenEarlyAccess,
}: WhyPreflopSectionProps) {
  return (
    <section id="why-preflop" className="bg-white py-16 md:py-24">
      <div className="opus-container px-5 md:px-8 xl:px-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionEyebrow text="How Preflop Works" />
          <h2 className="mt-4 text-[32px] sm:text-[36px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
            Put Your Money Where Your Mouth Is.
          </h2>
          <p className="mt-4 max-w-[400px] text-[15px] md:text-[16px] leading-[1.32] text-[#808080]">
            Follow someone early, pick a verifiable milestone, and trade Yes or
            No before the rest of the world catches up.
          </p>
        </motion.div>

        {/* 3-Column Bento Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              visual: <ConvictionSignalVisual />,
              titlePrefix: "Follow People, ",
              titleAccent: "Price Milestones",
              copy: "From startup launches and funding rounds to 100M-view uploads and Billboard No. 1s. Take a Yes or No side with transparent payout multipliers.",
            },
            {
              visual: <CatalystCurveVisual />,
              titlePrefix: "Milestones Now. ",
              titleAccent: "Trajectories Next.",
              copy: "Milestone markets are the front door. Underneath, Preflop is building one continuous market for a person's long-term trajectory—via Covenants and Direct Listings.",
            },
            {
              visual: <ProtocolDockVisual />,
              titlePrefix: "People, ",
              titleAccent: "Not Commodities",
              copy: "Every listing rests on issuer consent, a hard 25% cap so builders always keep at least 75%, and a Milestone Charter banning health, family, or legal markets.",
            },
          ].map((card, i) => (
            <motion.article
              key={card.titleAccent}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col"
            >
              {card.visual}
              <h3 className="mt-5 text-[18px] font-medium leading-[1.22] tracking-[-0.02em] text-black">
                {card.titlePrefix}
                <span className="text-opus-gradient">{card.titleAccent}</span>
              </h3>
              <p className="mt-2.5 text-[14px] leading-[1.35] text-[#808080]">
                {card.copy}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Centered Bottom CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 flex flex-col items-center text-center"
        >
          <p className="text-[14px] md:text-[15px] leading-[1.35] text-[#808080]">
            Put your money where your mouth is.
            <br />
            Reserve early access or inspect live markets.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenEarlyAccess("back")}
              className="h-[34px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Get Started
            </button>
            <Link
              href="/markets"
              className="group h-[34px] w-[200px] rounded-full border border-[#CCCCCC] bg-white/80 backdrop-blur-sm hover:border-black/40 text-black text-[15px] font-medium flex items-center justify-center gap-2 transition-all"
            >
              <span>Open Live Markets</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
