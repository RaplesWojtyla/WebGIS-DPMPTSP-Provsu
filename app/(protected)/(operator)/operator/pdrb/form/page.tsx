"use client"

import React, { useState, useEffect, useTransition, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    Save,
    ArrowLeft,
    Loader2,
    SendHorizonal,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react"

import {
    getSectors,
    getRegenciesWithProvince,
    getPdrbByRegencyYear,
    upsertPdrbValues,
    submitPdrbForApproval
} from "@/lib/actions/pdrb.actions"

const pdrbFormSchema = z.object({
    values: z.array(z.object({
        sectorId: z.string(),
        sectorName: z.string(),
        value: z.number().min(0, "Nilai harus positif")
    }))
})

type PdrbFormValues = z.infer<typeof pdrbFormSchema>

type Sector = {
    id: string
    code: string
    name: string
}

type Regency = {
    id: string
    code: string
    name: string
}

type PdrbStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | null

function PdrbFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const regencyId = searchParams.get("regencyId")
    const year = searchParams.get("year")

    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(true)
    const [regency, setRegency] = useState<Regency | null>(null)
    const [currentStatus, setCurrentStatus] = useState<PdrbStatus>(null)
    const [hasData, setHasData] = useState(false)

    const hasFetched = useRef(false)

    const { control, handleSubmit, reset, getValues, setValue, watch } = useForm<PdrbFormValues>({
        resolver: zodResolver(pdrbFormSchema) as any,
        defaultValues: {
            values: []
        }
    })

    const { fields } = useFieldArray({
        control,
        name: "values"
    })

    useEffect(() => {
        if (!regencyId || !year) {
            toast.error("Data wilayah atau tahun tidak valid")
            router.push("/operator/pdrb")
            return
        }

        if (hasFetched.current) return
        hasFetched.current = true

        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [regencyId, year])

    const loadData = async () => {
        setIsLoading(true)

        const [regenciesResult, sectorsResult, pdrbResult] = await Promise.all([
            getRegenciesWithProvince(),
            getSectors(),
            getPdrbByRegencyYear(regencyId!, parseInt(year!))
        ])

        if (regenciesResult.success && regenciesResult.data) {
            const found = regenciesResult.data.find(r => r.id === regencyId)
            if (found) {
                setRegency({ id: found.id, code: found.code, name: found.name })
            }
        }

        if (!sectorsResult.success || !sectorsResult.data) {
            toast.error("Gagal memuat data sektor")
            setIsLoading(false)
            return
        }

        const sectors = sectorsResult.data as Sector[]
        const existingValues = pdrbResult.success && pdrbResult.data ? pdrbResult.data : []

        if (existingValues.length > 0) {
            setCurrentStatus(existingValues[0].status as PdrbStatus)
            setHasData(true)
        }

        const formValues = sectors.map(sector => {
            const existing = existingValues.find((v: { sectorId: string }) => v.sectorId === sector.id)
            return {
                sectorId: sector.id,
                sectorName: sector.name,
                value: existing ? existing.value : 0
            }
        })

        reset({ values: formValues })
        setIsLoading(false)
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 2
        }).format(val)
    }

    const getTotal = () => {
        const values = getValues("values")
        return values.reduce((acc, curr) => acc + (curr.value || 0), 0)
    }

    const getStatusBadge = () => {
        switch (currentStatus) {
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
                        <Clock className="w-3 h-3 mr-1" /> Menunggu Review
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-600 border-gray-200">
                        Belum Ada Data
                    </Badge>
                )
        }
    }

    const onSubmit = (data: PdrbFormValues) => {
        startTransition(async () => {
            const result = await upsertPdrbValues({
                regencyId: regencyId!,
                year: parseInt(year!),
                values: data.values.map(v => ({
                    sectorId: v.sectorId,
                    value: v.value
                }))
            })

            if (result.success) {
                toast.success(`Data PDRB ${regency?.name} (${year}) berhasil disimpan`)
                setCurrentStatus('PENDING')
                setHasData(true)
            } else {
                toast.error(result.error || "Gagal menyimpan data")
            }
        })
    }

    const handleSubmitForApproval = () => {
        if (!hasData) {
            toast.error("Simpan data terlebih dahulu")
            return
        }

        startTransition(async () => {
            const result = await submitPdrbForApproval(regencyId!, parseInt(year!))

            if (result.success) {
                toast.success("Data berhasil diajukan untuk review admin")
                setCurrentStatus('PENDING')
            } else {
                toast.error(result.error || "Gagal mengajukan data")
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!regency) {
        return (
            <div className="p-8 text-center text-red-500">
                Wilayah tidak ditemukan
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-10 w-10"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600">
                            Input Data PDRB
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="font-medium text-gray-900">{regency.name}</span>
                            <span className="text-gray-300">•</span>
                            <span>Tahun {year}</span>
                        </p>
                    </div>
                </div>
                <div>{getStatusBadge()}</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-1">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[60px] text-center">No</TableHead>
                                    <TableHead className="min-w-[400px]">Sektor Lapangan Usaha</TableHead>
                                    <TableHead className="w-[300px] text-right">Nilai PDRB (Juta Rp)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => {
                                    const watchedValues = watch("values")
                                    const currentValue = watchedValues?.[index]?.value ?? 0

                                    return (
                                        <TableRow key={field.id} className="hover:bg-gray-50/30 transition-colors">
                                            <TableCell className="text-center font-medium text-gray-500 bg-gray-50/30">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700 py-4">
                                                {field.sectorName}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                                                        Rp
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        className="text-right font-mono pl-10 pr-4 h-11 text-base bg-white focus:bg-blue-50/50 border-gray-200 focus:border-blue-500 transition-all font-medium text-gray-900"
                                                        placeholder="0"
                                                        value={currentValue || ""}
                                                        onChange={(e) => {
                                                            const numValue = parseFloat(e.target.value)
                                                            setValue(`values.${index}.value`, isNaN(numValue) ? 0 : numValue)
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="border-t border-gray-100 p-6 bg-gray-50/30">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-lg border border-blue-100 w-full md:w-auto">
                                <span className="text-blue-600 font-medium">Total PDRB:</span>
                                <span className="text-xl font-bold font-mono text-blue-700">
                                    {formatCurrency(getTotal())}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => router.back()}
                                    className="flex-1 md:flex-none"
                                    disabled={isPending}
                                >
                                    Batal
                                </Button>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex-1 md:flex-none shadow-sm shadow-blue-200"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Simpan
                                </Button>

                                <Button
                                    type="button"
                                    size="lg"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2 flex-1 md:flex-none"
                                    onClick={handleSubmitForApproval}
                                    disabled={isPending || !hasData || currentStatus === 'PENDING'}
                                >
                                    <SendHorizonal className="h-4 w-4" />
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default function PdrbFormPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <PdrbFormContent />
        </Suspense>
    )
}
