"use client"

import { useState, useCallback, useEffect } from "react"
import { FiRefreshCw } from "react-icons/fi"
import { Check, ChevronsUpDown } from "lucide-react"
import Decimal from "decimal.js"
import { toast } from "sonner"
import { getLQAnalysisData } from "@/lib/actions/pdrb.actions"
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

interface AnalysisResultLQ {
    lq: string
    status: "Basis" | "Non-Basis"
    description: string
}

interface AnalysisLQProps {
    regions: Region[]
    sectors: Sector[]
    years: number[]
}

export default function AnalysisLQ({ regions, sectors, years }: AnalysisLQProps) {
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [resultLQ, setResultLQ] = useState<AnalysisResultLQ | null>(null)
    const [openRegion, setOpenRegion] = useState(false)
    const [openSector, setOpenSector] = useState(false)

    const [formDataLQ, setFormDataLQ] = useState({
        regencyId: "",
        sectorId: "",
        year: years[0]?.toString() || new Date().getFullYear().toString(),
        pdrbSector: "",
        totalPdrb: "",
        pdbSector: "",
        totalPdb: "",
    })

    // Initialize form values when data is loaded
    useEffect(() => {
        if (regions.length > 0 && sectors.length > 0) {
            setFormDataLQ(prev => ({
                ...prev,
                regencyId: regions[0].id,
                sectorId: sectors[0].id,
                year: years[0]?.toString() || new Date().getFullYear().toString()
            }))
        }
    }, [regions, sectors, years])

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

    const fetchLQData = useCallback(async () => {
        if (!formDataLQ.regencyId || !formDataLQ.sectorId || !formDataLQ.year) return

        setIsFetchingData(true)
        const result = await getLQAnalysisData(
            formDataLQ.regencyId,
            formDataLQ.sectorId,
            parseInt(formDataLQ.year)
        )

        if (result.success && result.data) {
            setFormDataLQ(prev => ({
                ...prev,
                pdrbSector: result.data.pdrbSector.toString(),
                totalPdrb: result.data.totalPdrb.toString(),
                pdbSector: result.data.pdbSector.toString(),
                totalPdb: result.data.totalPdb.toString()
            }))
            toast.success("Data PDRB berhasil dimuat")
        } else {
            toast.error("Gagal memuat data PDRB")
        }
        setIsFetchingData(false)
    }, [formDataLQ.regencyId, formDataLQ.sectorId, formDataLQ.year])

    const calculateLQ = () => {
        const vi = toDecimal(formDataLQ.pdrbSector)
        const vt = toDecimal(formDataLQ.totalPdrb)
        const Vi = toDecimal(formDataLQ.pdbSector)
        const Vt = toDecimal(formDataLQ.totalPdb)

        if (vt.isZero() || Vi.isZero() || Vt.isZero()) {
            toast.error("Nilai pembagi tidak boleh 0!")
            return
        }

        const regionShare = vi.dividedBy(vt)
        const provShare = Vi.dividedBy(Vt)
        const lq = regionShare.dividedBy(provShare)

        setResultLQ({
            lq: lq.toFixed(4),
            status: lq.greaterThan(1) ? "Basis" : "Non-Basis",
            description: lq.greaterThan(1)
                ? "Sektor ini memiliki keunggulan komparatif dan berpotensi untuk dikembangkan sebagai sektor unggulan."
                : "Sektor ini belum memiliki keunggulan komparatif dan produksinya belum mencukupi kebutuhan wilayah.",
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Location Quotient (LQ)</h2>

            {/* Selection Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                                    {formDataLQ.regencyId
                                        ? regions.find((r) => r.id === formDataLQ.regencyId)?.name
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
                                                    setFormDataLQ(prev => ({ ...prev, regencyId: region.id }))
                                                    setOpenRegion(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        formDataLQ.regencyId === region.id ? "opacity-100" : "opacity-0"
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
                                    {formDataLQ.sectorId
                                        ? sectors.find((s) => s.id === formDataLQ.sectorId)?.name
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
                                                    setFormDataLQ(prev => ({ ...prev, sectorId: sector.id }))
                                                    setOpenSector(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        formDataLQ.sectorId === sector.id ? "opacity-100" : "opacity-0"
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
                    <label className="text-sm font-semibold text-slate-700">Tahun</label>
                    <Select
                        value={formDataLQ.year}
                        onValueChange={(val) => setFormDataLQ(prev => ({ ...prev, year: val }))}
                    >
                        <SelectTrigger className="w-full mt-1 rounded-lg bg-white px-4 py-2 border h-auto">
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                            {years.map(y => (
                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Fetch Data Button */}
            <button
                onClick={fetchLQData}
                disabled={isFetchingData}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
                <FiRefreshCw className={`w-4 h-4 ${isFetchingData ? 'animate-spin' : ''}`} />
                Muat Data dari Database
            </button>

            {/* Data Values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600 uppercase">PDRB Sektor (Wilayah)</label>
                    <p className="text-lg font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataLQ.pdrbSector) || 0)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <label className="text-xs font-semibold text-blue-600 uppercase">Total PDRB (Wilayah)</label>
                    <p className="text-lg font-bold text-blue-900 mt-1">{formatNumber(parseFloat(formDataLQ.totalPdrb) || 0)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600 uppercase">PDRB Sektor (Provinsi)</label>
                    <p className="text-lg font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataLQ.pdbSector) || 0)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <label className="text-xs font-semibold text-green-600 uppercase">Total PDRB (Provinsi)</label>
                    <p className="text-lg font-bold text-green-900 mt-1">{formatNumber(parseFloat(formDataLQ.totalPdb) || 0)}</p>
                </div>
            </div>

            <button onClick={calculateLQ} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Hitung LQ
            </button>

            {resultLQ && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-lg font-bold text-blue-900">
                        Nilai LQ: {resultLQ.lq}
                        <span className={`ml-2 text-sm px-2 py-0.5 rounded ${resultLQ.status === 'Basis' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                            {resultLQ.status}
                        </span>
                    </p>
                    <p className="text-slate-600 mt-2">{resultLQ.description}</p>
                </div>
            )}
        </div>
    )
}
