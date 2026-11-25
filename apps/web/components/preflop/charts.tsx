"use client"

import * as React from "react"
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts"
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import type {
  ConvictionSignal,
  TvCandleDatum,
  TvLineDatum,
} from "./market-catalog"

export interface CrosshairReadout {
  timeLabel: string
  value?: number
  ohlc?: { open: number; high: number; low: number; close: number }
}

function formatUnixTime(t: Time): string {
  if (typeof t === "number") {
    const d = new Date(t * 1000)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    })
  }
  return String(t)
}

interface CompareSeriesItem {
  id: string
  title: string
  color: string
  isActive: boolean
  data: TvLineDatum[]
}

/**
 * TradingView Lightweight Charts v5 Canvas for Milestone Markets
 * Supports Compare All 5 (LineSeries), Single Price (AreaSeries), and OHLC Candles (CandlestickSeries)
 */
export function MilestoneTradingChart({
  mode,
  activeSeries,
  candles,
  compareSeries,
  onCrosshairMove,
}: {
  mode: "compare" | "price" | "candles"
  activeSeries: TvLineDatum[]
  candles: TvCandleDatum[]
  compareSeries: CompareSeriesItem[]
  onCrosshairMove?: (readout: CrosshairReadout | null) => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const onMoveRef = React.useRef(onCrosshairMove)
  onMoveRef.current = onCrosshairMove

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart: IChartApi = createChart(container, {
      width: container.clientWidth || 640,
      height: 310,
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#71717A",
        fontFamily: '"Aspekta", var(--font-geist-sans), Arial, sans-serif',
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(0, 0, 0, 0.04)", style: LineStyle.Dotted },
        horzLines: { color: "rgba(0, 0, 0, 0.06)", style: LineStyle.Dashed },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(255, 70, 101, 0.45)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#09090B",
        },
        horzLine: {
          color: "rgba(255, 70, 101, 0.35)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#FF4665",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(0, 0, 0, 0.07)",
        scaleMargins: { top: 0.12, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "rgba(0, 0, 0, 0.07)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 3,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    })

    if (mode === "price") {
      const area = chart.addSeries(AreaSeries, {
        lineColor: "#FF4665",
        lineWidth: 2,
        topColor: "rgba(255, 70, 101, 0.22)",
        bottomColor: "rgba(254, 122, 198, 0.0)",
        crosshairMarkerRadius: 5,
        crosshairMarkerBorderColor: "#FFFFFF",
        crosshairMarkerBorderWidth: 2,
        crosshairMarkerBackgroundColor: "#FF4665",
        priceFormat: {
          type: "custom",
          minMove: 0.5,
          formatter: (price: number) => `${Math.round(price)}¢`,
        },
      })
      area.setData(
        activeSeries.map((pt) => ({
          time: pt.time as UTCTimestamp,
          value: pt.value,
        }))
      )

      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) {
          onMoveRef.current?.(null)
          return
        }
        const datum = param.seriesData.get(area) as
          | { value?: number }
          | undefined
        if (datum && typeof datum.value === "number") {
          onMoveRef.current?.({
            timeLabel: formatUnixTime(param.time),
            value: Math.round(datum.value),
          })
        }
      })
    } else if (mode === "candles") {
      const candle = chart.addSeries(CandlestickSeries, {
        upColor: "#059669",
        downColor: "#FF4665",
        borderUpColor: "#059669",
        borderDownColor: "#FF4665",
        wickUpColor: "#059669",
        wickDownColor: "#FF4665",
        priceFormat: {
          type: "custom",
          minMove: 0.5,
          formatter: (price: number) => `${Math.round(price)}¢`,
        },
      })
      candle.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }))
      )

      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) {
          onMoveRef.current?.(null)
          return
        }
        const datum = param.seriesData.get(candle) as
          | { open?: number; high?: number; low?: number; close?: number }
          | undefined
        if (
          datum &&
          typeof datum.open === "number" &&
          typeof datum.high === "number" &&
          typeof datum.low === "number" &&
          typeof datum.close === "number"
        ) {
          onMoveRef.current?.({
            timeLabel: formatUnixTime(param.time),
            value: Math.round(datum.close),
            ohlc: {
              open: Math.round(datum.open),
              high: Math.round(datum.high),
              low: Math.round(datum.low),
              close: Math.round(datum.close),
            },
          })
        }
      })
    } else {
      let activeLine: ReturnType<IChartApi["addSeries"]> | null = null
      for (const s of compareSeries) {
        const line = chart.addSeries(LineSeries, {
          color: s.color,
          lineWidth: s.isActive ? 3 : 2,
          priceLineVisible: s.isActive,
          lastValueVisible: s.isActive,
          crosshairMarkerVisible: s.isActive,
          crosshairMarkerRadius: 4,
          priceFormat: {
            type: "custom",
            minMove: 0.5,
            formatter: (price: number) => `${Math.round(price)}¢`,
          },
        })
        line.setData(
          s.data.map((pt) => ({
            time: pt.time as UTCTimestamp,
            value: pt.value,
          }))
        )
        if (s.isActive) {
          activeLine = line
        }
      }

      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point || !activeLine) {
          onMoveRef.current?.(null)
          return
        }
        const datum = param.seriesData.get(activeLine) as
          | { value?: number }
          | undefined
        if (datum && typeof datum.value === "number") {
          onMoveRef.current?.({
            timeLabel: formatUnixTime(param.time),
            value: Math.round(datum.value),
          })
        }
      })
    }

    chart.timeScale().fitContent()

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        chart.applyOptions({ width: Math.floor(entry.contentRect.width) })
      }
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.remove()
    }
  }, [mode, activeSeries, candles, compareSeries])

  return (
    <div
      ref={containerRef}
      className="w-full h-[310px] relative rounded-[12px] overflow-hidden"
    />
  )
}

