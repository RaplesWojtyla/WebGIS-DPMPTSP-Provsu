"use client";

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Pencil,
    Trash2,
    Plus
} from "lucide-react";

// Import initial data (assuming we can reuse this or copy it if needed)
import { REGIONS as INITIAL_REGIONS } from "@/app/(protected)/(operator)/operator/pdrb/constants";
import { toast } from "sonner";

type Region = {
    id: string;
    name: string;
    type: string;
};

export default function KabupatenPage() {
    // In-memory state
    const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Region>({ id: "", name: "", type: "Kabupaten" });

    // Filter Logic
    const filteredRegions = regions.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredRegions.length / ITEMS_PER_PAGE);
    const paginatedRegions = filteredRegions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const handleAdd = () => {
        setIsEditing(false);
        // Default ID empty for user to fill
        setFormData({ id: "", name: "", type: "Kabupaten" });
        setIsDialogOpen(true);
    };

    const handleEdit = (region: Region) => {
        setIsEditing(true);
        setFormData({ ...region });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setRegions(prev => prev.filter(r => r.id !== id));
        toast.success("Wilayah berhasil dihapus");
    };

    const handleSave = () => {
        if (!formData.id) {
            toast.error("Kode wilayah harus diisi");
            return;
        }
        if (!formData.name) {
            toast.error("Nama wilayah harus diisi");
            return;
        }

        if (isEditing) {
            setRegions(prev => prev.map(r => r.id === formData.id ? formData : r));
            toast.success("Perubahan disimpan");
        } else {
            setRegions(prev => [formData, ...prev]);
            toast.success("Wilayah baru ditambahkan");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Data Kabupaten/Kota</h1>
                <p className="text-muted-foreground">Kelola daftar wilayah administratif provinsi.</p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Cari wilayah..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9"
                    />
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Wilayah
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead className="w-[120px]">Kode Wilayah</TableHead>
                            <TableHead>Nama Wilayah</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRegions.length > 0 ? (
                            paginatedRegions.map((region, index) => (
                                <TableRow key={region.id}>
                                    <TableCell className="text-center font-medium">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{region.id}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{region.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(region)}>
                                                <Pencil className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Wilayah?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Data wilayah <strong>{region.name}</strong> akan dihapus sementara dari daftar ini.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(region.id)} className="bg-red-600 hover:bg-red-700">
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Tidak ada data wilayah ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                    Menampilkan <span className="font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredRegions.length)}</span> sampai <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredRegions.length)}</span> dari <span className="font-medium">{filteredRegions.length}</span> data
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
                    <span className="text-sm font-medium px-2">
                        Halaman {currentPage} dari {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

            {/* Input Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Wilayah" : "Tambah Wilayah Baru"}</DialogTitle>
                        <DialogDescription>
                            Isi detail informasi wilayah di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">
                                Kode
                            </Label>
                            <Input
                                id="id"
                                value={formData.id}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                className="col-span-3"
                                placeholder="Contoh: 1275 atau 12.01.03.2010"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                placeholder="Contoh: KOTA MEDAN"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Tipe
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Kabupaten">Kabupaten</SelectItem>
                                    <SelectItem value="Kota">Kota</SelectItem>
                                    <SelectItem value="Desa">Desa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSave}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
