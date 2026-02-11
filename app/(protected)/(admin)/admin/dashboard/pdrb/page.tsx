"use client"

import React, { useState, useEffect, useTransition, useMemo } from "react"
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileSpreadsheet,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
    getAllPdrbForReview,
    approvePdrb,
    rejectPdrb,
} from "@/lib/actions/pdrb.actions"
import { authClient } from "@/lib/better-auth/auth-client"
import PDRBAdminSkeleton from "@/components/skeleton/PDRBAdminSkeleton"

const ITEMS_PER_PAGE = 10
const YEARS = ["2024", "2023", "2022", "2021", "2020"]

export default function PdrbAdminPage() {
    const { data: session } = authClient.useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const [pdrbData, setPdrbData] = useState<PdrbData[]>([])
    const [selectedYear, setSelectedYear] = useState<string>("2024")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Dialog State
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<GroupedPdrb | null>(null)
    const [rejectNotes, setRejectNotes] = useState("")

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)

        const result = await getAllPdrbForReview()

        if (result.success && result.data) {
            setPdrbData(result.data as PdrbData[])
        }

        setIsLoading(false)
    }



    const groupedData = useMemo(() => {
        const groups = new Map<string, GroupedPdrb>()

        pdrbData
            .filter(d => d.year === parseInt(selectedYear))
            .forEach(d => {
                const key = `${d.regencyId}-${d.year}`
                const existing = groups.get(key)

                if (existing) {
                    existing.totalValue += d.value
                    existing.sectorCount += 1

                    if (d.status === 'PENDING') existing.status = 'PENDING'
                    else if (d.status === 'REJECTED' && existing.status !== 'PENDING') {
                        existing.status = 'REJECTED'
                    }
                } else {
                    groups.set(key, {
                        regencyId: d.regencyId,
                        regencyName: d.regency.name,
                        regencyCode: d.regency.code,
                        year: d.year,
                        totalValue: d.value,
                        sectorCount: 1,
                        status: d.status,
                        submittedAt: d.submittedAt
                    })
                }
            })

        return Array.from(groups.values())
    }, [pdrbData, selectedYear])

    const filteredData = useMemo(() => {
        return groupedData
            .filter(d => statusFilter === 'all' || d.status === statusFilter)
            .filter(d => d.regencyName.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [groupedData, statusFilter, searchTerm])

    // Pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Helpers
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(val)
    }

    const formatDate = (date: Date | null) => {
        if (!date) return "-"
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }

    const getStatusBadge = (status: PdrbStatus) => {
        switch (status) {
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
            default:
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Menunggu
                    </Badge>
                )
        }
    }

    const handleApprove = (item: GroupedPdrb) => {
        setSelectedItem(item)
        setIsApproveDialogOpen(true)
    }

    const handleReject = (item: GroupedPdrb) => {
        setSelectedItem(item)
        setRejectNotes("")
        setIsRejectDialogOpen(true)
    }

    const confirmApprove = () => {
        if (!selectedItem || !session?.user?.id) return

        startTransition(async () => {
            const result = await approvePdrb(selectedItem.regencyId, selectedItem.year, session.user.id)

            if (result.success) {
                toast.success(`Data PDRB ${selectedItem.regencyName} disetujui`)
                loadData()
            } else {
                toast.error(result.error || "Gagal menyetujui data")
            }

            setIsApproveDialogOpen(false)
            setSelectedItem(null)
        })
    }

    const confirmReject = () => {
        if (!selectedItem || !session?.user?.id) return

        startTransition(async () => {
            const result = await rejectPdrb(
                selectedItem.regencyId,
                selectedItem.year,
                session.user.id,
                rejectNotes
            )

            if (result.success) {
                toast.success(`Data PDRB ${selectedItem.regencyName} ditolak`)
                loadData()
            } else {
                toast.error(result.error || "Gagal menolak data")
            }

            setIsRejectDialogOpen(false)
            setSelectedItem(null)
            setRejectNotes("")
        })
    }

    // Export
    const downloadCSV = () => {
        const headers = ["No", "Kabupaten", "Kode", "Total PDRB", "Jumlah Sektor", "Status", "Tanggal Submit"]
        const rows = filteredData.map((d, i) => [
            i + 1,
            d.regencyName,
            d.regencyCode,
            d.totalValue,
            d.sectorCount,
            d.status,
            formatDate(d.submittedAt)
        ])

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(v => `"${v}"`).join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `pdrb_review_${selectedYear}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const downloadPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text(`Laporan Review PDRB Tahun ${selectedYear}`, 14, 22)
        doc.setFontSize(11)
        doc.setTextColor(100)
        doc.text(`Status: ${statusFilter === 'all' ? 'Semua' : statusFilter}`, 14, 30)

        const headers = [["No", "Kabupaten", "Total PDRB", "Sektor", "Status"]]
        const rows = filteredData.map((d, i) => [
            i + 1,
            d.regencyName,
            formatCurrency(d.totalValue),
            d.sectorCount,
            d.status
        ])

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 40,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [37, 99, 235] },
        })

        doc.save(`pdrb_review_${selectedYear}.pdf`)
    }

    // Stats
    const stats = useMemo(() => {
        const pending = groupedData.filter(d => d.status === 'PENDING').length
        const approved = groupedData.filter(d => d.status === 'APPROVED').length
        const rejected = groupedData.filter(d => d.status === 'REJECTED').length
        return { pending, approved, rejected, total: groupedData.length }
    }, [groupedData])

    if (isLoading) {
        return <PDRBAdminSkeleton />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Review Data PDRB</h1>
                <p className="text-gray-500">Setujui atau tolak data PDRB yang diajukan oleh Operator.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
                    <div className="text-sm text-yellow-600">Menunggu</div>
                    <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="text-sm text-green-600">Disetujui</div>
                    <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                    <div className="text-sm text-red-600">Ditolak</div>
                    <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-full md:w-[120px]">
                            <SelectValue placeholder="Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="PENDING">Menunggu</SelectItem>
                            <SelectItem value="APPROVED">Disetujui</SelectItem>
                            <SelectItem value="REJECTED">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-full md:w-[280px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari kabupaten..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={downloadCSV} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                    </Button>
                    <Button onClick={downloadPDF} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                        <FileText className="mr-2 h-4 w-4" /> PDF
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead>Kabupaten</TableHead>
                            <TableHead className="text-right">Total PDRB</TableHead>
                            <TableHead className="text-center">Sektor</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Diajukan</TableHead>
                            <TableHead className="text-center w-[180px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={`${item.regencyId}-${item.year}`} className="hover:bg-gray-50">
                                <TableCell className="text-center text-gray-500">
                                    {startIndex + index + 1}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.regencyName}</span>
                                        <span className="text-xs text-gray-400">{item.regencyCode}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {formatCurrency(item.totalValue)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline">{item.sectorCount} sektor</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {getStatusBadge(item.status)}
                                </TableCell>
                                <TableCell className="text-center text-sm text-gray-500">
                                    {formatDate(item.submittedAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.status === 'PENDING' ? (
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApprove(item)}
                                                disabled={isPending}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Setujui
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                                onClick={() => handleReject(item)}
                                                disabled={isPending}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" /> Tolak
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                                    {groupedData.length === 0
                                        ? "Belum ada data PDRB yang diajukan"
                                        : "Tidak ada data yang sesuai filter"
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-gray-50/50">
                    <div className="text-sm text-gray-500">
                        Menampilkan <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> data
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm mx-2">{currentPage} / {totalPages || 1}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages}>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Setujui Data PDRB?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data PDRB <strong>{selectedItem?.regencyName}</strong> tahun {selectedItem?.year} akan disetujui
                            dan ditampilkan di halaman publik.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmApprove}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Setujui
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Data PDRB</DialogTitle>
                        <DialogDescription>
                            Berikan alasan penolakan untuk data PDRB <strong>{selectedItem?.regencyName}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Alasan penolakan (opsional)..."
                            value={rejectNotes}
                            onChange={(e) => setRejectNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isPending}>
                            Batal
                        </Button>
                        <Button
                            onClick={confirmReject}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tolak
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
