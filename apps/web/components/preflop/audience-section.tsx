"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Activity, Compass, UserCheck } from "lucide-react"
import { SectionEyebrow } from "./brand-marks"
import type { EarlyAccessRole } from "./data"

interface AudienceSectionProps {
  onOpenEarlyAccess: (defaultRole?: EarlyAccessRole) => void
  onOpenFounderLetter: (tab?: "preview" | "letter") => void
}

const AUDIENCES = [
  {
    title: "Backers & Traders",
    description:
      "Follow founders, athletes, and creators early. Take a Yes or No view on verifiable milestones before consensus catches up.",
    icon: Compass,
    role: "back" as const,
  },
  {
    title: "Founders & Talent",
    description:
      "Raise capital via a finite Covenant or Direct List perpetual Trajectory Units—with explicit consent, clear charter rules, and a hard 25% cap.",
    icon: UserCheck,
    role: "list" as const,
  },
  {
    title: "Market Makers",
    description:
      "Seed two-sided order book liquidity across milestone markets and Trajectory Units ahead of our real-money launch.",
    icon: Activity,
    role: "liquidity" as const,
  },
]

export function AudienceSection({
  onOpenEarlyAccess,
  onOpenFounderLetter,
}: AudienceSectionProps) {
  return (
    <section id="join-table" className="bg-white py-20 md:py-28">
      <div className="opus-container px-5 md:px-8 xl:px-0">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <SectionEyebrow centered text="Join the Table" />
          <h2 className="mt-4 text-[32px] sm:text-[36px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
            Built for Conviction
          </h2>
        </motion.div>

        {/* 3 Hover-Reveal Pink Silk Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {AUDIENCES.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.title}
                type="button"
                onClick={() => onOpenEarlyAccess(item.role)}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative min-h-[268px] rounded-[20px] bg-[#F8F8F8] px-7 py-10 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-[0_24px_50px_-20px_rgba(255,70,101,0.35)]"
              >
                {/* Hover Full-Bleed Pink Silk Wave Reveal */}
                <img
                  src="/media/silk-hover.avif"
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 scale-105 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
                />
                {/* Subtle crimson depth glaze on hover so white copy keeps crisp legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#d81b60]/22 via-[#c2185b]/28 to-[#9c1046]/42 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Foreground Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-[52px] w-[52px] rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <Icon
                      className="h-[22px] w-[22px] text-[#FF4665]"
                      strokeWidth={1.6}
                    />
                  </div>

                  <h3 className="mt-6 text-[24px] font-medium leading-[1.125] tracking-[-0.02em] text-black transition-colors duration-300 group-hover:text-white group-hover:drop-shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[275px] text-[14px] leading-[1.35] text-[#808080] transition-colors duration-300 group-hover:text-white group-hover:drop-shadow-[0_1px_3px_rgba(0,0,0,0.14)]">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Centered Bottom CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-16 flex flex-col items-center text-center"
        >
          <p className="text-[14px] md:text-[15px] leading-[1.35] text-[#808080]">
            Your conviction. Their next move.
            <br />
            Request early access or read the founder letter.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onOpenEarlyAccess("back")}
              className="h-[34px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={() => onOpenFounderLetter("letter")}
              className="group h-[34px] w-[200px] rounded-full border border-[#CCCCCC] bg-white hover:border-black/40 text-black text-[15px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Founder Letter</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
