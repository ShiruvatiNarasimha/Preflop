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
  PolarRadiusAxis,
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

function toShortRadarLabel(name: string): string {
  const cleaned = name
    .replace(/\band\b/gi, "")
    .replace(/&/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const words = cleaned.split(" ").filter(Boolean)
  if (words.length <= 1) return cleaned.slice(0, 12)
  const two = `${words[0]} ${words[1]}`
  if (two.length <= 13) return two
  return words[0]!.slice(0, 12)
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
        scaleMargins: { top: 0.17, bottom: 0.14 },
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
        scaleMargins: { top: 0.16, bottom: 0.14 },
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
 * Tight auto-scaled Y domain so real price trajectories read clearly.
 */
export function MiniSparklineChart({
  data,
  positive = true,
}: {
  data: { i: number; v: number }[]
  positive?: boolean
}) {
  const gradId = `spark-${React.useId().replace(/:/g, "")}`
  const stroke = positive ? "#FF4665" : "#71717A"
  const values = data.map((d) => d.v)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = Math.max(0.4, (max - min) * 0.18)

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
            <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <YAxis hide domain={[min - pad, max + pad]} />
        <Area
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={1.7}
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
    subject: toShortRadarLabel(s.name),
    fullName: s.name,
    score: s.score,
  }))

  return (
    <ChartContainer
      config={convictionChartConfig}
      initialDimension={{ width: 280, height: 240 }}
      className="mx-auto h-[245px] w-full max-w-[300px] aspect-auto"
    >
      <RadarChart
        data={data}
        cx="50%"
        cy="50%"
        outerRadius="56%"
        margin={{ top: 18, right: 34, bottom: 18, left: 34 }}
      >
        <PolarGrid stroke="rgba(0,0,0,0.09)" />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#52525B", fontSize: 10.5, fontWeight: 500 }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Radar
          dataKey="score"
          stroke="#FF4665"
          strokeWidth={2.2}
          fill="#FF4665"
          fillOpacity={0.22}
          dot={{
            r: 3.5,
            fill: "#FF4665",
            stroke: "#FFFFFF",
            strokeWidth: 1.5,
          }}
          isAnimationActive={false}
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
  const gradId = `equity-${React.useId().replace(/:/g, "")}`
  const vals = data.map((d) => d.equity)
  const minData = Math.min(...vals, 100000)
  const maxData = Math.max(...vals, 100000)
  const spread = Math.max(80, (maxData - minData) * 0.45)
  const minVal = Math.floor(minData - spread)
  const maxVal = Math.ceil(maxData + spread)

  return (
    <ChartContainer
      config={equityChartConfig}
      initialDimension={{ width: 560, height: 225 }}
      className="h-[225px] w-full aspect-auto"
    >
      <AreaChart
        data={data}
        margin={{ top: 12, right: 14, left: 6, bottom: 2 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF4665" stopOpacity={0.26} />
            <stop offset="95%" stopColor="#FE7AC6" stopOpacity={0.02} />
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
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(2)}k`}
        />
        <ReferenceLine
          y={100000}
          stroke="rgba(0,0,0,0.22)"
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
          strokeWidth={2.4}
          fill={`url(#${gradId})`}
          dot={{
            r: 3,
            fill: "#FF4665",
            stroke: "#FFFFFF",
            strokeWidth: 1.5,
          }}
          activeDot={{
            r: 5,
            fill: "#FF4665",
            stroke: "#FFFFFF",
            strokeWidth: 2,
          }}
          isAnimationActive={false}
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
    {
      key: "cash",
      name: "Cash Available",
      value: Math.max(0, cash),
      fill: "#E4E4E7",
    },
    {
      key: "milestones",
      name: "Milestones",
      value: Math.max(0, milestones),
      fill: "#FF4665",
    },
    {
      key: "trajectory",
      name: "Trajectory Units",
      value: Math.max(0, trajectory),
      fill: "#7D2BC4",
    },
  ].filter((d) => d.value > 0)

  return (
    <ChartContainer
      config={allocationChartConfig}
      initialDimension={{ width: 185, height: 185 }}
      className="mx-auto h-[185px] w-[185px] aspect-square"
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
          innerRadius={54}
          outerRadius={78}
          paddingAngle={2}
          strokeWidth={0}
          isAnimationActive={false}
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
 * Recharts Multi-Year Covenant Cashflow & Payback Projection Chart for /raise
 * Dual Y-Axis: Left = Projected Annual TEB (bars), Right = Annual Covenant Payout (coral area)
 */
const covenantChartConfig = {
  projectedTeb: {
    label: "Projected Annual TEB",
    color: "#DFDFE6",
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
  const gradId = `cov-${React.useId().replace(/:/g, "")}`
  const baseAnnual = Math.max(
    140_000,
    Math.round(
      (raiseAmount / Math.max(0.08, (incomeSharePct / 100) * termYears)) * 0.72
    )
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
      initialDimension={{ width: 460, height: 215 }}
      className="h-[215px] w-full aspect-auto"
    >
      <ComposedChart
        data={data}
        margin={{ top: 12, right: 6, left: 2, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF4665" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#FE7AC6" stopOpacity={0.03} />
          </linearGradient>
        </defs>
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
          yAxisId="teb"
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fontSize: 10.5, fill: "#71717A" }}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <YAxis
          yAxisId="payout"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={44}
          tick={{ fontSize: 10.5, fill: "#FF4665" }}
          tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex items-center justify-between gap-4 w-full">
                  <span className="text-[#71717A]">
                    {name === "projectedTeb"
                      ? "Est. TEB"
                      : "Annual Payout"}
                  </span>
                  <span className="font-mono font-medium text-black tabular-nums">
                    ${Number(value).toLocaleString("en-US")}
                  </span>
                </div>
              )}
            />
          }
        />
        <Bar
          yAxisId="teb"
          dataKey="projectedTeb"
          fill="#E4E4EA"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
          isAnimationActive={false}
        />
        <Area
          yAxisId="payout"
          type="monotone"
          dataKey="covenantShare"
          stroke="#FF4665"
          strokeWidth={2.4}
          fill={`url(#${gradId})`}
          dot={{
            r: 3.5,
            fill: "#FF4665",
            stroke: "#FFFFFF",
            strokeWidth: 1.5,
          }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ChartContainer>
  )
}
