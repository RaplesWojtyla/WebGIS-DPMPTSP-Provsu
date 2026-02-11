"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    ArrowLeft,
    Loader2,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react"

import {
    getRegenciesWithProvince,
    getPdrbByRegencyYear,
} from "@/lib/actions/pdrb.actions"
import DetailPDRDAdminiSkeleton from "@/components/skeleton/DetailPDRDAdminiSkeleton"

type Regency = {
    id: string
    code: string
    name: string
}

type PdrbValueData = {
    id: string
    value: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    submittedAt: Date | null
    approvedAt: Date | null
    notes: string | null
    sector: {
        id: string
        code: string
        name: string
    }
}

function PdrbDetailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const regencyId = searchParams.get("regencyId")
    const year = searchParams.get("year")

    const [isLoading, setIsLoading] = useState(true)
    const [regency, setRegency] = useState<Regency | null>(null)
    const [pdrbValues, setPdrbValues] = useState<PdrbValueData[]>([])
    const [currentStatus, setCurrentStatus] = useState<string | null>(null)
    const [notes, setNotes] = useState<string | null>(null)

    useEffect(() => {
        if (!regencyId || !year) {
            toast.error("Data wilayah atau tahun tidak valid")
            router.push("/admin/dashboard/pdrb")
            return
        }

        loadData()
    }, [regencyId, year])

    const loadData = async () => {
        setIsLoading(true)

        const regenciesResult = await getRegenciesWithProvince()
        if (regenciesResult.success && regenciesResult.data) {
            const found = regenciesResult.data.find(r => r.id === regencyId)
            if (found) {
                setRegency({ id: found.id, code: found.code, name: found.name })
            }
        }

        const pdrbResult = await getPdrbByRegencyYear(regencyId!, parseInt(year!))
        if (pdrbResult.success && pdrbResult.data) {
            setPdrbValues(pdrbResult.data as PdrbValueData[])

            if (pdrbResult.data.length > 0) {
                setCurrentStatus(pdrbResult.data[0].status)
                setNotes(pdrbResult.data[0].notes)
            }
        }

        setIsLoading(false)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 2
        }).format(val)
    }

    const getTotal = () => {
        return pdrbValues.reduce((acc, curr) => acc + curr.value, 0)
    }

    const getStatusBadge = () => {
        switch (currentStatus) {
            case 'APPROVED':
                return (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> Disetujui
                    </Badge>
                )
            case 'REJECTED':
                return (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Ditolak
                    </Badge>
                )
            case 'PENDING':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Menunggu Review
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        Belum Ada Data
                    </Badge>
                )
        }
    }

    // ...

    if (isLoading) {
        return <DetailPDRDAdminiSkeleton />
    }

    if (!regency) {
        return (
            <div className="p-8 text-center text-red-500">
                Wilayah tidak ditemukan
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-10 w-10"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">
                            Detail Data PDRB
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="font-medium text-gray-900">{regency.name}</span>
                            <span className="text-gray-300">•</span>
                            <span>Tahun {year}</span>
                        </p>
                    </div>
                </div>
                <div>{getStatusBadge()}</div>
            </div>

            {/* Rejection Notes */}
            {currentStatus === 'REJECTED' && notes && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-red-700 mb-1">Catatan Penolakan:</div>
                    <div className="text-red-600">{notes}</div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-1">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[60px] text-center">No</TableHead>
                                <TableHead className="w-[80px]">Kode</TableHead>
                                <TableHead className="min-w-[400px]">Sektor Lapangan Usaha</TableHead>
                                <TableHead className="w-[200px] text-right">Nilai PDRB (Juta Rp)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pdrbValues.length > 0 ? (
                                pdrbValues.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50/30 transition-colors">
                                        <TableCell className="text-center font-medium text-gray-500 bg-gray-50/30">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-gray-500">
                                            {item.sector.code}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-700 py-4">
                                            {item.sector.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="text-right font-mono font-medium text-gray-900 pr-4">
                                                {formatCurrency(item.value)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                                        Belum ada data PDRB untuk wilayah dan tahun ini
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-lg border border-blue-100 w-full md:w-auto">
                            <span className="text-blue-600 font-medium">Total PDRB:</span>
                            <span className="text-xl font-bold font-mono text-blue-700">
                                {formatCurrency(getTotal())}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.back()}
                                className="flex-1 md:flex-none"
                            >
                                Kembali
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PdrbDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <PdrbDetailContent />
        </Suspense>
    )
}
