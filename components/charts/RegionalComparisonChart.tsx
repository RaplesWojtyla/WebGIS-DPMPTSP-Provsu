"use client"

import * as React from "react"
import { Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RegionalComparisonChartProps {
    data: {
        region: string
        value: number
    }[]
    title?: string
    description?: string
}

export function RegionalComparisonChart({ data, title = "Perbandingan Per Daerah", description = "Sebaran investasi di semua wilayah" }: RegionalComparisonChartProps) {
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

            return (
                <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-100 shadow-xl rounded-2xl z-50">
                    <p className="font-bold text-slate-800 text-sm mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-slate-600 font-medium text-sm">
                            Investasi: <span className="text-blue-600 font-bold">{formatCurrency(dataItem.value)}</span>
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="col-span-1 md:col-span-2 shadow-lg border-slate-100 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    {title}
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Fixed height container, no scroll */}
                <div className="h-[600px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ bottom: 10, top: 30, right: 20, left: 10 }}
                            barGap={2}
                        >
                            <defs>
                                <linearGradient id="barGradientVertical" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                            {/* X Axis: Region Names (Rotated 90deg Custom Tick) */}
                            <XAxis
                                dataKey="region"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                height={160}
                                tick={({ x, y, payload }) => (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={0}
                                            y={0}
                                            dy={4} // Center vertically relative to tick line
                                            dx={15} // Start 15px below the axis line for cleaner gap
                                            textAnchor="start"
                                            fill="#64748b"
                                            transform="rotate(90)"
                                            style={{ fontSize: '10px', fontWeight: 500 }}
                                        >
                                            {formatRegionName(payload.value)}
                                        </text>
                                    </g>
                                )}
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
                                fill="url(#barGradientVertical)"
                                radius={[8, 8, 8, 8]}
                                barSize={12}
                                background={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
