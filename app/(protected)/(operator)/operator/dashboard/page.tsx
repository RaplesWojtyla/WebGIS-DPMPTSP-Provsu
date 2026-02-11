"use client"

import { useState, useEffect } from "react"
import { FiClock, FiActivity, FiTrendingUp, FiFastForward, FiGrid } from "react-icons/fi"
import {
    getRegenciesWithProvince,
    getSectors,
    getOperatorPdrbSubmissions,
} from "@/lib/actions/pdrb.actions"

import AnalysisStatus from "@/components/dashboard/operator/AnalysisStatus"
import AnalysisLQ from "@/components/dashboard/operator/AnalysisLQ"
import AnalysisSSA from "@/components/dashboard/operator/AnalysisSSA"
import AnalysisDLQ from "@/components/dashboard/operator/AnalysisDLQ"
import AnalysisKlassen from "@/components/dashboard/operator/AnalysisKlassen"
import DashboardOperatorSkeleton from "@/components/skeleton/DashboardOperatorSkeleton"

// Types needed for passing data
interface PdrbSubmission {
    regencyId: string
    regencyCode: string
    regencyName: string
    year: number
    sectorCount: number
    status: string
    submittedAt: Date | null
    notes: string | null
}

interface Region {
    id: string
    code: string
    name: string
}

interface Sector {
    id: string
    code: string
    name: string
}

export default function OperatorDashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [regions, setRegions] = useState<Region[]>([])
    const [sectors, setSectors] = useState<Sector[]>([])
    const [submissions, setSubmissions] = useState<PdrbSubmission[]>([])
    const [activeTab, setActiveTab] = useState<"status" | "lq" | "ssa" | "klassen" | "dlq">("status")

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)

        const [regenciesResult, sectorsResult, submissionsResult] = await Promise.all([
            getRegenciesWithProvince(),
            getSectors(),
            getOperatorPdrbSubmissions()
        ])

        if (regenciesResult.success && regenciesResult.data) {
            setRegions(regenciesResult.data.map(r => ({
                id: r.id,
                code: r.code,
                name: r.name
            })))
        }

        if (sectorsResult.success && sectorsResult.data) {
            setSectors(sectorsResult.data as Sector[])
        }

        if (submissionsResult.success && submissionsResult.data) {
            setSubmissions(submissionsResult.data as PdrbSubmission[])
        }

        setIsLoading(false)
    }

    if (isLoading) {
        return <DashboardOperatorSkeleton />
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Dashboard Operator</h1>
                    <p className="text-slate-500 mt-1">Kelola data PDRB dan lakukan analisis ekonomi.</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit">
                    <button onClick={() => setActiveTab("status")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "status" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiClock /> Status Pengajuan</button>
                    <button onClick={() => setActiveTab("lq")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "lq" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiActivity /> Analisis LQ</button>
                    <button onClick={() => setActiveTab("ssa")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "ssa" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiTrendingUp /> Analisis SSA</button>
                    <button onClick={() => setActiveTab("dlq")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "dlq" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiFastForward /> Analisis DLQ</button>
                    <button onClick={() => setActiveTab("klassen")} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "klassen" ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}><FiGrid /> Analisis Klassen</button>
                </div>

                {/* Status Pengajuan Tab */}
                {activeTab === "status" && <AnalysisStatus submissions={submissions} />}

                {/* LQ Analysis Tab */}
                {activeTab === "lq" && <AnalysisLQ regions={regions} sectors={sectors} years={years} />}

                {/* SSA Analysis Tab */}
                {activeTab === "ssa" && <AnalysisSSA regions={regions} sectors={sectors} years={years} />}

                {/* DLQ Analysis Tab */}
                {activeTab === "dlq" && <AnalysisDLQ regions={regions} sectors={sectors} years={years} />}

                {/* Klassen Analysis Tab */}
                {activeTab === "klassen" && <AnalysisKlassen regions={regions} sectors={sectors} years={years} />}
            </div>
        </div>
    )
}
