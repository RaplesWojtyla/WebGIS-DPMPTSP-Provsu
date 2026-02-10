"use client"

import { useState, useEffect, useRef } from "react"
import { FiUsers, FiMap, FiGrid, FiClock, FiCheckCircle, FiXCircle, FiLoader, FiExternalLink, FiFileText } from "react-icons/fi"
import Link from "next/link"
import { getAdminDashboardStats } from "@/lib/actions/pdrb.actions"
import { getProposalStats } from "@/lib/actions/proposal.actions"

interface AdminDashboardData {
    usersCount: number
    regenciesCount: number
    sectorsCount: number
    pendingCount: number
    approvedCount: number
    rejectedCount: number
    recentSubmissions: {
        regencyId: string
        regencyName: string
        regencyCode: string
        year: number
        status: string
        submittedAt: Date | null
        notes: string | null
        sectorCount: number
    }[]
}

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<AdminDashboardData | null>(null)
    const [proposalStats, setProposalStats] = useState({ submitted: 0, verified: 0, total: 0 })
    const hasFetched = useRef(false)

    useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true

        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)

        const [result, pResult] = await Promise.all([
            getAdminDashboardStats(),
            getProposalStats()
        ])
        if (result.success && result.data) {
            setStats(result.data as AdminDashboardData)
        }
        if (pResult.success && pResult.data) {
            setProposalStats(pResult.data)
        }

        setIsLoading(false)
    }

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
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Admin</h1>
                    <p className="text-slate-500 mt-1">Kelola pengguna, wilayah, dan data PDRB.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Link href="/admin/dashboard/users" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiUsers className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-slate-500">Pengguna</span>
                        </div>
                        <div className="text-2xl font-bold">{stats?.usersCount ?? 0}</div>
                    </Link>
                    <Link href="/admin/dashboard/wilayah" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <FiMap className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-sm text-slate-500">Wilayah</span>
                        </div>
                        <div className="text-2xl font-bold">{stats?.regenciesCount ?? 0}</div>
                    </Link>
                    <Link href="/admin/dashboard/sektor" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FiGrid className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm text-slate-500">Sektor</span>
                        </div>
                        <div className="text-2xl font-bold">{stats?.sectorsCount ?? 0}</div>
                    </Link>
                    <Link href="/admin/dashboard/pdrb" className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FiClock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <span className="text-sm text-yellow-600">Pending</span>
                        </div>
                        <div className="text-2xl font-bold text-yellow-700">{stats?.pendingCount ?? 0}</div>
                    </Link>
                    <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiCheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-green-600">Disetujui</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">{stats?.approvedCount ?? 0}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <FiXCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-sm text-red-600">Ditolak</span>
                        </div>
                        <div className="text-2xl font-bold text-red-700">{stats?.rejectedCount ?? 0}</div>
                    </div>
                </div>

                {/* Proposal Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Link href="/admin/dashboard/proposal" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                <FiFileText className="w-4 h-4 text-violet-600" />
                            </div>
                            <span className="text-sm text-slate-500">Total Proposal</span>
                        </div>
                        <div className="text-2xl font-bold">{proposalStats.total}</div>
                    </Link>
                    <Link href="/admin/dashboard/proposal" className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiClock className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-blue-600">Proposal Baru</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700">{proposalStats.submitted}</div>
                    </Link>
                    <Link href="/admin/dashboard/proposal" className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <FiCheckCircle className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-sm text-indigo-600">Menunggu Keputusan</span>
                        </div>
                        <div className="text-2xl font-bold text-indigo-700">{proposalStats.verified}</div>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Pengajuan PDRB Terbaru */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Pengajuan PDRB Terbaru</h2>
                                <p className="text-sm text-slate-500 mt-1">Data PDRB yang disubmit oleh operator</p>
                            </div>
                            <Link
                                href="/admin/dashboard/pdrb"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Lihat Semua →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-slate-600 text-sm">Kabupaten/Kota</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm text-center">Tahun</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm text-center">Sektor</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm text-center">Status</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm">Disubmit</th>
                                        <th className="p-4 font-semibold text-slate-600 text-sm text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!stats?.recentSubmissions.length ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-400">
                                                Belum ada pengajuan data PDRB
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.recentSubmissions.slice(0, 5).map((item) => (
                                            <tr key={`${item.regencyId}-${item.year}`} className="border-b border-slate-50 hover:bg-slate-50/50">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900">{item.regencyName}</div>
                                                    <div className="text-xs text-slate-500">{item.regencyCode}</div>
                                                </td>
                                                <td className="p-4 text-center font-medium">{item.year}</td>
                                                <td className="p-4 text-center text-slate-600">{item.sectorCount} sektor</td>
                                                <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                                                <td className="p-4 text-sm text-slate-600">{formatDate(item.submittedAt)}</td>
                                                <td className="p-4 text-center">
                                                    <Link
                                                        href={`/admin/dashboard/pdrb`}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                                    >
                                                        <FiExternalLink className="w-3 h-3" /> Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Aksi Cepat */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-1">Aksi Cepat</h2>
                        <p className="text-sm text-slate-500 mb-5">Navigasi ke halaman pengelolaan</p>
                        <div className="space-y-3">
                            <Link
                                href="/admin/dashboard/users"
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                            >
                                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <FiUsers className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Kelola Pengguna</p>
                                    <p className="text-xs text-slate-500">{stats?.usersCount ?? 0} pengguna terdaftar</p>
                                </div>
                            </Link>
                            <Link
                                href="/admin/dashboard/wilayah"
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                            >
                                <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <FiMap className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Kelola Wilayah</p>
                                    <p className="text-xs text-slate-500">{stats?.regenciesCount ?? 0} kabupaten/kota</p>
                                </div>
                            </Link>
                            <Link
                                href="/admin/dashboard/sektor"
                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-purple-50 hover:border-purple-200 transition-all group"
                            >
                                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <FiGrid className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Kelola Sektor</p>
                                    <p className="text-xs text-slate-500">{stats?.sectorsCount ?? 0} sektor ekonomi</p>
                                </div>
                            </Link>
                            <Link
                                href="/admin/dashboard/pdrb"
                                className="flex items-center gap-3 p-3 rounded-xl border border-yellow-100 bg-yellow-50/50 hover:bg-yellow-50 hover:border-yellow-200 transition-all group"
                            >
                                <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                    <FiClock className="w-4 h-4 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Review PDRB</p>
                                    <p className="text-xs text-yellow-600 font-medium">{stats?.pendingCount ?? 0} menunggu review</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
