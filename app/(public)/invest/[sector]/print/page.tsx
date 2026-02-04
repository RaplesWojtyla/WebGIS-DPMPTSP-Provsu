"use client"

import * as React from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useSectorAnalysis } from "@/hooks/useSectorAnalysis"
import { RegionalComparisonChart } from "@/components/charts/RegionalComparisonChart"
import { TrendCurveChart } from "@/components/charts/TrendCurveChart"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Loader2, Download, X } from "lucide-react"

export default function SectorPrintPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const [isGenerating, setIsGenerating] = React.useState(false)

    // Get parameters
    const sectorName = decodeURIComponent(params.sector as string)
    const urlRegion = searchParams.get('region') || "all"
    const urlYear = searchParams.get('year') || undefined

    const {
        sectorMetrics,
        currentYear,
        startYear,
        yearlyTrendData,
        regionalData,
        formatCurrency,
        selectedRegion,
    } = useSectorAnalysis(sectorName, urlRegion, urlYear)

    const handleDownloadPDF = async () => {
        setIsGenerating(true)
        try {
            // A4 Dimensions: 210mm x 297mm
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = 210
            const pdfHeight = 297

            // Wait for charts to fully render/paint
            await new Promise(resolve => setTimeout(resolve, 3000))

            // Function to add a page
            const addPageToPDF = async (elementId: string, pageNum: number) => {
                const element = document.getElementById(elementId)
                if (!element) throw new Error(`Element ${elementId} not found`)

                const canvas = await html2canvas(element, {
                    scale: 2, // Higher scale for better clarity
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff", // Explicitly Hex
                    windowWidth: 1200, // Force desktop width render
                    // Ignore elements that might be problematic
                    ignoreElements: (element) => element.tagName === 'IFRAME',
                    onclone: (clonedDoc) => {
                        // Double safety: Force styles on the cloned document
                        const clonedBody = clonedDoc.body;
                        clonedBody.style.fontFamily = 'serif';
                        clonedBody.style.color = '#000000';
                        clonedBody.style.background = '#ffffff';
                    }
                })

                const imgData = canvas.toDataURL('image/jpeg', 1.0)

                // If not first page, add new page
                if (pageNum > 1) {
                    pdf.addPage()
                }

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
            }

            // Capture Page 1
            await addPageToPDF('report-page-1', 1)

            // Capture Page 2
            await addPageToPDF('report-page-2', 2)

            // Capture Page 3
            await addPageToPDF('report-page-3', 3)

            // Save
            const safeSector = sectorName.replace(/[^a-zA-Z0-9]/g, '_')
            pdf.save(`Laporan_Investasi_${safeSector}_${currentYear}.pdf`)

        } catch (error) {
            console.error("Gagal membuat PDF:", error)
            alert(`Maaf, terjadi kesalahan saat membuat PDF: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setIsGenerating(false)
        }
    }

    if (!sectorMetrics) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="flex items-center gap-2 text-slate-500 font-medium animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" /> Memuat data laporan...
            </div>
        </div>
    )

    // Common Colors (Hex constants to bypass tailwind 'lab' issues)
    const colors = {
        white: "#ffffff",
        black: "#000000",
        slate50: "#f8fafc",
        slate100: "#f1f5f9",
        slate200: "#e2e8f0",
        slate300: "#cbd5e1",
        slate500: "#64748b",
        slate700: "#334155",
        slate800: "#1e293b",
        slate900: "#0f172a",
        blue900: "#1e3a8a"
    }

    return (
        <div className="min-h-screen bg-slate-100 font-serif pb-20 pt-24 text-black">
            {/* 
                NUCLEAR OPTION: Override all global CSS variables that might be using oklch/lab 
                This style tag will only affect this page and force standard HEX colors
            */}
            <style jsx global>{`
                :root {
                    --background: #ffffff !important;
                    --foreground: #000000 !important;
                    --card: #ffffff !important;
                    --card-foreground: #000000 !important;
                    --popover: #ffffff !important;
                    --popover-foreground: #000000 !important;
                    --primary: #3b82f6 !important;
                    --primary-foreground: #ffffff !important;
                    --secondary: #f1f5f9 !important;
                    --secondary-foreground: #000000 !important;
                    --muted: #f1f5f9 !important;
                    --muted-foreground: #64748b !important;
                    --accent: #f1f5f9 !important;
                    --accent-foreground: #000000 !important;
                    --destructive: #ef4444 !important;
                    --border: #e2e8f0 !important;
                    --input: #e2e8f0 !important;
                    --ring: #3b82f6 !important;
                    --chart-1: #e76e50 !important;
                    --chart-2: #2a9d8f !important;
                    --chart-3: #264653 !important;
                    --chart-4: #f4a261 !important;
                    --chart-5: #e9c46a !important;
                    --radius: 0.5rem !important;
                }
            `}</style>

            {/* --- CONTROLS --- */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-50 shadow-sm print:hidden">
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg text-slate-800">Pratinjau Laporan PDF</h1>
                    <p className="text-xs text-slate-500 flex gap-2">
                        <span>Sektor: <b>{sectorName}</b></span>
                        <span>•</span>
                        <span>Tahun: <b>{currentYear}</b></span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isGenerating ? "Memproses..." : "Download PDF"}
                    </button>
                    <button
                        onClick={() => window.close()}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
                    >
                        <X className="w-4 h-4" /> Tutup
                    </button>
                </div>
            </div>

            {/* --- PREVIEW AREA --- */}
            <div className="flex flex-col items-center gap-8 print:block print:w-full">

                {/* ======================= PAGE 1 ======================= */}
                {/* Explicitly set color: #000000 to block inheritance of any global variables */}
                <div className="shadow-2xl print:shadow-none" style={{ backgroundColor: colors.white, color: '#000000' }}>
                    <div id="report-page-1" className="w-[210mm] h-[297mm] p-12 overflow-hidden relative flex flex-col box-border" style={{ backgroundColor: colors.white }}>

                        {/* Official Header */}
                        <div className="flex items-center pb-4 mb-2 border-double" style={{ borderBottom: `3px solid ${colors.black}` }}>
                            <div className="w-[2.8cm] h-[2.2cm] relative shrink-0 mr-5">
                                <Image src="/DPMPTSP_Provsu.png" alt="Logo" fill className="object-contain object-center" />
                            </div>
                            <div className="flex-1 text-center leading-tight">
                                <h3 className="text-lg font-bold uppercase tracking-wide" style={{ color: colors.black }}>Pemerintah Provinsi Sumatera Utara</h3>
                                <h2 className="text-xl font-bold uppercase tracking-wider mb-1" style={{ color: colors.black }}>Dinas Penanaman Modal dan Pelayanan Perizinan Terpadu Satu Pintu</h2>
                                <p className="text-sm font-normal italic" style={{ color: colors.slate900 }}>Jalan Wahid Hasyim No. 8, Babura, Kec. Medan Baru, Kota Medan, Sumatera Utara 20154</p>
                                <p className="text-sm font-normal" style={{ color: colors.slate900 }}>Website: dpmptsp.sumutprov.go.id | Email: dpmptsp@sumutprov.go.id</p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center my-6">
                            <h1 className="text-xl font-black uppercase underline decoration-2 underline-offset-4 mb-4" style={{ color: colors.black }}>Laporan Analisis Investasi Sektor</h1>
                            <div className="inline-block text-left text-sm p-3 rounded-sm min-w-[300px]" style={{ border: `1px solid ${colors.black}` }}>
                                <div className="grid grid-cols-[100px_1fr] gap-1">
                                    <span className="font-semibold">Sektor</span>
                                    <span className="font-bold uppercase">: {sectorName}</span>

                                    <span className="font-semibold">Wilayah</span>
                                    <span className="uppercase">: {selectedRegion === "all" ? "Sumatera Utara" : selectedRegion}</span>

                                    <span className="font-semibold">Periode Data</span>
                                    <span>: {currentYear}</span>
                                </div>
                            </div>
                        </div>

                        {/* Section 1: Executive Summary Overview */}
                        <div className="flex-1">
                            <div className="mb-3 px-3 py-1" style={{ backgroundColor: colors.slate50, borderLeft: `4px solid ${colors.black}` }}>
                                <h3 className="text-md font-bold uppercase" style={{ color: colors.black }}>I. Ringkasan Eksekutif</h3>
                            </div>
                            <p className="text-justify text-sm mb-4 leading-relaxed" style={{ color: colors.black }}>
                                Berdasarkan data realisasi investasi tahun <strong>{currentYear}</strong>, sektor <strong>{sectorName}</strong> mencatatkan kinerja yang signifikan.
                                Analisis ini mengkombinasikan metode <em>Location Quotient (LQ)</em>, <em>Shift Share Analysis (SSA)</em>, dan tipologi <em>Klassen</em> untuk memberikan
                                gambaran komprehensif mengenai posisi daya saing dan pertumbuhan sektor tersebut di wilayah Provinsi Sumatera Utara.
                            </p>
                            <p className="text-justify text-sm mb-6 leading-relaxed" style={{ color: colors.black }}>
                                Sektor ini memiliki total investasi sebesar <strong>{formatCurrency(sectorMetrics.currentValue)}</strong>.
                                Berdasarkan analisis LQ, sektor ini memiliki nilai indeks <strong>{sectorMetrics.avgLQ.toFixed(2)}</strong>, yang mengindikasikan status sebagai
                                <strong> {sectorMetrics.isReliable ? "SEKTOR BASIS (UNGGULAN)" : "SEKTOR NON-BASIS"}</strong>.
                                Hal ini menunjukkan kemampuan sektor ini dalam memenuhi permintaan lokal serta potensinya untuk ekspor antar wilayah.
                            </p>

                            <div className="mt-8">
                                <h4 className="text-sm font-bold mb-2 uppercase inline-block" style={{ borderBottom: `1px solid ${colors.black}`, color: colors.black }}>Indikator Kinerja Utama</h4>
                                <table className="w-full text-sm border-collapse" style={{ border: `1px solid ${colors.black}` }}>
                                    <thead style={{ backgroundColor: colors.slate100 }}>
                                        <tr>
                                            <th className="px-3 py-2 text-left" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Indikator</th>
                                            <th className="px-3 py-2 text-right" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Nilai / Status</th>
                                            <th className="px-3 py-2 text-left" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Deskripsi Singkat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-3 py-2 font-semibold" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Total Investasi (Rp)</td>
                                            <td className="px-3 py-2 text-right font-bold" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>{formatCurrency(sectorMetrics.currentValue)}</td>
                                            <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Total kapitisasi modal disetujui</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 font-semibold" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Status LQ</td>
                                            <td className="px-3 py-2 text-right font-bold" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>{sectorMetrics.avgLQ >= 1 ? "BASIS (>1)" : "NON-BASIS (<1)"}</td>
                                            <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Keunggulan komparatif wilayah</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-2 font-semibold" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Tipologi Klassen</td>
                                            <td className="px-3 py-2 text-right font-bold uppercase" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>{sectorMetrics.dominantQuadrant}</td>
                                            <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Posisi pertumbuhan relatif</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer Page 1 */}
                        <div className="w-full pt-2 flex justify-between text-[10px] uppercase mt-auto" style={{ borderTop: `1px solid ${colors.black}`, color: colors.slate500 }}>
                            <span>Laporan Analisis Investasi Sektor - {currentYear}</span>
                            <span>Halaman 1 dari 3</span>
                        </div>
                    </div>
                </div>

                {/* ======================= PAGE 2 ======================= */}
                <div className="shadow-2xl print:shadow-none" style={{ backgroundColor: colors.white, color: '#000000' }}>
                    <div id="report-page-2" className="w-[210mm] h-[297mm] p-12 overflow-hidden relative flex flex-col box-border" style={{ backgroundColor: colors.white }}>

                        {/* Header Minimal */}
                        <div className="pb-2 mb-6 text-right text-xs uppercase font-bold" style={{ borderBottom: `1px solid ${colors.black}`, color: colors.slate500 }}>
                            Lampiran I - Analisis Pertumbuhan - {sectorName}
                        </div>

                        {/* Section 2: Shift Share */}
                        <div className="mb-10">
                            <div className="px-3 py-1 mb-3" style={{ backgroundColor: colors.slate50, borderLeft: `4px solid ${colors.black}` }}>
                                <h3 className="text-md font-bold uppercase" style={{ color: colors.black }}>II. Analisis Pertumbuhan (Shift Share)</h3>
                            </div>
                            <p className="text-justify text-sm mb-4 leading-relaxed" style={{ color: colors.black }}>
                                Analisis Shift Share digunakan untuk mengetahui komponen perubahan pertumbuhan investasi. Berikut adalah rincian komponen pertumbuhan sektor ini:
                            </p>
                            <table className="w-full text-sm border-collapse mb-4" style={{ border: `1px solid ${colors.black}` }}>
                                <thead style={{ backgroundColor: colors.slate100 }}>
                                    <tr>
                                        <th className="px-3 py-2 text-left" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Komponen Analisis</th>
                                        <th className="px-3 py-2 text-right" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Nilai (Rp)</th>
                                        <th className="px-3 py-2 text-left" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Interpretasi Ekonomi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-3 py-2 font-medium" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>National Growth Effect (Nij)</td>
                                        <td className="px-3 py-2 text-right font-mono" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>{formatCurrency(sectorMetrics.ssaBreakdown.nij)}</td>
                                        <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Pengaruh pertumbuhan ekonomi nasional (Indonesia)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 font-medium" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Industrial Mix Effect (Mij)</td>
                                        <td className="px-3 py-2 text-right font-mono" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>{formatCurrency(sectorMetrics.ssaBreakdown.mij)}</td>
                                        <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Pertumbuhan spesifik sektor bisnis tersebut</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 font-medium" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Competitive Effect (Cij)</td>
                                        <td className="px-3 py-2 text-right font-mono" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>{formatCurrency(sectorMetrics.ssaBreakdown.cij)}</td>
                                        <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Daya saing/keunggulan lokasional wilayah</td>
                                    </tr>
                                    <tr className="font-bold" style={{ backgroundColor: colors.slate100 }}>
                                        <td className="px-3 py-2" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Total Shift (Pergeseran Bersih)</td>
                                        <td className="px-3 py-2 text-right font-mono" style={{ border: `1px solid ${colors.black}`, color: colors.blue900 }}>{formatCurrency(sectorMetrics.totalShift)}</td>
                                        <td className="px-3 py-2 text-xs" style={{ border: `1px solid ${colors.black}`, color: colors.black }}>Akumulasi pertumbuhan bersih</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Chart 1 Visualization */}
                        <div className="flex-1 pt-6" style={{ borderTop: `2px solid ${colors.slate100}` }}>
                            <h3 className="text-md font-bold uppercase mb-4 text-center" style={{ color: colors.black }}>Grafik 1. Tren Pertumbuhan Investasi ({startYear} - {currentYear})</h3>
                            <div className="w-full p-4 rounded-sm" style={{ border: `1px solid ${colors.slate300}`, backgroundColor: colors.white }}>
                                <TrendCurveChart
                                    data={yearlyTrendData}
                                    height={400}
                                    className="shadow-none border-none"
                                    hideHeader={true}
                                />
                            </div>
                        </div>

                        {/* Footer Page 2 */}
                        <div className="w-full pt-2 flex justify-between text-[10px] uppercase mt-auto" style={{ borderTop: `1px solid ${colors.black}`, color: colors.slate500 }}>
                            <span>Laporan Analisis Investasi Sektor - {currentYear}</span>
                            <span>Halaman 2 dari 3</span>
                        </div>
                    </div>
                </div>

                {/* ======================= PAGE 3 ======================= */}
                <div className="shadow-2xl print:shadow-none" style={{ backgroundColor: colors.white, color: '#000000' }}>
                    <div id="report-page-3" className="w-[210mm] h-[297mm] p-12 overflow-hidden relative flex flex-col box-border" style={{ backgroundColor: colors.white }}>
                        {/* Header Minimal */}
                        <div className="pb-2 mb-6 text-right text-xs uppercase font-bold" style={{ borderBottom: `1px solid ${colors.black}`, color: colors.slate500 }}>
                            Lampiran II - Sebaran Wilayah - {sectorName}
                        </div>

                        <div className="px-3 py-1 mb-6" style={{ backgroundColor: colors.slate50, borderLeft: `4px solid ${colors.black}` }}>
                            <h3 className="text-md font-bold uppercase" style={{ color: colors.black }}>III. Sebaran Investasi Per Wilayah</h3>
                        </div>

                        {/* Chart 2 Container - Full Page Focus */}
                        <div className="flex-1 flex flex-col items-center">
                            <h4 className="text-center font-bold text-sm mb-4 uppercase w-full" style={{ color: colors.black }}>Grafik 2. Detail Sebaran Investasi Kabupaten/Kota ({currentYear})</h4>
                            <div className="w-full p-4 rounded-sm" style={{ border: `1px solid ${colors.slate300}`, backgroundColor: colors.white }}>
                                <RegionalComparisonChart
                                    data={regionalData}
                                    highlightedRegion={selectedRegion !== "all" ? selectedRegion : undefined}
                                    height={700}
                                    className="shadow-none border-none from-transparent to-transparent bg-transparent"
                                    hideHeader={true}
                                />
                            </div>
                        </div>

                        {/* Signature Area */}
                        <div className="mt-8 flex justify-end">
                            <div className="p-4 w-[250px] text-center" style={{ backgroundColor: colors.white }}>
                                <p className="text-sm mb-1" style={{ color: colors.black }}>Medan, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                                <p className="text-xs mb-16" style={{ color: colors.slate500 }}>Dibuat secara otomatis oleh sistem</p>
                                <p className="font-bold underline text-sm inline-block px-8 pt-1" style={{ borderTop: `1px solid ${colors.black}`, color: colors.black }}>Administrator Sistem</p>
                            </div>
                        </div>

                        {/* Footer Page 3 */}
                        <div className="w-full pt-2 flex justify-between text-[10px] uppercase mt-auto" style={{ borderTop: `1px solid ${colors.black}`, color: colors.slate500 }}>
                            <span>Laporan Analisis Investasi Sektor - {currentYear}</span>
                            <span>Halaman 3 dari 3</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
