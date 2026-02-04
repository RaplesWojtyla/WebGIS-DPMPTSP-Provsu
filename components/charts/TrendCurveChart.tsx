
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
}

export function TrendCurveChart({ data, title = "Kurva Pertumbuhan", description = "Tren pertumbuhan investasi", dataKey = "value" }: TrendCurveChartProps) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(val)

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                            labelClassName="text-slate-900 font-semibold"
                        />
                        <Bar dataKey={dataKey} barSize={40} fill="#87CEEB" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey={dataKey} stroke="#FF0000" strokeWidth={2} dot={{ r: 4, fill: "#FF0000" }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
