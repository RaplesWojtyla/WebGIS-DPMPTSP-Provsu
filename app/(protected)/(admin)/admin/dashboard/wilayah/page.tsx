"use client"

import React, { useState, useMemo, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, Plus, Pencil, Trash, Building2, MapPin, Home, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet, FileText, LayoutGrid, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import {
    getProvinces,
    getRegencies,
    createRegency,
    updateRegency,
    deleteRegency,
    getDistricts,
    createDistrict,
    updateDistrict,
    deleteDistrict,
    getVillages,
    createVillage,
    updateVillage,
    deleteVillage,
} from "@/lib/actions/wilayah.actions"
import {
    regencySchema,
    districtSchema,
    villageSchema,
    type RegencyFormData,
    type DistrictFormData,
    type VillageFormData,
} from "@/lib/zod/wilayah-schema"

// Types from database (Saya pindahkan ke dalam global.d.ts)


const ITEMS_PER_PAGE = 10

export default function AdminWilayahPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    // Data State
    const [provinces, setProvinces] = useState<Province[]>([])
    const [regencies, setRegencies] = useState<Regency[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [villages, setVillages] = useState<Village[]>([])

    const [activeTab, setActiveTab] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Regency | District | Village | null>(null)
    const [deletingItem, setDeletingItem] = useState<{ id: string; type: string } | null>(null)

    const regencyForm = useForm<RegencyFormData>({
        resolver: zodResolver(regencySchema),
        defaultValues: { 
            code: "", 
            name: "", 
            provinceId: "" 
        }
    })

    const districtForm = useForm<DistrictFormData>({
        resolver: zodResolver(districtSchema),
        defaultValues: { 
            code: "", 
            name: "", 
            regencyId: "" 
        }
    })

    const villageForm = useForm<VillageFormData>({
        resolver: zodResolver(villageSchema),
        defaultValues: { 
            code: "", 
            name: "", 
            districtId: "" 
        }
    })

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = async () => {
        setIsLoading(true)

        const [provResult, regResult, distResult, vilResult] = await Promise.all([
            getProvinces(),
            getRegencies(),
            getDistricts(),
            getVillages()
        ])

        if (provResult.success && provResult.data) setProvinces(provResult.data)
        if (regResult.success && regResult.data) setRegencies(regResult.data as Regency[])
        if (distResult.success && distResult.data) setDistricts(distResult.data as District[])
        if (vilResult.success && vilResult.data) setVillages(vilResult.data as Village[])

        setIsLoading(false)
    }

    // Reset when tab changes
    const handleTabChange = (val: string) => {
        setActiveTab(val)
        setSearchTerm("")
        setEditingItem(null)
        setCurrentPage(1)
    }

    // Filter Logic
    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase()

        if (activeTab === "all" || activeTab === "desa") {
            return villages.filter(v =>
                v.name.toLowerCase().includes(term) ||
                v.code.includes(term) ||
                v.district?.name.toLowerCase().includes(term) ||
                v.district?.regency?.name.toLowerCase().includes(term)
            )
        } else if (activeTab === "kabupaten") {
            return regencies.filter(r =>
                r.name.toLowerCase().includes(term) ||
                r.code.includes(term)
            )
        } else if (activeTab === "kecamatan") {
            return districts.filter(d =>
                d.name.toLowerCase().includes(term) ||
                d.code.includes(term) ||
                d.regency?.name.toLowerCase().includes(term)
            )
        }
        return []
    }, [activeTab, searchTerm, regencies, districts, villages])

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedData = filteredData.slice(startIndex, endIndex)


    const handleAddNew = () => {
        setEditingItem(null)
        const effectiveTab = activeTab === 'all' ? 'desa' : activeTab

        if (effectiveTab === 'kabupaten') {
            regencyForm.reset({ code: "", name: "", provinceId: provinces[0]?.id || "" })
        } else if (effectiveTab === 'kecamatan') {
            districtForm.reset({ code: "", name: "", regencyId: "" })
        } else {
            villageForm.reset({ code: "", name: "", districtId: "" })
        }

        setIsDialogOpen(true)
    }

    const handleEdit = (item: Regency | District | Village) => {
        setEditingItem(item)
        const effectiveTab = activeTab === 'all' ? 'desa' : activeTab

        if (effectiveTab === 'kabupaten') {
            const reg = item as Regency
            regencyForm.reset({ code: reg.code, name: reg.name, provinceId: reg.provinceId })
        } else if (effectiveTab === 'kecamatan') {
            const dist = item as District
            districtForm.reset({ code: dist.code, name: dist.name, regencyId: dist.regencyId })
        } else {
            const vil = item as Village
            villageForm.reset({ code: vil.code, name: vil.name, districtId: vil.districtId })
        }
        setIsDialogOpen(true)
    }

    const handleDelete = (id: string, type: string) => {
        setDeletingItem({ id, type })
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!deletingItem) return

        startTransition(async () => {
            let result

            if (deletingItem.type === 'kabupaten') {
                result = await deleteRegency(deletingItem.id)
            } else if (deletingItem.type === 'kecamatan') {
                result = await deleteDistrict(deletingItem.id)
            } else {
                result = await deleteVillage(deletingItem.id)
            }

            if (result.success) {
                toast.success("Data berhasil dihapus")
                loadAllData()
            } else {
                toast.error(result.error || "Gagal menghapus data")
            }

            setIsDeleteDialogOpen(false)
            setDeletingItem(null)
            setCurrentPage(1)
        })
    }

    const handleSaveRegency = async (data: RegencyFormData) => {
        startTransition(async () => {
            let result

            if (editingItem) {
                result = await updateRegency(editingItem.id, data)
            } else {
                result = await createRegency(data)
            }

            if (result.success) {
                toast.success(editingItem ? "Perubahan disimpan" : "Kabupaten baru ditambahkan")
                setIsDialogOpen(false)
                loadAllData()
            } else {
                toast.error(result.error || "Gagal menyimpan data")
            }
        })
    }

    const handleSaveDistrict = async (data: DistrictFormData) => {
        startTransition(async () => {
            let result

            if (editingItem) {
                result = await updateDistrict(editingItem.id, data)
            } else {
                result = await createDistrict(data)
            }

            if (result.success) {
                toast.success(editingItem ? "Perubahan disimpan" : "Kecamatan baru ditambahkan")
                setIsDialogOpen(false)
                loadAllData()
            } else {
                toast.error(result.error || "Gagal menyimpan data")
            }
        })
    }

    const handleSaveVillage = async (data: VillageFormData) => {
        startTransition(async () => {
            let result

            if (editingItem) {
                result = await updateVillage(editingItem.id, data)
            } else {
                result = await createVillage(data)
            }

            if (result.success) {
                toast.success(editingItem ? "Perubahan disimpan" : "Desa baru ditambahkan")
                setIsDialogOpen(false)
                loadAllData()
            } else {
                toast.error(result.error || "Gagal menyimpan data")
            }
        })
    }

    // Export Logic
    const getExportData = () => {
        switch (activeTab) {
            case "all":
            case "desa":
                return {
                    headers: ["No", "Kabupaten", "Kode Kab", "Kecamatan", "Kode Kec", "Desa", "Kode Desa"],
                    data: (filteredData as Village[]).map((v, i) => [
                        i + 1,
                        v.district?.regency?.name || "-",
                        v.district?.regency?.code || "-",
                        v.district?.name || "-",
                        v.district?.code || "-",
                        v.name,
                        v.code
                    ]),
                    filename: activeTab === "all" ? "data_semua_wilayah" : "data_desa"
                }
            case "kabupaten":
                return {
                    headers: ["No", "Kode Kabupaten", "Nama Kabupaten", "Provinsi"],
                    data: (filteredData as Regency[]).map((r, i) => [
                        i + 1,
                        r.code,
                        r.name,
                        r.province?.name || "SUMATERA UTARA"
                    ]),
                    filename: "data_kabupaten"
                }
            case "kecamatan":
                return {
                    headers: ["No", "Kode Kecamatan", "Nama Kecamatan", "Kabupaten Induk"],
                    data: (filteredData as District[]).map((d, i) => [
                        i + 1,
                        d.code,
                        d.name,
                        d.regency?.name || "-"
                    ]),
                    filename: "data_kecamatan"
                }
            default:
                return { headers: [], data: [], filename: "data" }
        }
    }

    const downloadCSV = () => {
        const { headers, data, filename } = getExportData()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const escapeCell = (cell: any) => {
            if (cell === null || cell === undefined) return ""
            let str = String(cell)
            if (/^[=+\-@]/.test(str)) str = "'" + str
            return `"${str.replace(/"/g, '""')}"`
        }

        const csvContent = [
            headers.map(escapeCell).join(","),
            ...data.map(row => row.map(escapeCell).join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${filename}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const downloadPDF = () => {
        const { headers, data, filename } = getExportData()
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text("Laporan Data Wilayah Administratif", 14, 22)
        doc.setFontSize(11)
        doc.setTextColor(100)

        let subTitle = ""
        if (activeTab === "all") subTitle = "Semua Data Wilayah"
        else if (activeTab === "kabupaten") subTitle = "Data Kabupaten"
        else if (activeTab === "kecamatan") subTitle = "Data Kecamatan"
        else if (activeTab === "desa") subTitle = "Data Desa"

        doc.text(subTitle, 14, 30)
        doc.text(`Total Data: ${filteredData.length}`, 14, 36)

        autoTable(doc, {
            head: [headers],
            body: data,
            startY: 44,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] },
        })
        doc.save(`${filename}.pdf`)
    }

    // Form render based on active tab
    const renderForm = () => {
        const effectiveTab = activeTab === 'all' ? 'desa' : activeTab

        if (effectiveTab === 'kabupaten') {
            return (
                <form onSubmit={regencyForm.handleSubmit(handleSaveRegency)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-left">Provinsi</Label>
                        <Select
                            value={regencyForm.watch("provinceId")}
                            onValueChange={(val) => regencyForm.setValue("provinceId", val)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih Provinsi" />
                            </SelectTrigger>
                            <SelectContent>
                                {provinces.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-left">Nama Kabupaten</Label>
                        <div className="col-span-3 space-y-1">
                            <Input {...regencyForm.register("name")} placeholder="Nama Kabupaten" />
                            {regencyForm.formState.errors.name && (
                                <p className="text-sm text-red-500">{regencyForm.formState.errors.name.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-left">Kode</Label>
                        <div className="col-span-3 space-y-1">
                            <Input {...regencyForm.register("code")} placeholder="Contoh: 12.07" />
                            {regencyForm.formState.errors.code && (
                                <p className="text-sm text-red-500">{regencyForm.formState.errors.code.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>Batal</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            )
        }

        if (effectiveTab === 'kecamatan') {
            return (
                <form onSubmit={districtForm.handleSubmit(handleSaveDistrict)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-left">Kabupaten</Label>
                        <Select
                            value={districtForm.watch("regencyId")}
                            onValueChange={(val) => districtForm.setValue("regencyId", val)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih Kabupaten" />
                            </SelectTrigger>
                            <SelectContent>
                                {regencies.map(r => (
                                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-left">Nama Kecamatan</Label>
                        <div className="col-span-3 space-y-1">
                            <Input {...districtForm.register("name")} placeholder="Nama Kecamatan" />
                            {districtForm.formState.errors.name && (
                                <p className="text-sm text-red-500">{districtForm.formState.errors.name.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Kode</Label>
                        <div className="col-span-3 space-y-1">
                            <Input {...districtForm.register("code")} placeholder="Contoh: 12.07.02" />
                            {districtForm.formState.errors.code && (
                                <p className="text-sm text-red-500">{districtForm.formState.errors.code.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>Batal</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            )
        }

        // Village form
        const selectedRegencyId = villageForm.watch("districtId")
            ? districts.find(d => d.id === villageForm.watch("districtId"))?.regencyId
            : ""

        return (
            <form onSubmit={villageForm.handleSubmit(handleSaveVillage)} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Kabupaten</Label>
                    <Select
                        value={selectedRegencyId}
                        onValueChange={() => villageForm.setValue("districtId", "")}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Pilih Kabupaten" />
                        </SelectTrigger>
                        <SelectContent>
                            {regencies.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Kecamatan</Label>
                    <Select
                        value={villageForm.watch("districtId")}
                        onValueChange={(val) => villageForm.setValue("districtId", val)}
                    >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Pilih Kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                            {districts
                                .filter(d => !selectedRegencyId || d.regencyId === selectedRegencyId)
                                .map(d => (
                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Nama Desa</Label>
                    <div className="col-span-3 space-y-1">
                        <Input {...villageForm.register("name")} placeholder="Nama Desa" />
                        {villageForm.formState.errors.name && (
                            <p className="text-sm text-red-500">{villageForm.formState.errors.name.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Kode</Label>
                    <div className="col-span-3 space-y-1">
                        <Input {...villageForm.register("code")} placeholder="Contoh: 12.07.02.2001" />
                        {villageForm.formState.errors.code && (
                            <p className="text-sm text-red-500">{villageForm.formState.errors.code.message}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>Batal</Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan
                    </Button>
                </DialogFooter>
            </form>
        )
    }

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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-9 bg-white"
                            />
                        </div>
                        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0" disabled={isPending}>
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
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <>
                            <TabsContent value="all" className="m-0 border-none">
                                <DataTable
                                    columns={["No", "Kabupaten", "Kode", "Kecamatan", "Kode", "Desa", "Kode", "Aksi"]}
                                    data={(paginatedData as Village[]).map((item, i) => [
                                        startIndex + i + 1,
                                        <span key="kab" className="font-medium text-gray-900">{item.district?.regency?.name || "-"}</span>,
                                        <span key="kab_code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.district?.regency?.code || "-"}</span>,
                                        <span key="kec" className="font-medium text-gray-900">{item.district?.name || "-"}</span>,
                                        <span key="kec_code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.district?.code || "-"}</span>,
                                        <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                        <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                        <TableActions key={item.id} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id, 'desa')} disabled={isPending} />
                                    ])}
                                />
                            </TabsContent>

                            <TabsContent value="kabupaten" className="m-0 border-none">
                                <DataTable
                                    columns={["No", "Kode Kab", "Nama Kabupaten", "Provinsi", "Aksi"]}
                                    data={(paginatedData as Regency[]).map((item, i) => [
                                        startIndex + i + 1,
                                        <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                        <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                        <span key="prov" className="text-gray-500 text-sm">{item.province?.name || "SUMATERA UTARA"}</span>,
                                        <TableActions key={item.id} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id, 'kabupaten')} disabled={isPending} />
                                    ])}
                                />
                            </TabsContent>

                            <TabsContent value="kecamatan" className="m-0 border-none">
                                <DataTable
                                    columns={["No", "Kode Kec", "Nama Kecamatan", "Kabupaten", "Aksi"]}
                                    data={(paginatedData as District[]).map((item, i) => [
                                        startIndex + i + 1,
                                        <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                        <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                        <span key="kab" className="text-gray-600">{item.regency?.name || "-"}</span>,
                                        <TableActions key={item.id} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id, 'kecamatan')} disabled={isPending} />
                                    ])}
                                />
                            </TabsContent>

                            <TabsContent value="desa" className="m-0 border-none">
                                <DataTable
                                    columns={["No", "Kode Desa", "Nama Desa", "Kecamatan", "Kabupaten", "Aksi"]}
                                    data={(paginatedData as Village[]).map((item, i) => [
                                        startIndex + i + 1,
                                        <span key="code" className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>,
                                        <span key="name" className="font-medium text-gray-900">{item.name}</span>,
                                        <span key="kec" className="text-gray-600">{item.district?.name || "-"}</span>,
                                        <span key="kab" className="text-gray-600">{item.district?.regency?.name || "-"}</span>,
                                        <TableActions key={item.id} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item.id, 'desa')} disabled={isPending} />
                                    ])}
                                />
                            </TabsContent>
                        </>
                    )}

                    {/* Pagination Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                        <div className="text-xs text-gray-500 text-center sm:text-left">
                            Menampilkan <span className="font-medium text-gray-900">{Math.min(endIndex, filteredData.length)}</span> dari <span className="font-medium text-gray-900">{filteredData.length}</span> data
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-1 mx-2">
                                <span className="text-sm font-medium text-gray-900">{currentPage}</span>
                                <span className="text-sm text-gray-500">/ {totalPages || 1}</span>
                            </div>

                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}>
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
                        <DialogTitle>{editingItem ? "Edit Data" : "Tambah Data"} {activeTab === "all" ? "Desa" : activeTab}</DialogTitle>
                        <DialogDescription>
                            Isi data wilayah di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    {renderForm()}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data ini?
                            {deletingItem?.type === "kabupaten" && " Semua kecamatan dan desa di dalamnya juga akan terhapus."}
                            {deletingItem?.type === "kecamatan" && " Semua desa di dalamnya juga akan terhapus."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// Table Actions Component
const TableActions = ({ onEdit, onDelete, disabled }: { onEdit: () => void; onDelete: () => void; disabled?: boolean }) => (
    <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit} disabled={disabled} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} disabled={disabled} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash className="h-4 w-4" />
        </Button>
    </div>
)

// Reusable DataTable Component
const DataTable = ({ columns, data }: { columns: string[]; data: (string | number | React.ReactNode)[][] }) => (
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
)
