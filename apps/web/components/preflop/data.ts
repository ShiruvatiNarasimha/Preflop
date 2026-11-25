export type EarlyAccessRole = "back" | "list" | "liquidity"

export interface MarketPick {
  personSlug?: string
  personName: string
  milestoneId?: string
  milestoneTitle: string
  side: "Yes" | "No"
  priceCents: number
}

export interface MilestoneContract {
  id: string
  title: string
  question: string
  yesCents: number
  delta24h: string
  deltaPositive: boolean
  closes: string
  closesFull: string
  volume: string
  traders: number
  dotClass: string
}

export interface FeaturedPerson {
  id: string
  name: string
  initials: string
  shortTab: string
  role: string
  company: string
  category: "Founder" | "Creator" | "Athlete" | "Artist"
  totalVolume: string
  leadDelta: string
  spreadCents: number
  /** Primary SVG polyline curve (viewBox 0 0 280 96) */
  yesPath: string
  /** Area fill path matching yesPath */
  yesAreaPath: string
  /** Complementary soft No curve */
  noPath: string
  /** Peak point for marker */
  peak: { x: number; y: number }
  milestones: MilestoneContract[]
}

export const FEATURED_PEOPLE: FeaturedPerson[] = [
  {
    id: "brendan-foody",
    name: "Brendan Foody",
    initials: "BF",
    shortTab: "Brendan Foody",
    role: "Co-founder & Co-CEO",
    company: "Mercor",
    category: "Founder",
    totalVolume: "$359.4K",
    leadDelta: "+4 pts",
    spreadCents: 1,
    yesPath:
      "M4 72 C 30 68, 48 76, 68 58 C 88 40, 102 22, 118 22 C 134 22, 148 44, 168 46 C 188 48, 204 28, 224 30 C 244 32, 260 26, 276 24",
    yesAreaPath:
      "M4 72 C 30 68, 48 76, 68 58 C 88 40, 102 22, 118 22 C 134 22, 148 44, 168 46 C 188 48, 204 28, 224 30 C 244 32, 260 26, 276 24 L 276 92 L 4 92 Z",
    noPath:
      "M4 34 C 34 38, 56 48, 86 54 C 116 60, 146 68, 178 62 C 210 56, 240 68, 276 70",
    peak: { x: 118, y: 22 },
    milestones: [
      {
        id: "mercor-research-platform",
        title: "Research platform",
        question:
          "Will Mercor launch a self-serve platform for AI research teams?",
        yesCents: 74,
        delta24h: "+4 pts",
        deltaPositive: true,
        closes: "Nov 13",
        closesFull: "Nov 13, 2026",
        volume: "$108.4K",
        traders: 275,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "mercor-coding-benchmark",
        title: "Coding benchmark",
        question:
          "Will Mercor release a new public coding evaluation benchmark?",
        yesCents: 63,
        delta24h: "+2 pts",
        deltaPositive: true,
        closes: "Nov 27",
        closesFull: "Nov 27, 2026",
        volume: "$87.4K",
        traders: 214,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "mercor-first-acquisition",
        title: "First acquisition",
        question:
          "Will Mercor announce a completed acquisition of another company?",
        yesCents: 38,
        delta24h: "-1 pt",
        deltaPositive: false,
        closes: "Jan 15",
        closesFull: "Jan 15, 2027",
        volume: "$51.2K",
        traders: 149,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "mrbeast",
    name: "MrBeast",
    initials: "MB",
    shortTab: "MrBeast",
    role: "Creator & Entrepreneur",
    company: "Beast Industries",
    category: "Creator",
    totalVolume: "$570.5K",
    leadDelta: "+6 pts",
    spreadCents: 1,
    yesPath:
      "M4 66 C 28 60, 48 52, 74 44 C 98 36, 120 42, 144 30 C 168 18, 194 24, 218 20 C 242 16, 260 22, 276 18",
    yesAreaPath:
      "M4 66 C 28 60, 48 52, 74 44 C 98 36, 120 42, 144 30 C 168 18, 194 24, 218 20 C 242 16, 260 22, 276 18 L 276 92 L 4 92 Z",
    noPath:
      "M4 38 C 38 42, 70 50, 104 58 C 142 66, 182 68, 224 72 C 248 74, 264 76, 276 76",
    peak: { x: 218, y: 20 },
    milestones: [
      {
        id: "mrbeast-100m-upload",
        title: "100M-view next upload",
        question:
          "Will MrBeast's next main-channel upload pass 100M views in 7 days?",
        yesCents: 78,
        delta24h: "+6 pts",
        deltaPositive: true,
        closes: "Nov 20",
        closesFull: "Nov 20, 2026",
        volume: "$185.8K",
        traders: 418,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "mrbeast-feastables-market",
        title: "Feastables new market",
        question:
          "Will Feastables begin retail sales in a new country after Oct 28?",
        yesCents: 65,
        delta24h: "+3 pts",
        deltaPositive: true,
        closes: "Dec 4",
        closesFull: "Dec 4, 2026",
        volume: "$127.8K",
        traders: 302,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "mrbeast-10m-challenge",
        title: "A $10M challenge",
        question:
          "Will MrBeast release a challenge offering a single winner $10M+?",
        yesCents: 52,
        delta24h: "-2 pts",
        deltaPositive: false,
        closes: "Dec 18",
        closesFull: "Dec 18, 2026",
        volume: "$98.6K",
        traders: 241,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "roy-lee",
    name: "Roy Lee",
    initials: "RL",
    shortTab: "Roy Lee",
    role: "Co-founder & CEO",
    company: "Cluely",
    category: "Founder",
    totalVolume: "$208.1K",
    leadDelta: "+5 pts",
    spreadCents: 1,
    yesPath:
      "M4 70 C 32 64, 56 58, 86 48 C 114 38, 138 30, 166 26 C 194 22, 224 28, 250 22 C 262 20, 270 21, 276 20",
    yesAreaPath:
      "M4 70 C 32 64, 56 58, 86 48 C 114 38, 138 30, 166 26 C 194 22, 224 28, 250 22 C 262 20, 270 21, 276 20 L 276 92 L 4 92 Z",
    noPath:
      "M4 34 C 40 42, 82 52, 128 60 C 174 68, 224 70, 276 74",
    peak: { x: 166, y: 26 },
    milestones: [
      {
        id: "cluely-enterprise",
        title: "Enterprise launch",
        question:
          "Will Cluely launch an enterprise tier with SSO and admin controls?",
        yesCents: 76,
        delta24h: "+5 pts",
        deltaPositive: true,
        closes: "Nov 13",
        closesFull: "Nov 13, 2026",
        volume: "$75.1K",
        traders: 196,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "cluely-workspaces",
        title: "Team workspaces",
        question:
          "Will Cluely launch shared team workspaces for all paying teams?",
        yesCents: 67,
        delta24h: "+2 pts",
        deltaPositive: true,
        closes: "Nov 20",
        closesFull: "Nov 20, 2026",
        volume: "$45.2K",
        traders: 138,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "cluely-mobile",
        title: "Mobile companion",
        question:
          "Will Cluely publish a mobile companion app on iOS or Android?",
        yesCents: 41,
        delta24h: "-1 pt",
        deltaPositive: false,
        closes: "Dec 18",
        closesFull: "Dec 18, 2026",
        volume: "$29.4K",
        traders: 94,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "tanay-kothari",
    name: "Tanay Kothari",
    initials: "TK",
    shortTab: "Tanay Kothari",
    role: "Co-founder & CEO",
    company: "Wispr Flow",
    category: "Founder",
    totalVolume: "$197.8K",
    leadDelta: "+3 pts",
    spreadCents: 1,
    yesPath:
      "M4 70 C 34 68, 54 60, 82 52 C 110 44, 134 52, 162 34 C 188 18, 212 32, 238 28 C 254 25, 266 26, 276 26",
    yesAreaPath:
      "M4 70 C 34 68, 54 60, 82 52 C 110 44, 134 52, 162 34 C 188 18, 212 32, 238 28 C 254 25, 266 26, 276 26 L 276 92 L 4 92 Z",
    noPath:
      "M4 36 C 42 40, 84 48, 128 56 C 172 64, 222 66, 276 68",
    peak: { x: 188, y: 24 },
    milestones: [
      {
        id: "wispr-dev-api",
        title: "Public developer API",
        question: "Will Wispr Flow open a self-serve public developer API?",
        yesCents: 71,
        delta24h: "+3 pts",
        deltaPositive: true,
        closes: "Nov 6",
        closesFull: "Nov 6, 2026",
        volume: "$62.1K",
        traders: 188,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "wispr-voice-model",
        title: "Next voice model",
        question:
          "Will Wispr Flow release a new flagship speech model to all users?",
        yesCents: 68,
        delta24h: "+5 pts",
        deltaPositive: true,
        closes: "Nov 20",
        closesFull: "Nov 20, 2026",
        volume: "$48.7K",
        traders: 152,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "wispr-hardware",
        title: "First hardware device",
        question:
          "Will Wispr Flow open paid orders for a first-party hardware device?",
        yesCents: 32,
        delta24h: "+1 pt",
        deltaPositive: true,
        closes: "Jan 31",
        closesFull: "Jan 31, 2027",
        volume: "$28.9K",
        traders: 112,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "fernando-mendoza",
    name: "Fernando Mendoza",
    initials: "FM",
    shortTab: "F. Mendoza",
    role: "Quarterback",
    company: "Las Vegas Raiders",
    category: "Athlete",
    totalVolume: "$317.1K",
    leadDelta: "+4 pts",
    spreadCents: 1,
    yesPath:
      "M4 68 C 30 70, 52 54, 78 48 C 106 42, 128 32, 156 30 C 184 28, 212 36, 240 26 C 258 22, 268 24, 276 24",
    yesAreaPath:
      "M4 68 C 30 70, 52 54, 78 48 C 106 42, 128 32, 156 30 C 184 28, 212 36, 240 26 C 258 22, 268 24, 276 24 L 276 92 L 4 92 Z",
    noPath:
      "M4 38 C 44 44, 90 52, 136 60 C 184 68, 232 68, 276 70",
    peak: { x: 156, y: 30 },
    milestones: [
      {
        id: "mendoza-start",
        title: "Next regular-season start",
        question:
          "Will Fernando Mendoza start a regular-season NFL game by November 8?",
        yesCents: 72,
        delta24h: "+4 pts",
        deltaPositive: true,
        closes: "Nov 8",
        closesFull: "Nov 8, 2026",
        volume: "$92.6K",
        traders: 268,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "mendoza-300-yards",
        title: "300-yard game",
        question:
          "Will Fernando Mendoza record 300+ passing yards in an NFL game?",
        yesCents: 61,
        delta24h: "+2 pts",
        deltaPositive: true,
        closes: "Nov 29",
        closesFull: "Nov 29, 2026",
        volume: "$75.3K",
        traders: 204,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "mendoza-rotw",
        title: "Rookie of the Week",
        question:
          "Will Fernando Mendoza win an official NFL Rookie of the Week award?",
        yesCents: 39,
        delta24h: "+1 pt",
        deltaPositive: true,
        closes: "Jan 10",
        closesFull: "Jan 10, 2027",
        volume: "$32.7K",
        traders: 118,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "marques-brownlee",
    name: "Marques Brownlee",
    initials: "MK",
    shortTab: "MKBHD",
    role: "Creator & Reviewer",
    company: "MKBHD",
    category: "Creator",
    totalVolume: "$287.0K",
    leadDelta: "+3 pts",
    spreadCents: 1,
    yesPath:
      "M4 66 C 34 62, 62 56, 94 46 C 122 38, 148 34, 178 28 C 208 22, 236 28, 276 24",
    yesAreaPath:
      "M4 66 C 34 62, 62 56, 94 46 C 122 38, 148 34, 178 28 C 208 22, 236 28, 276 24 L 276 92 L 4 92 Z",
    noPath:
      "M4 38 C 46 44, 92 52, 142 60 C 192 66, 236 68, 276 70",
    peak: { x: 178, y: 28 },
    milestones: [
      {
        id: "mkbhd-camera-test",
        title: "20-phone blind camera test",
        question:
          "Will MKBHD release a new blind camera test comparing 20+ phones?",
        yesCents: 77,
        delta24h: "+3 pts",
        deltaPositive: true,
        closes: "Dec 31",
        closesFull: "Dec 31, 2026",
        volume: "$58.9K",
        traders: 192,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "mkbhd-ceo-interview",
        title: "Major tech CEO interview",
        question:
          "Will Marques release an interview with Apple, Google, Microsoft, or Nvidia's CEO?",
        yesCents: 70,
        delta24h: "+2 pts",
        deltaPositive: true,
        closes: "Nov 27",
        closesFull: "Nov 27, 2026",
        volume: "$78.6K",
        traders: 234,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "mkbhd-hardware",
        title: "Signature hardware product",
        question:
          "Will Marques open orders for a new physical tech product under his brand?",
        yesCents: 42,
        delta24h: "-1 pt",
        deltaPositive: false,
        closes: "Dec 18",
        closesFull: "Dec 18, 2026",
        volume: "$63.9K",
        traders: 171,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "sabrina-carpenter",
    name: "Sabrina Carpenter",
    initials: "SC",
    shortTab: "Sabrina",
    role: "Recording Artist",
    company: "Music",
    category: "Artist",
    totalVolume: "$591.0K",
    leadDelta: "+5 pts",
    spreadCents: 1,
    yesPath:
      "M4 64 C 32 62, 58 70, 88 54 C 118 38, 146 28, 174 36 C 202 44, 224 22, 248 24 C 262 25, 270 28, 276 26",
    yesAreaPath:
      "M4 64 C 32 62, 58 70, 88 54 C 118 38, 146 28, 174 36 C 202 44, 224 22, 248 24 C 262 25, 270 28, 276 26 L 276 92 L 4 92 Z",
    noPath:
      "M4 40 C 36 44, 78 52, 120 60 C 164 68, 218 64, 276 68",
    peak: { x: 248, y: 24 },
    milestones: [
      {
        id: "sabrina-lead-single",
        title: "A new lead single",
        question:
          "Will Sabrina Carpenter release a new lead single after Oct 28?",
        yesCents: 72,
        delta24h: "+5 pts",
        deltaPositive: true,
        closes: "Nov 20",
        closesFull: "Nov 20, 2026",
        volume: "$163.2K",
        traders: 364,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "sabrina-artist-duet",
        title: "First-time artist duet",
        question:
          "Will Sabrina Carpenter release an official duet with a new collaborator?",
        yesCents: 65,
        delta24h: "+2 pts",
        deltaPositive: true,
        closes: "Jan 15",
        closesFull: "Jan 15, 2027",
        volume: "$94.2K",
        traders: 238,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "sabrina-stadium-tour",
        title: "New stadium tour",
        question:
          "Will tickets go on sale for a new tour with at least five stadium dates?",
        yesCents: 48,
        delta24h: "-1 pt",
        deltaPositive: false,
        closes: "Dec 18",
        closesFull: "Dec 18, 2026",
        volume: "$119.0K",
        traders: 289,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
  {
    id: "raye",
    name: "RAYE",
    initials: "RY",
    shortTab: "RAYE",
    role: "Recording Artist",
    company: "Music",
    category: "Artist",
    totalVolume: "$389.5K",
    leadDelta: "+4 pts",
    spreadCents: 1,
    yesPath:
      "M4 62 C 34 58, 66 48, 98 40 C 132 32, 162 24, 198 22 C 232 20, 256 18, 276 18",
    yesAreaPath:
      "M4 62 C 34 58, 66 48, 98 40 C 132 32, 162 24, 198 22 C 232 20, 256 18, 276 18 L 276 92 L 4 92 Z",
    noPath:
      "M4 42 C 46 48, 98 56, 152 64 C 204 72, 244 74, 276 76",
    peak: { x: 198, y: 22 },
    milestones: [
      {
        id: "raye-single",
        title: "A new original single",
        question:
          "Will RAYE release a new original single not available on October 28?",
        yesCents: 79,
        delta24h: "+4 pts",
        deltaPositive: true,
        closes: "Nov 20",
        closesFull: "Nov 20, 2026",
        volume: "$108.7K",
        traders: 279,
        dotClass: "bg-[#ff4665]",
      },
      {
        id: "raye-arena-tour",
        title: "New arena tour on sale",
        question:
          "Will RAYE put tickets on sale for a newly announced 5+ arena tour?",
        yesCents: 67,
        delta24h: "+3 pts",
        deltaPositive: true,
        closes: "Dec 18",
        closesFull: "Dec 18, 2026",
        volume: "$76.6K",
        traders: 198,
        dotClass: "bg-[#fe7ac6]",
      },
      {
        id: "raye-orchestral",
        title: "Orchestral live release",
        question:
          "Will RAYE release an official live album or concert film with an orchestra?",
        yesCents: 53,
        delta24h: "+1 pt",
        deltaPositive: true,
        closes: "Jan 15",
        closesFull: "Jan 15, 2027",
        volume: "$62.8K",
        traders: 164,
        dotClass: "bg-[#7d2bc4]",
      },
    ],
  },
]

export function formatPayoutMultiplier(cents: number): string {
  const safe = Math.max(1, Math.min(99, cents))
  return `${(100 / safe).toFixed(2)}×`
}

export const FOUNDER_LETTER_PARAGRAPHS = [
  "I sold half my first company for pennies. Looking back, I was probably the most mispriced asset in the room.",
  "If you believe in someone, there should be a way to monetize that conviction. That simple idea became an obsession, and that obsession became Preflop.",
  "Over eight months, three thousand conversations, and 136 fund rejections, we kept coming back to one truth: humans and their future economic output are already an asset class. What has always been missing is a liquid, standardized, clearable market for it.",
  "We just closed an oversubscribed $1.5M pre-seed led by Verdict Capital and Afore Capital. More than 200 early participants have already tested our simulated milestone markets, and dozens of market makers are working with us on book depth ahead of launch.",
  "Along the way, I had to keep reminding myself of one principle: these are people, not commodities, events, or companies. Every listing rests on issuer consent, a hard 25% ceiling so individuals keep at least 75%, and a Milestone Charter that permanently excludes health, family, and legal matters.",
  "Robinhood routed retail access to markets that already existed. Preflop is the market. Over the next twelve weeks, we are shipping the first live rail where conviction finally clears.",
]
