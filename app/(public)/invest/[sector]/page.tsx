"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InvestmentRecord, calculateLQ, calculateSSA, calculateKlassen } from "@/lib/lq-utils"
import dummyData from "@/data/investment_dummy.json"

export default function SectorDetailPage() {
    const params = useParams()
    const sectorName = decodeURIComponent(params.sector as string)
    const [records] = React.useState<InvestmentRecord[]>(dummyData)

    const years = React.useMemo(() => Array.from(new Set(records.map(r => r.year))).sort(), [records])
    const startYear = years[0]
    const endYear = years[years.length - 1]

    const sectorMetrics = React.useMemo(() => {
        if (!sectorName || years.length < 1) return null

        // Calculate global results for standard metrics
        const lqResults = calculateLQ(records)
        const ssaResults = years.length >= 2 ? calculateSSA(records, startYear, endYear) : []
        const klassenResults = years.length >= 2 ? calculateKlassen(records, startYear, endYear) : []

        // 1. Avg LQ
        const sectorLQs = lqResults.filter(r => r.sector === sectorName)
        const avgLQ = sectorLQs.length > 0
            ? sectorLQs.reduce((a, b) => a + b.lq, 0) / sectorLQs.length
            : 0
        const isReliable = avgLQ > 1

        // 2. Net SSA Shift (Dij)
        const sectorSSA = ssaResults.filter(r => r.sector === sectorName)
        const totalShift = sectorSSA.reduce((a, b) => a + b.dij, 0)

        // SSA Components Breakdown
        const ssaBreakdown = sectorSSA.reduce((acc, curr) => ({
            nij: acc.nij + curr.nij,
            mij: acc.mij + curr.mij,
            cij: acc.cij + curr.cij
        }), { nij: 0, mij: 0, cij: 0 })

        // 3. Dominant Typology
        const sectorKlassen = klassenResults.filter(r => r.sector === sectorName)
        const quadrantCounts: Record<string, number> = { "Prima": 0, "Berkembang": 0, "Potensial": 0, "Terbelakang": 0 }
        sectorKlassen.forEach(r => {
            if (quadrantCounts[r.quadrant] !== undefined) quadrantCounts[r.quadrant]++
        })
        // Find dominant
        const dominantQuadrant = Object.entries(quadrantCounts).sort((a, b) => b[1] - a[1])[0][0]

        // 4. Total Investment Value (Current Year)
        const currentValue = records
            .filter(r => r.sector === sectorName && r.year === endYear)
            .reduce((a, b) => a + b.value, 0)

        // 5. Total Investment all time
        const totalValue = records
            .filter(r => r.sector === sectorName)
            .reduce((a, b) => a + b.value, 0)

        return {
            avgLQ,
            isReliable,
            totalShift,
            ssaBreakdown,
            dominantQuadrant,
            currentValue,
            totalValue,
            lqByRegion: sectorLQs, // To show distribution if needed
            klassenByRegion: sectorKlassen
        }

    }, [records, years, startYear, endYear, sectorName])

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(val)

    if (!sectorMetrics) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-400">Sektor tidak ditemukan</h1>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/invest">Kembali</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Link href="/invest" className="inline-flex items-center text-sm text-muted-foreground hover:text-blue-600 mb-4 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{sectorName}</h1>
                        <p className="text-muted-foreground mt-1">Analisis kinerja sektor periode {startYear} - {endYear}</p>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100">
                            LQ: {sectorMetrics.avgLQ.toFixed(2)} ({sectorMetrics.isReliable ? 'Basis' : 'Non-Basis'})
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
                            Total: {formatCurrency(sectorMetrics.totalValue)}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LQ Card */}
                <Card className={sectorMetrics.isReliable ? "border-l-4 border-l-blue-500" : ""}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Location Quotient (LQ)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-slate-800">{sectorMetrics.avgLQ.toFixed(2)}</span>
                            {sectorMetrics.isReliable && <TrendingUp className="h-6 w-6 text-blue-500 mb-1" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {sectorMetrics.isReliable
                                ? "Sektor ini merupakan sektor basis yang memiliki keunggulan komparatif."
                                : "Sektor ini belum menjadi sektor basis, namun memiliki potensi untuk berkembang."}
                        </p>
                    </CardContent>
                </Card>

                {/* Klassen Card */}
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Tipologi Klassen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-slate-800">{sectorMetrics.dominantQuadrant}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Posisi dominan sektor ini dalam klasifikasi pertumbuhan dan kontribusi daerah.
                        </p>
                    </CardContent>
                </Card>

                {/* SSA Card */}
                <Card className={sectorMetrics.totalShift >= 0 ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500"}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pergeseran Bersih (Shift Share)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2">
                            <span className={`text-2xl font-bold ${sectorMetrics.totalShift >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                {sectorMetrics.totalShift >= 0 ? "+" : ""}{formatCurrency(sectorMetrics.totalShift)}
                            </span>
                            {sectorMetrics.totalShift >= 0 ? <ArrowUpRight className="h-6 w-6 text-emerald-500 mb-1" /> : <ArrowDownRight className="h-6 w-6 text-red-500 mb-1" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            Total pergeseran bersih investasi pada sektor ini.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analysis Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Logic for Detailed SSA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            Analisis Shift Share (SSA)
                        </CardTitle>
                        <CardDescription>
                            Komponen pertumbuhan investasi sektor {sectorMetrics.totalShift >= 0 ? "meningkat" : "menurun"} sebesar {formatCurrency(Math.abs(sectorMetrics.totalShift))}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <span className="text-sm font-semibold text-slate-600 block mb-1">National Growth Effect (Nij)</span>
                                <span className="text-lg font-bold text-slate-800">{formatCurrency(sectorMetrics.ssaBreakdown.nij)}</span>
                                <p className="text-xs text-muted-foreground mt-1">Pengaruh pertumbuhan ekonomi nasional/provinsi secara umum.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <span className="text-sm font-semibold text-slate-600 block mb-1">Industrial Mix Effect (Mij)</span>
                                <span className={`text-lg font-bold ${sectorMetrics.ssaBreakdown.mij >= 0 ? "text-green-600" : "text-red-600"}`}>
                                    {formatCurrency(sectorMetrics.ssaBreakdown.mij)}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">Pertumbuhan spesifik sektor ini dibandingkan rata-rata semua sektor.</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <span className="text-sm font-semibold text-slate-600 block mb-1">Competitive Effect (Cij)</span>
                                <span className={`text-lg font-bold ${sectorMetrics.ssaBreakdown.cij >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                                    {formatCurrency(sectorMetrics.ssaBreakdown.cij)}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">Keunggulan kompetitif sektor ini di daerah-daerah studi.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Explanation / Context */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-600" />
                            Interpretasi Analisis
                        </CardTitle>
                        <CardDescription>
                            Penjelasan mengenai kondisi sektor berdasarkan indikator.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm leading-relaxed text-slate-700">
                        <p>
                            Sektor <strong>{sectorName}</strong> memiliki rata-rata nilai LQ sebesar <strong>{sectorMetrics.avgLQ.toFixed(2)}</strong>.
                            {sectorMetrics.isReliable
                                ? " Hal ini menunjukkan bahwa sektor ini adalah sektor basis yang mampu memenuhi kebutuhan internal wilayah dan berpotensi untuk ekspor ke luar wilayah."
                                : " Nilai ini menunjukkan bahwa sektor ini bukan merupakan sektor basis, dimana produksinya belum cukup untuk memenuhi kebutuhan internal wilayah."}
                        </p>
                        <hr className="border-dashed" />
                        <p>
                            Berdasarkan tipologi Klassen, sektor ini secara dominan berada pada kuadran <strong>{sectorMetrics.dominantQuadrant}</strong>.
                            {sectorMetrics.dominantQuadrant === 'Prima' && " Ini adalah posisi ideal, tumbuh cepat dan berkontribusi besar."}
                            {sectorMetrics.dominantQuadrant === 'Berkembang' && " Sektor ini tumbuh cepat namun kontribusinya masih relatif kecil dari rata-rata."}
                            {sectorMetrics.dominantQuadrant === 'Potensial' && " Sektor ini berkontribusi besar namun pertumbuhannya melambat."}
                            {sectorMetrics.dominantQuadrant === 'Terbelakang' && " Sektor ini memiliki pertumbuhan dan kontribusi di bawah rata-rata daerah."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
