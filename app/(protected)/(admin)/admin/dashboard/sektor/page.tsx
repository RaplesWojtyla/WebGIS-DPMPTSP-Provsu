"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getSectors, createSector, updateSector, deleteSector } from "@/lib/actions/sector.actions"
import { sectorSchema, type SectorFormData } from "@/lib/zod/sector-schema"
import SektorAdminSkeleton from "@/components/skeleton/SektorAdmin"

export default function SektorPage() {
    const [sectors, setSectors] = useState<Sector[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<SectorFormData>({
        resolver: zodResolver(sectorSchema),
        defaultValues: { code: "", name: "", nameEn: "", description: "" }
    })

    useEffect(() => {
        loadSectors()
    }, [])

    const loadSectors = async () => {
        setIsLoading(true)

        const result = await getSectors()

        if (result.success && result.data) {
            setSectors(result.data)
        } else {
            toast.error(result.error || "Gagal memuat data")
        }

        setIsLoading(false)
    }

    const filteredSectors = sectors.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredSectors.length / ITEMS_PER_PAGE)
    const paginatedSectors = filteredSectors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleAdd = () => {
        setIsEditing(false)
        setEditingId(null)
        reset({
            code: "",
            name: "",
            nameEn: "",
            description: ""
        })
        setIsDialogOpen(true)
    }

    const handleEdit = (sector: Sector) => {
        setIsEditing(true)
        setEditingId(sector.id)
        reset({
            code: sector.code,
            name: sector.name,
            nameEn: sector.nameEn || "",
            description: sector.description || "",
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const result = await deleteSector(id)
            if (result.success) {
                toast.success("Sektor berhasil dihapus")
                loadSectors()
            } else {
                toast.error(result.error || "Gagal menghapus sektor")
            }
        })
    }

    const onSubmit = async (data: SectorFormData) => {
        startTransition(async () => {
            let result
            if (isEditing && editingId) {
                result = await updateSector(editingId, data)
            } else {
                result = await createSector(data)
            }

            if (result.success) {
                toast.success(isEditing ? "Perubahan disimpan" : "Sektor baru ditambahkan")
                setIsDialogOpen(false)
                loadSectors()
            } else {
                toast.error(result.error || "Gagal menyimpan data")
            }
        })
    }

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
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="pl-9"
                    />
                </div>
                <Button onClick={handleAdd} disabled={isPending}>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Sektor
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">No</TableHead>
                            <TableHead className="w-[80px]">Kode</TableHead>
                            <TableHead>Nama Sektor</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : paginatedSectors.length > 0 ? (
                            paginatedSectors.map((sector, index) => (
                                <TableRow key={sector.id}>
                                    <TableCell className="text-center font-medium">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {sector.code}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-sm">{sector.name}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(sector)} disabled={isPending}>
                                                <Pencil className="h-4 w-4 text-gray-500 hover:text-blue-600" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={isPending}>
                                                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Sektor?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Sektor <strong>{sector.name}</strong> akan dihapus permanen dari database.
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
                                <TableCell colSpan={4} className="h-24 text-center">
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

            {/* Input Dialog with React Hook Form */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Sektor" : "Tambah Sektor Baru"}</DialogTitle>
                        <DialogDescription>
                            Isi data sektor lapangan usaha di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="code" className="text-right">
                                    Kode
                                </Label>
                                <div className="col-span-3 space-y-1">
                                    <Input
                                        id="code"
                                        placeholder="Contoh: A, B, C"
                                        {...register("code")}
                                    />
                                    {errors.code && (
                                        <p className="text-sm text-red-500">{errors.code.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama Sektor
                                </Label>
                                <div className="col-span-3 space-y-1">
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Pertanian, Kehutanan dan Perikanan"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
