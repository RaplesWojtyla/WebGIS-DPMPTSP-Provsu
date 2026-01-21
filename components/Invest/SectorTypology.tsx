"use client"

import * as React from "react"
import { InvestmentRecord, calculateKlassen } from "@/lib/lq-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Reusing Klassen logic as it is essentially a typology analysis
// But presenting it as a list for specific sectors

interface SectorTypologyProps {
    records: InvestmentRecord[]
}

export function SectorTypology({ records }: SectorTypologyProps) {
    const years = React.useMemo(() => Array.from(new Set(records.map(r => r.year))).sort(), [records])
    const startYear = years[0]
    const endYear = years[years.length - 1]

    const results = React.useMemo(() => {
        if (years.length < 2) return []
        return calculateKlassen(records, startYear, endYear)
    }, [records, years, startYear, endYear])

    if (years.length < 2) return null

    // Group by Sector (cross-region summary)
    // Find sectors that are mostly Prime/Prima across regions
    const sectorSummary: Record<string, { prima: number, total: number }> = {}

    results.forEach(res => {
        if (!sectorSummary[res.sector]) sectorSummary[res.sector] = { prima: 0, total: 0 }
        sectorSummary[res.sector].total += 1
        if (res.quadrant === "Prima") sectorSummary[res.sector].prima += 1
    })

    const topSectors = Object.entries(sectorSummary)
        .sort((a, b) => b[1].prima - a[1].prima)
        .slice(0, 5)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sektor Andalan (Dominasi Prima)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topSectors.map(([sector, count]) => (
                        <div key={sector} className="flex justify-between items-center border-b pb-2 last:border-0">
                            <span className="font-medium text-sm">{sector}</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {count.prima} Daerah Prima
                            </Badge>
                        </div>
                    ))}
                    {topSectors.length === 0 && <p className="text-sm text-muted-foreground">Belum ada data sektor prima.</p>}
                </div>
            </CardContent>
        </Card>
    )
}
