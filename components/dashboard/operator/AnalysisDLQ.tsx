"use client"

import { useState, useCallback, useEffect } from "react"
import { FiRefreshCw } from "react-icons/fi"
import { Check, ChevronsUpDown } from "lucide-react"
import Decimal from "decimal.js"
import { toast } from "sonner"
import { getTimeSeriesAnalysisData } from "@/lib/actions/pdrb.actions"
import { cn } from "@/lib/utils"
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

interface AnalysisResultDLQ {
    dlq: string
    status: "Potensial" | "Belum Potensial"
    description: string
}

interface AnalysisDLQProps {
    regions: Region[]
    sectors: Sector[]
    years: number[]
}

export default function AnalysisDLQ({ regions, sectors, years }: AnalysisDLQProps) {
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [resultDLQ, setResultDLQ] = useState<AnalysisResultDLQ | null>(null)
    const [openRegion, setOpenRegion] = useState(false)
    const [openSector, setOpenSector] = useState(false)

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

    const calculateDLQ = () => {
        const regSecStart = toDecimal(formDataTimeSeries.regionSectorStart)
        const regSecEnd = toDecimal(formDataTimeSeries.regionSectorEnd)
        const regTotStart = toDecimal(formDataTimeSeries.regionTotalStart)
        const regTotEnd = toDecimal(formDataTimeSeries.regionTotalEnd)
        const provSecStart = toDecimal(formDataTimeSeries.provSectorStart)
        const provSecEnd = toDecimal(formDataTimeSeries.provSectorEnd)
        const provTotStart = toDecimal(formDataTimeSeries.provTotalStart)
        const provTotEnd = toDecimal(formDataTimeSeries.provTotalEnd)

        if (regSecStart.isZero() || regTotStart.isZero() || provSecStart.isZero() || provTotStart.isZero()) {
            toast.error("Nilai awal tidak boleh 0!")
            return
        }

        const g_ik = regSecEnd.minus(regSecStart).dividedBy(regSecStart)
        const g_k = regTotEnd.minus(regTotStart).dividedBy(regTotStart)
        const g_ip = provSecEnd.minus(provSecStart).dividedBy(provSecStart)
        const g_p = provTotEnd.minus(provTotStart).dividedBy(provTotStart)

        const num = new Decimal(1).plus(g_ik).dividedBy(new Decimal(1).plus(g_k))
        const den = new Decimal(1).plus(g_ip).dividedBy(new Decimal(1).plus(g_p))

        if (den.isZero()) return

        const dlq = num.dividedBy(den)

        setResultDLQ({
            dlq: dlq.toFixed(4),
            status: dlq.greaterThan(1) ? "Potensial" : "Belum Potensial",
            description: dlq.greaterThan(1)
                ? "Sektor ini memiliki potensi untuk reposisi menjadi basis di masa depan."
                : "Sektor ini belum menunjukkan potensi pertumbuhan relatif yang signifikan."
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Dynamic Location Quotient (DLQ)</h2>

            {/* Selection Controls - Same as SSA */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                    <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                    <Popover open={openRegion} onOpenChange={setOpenRegion}>
                        <PopoverTrigger asChild>
                            <button
                                role="combobox"
                                aria-expanded={openRegion}
                                className="w-full mt-1 justify-between flex items-center rounded-lg bg-white px-4 py-2 border h-auto hover:bg-slate-50 text-sm font-normal text-slate-900"
                            >
                                <span className="truncate">
                                    {formDataTimeSeries.regencyId
                                        ? regions.find((r) => r.id === formDataTimeSeries.regencyId)?.name
                                        : "Pilih Kabupaten/Kota..."}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 rounded-lg">
                            <Command>
                                <CommandInput placeholder="Cari kabupaten/kota..." />
                                <CommandList>
                                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                    <CommandGroup>
                                        {regions.map((region) => (
                                            <CommandItem
                                                key={region.id}
                                                value={region.name}
                                                onSelect={() => {
                                                    setFormDataTimeSeries(prev => ({ ...prev, regencyId: region.id }))
                                                    setOpenRegion(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        formDataTimeSeries.regencyId === region.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {region.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">Sektor</label>
                    <Popover open={openSector} onOpenChange={setOpenSector}>
                        <PopoverTrigger asChild>
                            <button
                                role="combobox"
                                aria-expanded={openSector}
                                className="w-full mt-1 justify-between flex items-center rounded-lg bg-white px-4 py-2 border h-auto hover:bg-slate-50 text-sm font-normal text-slate-900"
                            >
                                <span className="truncate text-left">
                                    {formDataTimeSeries.sectorId
                                        ? sectors.find((s) => s.id === formDataTimeSeries.sectorId)?.name
                                        : "Pilih Sektor..."}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[500px] p-0 rounded-lg">
                            <Command>
                                <CommandInput placeholder="Cari sektor..." />
                                <CommandList>
                                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                    <CommandGroup>
                                        {sectors.map((sector) => (
                                            <CommandItem
                                                key={sector.id}
                                                value={sector.name}
                                                onSelect={() => {
                                                    setFormDataTimeSeries(prev => ({ ...prev, sectorId: sector.id }))
                                                    setOpenSector(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        formDataTimeSeries.sectorId === sector.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {sector.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
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
                        <SelectContent className="rounded-lg">
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
                        <SelectTrigger className="w-full mt-1 rounded-lg bg-white px-4 py-2 border h-auto">
                            <SelectValue placeholder="Pilih Tahun Akhir" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
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

            {/* Data Values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600">Sektor Wilayah (Awal)</label>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.regionSectorStart) || 0)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600">Sektor Wilayah (Akhir)</label>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.regionSectorEnd) || 0)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600">Total Wilayah (Awal)</label>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.regionTotalStart) || 0)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600">Total Wilayah (Akhir)</label>
                    <p className="text-sm font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.regionTotalEnd) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Sektor Provinsi (Awal)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provSectorStart) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Sektor Provinsi (Akhir)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provSectorEnd) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Total Provinsi (Awal)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provTotalStart) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Total Provinsi (Akhir)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provTotalEnd) || 0)}</p>
                </div>
            </div>

            <button onClick={calculateDLQ} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Hitung DLQ
            </button>

            {resultDLQ && (
                <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-lg font-bold text-indigo-900">
                        Nilai DLQ: {resultDLQ.dlq}
                        <span className={`ml-2 text-sm px-2 py-0.5 rounded ${resultDLQ.status === 'Potensial' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {resultDLQ.status}
                        </span>
                    </p>
                    <p className="text-slate-600 mt-2">{resultDLQ.description}</p>
                </div>
            )}
        </div>
    )
}
