"use client"

import { useState, useEffect, useCallback } from "react"
import { FiClock, FiRefreshCw, FiActivity, FiTrendingUp, FiGrid, FiFastForward, FiLoader, FiCheckCircle, FiXCircle, FiExternalLink } from "react-icons/fi"
import Decimal from "decimal.js"
import Link from "next/link"
import { toast } from "sonner"
import {
    getRegenciesWithProvince,
    getSectors,
    getOperatorPdrbSubmissions,
    getLQAnalysisData,
    getTimeSeriesAnalysisData
} from "@/lib/actions/pdrb.actions"

export default function OperatorDashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [regions, setRegions] = useState<Region[]>([])
    const [sectors, setSectors] = useState<Sector[]>([])
    const [submissions, setSubmissions] = useState<PdrbSubmission[]>([])
    const [activeTab, setActiveTab] = useState<"status" | "lq" | "ssa" | "klassen" | "dlq">("status")

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)

        const [regenciesResult, sectorsResult, submissionsResult] = await Promise.all([
            getRegenciesWithProvince(),
            getSectors(),
            getOperatorPdrbSubmissions()
        ])

        if (regenciesResult.success && regenciesResult.data) {
            setRegions(regenciesResult.data.map(r => ({
                id: r.id,
                code: r.code,
                name: r.name
            })))
        }

        if (sectorsResult.success && sectorsResult.data) {
            setSectors(sectorsResult.data as Sector[])
        }

        if (submissionsResult.success && submissionsResult.data) {
            setSubmissions(submissionsResult.data as PdrbSubmission[])
        }

        setIsLoading(false)
    }

    // LQ Form State
    const [formDataLQ, setFormDataLQ] = useState({
        regencyId: "",
        sectorId: "",
        year: currentYear.toString(),
        pdrbSector: "",
        totalPdrb: "",
        pdbSector: "",
        totalPdb: "",
    })

    // SSA/DLQ/Klassen Form State  
    const [formDataTimeSeries, setFormDataTimeSeries] = useState({
        regencyId: "",
        sectorId: "",
        startYear: (currentYear - 1).toString(),
        endYear: currentYear.toString(),
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
            setFormDataLQ(prev => ({ ...prev, regencyId: regions[0].id, sectorId: sectors[0].id }))
            setFormDataTimeSeries(prev => ({ ...prev, regencyId: regions[0].id, sectorId: sectors[0].id }))
        }
    }, [regions, sectors])

    const [resultLQ, setResultLQ] = useState<AnalysisResultLQ | null>(null)
    const [resultSSA, setResultSSA] = useState<AnalysisResultSSA | null>(null)
    const [resultKlassen, setResultKlassen] = useState<AnalysisResultKlassen | null>(null)
    const [resultDLQ, setResultDLQ] = useState<AnalysisResultDLQ | null>(null)

    // Helpers
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

    const formatNumber = (val: number) => new Intl.NumberFormat("id-ID").format(val)
    const formatDate = (date: Date | null) => {
        if (!date) return "-"
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    // Status badge helper
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <FiCheckCircle className="w-3 h-3" /> Disetujui
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <FiXCircle className="w-3 h-3" /> Ditolak
                    </span>
                )
            case 'PENDING':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <FiClock className="w-3 h-3" /> Pending
                    </span>
                )
        }
    }

    // Stats for status pengajuan
    const submissionStats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'PENDING').length,
        approved: submissions.filter(s => s.status === 'APPROVED').length,
        rejected: submissions.filter(s => s.status === 'REJECTED').length
    }

    // Fetch LQ data from database
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

    // Fetch TimeSeries data from database
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

    // Calculate LQ
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

    // Calculate SSA
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

    // Calculate DLQ
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

    // Calculate Klassen
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Operator</h1>
                    <p className="text-slate-500 mt-1">Kelola data PDRB dan lakukan analisis ekonomi.</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit">
                    <button onClick={() => setActiveTab("status")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "status" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiClock /> Status Pengajuan</button>
                    <button onClick={() => setActiveTab("lq")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "lq" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiActivity /> Analisis LQ</button>
                    <button onClick={() => setActiveTab("ssa")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "ssa" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiTrendingUp /> Analisis SSA</button>
                    <button onClick={() => setActiveTab("dlq")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "dlq" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiFastForward /> Analisis DLQ</button>
                    <button onClick={() => setActiveTab("klassen")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "klassen" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiGrid /> Analisis Klassen</button>
                </div>

                {/* Status Pengajuan Tab */}
                {activeTab === "status" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border">
                                <div className="text-sm text-gray-500">Total Pengajuan</div>
                                <div className="text-2xl font-bold">{submissionStats.total}</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
                                <div className="text-sm text-yellow-600">Pending</div>
                                <div className="text-2xl font-bold text-yellow-700">{submissionStats.pending}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                                <div className="text-sm text-green-600">Disetujui</div>
                                <div className="text-2xl font-bold text-green-700">{submissionStats.approved}</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                                <div className="text-sm text-red-600">Ditolak</div>
                                <div className="text-2xl font-bold text-red-700">{submissionStats.rejected}</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800">Status Pengajuan PDRB</h2>
                                <p className="text-sm text-slate-500 mt-1">Daftar pengajuan data PDRB yang telah disubmit</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-4 font-semibold text-slate-600 text-sm">Kabupaten/Kota</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm text-center">Tahun</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm text-center">Sektor</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm text-center">Status</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm">Tanggal Submit</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm">Catatan</th>
                                            <th className="p-4 font-semibold text-slate-600 text-sm text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="p-12 text-center text-slate-400">
                                                    Belum ada pengajuan data PDRB
                                                </td>
                                            </tr>
                                        ) : (
                                            submissions.map((item) => (
                                                <tr key={`${item.regencyId}-${item.year}`} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                    <td className="p-4">
                                                        <div className="font-medium text-slate-900">{item.regencyName}</div>
                                                        <div className="text-xs text-slate-500">{item.regencyCode}</div>
                                                    </td>
                                                    <td className="p-4 text-center font-medium">{item.year}</td>
                                                    <td className="p-4 text-center text-slate-600">{item.sectorCount} sektor</td>
                                                    <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                                                    <td className="p-4 text-sm text-slate-600">{formatDate(item.submittedAt)}</td>
                                                    <td className="p-4 text-sm text-slate-600 max-w-[200px] truncate">
                                                        {item.notes || "-"}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Link
                                                            href={`/operator/pdrb/form?regencyId=${item.regencyId}&year=${item.year}`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                                        >
                                                            <FiExternalLink className="w-3 h-3" /> Lihat
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* LQ Analysis Tab */}
                {activeTab === "lq" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Location Quotient (LQ)</h2>

                        {/* Selection Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                                <select
                                    value={formDataLQ.regencyId}
                                    onChange={(e) => setFormDataLQ(prev => ({ ...prev, regencyId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {regions.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Sektor</label>
                                <select
                                    value={formDataLQ.sectorId}
                                    onChange={(e) => setFormDataLQ(prev => ({ ...prev, sectorId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun</label>
                                <select
                                    value={formDataLQ.year}
                                    onChange={(e) => setFormDataLQ(prev => ({ ...prev, year: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
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
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
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
                )}

                {/* SSA Analysis Tab */}
                {activeTab === "ssa" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Analisis Shift Share (SSA)</h2>

                        {/* Selection Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                                <select
                                    value={formDataTimeSeries.regencyId}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, regencyId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {regions.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Sektor</label>
                                <select
                                    value={formDataTimeSeries.sectorId}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, sectorId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun Awal</label>
                                <select
                                    value={formDataTimeSeries.startYear}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, startYear: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun Akhir</label>
                                <select
                                    value={formDataTimeSeries.endYear}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, endYear: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
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
                            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div><p className="text-xs text-slate-500 uppercase">National Share (Nij)</p><p className="font-bold text-slate-900">{formatNumber(parseFloat(resultSSA.nij))}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Proportional Shift (Mij)</p><p className="font-bold text-slate-900">{formatNumber(parseFloat(resultSSA.mij))}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Differential Shift (Cij)</p><p className={`font-bold ${parseFloat(resultSSA.cij) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatNumber(parseFloat(resultSSA.cij))}</p></div>
                                <div><p className="text-xs text-slate-500 uppercase">Total Shift (Dij)</p><p className="font-bold text-slate-900">{formatNumber(parseFloat(resultSSA.dij))}</p></div>
                            </div>
                        )}
                    </div>
                )}

                {/* DLQ Analysis Tab */}
                {activeTab === "dlq" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Dynamic Location Quotient (DLQ)</h2>

                        {/* Selection Controls - Same as SSA */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                                <select
                                    value={formDataTimeSeries.regencyId}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, regencyId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {regions.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Sektor</label>
                                <select
                                    value={formDataTimeSeries.sectorId}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, sectorId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun Awal</label>
                                <select
                                    value={formDataTimeSeries.startYear}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, startYear: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun Akhir</label>
                                <select
                                    value={formDataTimeSeries.endYear}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, endYear: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
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
                            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
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
                )}

                {/* Klassen Analysis Tab */}
                {activeTab === "klassen" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Klassen Typology</h2>

                        {/* Selection Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                                <select
                                    value={formDataTimeSeries.regencyId}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, regencyId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {regions.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700">Sektor</label>
                                <select
                                    value={formDataTimeSeries.sectorId}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, sectorId: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun Awal</label>
                                <select
                                    value={formDataTimeSeries.startYear}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, startYear: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Tahun Akhir</label>
                                <select
                                    value={formDataTimeSeries.endYear}
                                    onChange={(e) => setFormDataTimeSeries(prev => ({ ...prev, endYear: e.target.value }))}
                                    className="w-full mt-1 p-2 border rounded-lg bg-white"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
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
                                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-purple-600 font-medium">Laju Pertumbuhan:</span>
                                        <span className="ml-2 font-bold">{resultKlassen.growthRate}</span>
                                    </div>
                                    <div>
                                        <span className="text-purple-600 font-medium">Kontribusi:</span>
                                        <span className="ml-2 font-bold">{resultKlassen.share}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
