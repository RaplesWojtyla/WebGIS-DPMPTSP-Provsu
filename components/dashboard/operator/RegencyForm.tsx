"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"

import { regencySchema, type RegencyFormData } from "@/lib/zod/wilayah-schema"

interface RegencyFormProps {
    initialData?: Regency | null
    provinces: Province[]
    onSubmit: (data: RegencyFormData) => void
    onCancel: () => void
    isPending: boolean
}

export function RegencyForm({ initialData, provinces, onSubmit, onCancel, isPending }: RegencyFormProps) {
    const form = useForm<RegencyFormData>({
        resolver: zodResolver(regencySchema),
        defaultValues: {
            code: "",
            name: "",
            provinceId: provinces[0]?.id || ""
        }
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                code: initialData.code,
                name: initialData.name,
                provinceId: initialData.provinceId
            })
        } else {
            form.reset({
                code: "",
                name: "",
                provinceId: provinces[0]?.id || ""
            })
        }
    }, [initialData, provinces, form])

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-left">Provinsi</Label>
                <Select
                    value={form.watch("provinceId")}
                    onValueChange={(val) => form.setValue("provinceId", val)}
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
                    <Input {...form.register("name")} placeholder="Nama Kabupaten" />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-left">Kode</Label>
                <div className="col-span-3 space-y-1">
                    <Input {...form.register("code")} placeholder="Contoh: 12.07" />
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
