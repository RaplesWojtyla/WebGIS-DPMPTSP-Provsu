"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Search,
    FileText,
    FileSpreadsheet,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { toast } from "sonner"; // Assuming sonner is installed as per package.json

// Initial Mock Data
const INITIAL_DATA = [
    {
        id: "1",
        no: 1,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KAB. DELI SERDANG",
        kode_kabupaten: "12.07",
        nama_kecamatan: "Percut Sei Tuan",
        kode_kecamatan: "12.07.02",
        nama_desa: "Bandar Klippa",
        kode_desa: "12.07.02.2005",
    },
    {
        id: "2",
        no: 2,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KAB. DELI SERDANG",
        kode_kabupaten: "12.07",
        nama_kecamatan: "Percut Sei Tuan",
        kode_kecamatan: "12.07.02",
        nama_desa: "Bandar Khalipah",
        kode_desa: "12.07.02.2006",
    },
    {
        id: "3",
        no: 3,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KAB. DELI SERDANG",
        kode_kabupaten: "12.07",
        nama_kecamatan: "Batang Kuis",
        kode_kecamatan: "12.07.03",
        nama_desa: "Batang Kuis Pekan",
        kode_desa: "12.07.03.2001",
    },
    {
        id: "4",
        no: 4,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KOTA MEDAN",
        kode_kabupaten: "12.71",
        nama_kecamatan: "Medan Barat",
        kode_kecamatan: "12.71.01",
        nama_desa: "Kesawan",
        kode_desa: "12.71.01.1001",
    },
    {
        id: "5",
        no: 5,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KOTA MEDAN",
        kode_kabupaten: "12.71",
        nama_kecamatan: "Medan Barat",
        kode_kecamatan: "12.71.01",
        nama_desa: "Silalas",
        kode_desa: "12.71.01.1002",
    },
    {
        id: "6",
        no: 6,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KOTA MEDAN",
        kode_kabupaten: "12.71",
        nama_kecamatan: "Medan Petisah",
        kode_kecamatan: "12.71.02",
        nama_desa: "Petisah Tengah",
        kode_desa: "12.71.02.1001",
    },
    {
        id: "7",
        no: 7,
        nama_provinsi: "SUMATERA UTARA",
        kode_provinsi: "12",
        nama_kabupaten: "KAB. LANGKAT",
        kode_kabupaten: "12.05",
        nama_kecamatan: "Babalan",
        kode_kecamatan: "12.05.01",
        nama_desa: "Pelawi Selatan",
        kode_desa: "12.05.01.2001",
    },
];

type DataItem = typeof INITIAL_DATA[0];

const ITEMS_PER_PAGE = 5;

