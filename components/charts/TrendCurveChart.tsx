"use client"

import * as React from "react"
import { ComposedChart, Line, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendCurveChartProps {
    data: {
        year: number | string
        value: number,
        label?: string
    }[]
    title?: string
    description?: string
    dataKey?: string
    className?: string
    height?: number
    hideHeader?: boolean
}

export function TrendCurveChart({
    data,
    title = "Kurva Pertumbuhan",
    description = "Tren pertumbuhan investasi",
    dataKey = "value",
    className,
    height = 300,
    hideHeader = false
}: TrendCurveChartProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(val)

    return (
        <Card className={`col-span-1 ${className || ''}`} style={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
            {!hideHeader && (
                <CardHeader>
                    <CardTitle style={{ color: '#1e293b' }}>{title}</CardTitle>
                    <CardDescription style={{ color: '#64748b' }}>{description}</CardDescription>
                </CardHeader>
            )}
            <CardContent className={hideHeader ? "p-0" : "pl-2"}>
                <div style={{ height: `${height}px` }} className="w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="year"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip
                                formatter={(value: number | undefined) => [new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value ?? 0), "Investasi"]}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderColor: '#e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    color: '#1e293b'
                                }}
                                itemStyle={{ color: '#1e293b' }}
                                labelStyle={{ color: '#0f172a', fontWeight: '600' }}
                            />
                            {/* Explicit HEX colors for fills to avoid any variable lookup */}
                            <Bar dataKey={dataKey} barSize={40} fill="#87CEEB" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey={dataKey} stroke="#FF0000" strokeWidth={2} dot={{ r: 4, fill: "#FF0000" }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
