"use client"

import { useState, useEffect, useRef } from "react"
import { FiSend, FiBriefcase, FiHome, FiLoader, FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle, FiEdit2 } from "react-icons/fi"
import { toast } from "sonner"
import { createProposal, updateProposal, getUserProposals, type InvestmentProposalData, type LandOfferProposalData } from "@/lib/actions/proposal.actions"
import { getSectors, getRegenciesWithProvince } from "@/lib/actions/pdrb.actions"

type TabType = "form" | "list"

type SectorOption = { id: string; name: string }
type RegencyOption = { id: string; name: string }

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    SUBMITTED: { label: "Dikirim", color: "bg-blue-100 text-blue-700", icon: FiClock },
    VERIFIED: { label: "Diverifikasi", color: "bg-indigo-100 text-indigo-700", icon: FiCheckCircle },
    REVISION: { label: "Perlu Revisi", color: "bg-amber-100 text-amber-700", icon: FiAlertTriangle },
    APPROVED: { label: "Disetujui", color: "bg-green-100 text-green-700", icon: FiCheckCircle },
    REJECTED: { label: "Ditolak", color: "bg-red-100 text-red-700", icon: FiXCircle },
}

export default function UserProposalPage() {
    const [tab, setTab] = useState<TabType>("form")
    const [proposalType, setProposalType] = useState<"investor" | "owner" | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [sectors, setSectors] = useState<SectorOption[]>([])
    const [regencies, setRegencies] = useState<RegencyOption[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [proposals, setProposals] = useState<any[]>([])
    const hasFetched = useRef(false)

    // Investment form
    const [inv, setInv] = useState<InvestmentProposalData>({
        title: "", sectorId: "", regencyId: "", description: "",
        permitType: "Izin Prinsip", investmentValue: 0, capitalSource: "PMDN",
        workforcePlan: 0, locationAddress: "", landArea: 0,
    })

    // Land offer form
    const [land, setLand] = useState<LandOfferProposalData>({
        title: "", sectorId: "", regencyId: "", description: "",
        assetType: "Lahan Kosong", landArea: 0, offerPrice: 0,
        transactionType: "Jual", locationAddress: "",
    })

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const [sectorRes, regencyRes, proposalRes] = await Promise.all([
            getSectors(),
            getRegenciesWithProvince(),
            getUserProposals(),
        ])
        if (sectorRes.success && sectorRes.data) setSectors(sectorRes.data.map(s => ({ id: s.id, name: s.name })))
        if (regencyRes.success && regencyRes.data) setRegencies(regencyRes.data.map(r => ({ id: r.id, name: r.name })))
        if (proposalRes.success && proposalRes.data) setProposals(proposalRes.data)
        setIsLoading(false)
    }

    const handleInvChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setInv(prev => ({ ...prev, [name]: ["investmentValue", "workforcePlan", "landArea"].includes(name) ? Number(value) : value }))
    }

    const handleLandChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setLand(prev => ({ ...prev, [name]: ["landArea", "offerPrice"].includes(name) ? Number(value) : value }))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEditProposal = (p: any) => {
        setEditingId(p.id)
        if (p.type === "INVESTMENT") {
            setProposalType("investor")
            setInv({
                title: p.title || "",
                sectorId: p.sectorId || "",
                regencyId: p.regencyId || "",
                description: p.description || "",
                permitType: p.permitType || "Izin Prinsip",
                investmentValue: p.investmentValue || 0,
                capitalSource: p.capitalSource || "PMDN",
                workforcePlan: p.workforcePlan || 0,
                locationAddress: p.locationAddress || "",
                landArea: p.landArea || 0,
            })
        } else {
            setProposalType("owner")
            setLand({
                title: p.title || "",
                sectorId: p.sectorId || "",
                regencyId: p.regencyId || "",
                description: p.description || "",
                assetType: p.assetType || "Lahan Kosong",
                landArea: p.landArea || 0,
                offerPrice: p.offerPrice || 0,
                transactionType: p.transactionType || "Jual",
                locationAddress: p.locationAddress || "",
            })
        }
        setTab("form")
    }

    const resetForm = () => {
        setEditingId(null)
        setInv({ title: "", sectorId: "", regencyId: "", description: "", permitType: "Izin Prinsip", investmentValue: 0, capitalSource: "PMDN", workforcePlan: 0, locationAddress: "", landArea: 0 })
        setLand({ title: "", sectorId: "", regencyId: "", description: "", assetType: "Lahan Kosong", landArea: 0, offerPrice: 0, transactionType: "Jual", locationAddress: "" })
        setProposalType(null)
    }

    const handleSubmitInvestment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inv.title || !inv.sectorId || !inv.regencyId || !inv.investmentValue) {
            toast.error("Harap lengkapi semua field wajib"); return
        }
        setIsSaving(true)
        const result = editingId
            ? await updateProposal(editingId, "INVESTMENT", inv)
            : await createProposal("INVESTMENT", inv)
        if (result.success) {
            toast.success(editingId ? "Proposal berhasil diperbarui & dikirim ulang!" : "Proposal investasi berhasil dikirim!")
            resetForm()
            const res = await getUserProposals()
            if (res.success && res.data) setProposals(res.data)
            setTab("list")
        } else {
            toast.error(result.error || "Gagal mengirim proposal")
        }
        setIsSaving(false)
    }

    const handleSubmitLandOffer = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!land.title || !land.regencyId || !land.landArea || !land.assetType) {
            toast.error("Harap lengkapi semua field wajib"); return
        }
        setIsSaving(true)
        const result = editingId
            ? await updateProposal(editingId, "LAND_OFFER", land)
            : await createProposal("LAND_OFFER", land)
        if (result.success) {
            toast.success(editingId ? "Proposal berhasil diperbarui & dikirim ulang!" : "Penawaran lokasi berhasil dikirim!")
            resetForm()
            const res = await getUserProposals()
            if (res.success && res.data) setProposals(res.data)
            setTab("list")
        } else {
            toast.error(result.error || "Gagal mengirim penawaran")
        }
        setIsSaving(false)
    }

    const formatCurrency = (v: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-800">Pengajuan & Penawaran</h1>
                <p className="text-slate-500 mt-2 max-w-2xl">Ajukan proposal investasi atau tawarkan lokasi Anda.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                <button onClick={() => setTab("form")} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab === "form" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                    Buat Proposal
                </button>
                <button onClick={() => setTab("list")} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab === "list" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                    Riwayat ({proposals.length})
                </button>
            </div>

            {tab === "form" && (
                <>
                    {/* Editing banner */}
                    {editingId && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2 text-amber-800">
                                <FiEdit2 />
                                <span className="font-semibold text-sm">Mode Edit — Perbaiki data lalu kirim ulang.</span>
                            </div>
                            <button onClick={() => { resetForm(); }} className="text-xs font-bold text-amber-700 hover:text-amber-900 underline">Batal Edit</button>
                        </div>
                    )}

                    {/* Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => setProposalType("investor")}
                            className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${proposalType === 'investor' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${proposalType === 'investor' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                <FiBriefcase size={28} />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${proposalType === 'investor' ? 'text-blue-900' : 'text-slate-800'}`}>Saya Ingin Berinvestasi</h3>
                            <p className="text-slate-500 text-sm">Ajukan permohonan izin prinsip atau kemitraan untuk menanamkan modal di Sumatera Utara.</p>
                        </button>

                        <button
                            onClick={() => setProposalType("owner")}
                            className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${proposalType === 'owner' ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${proposalType === 'owner' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                                <FiHome size={28} />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${proposalType === 'owner' ? 'text-emerald-900' : 'text-slate-800'}`}>Saya Menawarkan Lokasi</h3>
                            <p className="text-slate-500 text-sm">Daftarkan lahan atau aset potensial Anda agar dapat dilirik oleh investor.</p>
                        </button>
                    </div>

                    {/* INVESTMENT FORM */}
                    {proposalType === "investor" && (
                        <form onSubmit={handleSubmitInvestment} className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                                <h2 className="text-xl font-bold flex items-center gap-2"><FiBriefcase /> Formulir Investor</h2>
                                <p className="opacity-90 text-sm mt-1">Isi detail investasi yang akan Anda jalankan.</p>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                    <h3 className="font-bold text-slate-800 border-b pb-4">1. Rencana Proyek</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Proyek <span className="text-red-500">*</span></label>
                                        <input name="title" value={inv.title} onChange={handleInvChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Pembangunan Pabrik Kelapa Sawit" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Sektor <span className="text-red-500">*</span></label>
                                            <select name="sectorId" value={inv.sectorId} onChange={handleInvChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none">
                                                <option value="">Pilih sektor...</option>
                                                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi Target <span className="text-red-500">*</span></label>
                                            <select name="regencyId" value={inv.regencyId} onChange={handleInvChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none">
                                                <option value="">Pilih Kab/Kota...</option>
                                                {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Izin</label>
                                        <select name="permitType" value={inv.permitType} onChange={handleInvChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none">
                                            <option>Izin Prinsip</option>
                                            <option>Kemitraan</option>
                                            <option>Lainnya</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                    <h3 className="font-bold text-slate-800 border-b pb-4">2. Kapasitas & Nilai</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Estimasi Nilai Investasi (Rp) <span className="text-red-500">*</span></label>
                                        <input name="investmentValue" type="number" value={inv.investmentValue || ""} onChange={handleInvChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="1000000000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Sumber Modal</label>
                                            <select name="capitalSource" value={inv.capitalSource} onChange={handleInvChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none">
                                                <option value="PMDN">PMDN (Dalam Negeri)</option>
                                                <option value="PMA">PMA (Asing)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Rencana Tenaga Kerja</label>
                                            <input name="workforcePlan" type="number" value={inv.workforcePlan || ""} onChange={handleInvChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="50" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Rencana Lokasi</label>
                                        <textarea name="locationAddress" value={inv.locationAddress} onChange={handleInvChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none h-24" placeholder="Jl. ..." />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi / Catatan</label>
                                        <textarea name="description" value={inv.description} onChange={handleInvChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none h-24" placeholder="Informasi tambahan..." />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                {isSaving ? <><FiLoader className="animate-spin" /> Mengirim...</> : <><FiSend size={20} /> {editingId ? "Kirim Ulang Proposal" : "Kirim Permohonan Investasi"}</>}
                            </button>
                        </form>
                    )}

                    {/* LAND OFFER FORM */}
                    {proposalType === "owner" && (
                        <form onSubmit={handleSubmitLandOffer} className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                                <h2 className="text-xl font-bold flex items-center gap-2"><FiHome /> Formulir Penawaran Lokasi</h2>
                                <p className="opacity-90 text-sm mt-1">Daftarkan aset Anda untuk database peluang investasi daerah.</p>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                    <h3 className="font-bold text-slate-800 border-b pb-4">1. Spesifikasi Lahan / Aset</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Penawaran <span className="text-red-500">*</span></label>
                                        <input name="title" value={land.title} onChange={handleLandChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="e.g. Lahan Industri Siap Bangun di Binjai" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Aset <span className="text-red-500">*</span></label>
                                            <select name="assetType" value={land.assetType} onChange={handleLandChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none">
                                                <option>Lahan Kosong</option>
                                                <option>Bangunan</option>
                                                <option>Gudang</option>
                                                <option>Pabrik</option>
                                                <option>Lainnya</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Kabupaten/Kota <span className="text-red-500">*</span></label>
                                            <select name="regencyId" value={land.regencyId} onChange={handleLandChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none">
                                                <option value="">Pilih Kab/Kota...</option>
                                                {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Luas Area (m²) <span className="text-red-500">*</span></label>
                                            <input name="landArea" type="number" step="0.01" value={land.landArea || ""} onChange={handleLandChange} required className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Harga Penawaran (Rp)</label>
                                            <input name="offerPrice" type="number" value={land.offerPrice || ""} onChange={handleLandChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                    <h3 className="font-bold text-slate-800 border-b pb-4">2. Detail & Transaksi</h3>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Transaksi <span className="text-red-500">*</span></label>
                                        <select name="transactionType" value={land.transactionType} onChange={handleLandChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none">
                                            <option>Jual</option>
                                            <option>Sewa</option>
                                            <option>Kerjasama</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sektor yang Cocok</label>
                                        <select name="sectorId" value={land.sectorId} onChange={handleLandChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none">
                                            <option value="">Semua sektor</option>
                                            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap</label>
                                        <textarea name="locationAddress" value={land.locationAddress} onChange={handleLandChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none h-24" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi / Keunggulan Lokasi</label>
                                        <textarea name="description" value={land.description} onChange={handleLandChange} className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-100 outline-none h-24" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                                {isSaving ? <><FiLoader className="animate-spin" /> Mengirim...</> : <><FiSend size={20} /> {editingId ? "Kirim Ulang Penawaran" : "Daftarkan Lokasi Saya"}</>}
                            </button>
                        </form>
                    )}
                </>
            )}

            {/* PROPOSAL LIST */}
            {tab === "list" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    {proposals.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <FiBriefcase className="mx-auto mb-4" size={40} />
                            <p className="text-lg font-semibold">Belum ada proposal</p>
                            <p className="text-sm">Mulai dengan membuat proposal baru di tab &quot;Buat Proposal&quot;.</p>
                        </div>
                    ) : (
                        proposals.map((p) => {
                            const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.SUBMITTED
                            const StatusIcon = status.icon
                            return (
                                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                                    <StatusIcon size={12} /> {status.label}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.type === "INVESTMENT" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                                                    {p.type === "INVESTMENT" ? "Investasi" : "Penawaran Lokasi"}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-lg truncate">{p.title}</h3>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                                                {p.sector && <span>Sektor: {p.sector.name}</span>}
                                                {p.regency && <span>Lokasi: {p.regency.name}</span>}
                                                {p.investmentValue && <span>Nilai: {formatCurrency(p.investmentValue)}</span>}
                                                {p.landArea && <span>Luas: {p.landArea.toLocaleString("id-ID")} m²</span>}
                                            </div>
                                            {p.operatorNotes && p.status === "REVISION" && (
                                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                                                    <span className="font-semibold">Catatan Operator:</span> {p.operatorNotes}
                                                </div>
                                            )}
                                            {p.status === "REVISION" && (
                                                <button
                                                    onClick={() => handleEditProposal(p)}
                                                    className="mt-3 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
                                                >
                                                    <FiEdit2 size={14} /> Edit & Kirim Ulang
                                                </button>
                                            )}
                                            {p.adminNotes && (p.status === "APPROVED" || p.status === "REJECTED") && (
                                                <div className={`mt-3 p-3 rounded-xl text-sm border ${p.status === "APPROVED" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                                                    <span className="font-semibold">Catatan Admin:</span> {p.adminNotes}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-400 shrink-0 text-right">
                                            {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}
