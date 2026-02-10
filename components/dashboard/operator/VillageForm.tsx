"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { villageSchema, type VillageFormData } from "@/lib/zod/wilayah-schema"

interface VillageFormProps {
    initialData?: Village | null
    regencies: Regency[]
    districts: District[]
    onSubmit: (data: VillageFormData) => void
    onCancel: () => void
    isPending: boolean
}

export function VillageForm({ initialData, regencies, districts, onSubmit, onCancel, isPending }: VillageFormProps) {
    const [openRegencyCombo, setOpenRegencyCombo] = useState(false)
    const [openDistrictCombo, setOpenDistrictCombo] = useState(false)
    const [tempRegencyFilter, setTempRegencyFilter] = useState("")

    const form = useForm<VillageFormData>({
        resolver: zodResolver(villageSchema),
        defaultValues: {
            code: "",
            name: "",
            districtId: ""
        }
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                districtId: initialData.districtId
            })
            // Initialize tempRegencyFilter based on the district's regency
            const dist = districts.find(d => d.id === initialData.districtId)
            if (dist) setTempRegencyFilter(dist.regencyId)
        } else {
            form.reset({
                code: "",
                name: "",
                districtId: ""
            })
            setTempRegencyFilter("")
        }
    }, [initialData, districts, form])

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Kabupaten</Label>
                <Popover open={openRegencyCombo} onOpenChange={setOpenRegencyCombo}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openRegencyCombo}
                            className="col-span-3 justify-between"
                        >
                            <span className="truncate">
                                {tempRegencyFilter
                                    ? regencies.find((r) => r.id === tempRegencyFilter)?.name
                                    : "Pilih Kabupaten"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Cari kabupaten..." />
                            <CommandList>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {regencies.map((r) => (
                                        <CommandItem
                                            key={r.id}
                                            value={r.name}
                                            onSelect={() => {
                                                setTempRegencyFilter(r.id)
                                                form.setValue("districtId", "")
                                                setOpenRegencyCombo(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    tempRegencyFilter === r.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {r.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Kecamatan</Label>
                <Popover open={openDistrictCombo} onOpenChange={setOpenDistrictCombo}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDistrictCombo}
                            className="col-span-3 justify-between"
                        >
                            <span className="truncate">
                                {form.watch("districtId")
                                    ? districts.find((d) => d.id === form.watch("districtId"))?.name
                                    : "Pilih Kecamatan"}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Cari kecamatan..." />
                            <CommandList>
                                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {districts
                                        .filter((d) => !tempRegencyFilter || d.regencyId === tempRegencyFilter)
                                        .map((d) => (
                                            <CommandItem
                                                key={d.id}
                                                value={d.name}
                                                onSelect={() => {
                                                    form.setValue("districtId", d.id)
                                                    setOpenDistrictCombo(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        form.watch("districtId") === d.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {d.name}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nama Desa</Label>
                <div className="col-span-3 space-y-1">
                    <Input {...form.register("name")} placeholder="Nama Desa" />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Kode</Label>
                <div className="col-span-3 space-y-1">
                    <Input {...form.register("code")} placeholder="Contoh: 12.07.02.2001" />
                    {form.formState.errors.code && (
                        <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                    )}
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Batal</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan
                </Button>
            </DialogFooter>
        </form>
    )
}
