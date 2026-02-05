import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Map, Info, Search, X, Sparkles, Layers, Lock } from "lucide-react"
import Link from "next/link"

interface MapSidePanelProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    selectedRegion: GeoJSON.Feature<GeoJSON.Geometry> | null
    isAuthenticated: boolean
    setShowAiPanel: (show: boolean) => void
    onClose: () => void
    isMobile?: boolean
}

export default function MapSidePanel({
    activeTab,
    setActiveTab,
    selectedRegion,
    isAuthenticated,
    setShowAiPanel,
    onClose,
    isMobile = false
}: MapSidePanelProps) {
    return (
        <div className="flex flex-col h-full w-full bg-white">
            {/* Sidebar Header */}
            {!isMobile && (
                <div className="flex items-center justify-between p-4 bg-blue-900 text-white shrink-0 border-b border-blue-800">
                    <div className="flex items-center gap-2 font-bold text-base">
                        <Map className="h-4 w-4" />
                        <span>Kontrol Peta</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-0 pt-0 bg-white border-b shadow-sm z-10 shrink-0">
                    <TabsList className="grid w-full grid-cols-2 rounded-none h-10 p-0 bg-transparent">
                        <TabsTrigger
                            value="filters"
                            className="rounded-none h-full text-xs data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:text-blue-900 data-[state=active]:bg-transparent text-gray-500 font-medium transition-all"
                        >
                            <Search className="w-3 h-3 mr-2" />
                            Filter
                        </TabsTrigger>
                        <TabsTrigger
                            value="info"
                            className="rounded-none h-full text-xs data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:text-blue-900 data-[state=active]:bg-transparent text-gray-500 font-medium transition-all"
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
                                <div className="grid grid-cols-1 gap-1.5 max-h-[300px] overflow-y-auto pr-2">
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
                                <div
                                    className="flex flex-col items-center justify-center h-40 text-center space-y-3 p-4 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all group"
                                    onClick={onClose}
                                >
                                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                                        <Map className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 group-hover:text-blue-700 transition-colors">
                                            Belum ada wilayah dipilih
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Klik di sini untuk menutup, atau pilih wilayah di peta.
                                        </p>
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

                                    {isAuthenticated ? (
                                        <Button
                                            className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-md mt-4 cursor-pointer"
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
                                    )}
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )
}
