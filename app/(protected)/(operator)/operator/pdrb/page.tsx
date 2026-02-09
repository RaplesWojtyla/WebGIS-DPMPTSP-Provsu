"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Search,
    Pencil,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileSpreadsheet,
    FileText,
    MoreHorizontal,
    Loader2,
    CheckCircle,
    Clock,
    XCircle,
    Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
    getRegenciesWithProvince,
    getSectors,
    getPdrbSummaryByYear,
} from "@/lib/actions/pdrb.actions"

const YEARS = ["2024", "2023", "2022", "2021", "2020"]
const ITEMS_PER_PAGE = 10

type Regency = {
    id: string
    code: string
    name: string
    province: { name: string }
}

type Sector = {
    id: string
    code: string
    name: string
}

type RegencyPdrbData = {
    regencyId: string
    regencyName: string
    regencyCode: string
    total: number
    sectorCount: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | null
    submittedAt: Date | null
}

export default function PdrbPage() {
    const [isLoading, setIsLoading] = useState(true)

    const [regencies, setRegencies] = useState<Regency[]>([])
    const [sectors, setSectors] = useState<Sector[]>([])
    const [pdrbData, setPdrbData] = useState<RegencyPdrbData[]>([])

    const [selectedYear, setSelectedYear] = useState<string>("2024")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)

    // Load all data in one effect
    useEffect(() => {
        loadAllData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear])

    const loadAllData = async () => {
        setIsLoading(true)

        // Fetch all data in parallel
        const [regenciesResult, sectorsResult, pdrbSummaryResult] = await Promise.all([
            getRegenciesWithProvince(),
            getSectors(),
            getPdrbSummaryByYear(parseInt(selectedYear))
        ])

        if (!regenciesResult.success || !regenciesResult.data) {
            toast.error("Gagal memuat data kabupaten")
            setIsLoading(false)
            return
        }

        const regenciesData = regenciesResult.data as Regency[]
        setRegencies(regenciesData)

        if (sectorsResult.success && sectorsResult.data) {
            setSectors(sectorsResult.data as Sector[])
        }

        // Map regencies to PDRB data
        const pdrbSummary = pdrbSummaryResult.success && pdrbSummaryResult.data
            ? pdrbSummaryResult.data
            : {}

        const mappedData: RegencyPdrbData[] = regenciesData.map(regency => {
            const summary = pdrbSummary[regency.id]
            return {
                regencyId: regency.id,
                regencyName: regency.name,
                regencyCode: regency.code,
                total: summary?.total || 0,
                sectorCount: summary?.sectorCount || 0,
                status: summary?.status as RegencyPdrbData['status'] || null,
                submittedAt: summary?.submittedAt || null
            }
        })

        setPdrbData(mappedData)
        setIsLoading(false)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 2
        }).format(val)
    }

    const getStatusBadge = (status: string | null) => {
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
            case 'PENDING':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        Belum Diisi
                    </Badge>
                )
        }
    }

    // Filter & Search
    const filteredData = useMemo(() => {
        return pdrbData
            .filter(d => {
                if (statusFilter === "all") return true
                if (statusFilter === "empty") return d.status === null
                return d.status === statusFilter
            })
            .filter(d =>
                d.regencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.regencyCode.includes(searchTerm)
            )
    }, [pdrbData, statusFilter, searchTerm])

    // Pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    // Stats
    const stats = useMemo(() => {
        const total = pdrbData.length
        const filled = pdrbData.filter(d => d.total > 0).length
        const pending = pdrbData.filter(d => d.status === 'PENDING').length
        const approved = pdrbData.filter(d => d.status === 'APPROVED').length
        const rejected = pdrbData.filter(d => d.status === 'REJECTED').length
        return { total, filled, pending, approved, rejected }
    }, [pdrbData])

    // Export CSV
    const downloadCSV = () => {
        const headers = ["No", "Kode", "Kabupaten/Kota", "Total PDRB", "Jumlah Sektor", "Status"]
        const rows = filteredData.map((d, i) => [
            i + 1,
            d.regencyCode,
            d.regencyName,
            d.total,
            d.sectorCount,
            d.status || "Belum Diisi"
        ])

        const csvContent = "data:text/csv;charset=utf-8," +
            headers.join(",") + "\n" +
            rows.map(row => row.map(v => `"${v}"`).join(",")).join("\n")

        const link = document.createElement("a")
        link.setAttribute("href", encodeURI(csvContent))
        link.setAttribute("download", `pdrb_${selectedYear}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Export PDF
    const downloadPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(16)
        doc.text(`Laporan PDRB Tahun ${selectedYear}`, 14, 20)
        doc.setFontSize(10)
        doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 28)

        autoTable(doc, {
            startY: 35,
            head: [["No", "Kode", "Kabupaten/Kota", "Total PDRB", "Sektor", "Status"]],
            body: filteredData.map((d, i) => [
                i + 1,
                d.regencyCode,
                d.regencyName,
                formatCurrency(d.total),
                d.sectorCount > 0 ? `${d.sectorCount}/${sectors.length}` : "-",
                d.status || "Belum Diisi"
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [59, 130, 246] }
        })

        doc.save(`pdrb_${selectedYear}.pdf`)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Data PDRB</h1>
                <p className="text-muted-foreground">
                    Input dan kelola data PDRB per kabupaten/kota
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="text-sm text-gray-500">Total Wilayah</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                    <div className="text-sm text-blue-600">Terisi</div>
                    <div className="text-2xl font-bold text-blue-700">{stats.filled}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
                    <div className="text-sm text-yellow-600">Pending</div>
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
            <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map(y => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="empty">Belum Diisi</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Disetujui</SelectItem>
                            <SelectItem value="REJECTED">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="relative w-full sm:w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari kabupaten..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={downloadCSV} disabled={isLoading}>
                        <FileSpreadsheet className="w-4 h-4 mr-2" /> CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadPDF} disabled={isLoading}>
                        <FileText className="w-4 h-4 mr-2" /> PDF
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[50px] text-center">No</TableHead>
                                <TableHead className="w-[80px]">Kode</TableHead>
                                <TableHead>Kabupaten/Kota</TableHead>
                                <TableHead className="text-right">Total PDRB</TableHead>
                                <TableHead className="text-center">Sektor</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center w-[80px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((item, index) => (
                                <TableRow key={item.regencyId} className="hover:bg-gray-50">
                                    <TableCell className="text-center text-gray-500">
                                        {startIndex + index + 1}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {item.regencyCode}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.regencyName}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {item.total > 0 ? formatCurrency(item.total) : "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.sectorCount > 0 ? `${item.sectorCount}/${sectors.length}` : "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getStatusBadge(item.status)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/operator/pdrb/form?regencyId=${item.regencyId}&year=${selectedYear}`}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        {item.total > 0 ? "Edit Data" : "Input Data"}
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {paginatedData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                                        {searchTerm || statusFilter !== "all"
                                            ? "Tidak ada data yang sesuai filter"
                                            : "Tidak ada data kabupaten"
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* Pagination */}
                {!isLoading && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t bg-gray-50/50">
                        <div className="text-sm text-gray-500">
                            Menampilkan <span className="font-medium">{Math.min(startIndex + 1, filteredData.length)}</span> - <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> data
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
                )}
            </div>
        </div>
    )
}
