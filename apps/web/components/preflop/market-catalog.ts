export type PersonCategory = "Founder" | "Creator" | "Athlete" | "Artist"
export type TimeframeKey = "1D" | "1W" | "1M" | "All"

export interface TrackRecordFact {
  value: string
  label: string
}

export interface ConvictionSignal {
  name: string
  group: "Backward (60%)" | "Forward (40%)"
  score: number
}

export interface FullMilestone {
  id: string
  index: number
  title: string
  question: string
  baseYesCents: number
  delta24h: number
  closes: string
  closesIso: string
  baseVolume: number
  baseTraders: number
  verificationSource: string
  seriesColor: string
}

export interface TrajectoryProfile {
  ticker: string
  spotPrice: number
  change24hPct: number
  authorizedUnits: number
  tebPerUnitPct: number
  listedPct: number
  convictionScore: number
  backwardScore: number
  forwardScore: number
  nextClearing: string
  signals: ConvictionSignal[]
}

export interface PersonProfile {
  slug: string
  name: string
  initials: string
  shortTab: string
  role: string
  company: string
  category: PersonCategory
  bio: string
  credentials: string
  facts: TrackRecordFact[]
  spreadCents: number
  trajectory: TrajectoryProfile
  milestones: FullMilestone[]
}

export interface CandlePoint {
  label: string
  open: number
  high: number
  low: number
  close: number
}

export interface TvLineDatum {
  time: number
  value: number
}

export interface TvCandleDatum {
  time: number
  open: number
  high: number
  low: number
  close: number
}

const SERIES_COLORS = [
  "#FF4665",
  "#2F7CAC",
  "#7D2BC4",
  "#BE8829",
  "#0F9D7A",
] as const

