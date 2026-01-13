'use client'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Map, Layers, Info, Search, Menu } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"

// Dynamically import MapMain to avoid SSR issues
const MapMain = dynamic(() => import("@/components/Map/MapMain"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
})

export default function MapsPage() {
    const [baseLayer, setBaseLayer] = useState<'osm' | 'satellite' | 'dark'>('osm');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-100">
            {/* Full Screen Map */}
            <div className="absolute inset-0 z-0">
                <MapMain
                    geoJsonData={null} // TODO: Add geoJSON data when available
                    baseLayer={baseLayer}
                    className="h-full w-full"
                />
            </div>

            {/* Floating Sidebar Toggle (Mobile) */}
            <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 left-4 z-20 md:hidden shadow-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Floating Sidebar */}
            <Card className={`
                absolute top-4 left-4 bottom-4 z-10 w-[380px] shadow-2xl border-0 overflow-hidden flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%] md:translate-x-0'}
            `}>
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <Map className="h-5 w-5" />
                        <span>Tampilan Peta</span>
                    </div>

                    {/* Close button for mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="sr-only">Close</span>
                        X
                    </Button>
                </div>

                <Tabs defaultValue="filters" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-4 pt-2">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="info">Info</TabsTrigger>
                            <TabsTrigger value="filters">Filter Layer</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="info" className="flex-1 overflow-auto p-4">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Informasi Wilayah</h3>
                                <p className="text-sm text-gray-500">
                                    Klik pada wilayah di peta untuk melihat informasi detail mengenai potensi investasi, luas wilayah, dan data demografis.
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-2">
                                    <Info className="h-4 w-4" /> Petunjuk
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>Gunakan scroll untuk zoom in/out</li>
                                    <li>Klik marker untuk popup detail</li>
                                    <li>Gunakan tab Filter untuk opsi layer</li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="filters" className="flex-1 flex flex-col overflow-hidden m-0 h-full">
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6">
                                {/* Search */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-gray-500 uppercase">Cari Lokasi</Label>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari Kabupaten/Kota..."
                                            className="pl-9 bg-gray-50 border-gray-200"
                                        />
                                    </div>
                                </div>

                                {/* Base Layer Switcher */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-gray-500 uppercase">Tipe Peta</Label>
                                    <RadioGroup
                                        defaultValue="osm"
                                        value={baseLayer}
                                        onValueChange={(v) => setBaseLayer(v as any)}
                                        className="grid grid-cols-3 gap-2"
                                    >
                                        <div>
                                            <RadioGroupItem value="osm" id="osm" className="peer sr-only" />
                                            <Label
                                                htmlFor="osm"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center text-xs gap-2"
                                            >
                                                <span className="h-8 w-8 rounded-full bg-cover shadow-sm bg-center" style={{ backgroundImage: "url('https://c.tile.openstreetmap.org/12/3274/2180.png')" }}></span>
                                                Standard
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="satellite" id="satellite" className="peer sr-only" />
                                            <Label
                                                htmlFor="satellite"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center text-xs gap-2"
                                            >
                                                <span className="h-8 w-8 rounded-full bg-cover shadow-sm bg-center" style={{ backgroundImage: "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/5/12')" }}></span>
                                                Satelit
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                                            <Label
                                                htmlFor="dark"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center text-xs gap-2"
                                            >
                                                <span className="h-8 w-8 rounded-full bg-cover shadow-sm bg-center bg-gray-800"></span>
                                                Dark
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Custom Layers */}
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-gray-500 uppercase">Bidang Usaha</Label>
                                    <div className="space-y-2">
                                        {[
                                            "Tourism",
                                            "Manufacturing",
                                            "Agribusiness",
                                            "Trade",
                                            "Energy",
                                            "Infrastructure"
                                        ].map((item) => (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox id={item.toLowerCase()} />
                                                <label
                                                    htmlFor={item.toLowerCase()}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {item}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
