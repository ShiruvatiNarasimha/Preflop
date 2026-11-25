"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { PreflopEmblem, PreflopWordmark } from "./brand-marks"
import type { EarlyAccessRole } from "./data"

interface FooterSectionProps {
  onOpenEarlyAccess: (defaultRole?: EarlyAccessRole) => void
  onOpenFounderLetter: (tab?: "preview" | "letter") => void
}

export function FooterSection({
  onOpenEarlyAccess,
  onOpenFounderLetter,
}: FooterSectionProps) {
  const [newsletterEmail, setNewsletterEmail] = React.useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) {
      toast.error("Please enter a valid email address.")
      return
    }
    toast.success("Subscribed — one email when Preflop opens.")
    setNewsletterEmail("")
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#F6F6F9] to-[#ECECF0]">
      {/* Pre-Footer CTA Band */}
      <section className="relative pt-14 md:pt-24 pb-8 md:pb-28">
        {/* Desktop Right-Bleeding 3D Pink Coral Cluster + Floating Frosted Glass Icon Cards */}
        <div className="pointer-events-none hidden md:block absolute right-[-50px] lg:right-[-40px] top-[-22px] w-[460px] lg:w-[540px] select-none">
          <img
            src="/media/prefooter-coral.avif"
            alt=""
            className="w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(255,70,101,0.18)]"
          />

          {/* Floating Glass Card #1: Trajectory Curve Tile */}
          <div className="animate-float-card-a absolute left-[10%] top-[10%] w-[24%] aspect-square rounded-[20px] bg-white/80 backdrop-blur-md border border-white shadow-[0_18px_38px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center p-3">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#fff5f9] via-white to-[#ffe4ef] border border-[#ff4665]/12 flex flex-col items-center justify-center gap-1.5 p-2">
              <svg viewBox="0 0 56 32" fill="none" className="w-[72%] h-auto">
                <path
                  d="M3 26 C 14 24, 18 14, 28 16 C 36 18, 42 7, 53 5"
                  stroke="#FF4665"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <circle cx="53" cy="5" r="3" fill="#FFFFFF" stroke="#FF4665" strokeWidth="2" />
              </svg>
              <span className="text-[11px] font-semibold tracking-[-0.02em] text-[#ff4665] tabular-nums">
                74¢ YES
              </span>
            </div>
          </div>

          {/* Floating Glass Card #2: Preflop Prism Cap Tile */}
          <div className="animate-float-card-b absolute left-[8%] bottom-[22%] w-[24%] aspect-square rounded-[20px] bg-white/80 backdrop-blur-md border border-white shadow-[0_18px_38px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center p-3">
            <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-[#fff5f9] via-white to-[#ffe4ef] border border-[#ff4665]/12 flex flex-col items-center justify-center gap-1.5 p-2">
              <PreflopEmblem gradient className="h-8 w-8" />
              <span className="text-[10px] font-semibold tracking-[-0.01em] text-black/75 tabular-nums">
                ≥75% KEPT
              </span>
            </div>
          </div>
        </div>

        <div className="opus-container px-5 md:px-8 xl:px-0 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[460px]"
          >
            <h2 className="text-[32px] sm:text-[36px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
              Be Early.
              <br />
              Trade on People.
            </h2>
            <p className="mt-3 text-[15px] leading-[1.35] text-[#808080] max-w-[330px]">
              Your conviction. Their next move. Backed by Verdict Capital and
              Afore Capital.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenEarlyAccess("back")}
                className="h-[36px] md:h-[34px] px-7 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Get Started
              </button>
              <Link
                href="/markets"
                className="h-[36px] md:h-[34px] px-6 rounded-full border border-black/15 bg-white text-black text-[14px] font-medium hover:border-black/40 transition-colors inline-flex items-center"
              >
                Open Live Desk
              </Link>
            </div>
          </motion.div>

          {/* Mobile Stacked Coral Cluster */}
          <div className="pointer-events-none md:hidden relative mt-8 ml-auto -mr-10 w-[290px] select-none">
            <img
              src="/media/prefooter-coral.avif"
              alt=""
              className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(255,70,101,0.18)]"
            />
            <div className="animate-float-card-a absolute left-[4%] top-[8%] w-[27%] aspect-square rounded-[16px] bg-white/85 backdrop-blur-md border border-white shadow-[0_14px_30px_rgba(0,0,0,0.09)] flex items-center justify-center p-1.5">
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#fff5f9] via-white to-[#ffe4ef] border border-[#ff4665]/12 flex flex-col items-center justify-center gap-1 p-1.5">
                <svg viewBox="0 0 56 32" fill="none" className="w-[75%] h-auto">
                  <path
                    d="M3 26 C 14 24, 18 14, 28 16 C 36 18, 42 7, 53 5"
                    stroke="#FF4665"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  <circle cx="53" cy="5" r="3" fill="#FFFFFF" stroke="#FF4665" strokeWidth="2" />
                </svg>
                <span className="text-[9px] font-semibold text-[#ff4665] tabular-nums">
                  74¢ YES
                </span>
              </div>
            </div>
            <div className="animate-float-card-b absolute left-[2%] bottom-[20%] w-[27%] aspect-square rounded-[16px] bg-white/85 backdrop-blur-md border border-white shadow-[0_14px_30px_rgba(0,0,0,0.09)] flex items-center justify-center p-1.5">
              <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-[#fff5f9] via-white to-[#ffe4ef] border border-[#ff4665]/12 flex flex-col items-center justify-center gap-1 p-1.5">
                <PreflopEmblem gradient className="h-6 w-6" />
                <span className="text-[8.5px] font-semibold text-black/75 tabular-nums">
                  ≥75% KEPT
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Institutional Footer */}
      <footer className="relative z-10 pt-10 md:pt-16 pb-12">
        <div className="opus-container px-5 md:px-8 xl:px-0">
          {/* 5-Column Top Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.85fr_1fr_1.35fr_0.95fr_1.15fr] gap-y-10 gap-x-6">
            {/* Brand Wordmark Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                aria-label="Preflop Home"
              >
                <PreflopWordmark className="h-[19px] text-black" />
              </a>
              <p className="mt-3 text-[12.5px] leading-[1.4] text-[#808080] max-w-[220px]">
                Human Capital Markets.
                <br />
                Backed by Verdict &amp; Afore.
              </p>
            </div>

            {/* MARKETS */}
            <div>
              <h3 className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.01em] text-black whitespace-nowrap">
                MARKETS
              </h3>
              <ul className="mt-4 space-y-3 text-[14px] text-black/85">
                <li>
                  <Link
                    href="/markets"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Live Markets (40)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/person/brendan-foody"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Order Book Terminal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Portfolio &amp; P&amp;L
                  </Link>
                </li>
              </ul>
            </div>

            {/* HOW IT WORKS */}
            <div>
              <h3 className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.01em] text-black whitespace-nowrap">
                HOW IT WORKS
              </h3>
              <ul className="mt-4 space-y-3 text-[14px] text-black/85">
                <li>
                  <Link
                    href="/person/brendan-foody?view=trajectory"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Trajectory Units
                  </Link>
                </li>
                <li>
                  <Link
                    href="/raise"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Raise (Covenant)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/raise"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Direct Listings
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h3 className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.01em] text-black whitespace-nowrap">
                COMPANY
              </h3>
              <ul className="mt-4 space-y-3 text-[14px] text-black/85">
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenFounderLetter("letter")}
                    className="hover:text-[#ff4665] transition-colors cursor-pointer"
                  >
                    Founder Letter
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo("manifesto")}
                    className="hover:text-[#ff4665] transition-colors cursor-pointer"
                  >
                    Thesis
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo("join-table")}
                    className="hover:text-[#ff4665] transition-colors cursor-pointer"
                  >
                    Join the Table
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo("contact")}
                    className="hover:text-[#ff4665] transition-colors cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* LEGAL & ETHICS */}
            <div>
              <h3 className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.01em] text-black whitespace-nowrap">
                LEGAL &amp; ETHICS
              </h3>
              <ul className="mt-4 space-y-3 text-[14px] text-black/85">
                <li>
                  <a
                    href="#legal"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Milestone Charter
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#legal"
                    className="hover:text-[#ff4665] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Row: Newsletter + Socials */}
          <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-start justify-between gap-10">
            {/* Newsletter */}
            <div className="w-full max-w-[430px]">
              <div className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.01em] text-black">
                SUBSCRIBE TO PREFLOP UPDATES
              </div>
              <form
                onSubmit={handleSubscribe}
                className="mt-3.5 flex flex-col sm:flex-row sm:items-center sm:rounded-full sm:bg-white sm:p-1 sm:pl-5 gap-2.5 sm:gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
              >
                <input
                  id="footer-newsletter-email"
                  name="newsletterEmail"
                  aria-label="Email address for Preflop launch updates"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="h-[44px] min-h-[44px] sm:h-[34px] sm:min-h-[34px] shrink-0 w-full sm:flex-1 rounded-full bg-white px-5 sm:px-0 text-[14px] text-black placeholder:text-[#808080] focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-[44px] sm:h-[34px] px-7 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Direct Channels */}
            <div>
              <div className="text-[13px] md:text-[14px] font-medium uppercase tracking-[0.01em] text-black">
                CONNECT
              </div>
              <div className="mt-3.5 flex items-center gap-3">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/raghav-mundara/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Raghav Mundara on LinkedIn"
                  className="h-[36px] w-[36px] rounded-full bg-white flex items-center justify-center text-black hover:text-[#ff4665] hover:shadow-sm transition-all"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
                  </svg>
                </a>

                {/* Preflop Live Site */}
                <a
                  href="https://preflop.co"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Preflop Official Website"
                  className="h-[36px] w-[36px] rounded-full bg-white flex items-center justify-center text-black hover:text-[#ff4665] hover:shadow-sm transition-all text-[11px] font-semibold tracking-tight"
                >
                  Pf
                </a>

                {/* Direct Founder Email */}
                <a
                  href="mailto:raghav@preflop.co?subject=Preflop"
                  aria-label="Email Preflop Founder"
                  className="h-[36px] w-[36px] rounded-full bg-white flex items-center justify-center text-black hover:text-[#ff4665] hover:shadow-sm transition-all"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Institutional Simulation Disclosure & Milestone Charter */}
          <p
            id="legal"
            className="mt-12 text-[13.5px] md:text-[14.5px] leading-[1.42] text-black/85"
          >
            All market prices, probabilities, volumes, order books, and
            covenant models presented on this page are illustrative simulations
            for preview purposes only. No real money is traded today, and
            nothing here constitutes investment advice, a solicitation, or an
            offer to buy or sell any financial instrument or derivative. Early
            access is limited to participants aged 18+. Under Preflop&apos;s
            Milestone Charter, every listed individual retains explicit consent
            and a hard ≤25% Total Economic Benefit ceiling; Preflop will never
            list health or injury, relationships or family, legal matters, or
            any topic an issuer has not specifically approved.
          </p>

          {/* Bottom Copyright Bar */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13.5px] text-[#808080]">
            <div>Copyright © 2026 Preflop. All rights reserved.</div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="self-start sm:self-auto hover:text-black transition-colors cursor-pointer"
            >
              Back to top
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
