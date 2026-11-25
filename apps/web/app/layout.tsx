import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { Toaster } from "@workspace/ui/components/sonner"
import { cn } from "@workspace/ui/lib/utils"
import { PreflopProvider } from "@/components/preflop/store"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Preflop | Trade on People — Human Capital Markets",
  description:
    "Prediction markets on people's milestones and liquid human capital rails. Follow a trajectory, take a view on concrete outcomes, and back conviction early.",
  openGraph: {
    title: "Preflop | Trade on People — Human Capital Markets",
    description:
      "Prediction markets on people's milestones and standardized Trajectory Units. Backed by Verdict Capital and Afore Capital.",
    type: "website",
    siteName: "Preflop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preflop | Trade on People — Human Capital Markets",
    description:
      "Prediction markets on people's milestones and standardized Trajectory Units. Backed by Verdict Capital and Afore Capital.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "scroll-smooth antialiased",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-screen bg-white text-black antialiased">
        <PreflopProvider>
          <TooltipProvider delayDuration={150}>
            {children}
            <Toaster theme="light" position="bottom-right" richColors />
          </TooltipProvider>
        </PreflopProvider>
      </body>
    </html>
  )
}
