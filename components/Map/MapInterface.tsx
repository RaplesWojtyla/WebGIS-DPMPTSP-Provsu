'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Map, Info, Search, Menu, Layers, X, Sparkles, ArrowLeft, Loader2, Lock } from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { getRegionData } from "@/data/dummy-data"
import Link from "next/link"

// Dynamically import MapMain to avoid SSR issues
const MapMain = dynamic(() => import("@/components/Map/MapMain"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
})

interface MapInterfaceProps {
    geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>
    className?: string
    isAuthenticated?: boolean
}

export default function MapInterface({ geoJsonData, className, isAuthenticated = false }: MapInterfaceProps) {
    const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite' | 'dark'>('osm')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [layersOpen, setLayersOpen] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<GeoJSON.Feature<GeoJSON.Geometry> | null>(null)
    const [activeTab, setActiveTab] = useState("filters")
    const [showAiPanel, setShowAiPanel] = useState(false)

    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<string | null>(null)

    const handleAnalyze = useCallback(async () => {
        setIsAnalyzing(true)
        setAnalysisResult(null)

        // Simulate API Call delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        const lat = selectedRegion?.geometry?.type === 'Point'
            ? selectedRegion.geometry.coordinates[1]
            : 2.1154 // Fallback center
        const lng = selectedRegion?.geometry?.type === 'Point'
            ? selectedRegion.geometry.coordinates[0]
            : 99.5451 // Fallback center
        const address = selectedRegion?.properties?.province || selectedRegion?.properties?.VARNAME_2 || "Wilayah Sumatera Utara"
        const macroData = getRegionData(address)

        const result = `
# Analisis Investasi: ${macroData.name} (Site Specific)

1. Observasi Lokasi (Analisis Koordinat)
Area di sekitar koordinat ${lat.toFixed(4)}, ${lng.toFixed(4)} menunjukkan topografi yang mendukung untuk pengembangan sektor unggulan wilayah. Berdasarkan pemetaan satelit, aksesibilitas menuju jalan utama provinsi ${macroData.infrastructure.road_status.includes("Baik") ? "tergolong mudah" : "perlu peningkatan"}. Lahan ini dominan berupa area hijau yang potensial untuk *Greenfield Project* dengan minim risiko sengketa lahan sosial (${macroData.risk_profile.social_conflict}).

2. Potensi & Kesesuaian Lahan
 Peruntukan Terbaik: ${macroData.economy.main_sectors[0]} Terintegrasi & Kawasan Penunjang ${macroData.economy.main_sectors[1] || "Jasa"}.
 Alasan: Mendukung pertumbuhan UMK sebesar ${macroData.economy.umk} dan memanfaatkan stabilitas pasokan listrik (${macroData.infrastructure.power_supply}) yang ada.

3. Analisis SWOT (Gabungan Data & Lokasi)
 Strengths: Pertumbuhan PDRB ${macroData.economy.grdp_growth} yang stabil dan ketersediaan tenaga kerja lokal.
 Weaknesses: Ketergantungan pada infrastruktur jalan yang masih berstatus ${macroData.infrastructure.road_status}.
 Opportunities: Ekspansi pasar ke wilayah barat Sumatera dan insentif investasi daerah.
 Threat: Risiko ${macroData.risk_profile.disaster_risk} perlu mitigasi teknis sejak awal konstruksi.

4. Rekomendasi Strategis
1. Lakukan Feasibility Study mendalam terkait kontur tanah untuk mitigasi risiko ${macroData.risk_profile.disaster_risk}.
2. Prioritaskan rekrutmen tenaga kerja lokal untuk menjaga stabilitas sosial (${macroData.risk_profile.social_conflict}).
3. Manfaatkan insentif pajak daerah untuk sektor ${macroData.economy.main_sectors[0]}.
        `

        setAnalysisResult(result)
        setIsAnalyzing(false)
    }, [selectedRegion])

    // Auto-analyze when panel opens
    useEffect(() => {
        if (showAiPanel && !analysisResult && !isAnalyzing) {
            handleAnalyze()
        }
    }, [showAiPanel, analysisResult, isAnalyzing, handleAnalyze])

    // Handle region selection
    const handleRegionSelect = (feature: GeoJSON.Feature<GeoJSON.Geometry>) => {
        setSelectedRegion(feature)
        setActiveTab("info") // Auto-switch to info tab
        if (!sidebarOpen) setSidebarOpen(true)
    }

    return (
        <div className={cn("relative w-full h-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-inner", className)}>
            {/* Map Component */}
            <div className="absolute inset-0 z-0">
                <MapMain
                    geoJsonData={geoJsonData}
                    baseLayer={baseLayer}
                    className="h-full w-full"
                    onRegionSelect={handleRegionSelect}
                />
            </div>

            {/* Sidebar Toggle Button (Mobile & Desktop when closed) */}
            <div className={cn(
                "absolute top-4 left-4 z-20 transition-all duration-300",
                sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
                <Button
                    variant="default"
                    size="icon"
                    className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg border border-blue-100 h-10 w-10 rounded-full"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            {/* Floating Sidebar */}
            <Card className={cn(
                "absolute top-0 left-0 bottom-0 z-30 w-full sm:w-[350px] shadow-2xl border-0 border-r overflow-hidden flex flex-col transition-all duration-300 transform bg-white/95 backdrop-blur-sm rounded-none",
                sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
            )}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 bg-blue-900 text-white shrink-0 border-b border-blue-800">
                    <div className="flex items-center gap-2 font-bold text-base">
                        <Map className="h-4 w-4" />
                        <span>Kontrol Peta</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-0 pt-0 bg-white border-b shadow-sm z-10 shrink-0">
                        <TabsList className="grid w-full grid-cols-2 rounded-none h-10 p-0 bg-transparent">
                            <TabsTrigger
                                value="filters"
                                className="rounded-none h-full text-xs data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:text-blue-900 data-[state=active]:bg-blue-50/50 text-gray-500 font-medium transition-all"
                            >
                                <Search className="w-3 h-3 mr-2" />
                                Filter
                            </TabsTrigger>
                            <TabsTrigger
                                value="info"
                                className="rounded-none h-full text-xs data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:text-blue-900 data-[state=active]:bg-blue-50/50 text-gray-500 font-medium transition-all"
                            >
                                <Info className="w-3 h-3 mr-2" />
                                Informasi
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Filter Tab Content */}
                    <TabsContent value="filters" className="flex-1 flex flex-col overflow-hidden m-0 h-full data-[state=inactive]:hidden">
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                {/* Search Section */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                                        <Search className="w-3 h-3" /> Cari Wilayah
                                    </Label>
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400 group-hover:text-blue-700 transition-colors" />
                                        <Input
                                            placeholder="Cari Kabupaten/Kota..."
                                            className="pl-9 bg-white border-gray-200 focus-visible:ring-blue-900 focus-visible:border-blue-900 h-9 text-sm transition-all hover:border-blue-300"
                                        />
                                    </div>
                                </div>

                                {/* Sector Filters */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Sektor Potensi</Label>
                                    <div className="grid grid-cols-1 gap-1.5">
                                        {[
                                            { id: "pariwisata", label: "Pariwisata" },
                                            { id: "industri", label: "Industri & Manufaktur" },
                                            { id: "pertanian", label: "Pertanian & Perkebunan" },
                                            { id: "energi", label: "Energi & SDM" },
                                            { id: "infrastruktur", label: "Infrastruktur" },
                                            { id: "perdagangan", label: "Perdagangan & Jasa" },
                                            { id: "kelautan", label: "Kelautan & Perikanan" },
                                            { id: "pertambangan", label: "Pertambangan & Mineral" },
                                            { id: "teknologi", label: "Teknologi & Informasi" },
                                            { id: "kesehatan", label: "Kesehatan" },
                                            { id: "pendidikan", label: "Pendidikan" }
                                        ].map((sector) => (
                                            <div key={sector.id} className="flex items-center space-x-3 p-1.5 rounded-md hover:bg-gray-50 transition-colors">
                                                <Checkbox
                                                    id={sector.id}
                                                    className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900 border-gray-300 h-4 w-4"
                                                />
                                                <label
                                                    htmlFor={sector.id}
                                                    className="text-xs font-medium leading-none text-gray-700 cursor-pointer flex-1"
                                                >
                                                    {sector.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* Info Tab Content */}
                    <TabsContent value="info" className="flex-1 overflow-auto p-0 m-0 data-[state=inactive]:hidden">
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-5">
                                {!selectedRegion ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                                        <div className="p-3 bg-gray-50 rounded-full">
                                            <Map className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Belum ada wilayah dipilih</p>
                                            <p className="text-xs text-gray-400 mt-1">Klik pada area peta untuk melihat analisis detail.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="border-b pb-3">
                                            <h2 className="text-xl font-bold text-gray-900">{selectedRegion.properties?.province || selectedRegion.properties?.VARNAME_2 || "Wilayah Terpilih"}</h2>
                                            <p className="text-xs text-gray-500">Koordinat: {selectedRegion.geometry?.type === 'Point' ? 'Lokasi Spesifik' : 'Area Wilayah'}</p>
                                        </div>

                                        {/* AI Recommendation Section */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                                                    <Sparkles className="w-3 h-3" /> Rekomendasi AI
                                                </h3>
                                                <span className="text-[10px] font-medium bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">High Confidence</span>
                                            </div>

                                            <div className="rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 relative overflow-hidden">
                                                <div className="relative z-10 space-y-3">
                                                    <div>
                                                        <div className="text-[10px] text-blue-900/70 mb-1">Sektor Paling Potensial</div>
                                                        <div className="text-lg font-bold text-blue-900 leading-tight">Agariwisata & Eco-Tourism</div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="bg-white/60 p-2 rounded-lg">
                                                            <div className="text-[10px] text-gray-500">Pertumbuhan</div>
                                                            <div className="text-sm font-semibold text-blue-900">+12.5%</div>
                                                        </div>
                                                        <div className="bg-white/60 p-2 rounded-lg">
                                                            <div className="text-[10px] text-gray-500">Risiko</div>
                                                            <div className="text-sm font-semibold text-blue-700">Rendah</div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-blue-100/50">
                                                        <p className="text-[11px] text-blue-900 leading-relaxed">
                                                            Berdasarkan data topografi dan demografi, wilayah ini sangat cocok untuk pengembangan wisata alam berbasis pertanian.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Existing Projects Section */}
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                <Layers className="w-3 h-3" /> Proyek Berjalan
                                            </h3>

                                            <div className="space-y-2">
                                                {[1, 2].map((i) => (
                                                    <div key={i} className="group p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-blue-200 transition-all cursor-pointer">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="font-semibold text-sm text-gray-800 group-hover:text-blue-900 transition-colors">Pembangunan Sentra Tani {i}</div>
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">On Progress</span>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 mb-2">Jln. Lintas Sumatera Km. 45</p>
                                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                                            <span>Investasi: Rp 15M</span>
                                                            <span>•</span>
                                                            <span>2024 - 2026</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-md mt-4"
                                            size="sm"
                                            onClick={() => setShowAiPanel(true)}
                                        >
                                            {isAuthenticated ? (
                                                <Sparkles className="w-3 h-3 mr-2" />
                                            ) : (
                                                <Lock className="w-3 h-3 mr-2" />
                                            )}
                                            Analisis AI
                                        </Button>

                                        {/* {isAuthenticated ? (
                                            <Button
                                                className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-md mt-4"
                                                size="sm"
                                                onClick={() => setShowAiPanel(true)}
                                            >
                                                <Sparkles className="w-3 h-3 mr-2" />
                                                Analisis AI
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full mt-4"
                                                size="sm"
                                                variant="outline"
                                                asChild
                                            >
                                                <Link href="/sign-in">
                                                    <Lock className="w-3 h-3 mr-2" />
                                                    Login untuk Analisis AI
                                                </Link>
                                            </Button>
                                        )} */}
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* AI Analysis Slide-over Panel (Right Side) */}
            <Card className={cn(
                "absolute top-0 right-0 bottom-0 z-40 w-full sm:w-[1000px] shadow-xl border-0 border-l overflow-hidden flex flex-col transition-all duration-300 transform bg-white/95 backdrop-blur-sm rounded-none",
                showAiPanel ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
            )}>
                {/* Panel Header */}
                <div className="flex items-center justify-between p-4 bg-blue-900 text-white shrink-0 border-b border-blue-800">
                    <div className="flex items-center gap-2 font-bold text-base">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white hover:bg-white/20 hover:text-white mr-1"
                            onClick={() => setShowAiPanel(false)}
                        >
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                        <Sparkles className="h-4 w-4" />
                        <span>Analisis Wilayah AI</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-5">
                    {!analysisResult ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
                            <p className="text-sm font-medium text-gray-600">Sedang Menganalisis Potensi Wilayah...</p>
                        </div>
                    ) : (
                        /* Result View */
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-emerald-800 text-xs flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                Analisis Selesai (Dummy Mode)
                            </div>
                            <div className="prose prose-sm prose-blue max-w-none text-gray-700 bg-white p-1 rounded-lg">
                                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed border-l-2 border-blue-200 pl-3">
                                    {analysisResult}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Floating Layer Control (Right) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                <Button
                    variant="default"
                    size="icon"
                    className={cn(
                        "bg-white text-blue-900 hover:bg-blue-50 shadow-lg border border-blue-100 h-10 w-10 rounded-full transition-all",
                        layersOpen && "bg-blue-900 text-white hover:bg-blue-800 border-blue-900"
                    )}
                    onClick={() => setLayersOpen(!layersOpen)}
                >
                    <Layers className="h-5 w-5" />
                </Button>

                {/* Layer Options Popover */}
                <Card className={cn(
                    "w-[200px] shadow-xl border border-gray-100 bg-white/95 backdrop-blur-sm overflow-hidden transition-all duration-300 origin-top-right",
                    layersOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                )}>
                    <div className="p-3">
                        <Label className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2 block">
                            Tipe Peta Dasar
                        </Label>
                        <RadioGroup
                            defaultValue="osm"
                            value={baseLayer}
                            onValueChange={(v) => {
                                setBaseLayer(v as 'osm' | 'satellite' | 'dark')
                                // Optional: close on select
                                // setLayersOpen(false)
                            }}
                            className="flex flex-col gap-2"
                        >
                            {[
                                { id: "osm", label: "Standard", img: "https://c.tile.openstreetmap.org/12/3274/2180.png" },
                                { id: "satellite", label: "Satelit", img: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/5/12" },
                                { id: "dark", label: "Gelap", img: "/placeholder-dark-map.png", color: "#1a1a1a" }
                            ].map((layer) => (
                                <div key={layer.id} className="relative">
                                    <RadioGroupItem value={layer.id} id={`right-${layer.id}`} className="peer sr-only" />
                                    <Label
                                        htmlFor={`right-${layer.id}`}
                                        className="flex items-center gap-3 rounded-md border border-gray-100 bg-white p-2 hover:bg-blue-50 hover:border-blue-200 peer-data-[state=checked]:border-blue-900 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer transition-all"
                                    >
                                        <div
                                            className="h-8 w-8 rounded-sm bg-cover shadow-sm bg-center border border-gray-200 shrink-0"
                                            style={{
                                                backgroundImage: layer.img.startsWith('http') ? `url('${layer.img}')` : undefined,
                                                backgroundColor: layer.color
                                            }}
                                        ></div>
                                        <span className="font-medium text-gray-700 peer-data-[state=checked]:text-blue-900 text-xs">{layer.label}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </Card>
            </div>
        </div>
    )
}
