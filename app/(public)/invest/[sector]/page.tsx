"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Info, Check, ChevronsUpDown, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RegionalComparisonChart } from "@/components/charts/RegionalComparisonChart"
import { TrendCurveChart } from "@/components/charts/TrendCurveChart"
import { useSectorAnalysis } from "@/hooks/useSectorAnalysis"
import { getApprovedInvestmentRecords } from "@/lib/actions/pdrb.actions"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SektorDetailSkeleton from "@/components/skeleton/SektorDetailSkeleton"

export default function SectorDetailPage() {
    const params = useParams()
    const sectorName = decodeURIComponent(params.sector as string)

    const [records, setRecords] = React.useState<InvestmentRecord[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const hasFetched = React.useRef(false)

    React.useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true

        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const result = await getApprovedInvestmentRecords()
        if (result.success && result.data) {
            setRecords(result.data)
        }
        setIsLoading(false)
    }

    const {
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
    } = useSectorAnalysis(sectorName, records)

    const [openRegion, setOpenRegion] = React.useState(false)

    if (isLoading) {
        return <SektorDetailSkeleton />
    }

    if (!sectorMetrics) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-400">Sektor tidak ditemukan atau data belum cukup</h1>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/invest">Kembali</Link>
                </Button>
            </div>
        )
    }

    const handlePrint = () => {
        // Open print page in new tab
        const url = `/invest/${encodeURIComponent(sectorName)}/print?region=${encodeURIComponent(selectedRegion)}&year=${selectedYear}`
        window.open(url, '_blank')
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <Link href="/invest" className="inline-flex items-center text-sm text-muted-foreground hover:text-blue-600 transition-colors w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
                </Link>
                <Button onClick={handlePrint} variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Cetak PDF
                </Button>
            </div>

            {/* Content Wrapper */}
            <div className="space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{sectorName}</h1>
                            <p className="text-muted-foreground mt-1 text-lg">
                                Analisis kinerja sektor {selectedRegion === "all" ? "di Sumatera Utara" : `di ${selectedRegion}`}
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Region Filter (Combobox) */}
                            <Popover open={openRegion} onOpenChange={setOpenRegion}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openRegion}
                                        className="w-full sm:w-[250px] justify-between transition-none"
                                    >
                                        <span className="truncate">
                                            {selectedRegion === "all"
                                                ? "Semua Kabupaten/Kota"
                                                : selectedRegion}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari wilayah..." />
                                        <CommandList>
                                            <CommandEmpty>Wilayah tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value="all"
                                                    onSelect={() => {
                                                        setSelectedRegion("all")
                                                        setOpenRegion(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedRegion === "all" ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    Semua Kabupaten/Kota
                                                </CommandItem>
                                                {regions.map((region) => (
                                                    <CommandItem
                                                        key={region}
                                                        value={region}
                                                        onSelect={() => {
                                                            setSelectedRegion(region)
                                                            setOpenRegion(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedRegion === region ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {region}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            {/* Year Filter */}
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-full sm:w-[120px]">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Metrics Summary Badges */}
                    <div className="flex gap-3 flex-wrap">
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 w-[200px] justify-center text-center">
                            Periode: {startYear} - {currentYear}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700 tabular-nums w-[220px] justify-center text-center">
                            Total Investasi: {formatCurrency(sectorMetrics.currentValue)}
                        </Badge>
                    </div>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 break-inside-avoid">
                    {/* LQ Card */}
                    <Card className={cn("transition-all duration-300", sectorMetrics.isReliable ? "border-l-4 border-l-blue-500" : "")}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                                {selectedRegion === "all" ? "Rata-rata LQ" : "Location Quotient (LQ)"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-9">
                                <span className="text-3xl font-bold text-slate-800 tabular-nums">{sectorMetrics.avgLQ.toFixed(2)}</span>
                                {sectorMetrics.isReliable && <TrendingUp className="h-6 w-6 text-blue-500 mb-1" />}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 min-h-[40px] leading-snug">
                                {sectorMetrics.isReliable
                                    ? "Sektor basis dengan keunggulan komparatif tinggi."
                                    : "Bukan sektor basis, perlu pengembangan lebih lanjut."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Klassen Card */}
                    <Card className="border-l-4 border-l-green-500 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                                Tipologi Klassen
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-9">
                                <span className="text-2xl font-bold text-slate-800">{sectorMetrics.dominantQuadrant}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 min-h-[40px] leading-snug">
                                {selectedRegion === "all" ? "Klasifikasi dominan di seluruh wilayah." : "Posisi sektor dalam klasifikasi pertumbuhan."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* SSA Card */}
                    <Card className={cn("transition-all duration-300", sectorMetrics.totalShift >= 0 ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-red-500")}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Pergeseran Bersih</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-9">
                                <span className={`text-2xl font-bold tabular-nums ${sectorMetrics.totalShift >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                    {sectorMetrics.totalShift >= 0 ? "+" : ""}{formatCurrency(sectorMetrics.totalShift)}
                                </span>
                                {sectorMetrics.totalShift >= 0 ? <ArrowUpRight className="h-6 w-6 text-emerald-500 mb-1" /> : <ArrowDownRight className="h-6 w-6 text-red-500 mb-1" />}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 min-h-[40px] leading-snug">
                                Total pergeseran bersih investasi {selectedRegion === "all" ? "agregat" : "wilayah ini"}.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- MAPPINGS / CHARTS SECTION --- */}
                <div className="break-inside-avoid">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Analisis Grafik Tren & Sebaran</h2>
                    <div className="space-y-6">
                        <TrendCurveChart data={yearlyTrendData} />
                        <RegionalComparisonChart
                            data={regionalData}
                            highlightedRegion={selectedRegion !== "all" ? selectedRegion : undefined}
                        />
                    </div>
                </div>

                {/* Detailed Analysis Section */}
                <div className="grid md:grid-cols-2 gap-8 break-inside-avoid">
                    {/* Logic for Detailed SSA */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-600" />
                                Analisis Shift Share (SSA)
                            </CardTitle>
                            <CardDescription className="min-h-[20px]">
                                Detail komponen pertumbuhan investasi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <span className="text-sm font-semibold text-slate-600 block mb-1">National Growth Effect (Nij)</span>
                                    <span className="text-lg font-bold text-slate-800 tabular-nums">{formatCurrency(sectorMetrics.ssaBreakdown.nij)}</span>
                                    <p className="text-xs text-muted-foreground mt-1">Pengaruh pertumbuhan ekonomi referensi.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <span className="text-sm font-semibold text-slate-600 block mb-1">Industrial Mix Effect (Mij)</span>
                                    <span className={`text-lg font-bold tabular-nums ${sectorMetrics.ssaBreakdown.mij >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {formatCurrency(sectorMetrics.ssaBreakdown.mij)}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1">Pertumbuhan spesifik sektor.</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <span className="text-sm font-semibold text-slate-600 block mb-1">Competitive Effect (Cij)</span>
                                    <span className={`text-lg font-bold tabular-nums ${sectorMetrics.ssaBreakdown.cij >= 0 ? "text-blue-600" : "text-orange-600"}`}>
                                        {formatCurrency(sectorMetrics.ssaBreakdown.cij)}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1">Keunggulan kompetitif wilayah.</p>
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
                            <CardDescription className="min-h-[20px]">
                                Penjelasan mengenai kondisi sektor.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-700">
                            <p>
                                Pada tahun <strong>{currentYear}</strong>, Sektor <strong>{sectorName}</strong> {selectedRegion !== "all" && `di ${selectedRegion}`} memiliki nilai LQ sebesar <strong>{sectorMetrics.avgLQ.toFixed(2)}</strong>.
                                {sectorMetrics.isReliable
                                    ? " Sektor ini tergolong BASIS, mampu memenuhi kebutuhan internal dan berpotensi ekspor."
                                    : " Sektor ini tergolong NON-BASIS, produksinya belum cukup memenuhi kebutuhan internal."}
                            </p>
                            <hr className="border-dashed" />
                            <p>
                                Berdasarkan tipologi Klassen (Periode {startYear}-{currentYear}), sektor ini masuk dalam kategori <strong>{sectorMetrics.dominantQuadrant}</strong>.
                                {sectorMetrics.dominantQuadrant === 'Prima' && " Posisi ideal dengan pertumbuhan dan kontribusi tinggi (Kuadran I)."}
                                {sectorMetrics.dominantQuadrant === 'Berkembang' && " Tumbuh cepat namun kontribusi masih kecil (Kuadran II - Sektor Berkembang Cepat)."}
                                {sectorMetrics.dominantQuadrant === 'Potensial' && " Kontribusi besar namun pertumbuhan melambat (Kuadran III - Sektor Maju Tertekan)."}
                                {sectorMetrics.dominantQuadrant === 'Terbelakang' && " Pertumbuhan dan kontribusi di bawah rata-rata (Kuadran IV - Sektor Relatif Tertinggal)."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