/**
 * TradingView Lightweight Charts v5 Canvas for Perpetual Trajectory Unit ($USD)
 */
export function TrajectoryTradingChart({
  data,
  onCrosshairMove,
}: {
  data: TvLineDatum[]
  onCrosshairMove?: (readout: CrosshairReadout | null) => void
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const onMoveRef = React.useRef(onCrosshairMove)
  onMoveRef.current = onCrosshairMove

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart = createChart(container, {
      width: container.clientWidth || 640,
      height: 270,
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#71717A",
        fontFamily: '"Aspekta", var(--font-geist-sans), Arial, sans-serif',
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(0, 0, 0, 0.04)", style: LineStyle.Dotted },
        horzLines: { color: "rgba(0, 0, 0, 0.06)", style: LineStyle.Dashed },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(255, 70, 101, 0.45)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#09090B",
        },
        horzLine: {
          color: "rgba(255, 70, 101, 0.35)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#FF4665",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(0, 0, 0, 0.07)",
        scaleMargins: { top: 0.14, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "rgba(0, 0, 0, 0.07)",
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#FF4665",
      lineWidth: 2,
      topColor: "rgba(255, 70, 101, 0.20)",
      bottomColor: "rgba(254, 122, 198, 0.0)",
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: "#FFFFFF",
      crosshairMarkerBorderWidth: 2,
      crosshairMarkerBackgroundColor: "#FF4665",
      priceFormat: {
        type: "custom",
        minMove: 0.01,
        formatter: (price: number) => `$${price.toFixed(2)}`,
      },
    })

    series.setData(
      data.map((pt) => ({
        time: pt.time as UTCTimestamp,
        value: pt.value,
      }))
    )

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) {
        onMoveRef.current?.(null)
        return
      }
      const datum = param.seriesData.get(series) as
        | { value?: number }
        | undefined
      if (datum && typeof datum.value === "number") {
        onMoveRef.current?.({
          timeLabel: formatUnixTime(param.time),
          value: datum.value,
        })
      }
    })

    chart.timeScale().fitContent()

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        chart.applyOptions({ width: Math.floor(entry.contentRect.width) })
      }
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.remove()
    }
  }, [data])

  return (
    <div
      ref={containerRef}
      className="w-full h-[270px] relative rounded-[12px] overflow-hidden"
    />
  )
}

/**
 * Recharts Mini Sparkline for /markets person cards
 */
