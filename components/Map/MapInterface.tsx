'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Menu, Layers } from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
// import { getRegionData } from "@/data/dummy-data"
import { toast } from "sonner"

import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import AiAnalysisPanel from "./AiAnalysisPanel"
import MapSidePanel from "./MapSidePanel"

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

    const [isMobile, setIsMobile] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<GeoJSON.Feature<GeoJSON.Geometry> | null>(null)
    const [activeTab, setActiveTab] = useState("filters")
    const [showAiPanel, setShowAiPanel] = useState(false)
    const [lastAnalyzedRegion, setLastAnalyzedRegion] = useState<string | null>(null)

    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<string | null>(null)

    // Check for mobile device
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024 // lg breakpoint
            setIsMobile(mobile)
            if (mobile) {
                setSidebarOpen(false)
            } else {
                setSidebarOpen(true)
            }
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleAnalyze = useCallback(async () => {
        if (!isAuthenticated) {
            toast.error("Anda harus login terlebih dahulu", {
                duration: 5000
            })

            return
        }

        if (!selectedRegion) {
            toast.error("Pilih wilayah terlebih dahulu", {
                duration: 5000
            })
            return
        }

        setIsAnalyzing(true)
        setAnalysisResult(null)

        try {
            const lat = selectedRegion?.geometry?.type === 'Point'
                ? selectedRegion.geometry.coordinates[1]
                : 2.1154
            const lng = selectedRegion?.geometry?.type === 'Point'
                ? selectedRegion.geometry.coordinates[0]
                : 99.5451
            const address = selectedRegion?.properties?.province || selectedRegion?.properties?.VARNAME_2 || "Wilayah Sumatera Utara"

            const response = await fetch('/api/investment-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lat, lng, address })
            })

            if (!response.ok) {
                const errorData = await response.json()
                setAnalysisResult(`❌ ${errorData.error}`)

                toast.error("Analisi gagal. Harap cobalagi beberapa saat kemudian", {
                    duration: 5000
                })
                return
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let res = ''

            while (reader) {
                const { done, value } = await reader.read()
                if (done) break

                res += decoder.decode(value, { stream: true })
                setAnalysisResult(res)
            }
        } catch (error) {
            console.error('Analysis error:', error);
            setAnalysisResult("❌ Terjadi kesalahan jaringan.");
        } finally {
            setIsAnalyzing(false)
        }
    }, [selectedRegion, isAuthenticated])


    useEffect(() => {
        if (showAiPanel) {
            const currentRegionId = selectedRegion?.properties?.province || selectedRegion?.properties?.VARNAME_2
            if (currentRegionId && currentRegionId !== lastAnalyzedRegion) {
                setAnalysisResult(null)
                handleAnalyze()
                setLastAnalyzedRegion(currentRegionId)
            }
        }
    }, [showAiPanel, handleAnalyze, lastAnalyzedRegion, selectedRegion])

    const handleRegionSelect = (feature: GeoJSON.Feature<GeoJSON.Geometry>) => {
        setSelectedRegion(feature)
        setActiveTab("info")
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
                    selectedRegion={selectedRegion}
                />
            </div>

            {/* Sidebar Toggle Button (Mobile & Desktop when closed) */}
            <div className={cn(
                "absolute top-4 left-4 z-20 transition-all duration-300",
                sidebarOpen && !isMobile ? "opacity-0 pointer-events-none" : "opacity-100"
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

            {/* Mobile Drawer */}
            {isMobile ? (
                <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <DrawerContent className="max-h-[85vh] outline-none">
                        <DrawerTitle className="sr-only">Kontrol Peta</DrawerTitle>
                        <DrawerDescription className="sr-only">Panel kontrol untuk filter dan informasi wilayah</DrawerDescription>

                        {/* 
                            Use h-[85vh] strictly to force layout height.
                            Add data-vaul-no-drag so clicks/scrolls inside don't drag the drawer.
                        */}
                        <div className="h-[85vh] w-full overflow-hidden rounded-t-xl bg-white" data-vaul-no-drag>
                            <MapSidePanel
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                selectedRegion={selectedRegion}
                                isAuthenticated={!!isAuthenticated}
                                setShowAiPanel={setShowAiPanel}
                                onClose={() => setSidebarOpen(false)}
                                isMobile={true}
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                /* Desktop Side Panel */
                <Card className={cn(
                    "absolute top-0 left-0 bottom-0 z-30 w-full sm:w-[350px] shadow-2xl border-0 border-r overflow-hidden flex flex-col transition-all duration-300 transform bg-white/95 backdrop-blur-sm rounded-none",
                    sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
                )}>
                    <MapSidePanel
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectedRegion={selectedRegion}
                        isAuthenticated={!!isAuthenticated}
                        setShowAiPanel={setShowAiPanel}
                        onClose={() => setSidebarOpen(false)}
                        isMobile={false}
                    />
                </Card>
            )}

            {/* AI Analysis Component (Mobile Drawer & Desktop Panel) */}
            {isMobile ? (
                <Drawer open={showAiPanel} onOpenChange={setShowAiPanel}>
                    <DrawerContent className="max-h-[85vh] outline-none">
                        <DrawerTitle className="sr-only">Analisis Wilayah AI</DrawerTitle>
                        <DrawerDescription className="sr-only">Hasil analisis investasi berbasis AI</DrawerDescription>

                        <div className="h-[85vh] w-full overflow-hidden rounded-t-xl bg-white" data-vaul-no-drag>
                            <AiAnalysisPanel
                                isAnalyzing={isAnalyzing}
                                analysisResult={analysisResult}
                                onClose={() => setShowAiPanel(false)}
                            />
                        </div>
                    </DrawerContent>
                </Drawer>
            ) : (
                /* Desktop AI Side Panel */
                <Card className={cn(
                    "absolute top-0 right-0 bottom-0 z-40 w-full sm:w-[450px] md:w-[600px] lg:w-[700px] shadow-xl border-0 border-l overflow-hidden flex flex-col transition-all duration-300 transform bg-white/95 backdrop-blur-sm rounded-none",
                    showAiPanel ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
                )}>
                    <AiAnalysisPanel
                        isAnalyzing={isAnalyzing}
                        analysisResult={analysisResult}
                        onClose={() => setShowAiPanel(false)}
                    />
                </Card>
            )}

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
