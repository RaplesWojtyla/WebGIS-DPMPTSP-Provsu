"use client";

import React, { useState, useMemo, useEffect } from "react";
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
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SECTORS, REGIONS, YEARS, STORAGE_KEY_PREFIX, PdrbValue } from "./constants";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Mock Data Store ---
// In a real app, this would be fetched from DB.
const INITIAL_DB: Record<string, PdrbValue[]> = {
    // Sample Data for Medan 2023
    "2023-1275": SECTORS.map((_, idx) => ({ sectorIndex: idx, value: Math.random() * 1000000 }))
};

export default function PdrbPage() {
    const [selectedYear, setSelectedYear] = useState<string>("2023");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Local state to force re-render when returning from form and to hold merged data
    const [dataMap, setDataMap] = useState<Record<string, PdrbValue[]>>({ ...INITIAL_DB });

    // Load data from localStorage on mount and when year changes
    useEffect(() => {
        const newDataMap = { ...INITIAL_DB };
        REGIONS.forEach(region => {
            const key = `${STORAGE_KEY_PREFIX}${selectedYear}-${region.id}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    newDataMap[`${selectedYear}-${region.id}`] = parsed;
                } catch {
                    // ignore err
                }
            }
        });
        setDataMap(newDataMap);
    }, [selectedYear]);

    // --- Helpers ---
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 2 }).format(val);
    };

    // Flatten data for export (Region + 17 Sectors)
    const getAllDataForExport = () => {
        return REGIONS.map(region => {
            const key = `${selectedYear}-${region.id}`;
            const values = dataMap[key] || [];

            // Map sector values to their index for easier access
            const sectorValues: Record<string, number> = {};
            SECTORS.forEach((s, idx) => {
                const found = values.find(v => v.sectorIndex === idx);
                sectorValues[`sector_${idx}`] = found ? found.value : 0;
            });

            const total = values.reduce((acc, curr) => acc + curr.value, 0);

            return {
                no: 0,
                name: region.name,
                type: region.type,
                total: total,
                status: total > 0 ? "Terisi" : "Belum",
                ...sectorValues
            };
        });
    };

    const downloadCSV = () => {
        const data = getAllDataForExport();
        const headers = [
            "Nama Wilayah",
            "Tipe",
            "Total PDRB",
            "Status",
            ...SECTORS.map((s, i) => `Sektor ${i + 1}`)
        ];

        const rows = data.map(item => [
            item.name,
            item.type,
            item.total,
            item.status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...SECTORS.map((_, i) => (item as any)[`sector_${i}`] as number)
        ]);

        const csvContent = "data:text/csv;charset=utf-8," +
            headers.join(",") + "\n" +
            rows.map(row => row.map(v => `"${v}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `data_pdrb_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Laporan Data PDRB Tahun ${selectedYear}`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Provinsi Sumatera Utara`, 14, 30);

        const headers = [[
            "No", "Nama Wilayah", "Tipe", "Total PDRB (Juta RP)", "Status"
        ]];

        const data = getAllDataForExport();
        const rows = data.map((item, index) => [
            index + 1,
            item.name,
            item.type,
            formatCurrency(item.total),
            item.status
        ]);

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 40,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [22, 163, 74] },
        });
        doc.save(`laporan_pdrb_${selectedYear}.pdf`);
    };

    // --- Single Region Export ---

    const downloadRegionCSV = (region: typeof REGIONS[0]) => {
        const key = `${selectedYear}-${region.id}`;
        const values = dataMap[key] || [];

        // Prepare rows: Sector Name, Value
        const rows = SECTORS.map((sector, idx) => {
            const found = values.find(v => v.sectorIndex === idx);
            return [sector, found ? found.value : 0];
        });

        const total = values.reduce((acc, curr) => acc + curr.value, 0);
        rows.push(["TOTAL PDRB", total]);

        const csvContent = "data:text/csv;charset=utf-8," +
            "Sektor Lapangan Usaha,Nilai PDRB (Juta RP)\n" +
            rows.map(row => `"${row[0]}",${row[1]}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `pdrb_${region.name.replace(/ /g, "_")}_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadRegionPDF = (region: typeof REGIONS[0]) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(14);
        doc.text(`Detail PDRB: ${region.name}`, 14, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Tahun: ${selectedYear} | Tipe: ${region.type}`, 14, 28);

        const key = `${selectedYear}-${region.id}`;
        const values = dataMap[key] || [];
        const total = values.reduce((acc, curr) => acc + curr.value, 0);

        const headers = [["No", "Sektor Lapangan Usaha", "Nilai (Juta RP)"]];
        const rows = SECTORS.map((sector, idx) => {
            const found = values.find(v => v.sectorIndex === idx);
            return [
                idx + 1,
                sector,
                formatCurrency(found ? found.value : 0)
            ];
        });

        // Add Total Row
        rows.push(["", "TOTAL PDRB", formatCurrency(total)]);

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [37, 99, 235] }, // Blue
            columnStyles: {
                2: { halign: 'right' }
            },
            didParseCell: function (data) {
                if (data.row.index === rows.length - 1) {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [240, 249, 255];
                }
            }
        });

        doc.save(`pdrb_${region.name.replace(/ /g, "_")}_${selectedYear}.pdf`);
    };


    // --- Filter & Pagination Logic ---

    const filteredRegions = useMemo(() => {
        return REGIONS.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.ceil(filteredRegions.length / ITEMS_PER_PAGE);
    const paginatedRegions = filteredRegions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Get Total from dataMap
    const getRegionTotal = (regionId: string) => {
        const key = `${selectedYear}-${regionId}`;
        const data = dataMap[key];
        if (!data) return 0;
        return data.reduce((acc, curr) => acc + curr.value, 0);
    };

    const getStatus = (regionId: string) => {
        const total = getRegionTotal(regionId);
        return total > 0 ? "Terisi" : "Belum";
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data PDRB Wilayah</h1>
                <p className="text-gray-500">Kelola data PDRB per sektor untuk setiap Kabupaten/Kota.</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full md:w-[150px] font-medium"><SelectValue placeholder="Tahun" /></SelectTrigger>
                        <SelectContent>
                            {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Cari wilayah..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex gap-2 w-full xl:w-auto">
                    <Button onClick={downloadCSV} variant="outline" className="flex-1 xl:flex-none border-green-200 text-green-700 hover:bg-green-50">
                        <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                    </Button>
                    <Button onClick={downloadPDF} variant="outline" className="flex-1 xl:flex-none border-red-200 text-red-700 hover:bg-red-50">
                        <FileText className="mr-2 h-4 w-4" /> PDF
                    </Button>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead>Nama Wilayah</TableHead>
                            <TableHead className="text-right">Total PDRB (Juta RP)</TableHead>
                            <TableHead className="text-center w-[150px]">Status</TableHead>
                            <TableHead className="text-center w-[100px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRegions.map((region, index) => {
                            const total = getRegionTotal(region.id);
                            const status = getStatus(region.id);
                            const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;

                            return (
                                <TableRow key={region.id} className="hover:bg-gray-50/50 group">
                                    <TableCell className="text-center font-medium text-gray-500">{absoluteIndex}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{region.name}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{region.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-gray-700">
                                        {total > 0 ? formatCurrency(total) : "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={status === "Terisi" ? "default" : "outline"} className={status === "Terisi" ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : "text-gray-400 border-gray-200"}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                <Link href={`/operator/pdrb/form?regionId=${region.id}&year=${selectedYear}`} className="w-full">
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Input / Edit Data
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => downloadRegionCSV(region)} className="cursor-pointer">
                                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                    Download CSV
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => downloadRegionPDF(region)} className="cursor-pointer">
                                                    <Printer className="mr-2 h-4 w-4" />
                                                    Cetak/PDF
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {paginatedRegions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                                    Wilayah tidak ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="text-sm text-gray-500 text-center sm:text-left">
                        Menampilkan <span className="font-medium text-gray-900">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredRegions.length)}</span> sampai <span className="font-medium text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredRegions.length)}</span> dari <span className="font-medium text-gray-900">{filteredRegions.length}</span> data
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1 mx-2">
                            <span className="text-sm font-medium text-gray-900">
                                Halaman {currentPage}
                            </span>
                            <span className="text-sm text-gray-500">
                                / {totalPages || 1}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