export const PERSON_PROFILES: PersonProfile[] = [
  {
    slug: "brendan-foody",
    name: "Brendan Foody",
    initials: "BF",
    shortTab: "Brendan Foody",
    role: "Co-founder & Co-CEO",
    company: "Mercor",
    category: "Founder",
    bio: "Co-founder and co-CEO of Mercor, connecting domain experts with leading AI labs to train and evaluate frontier models.",
    credentials:
      "Founded with Adarsh Hiremath and Surya Midha. Series C led by Felicis · October 2025.",
    facts: [
      { value: "$350M", label: "Series C · Oct 2025" },
      { value: "$10B", label: "Valuation · Oct 2025" },
      { value: "2023", label: "Mercor founded" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "BFDY",
      spotPrice: 142.8,
      change24hPct: 3.4,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 6.5,
      convictionScore: 91,
      backwardScore: 89,
      forwardScore: 94,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "Revenue & TEB velocity", group: "Backward (60%)", score: 95 },
        { name: "Capital backing & continuity", group: "Backward (60%)", score: 92 },
        { name: "Volatility-adjusted execution", group: "Backward (60%)", score: 82 },
        { name: "AI data infrastructure tailwind", group: "Forward (40%)", score: 96 },
        { name: "Age-adjusted career runway", group: "Forward (40%)", score: 95 },
        { name: "Frontier lab pipeline", group: "Forward (40%)", score: 91 },
      ],
    },
    milestones: [
      {
        id: "mercor-research-platform",
        index: 1,
        title: "Research platform",
        question:
          "Will Mercor launch a self-serve platform for AI research teams?",
        baseYesCents: 74,
        delta24h: 4,
        closes: "Nov 13, 2026",
        closesIso: "2026-11-13",
        baseVolume: 108400,
        baseTraders: 275,
        verificationSource: "Official Mercor launch post or public docs",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "mercor-coding-benchmark",
        index: 2,
        title: "Coding benchmark",
        question:
          "Will Mercor release a new public coding evaluation benchmark?",
        baseYesCents: 63,
        delta24h: 2,
        closes: "Nov 27, 2026",
        closesIso: "2026-11-27",
        baseVolume: 87400,
        baseTraders: 214,
        verificationSource: "Public benchmark repo, paper, or leaderboard",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "mercor-expert-vertical",
        index: 3,
        title: "New expert vertical",
        question:
          "Will Mercor launch a dedicated new expert program for a professional specialty?",
        baseYesCents: 59,
        delta24h: 1,
        closes: "Dec 4, 2026",
        closesIso: "2026-12-04",
        baseVolume: 68800,
        baseTraders: 183,
        verificationSource: "Official Mercor vertical program page",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "mercor-first-acquisition",
        index: 4,
        title: "First acquisition",
        question:
          "Will Mercor announce a completed acquisition of another company?",
        baseYesCents: 38,
        delta24h: -1,
        closes: "Jan 15, 2027",
        closesIso: "2027-01-15",
        baseVolume: 51200,
        baseTraders: 149,
        verificationSource: "Press release or major financial press confirmation",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "mercor-next-round",
        index: 5,
        title: "Next funding round",
        question:
          "Will Mercor announce a completed new equity funding round?",
        baseYesCents: 44,
        delta24h: 2,
        closes: "Jan 31, 2027",
        closesIso: "2027-01-31",
        baseVolume: 43600,
        baseTraders: 132,
        verificationSource: "Company announcement or SEC Form D filing",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "mrbeast",
    name: "MrBeast",
    initials: "MB",
    shortTab: "MrBeast",
    role: "Creator & Entrepreneur",
    company: "Beast Industries",
    category: "Creator",
    bio: "Founder of Beast Industries, scaling global entertainment, Feastables consumer retail, and large-format streaming productions.",
    credentials:
      "350M+ YouTube subscribers · Feastables retail across North America & Europe · Prime Video Beast Games.",
    facts: [
      { value: "350M+", label: "Main channel reach" },
      { value: "Feastables", label: "Global CPG brand" },
      { value: "Beast Games", label: "Streaming franchise" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "MRBS",
      spotPrice: 218.4,
      change24hPct: 2.1,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 5.0,
      convictionScore: 93,
      backwardScore: 95,
      forwardScore: 90,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "Multi-year revenue CAGR", group: "Backward (60%)", score: 97 },
        { name: "Income stream diversification", group: "Backward (60%)", score: 94 },
        { name: "Audience retention consistency", group: "Backward (60%)", score: 93 },
        { name: "Global CPG retail expansion", group: "Forward (40%)", score: 92 },
        { name: "Streaming & IP franchising", group: "Forward (40%)", score: 89 },
        { name: "Brand distribution moat", group: "Forward (40%)", score: 90 },
      ],
    },
    milestones: [
      {
        id: "mrbeast-100m-upload",
        index: 1,
        title: "100M-view next upload",
        question:
          "Will MrBeast's next main-channel long-form upload pass 100 million views within seven days of publication?",
        baseYesCents: 78,
        delta24h: 6,
        closes: "Nov 20, 2026",
        closesIso: "2026-11-20",
        baseVolume: 185800,
        baseTraders: 418,
        verificationSource: "Public YouTube view counter at 168 hours post-publish",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "mrbeast-feastables-market",
        index: 2,
        title: "Feastables in a new market",
        question:
          "Will Feastables begin retail sales in a country where it was not sold on October 28?",
        baseYesCents: 65,
        delta24h: 3,
        closes: "Dec 4, 2026",
        closesIso: "2026-12-04",
        baseVolume: 127800,
        baseTraders: 302,
        verificationSource: "Feastables official store locator or retailer launch",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "mrbeast-10m-challenge",
        index: 3,
        title: "A $10M challenge",
        question:
          "Will MrBeast release a new challenge video offering a single winner at least $10 million?",
        baseYesCents: 52,
        delta24h: -2,
        closes: "Dec 18, 2026",
        closesIso: "2026-12-18",
        baseVolume: 98600,
        baseTraders: 241,
        verificationSource: "Published main-channel episode confirmation",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "mrbeast-beast-games",
        index: 4,
        title: "New Beast Games season",
        question:
          "Will a new season of Beast Games premiere on a streaming service?",
        baseYesCents: 43,
        delta24h: 1,
        closes: "Jan 15, 2027",
        closesIso: "2027-01-15",
        baseVolume: 86400,
        baseTraders: 198,
        verificationSource: "Episode 1 live on streaming platform",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "mrbeast-50-creator",
        index: 5,
        title: "50-creator event",
        question:
          "Will MrBeast release a new main-channel competition featuring at least 50 other creators?",
        baseYesCents: 57,
        delta24h: 2,
        closes: "Jan 31, 2027",
        closesIso: "2027-01-31",
        baseVolume: 71900,
        baseTraders: 174,
        verificationSource: "Published main-channel video credits/roster",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "roy-lee",
    name: "Roy Lee",
    initials: "RL",
    shortTab: "Roy Lee",
    role: "Co-founder & CEO",
    company: "Cluely",
    category: "Founder",
    bio: "Co-founder and CEO of Cluely, building real-time AI desktop and enterprise copilot workflows with breakout viral distribution.",
    credentials:
      "Fastest-growing viral consumer-to-enterprise desktop AI launch · Enterprise expansion underway.",
    facts: [
      { value: "Cluely", label: "Co-founder & CEO" },
      { value: "Enterprise", label: "2026 tier rollout" },
      { value: "Viral", label: "Distribution engine" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "RLEE",
      spotPrice: 64.2,
      change24hPct: 5.8,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 8.0,
      convictionScore: 79,
      backwardScore: 73,
      forwardScore: 88,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "User acquisition velocity", group: "Backward (60%)", score: 91 },
        { name: "Revenue durability", group: "Backward (60%)", score: 66 },
        { name: "Execution tempo", group: "Backward (60%)", score: 78 },
        { name: "Enterprise conversion upside", group: "Forward (40%)", score: 87 },
        { name: "Brand & distribution reach", group: "Forward (40%)", score: 93 },
        { name: "Age-adjusted runway", group: "Forward (40%)", score: 90 },
      ],
    },
    milestones: [
      {
        id: "cluely-enterprise",
        index: 1,
        title: "Enterprise launch",
        question:
          "Will Cluely launch an enterprise tier with SSO and admin controls?",
        baseYesCents: 76,
        delta24h: 5,
        closes: "Nov 13, 2026",
        closesIso: "2026-11-13",
        baseVolume: 75100,
        baseTraders: 196,
        verificationSource: "Cluely pricing page & enterprise docs live",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "cluely-workspaces",
        index: 2,
        title: "Team workspaces",
        question:
          "Will Cluely launch shared team workspaces for all paying teams?",
        baseYesCents: 67,
        delta24h: 2,
        closes: "Nov 20, 2026",
        closesIso: "2026-11-20",
        baseVolume: 45200,
        baseTraders: 138,
        verificationSource: "Official changelog or product release",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "cluely-salesforce",
        index: 3,
        title: "Salesforce integration",
        question: "Will Cluely release a native Salesforce integration?",
        baseYesCents: 58,
        delta24h: 1,
        closes: "Dec 4, 2026",
        closesIso: "2026-12-04",
        baseVolume: 32700,
        baseTraders: 109,
        verificationSource: "AppExchange listing or Cluely integrations page",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "cluely-mobile",
        index: 4,
        title: "Mobile companion",
        question:
          "Will Cluely publish a mobile companion app on iOS or Android?",
        baseYesCents: 41,
        delta24h: -1,
        closes: "Dec 18, 2026",
        closesIso: "2026-12-18",
        baseVolume: 29400,
        baseTraders: 94,
        verificationSource: "App Store or Google Play public listing",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "cluely-funding",
        index: 5,
        title: "Next funding round",
        question: "Will Cluely announce a completed new equity funding round?",
        baseYesCents: 35,
        delta24h: -2,
        closes: "Jan 15, 2027",
        closesIso: "2027-01-15",
        baseVolume: 25700,
        baseTraders: 87,
        verificationSource: "Official announcement or SEC Form D",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "tanay-kothari",
    name: "Tanay Kothari",
    initials: "TK",
    shortTab: "Tanay Kothari",
    role: "Co-founder & CEO",
    company: "Wispr Flow",
    category: "Founder",
    bio: "A four-time founder building Wispr Flow, after growing Convert to 2.5M+ monthly users and selling FeatherX to Cerebra.",
    credentials:
      "Stanford AI · Taught with Andrew Ng · Forbes 30 Under 30 · Class of 2023.",
    facts: [
      { value: "4×", label: "Founder" },
      { value: "2.5M+", label: "Monthly users at Convert" },
      { value: "Exit", label: "FeatherX → Cerebra" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "TKOT",
      spotPrice: 88.6,
      change24hPct: 2.9,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 7.0,
      convictionScore: 87,
      backwardScore: 86,
      forwardScore: 89,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "Prior exit & repeat execution", group: "Backward (60%)", score: 90 },
        { name: "Product adoption curve", group: "Backward (60%)", score: 87 },
        { name: "Technical research depth", group: "Backward (60%)", score: 84 },
        { name: "Voice-interface category wave", group: "Forward (40%)", score: 91 },
        { name: "Developer ecosystem expansion", group: "Forward (40%)", score: 86 },
        { name: "Hardware & OS optionality", group: "Forward (40%)", score: 88 },
      ],
    },
    milestones: [
      {
        id: "wispr-dev-api",
        index: 1,
        title: "Public developer API",
        question: "Will Wispr Flow open a self-serve public developer API?",
        baseYesCents: 71,
        delta24h: 3,
        closes: "Nov 6, 2026",
        closesIso: "2026-11-06",
        baseVolume: 62100,
        baseTraders: 188,
        verificationSource: "Public Wispr Flow API portal & developer keys",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "wispr-voice-model",
        index: 2,
        title: "Next voice model",
        question:
          "Will Wispr Flow release a new flagship speech model to all users?",
        baseYesCents: 68,
        delta24h: 5,
        closes: "Nov 20, 2026",
        closesIso: "2026-11-20",
        baseVolume: 48700,
        baseTraders: 152,
        verificationSource: "Official release announcement available in-app",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "wispr-notetaker",
        index: 3,
        title: "Mobile notetaker",
        question: "Will Wispr Flow launch a mobile meeting notetaker?",
        baseYesCents: 54,
        delta24h: 1,
        closes: "Dec 4, 2026",
        closesIso: "2026-12-04",
        baseVolume: 34600,
        baseTraders: 121,
        verificationSource: "App Store / Play Store release notes",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "wispr-hardware",
        index: 4,
        title: "First hardware device",
        question:
          "Will Wispr Flow open paid orders for a first-party hardware device?",
        baseYesCents: 32,
        delta24h: 1,
        closes: "Jan 31, 2027",
        closesIso: "2027-01-31",
        baseVolume: 28900,
        baseTraders: 112,
        verificationSource: "Live checkout for first-party Wispr hardware",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "wispr-funding",
        index: 5,
        title: "Next funding round",
        question:
          "Will Wispr Flow announce a completed new equity funding round?",
        baseYesCents: 46,
        delta24h: -1,
        closes: "Dec 18, 2026",
        closesIso: "2026-12-18",
        baseVolume: 23500,
        baseTraders: 95,
        verificationSource: "Company announcement or SEC Form D",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "fernando-mendoza",
    name: "Fernando Mendoza",
    initials: "FM",
    shortTab: "F. Mendoza",
    role: "Quarterback",
    company: "Las Vegas Raiders",
    category: "Athlete",
    bio: "Quarterback for the Las Vegas Raiders entering his high-upside NFL campaign with sharp pocket efficiency and franchise QB upside.",
    credentials:
      "Las Vegas Raiders QB · NFL 2026 regular-season performance milestones.",
    facts: [
      { value: "QB", label: "Las Vegas Raiders" },
      { value: "NFL", label: "2026 Season" },
      { value: "5", label: "Active milestones" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "FMNZ",
      spotPrice: 54.5,
      change24hPct: 4.1,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 6.0,
      convictionScore: 81,
      backwardScore: 76,
      forwardScore: 88,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "Draft capital & contract floor", group: "Backward (60%)", score: 82 },
        { name: "Collegiate efficiency index", group: "Backward (60%)", score: 80 },
        { name: "Durability & snap share", group: "Backward (60%)", score: 71 },
        { name: "Second-contract QB ceiling", group: "Forward (40%)", score: 92 },
        { name: "Endorsement & media market", group: "Forward (40%)", score: 85 },
        { name: "Career runway", group: "Forward (40%)", score: 88 },
      ],
    },
    milestones: [
      {
        id: "mendoza-start",
        index: 1,
        title: "Next regular-season start",
        question:
          "Will Fernando Mendoza start a regular-season NFL game by November 8?",
        baseYesCents: 72,
        delta24h: 4,
        closes: "Nov 8, 2026",
        closesIso: "2026-11-08",
        baseVolume: 92600,
        baseTraders: 268,
        verificationSource: "Official NFL game book starting lineup",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "mendoza-300-yards",
        index: 2,
        title: "300-yard game",
        question:
          "Will Fernando Mendoza record at least 300 passing yards in a regular-season NFL game?",
        baseYesCents: 61,
        delta24h: 2,
        closes: "Nov 29, 2026",
        closesIso: "2026-11-29",
        baseVolume: 75300,
        baseTraders: 204,
        verificationSource: "Official NFL box score passing yards",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "mendoza-three-td",
        index: 3,
        title: "Three-TD game",
        question:
          "Will Fernando Mendoza throw at least three touchdown passes in a regular-season NFL game?",
        baseYesCents: 53,
        delta24h: -1,
        closes: "Dec 13, 2026",
        closesIso: "2026-12-13",
        baseVolume: 68400,
        baseTraders: 179,
        verificationSource: "Official NFL box score passing TDs",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "mendoza-three-wins",
        index: 4,
        title: "Three wins as starter",
        question:
          "Will Fernando Mendoza win three regular-season NFL games as the starting quarterback?",
        baseYesCents: 47,
        delta24h: 2,
        closes: "Jan 10, 2027",
        closesIso: "2027-01-10",
        baseVolume: 48100,
        baseTraders: 146,
        verificationSource: "Official NFL starting QB win-loss record",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "mendoza-rotw",
        index: 5,
        title: "Rookie of the Week",
        question:
          "Will Fernando Mendoza receive an official NFL Rookie of the Week award?",
        baseYesCents: 39,
        delta24h: 1,
        closes: "Jan 10, 2027",
        closesIso: "2027-01-10",
        baseVolume: 32700,
        baseTraders: 118,
        verificationSource: "Official NFL.com weekly award announcement",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "marques-brownlee",
    name: "Marques Brownlee",
    initials: "MK",
    shortTab: "MKBHD",
    role: "Creator & Reviewer",
    company: "MKBHD",
    category: "Creator",
    bio: "Founder of MKBHD Media & The Studio — the premier independent voice in consumer technology, EVs, and hardware design.",
    credentials:
      "20M+ main channel subscribers · Waveform Podcast · The Studio & Auto Focus network.",
    facts: [
      { value: "20M+", label: "MKBHD subscribers" },
      { value: "4", label: "Active media channels" },
      { value: "15+ yrs", label: "Publishing track record" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "MKBD",
      spotPrice: 96.4,
      change24hPct: 1.6,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 4.5,
      convictionScore: 88,
      backwardScore: 91,
      forwardScore: 83,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "15-year publishing consistency", group: "Backward (60%)", score: 96 },
        { name: "Sponsor & media diversification", group: "Backward (60%)", score: 89 },
        { name: "Low revenue volatility", group: "Backward (60%)", score: 90 },
        { name: "Hardware & brand commerce", group: "Forward (40%)", score: 81 },
        { name: "Multi-channel studio growth", group: "Forward (40%)", score: 84 },
        { name: "Executive access moat", group: "Forward (40%)", score: 88 },
      ],
    },
    milestones: [
      {
        id: "mkbhd-camera-test",
        index: 1,
        title: "20-phone blind camera test",
        question:
          "Will MKBHD release a new blind smartphone camera test comparing at least 20 phones?",
        baseYesCents: 77,
        delta24h: 3,
        closes: "Dec 31, 2026",
        closesIso: "2026-12-31",
        baseVolume: 58900,
        baseTraders: 192,
        verificationSource: "Published MKBHD video & voting portal",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "mkbhd-ceo-interview",
        index: 2,
        title: "A major tech CEO interview",
        question:
          "Will Marques Brownlee release a new interview with the CEO of Apple, Google, Microsoft or Nvidia?",
        baseYesCents: 70,
        delta24h: 2,
        closes: "Nov 27, 2026",
        closesIso: "2026-11-27",
        baseVolume: 78600,
        baseTraders: 234,
        verificationSource: "Published interview on MKBHD or Waveform",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "mkbhd-video-series",
        index: 3,
        title: "New original video series",
        question:
          "Will MKBHD publish at least three episodes of a newly launched original video series?",
        baseYesCents: 55,
        delta24h: 1,
        closes: "Jan 15, 2027",
        closesIso: "2027-01-15",
        baseVolume: 46200,
        baseTraders: 138,
        verificationSource: "Three numbered episodes live on MKBHD channels",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "mkbhd-hardware",
        index: 4,
        title: "A signature hardware product",
        question:
          "Will Marques Brownlee open orders for a new physical technology product sold under his own brand or a named collaboration?",
        baseYesCents: 42,
        delta24h: -1,
        closes: "Dec 18, 2026",
        closesIso: "2026-12-18",
        baseVolume: 63900,
        baseTraders: 171,
        verificationSource: "Public retail order page live",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "mkbhd-studio-5m",
        index: 5,
        title: "The Studio reaches 5M",
        question:
          "Will The Studio YouTube channel reach five million subscribers?",
        baseYesCents: 37,
        delta24h: 0,
        closes: "Jan 31, 2027",
        closesIso: "2027-01-31",
        baseVolume: 39400,
        baseTraders: 119,
        verificationSource: "Public YouTube subscriber count ≥ 5.0M",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "sabrina-carpenter",
    name: "Sabrina Carpenter",
    initials: "SC",
    shortTab: "Sabrina",
    role: "Recording Artist",
    company: "Music",
    category: "Artist",
    bio: "Multi-platinum pop artist and actress commanding global Billboard chart runs, sold-out arena tours, and major cultural collaborations.",
    credentials:
      "Multiple Billboard Hot 100 top singles · Grammy-winning pop era · Global headline touring.",
    facts: [
      { value: "Hot 100", label: "No. 1 chart trajectory" },
      { value: "Global", label: "Arena & stadium demand" },
      { value: "Music+Film", label: "Cross-media IP" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "SBRN",
      spotPrice: 131.5,
      change24hPct: 3.1,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 5.5,
      convictionScore: 90,
      backwardScore: 89,
      forwardScore: 91,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "Streaming & catalog royalties", group: "Backward (60%)", score: 92 },
        { name: "Touring box-office growth", group: "Backward (60%)", score: 90 },
        { name: "Brand partnership capture", group: "Backward (60%)", score: 86 },
        { name: "Stadium tier transition", group: "Forward (40%)", score: 92 },
        { name: "Film & visual crossover", group: "Forward (40%)", score: 88 },
        { name: "Global fanbase momentum", group: "Forward (40%)", score: 93 },
      ],
    },
    milestones: [
      {
        id: "sabrina-lead-single",
        index: 1,
        title: "A new lead single",
        question:
          "Will Sabrina Carpenter release a new lead single that was not available on October 28?",
        baseYesCents: 72,
        delta24h: 5,
        closes: "Nov 20, 2026",
        closesIso: "2026-11-20",
        baseVolume: 163200,
        baseTraders: 364,
        verificationSource: "Official release on Spotify & Apple Music",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "sabrina-artist-duet",
        index: 2,
        title: "A first-time artist duet",
        question:
          "Will Sabrina Carpenter release an official duet with an artist she has not previously released a song with?",
        baseYesCents: 65,
        delta24h: 2,
        closes: "Jan 15, 2027",
        closesIso: "2027-01-15",
        baseVolume: 94200,
        baseTraders: 238,
        verificationSource: "Official credited DSP release",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "sabrina-us-no1",
        index: 3,
        title: "Another US No. 1",
        question:
          "Will a Sabrina Carpenter song reach No. 1 on the Billboard Hot 100 for the first time after October 28?",
        baseYesCents: 60,
        delta24h: 3,
        closes: "Dec 4, 2026",
        closesIso: "2026-12-04",
        baseVolume: 138000,
        baseTraders: 312,
        verificationSource: "Official Billboard Hot 100 weekly chart",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "sabrina-stadium-tour",
        index: 4,
        title: "A new stadium tour",
        question:
          "Will Sabrina Carpenter put tickets on sale for a new headline tour with at least five stadium dates?",
        baseYesCents: 48,
        delta24h: -1,
        closes: "Dec 18, 2026",
        closesIso: "2026-12-18",
        baseVolume: 119000,
        baseTraders: 289,
        verificationSource: "Live public ticket on-sale for 5+ stadiums",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "sabrina-film-role",
        index: 5,
        title: "A new starring film role",
        question:
          "Will a film studio publicly confirm Sabrina Carpenter in a leading role in a new feature film?",
        baseYesCents: 38,
        delta24h: 1,
        closes: "Jan 31, 2027",
        closesIso: "2027-01-31",
        baseVolume: 76600,
        baseTraders: 184,
        verificationSource: "Official studio announcement or Variety/THR report",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
  {
    slug: "raye",
    name: "RAYE",
    initials: "RY",
    shortTab: "RAYE",
    role: "Recording Artist",
    company: "Music",
    category: "Artist",
    bio: "Independent British singer-songwriter and record-breaking BRIT Awards winner blending orchestral soul, R&B, and arena-scale live artistry.",
    credentials:
      "Record 6 BRIT Awards in a single night · Independent master ownership · Global arena & orchestral performances.",
    facts: [
      { value: "6×", label: "BRIT Awards record" },
      { value: "100%", label: "Independent masters" },
      { value: "Global", label: "Arena & orchestral" },
    ],
    spreadCents: 1,
    trajectory: {
      ticker: "RAYE",
      spotPrice: 82.9,
      change24hPct: 2.7,
      authorizedUnits: 10000,
      tebPerUnitPct: 0.0025,
      listedPct: 5.0,
      convictionScore: 86,
      backwardScore: 85,
      forwardScore: 88,
      nextClearing: "Tomorrow · 21:00 UTC",
      signals: [
        { name: "Independent master economics", group: "Backward (60%)", score: 92 },
        { name: "Songwriting catalog royalties", group: "Backward (60%)", score: 88 },
        { name: "Critical & commercial breakout", group: "Backward (60%)", score: 85 },
        { name: "Global arena touring cycle", group: "Forward (40%)", score: 90 },
        { name: "Prestige live & film scoring", group: "Forward (40%)", score: 86 },
        { name: "US + UK cross-chart upside", group: "Forward (40%)", score: 88 },
      ],
    },
    milestones: [
      {
        id: "raye-single",
        index: 1,
        title: "A new original single",
        question:
          "Will RAYE release a new original single that was not available on October 28?",
        baseYesCents: 79,
        delta24h: 4,
        closes: "Nov 20, 2026",
        closesIso: "2026-11-20",
        baseVolume: 108700,
        baseTraders: 279,
        verificationSource: "Official release on Spotify & Apple Music",
        seriesColor: SERIES_COLORS[0],
      },
      {
        id: "raye-arena-tour",
        index: 2,
        title: "New arena tour on sale",
        question:
          "Will RAYE put tickets on sale for a newly announced headline tour with at least five arena dates?",
        baseYesCents: 67,
        delta24h: 3,
        closes: "Dec 18, 2026",
        closesIso: "2026-12-18",
        baseVolume: 76600,
        baseTraders: 198,
        verificationSource: "Live public ticket on-sale for 5+ arenas",
        seriesColor: SERIES_COLORS[1],
      },
      {
        id: "raye-collab",
        index: 3,
        title: "A first-time collaboration",
        question:
          "Will RAYE release a new official song with a featured artist she has not previously released a song with?",
        baseYesCents: 63,
        delta24h: 2,
        closes: "Jan 31, 2027",
        closesIso: "2027-01-31",
        baseVolume: 51600,
        baseTraders: 142,
        verificationSource: "Official credited DSP release",
        seriesColor: SERIES_COLORS[2],
      },
      {
        id: "raye-uk-no1",
        index: 4,
        title: "A first-time UK No. 1",
        question:
          "Will a RAYE song reach No. 1 on the Official UK Singles Chart for the first time after October 28?",
        baseYesCents: 59,
        delta24h: 1,
        closes: "Dec 4, 2026",
        closesIso: "2026-12-04",
        baseVolume: 89800,
        baseTraders: 224,
        verificationSource: "Official Charts Company UK Singles Chart",
        seriesColor: SERIES_COLORS[3],
      },
      {
        id: "raye-orchestral",
        index: 5,
        title: "An orchestral live release",
        question:
          "Will RAYE release a new official live album or full concert film recorded with an orchestra?",
        baseYesCents: 53,
        delta24h: 1,
        closes: "Jan 15, 2027",
        closesIso: "2027-01-15",
        baseVolume: 62800,
        baseTraders: 164,
        verificationSource: "Official streaming release or film premiere",
        seriesColor: SERIES_COLORS[4],
      },
    ],
  },
]

export function getPersonBySlug(slug: string): PersonProfile | undefined {
  return PERSON_PROFILES.find((p) => p.slug === slug)
}

export function formatCurrency(amount: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatCompactVolume(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
  return `$${Math.round(amount)}`
}

export function formatMultiplier(cents: number): string {
  const safe = Math.max(1, Math.min(99, cents))
  return `${(100 / safe).toFixed(2)}×`
}

/** Deterministic seeded PRNG so charts stay crisp and consistent across hydration */
function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function getTimeframeLabels(timeframe: TimeframeKey): string[] {
  switch (timeframe) {
    case "1D":
      return [
        "00:00",
        "02:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "Now",
      ]
    case "1W":
      return [
        "Nov 19",
        "Nov 19 PM",
        "Nov 20",
        "Nov 20 PM",
        "Nov 21",
        "Nov 21 PM",
        "Nov 22",
        "Nov 22 PM",
        "Nov 23",
        "Nov 23 PM",
        "Nov 24",
        "Nov 24 PM",
        "Now",
      ]
    case "1M":
      return [
        "Oct 26",
        "Oct 29",
        "Nov 1",
        "Nov 3",
        "Nov 6",
        "Nov 8",
        "Nov 11",
        "Nov 13",
        "Nov 16",
        "Nov 18",
        "Nov 21",
        "Nov 23",
        "Now",
      ]
    case "All":
      return [
        "Aug 19",
        "Aug 28",
        "Sep 5",
        "Sep 14",
        "Sep 22",
        "Oct 1",
        "Oct 9",
        "Oct 18",
        "Oct 26",
        "Nov 3",
        "Nov 11",
        "Nov 19",
        "Now",
      ]
  }
}

export function generateProbabilitySeries(
  seedKey: string,
  currentCents: number,
  delta24h: number,
  timeframe: TimeframeKey
): number[] {
  const count = 13
  let seed = hashString(`${seedKey}:${timeframe}`)
  const nextRand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0xffffffff
  }

  const spread =
    timeframe === "1D"
      ? 3.5
      : timeframe === "1W"
        ? 6.5
        : timeframe === "1M"
          ? 11
          : 16

  const startBias =
    timeframe === "1D" ? delta24h : delta24h * (timeframe === "All" ? 2.4 : 1.5)
  const start = Math.max(
    8,
    Math.min(92, Math.round(currentCents - startBias))
  )

  const points: number[] = []
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      points.push(start)
    } else if (i === count - 1) {
      points.push(currentCents)
    } else {
      const progress = i / (count - 1)
      const baseline = start + (currentCents - start) * progress
      const wave = (nextRand() - 0.5) * spread
      points.push(Math.max(5, Math.min(95, Math.round(baseline + wave))))
    }
  }
  return points
}

export function generateCandleSeries(
  seedKey: string,
  currentCents: number,
  delta24h: number,
  timeframe: TimeframeKey
): CandlePoint[] {
  const labels = getTimeframeLabels(timeframe)
  const closes = generateProbabilitySeries(
    seedKey,
    currentCents,
    delta24h,
    timeframe
  )
  let seed = hashString(`candles:${seedKey}:${timeframe}`)
  const nextRand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0xffffffff
  }

  return closes.map((close, idx) => {
    const open = idx === 0 ? Math.max(5, Math.min(95, close - 1)) : closes[idx - 1]!
    const wickUp = 1 + Math.round(nextRand() * 3)
    const wickDown = 1 + Math.round(nextRand() * 3)
    const high = Math.min(97, Math.max(open, close) + wickUp)
    const low = Math.max(3, Math.min(open, close) - wickDown)
    return {
      label: labels[idx] ?? `${idx}`,
      open,
      high,
      low,
      close,
    }
  })
}

const ANCHOR_UNIX_SEC = 1795564800 // 2026-11-25 00:00:00 UTC (deterministic across SSR & client)

function getSeriesConfig(timeframe: TimeframeKey): {
  count: number
  stepSec: number
  volatility: number
} {
  switch (timeframe) {
    case "1D":
      return { count: 48, stepSec: 1800, volatility: 0.9 } // 30-min intervals
    case "1W":
      return { count: 56, stepSec: 10800, volatility: 1.5 } // 3-hr intervals
    case "1M":
      return { count: 60, stepSec: 43200, volatility: 2.2 } // 12-hr intervals
    case "All":
      return { count: 96, stepSec: 86400, volatility: 2.9 } // daily bars
  }
}

/**
 * Generates high-density realistic mean-reverting + trending probability points
 * for TradingView Lightweight Charts (LineSeries / AreaSeries).
 */
export function generateTradingViewProbabilitySeries(
  seedKey: string,
  currentCents: number,
  delta24h: number,
  timeframe: TimeframeKey
): TvLineDatum[] {
  const { count, stepSec, volatility } = getSeriesConfig(timeframe)
  let seed = hashString(`tv-prob:${seedKey}:${timeframe}`)
  const nextRand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0xffffffff
  }

  const startOffset =
    timeframe === "1D"
      ? delta24h
      : timeframe === "1W"
        ? delta24h * 1.6
        : timeframe === "1M"
          ? delta24h * 2.4
          : delta24h * 3.1
  const startVal = Math.max(
    8,
    Math.min(92, Number((currentCents - startOffset).toFixed(1)))
  )

  const raw: number[] = []
  let walk = 0
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const drift = startVal + (currentCents - startVal) * t
    // Brown-bridge damping so the walk converges cleanly onto the live price
    const damping = Math.sin(Math.PI * t)
    walk = walk * 0.72 + (nextRand() - 0.5) * volatility * 2.4
    const val =
      i === count - 1
        ? currentCents
        : Math.max(4, Math.min(96, Number((drift + walk * damping).toFixed(1))))
    raw.push(val)
  }

  const startTime = ANCHOR_UNIX_SEC - (count - 1) * stepSec
  return raw.map((value, i) => ({
    time: startTime + i * stepSec,
    value,
  }))
}

/**
 * Generates realistic OHLC candlestick bars for TradingView CandlestickSeries.
 */
export function generateTradingViewCandles(
  seedKey: string,
  currentCents: number,
  delta24h: number,
  timeframe: TimeframeKey
): TvCandleDatum[] {
  const line = generateTradingViewProbabilitySeries(
    seedKey,
    currentCents,
    delta24h,
    timeframe
  )
  let seed = hashString(`tv-ohlc:${seedKey}:${timeframe}`)
  const nextRand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0xffffffff
  }

  return line.map((pt, i) => {
    const prevClose = i === 0 ? Math.max(4, pt.value - 0.8) : line[i - 1]!.value
    const open = Number(prevClose.toFixed(1))
    const close = Number(pt.value.toFixed(1))
    const wickScale = timeframe === "1D" ? 1.4 : timeframe === "1W" ? 2.1 : 3.0
    const high = Math.min(
      98,
      Number((Math.max(open, close) + 0.4 + nextRand() * wickScale).toFixed(1))
    )
    const low = Math.max(
      2,
      Number((Math.min(open, close) - 0.4 - nextRand() * wickScale).toFixed(1))
    )
    return {
      time: pt.time,
      open,
      high,
      low,
      close,
    }
  })
}

/**
 * Generates realistic Trajectory Unit USD price history for TradingView AreaSeries.
 */
export function generateTrajectoryPriceSeries(
  slug: string,
  spotPrice: number,
  change24hPct: number,
  timeframe: TimeframeKey
): TvLineDatum[] {
  const { count, stepSec } = getSeriesConfig(timeframe)
  let seed = hashString(`tv-traj:${slug}:${timeframe}`)
  const nextRand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 0xffffffff
  }

  const totalPctMove =
    timeframe === "1D"
      ? change24hPct / 100
      : timeframe === "1W"
        ? (change24hPct * 2.2) / 100
        : timeframe === "1M"
          ? (change24hPct * 4.5) / 100
          : (change24hPct * 8.2) / 100
  const startPrice = Math.max(5, spotPrice / (1 + totalPctMove))
  const vol = spotPrice * (timeframe === "1D" ? 0.008 : 0.022)

  let walk = 0
  const startTime = ANCHOR_UNIX_SEC - (count - 1) * stepSec
  const result: TvLineDatum[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const trend = startPrice + (spotPrice - startPrice) * t
    const damping = Math.sin(Math.PI * t)
    walk = walk * 0.76 + (nextRand() - 0.49) * vol * 2.1
    const val =
      i === count - 1
        ? spotPrice
        : Math.max(5, Number((trend + walk * damping).toFixed(2)))
    result.push({
      time: startTime + i * stepSec,
      value: val,
    })
  }
  return result
}
