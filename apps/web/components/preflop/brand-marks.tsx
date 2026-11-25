"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * Custom wide neo-futurist geometric wordmark for Preflop.
 * Built with balanced chamfered strokes and exact padded viewBox bounds.
 */
export function PreflopWordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 156 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="preflop"
      className={cn("h-[20px] w-auto shrink-0 select-none block", className)}
    >
      {/* p */}
      <path
        d="M5.6 7.4H19C21.3 7.4 22.6 8.7 22.6 11V18.2C22.6 20.5 21.3 21.8 19 21.8H6.4V26H2.6V11C2.6 8.7 3.9 7.4 5.6 7.4ZM6.4 10.7V18.5H18.4C18.6 18.5 18.8 18.3 18.8 18V11.2C18.8 10.9 18.6 10.7 18.4 10.7H6.4Z"
        fill="currentColor"
      />
      {/* r */}
      <path
        d="M28.6 7.4H39.4C41 7.4 42 8.4 42 10V10.8H32.4V21.8H28.6V7.4Z"
        fill="currentColor"
      />
      {/* e */}
      <path
        d="M50.2 7.4H63.2C65.5 7.4 66.8 8.7 66.8 11V16H50.4V18.5H66.2V21.8H50.2C47.9 21.8 46.6 20.5 46.6 18.2V11C46.6 8.7 47.9 7.4 50.2 7.4ZM50.4 10.6V13.2H63V10.6H50.4Z"
        fill="currentColor"
      />
      {/* f */}
      <path
        d="M78.6 2.6H86.6V5.9H79.4V7.4H86V10.6H79.4V21.8H75.6V10.6H72.4V7.4H75.6V5.8C75.6 3.8 76.7 2.6 78.6 2.6Z"
        fill="currentColor"
      />
      {/* l */}
      <path d="M92.4 2.6H96.2V21.8H92.4V2.6Z" fill="currentColor" />
      {/* o */}
      <path
        d="M106 7.4H119.4C121.7 7.4 123 8.7 123 11V18.2C123 20.5 121.7 21.8 119.4 21.8H106C103.7 21.8 102.4 20.5 102.4 18.2V11C102.4 8.7 103.7 7.4 106 7.4ZM106.2 10.7V18.5H119.2V10.7H106.2Z"
        fill="currentColor"
      />
      {/* p */}
      <path
        d="M132 7.4H145.4C147.7 7.4 149 8.7 149 11V18.2C149 20.5 147.7 21.8 145.4 21.8H132.8V26H129V11C129 8.7 130.3 7.4 132 7.4ZM132.8 10.7V18.5H144.8C145 18.5 145.2 18.3 145.2 18V11.2C145.2 10.9 145 10.7 144.8 10.7H132.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Modular geometric architectural Pf prism emblem for Preflop.
 * Used inside the Hero pill, animated bento cards, trading desk sidebar, and contact emblem.
 */
export function PreflopEmblem({
  className,
  gradient = false,
}: {
  className?: string
  gradient?: boolean
}) {
  const gradId = React.useId()

  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      {gradient && (
        <defs>
          <linearGradient
            id={gradId}
            x1="2"
            y1="26"
            x2="26"
            y2="2"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FE7AC6" />
            <stop offset="100%" stopColor="#FF4665" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M5 6.8L10.2 3.2H22.8V16.8L17.6 24.2H5V6.8ZM8.4 8.9V20.8H15.8L19.4 15.6V6.6H11.5L8.4 8.9Z"
        fill={gradient ? `url(#${gradId})` : "currentColor"}
      />
      <path
        d="M11.1 10.4H15.5C16.6 10.4 17.3 11.1 17.3 12.1V13.6C17.3 14.6 16.6 15.3 15.5 15.3H13.2V18.1H11.1V10.4ZM13.2 12.1V13.6H15.1V12.1H13.2Z"
        fill={gradient ? `url(#${gradId})` : "currentColor"}
      />
    </svg>
  )
}

/**
 * Signature organic two-node connected pink-to-coral synapse icon used in every section eyebrow.
 */
export function SynapseIcon({ className }: { className?: string }) {
  const gradId = React.useId()

  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-[16px] w-[16px] shrink-0", className)}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="2"
          y1="15"
          x2="16"
          y2="3"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="20%" stopColor="#FE7AC6" />
          <stop offset="85%" stopColor="#FF4665" />
        </linearGradient>
      </defs>
      <path
        d="M12.6 2.5C14.3 2.5 15.6 3.8 15.6 5.5C15.6 7.1 14.3 8.4 12.7 8.4C11.9 8.4 11.1 8.6 10.4 9.3L9.3 10.4C8.6 11.1 8.4 11.9 8.4 12.7C8.4 14.3 7.1 15.6 5.5 15.6C3.8 15.6 2.5 14.3 2.5 12.6C2.5 10.9 3.8 9.6 5.5 9.6C6.3 9.6 7.1 9.4 7.8 8.7L8.9 7.6C9.6 6.9 9.8 6.1 9.8 5.3C9.8 3.7 11.1 2.5 12.6 2.5Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  )
}

export function SectionEyebrow({
  text,
  centered = false,
  className,
}: {
  text: string
  centered?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 text-[15px] md:text-[16px] font-normal leading-[1.25] text-black",
        centered && "justify-center text-center",
        className
      )}
    >
      <SynapseIcon />
      <span>{text}</span>
    </div>
  )
}

export function GradientPlayIcon({ className }: { className?: string }) {
  const gradId = React.useId()

  return (
    <svg
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5 translate-x-[1px]", className)}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0"
          y1="8"
          x2="14"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="15%" stopColor="#FE7AC6" />
          <stop offset="85%" stopColor="#FF4665" />
        </linearGradient>
      </defs>
      <path
        d="M2.2 1.6C1.5 1.2 0.7 1.7 0.7 2.5V13.5C0.7 14.3 1.5 14.8 2.2 14.4L12.1 8.9C12.8 8.5 12.8 7.5 12.1 7.1L2.2 1.6Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  )
}
