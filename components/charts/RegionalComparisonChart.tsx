"use client"

import * as React from "react"
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RegionalComparisonChartProps {
    data: {
        region: string
        value: number
    }[]
    title?: string
    description?: string
    highlightedRegion?: string
    className?: string
    height?: number
    hideHeader?: boolean
}

export function RegionalComparisonChart({
    data,
    title = "Perbandingan Per Daerah",
    description = "Sebaran investasi di semua wilayah",
    highlightedRegion,
    className,
    height = 600,
    hideHeader = false
}: RegionalComparisonChartProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(val)

    // Sort data descending
    const sortedData = [...data].sort((a, b) => b.value - a.value)

    // Calculate max value for the background track
    const maxValInSet = Math.max(...sortedData.map(d => d.value)) || 0
    const maxValue = maxValInSet * 1.1 // 10% buffer
    const chartData = sortedData.map(d => ({ ...d, max: maxValue }))

    const formatRegionName = (name: string) => {
        return name
            .replace("Kabupaten ", "Kab. ")
            .replace("Kota ", "Kota ")
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Find the correct payload item for 'value'
            const dataItem = payload.find((p: any) => p.dataKey === "value")
            if (!dataItem) return null

            const isHighlighted = highlightedRegion && label === highlightedRegion

            // Use explicit inline styles for background and colors to avoid 'lab' parsing errors
            return (
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 50 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: isHighlighted ? '#c2410c' : '#1e293b' }}>{label}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: isHighlighted ? '#f97316' : '#3b82f6' }} />
                        <p style={{ color: '#475569', fontWeight: 500, fontSize: '14px' }}>
                            Investasi: <span style={{ fontWeight: 'bold', color: isHighlighted ? '#ea580c' : '#2563eb' }}>{formatCurrency(dataItem.value)}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <Card className={`col-span-1 md:col-span-2 ${className || ''}`} style={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
            {!hideHeader && (
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-slate-800">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">{description}</CardDescription>
                </CardHeader>
            )}
            <CardContent className={hideHeader ? "p-0" : ""}>
                {/* Fixed height container controlled by prop */}
                <div style={{ height: `${height}px` }} className="w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ bottom: 40, top: 30, right: 20, left: 10 }}
                            barGap={2}
                        >
                            <defs>
                                <linearGradient id="barGradientVertical" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                                <linearGradient id="barGradientHighlight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#fdba74" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                            {/* X Axis: Region Names (Rotated 90deg Custom Tick) */}
                            <XAxis
                                dataKey="region"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                height={200}
                                tick={({ x, y, payload }) => {
                                    const isHighlighted = highlightedRegion && payload.value === highlightedRegion
                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            <text
                                                x={0}
                                                y={0}
                                                dy={4} // Center vertically relative to tick line
                                                dx={15} // Start 15px below the axis line for cleaner gap
                                                textAnchor="start"
                                                fill={isHighlighted ? "#f97316" : "#64748b"}
                                                width={10}
                                                transform="rotate(90)"
                                                style={{ fontSize: '10px', fontWeight: isHighlighted ? 700 : 500 }}
                                            >
                                                {formatRegionName(payload.value)}
                                            </text>
                                        </g>
                                    )
                                }}
                            />

                            {/* Y Axis 0: Value (Hidden/Subtle) */}
                            <YAxis
                                tickFormatter={formatCurrency}
                                stroke="#94a3b8"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={50}
                            />

                            {/* Y Axis 1: Background Scale (Synced) - Hidden */}
                            <YAxis
                                yAxisId={1}
                                hide
                                domain={[0, maxValue]}
                            />

                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.5 }} />

                            {/* Background Track Bar */}
                            <Bar
                                dataKey="max"
                                fill="#f1f5f9"
                                radius={[8, 8, 8, 8]}
                                barSize={12} // Thinner bars to fit 33 items
                                yAxisId={1}
                                animationDuration={0}
                                isAnimationActive={false}
                            />

                            {/* Foreground Value Bar */}
                            <Bar
                                dataKey="value"
                                radius={[8, 8, 8, 8]}
                                barSize={12}
                                background={false}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={highlightedRegion && entry.region === highlightedRegion ? "url(#barGradientHighlight)" : "url(#barGradientVertical)"}
                                    />
                                ))}
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
