"use client"

import * as React from "react"
import Link from "next/link"
import { InvestmentRecord, calculateLQ, calculateSSA, calculateKlassen } from "@/lib/lq-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Layers } from "lucide-react"

interface SectorDashboardProps {
    records: InvestmentRecord[]
}

export function SectorDashboard({ records }: SectorDashboardProps) {
    const years = React.useMemo(() => Array.from(new Set(records.map(r => r.year))).sort(), [records])
    const startYear = years[0]
    const endYear = years[years.length - 1]

    const sectorMetrics = React.useMemo(() => {
        if (years.length < 1) return []

        // Get unique sectors
        const sectors = Array.from(new Set(records.map(r => r.sector)))

        // Calculate global results for standard metrics
        const lqResults = calculateLQ(records)
        const ssaResults = years.length >= 2 ? calculateSSA(records, startYear, endYear) : []
        const klassenResults = years.length >= 2 ? calculateKlassen(records, startYear, endYear) : []

        return sectors.map(sector => {
            // 1. Avg LQ
            const sectorLQs = lqResults.filter(r => r.sector === sector)
            const avgLQ = sectorLQs.length > 0
                ? sectorLQs.reduce((a, b) => a + b.lq, 0) / sectorLQs.length
                : 0
            const isReliable = avgLQ > 1

            // 2. Net SSA Shift (Dij)
            const sectorSSA = ssaResults.filter(r => r.sector === sector)
            const totalShift = sectorSSA.reduce((a, b) => a + b.dij, 0)

            // 3. Dominant Typology
            const sectorKlassen = klassenResults.filter(r => r.sector === sector)
            // Count dominant quadrant
            const quadrantCounts: Record<string, number> = { "Prima": 0, "Berkembang": 0, "Potensial": 0, "Terbelakang": 0 }
            sectorKlassen.forEach(r => {
                if (quadrantCounts[r.quadrant] !== undefined) quadrantCounts[r.quadrant]++
            })
            const dominantQuadrant = Object.entries(quadrantCounts).sort((a, b) => b[1] - a[1])[0][0]

            // 4. Total Investment Value (Current Year)
            const currentValue = records
                .filter(r => r.sector === sector && r.year === endYear)
                .reduce((a, b) => a + b.value, 0)

            return {
                sector,
                avgLQ,
                isReliable,
                totalShift,
                dominantQuadrant,
                currentValue
            }
        }).sort((a, b) => b.currentValue - a.currentValue) // Sort by value

    }, [records, years, startYear, endYear])

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(val)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorMetrics.map((metric) => (
                <Link key={metric.sector} href={`/invest/${encodeURIComponent(metric.sector)}`} className="block group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-t-4 border-t-blue-600 h-full">
                        <CardHeader className="pb-2 bg-slate-50/50 group-hover:bg-blue-50/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-bold text-slate-900 line-clamp-2 min-h-12">
                                    {metric.sector}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${metric.isReliable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {metric.isReliable ? <TrendingUp className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Rata-rata LQ</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-bold ${metric.avgLQ > 1 ? 'text-blue-700' : 'text-slate-600'}`}>
                                            {metric.avgLQ.toFixed(2)}
                                        </span>
                                        {metric.avgLQ > 1 && <Badge className="bg-blue-600 text-[10px] px-1 h-5">Basis</Badge>}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Nilai ({endYear})</p>
                                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(metric.currentValue)}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Layers className="h-4 w-4" />
                                        <span>Tipologi Dominan</span>
                                    </div>
                                    <Badge variant="outline" className={`
                        ${metric.dominantQuadrant === 'Prima' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${metric.dominantQuadrant === 'Berkembang' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        ${metric.dominantQuadrant === 'Potensial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        ${metric.dominantQuadrant === 'Terbelakang' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}>
                                        {metric.dominantQuadrant}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        {metric.totalShift >= 0 ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
                                        <span>Pergeseran Bersih (SSA)</span>
                                    </div>
                                    <span className={`font-medium ${metric.totalShift >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                                        {metric.totalShift >= 0 ? '+' : ''}{formatCurrency(metric.totalShift)}
                                    </span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
