"use client"

import { useState, useEffect, useRef } from "react"
import { FiLoader, FiCheckCircle, FiAlertTriangle, FiEye, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { toast } from "sonner"
import { getAllProposals, verifyProposal, requestRevision } from "@/lib/actions/proposal.actions"

type ProposalStatusFilter = "SUBMITTED" | "VERIFIED" | "REVISION" | "APPROVED" | "REJECTED"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    SUBMITTED: { label: "Baru", color: "bg-blue-100 text-blue-700" },
    VERIFIED: { label: "Diverifikasi", color: "bg-indigo-100 text-indigo-700" },
    REVISION: { label: "Revisi", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Disetujui", color: "bg-green-100 text-green-700" },
    REJECTED: { label: "Ditolak", color: "bg-red-100 text-red-700" },
}

export default function OperatorProposalPage() {
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [proposals, setProposals] = useState<any[]>([])
    const [filterStatus, setFilterStatus] = useState<ProposalStatusFilter | "ALL">("ALL")
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [revisionNotes, setRevisionNotes] = useState<Record<string, string>>({})
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const result = await getAllProposals(filterStatus === "ALL" ? undefined : filterStatus)
        if (result.success && result.data) setProposals(result.data)
        setIsLoading(false)
    }

    useEffect(() => {
        if (hasFetched.current) loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus])

    const handleVerify = async (id: string) => {
        setActionLoading(id)
        const result = await verifyProposal(id)
        if (result.success) {
            toast.success("Proposal berhasil diverifikasi")
            await loadData()
        } else {
            toast.error(result.error || "Gagal memverifikasi")
        }
        setActionLoading(null)
    }

    const handleRevision = async (id: string) => {
        const notes = revisionNotes[id]
        if (!notes?.trim()) { toast.error("Catatan revisi wajib diisi"); return }
        setActionLoading(id)
        const result = await requestRevision(id, notes)
        if (result.success) {
            toast.success("Permintaan revisi berhasil dikirim")
            setRevisionNotes(prev => ({ ...prev, [id]: "" }))
            await loadData()
        } else {
            toast.error(result.error || "Gagal meminta revisi")
        }
        setActionLoading(null)
    }

    const formatCurrency = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v)
    const formatDate = (d: string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

    if (isLoading) {
        return <div className="flex items-center justify-center h-64"><FiLoader className="h-8 w-8 animate-spin text-blue-600" /></div>
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Review Proposal</h1>
                <p className="text-slate-500">Verifikasi kelengkapan data proposal dari investor dan pemilik lokasi.</p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
                {(["ALL", "SUBMITTED", "VERIFIED", "REVISION", "APPROVED", "REJECTED"] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterStatus === s ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
                    >
                        {s === "ALL" ? "Semua" : STATUS_CONFIG[s]?.label || s}
                    </button>
                ))}
            </div>

            {/* List */}
            {proposals.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <FiEye className="mx-auto mb-4" size={40} />
                    <p className="font-semibold">Tidak ada proposal</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.map(p => {
                        const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.SUBMITTED
                        const isExpanded = expandedId === p.id
                        return (
                            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <button onClick={() => setExpandedId(isExpanded ? null : p.id)} className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>{status.label}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.type === "INVESTMENT" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                                                {p.type === "INVESTMENT" ? "Investasi" : "Lokasi"}
                                            </span>
                                            <span className="text-xs text-slate-400">{formatDate(p.createdAt)}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 truncate">{p.title}</h3>
                                        <p className="text-sm text-slate-500">oleh {p.user?.name} ({p.user?.email})</p>
                                    </div>
                                    {isExpanded ? <FiChevronUp className="text-slate-400 shrink-0" /> : <FiChevronDown className="text-slate-400 shrink-0" />}
                                </button>

                                {isExpanded && (
                                    <div className="px-6 pb-6 border-t border-slate-100 pt-4 space-y-4 animate-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            {p.sector && <div><span className="text-slate-500">Sektor</span><p className="font-semibold">{p.sector.name}</p></div>}
                                            {p.regency && <div><span className="text-slate-500">Lokasi</span><p className="font-semibold">{p.regency.name}</p></div>}
                                            {p.investmentValue && <div><span className="text-slate-500">Nilai Investasi</span><p className="font-semibold">{formatCurrency(p.investmentValue)}</p></div>}
                                            {p.capitalSource && <div><span className="text-slate-500">Sumber Modal</span><p className="font-semibold">{p.capitalSource}</p></div>}
                                            {p.permitType && <div><span className="text-slate-500">Jenis Izin</span><p className="font-semibold">{p.permitType}</p></div>}
                                            {p.workforcePlan && <div><span className="text-slate-500">Tenaga Kerja</span><p className="font-semibold">{p.workforcePlan} orang</p></div>}
                                            {p.assetType && <div><span className="text-slate-500">Jenis Aset</span><p className="font-semibold">{p.assetType}</p></div>}
                                            {p.landArea && <div><span className="text-slate-500">Luas</span><p className="font-semibold">{p.landArea.toLocaleString("id-ID")} m²</p></div>}
                                            {p.offerPrice && <div><span className="text-slate-500">Harga</span><p className="font-semibold">{formatCurrency(p.offerPrice)}</p></div>}
                                            {p.transactionType && <div><span className="text-slate-500">Transaksi</span><p className="font-semibold">{p.transactionType}</p></div>}
                                        </div>
                                        {p.locationAddress && <div className="text-sm"><span className="text-slate-500">Alamat: </span><span className="font-medium">{p.locationAddress}</span></div>}
                                        {p.description && <div className="text-sm"><span className="text-slate-500">Deskripsi: </span><span className="font-medium">{p.description}</span></div>}

                                        {/* Actions — only for SUBMITTED */}
                                        {p.status === "SUBMITTED" && (
                                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleVerify(p.id)}
                                                        disabled={actionLoading === p.id}
                                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2"
                                                    >
                                                        {actionLoading === p.id ? <FiLoader className="animate-spin" /> : <FiCheckCircle />} Verifikasi
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        value={revisionNotes[p.id] || ""}
                                                        onChange={e => setRevisionNotes(prev => ({ ...prev, [p.id]: e.target.value }))}
                                                        placeholder="Catatan revisi (wajib jika minta revisi)..."
                                                        className="flex-1 px-4 py-2.5 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-amber-100 outline-none"
                                                    />
                                                    <button
                                                        onClick={() => handleRevision(p.id)}
                                                        disabled={actionLoading === p.id}
                                                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-2 shrink-0"
                                                    >
                                                        {actionLoading === p.id ? <FiLoader className="animate-spin" /> : <FiAlertTriangle />} Minta Revisi
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
