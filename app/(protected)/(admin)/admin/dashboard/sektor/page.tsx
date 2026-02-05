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

// Import initial data
import { SECTORS as INITIAL_SECTORS_RAW } from "@/app/(protected)/(operator)/operator/pdrb/constants";
import { toast } from "sonner";

// Transform raw strings into objects
const INITIAL_SECTORS = INITIAL_SECTORS_RAW.map((name, index) => ({
    id: `SECTOR-${index + 1}`,
    name: name
}));

type Sector = {
    id: string;
    name: string;
};

export default function SektorPage() {
    // In-memory state
    const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Sector>({ id: "", name: "" });

    // Filter Logic
    const filteredSectors = sectors.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredSectors.length / ITEMS_PER_PAGE);
    const paginatedSectors = filteredSectors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const handleAdd = () => {
        setIsEditing(false);
        setFormData({ id: Math.random().toString(36).substr(2, 9), name: "" });
        setIsDialogOpen(true);
    };

    const handleEdit = (sector: Sector) => {
        setIsEditing(true);
        setFormData({ ...sector });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setSectors(prev => prev.filter(r => r.id !== id));
        toast.success("Sektor berhasil dihapus");
    };

    const handleSave = () => {
        if (!formData.name) {
            toast.error("Nama sektor harus diisi");
            return;
        }

        if (isEditing) {
            setSectors(prev => prev.map(r => r.id === formData.id ? formData : r));
            toast.success("Perubahan disimpan");
        } else {
            setSectors(prev => [formData, ...prev]);
            toast.success("Sektor baru ditambahkan");
        }
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Data Sektor Lapangan Usaha</h1>
                <p className="text-muted-foreground">Kelola daftar sektor untuk data PDRB.</p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Cari sektor..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9"
                    />
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Sektor
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead>Nama Sektor</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedSectors.length > 0 ? (
                            paginatedSectors.map((sector, index) => (
                                <TableRow key={sector.id}>
                                    <TableCell className="text-center font-medium">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-sm">{sector.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(sector)}>
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
                                                        <AlertDialogTitle>Hapus Sektor?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Sektor <strong>{sector.name}</strong> akan dihapus sementara dari daftar ini.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(sector.id)} className="bg-red-600 hover:bg-red-700">
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
                                <TableCell colSpan={3} className="h-24 text-center">
                                    Tidak ada data sektor ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                    Menampilkan <span className="font-medium">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredSectors.length)}</span> sampai <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredSectors.length)}</span> dari <span className="font-medium">{filteredSectors.length}</span> data
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
                        <DialogTitle>{isEditing ? "Edit Sektor" : "Tambah Sektor Baru"}</DialogTitle>
                        <DialogDescription>
                            Isi nama sektor lapangan usaha di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama Sektor
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                placeholder="Contoh: Pertanian, Kehutanan dan Perikanan"
                            />
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
