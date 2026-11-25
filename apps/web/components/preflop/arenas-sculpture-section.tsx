"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SectionEyebrow } from "./brand-marks"

interface ArenaCallout {
  id: string
  label: string
  /** Pill center/anchor position in SVG viewBox (775 x 441) */
  pillX: number
  pillY: number
  /** Bend vertex along the crisp white leader line */
  bendX: number
  bendY: number
  /** White dot anchor coordinate on the 3D sculpture */
  dotX: number
  dotY: number
  detail: string
}

const ARENA_CALLOUTS: ArenaCallout[] = [
  {
    id: "founders",
    label: "Startup Founders",
    pillX: 162,
    pillY: 100,
    bendX: 215,
    bendY: 100,
    dotX: 245,
    dotY: 124,
    detail:
      "Brendan Foody (Mercor), Roy Lee (Cluely), Tanay Kothari (Wispr Flow)",
  },
  {
    id: "athletes",
    label: "Pro Athletes",
    pillX: 122,
    pillY: 192,
    bendX: 185,
    bendY: 192,
    dotX: 215,
    dotY: 170,
    detail:
      "Fernando Mendoza (Raiders) — regular-season starts, 300-yard games, awards",
  },
  {
    id: "creators",
    label: "Creators",
    pillX: 164,
    pillY: 300,
    bendX: 224,
    bendY: 300,
    dotX: 266,
    dotY: 325,
    detail:
      "MrBeast & Marques Brownlee — 100M-view uploads, retail launches, channels",
  },
  {
    id: "covenants",
    label: "Covenant Raises",
    pillX: 356,
    pillY: 392,
    bendX: 432,
    bendY: 392,
    dotX: 462,
    dotY: 368,
    detail:
      "Raise upfront capital against future potential—always keeping ≥75%",
  },
  {
    id: "music",
    label: "Music & Culture",
    pillX: 566,
    pillY: 100,
    bendX: 512,
    bendY: 100,
    dotX: 486,
    dotY: 132,
    detail:
      "Sabrina Carpenter & RAYE — Billboard & UK No. 1s, stadium tours, duets",
  },
  {
    id: "direct-listings",
    label: "Direct Listings",
    pillX: 608,
    pillY: 215,
    bendX: 515,
    bendY: 215,
    dotX: 482,
    dotY: 232,
    detail:
      "Perpetual Trajectory Units for proven 5+ year builders with full consent",
  },
  {
    id: "market-makers",
    label: "Market Makers",
    pillX: 582,
    pillY: 304,
    bendX: 498,
    bendY: 304,
    dotX: 466,
    dotY: 288,
    detail:
      "Two-sided liquidity partners seeding deep order books ahead of launch",
  },
]

export function ArenasSculptureSection() {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)
  const [pinnedId, setPinnedId] = React.useState<string | null>(null)

  const activeId = hoveredId ?? pinnedId
  const activeCallout = ARENA_CALLOUTS.find((c) => c.id === activeId)

  return (
    <section id="arenas" className="bg-white py-20 md:py-28">
      <div className="opus-container px-5 md:px-8 xl:px-0 flex flex-col items-center">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center flex flex-col items-center"
        >
          <SectionEyebrow centered text="Where Conviction Trades" />
          <h2
            aria-label="Human Capital Everywhere"
            className="mt-4 text-[32px] sm:text-[36px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black"
          >
            <span className="text-opus-gradient">Human Capital</span>{" "}
            <span>Everywhere</span>
          </h2>
          <p className="mt-3.5 max-w-[390px] text-[15px] md:text-[16px] leading-[1.28] text-[#808080]">
            One common rail pricing measurable trajectories across founders,
            athletes, creators, and institutional liquidity
          </p>
        </motion.div>

        {/* Centerpiece 3D Coral-Ivory Sculpture & Interactive Arena Map */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-11 w-full max-w-[780px] aspect-[775/441] rounded-[24px] overflow-hidden bg-[#E7E9ED] select-none"
        >
          {/* High-res clean 3D Coral-Ivory Sculpture */}
          <motion.img
            src="/media/brain-sculpture.png"
            alt="Preflop Human Capital Markets Sculpture"
            animate={{ scale: [1, 1.018, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Crisp White Angled Leader Lines & Anchor Dots */}
          <svg
            viewBox="0 0 775 441"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            {ARENA_CALLOUTS.map((item, idx) => {
              const isHighlighted = activeId === item.id
              return (
                <motion.g
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
                >
                  <polyline
                    points={`${item.pillX},${item.pillY} ${item.bendX},${item.bendY} ${item.dotX},${item.dotY}`}
                    stroke="white"
                    strokeWidth={isHighlighted ? "1.8" : "1.2"}
                    strokeOpacity={isHighlighted ? "1" : "0.88"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-200"
                  />
                  {isHighlighted && (
                    <circle
                      cx={item.dotX}
                      cy={item.dotY}
                      r="8"
                      fill="#FF4665"
                      fillOpacity="0.35"
                    />
                  )}
                  <circle
                    cx={item.dotX}
                    cy={item.dotY}
                    r={isHighlighted ? "3.8" : "2.7"}
                    fill="#FFFFFF"
                    className="transition-all duration-200"
                  />
                </motion.g>
              )
            })}
          </svg>

          {/* 7 Floating Translucent Pink Callout Pills */}
          {ARENA_CALLOUTS.map((item, idx) => {
            const leftPct = (item.pillX / 775) * 100
            const topPct = (item.pillY / 441) * 100
            const isHighlighted = activeId === item.id

            return (
              <motion.button
                key={item.id}
                type="button"
                aria-pressed={pinnedId === item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: 0.15 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(item.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() =>
                  setPinnedId((prev) => (prev === item.id ? null : item.id))
                }
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[9.5px] sm:text-[12.5px] font-medium text-white backdrop-blur-md border transition-all duration-200 cursor-pointer ${
                  isHighlighted
                    ? "bg-[#ff4665]/92 border-white/60 scale-105 shadow-[0_6px_20px_rgba(255,70,101,0.35)] z-20"
                    : "bg-[#f387a7]/72 border-white/30 hover:bg-[#ff4665]/85 z-10"
                }`}
              >
                {item.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Reserved Interactive Readout Strip (zero overlap, zero layout shift) */}
        <div className="mt-4 min-h-7 flex items-center justify-center">
          <div
            className={`px-4 py-1 rounded-full bg-[#18181b] text-white text-[12px] text-center transition-all duration-200 ${
              activeCallout
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
          >
            {activeCallout
              ? `${activeCallout.label} — ${activeCallout.detail}`
              : "Hover or tap an arena"}
          </div>
        </div>

        {/* Bottom Scale Caption */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-[650px] text-center text-[15px] md:text-[16px] font-normal leading-[1.35] text-black"
        >
          Forty simulated milestone markets live today across startup founders,
          creators, athletes, and recording artists—leading into real-money
          trading with institutional market makers.
        </motion.p>
      </div>
    </section>
  )
}
