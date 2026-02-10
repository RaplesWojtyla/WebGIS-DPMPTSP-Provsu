"use client"

import { FiClock, FiCheckCircle, FiXCircle, FiExternalLink } from "react-icons/fi"
import Link from "next/link"

interface PdrbSubmission {
    regencyId: string
    regencyCode: string
    regencyName: string
    year: number
    sectorCount: number
    status: string
    submittedAt: Date | null
    notes: string | null
}

interface AnalysisStatusProps {
    submissions: PdrbSubmission[]
}

export default function AnalysisStatus({ submissions }: AnalysisStatusProps) {
    // Stats for status pengajuan
    const submissionStats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'PENDING').length,
        approved: submissions.filter(s => s.status === 'APPROVED').length,
        rejected: submissions.filter(s => s.status === 'REJECTED').length
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                        <FiCheckCircle className="w-3 h-3" /> Disetujui
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
                        <FiXCircle className="w-3 h-3" /> Ditolak
                    </span>
                )
            case 'PENDING':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
                        <FiClock className="w-3 h-3" /> Pending
                    </span>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="text-sm text-gray-500">Total Pengajuan</div>
                    <div className="text-2xl font-bold">{submissionStats.total}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-100">
                    <div className="text-sm text-yellow-600">Pending</div>
                    <div className="text-2xl font-bold text-yellow-700">{submissionStats.pending}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-100">
                    <div className="text-sm text-green-600">Disetujui</div>
                    <div className="text-2xl font-bold text-green-700">{submissionStats.approved}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
                    <div className="text-sm text-red-600">Ditolak</div>
                    <div className="text-2xl font-bold text-red-700">{submissionStats.rejected}</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
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
    )
}