export function MiniSparklineChart({
  data,
  positive = true,
}: {
  data: { i: number; v: number }[]
  positive?: boolean
}) {
  const gradId = React.useId()
  const stroke = positive ? "#FF4665" : "#71717A"

  return (
    <div className="h-[32px] w-[78px] shrink-0 overflow-hidden">
      <AreaChart
        width={78}
        height={32}
        data={data}
        margin={{ top: 3, right: 2, left: 2, bottom: 2 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.26} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={1.6}
          fill={`url(#${gradId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  )
}

/**
 * Recharts Conviction Engine Radar Chart wrapped in shadcn ChartContainer
 */
const convictionChartConfig = {
  score: {
    label: "Conviction Signal",
    color: "#FF4665",
  },
} satisfies ChartConfig

export function ConvictionRadarChart({
  signals,
}: {
  signals: ConvictionSignal[]
}) {
  const data = signals.map((s) => ({
    subject: s.name.split(" ").slice(0, 2).join(" "),
    fullName: s.name,
    score: s.score,
  }))

  return (
    <ChartContainer
      config={convictionChartConfig}
      className="mx-auto aspect-square max-h-[240px] w-full"
    >
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="rgba(0,0,0,0.08)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#52525B", fontSize: 10.5 }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Radar
          dataKey="score"
          stroke="#FF4665"
          strokeWidth={2}
          fill="#FF4665"
          fillOpacity={0.2}
        />
      </RadarChart>
    </ChartContainer>
  )
}

/**
 * Recharts Portfolio Account Equity Area Chart wrapped in shadcn ChartContainer
 */
const equityChartConfig = {
  equity: {
    label: "Total Equity",
    color: "#FF4665",
  },
} satisfies ChartConfig

export function PortfolioEquityChart({
  data,
}: {
  data: { label: string; equity: number }[]
}) {
  const gradId = React.useId()
  const vals = data.map((d) => d.equity)
  const minVal = Math.floor(Math.min(...vals, 99800) - 120)
  const maxVal = Math.ceil(Math.max(...vals, 100200) + 120)

  return (
    <ChartContainer
      config={equityChartConfig}
      className="h-[220px] w-full aspect-auto"
    >
      <AreaChart
        data={data}
        margin={{ top: 10, right: 12, left: 6, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF4665" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#FE7AC6" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="rgba(0,0,0,0.06)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11, fill: "#71717A" }}
        />
        <YAxis
          domain={[minVal, maxVal]}
          tickLine={false}
          axisLine={false}
          width={64}
          tick={{ fontSize: 11, fill: "#71717A" }}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
        />
        <ReferenceLine
          y={100000}
          stroke="rgba(0,0,0,0.18)"
          strokeDasharray="4 4"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) => (
                <span className="font-mono font-medium text-black tabular-nums">
                  $
                  {Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="#FF4665"
          strokeWidth={2.2}
          fill={`url(#${gradId})`}
        />
      </AreaChart>
    </ChartContainer>
  )
}

/**
 * Recharts Portfolio Allocation Donut Chart wrapped in shadcn ChartContainer
 */
const allocationChartConfig = {
  cash: { label: "Cash Available", color: "#E4E4E7" },
  milestones: { label: "Milestone Contracts", color: "#FF4665" },
  trajectory: { label: "Trajectory Units", color: "#7D2BC4" },
} satisfies ChartConfig

export function PortfolioAllocationChart({
  cash,
  milestones,
  trajectory,
}: {
  cash: number
  milestones: number
  trajectory: number
}) {
  const data = [
    { key: "cash", name: "Cash Available", value: Math.max(0, cash), fill: "#E4E4E7" },
    { key: "milestones", name: "Milestones", value: Math.max(0, milestones), fill: "#FF4665" },
    { key: "trajectory", name: "Trajectory Units", value: Math.max(0, trajectory), fill: "#7D2BC4" },
  ].filter((d) => d.value > 0)

  return (
    <ChartContainer
      config={allocationChartConfig}
      className="mx-auto aspect-square max-h-[195px] w-full"
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => (
                <span className="font-mono font-medium text-black tabular-nums">
                  $
                  {Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            />
          }
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={56}
          outerRadius={80}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

/**
 * Recharts 7-Year Covenant Cashflow & Payback Projection Chart for /raise
 */
const covenantChartConfig = {
  projectedTeb: {
    label: "Projected Annual TEB",
    color: "#F4F4F5",
  },
  covenantShare: {
    label: "Annual Covenant Payout",
    color: "#FF4665",
  },
} satisfies ChartConfig

export function CovenantProjectionChart({
  raiseAmount,
  incomeSharePct,
  termYears,
}: {
  raiseAmount: number
  incomeSharePct: number
  termYears: number
}) {
  const baseAnnual = Math.max(
    140_000,
    Math.round(raiseAmount / Math.max(0.08, (incomeSharePct / 100) * termYears) * 0.72)
  )

  const data = Array.from({ length: termYears }, (_, i) => {
    const year = i + 1
    const growth = Math.pow(1.16, i)
    const teb = Math.round(baseAnnual * growth)
    const payout = Math.round(teb * (incomeSharePct / 100))
    return {
      year: `Yr ${year}`,
      projectedTeb: teb,
      covenantShare: payout,
    }
  })

  return (
    <ChartContainer
      config={covenantChartConfig}
      className="h-[205px] w-full aspect-auto"
    >
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 8, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="rgba(0,0,0,0.06)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "#71717A" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={52}
          tick={{ fontSize: 11, fill: "#71717A" }}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono font-medium text-black tabular-nums">
                  ${Number(value).toLocaleString("en-US")}
                </span>
              )}
            />
          }
        />
        <Bar
          dataKey="projectedTeb"
          fill="#EFEFF2"
          radius={[6, 6, 0, 0]}
          maxBarSize={32}
        />
        <Area
          type="monotone"
          dataKey="covenantShare"
          stroke="#FF4665"
          strokeWidth={2.2}
          fill="#FF4665"
          fillOpacity={0.18}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
