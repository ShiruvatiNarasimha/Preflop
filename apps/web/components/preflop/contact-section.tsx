"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { PreflopEmblem } from "./brand-marks"

const INQUIRY_OPTIONS = [
  "Back People (Early Access)",
  "List Myself (Covenant / Direct List)",
  "Provide Liquidity (Market Maker)",
  "Investor Relations",
  "Press & Media",
] as const

export function ContactSection() {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [inquiryType, setInquiryType] =
    React.useState<(typeof INQUIRY_OPTIONS)[number]>(
      "Back People (Early Access)"
    )
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [agreed, setAgreed] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Please enter your email address.")
      return
    }
    if (!agreed) {
      toast.error(
        "Please agree to the terms and Milestone Charter to continue."
      )
      return
    }
    setSubmitted(true)
    toast.success("Note received — the Preflop team will follow up directly.")
  }

  return (
    <section id="contact" className="bg-white py-12 md:py-16">
      <div className="opus-container px-5 md:px-8 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] bg-[#F9F9F9] px-5 sm:px-10 md:px-14 py-14 md:py-16 flex flex-col items-center"
        >
          {/* Glossy Pink Rounded-Square Emblem Badge */}
          <div className="relative h-[64px] w-[64px] rounded-[16px] overflow-hidden shadow-[0_14px_30px_-8px_rgba(255,70,101,0.38)] flex items-center justify-center">
            <img
              src="/media/silk-emblem.avif"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <PreflopEmblem className="relative z-10 h-8 w-8 text-white/85 drop-shadow-sm" />
          </div>

          {/* Heading */}
          <h2 className="mt-6 text-center text-[32px] sm:text-[36px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.03em] text-black">
            The Market for
            <br />
            <span className="text-opus-gradient">Human Capital</span>
          </h2>

          <p className="mt-4 max-w-[540px] text-center text-[15px] md:text-[16px] leading-[1.35] text-[#808080]">
            Backed by Verdict Capital and Afore Capital. 200+ early testers.
            <br className="hidden sm:inline" /> Shipping our first live market —
            reach the team directly.
          </p>

          {/* Form Container */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 w-full max-w-[592px] rounded-[24px] bg-white border border-black/[0.08] p-8 text-center"
            >
              <div className="mx-auto h-11 w-11 rounded-full bg-[#fff0f5] flex items-center justify-center text-[#ff4665]">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[22px] font-medium tracking-[-0.02em] text-black">
                Message Received
              </h3>
              <p className="mt-2 text-[14px] text-[#808080]">
                Thank you for reaching out regarding{" "}
                <span className="text-black font-medium">{inquiryType}</span>.
                Someone from Preflop will review your note shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setFirstName("")
                  setLastName("")
                  setPhone("")
                  setEmail("")
                  setMessage("")
                  setAgreed(false)
                }}
                className="mt-6 h-[34px] px-6 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Send Another Note
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-9 w-full max-w-[592px] flex flex-col gap-5"
            >
              {/* Row 1: First Name / Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  id="contact-first-name"
                  name="firstName"
                  aria-label="First Name"
                  autoComplete="given-name"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/10 px-6 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
                <input
                  id="contact-last-name"
                  name="lastName"
                  aria-label="Last Name"
                  autoComplete="family-name"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/10 px-6 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>

              {/* Row 2: Email* / Phone (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  id="contact-email"
                  name="email"
                  aria-label="Email"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="Email*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/10 px-6 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
                <input
                  id="contact-phone"
                  name="phone"
                  aria-label="Phone Number (Optional)"
                  autoComplete="tel"
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[40px] w-full rounded-full bg-white border border-black/10 px-6 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors"
                />
              </div>

              {/* Row 3: Custom Pink-Radio Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                  className="h-[40px] w-full rounded-full bg-white border border-black/10 px-6 text-[14px] text-[#555555] flex items-center justify-between hover:border-black/25 focus:border-[#ff4665] focus:outline-none transition-colors cursor-pointer"
                >
                  <span>{inquiryType}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-black/60 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      role="listbox"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-[20px] bg-white border border-black/10 p-3 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.12)]"
                    >
                      <div className="flex flex-col">
                        {INQUIRY_OPTIONS.map((option) => {
                          const isSelected = inquiryType === option
                          return (
                            <button
                              key={option}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setInquiryType(option)
                                setDropdownOpen(false)
                              }}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-left text-[14px] text-black hover:bg-[#faf5f8] transition-colors cursor-pointer"
                            >
                              <span
                                className={`h-[14px] w-[14px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? "border-[#FF4665]"
                                    : "border-[#FF4665]/40"
                                }`}
                              >
                                {isSelected && (
                                  <span className="h-[7px] w-[7px] rounded-full bg-[#FF4665]" />
                                )}
                              </span>
                              <span>{option}</span>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Row 4: Message Textarea */}
              <textarea
                id="contact-message"
                name="message"
                aria-label="Message"
                placeholder="Tell us who you want to back, list, or provide liquidity for"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[116px] w-full rounded-[24px] bg-white border border-black/10 px-6 py-4 text-[14px] text-black placeholder:text-[#808080] focus:border-[#ff4665] focus:outline-none transition-colors resize-y"
              />

              {/* Row 5: Pink-Bordered Consent Checkbox */}
              <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreed}
                  onClick={() => setAgreed((v) => !v)}
                  className={`mt-0.5 sm:mt-0 h-[16px] w-[16px] rounded-[4px] border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    agreed
                      ? "bg-[#FF4665] border-[#FF4665] text-white"
                      : "bg-white border-[#FF4665]/75 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </button>
                <span className="text-[13.5px] leading-[1.35] text-[#808080]">
                  By submitting this form, you confirm you are 18+ and agree to
                  Preflop&apos;s{" "}
                  <a
                    href="#legal"
                    className="text-black underline underline-offset-2 hover:text-[#ff4665] transition-colors"
                  >
                    terms and Milestone Charter.
                  </a>
                </span>
              </label>

              {/* Row 6: Full-Width Solid Black Submit Pill */}
              <button
                type="submit"
                className="mt-1 h-[36px] w-full rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Submit
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
