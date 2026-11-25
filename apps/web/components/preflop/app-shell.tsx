"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  BarChart3,
  ChevronsUpDown,
  FileText,
  Home,
  Layers,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@workspace/ui/components/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { PreflopEmblem, PreflopWordmark } from "./brand-marks"
import type { EarlyAccessRole } from "./data"
import {
  PERSON_PROFILES,
  formatCurrency,
  getPersonBySlug,
} from "./market-catalog"
import { EarlyAccessModal, FounderPreviewModal } from "./modals"
import { OnboardingModal } from "./onboarding-modal"
import { usePreflop } from "./store"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    user,
    cashBalance,
    positionsValue,
    totalEquity,
    unrealizedPnl,
    realizedPnl,
    milestonePositions,
    trajectoryPositions,
    getMilestoneYesCents,
    openOnboarding,
    resetAccount,
  } = usePreflop()

  const [commandOpen, setCommandOpen] = React.useState(false)
  const [earlyAccessOpen, setEarlyAccessOpen] = React.useState(false)
  const [earlyAccessRole, setEarlyAccessRole] =
    React.useState<EarlyAccessRole>("back")
  const [letterOpen, setLetterOpen] = React.useState(false)

  // Global Cmd+K / Ctrl+K Spotlight Market Search
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const openPositionsCount =
    milestonePositions.length + trajectoryPositions.length
  const netPnl = unrealizedPnl + realizedPnl
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PF"

  const watchedPeople = PERSON_PROFILES.filter((p) =>
    user.watchlist.includes(p.slug)
  )

  // Dynamic breadcrumb calculation
  const personSlug = pathname.startsWith("/person/")
    ? pathname.replace("/person/", "").split("/")[0]
    : null
  const activePerson = personSlug ? getPersonBySlug(personSlug) : undefined

  const currentPageLabel = pathname.startsWith("/portfolio")
    ? "Portfolio"
    : pathname.startsWith("/raise")
      ? "Raise & Direct List"
      : activePerson
        ? activePerson.name
        : "Live Markets"

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="border-r border-black/[0.07] bg-white"
      >
        {/* Sidebar Brand Header */}
        <SidebarHeader className="h-[60px] px-3 flex flex-row items-center justify-between border-b border-black/[0.06]">
          <Link
            href="/"
            aria-label="Preflop Home"
            className="flex items-center gap-2.5 overflow-hidden px-1"
          >
            <div className="h-7 w-7 rounded-[8px] bg-[#fff0f5] border border-[#ff4665]/15 flex items-center justify-center shrink-0">
              <PreflopEmblem gradient className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <PreflopWordmark className="h-[16px] text-black" />
            </div>
          </Link>
          <Badge
            variant="secondary"
            className="group-data-[collapsible=icon]:hidden bg-[#F5F5F7] text-black/70 border border-black/[0.06] text-[10px] font-medium px-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1" />
            SIM
          </Badge>
        </SidebarHeader>

        {/* Sidebar Scrollable Body */}
        <SidebarContent className="bg-white px-2 py-3">
          {/* Quick Cmd+K Trigger */}
          <div className="px-1 mb-2 group-data-[collapsible=icon]:hidden">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="w-full h-9 px-3 rounded-[10px] bg-[#F7F7F8] hover:bg-[#EFEFF2] border border-black/[0.06] text-[12.5px] text-[#71717A] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-black/45" />
                <span>Jump to market...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-black/10 font-mono text-[10px] text-black/55">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Primary Exchange Navigation */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10.5px] uppercase tracking-[0.08em] text-[#8E8E93] font-medium px-2.5">
              Exchange
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === "/markets" || pathname.startsWith("/person/")
                    }
                    tooltip="Live Markets"
                    className="h-9 rounded-[10px] data-[active=true]:bg-[#fff0f5] data-[active=true]:text-[#ff4665] data-[active=true]:font-medium"
                  >
                    <Link href="/markets">
                      <BarChart3 className="h-4 w-4" />
                      <span>Live Markets</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="text-[10.5px] text-black/50 tabular-nums">
                    40
                  </SidebarMenuBadge>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/portfolio")}
                    tooltip="Portfolio & P&L"
                    className="h-9 rounded-[10px] data-[active=true]:bg-[#fff0f5] data-[active=true]:text-[#ff4665] data-[active=true]:font-medium"
                  >
                    <Link href="/portfolio">
                      <Wallet className="h-4 w-4" />
                      <span>Portfolio</span>
                    </Link>
                  </SidebarMenuButton>
                  {openPositionsCount > 0 && (
                    <SidebarMenuBadge className="rounded-full bg-black text-white px-1.5 text-[10px] tabular-nums">
                      {openPositionsCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/raise")}
                    tooltip="Raise & Direct List"
                    className="h-9 rounded-[10px] data-[active=true]:bg-[#fff0f5] data-[active=true]:text-[#ff4665] data-[active=true]:font-medium"
                  >
                    <Link href="/raise">
                      <Layers className="h-4 w-4" />
                      <span>Raise &amp; Direct List</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-3 bg-black/[0.06]" />

          {/* Live Synced Watchlist inside Sidebar */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10.5px] uppercase tracking-[0.08em] text-[#8E8E93] font-medium px-2.5 flex items-center justify-between">
              <span>Watchlist</span>
              <span className="text-[10px] font-mono text-black/40">
                {watchedPeople.length}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {watchedPeople.map((person) => {
                  const lead = person.milestones[0]!
                  const yesCents = getMilestoneYesCents(
                    lead.id,
                    lead.baseYesCents
                  )
                  const isActive = pathname === `/person/${person.slug}`
                  return (
                    <SidebarMenuItem key={person.slug}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={`${person.name} (${yesCents}¢)`}
                        className="h-9 rounded-[10px] data-[active=true]:bg-[#fff0f5] data-[active=true]:text-[#ff4665]"
                      >
                        <Link href={`/person/${person.slug}`}>
                          <span className="h-5 w-5 rounded-full bg-opus-gradient text-white text-[9px] font-semibold flex items-center justify-center shrink-0">
                            {person.initials}
                          </span>
                          <span className="truncate text-[13px]">
                            {person.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuBadge className="font-mono text-[10.5px] font-medium text-[#ff4665] tabular-nums">
                        {yesCents}¢
                      </SidebarMenuBadge>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-3 bg-black/[0.06]" />

          {/* Company & Resources */}
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-[10.5px] uppercase tracking-[0.08em] text-[#8E8E93] font-medium px-2.5">
              Preflop
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setLetterOpen(true)}
                    tooltip="Founder Letter ($1.5M)"
                    className="h-9 rounded-[10px] cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-[#ff4665]" />
                    <span>Founder Letter</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Landing Overview"
                    className="h-9 rounded-[10px]"
                  >
                    <Link href="/">
                      <Home className="h-4 w-4" />
                      <span>Overview Page</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Account Footer */}
        <SidebarFooter className="border-t border-black/[0.06] bg-white p-2.5">
          {user.onboarded ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="rounded-[12px] hover:bg-[#F7F7F8] cursor-pointer"
                    >
                      <Avatar size="default" className="h-8 w-8">
                        <AvatarFallback className="bg-opus-gradient text-white text-[11px] font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-[12.5px] leading-tight min-w-0">
                        <span className="truncate font-medium text-black">
                          {user.name}
                        </span>
                        <span className="truncate text-[11px] text-[#808080] tabular-nums">
                          {formatCurrency(totalEquity)}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto h-3.5 w-3.5 text-black/45" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-[232px] rounded-[14px] p-1.5"
                  >
                    <DropdownMenuLabel className="px-2 py-1.5 font-normal">
                      <div className="text-[13px] font-medium text-black">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-[#808080] truncate">
                        {user.email}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => setLetterOpen(true)}
                        className="cursor-pointer rounded-[8px]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#ff4665]" />
                        <span>Read $1.5M Founder Letter</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEarlyAccessRole(user.role)
                          setEarlyAccessOpen(true)
                        }}
                        className="cursor-pointer rounded-[8px]"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#ff4665]" />
                        <span>Request Real-Money Access</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={resetAccount}
                        className="cursor-pointer rounded-[8px] text-[#71717A]"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset $100K Paper Desk</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <Button
                type="button"
                onClick={() => openOnboarding("back")}
                className="w-full h-9 rounded-full bg-black text-white hover:bg-neutral-800 text-[13px] font-medium cursor-pointer group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Get Started ($100K)
                </span>
              </Button>
            </div>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* Main Workspace Canvas inside SidebarInset */}
      <SidebarInset className="bg-[#FAFAFB] min-w-0">
        {/* Sticky Institutional Workspace Topbar */}
        <header className="sticky top-0 z-30 h-[60px] bg-white/95 backdrop-blur-md border-b border-black/[0.07] px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <SidebarTrigger className="h-8 w-8 rounded-[8px] text-black/75 hover:text-black hover:bg-black/[0.05] cursor-pointer" />
            <Separator orientation="vertical" className="h-4 bg-black/10" />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink asChild>
                    <Link
                      href="/markets"
                      className="text-[13px] text-[#808080] hover:text-black"
                    >
                      Exchange
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {activePerson && (
                  <>
                    <BreadcrumbSeparator className="hidden sm:block" />
                    <BreadcrumbItem className="hidden md:inline-flex">
                      <BreadcrumbLink asChild>
                        <Link
                          href="/markets"
                          className="text-[13px] text-[#808080] hover:text-black"
                        >
                          {activePerson.category}s
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="text-[13px] font-medium text-black truncate">
                    {currentPageLabel}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right Live Buying Power, Equity & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden lg:inline-flex h-8 rounded-full border-black/10 bg-[#FAFAFB] text-[12px] text-[#71717A] hover:text-black px-3 cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" />
              <span>Search markets</span>
              <kbd className="ml-2 px-1 py-0.2 rounded bg-white border border-black/10 font-mono text-[10px]">
                ⌘K
              </kbd>
            </Button>

            <Link
              href="/portfolio"
              title={`Total Equity: ${formatCurrency(totalEquity)} · Cash: ${formatCurrency(cashBalance)} · Positions: ${formatCurrency(positionsValue)}`}
              className="flex items-center gap-2 h-8 px-3 rounded-full bg-[#F7F7F8] border border-black/[0.08] hover:border-black/25 transition-colors tabular-nums"
            >
              <span className="hidden md:inline text-[11px] text-[#808080]">
                Equity
              </span>
              <span className="text-[12.5px] font-medium text-black">
                {formatCurrency(totalEquity)}
              </span>
              {netPnl !== 0 && (
                <span
                  className={`hidden sm:inline text-[11px] font-medium ${
                    netPnl >= 0 ? "text-emerald-600" : "text-[#ff4665]"
                  }`}
                >
                  {netPnl >= 0 ? "+" : ""}
                  {formatCurrency(netPnl)}
                </span>
              )}
            </Link>

            {!user.onboarded && (
              <Button
                type="button"
                size="sm"
                onClick={() => openOnboarding("back")}
                className="h-8 rounded-full bg-black text-white hover:bg-neutral-800 px-3.5 text-[12.5px] font-medium cursor-pointer"
              >
                Get Started
              </Button>
            )}
          </div>
        </header>

        {/* Main Scrollable Workspace Content */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* Quiet Institutional Workspace Footer */}
        <footer className="border-t border-black/[0.06] bg-white px-5 sm:px-8 py-4 mt-10">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px] text-[#808080]">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-medium text-black">Preflop</span>
              <span>·</span>
              <span>Simulated $100K paper desk</span>
              <span>·</span>
              <span>Backed by Verdict Capital &amp; Afore Capital</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setLetterOpen(true)}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Founder Letter
              </button>
              <button
                type="button"
                onClick={() => {
                  setEarlyAccessRole("back")
                  setEarlyAccessOpen(true)
                }}
                className="text-black font-medium hover:text-[#ff4665] transition-colors cursor-pointer"
              >
                Real-Money Waitlist
              </button>
            </div>
          </div>
        </footer>
      </SidebarInset>

      {/* Global Cmd+K Command Palette */}
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Search Preflop Markets"
        description="Jump to any listed person, milestone market, or workspace page."
        className="sm:max-w-[540px] border border-black/10 shadow-2xl"
      >
        <Command>
          <CommandInput placeholder="Search founders, creators, tickers, or milestones..." />
          <CommandList>
            <CommandEmpty>No matching people or markets found.</CommandEmpty>
            <CommandGroup heading="Workspace">
              <CommandItem
                onSelect={() => {
                  setCommandOpen(false)
                  router.push("/markets")
                }}
              >
                <BarChart3 className="h-4 w-4 text-[#ff4665]" />
                <span>Live Markets (40)</span>
                <CommandShortcut>G M</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setCommandOpen(false)
                  router.push("/portfolio")
                }}
              >
                <Wallet className="h-4 w-4 text-[#ff4665]" />
                <span>Portfolio &amp; P&amp;L</span>
                <CommandShortcut>{formatCurrency(totalEquity)}</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setCommandOpen(false)
                  router.push("/raise")
                }}
              >
                <Layers className="h-4 w-4 text-[#ff4665]" />
                <span>Raise &amp; Direct List Studio</span>
                <CommandShortcut>≤25% Cap</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="People & Trajectory Units">
              {PERSON_PROFILES.map((p) => {
                const lead = p.milestones[0]!
                const cents = getMilestoneYesCents(lead.id, lead.baseYesCents)
                return (
                  <CommandItem
                    key={p.slug}
                    value={`${p.name} ${p.company} ${p.trajectory.ticker} ${p.category}`}
                    onSelect={() => {
                      setCommandOpen(false)
                      router.push(`/person/${p.slug}`)
                    }}
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-[#ff4665]" />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground text-xs ml-1">
                      {p.company} · {p.trajectory.ticker}
                    </span>
                    <CommandShortcut className="text-[#ff4665] font-mono">
                      {cents}¢ Yes
                    </CommandShortcut>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Top Milestones">
              {PERSON_PROFILES.flatMap((p) =>
                p.milestones.slice(0, 2).map((m) => ({ p, m }))
              ).map(({ p, m }) => {
                const cents = getMilestoneYesCents(m.id, m.baseYesCents)
                return (
                  <CommandItem
                    key={m.id}
                    value={`${p.name} ${m.title} ${m.question}`}
                    onSelect={() => {
                      setCommandOpen(false)
                      router.push(`/person/${p.slug}?milestone=${m.id}`)
                    }}
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">
                      {p.name}: {m.title}
                    </span>
                    <CommandShortcut className="font-mono">
                      {cents}¢
                    </CommandShortcut>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <OnboardingModal />
      <EarlyAccessModal
        open={earlyAccessOpen}
        onOpenChange={setEarlyAccessOpen}
        defaultRole={earlyAccessRole}
        selectedPick={null}
      />
      <FounderPreviewModal
        open={letterOpen}
        onOpenChange={setLetterOpen}
        initialTab="letter"
        onOpenEarlyAccess={(role) => {
          setEarlyAccessRole(role ?? "back")
          setEarlyAccessOpen(true)
        }}
      />
    </SidebarProvider>
  )
}
