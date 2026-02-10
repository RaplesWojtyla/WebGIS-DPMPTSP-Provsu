"use client"

import { useState, useCallback, useEffect } from "react"
import { FiRefreshCw } from "react-icons/fi"
import Decimal from "decimal.js"
import { toast } from "sonner"
import { getTimeSeriesAnalysisData } from "@/lib/actions/pdrb.actions"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Region {
    id: string
    code: string
    name: string
}

interface Sector {
    id: string
    code: string
    name: string
}

interface AnalysisResultKlassen {
    quadrant: "Prima" | "Berkembang" | "Potensial" | "Terbelakang"
    growthRate: string
    share: string
}

interface AnalysisKlassenProps {
    regions: Region[]
    sectors: Sector[]
    years: number[]
}

export default function AnalysisKlassen({ regions, sectors, years }: AnalysisKlassenProps) {
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [resultKlassen, setResultKlassen] = useState<AnalysisResultKlassen | null>(null)

    const [formDataTimeSeries, setFormDataTimeSeries] = useState({
        regencyId: "",
        sectorId: "",
        startYear: (years[0] - 1).toString(),
        endYear: years[0].toString(),
        regionSectorStart: "",
        regionSectorEnd: "",
        regionTotalStart: "",
        regionTotalEnd: "",
        provSectorStart: "",
        provSectorEnd: "",
        provTotalStart: "",
        provTotalEnd: "",
    })

    // Initialize form values when data is loaded
    useEffect(() => {
        if (regions.length > 0 && sectors.length > 0) {
            setFormDataTimeSeries(prev => ({
                ...prev,
                regencyId: regions[0].id,
                sectorId: sectors[0].id
            }))
        }
    }, [regions, sectors])

    const formatNumber = (val: number) => new Intl.NumberFormat("id-ID").format(val)

    const toDecimal = (val: string | number) => {
        try {
            if (typeof val === 'number') return new Decimal(val)
            const cleaned = val.replace(/[^0-9.-]/g, "")
            if (!cleaned || cleaned === "." || cleaned === "-") return new Decimal(0)
            return new Decimal(cleaned)
        } catch {
            return new Decimal(0)
        }
    }

    const fetchTimeSeriesData = useCallback(async () => {
        if (!formDataTimeSeries.regencyId || !formDataTimeSeries.sectorId) return

        setIsFetchingData(true)
        const result = await getTimeSeriesAnalysisData(
            formDataTimeSeries.regencyId,
            formDataTimeSeries.sectorId,
            parseInt(formDataTimeSeries.startYear),
            parseInt(formDataTimeSeries.endYear)
        )

        if (result.success && result.data) {
            setFormDataTimeSeries(prev => ({
                ...prev,
                regionSectorStart: result.data.regionSectorStart.toString(),
                regionSectorEnd: result.data.regionSectorEnd.toString(),
                regionTotalStart: result.data.regionTotalStart.toString(),
                regionTotalEnd: result.data.regionTotalEnd.toString(),
                provSectorStart: result.data.provSectorStart.toString(),
                provSectorEnd: result.data.provSectorEnd.toString(),
                provTotalStart: result.data.provTotalStart.toString(),
                provTotalEnd: result.data.provTotalEnd.toString()
            }))
            toast.success("Data PDRB berhasil dimuat")
        } else {
            toast.error("Gagal memuat data PDRB")
        }
        setIsFetchingData(false)
    }, [formDataTimeSeries.regencyId, formDataTimeSeries.sectorId, formDataTimeSeries.startYear, formDataTimeSeries.endYear])

    const calculateKlassen = () => {
        const r_start = toDecimal(formDataTimeSeries.regionSectorStart)
        const r_end = toDecimal(formDataTimeSeries.regionSectorEnd)
        const R_start = toDecimal(formDataTimeSeries.provSectorStart)
        const R_end = toDecimal(formDataTimeSeries.provSectorEnd)
        const Y = toDecimal(formDataTimeSeries.provTotalEnd).dividedBy(sectors.length || 1) // avg sector value

        if (r_start.isZero() || R_start.isZero()) {
            toast.error("Nilai awal tidak boleh 0!")
            return
        }

        const r = r_end.minus(r_start).dividedBy(r_start)
        const R = R_end.minus(R_start).dividedBy(R_start)
        const y = r_end

        let quadrant: AnalysisResultKlassen["quadrant"] = "Terbelakang"

        if (r.greaterThan(R) && y.greaterThan(Y)) quadrant = "Prima"
        else if (r.greaterThan(R) && y.lessThanOrEqualTo(Y)) quadrant = "Berkembang"
        else if (r.lessThanOrEqualTo(R) && y.greaterThan(Y)) quadrant = "Potensial"
        else quadrant = "Terbelakang"

        setResultKlassen({
            quadrant,
            growthRate: r.times(100).toFixed(2) + "%",
            share: formatNumber(y.toNumber()),
        })
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Klassen Typology</h2>

            {/* Selection Controls */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                    <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                    <Select
                        value={formDataTimeSeries.regencyId}
                        onValueChange={(val) => setFormDataTimeSeries(prev => ({ ...prev, regencyId: val }))}
                    >
                        <SelectTrigger className="w-full mt-1 rounded-lg bg-white px-4 py-2 border h-auto">
                            <SelectValue placeholder="Pilih Kabupaten/Kota" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {regions.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Sektor</label>
                    <Select
                        value={formDataTimeSeries.sectorId}
                        onValueChange={(val) => setFormDataTimeSeries(prev => ({ ...prev, sectorId: val }))}
                    >
                        <SelectTrigger className="w-full mt-1 rounded-lg bg-white px-4 py-2 border h-auto">
                            <SelectValue placeholder="Pilih Sektor" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {sectors.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700">Tahun Awal</label>
                    <Select
                        value={formDataTimeSeries.startYear}
                        onValueChange={(val) => setFormDataTimeSeries(prev => ({ ...prev, startYear: val }))}
                    >
                        <SelectTrigger className="w-full mt-1 rounded-lg bg-white px-4 py-2 border h-auto">
                            <SelectValue placeholder="Pilih Tahun Awal" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-700">Tahun Akhir</label>
                    <Select
                        value={formDataTimeSeries.endYear}
                        onValueChange={(val) => setFormDataTimeSeries(prev => ({ ...prev, endYear: val }))}
                    >
                        <SelectTrigger className="w-full mt-1 rounded-full bg-white px-4 py-2 border h-auto">
                            <SelectValue placeholder="Pilih Tahun Akhir" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <button
                onClick={fetchTimeSeriesData}
                disabled={isFetchingData}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                <FiRefreshCw className={`w-4 h-4 ${isFetchingData ? 'animate-spin' : ''}`} />
                Muat Data dari Database
            </button>

            {/* Data Values - Same as SSA/DLQ, just to show reference values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600">Sektor Wilayah (Awal)</label>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.regionSectorStart) || 0)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600">Sektor Wilayah (Akhir)</label>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.regionSectorEnd) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Sektor Provinsi (Awal)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provSectorStart) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Sektor Provinsi (Akhir)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provSectorEnd) || 0)}</p>
                </div>
            </div>

            <button onClick={calculateKlassen} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Hitung Klassen
            </button>

            {resultKlassen && (
                <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                    <p className="text-lg font-bold text-purple-900">
                        Kuadran:
                        <span className={`ml-2 px-3 py-1 rounded-lg text-sm ${resultKlassen.quadrant === 'Prima' ? 'bg-green-200 text-green-800' :
                            resultKlassen.quadrant === 'Berkembang' ? 'bg-blue-200 text-blue-800' :
                                resultKlassen.quadrant === 'Potensial' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-red-200 text-red-800'
                            }`}>
                            {resultKlassen.quadrant}
                        </span>
                    </p>
                    <div className="mt-2 text-sm text-purple-800">
                        <p>Laju Pertumbuhan (r): {resultKlassen.growthRate}</p>
                        <p>Kontribusi (y): {resultKlassen.share}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
