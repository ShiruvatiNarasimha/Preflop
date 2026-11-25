"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { GradientPlayIcon, PreflopEmblem } from "./brand-marks"

interface HeroSectionProps {
  onOpenPreview: (tab?: "preview" | "letter") => void
}

export function HeroSection({ onOpenPreview }: HeroSectionProps) {
  const [viewport, setViewport] = React.useState<"desktop" | "mobile" | null>(
    null
  )

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setViewport(mq.matches ? "mobile" : "desktop")
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return (
    <section
      id="top"
      className="relative h-screen min-h-[660px] max-h-[1080px] w-full overflow-hidden bg-[#f5dbe8]"
    >
      {/* Responsive Full-Bleed Particle Video (waits for matchMedia so mobile never pulls 13.6MB desktop video) */}
      {viewport && (
        <video
          key={viewport}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover scale-[1.01]"
        >
          <source
            src={
              viewport === "mobile"
                ? "/media/hero-mobile.mp4"
                : "/media/hero-desktop.mp4"
            }
            type="video/mp4"
          />
        </video>
      )}

      {/* Top & bottom legibility scrims so white navbar and headline stay crisp across bright video frames */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/34 via-transparent to-black/42" />

      {/* Bottom Anchored Content */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        <div className="opus-container px-5 md:px-8 xl:px-0 pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-7 md:gap-8">
            {/* Bottom-Left Announcement Pill, Headline & Subcopy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[620px]"
            >
              <button
                type="button"
                onClick={() => onOpenPreview("letter")}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/[0.12] backdrop-blur-md px-3.5 py-1.5 text-[12px] md:text-[13px] font-medium text-white/95 hover:bg-white/[0.22] transition-colors cursor-pointer"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff4665] shadow-[0_0_8px_#ff4665]" />
                <span>We raised $1.5M · Read the founder letter</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/85" />
              </button>

              <h1
                aria-label="Trade on People"
                className="text-[40px] sm:text-[44px] md:text-[48px] font-medium leading-[1.083] tracking-[-0.03em] text-white"
              >
                Trade on People
              </h1>
              <p className="mt-3 text-[15px] md:text-[16px] font-normal leading-[1.35] text-white/95">
                Prediction markets on people&apos;s milestones. Follow a person,
                choose a milestone, and take a view.
              </p>
            </motion.div>

            {/* Bottom-Right Glassmorphic Preview & Founder Letter Pill */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="self-start md:self-end"
            >
              <button
                type="button"
                onClick={() => onOpenPreview("preview")}
                className="group h-[54px] md:h-[56px] pl-5 pr-2 rounded-full border border-white/50 bg-white/[0.12] backdrop-blur-md hover:bg-white/[0.22] hover:border-white/75 transition-all duration-300 flex items-center gap-3.5 text-white cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              >
                <PreflopEmblem className="h-[19px] w-[19px] text-white shrink-0" />
                <span className="text-[18px] md:text-[20px] font-medium leading-[1.25] tracking-[-0.015em] pr-1">
                  Preflop Preview
                </span>
                <span className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <GradientPlayIcon />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
