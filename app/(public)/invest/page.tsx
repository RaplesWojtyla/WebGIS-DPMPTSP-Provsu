"use client"

import * as React from "react"
import { SectorDashboard } from "@/components/Invest/SectorDashboard"
import { SectorTypology } from "@/components/Invest/SectorTypology"
import { getApprovedInvestmentRecords } from "@/lib/actions/pdrb.actions"
import { FiLoader } from "react-icons/fi"


export default function InvestPage() {
    const [records, setRecords] = React.useState<InvestmentRecord[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const hasFetched = React.useRef(false)

    React.useEffect(() => {
        if (hasFetched.current) return
        hasFetched.current = true

        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const result = await getApprovedInvestmentRecords()
        if (result.success && result.data) {
            setRecords(result.data)
        }
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-20 flex items-center justify-center">
                <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (records.length === 0) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-slate-400">Belum ada data investasi yang tersedia</h1>
                <p className="text-slate-500 mt-2">Data akan muncul setelah operator mengajukan dan admin menyetujui data PDRB.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 space-y-12">

            {/* HEADER / TITLE */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-blue-900 border-b pb-4">
                    Dashboard Kinerja Sektor Investasi
                </h1>
                <p className="text-lg text-muted-foreground">
                    Analisis komprehensif potensi dan kinerja sektor unggulan di Sumatera Utara berdasarkan indikator LQ, SSA, dan Klassen.
                </p>
            </div>

            {/* SECTION 1: EXECUTIVE SUMMARY */}
            <section className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-blue-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-4">Ringkasan Eksekutif</h2>
                    <p className="text-blue-100 leading-relaxed mb-6">
                        Berdasarkan analisis data PDRB yang telah disetujui, halaman ini menyajikan analisis kinerja sektor-sektor investasi
                        di Sumatera Utara menggunakan indikator <strong>LQ</strong>, <strong>SSA</strong>, dan <strong>Klassen</strong>.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <span className="block text-3xl font-bold text-yellow-400">{records.length}</span>
                            <span className="text-sm text-blue-200">Data Masuk</span>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                            <span className="block text-3xl font-bold text-green-400">
                                {new Intl.NumberFormat("id-ID", { notation: "compact" }).format(records.reduce((a, b) => a + b.value, 0))}
                            </span>
                            <span className="text-sm text-blue-200">Total Investasi</span>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <SectorTypology records={records} />
                </div>
            </section>

            {/* SECTION 2: SECTOR DASHBOARD (WIDGETS) */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                        Analisis Per Sektor
                    </h2>
                </div>
                <SectorDashboard records={records} />
            </section>

        </div>
    )
}
