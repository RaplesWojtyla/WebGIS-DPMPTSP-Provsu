"use client"

import * as React from "react"
import { SectorDashboard } from "@/components/Invest/SectorDashboard"
import { SectorTypology } from "@/components/Invest/SectorTypology"
import { InvestmentRecord } from "@/lib/lq-utils"
import dummyData from "@/data/investment_dummy.json"


export default function InvestPage() {
    const [records] = React.useState<InvestmentRecord[]>(dummyData)
    // Removed state for form and table

    return (
        <div className="container mx-auto py-10 space-y-12">

            {/* HERDER / TITLE */}
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
                        Berdasarkan analisis data tahun 2023-2024, sektor <strong>Perkebunan</strong> dan <strong>Industri Pengolahan</strong> menunjukkan kinerja
                        <strong> Prima</strong> dengan nilai LQ {'>'} 1 dan pertumbuhan positif. Sektor Pariwisata memiliki potensi besar untuk dikembangkan lebih lanjut (Kuadran Potensial).
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
