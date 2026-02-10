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

interface AnalysisResultSSA {
    nij: string
    mij: string
    cij: string
    dij: string
}

interface AnalysisSSAProps {
    regions: Region[]
    sectors: Sector[]
    years: number[]
}

export default function AnalysisSSA({ regions, sectors, years }: AnalysisSSAProps) {
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [resultSSA, setResultSSA] = useState<AnalysisResultSSA | null>(null)
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

    const calculateSSA = () => {
        const Eij_t0 = toDecimal(formDataTimeSeries.regionSectorStart)
        const Eij_t1 = toDecimal(formDataTimeSeries.regionSectorEnd)
        const Ei_t0 = toDecimal(formDataTimeSeries.provSectorStart)
        const Ei_t1 = toDecimal(formDataTimeSeries.provSectorEnd)
        const Et_t0 = toDecimal(formDataTimeSeries.provTotalStart)
        const Et_t1 = toDecimal(formDataTimeSeries.provTotalEnd)

        if (Et_t0.isZero() || Ei_t0.isZero()) {
            toast.error("Nilai awal tidak boleh 0!")
            return
        }

        const Rn = Et_t1.minus(Et_t0).dividedBy(Et_t0)
        const Ri = Ei_t1.minus(Ei_t0).dividedBy(Ei_t0)
        const nij = Eij_t0.times(Rn)
        const mij = Eij_t0.times(Ri.minus(Rn))
        const cij = Eij_t1.minus(Eij_t0.times(new Decimal(1).plus(Ri)))
        const dij = nij.plus(mij).plus(cij)

        setResultSSA({
            nij: nij.toFixed(2),
            mij: mij.toFixed(2),
            cij: cij.toFixed(2),
            dij: dij.toFixed(2),
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Shift Share (SSA)</h2>

            {/* Selection Controls */}
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
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Sektor Provinsi (Awal)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provSectorStart) || 0)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600">Sektor Provinsi (Akhir)</label>
                    <p className="text-sm font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provSectorEnd) || 0)}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <label className="text-xs font-semibold text-purple-600">Total Provinsi (Awal)</label>
                    <p className="text-sm font-bold text-purple-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provTotalStart) || 0)}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <label className="text-xs font-semibold text-purple-600">Total Provinsi (Akhir)</label>
                    <p className="text-sm font-bold text-purple-900 mt-1">{formatNumber(parseFloat(formDataTimeSeries.provTotalEnd) || 0)}</p>
                </div>
            </div>

            <button onClick={calculateSSA} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Hitung SSA
            </button>

            {resultSSA && (
                <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-xs text-slate-500 uppercase">National Share (Nij)</p><p className="font-bold text-slate-900">{formatNumber(parseFloat(resultSSA.nij))}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Proportional Shift (Mij)</p><p className="font-bold text-slate-900">{formatNumber(parseFloat(resultSSA.mij))}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Differential Shift (Cij)</p><p className={`font-bold ${parseFloat(resultSSA.cij) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatNumber(parseFloat(resultSSA.cij))}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase">Total Shift (Dij)</p><p className="font-bold text-slate-900">{formatNumber(parseFloat(resultSSA.dij))}</p></div>
                </div>
            )}
        </div>
    )
}
