"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SectionEyebrow } from "./brand-marks"

export function ManifestoSection() {
  return (
    <section id="manifesto" className="bg-white py-28 md:py-40">
      <div className="opus-container px-5 md:px-8 xl:px-0 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionEyebrow
            centered
            text="Preflop builds liquid, clearable markets for human trajectories and career milestones."
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20 max-w-[720px] text-[30px] sm:text-[36px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black"
        >
          The Most Mispriced Asset
          <br />
          in the Room Is{" "}
          <span className="text-opus-gradient">People.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-[530px] text-[15px] md:text-[16px] font-normal leading-[1.35] text-[#808080]"
        >
          If you believe in someone, there should be a way to monetize that
          conviction. Follow a trajectory, take a view on concrete milestones,
          and trade on a common rail built for human economic output.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12.5px] font-medium tracking-[-0.01em] text-black/45"
        >
          <span>Backed by Verdict Capital &amp; Afore Capital</span>
          <span aria-hidden="true" className="text-black/20">
            ·
          </span>
          <span className="tabular-nums">$1.5M Pre-Seed</span>
          <span aria-hidden="true" className="text-black/20">
            ·
          </span>
          <span className="tabular-nums">200+ Early Traders</span>
        </motion.div>
      </div>
    </section>
  )
}
