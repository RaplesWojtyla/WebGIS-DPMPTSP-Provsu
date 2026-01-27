"use client"

import * as React from "react"
import { InvestForm } from "@/components/Invest/InvestForm"
import { InvestTable } from "@/components/Invest/InvestTable"
import { InvestmentRecord } from "@/lib/lq-utils"
import dummyData from "@/data/investment_dummy.json"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function AdminInvestPage() {
    const [records, setRecords] = React.useState<InvestmentRecord[]>(dummyData)
    const [showForm, setShowForm] = React.useState(false)

    const handleAddRecord = (newRecord: Omit<InvestmentRecord, "id">) => {
        const record: InvestmentRecord = {
            ...newRecord,
            id: Math.random().toString(36).substring(2, 9),
        }
        setRecords((prev) => [...prev, record])
        setShowForm(false)
    }

    const handleDeleteRecord = (id: string) => {
        setRecords((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <div className="container mx-auto py-10 space-y-12">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-blue-900 border-b pb-4">
                    Admin - Manajemen Data Investasi
                </h1>
                <p className="text-lg text-muted-foreground">
                    Halaman ini digunakan untuk mengelola data investasi (Tambah, Ubah, Hapus) yang akan ditampilkan di Dashboard Publik.
                </p>
            </div>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Manajemen Data Investasi</h2>
                    <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "destructive" : "default"}>
                        {showForm ? "Tutup Form" : <><PlusCircle className="mr-2 h-4 w-4" /> Tambah Data Baru</>}
                    </Button>
                </div>

                {showForm && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <InvestForm onAddRecord={handleAddRecord} />
                    </div>
                )}

                <InvestTable records={records} onDeleteRecord={handleDeleteRecord} />
            </section>
        </div>
    )
}