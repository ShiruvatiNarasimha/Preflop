"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { PreflopWordmark } from "./brand-marks"
import type { EarlyAccessRole } from "./data"
import { usePreflop } from "./store"

type MegaMenuKey = "markets" | "how" | "company" | null

interface NavbarProps {
  onOpenGetStarted: (defaultRole?: EarlyAccessRole) => void
  onOpenFounderLetter: (tab?: "preview" | "letter") => void
}

export function PreflopNavbar({
  onOpenGetStarted,
  onOpenFounderLetter,
}: NavbarProps) {
  const { user } = usePreflop()
  const [activeMenu, setActiveMenu] = React.useState<MegaMenuKey>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [scrollY, setScrollY] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(true)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const lastScrollY = React.useRef(0)
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      setScrollY(current)

      if (current < 80) {
        setIsVisible(true)
      } else if (
        current > lastScrollY.current + 6 &&
        !activeMenu &&
        !mobileOpen
      ) {
        setIsVisible(false)
      } else if (current < lastScrollY.current - 4) {
        setIsVisible(true)
      }
      lastScrollY.current = current
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeMenu, mobileOpen])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null)
        setIsHovered(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (closeTimeout.current) clearTimeout(closeTimeout.current)
    }
  }, [])

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const openMenu = (key: MegaMenuKey) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    setActiveMenu(key)
    setIsHovered(true)
  }

  const scheduleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    closeTimeout.current = setTimeout(() => {
      setActiveMenu(null)
      setIsHovered(false)
    }, 120)
  }

  const isScrolled = scrollY > 48
  const isSolid = isScrolled || isHovered || activeMenu !== null

  const scrollToSection = (id: string) => {
    setActiveMenu(null)
    setIsHovered(false)
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <header
        onMouseEnter={() => {
          if (closeTimeout.current) clearTimeout(closeTimeout.current)
          setIsHovered(true)
        }}
        onMouseLeave={scheduleClose}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[transform,background-color,color,border-color] duration-300 ease-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
          isSolid
            ? "bg-white text-black border-b border-black/[0.07]"
            : "bg-transparent text-white border-b border-transparent",
          activeMenu && "shadow-[0_18px_40px_-20px_rgba(0,0,0,0.12)]"
        )}
      >
        <div className="opus-container px-5 md:px-8 xl:px-0 h-[58px] md:h-[62px] flex items-center justify-between">
          {/* Left Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
              setActiveMenu(null)
            }}
            className="flex items-center focus:outline-none"
            aria-label="Preflop Home"
          >
            <PreflopWordmark
              className={cn(
                "h-[18px] md:h-[20px] transition-colors duration-300",
                isSolid ? "text-black" : "text-white"
              )}
            />
          </a>

          {/* Center Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="Primary Navigation"
          >
            {(
              [
                { key: "markets", label: "Markets" },
                { key: "how", label: "How It Works" },
                { key: "company", label: "Company" },
              ] as const
            ).map((item) => {
              const isActive = activeMenu === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-expanded={isActive}
                  onMouseEnter={() => openMenu(item.key)}
                  onFocus={() => openMenu(item.key)}
                  onClick={() => setActiveMenu(isActive ? null : item.key)}
                  className={cn(
                    "relative py-1.5 text-[14px] font-normal leading-[1.25] transition-colors duration-200 cursor-pointer",
                    isSolid
                      ? "text-black hover:text-black/75"
                      : "text-white hover:text-white/80"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-black transition-all duration-200 origin-left",
                      isActive
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0"
                    )}
                  />
                </button>
              )
            })}

            <button
              type="button"
              onMouseEnter={() => setActiveMenu(null)}
              onClick={() => scrollToSection("contact")}
              className={cn(
                "relative py-1.5 text-[14px] font-normal leading-[1.25] transition-colors duration-200 cursor-pointer",
                isSolid
                  ? "text-black hover:text-black/75"
                  : "text-white hover:text-white/80"
              )}
            >
              Contact
            </button>
          </nav>

          {/* Right CTA & Mobile Trigger */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/markets"
              className={cn(
                "hidden sm:inline-flex items-center text-[13.5px] font-medium transition-colors duration-200 px-2 py-1",
                isSolid
                  ? "text-black/75 hover:text-black"
                  : "text-white/90 hover:text-white"
              )}
            >
              {user.onboarded ? "Open Desk" : "Live Desk"}
            </Link>

            {user.onboarded ? (
              <Link
                href="/markets"
                className={cn(
                  "h-[28px] md:h-[30px] px-5 md:px-6 rounded-full text-[13px] md:text-[14px] font-medium leading-none transition-all duration-300 flex items-center justify-center",
                  isSolid
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-[#e8e8e8]"
                )}
              >
                Markets
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setActiveMenu(null)
                  onOpenGetStarted("back")
                }}
                className={cn(
                  "h-[28px] md:h-[30px] px-5 md:px-6 rounded-full text-[13px] md:text-[14px] font-medium leading-none transition-all duration-300 cursor-pointer flex items-center justify-center",
                  isSolid
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-[#e8e8e8]"
                )}
              >
                Get Started
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                "md:hidden p-1.5 rounded-md transition-colors cursor-pointer",
                isSolid
                  ? "text-black"
                  : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 stroke-[1.75]" />
            </button>
          </div>
        </div>

        {/* Full-Width Mega-Menu Drawer (in-flow child of fixed header so the opaque white surface never splits from header over hero video) */}
        {activeMenu && (
          <div className="hidden md:block w-full bg-white border-t border-black/[0.06]">
            <div className="opus-container px-5 md:px-8 xl:px-0 py-6">
              {activeMenu === "markets" && (
                <div className="flex items-stretch gap-5">
                  <Link
                    href="/markets"
                    onClick={() => setActiveMenu(null)}
                    className="group relative w-[345px] h-[232px] rounded-[16px] overflow-hidden text-left"
                  >
                    <img
                      src="/media/mega-overview.avif"
                      alt="Live Milestone Markets"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/32 via-black/10 to-black/15" />
                    <div className="relative z-10 p-6">
                      <span className="block text-[26px] font-normal tracking-[-0.02em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                        Live Markets (40)
                      </span>
                      <p className="mt-2 text-[13.5px] text-white/90 max-w-[240px] leading-[1.35]">
                        Trade Yes or No contracts and Trajectory Units with
                        $100,000 simulated buying power.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/portfolio"
                    onClick={() => setActiveMenu(null)}
                    className="group relative w-[345px] h-[232px] rounded-[16px] overflow-hidden text-left"
                  >
                    <img
                      src="/media/mega-partners.avif"
                      alt="Portfolio & Order Flow"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/36 via-black/12 to-black/15" />
                    <div className="relative z-10 p-6">
                      <span className="block text-[26px] font-normal tracking-[-0.02em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.22)]">
                        Portfolio &amp; P&amp;L
                      </span>
                      <p className="mt-2 text-[13.5px] text-white/90 max-w-[240px] leading-[1.35]">
                        Manage open milestone contracts, Trajectory Units,
                        watchlist, and settled fills.
                      </p>
                    </div>
                  </Link>
                </div>
              )}

              {activeMenu === "how" && (
                <div className="flex items-start gap-9">
                  <Link
                    href="/raise"
                    onClick={() => setActiveMenu(null)}
                    className="group relative w-[490px] h-[232px] rounded-[16px] overflow-hidden text-left shrink-0"
                  >
                    <img
                      src="/media/mega-superintelligence.avif"
                      alt="Raise or Direct List on Preflop"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/12 to-transparent" />
                    <div className="relative z-10 p-6 max-w-[380px]">
                      <div className="text-[26px] font-normal tracking-[-0.02em] text-white leading-[1.15]">
                        Raise or Direct List
                      </div>
                      <p className="mt-2.5 text-[14px] text-white/95 leading-[1.35]">
                        Model a Covenant raise or check 7-gate Direct Listing
                        eligibility—with a hard 25% cap.
                      </p>
                    </div>
                  </Link>

                  <div className="pt-2 flex flex-col items-start gap-3">
                    <Link
                      href="/markets"
                      onClick={() => setActiveMenu(null)}
                      className="text-[23px] font-normal tracking-[-0.02em] text-black hover:text-[#ff4665] transition-colors leading-[1.25]"
                    >
                      Explore 40 Live Markets
                    </Link>
                    <Link
                      href="/person/brendan-foody"
                      onClick={() => setActiveMenu(null)}
                      className="text-[23px] font-normal tracking-[-0.02em] text-black hover:text-[#ff4665] transition-colors leading-[1.25]"
                    >
                      Order Book Terminal
                    </Link>
                    <Link
                      href="/raise"
                      onClick={() => setActiveMenu(null)}
                      className="text-[23px] font-normal tracking-[-0.02em] text-black hover:text-[#ff4665] transition-colors leading-[1.25]"
                    >
                      Covenant &amp; Direct List Studio
                    </Link>
                    <button
                      type="button"
                      onClick={() => scrollToSection("legal")}
                      className="text-[23px] font-normal tracking-[-0.02em] text-black hover:text-[#ff4665] transition-colors cursor-pointer leading-[1.25]"
                    >
                      Milestone Charter
                    </button>
                  </div>
                </div>
              )}

              {activeMenu === "company" && (
                <div className="flex items-start gap-9">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu(null)
                      setIsHovered(false)
                      onOpenFounderLetter("letter")
                    }}
                    className="group relative w-[490px] h-[232px] rounded-[16px] overflow-hidden text-left cursor-pointer shrink-0"
                  >
                    <img
                      src="/media/mega-company.avif"
                      alt="Preflop Founder Letter"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/12 to-transparent" />
                    <div className="relative z-10 p-6 max-w-[390px]">
                      <div className="text-[26px] font-normal tracking-[-0.02em] text-white leading-[1.15]">
                        Founder Letter · $1.5M
                      </div>
                      <p className="mt-2.5 text-[14px] text-white/95 leading-[1.35]">
                        Why Raghav Mundara is building a liquid market for human
                        capital, backed by Verdict &amp; Afore.
                      </p>
                    </div>
                  </button>

                  <div className="pt-2 flex flex-col items-start gap-3">
                    {[
                      {
                        label: "Read Founder Letter",
                        action: () => {
                          setActiveMenu(null)
                          setIsHovered(false)
                          onOpenFounderLetter("letter")
                        },
                      },
                      {
                        label: "Thesis",
                        action: () => scrollToSection("manifesto"),
                      },
                      {
                        label: "Join the Table",
                        action: () => scrollToSection("join-table"),
                      },
                      {
                        label: "Contact",
                        action: () => scrollToSection("contact"),
                      },
                    ].map((link) => (
                      <button
                        key={link.label}
                        type="button"
                        onClick={link.action}
                        className="text-[23px] font-normal tracking-[-0.02em] text-black hover:text-[#ff4665] transition-colors cursor-pointer leading-[1.25]"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Full-Screen Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col px-5 pt-4 pb-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between h-[42px]">
              <PreflopWordmark className="h-[19px] text-black" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-black cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-7 w-7 stroke-[1.5]" />
              </button>
            </div>

            <div className="mt-8 flex-1">
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
              >
                <AccordionItem value="markets" className="border-none">
                  <AccordionTrigger className="py-3 text-[18px] font-normal text-black hover:no-underline justify-start gap-2.5 [&>[data-slot=accordion-trigger-icon]]:hidden">
                    <span>Markets</span>
                    <ChevronDown className="h-4 w-4 text-black/80 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 pl-1 space-y-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection("platforms")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        Milestone Markets
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        Yes / No binary markets on real career outcomes
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("arenas")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        Where Conviction Trades
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        Founders, creators, athletes, and market makers
                      </div>
                    </button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how" className="border-none">
                  <AccordionTrigger className="py-3 text-[18px] font-normal text-black hover:no-underline justify-start gap-2.5 [&>[data-slot=accordion-trigger-icon]]:hidden">
                    <span>How It Works</span>
                    <ChevronDown className="h-4 w-4 text-black/80 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 pl-1 space-y-3">
                    <button
                      type="button"
                      onClick={() => scrollToSection("why-preflop")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        How Conviction Clears
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        Milestone markets and long-term trajectories
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("platforms")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        Order Book &amp; Issuance
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        Live depth, resolution rules, and Covenants
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("legal")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        Milestone Charter
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        Consent-first guardrails and hard 25% cap
                      </div>
                    </button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="company" className="border-none">
                  <AccordionTrigger className="py-3 text-[18px] font-normal text-black hover:no-underline justify-start gap-2.5 [&>[data-slot=accordion-trigger-icon]]:hidden">
                    <span>Company</span>
                    <ChevronDown className="h-4 w-4 text-black/80 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 pl-1 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false)
                        onOpenFounderLetter("letter")
                      }}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        Founder Letter
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        $1.5M pre-seed · The Most Mispriced Asset in the Room
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("manifesto")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">Thesis</div>
                      <div className="text-[13px] text-[#808080]">
                        Building the market for human capital
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollToSection("join-table")}
                      className="block text-left w-full"
                    >
                      <div className="text-[16px] text-black">
                        Join the Table
                      </div>
                      <div className="text-[13px] text-[#808080]">
                        Backers, issuers, and market makers
                      </div>
                    </button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="mt-2 py-3 text-[18px] font-normal text-black block text-left w-full cursor-pointer"
              >
                Contact
              </button>

              <div className="mt-8 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    onOpenGetStarted("back")
                  }}
                  className="w-full h-[46px] rounded-full bg-black text-white text-[16px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Get Started ($100K Desk)
                </button>
                <Link
                  href="/markets"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-[44px] rounded-full border border-black/15 text-black text-[15px] font-medium flex items-center justify-center"
                >
                  Open Live Markets
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
