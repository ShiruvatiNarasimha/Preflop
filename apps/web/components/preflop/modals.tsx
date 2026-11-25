"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  Check,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { PreflopWordmark } from "./brand-marks"
import {
  FOUNDER_LETTER_PARAGRAPHS,
  formatPayoutMultiplier,
  type EarlyAccessRole,
  type MarketPick,
} from "./data"

interface EarlyAccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultRole: EarlyAccessRole
  selectedPick: MarketPick | null
}

const ROLE_OPTIONS: {
  id: EarlyAccessRole
  title: string
  subtitle: string
}[] = [
  {
    id: "back",
    title: "Back people",
    subtitle:
      "Trade Yes/No milestone contracts and Trajectory Units on founders, creators, and athletes",
  },
  {
    id: "list",
    title: "List myself",
    subtitle:
      "Model a Covenant raise or Direct Listing with explicit consent and a hard 25% cap",
  },
  {
    id: "liquidity",
    title: "Provide liquidity",
    subtitle:
      "Partner as a market maker to seed two-sided order book depth ahead of real-money launch",
  },
]

export function EarlyAccessModal({
  open,
  onOpenChange,
  defaultRole,
  selectedPick,
}: EarlyAccessModalProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<EarlyAccessRole>(defaultRole)
  const [submitted, setSubmitted] = React.useState(false)

  React.useEffect(() => {
    setRole(defaultRole)
  }, [defaultRole, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email address.")
      return
    }
    setSubmitted(true)
    toast.success("You're on the Preflop early access list.")
  }

  const activeRoleLabel =
    ROLE_OPTIONS.find((r) => r.id === role)?.title ?? "Back people"

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) {
          setTimeout(() => setSubmitted(false), 200)
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[540px] rounded-[24px] bg-white border-none p-7 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.22)] max-h-[92vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close modal"
          className="absolute right-6 top-6 text-black/80 hover:text-black transition-colors cursor-pointer"
        >
          <X className="h-6 w-6 stroke-[1.5]" />
        </button>

        <DialogTitle className="mt-4 text-center text-[26px] sm:text-[31px] font-normal leading-[1.12] tracking-[-0.03em] text-black">
          Be at the Table When Preflop Opens
        </DialogTitle>
        <DialogDescription className="sr-only">
          Reserve early access to Preflop human capital markets to back people,
          list yourself, or provide liquidity.
        </DialogDescription>

        {/* Optional Selected Market Pick Summary */}
        {selectedPick && !submitted && (
          <div className="mt-4 rounded-[12px] bg-[#fff5f8] border border-[#ff4665]/20 px-4 py-2.5 text-center text-[13px] text-black tabular-nums">
            <span className="text-[#808080]">Your pick: </span>
            <span className="font-medium text-[#ff4665]">
              {selectedPick.side}
            </span>{" "}
            on{" "}
            <span className="font-medium">{selectedPick.milestoneTitle}</span> (
            {selectedPick.personName}) at{" "}
            <span className="font-medium">
              {selectedPick.priceCents}¢ ·{" "}
              {formatPayoutMultiplier(selectedPick.priceCents)}
            </span>
          </div>
        )}

        {submitted ? (
          <div className="py-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#fff0f5] flex items-center justify-center text-[#ff4665]">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-[22px] font-medium text-black">
              Seat Reserved
            </h3>
            <p className="mt-2 text-[14px] text-[#808080] leading-[1.45]">
              We&apos;ve registered{" "}
              <span className="text-black font-medium">{email}</span> under{" "}
              <span className="text-black font-medium">{activeRoleLabel}</span>.
              One email when real-money access opens.
            </p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-7 h-[38px] w-full rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Return to Preflop
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="early-access-name"
                  className="block text-[13.5px] text-black mb-1.5"
                >
                  Name
                </label>
                <input
                  id="early-access-name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  required
                  placeholder="Your name*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/12 px-5 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="early-access-email"
                  className="block text-[13.5px] text-black mb-1.5"
                >
                  Email
                </label>
                <input
                  id="early-access-email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="you@domain.com*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/12 px-5 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-1">
              <div
                id="early-access-role-label"
                className="block text-[13.5px] text-black mb-2.5"
              >
                I want to...
              </div>

              <div
                role="radiogroup"
                aria-labelledby="early-access-role-label"
                className="space-y-2.5"
              >
                {ROLE_OPTIONS.map((option) => {
                  const isSelected = role === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setRole(option.id)}
                      className={`w-full rounded-[14px] px-4 py-3.5 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#FF4665] bg-[#fffbfc]"
                          : "border-[#EAEAEA] bg-white hover:border-black/25"
                      }`}
                    >
                      <div
                        className={`text-[14.5px] font-medium leading-[1.3] ${
                          isSelected ? "text-[#FF4665]" : "text-black"
                        }`}
                      >
                        {option.title}
                      </div>
                      <div className="mt-1 text-[12.5px] text-[#808080] leading-[1.35]">
                        {option.subtitle}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="text-[12.5px] text-[#808080] pt-1">
              One email when we open. Must be 18+. By joining, you agree to
              Preflop&apos;s{" "}
              <a
                href="#legal"
                onClick={() => onOpenChange(false)}
                className="text-black underline underline-offset-2 hover:text-[#ff4665] transition-colors"
              >
                terms and Milestone Charter.
              </a>
            </p>

            <button
              type="submit"
              className="h-[38px] w-full rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Get Early Access
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface FounderPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab: "preview" | "letter"
  onOpenEarlyAccess: (role?: EarlyAccessRole) => void
}

export function FounderPreviewModal({
  open,
  onOpenChange,
  initialTab,
  onOpenEarlyAccess,
}: FounderPreviewModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [tab, setTab] = React.useState<"preview" | "letter">(initialTab)
  const [playing, setPlaying] = React.useState(true)
  const [muted, setMuted] = React.useState(true)

  React.useEffect(() => {
    if (open) {
      setTab(initialTab)
      setPlaying(true)
    }
  }, [open, initialTab])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[960px] p-0 bg-[#08080a] border border-white/15 rounded-[20px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
      >
        <DialogTitle className="sr-only">
          Preflop Preview and Founder Letter
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preview Preflop human capital markets and read Raghav Mundara&apos;s
          November 2026 founder letter.
        </DialogDescription>

        {/* Top Chrome Bar */}
        <div className="relative z-20 px-5 py-4 flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <PreflopWordmark className="h-[16px] text-white" />
            <div className="flex items-center rounded-full bg-white/10 p-0.5 text-[12px]">
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  tab === "preview"
                    ? "bg-white text-black font-medium"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setTab("letter")}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  tab === "letter"
                    ? "bg-white text-black font-medium"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Founder Letter
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close modal"
            className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {tab === "preview" ? (
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/media/hero-desktop.mp4" type="video/mp4" />
            </video>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />

            {/* Center Cinema Caption */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[12px] uppercase tracking-[0.22em] text-white/85">
                Human Capital Markets
              </span>
              <h3 className="mt-2.5 text-[30px] sm:text-[42px] font-medium tracking-[-0.03em] text-white drop-shadow-md">
                Trade on People
              </h3>
              <p className="mt-2 max-w-[440px] text-[14px] sm:text-[15px] text-white/85">
                Milestone markets on top. Standardized perpetual Trajectory
                Units underneath.
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 translate-x-0.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setTab("letter")}
                className="text-[12.5px] font-medium text-white/90 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Read the $1.5M Founder Letter →
              </button>
            </div>
          </div>
        ) : (
          <div className="max-h-[76vh] overflow-y-auto px-6 sm:px-12 py-8 sm:py-10 text-white">
            <div className="max-w-[640px] mx-auto">
              <div className="inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.14em] text-[#fe7ac6]">
                <span>Founder Letter</span>
                <span className="text-white/30">·</span>
                <span>November 2026</span>
                <span className="text-white/30">·</span>
                <span>$1.5M Pre-Seed</span>
              </div>

              <h3 className="mt-3 text-[28px] sm:text-[34px] font-medium leading-[1.12] tracking-[-0.03em] text-white">
                The Most Mispriced Asset in the Room
              </h3>
              <p className="mt-2 text-[13.5px] text-white/55">
                By Raghav Mundara, Founder &amp; CEO of Preflop · Backed by
                Verdict Capital &amp; Afore Capital
              </p>

              <div className="mt-7 space-y-4 text-[15px] leading-[1.68] text-white/85">
                {FOUNDER_LETTER_PARAGRAPHS.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false)
                    onOpenEarlyAccess("back")
                  }}
                  className="h-[38px] px-6 rounded-full bg-white text-black text-[13.5px] font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Get Early Access
                </button>
                <a
                  href="https://preflop.co/blog/the-most-mispriced-asset-in-the-room/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-white/70 hover:text-white transition-colors"
                >
                  <span>Full letter on preflop.co</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function CookieBanner() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    try {
      const choice = localStorage.getItem("preflop_cookie_consent")
      if (choice) return
      let shown = false
      const show = () => {
        if (shown) return
        shown = true
        setVisible(true)
      }
      const onScroll = () => {
        if (window.scrollY > 140) show()
      }
      const timer = setTimeout(show, 3800)
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => {
        clearTimeout(timer)
        window.removeEventListener("scroll", onScroll)
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const handleChoice = (choice: "accepted" | "rejected") => {
    try {
      localStorage.setItem("preflop_cookie_consent", choice)
    } catch {
      // Ignore storage errors
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-5 sm:right-5 z-40 sm:w-[410px] rounded-[16px] bg-[#7a1245]/92 backdrop-blur-xl border border-white/30 px-5 py-4 text-white shadow-[0_24px_60px_rgba(70,5,35,0.35)]"
        >
          <div className="text-[17px] font-medium tracking-[-0.02em]">
            We Use Cookies
          </div>
          <p className="mt-1.5 text-[12.5px] leading-[1.45] text-white/90">
            We use cookies to preserve your simulated session and analyze site
            traffic. Review our{" "}
            <a href="#legal" className="underline underline-offset-2 font-medium">
              Privacy Policy &amp; Charter
            </a>{" "}
            for details.
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleChoice("accepted")}
              className="h-[32px] px-5 rounded-full bg-white text-black text-[12.5px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => handleChoice("rejected")}
              className="h-[32px] px-5 rounded-full border border-white/60 bg-transparent text-white text-[12.5px] font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              Reject All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
