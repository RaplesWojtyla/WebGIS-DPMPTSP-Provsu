"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash,
    Building2,
    MapPin,
    Home,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileSpreadsheet,
    FileText,
    LayoutGrid
} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Initial Mock Data (Flat)
// Using an expanded dataset for demonstration
const INITIAL_FLAT_DATA = [
    {
        id: "1",
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

// Helper to extract unique items
const extractUnique = (data: any[], key: string, labelKey: string, extraKeys: string[] = []) => {
    const map = new Map();
    data.forEach(item => {
        if (!map.has(item[key])) {
            const obj: any = { code: item[key], name: item[labelKey] };
            extraKeys.forEach(k => obj[k] = item[k]);
            map.set(item[key], obj);
        }
    });
    return Array.from(map.values());
};

const ITEMS_PER_PAGE = 5;

export default function AdminWilayahPage() {
    // Standardizing Data State
    const [kabupatens, setKabupatens] = useState(extractUnique(INITIAL_FLAT_DATA, 'kode_kabupaten', 'nama_kabupaten', ['nama_provinsi', 'kode_provinsi']));
    const [kecamatans, setKecamatans] = useState(extractUnique(INITIAL_FLAT_DATA, 'kode_kecamatan', 'nama_kecamatan', ['kode_kabupaten', 'nama_kabupaten'])); // Added nama_kabupaten for ease
    const [desas, setDesas] = useState(INITIAL_FLAT_DATA.map(d => ({
        id: d.id,
        code: d.kode_desa,
        name: d.nama_desa,
        kecamatanCode: d.kode_kecamatan,
        kabupatenCode: d.kode_kabupaten,
        // Helper fields for display
        kecamatanName: d.nama_kecamatan,
        kabupatenName: d.nama_kabupaten,
    })));

    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Form Data
    const [formState, setFormState] = useState({
        code: "",
        name: "",
        parentCode: "",    // Generic parent (Kabupaten for Kec, Kecamatan for Desa)
        grandParentCode: "" // For Desa (Kabupaten)
    });

    // Reset when tab changes
    const handleTabChange = (val: string) => {
        setActiveTab(val);
        setSearchTerm("");
        setEditingItem(null);
        setCurrentPage(1);
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        let data: any[] = [];
        if (activeTab === "all") {
            data = desas.filter(d =>
                d.name.toLowerCase().includes(term) ||
                d.code.includes(term) ||
                (d.kecamatanName || "").toLowerCase().includes(term) ||
                (d.kabupatenName || "").toLowerCase().includes(term)
            );
        } else if (activeTab === "kabupaten") {
            data = kabupatens.filter(k => k.name.toLowerCase().includes(term) || k.code.includes(term));
        } else if (activeTab === "kecamatan") {
            data = kecamatans.filter(k => k.name.toLowerCase().includes(term) || k.code.includes(term));
        } else {
            data = desas.filter(d => d.name.toLowerCase().includes(term) || d.code.includes(term));
        }
        return data;
    }, [activeTab, searchTerm, kabupatens, kecamatans, desas]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // CRUD Handlers
    const handleAddNew = () => {
        setEditingItem(null);
        setFormState({ code: "", name: "", parentCode: "", grandParentCode: "" });
        setIsDialogOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        if (activeTab === "kabupaten") {
            setFormState({ code: item.code, name: item.name, parentCode: "", grandParentCode: "" });
        } else if (activeTab === "kecamatan") {
            setFormState({ code: item.code, name: item.name, parentCode: item.kode_kabupaten, grandParentCode: "" });
        } else {
            setFormState({
                code: item.code,
                name: item.name,
                parentCode: item.kecamatanCode,
                grandParentCode: item.kabupatenCode
            });
        }
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string, code?: string) => {
        if (activeTab === 'kabupaten' || activeTab === 'kecamatan') {
            setDeletingId(code || id);
        } else {
            setDeletingId(id);
        }
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!deletingId) return;

        if (activeTab === "kabupaten") {
            setKabupatens(prev => prev.filter(k => k.code !== deletingId));
            // Cascade delete (mock)
            setKecamatans(prev => prev.filter(k => k.kode_kabupaten !== deletingId));
            setDesas(prev => prev.filter(d => d.kabupatenCode !== deletingId));
        } else if (activeTab === "kecamatan") {
            setKecamatans(prev => prev.filter(k => k.code !== deletingId));
            setDesas(prev => prev.filter(d => d.kecamatanCode !== deletingId));
        } else {
            setDesas(prev => prev.filter(d => d.id !== deletingId));
        }
        toast.success("Data berhasil dihapus");
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
    };

    const handleSave = () => {
        if (activeTab === "kabupaten") {
            if (editingItem) {
                setKabupatens(prev => prev.map(k => k.code === editingItem.code ? { ...k, name: formState.name, code: formState.code } : k));
            } else {
                setKabupatens(prev => [...prev, { code: formState.code, name: formState.name, nama_provinsi: "SUMATERA UTARA", kode_provinsi: "12" }]);
            }
        } else if (activeTab === "kecamatan") {
            const newItem = {
                code: formState.code,
                name: formState.name,
                kode_kabupaten: formState.parentCode,
                nama_kabupaten: kabupatens.find(k => k.code === formState.parentCode)?.name || ""
            };
            if (editingItem) {
                setKecamatans(prev => prev.map(k => k.code === editingItem.code ? newItem : k));
            } else {
                setKecamatans(prev => [...prev, newItem]);
            }
        } else {
            const newItem = {
                id: editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9),
                code: formState.code,
                name: formState.name,
                kecamatanCode: formState.parentCode,
                kabupatenCode: formState.grandParentCode,
                kecamatanName: kecamatans.find(k => k.code === formState.parentCode)?.name || "",
                kabupatenName: kabupatens.find(k => k.code === formState.grandParentCode)?.name || ""
            };
            if (editingItem) {
                setDesas(prev => prev.map(d => d.id === editingItem.id ? newItem : d));
            } else {
                setDesas(prev => [...prev, newItem]);
            }
        }
        setIsDialogOpen(false);
        toast.success("Data berhasil disimpan");
    };

    // Helper fields logic
    const getKabupatenName = (code: string) => kabupatens.find(k => k.code === code)?.name || "-";
    const getKecamatanName = (code: string) => kecamatans.find(k => k.code === code)?.name || "-";

    // Download Logic
    const getExportData = () => {
        switch (activeTab) {
            case "all":
                return {
                    headers: ["No", "Kabupaten", "Kode Kab", "Kecamatan", "Kode Kec", "Desa", "Kode Desa"],
                    data: filteredData.map((d, i) => [
                        i + 1,
                        d.kabupatenName || getKabupatenName(d.kabupatenCode),
                        d.kabupatenCode,
                        d.kecamatanName || getKecamatanName(d.kecamatanCode),
                        d.kecamatanCode,
                        d.name,
                        d.code
                    ]),
                    filename: "data_semua_wilayah"
                };
            case "kabupaten":
                return {
                    headers: ["No", "Kode Kabupaten", "Nama Kabupaten", "Provinsi"],
                    data: filteredData.map((d, i) => [
                        i + 1,
                        d.code,
                        d.name,
                        "SUMATERA UTARA"
                    ]),
                    filename: "data_kabupaten"
                };
            case "kecamatan":
                return {
                    headers: ["No", "Kode Kecamatan", "Nama Kecamatan", "Kabupaten Induk"],
                    data: filteredData.map((d, i) => [
                        i + 1,
                        d.code,
                        d.name,
                        d.nama_kabupaten || getKabupatenName(d.kode_kabupaten)
                    ]),
                    filename: "data_kecamatan"
                };
            case "desa":
                return {
                    headers: ["No", "Kode Desa", "Nama Desa", "Kecamatan", "Kabupaten"],
                    data: filteredData.map((d, i) => [
                        i + 1,
                        d.code,
                        d.name,
                        d.kecamatanName || getKecamatanName(d.kecamatanCode),
                        d.kabupatenName || getKabupatenName(d.kabupatenCode)
                    ]),
                    filename: "data_desa"
                };
            default:
                return { headers: [], data: [], filename: "data" };
        }
    };

    const downloadCSV = () => {
        const { headers, data, filename } = getExportData();
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + data.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadPDF = () => {
        const { headers, data, filename } = getExportData();
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Laporan Data Wilayah Administratif", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        let subTitle = "";
        if (activeTab === "all") subTitle = "Semua Data Wilayah";
        else if (activeTab === "kabupaten") subTitle = "Data Kabupaten";
        else if (activeTab === "kecamatan") subTitle = "Data Kecamatan";
        else if (activeTab === "desa") subTitle = "Data Desa";

        doc.text(subTitle, 14, 30);
        doc.text(`Total Data: ${filteredData.length}`, 14, 36);

        autoTable(doc, {
            head: [headers],
            body: data,
            startY: 44,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save(`${filename}.pdf`);
    };

    const renderForm = () => {
        const effectiveTab = activeTab === 'all' ? 'desa' : activeTab;
        return (
            <div className="grid gap-4 py-4">
                {effectiveTab === "desa" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Kabupaten</Label>
                        <Select
                            value={formState.grandParentCode}
                            onValueChange={(val) => setFormState(prev => ({ ...prev, grandParentCode: val, parentCode: "" }))}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih Kabupaten" />
                            </SelectTrigger>
                            <SelectContent>
                                {kabupatens.map(k => (
                                    <SelectItem key={k.code} value={k.code}>{k.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {(effectiveTab === "kecamatan" || effectiveTab === "desa") && (
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">{effectiveTab === "kecamatan" ? "Kabupaten" : "Kecamatan"}</Label>
                        <Select
                            value={formState.parentCode}
                            onValueChange={(val) => setFormState(prev => ({ ...prev, parentCode: val }))}
                            disabled={effectiveTab === "desa" && !formState.grandParentCode}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={`Pilih ${effectiveTab === "kecamatan" ? "Kabupaten" : "Kecamatan"}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {effectiveTab === "kecamatan"
                                    ? kabupatens.map(k => (
                                        <SelectItem key={k.code} value={k.code}>{k.name}</SelectItem>
                                    ))
                                    : kecamatans.filter(k => k.kode_kabupaten === formState.grandParentCode).map(k => (
                                        <SelectItem key={k.code} value={k.code}>{k.name}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Nama {effectiveTab === "kabupaten" ? "Kab" : effectiveTab === "kecamatan" ? "Kec" : "Desa"}</Label>
                    <Input
                        value={formState.name}
                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                        className="col-span-3"
                        placeholder={`Masukkan Nama ${effectiveTab}`}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Kode</Label>
                    <Input
                        value={formState.code}
                        onChange={(e) => setFormState(prev => ({ ...prev, code: e.target.value }))}
                        className="col-span-3"
                        placeholder="Contoh: 12.07..."
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Wilayah Administratif</h1>
                <p className="text-gray-500">Kelola data wilayah secara hierarkis (Kabupaten, Kecamatan, Desa).</p>
            </div>

            <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-white border border-gray-100 p-1 h-auto rounded-xl shadow-sm">
                        <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2">
                            <LayoutGrid className="w-4 h-4 mr-2" /> Semua Data
                        </TabsTrigger>
                        <TabsTrigger value="kabupaten" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2">
                            <Building2 className="w-4 h-4 mr-2" /> Kabupaten
                        </TabsTrigger>
                        <TabsTrigger value="kecamatan" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2">
                            <MapPin className="w-4 h-4 mr-2" /> Kecamatan
                        </TabsTrigger>
                        <TabsTrigger value="desa" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2">
                            <Home className="w-4 h-4 mr-2" /> Desa
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={`Cari ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white"
                            />
                        </div>
                        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                            <Plus className="h-4 w-4 mr-2" /> Tambah
                        </Button>
                        <div className="flex gap-1 shrink-0">
                            <Button variant="outline" onClick={downloadCSV} className="border-green-200 text-green-700 hover:bg-green-50 px-3">
                                <FileSpreadsheet className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={downloadPDF} className="border-red-200 text-red-700 hover:bg-red-50 px-3">
                                <FileText className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] hover:shadow-md transition-shadow">
                    <TabsContent value="all" className="m-0 border-none">
                        <Table
                            columns={["No", "Kabupaten", "Kode", "Kecamatan", "Kode", "Desa", "Kode", "Aksi"]}
                            data={paginatedData.map((item, i) => [
                                startIndex + i + 1,
                                <span key="kab" className="font-medium text-gray-900">{item.kabupatenName || kabupatens.find(k => k.code === item.kabupatenCode)?.name || "-"}</span>,
                                <span key="kab_code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.kabupatenCode}</span>,
                                <span key="kec" className="font-medium text-gray-900">{item.kecamatanName || kecamatans.find(k => k.code === item.kecamatanCode)?.name || "-"}</span>,
                                <span key="kec_code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.kecamatanCode}</span>,
                                <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                <TableActions key={item.id} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
                            ])}
                        />
                    </TabsContent>

                    <TabsContent value="kabupaten" className="m-0 border-none">
                        <Table
                            columns={["No", "Kode Kab", "Nama Kabupaten", "Provinsi", "Aksi"]}
                            data={paginatedData.map((item, i) => [
                                startIndex + i + 1,
                                <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                <span key="prov" className="text-gray-500 text-sm">SUMATERA UTARA</span>,
                                <TableActions key={item.code} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.code, item.code)} />
                            ])}
                        />
                    </TabsContent>

                    <TabsContent value="kecamatan" className="m-0 border-none">
                        <Table
                            columns={["No", "Kode Kec", "Nama Kecamatan", "Kabupaten (Induk)", "Aksi"]}
                            data={paginatedData.map((item, i) => [
                                startIndex + i + 1,
                                <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                <span key="kab" className="text-gray-600">{item.nama_kabupaten || kabupatens.find(k => k.code === item.kode_kabupaten)?.name || "-"}</span>,
                                <TableActions key={item.code} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.code, item.code)} />
                            ])}
                        />
                    </TabsContent>

                    <TabsContent value="desa" className="m-0 border-none">
                        <Table
                            columns={["No", "Kode Desa", "Nama Desa", "Kecamatan", "Kabupaten", "Aksi"]}
                            data={paginatedData.map((item, i) => [
                                startIndex + i + 1,
                                <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                <span key="kec" className="text-gray-600">{item.kecamatanName || kecamatans.find(k => k.code === item.kecamatanCode)?.name || "-"}</span>,
                                <span key="kab" className="text-gray-600">{item.kabupatenName || kabupatens.find(k => k.code === item.kabupatenCode)?.name || "-"}</span>,
                                <TableActions key={item.id} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id)} />
                            ])}
                        />
                    </TabsContent>

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
                                    {currentPage}
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
            </Tabs>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit Data" : "Tambah Data"} {activeTab === "all" ? "Data Lengkap" : activeTab}</DialogTitle>
                    </DialogHeader>
                    {renderForm()}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Data?</DialogTitle>
                        <div className="text-sm text-muted-foreground">
                            Apakah Anda yakin ingin menghapus data ini?
                            {activeTab !== "desa" && " Data anak (kecamatan/desa) yang terkait juga akan terhapus."}
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Simple Action Buttons Component
const TableActions = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
    <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash className="h-4 w-4" />
        </Button>
    </div>
);

// Reusable Table Component
const Table = ({ columns, data }: { columns: string[], data: any[][] }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} className="px-6 py-4 font-semibold text-gray-600 tracking-wider whitespace-nowrap">{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.length > 0 ? (
                    data.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                            {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-6 py-4 text-gray-700 whitespace-nowrap">{cell}</td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                            Tidak ada data
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);