export default function KabupatenPage() {
    const [data] = useState<DataItem[]>(INITIAL_DATA);
    const [searchTerm, setSearchTerm] = useState("");

    // Filters
    const [selectedKabupaten, setSelectedKabupaten] = useState<string>("all");
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("all");
    const [selectedDesa, setSelectedDesa] = useState<string>("all");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Logic
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // 1. Text Search (Global)
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                item.nama_kabupaten.toLowerCase().includes(term) ||
                item.nama_kecamatan.toLowerCase().includes(term) ||
                item.nama_desa.toLowerCase().includes(term) ||
                item.kode_kabupaten.includes(term) ||
                item.kode_kecamatan.includes(term) ||
                item.kode_desa.includes(term);

            // 2. Cascading Dropdowns (Strict)
            const matchesKabupaten = selectedKabupaten === "all" || item.nama_kabupaten === selectedKabupaten;
            const matchesKecamatan = selectedKecamatan === "all" || item.nama_kecamatan === selectedKecamatan;
            const matchesDesa = selectedDesa === "all" || item.nama_desa === selectedDesa;

            return matchesSearch && matchesKabupaten && matchesKecamatan && matchesDesa;
        });
    }, [data, searchTerm, selectedKabupaten, selectedKecamatan, selectedDesa]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedKabupaten, selectedKecamatan, selectedDesa]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Derived Options with "all" check to prevent empty lists when searching
    const kabupatenOptions = useMemo(() => Array.from(new Set(data.map((item) => item.nama_kabupaten))).sort(), [data]);

    const kecamatanOptions = useMemo(() => {
        let source = data;
        if (selectedKabupaten !== "all") {
            source = source.filter(item => item.nama_kabupaten === selectedKabupaten);
        }
        return Array.from(new Set(source.map((item) => item.nama_kecamatan))).sort();
    }, [data, selectedKabupaten]);

    const desaOptions = useMemo(() => {
        let source = data;
        if (selectedKabupaten !== "all") source = source.filter(item => item.nama_kabupaten === selectedKabupaten);
        if (selectedKecamatan !== "all") source = source.filter(item => item.nama_kecamatan === selectedKecamatan);
        return Array.from(new Set(source.map((item) => item.nama_desa))).sort();
    }, [data, selectedKabupaten, selectedKecamatan]);


    // Export Handlers
    const downloadCSV = () => {
        const headers = [
            "No", "Nama Provinsi", "Kode Provinsi", "Nama Kabupaten", "Kode Kabupaten",
            "Nama Kecamatan", "Kode Kecamatan", "Nama Desa", "Kode Desa"
        ];
        const rows = filteredData.map((item) => [
            item.no, item.nama_provinsi, item.kode_provinsi, item.nama_kabupaten, item.kode_kabupaten,
            item.nama_kecamatan, item.kode_kecamatan, item.nama_desa, item.kode_desa
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((row) => row.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_wilayah.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Data Wilayah Administratif - Sumatera Utara", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Data: ${filteredData.length}`, 14, 30);

        const headers = [[
            "No", "Kabupaten", "Kode", "Kecamatan", "Kode", "Desa", "Kode"
        ]];
        const rows = filteredData.map((item) => [
            item.no, item.nama_kabupaten, item.kode_kabupaten, item.nama_kecamatan, item.kode_kecamatan, item.nama_desa, item.kode_desa
        ]);

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 40,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 163, 74] },
        });
        doc.save("data_wilayah_sumut.pdf");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Wilayah Sumatera Utara</h1>
                <p className="text-gray-500">Kelola data wilayah administratif provinsi hingga desa.</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                {/* Top Row: Search & Add */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari wilayah..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                {/* Bottom Row: Filters & Exports */}
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-end xl:items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto flex-1">
                        <Select value={selectedKabupaten} onValueChange={(val) => { setSelectedKabupaten(val); setSelectedKecamatan("all"); setSelectedDesa("all"); }}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Semua Kabupaten" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kabupaten</SelectItem>
                                {kabupatenOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={selectedKecamatan} onValueChange={(val) => { setSelectedKecamatan(val); setSelectedDesa("all"); }} disabled={selectedKabupaten === 'all'}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Semua Kecamatan" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kecamatan</SelectItem>
                                {kecamatanOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={selectedDesa} onValueChange={setSelectedDesa} disabled={selectedKecamatan === 'all'}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Semua Desa" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Desa</SelectItem>
                                {desaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 w-full xl:w-auto shrink-0">
                        <Button onClick={downloadCSV} variant="outline" className="flex-1 xl:flex-none border-green-200 text-green-700 hover:bg-green-50">
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                        </Button>
                        <Button onClick={downloadPDF} variant="outline" className="flex-1 xl:flex-none border-red-200 text-red-700 hover:bg-red-50">
                            <FileText className="mr-2 h-4 w-4" /> PDF
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-12">No</th>
                                <th className="px-6 py-4 font-semibold">Kabupaten</th>
                                <th className="px-6 py-4 font-semibold w-24">Kode</th>
                                <th className="px-6 py-4 font-semibold">Kecamatan</th>
                                <th className="px-6 py-4 font-semibold w-24">Kode</th>
                                <th className="px-6 py-4 font-semibold">Desa</th>
                                <th className="px-6 py-4 font-semibold w-24">Kode</th>
                                <th className="px-6 py-4 font-semibold text-center w-24">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">{startIndex + index + 1}</td>
                                        <td className="px-6 py-4 text-gray-700">{item.nama_kabupaten}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.kode_kabupaten}</td>
                                        <td className="px-6 py-4 text-gray-700">{item.nama_kecamatan}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.kode_kecamatan}</td>
                                        <td className="px-6 py-4 text-gray-700">{item.nama_desa}</td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">{item.kode_desa}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 text-gray-300" />
                                            <p>Tidak ada data yang ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="text-xs text-gray-500 text-center sm:text-left">
                        Menampilkan <span className="font-medium text-gray-900">{Math.min(endIndex, filteredData.length)}</span> dari <span className="font-medium text-gray-900">{filteredData.length}</span> data
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
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
