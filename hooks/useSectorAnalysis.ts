import * as React from "react"
import { InvestmentRecord, calculateLQ, calculateSSA, calculateKlassen } from "@/lib/lq-utils"
import dummyData from "@/data/investment_dummy.json"

export function useSectorAnalysis(sectorName: string, initialRegion: string = "all", initialYearStr?: string) {
    const [records] = React.useState<InvestmentRecord[]>(dummyData)

    // Extract unique regions and years
    const regions = React.useMemo(() => Array.from(new Set(records.map(r => r.region))).sort(), [records])
    const years = React.useMemo(() => Array.from(new Set(records.map(r => r.year))).sort(), [records])

    // Filter States
    const [selectedRegion, setSelectedRegion] = React.useState<string>(initialRegion)
    // Default to last year if not provided
    const [selectedYear, setSelectedYear] = React.useState<string>(initialYearStr || years[years.length - 1]?.toString() || "")

    // Update state if props/initial values change (e.g. from URL params)
    React.useEffect(() => {
        if (initialRegion) setSelectedRegion(initialRegion)
    }, [initialRegion])

    React.useEffect(() => {
        if (initialYearStr) setSelectedYear(initialYearStr)
    }, [initialYearStr])

    // Derived values
    const startYear = years[0]
    const currentYear = parseInt(selectedYear) || years[years.length - 1]

    const sectorMetrics = React.useMemo(() => {
        if (!sectorName || years.length < 1) return null

        // 1. Snapshot Data (for current selected year)
        const snapshotRecords = records.filter(r =>
            r.year === currentYear &&
            (selectedRegion === "all" || r.region === selectedRegion)
        )

        // 2. Trend Data (for SSA & Klassen - requires start to current year)
        const rangeRecords = records.filter(r => r.year <= currentYear)

        // Calculate global results using rangeRecords
        const lqResults = calculateLQ(rangeRecords.filter(r => r.year === currentYear))
        const ssaResults = years.length >= 2 ? calculateSSA(rangeRecords, startYear, currentYear) : []
        const klassenResults = years.length >= 2 ? calculateKlassen(rangeRecords, startYear, currentYear) : []

        // --- EXTRACT METRICS ---
        let avgLQ = 0
        let isReliable = false
        let totalShift = 0
        let ssaBreakdown = { nij: 0, mij: 0, cij: 0 }
        let dominantQuadrant = "Terbelakang"

        if (selectedRegion === "all") {
            // AGGREGATE VIEW
            const sectorLQs = lqResults.filter(r => r.sector === sectorName)
            avgLQ = sectorLQs.length > 0
                ? sectorLQs.reduce((a, b) => a + b.lq, 0) / sectorLQs.length
                : 0
            isReliable = avgLQ > 1

            const sectorSSA = ssaResults.filter(r => r.sector === sectorName)
            totalShift = sectorSSA.reduce((a, b) => a + b.dij, 0)

            ssaBreakdown = sectorSSA.reduce((acc, curr) => ({
                nij: acc.nij + curr.nij,
                mij: acc.mij + curr.mij,
                cij: acc.cij + curr.cij
            }), { nij: 0, mij: 0, cij: 0 })

            const sectorKlassen = klassenResults.filter(r => r.sector === sectorName)
            const quadrantCounts: Record<string, number> = { "Prima": 0, "Berkembang": 0, "Potensial": 0, "Terbelakang": 0 }
            sectorKlassen.forEach(r => {
                if (quadrantCounts[r.quadrant] !== undefined) quadrantCounts[r.quadrant]++
            })
            dominantQuadrant = Object.entries(quadrantCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Terbelakang"

        } else {
            // SPECIFIC REGION VIEW
            const regionLQ = lqResults.find(r => r.region === selectedRegion && r.sector === sectorName)
            avgLQ = regionLQ?.lq || 0
            isReliable = avgLQ > 1

            const regionSSA = ssaResults.find(r => r.region === selectedRegion && r.sector === sectorName)
            totalShift = regionSSA?.dij || 0
            ssaBreakdown = {
                nij: regionSSA?.nij || 0,
                mij: regionSSA?.mij || 0,
                cij: regionSSA?.cij || 0
            }

            const regionKlassen = klassenResults.find(r => r.region === selectedRegion && r.sector === sectorName)
            dominantQuadrant = regionKlassen?.quadrant || "Unknown"
        }

        // 4. Investment Value (Selected Year)
        const currentValue = snapshotRecords
            .filter(r => r.sector === sectorName)
            .reduce((a, b) => a + b.value, 0)

        // 5. Total Investment (All Time in Range)
        const totalValue = rangeRecords
            .filter(r => r.sector === sectorName && (selectedRegion === "all" || r.region === selectedRegion))
            .reduce((a, b) => a + b.value, 0)

        return {
            avgLQ,
            isReliable,
            totalShift,
            ssaBreakdown,
            dominantQuadrant,
            currentValue,
            totalValue
        }

    }, [records, years, startYear, currentYear, sectorName, selectedRegion])

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(val)

    // --- CHART DATA PREPARATION ---

    // 1. Yearly Trend Data
    const yearlyTrendData = React.useMemo(() => {
        return years.map(year => {
            const val = records
                .filter(r => r.year === year && r.sector === sectorName && (selectedRegion === "all" || r.region === selectedRegion))
                .reduce((a, b) => a + b.value, 0)
            return { year, value: val }
        })
    }, [years, records, sectorName, selectedRegion])

    // 2. Regional Data
    const regionalData = React.useMemo(() => {
        return records
            .filter(r => r.year === currentYear && r.sector === sectorName)
            .map(r => ({ region: r.region, value: r.value }))
    }, [currentYear, records, sectorName])

    return {
        regions,
        years,
        selectedRegion,
        setSelectedRegion,
        selectedYear,
        setSelectedYear,
        currentYear,
        startYear,
        sectorMetrics,
        yearlyTrendData,
        regionalData,
        formatCurrency,
        records // exposed just in case
    }
}
