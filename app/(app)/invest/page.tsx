"use client"

import React, { useState } from "react"
import {
    MapPin,
    ArrowRight,
    TrendingUp,
    AlertTriangle,
    Zap,
    Filter,
    Building2,
    Leaf,
    Briefcase
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

// --- DATA DUMMY UNTUK MOCKUP ---
const investmentData = [
    {
        id: 1,
        title: "Kawasan Industri Deli Serdang",
        location: "Kabupaten Deli Serdang",
        sector: "Industri",
        value: "Rp 500 Miliar",
        risk: "Rendah",
        desc: "Kawasan industri bersepadu yang dekat dengan pelabuhan dan lapangan terbang antarabangsa.",
        details: {
            umk: "Rp 3.505.076",
            infra: "Jalan Arteri (Baik), Listrik Stabil (PLN Premium)",
            incentive: "Tax Holiday 5 Tahun"
        }
    },
    {
        id: 2,
        title: "Eco-Tourism Danau Toba",
        location: "Kabupaten Simalungun",
        sector: "Pariwisata",
        value: "Rp 1.2 Triliun",
        risk: "Sedang",
        desc: "Pengembangan resort ekologi bertaraf antarabangsa di kawasan super prioritas.",
        details: {
            umk: "Rp 2.900.000",
            infra: "Akses Jalan Tol (Dalam Pembangunan), Air Bersih",
            incentive: "Kemudahan Perizinan Wisata"
        }
    },
    {
        id: 3,
        title: "Perkebunan Sawit Modern",
        location: "Kabupaten Asahan",
        sector: "Perkebunan",
        value: "Rp 850 Miliar",
        risk: "Rendah",
        desc: "Replanting dan hilirisasi produk sawit menjadi oleokimia.",
        details: {
            umk: "Rp 3.000.000",
            infra: "Jalan Kebun (Cukup), Irigasi Teknis",
            incentive: "Subsidi Bibit Unggul"
        }
    },
    {
        id: 4,
        title: "Pembangkit Listrik Tenaga Air",
        location: "Kabupaten Tapanuli Utara",
        sector: "Energi",
        value: "Rp 2.1 Triliun",
        risk: "Tinggi (Geotermal)",
        desc: "Pemanfaatan arus sungai deras untuk energi terbarukan 50MW.",
        details: {
            umk: "Rp 2.850.000",
            infra: "Jaringan Transmisi SUTET",
            incentive: "Feed-in Tariff PLN"
        }
    }
];

export default function InvestmentPage() {
    const [selectedItem, setSelectedItem] = useState(investmentData[0]);

    return (
        <div className="min-h-screen bg-slate-50/50">

            {/* 1. HERO SECTION */}
            <div className="bg-white border-b py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Peluang Investasi <span className="text-blue-900">Sumatera Utara</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl">
                        Jelajahi potensi perniagaan strategik yang telah dikurasi oleh pemerintah daerah.
                        Data lengkap, transparan, dan siap untuk investasi.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8">

                {/* 2. FILTER BAR (MOCKUP) */}
                <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-dashed border-slate-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mr-2">
                        <Filter className="w-4 h-4" /> Filter:
                    </div>
                    <Button variant="secondary" size="sm" className="rounded-full bg-slate-800 text-white hover:bg-slate-700">
                        Semua Sektor
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full hover:border-blue-500 hover:text-blue-600">
                        <Building2 className="w-3 h-3 mr-2" /> Industri
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full hover:border-green-500 hover:text-green-600">
                        <Leaf className="w-3 h-3 mr-2" /> Perkebunan
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full hover:border-orange-500 hover:text-orange-600">
                        <Briefcase className="w-3 h-3 mr-2" /> Pariwisata
                    </Button>
                </div>

                {/* 3. GRID KATALOG */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investmentData.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden flex flex-col">
                            {/* Gambar Placeholder */}
                            <div className="h-48 bg-slate-200 relative group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                                    Image: {item.title}
                                </div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-800 shadow-sm border border-blue-100">
                                    {item.sector}
                                </div>
                            </div>

                            <CardHeader className="pb-3">
                                <div className="flex items-center text-xs text-slate-500 mb-2 font-medium">
                                    <MapPin className="w-3 h-3 mr-1 text-red-500" />
                                    {item.location}
                                </div>
                                <CardTitle className="text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4 text-sm flex-1">
                                <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                                    {item.desc}
                                </p>

                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Nilai Investasi</p>
                                        <p className="font-semibold text-slate-800">{item.value}</p>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Profil Risiko</p>
                                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                                            {item.risk}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2 border-t border-slate-50 bg-slate-50/50">
                                {/* 4. DRAWER INTERACTION */}
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between hover:text-blue-700 hover:bg-blue-50 group/btn"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            Lihat Analisis Detail
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </DrawerTrigger>

                                    <DrawerContent>
                                        <div className="mx-auto w-full max-w-3xl">
                                            <DrawerHeader>
                                                <DrawerTitle className="text-2xl">{selectedItem.title}</DrawerTitle>
                                                <DrawerDescription>Analisis makro dan infrastruktur penunjang investasi</DrawerDescription>
                                            </DrawerHeader>

                                            <div className="p-4 grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-2"><Building2 className="w-4 h-4" /> Ekonomi Daerah</h4>
                                                        <ul className="text-sm space-y-2 text-slate-600 border-l-2 border-slate-200 pl-4">
                                                            <li>UMK: <span className="font-semibold text-slate-900">{selectedItem.details.umk}</span></li>
                                                            <li>Pertumbuhan PDRB: <span className="font-semibold text-slate-900">5.2% (YoY)</span></li>
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Infrastruktur</h4>
                                                        <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded-lg">{selectedItem.details.infra}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Insentif Khusus</h4>
                                                        <p className="text-sm text-blue-800">{selectedItem.details.incentive}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Mitigasi Risiko</h4>
                                                        <p className="text-sm text-slate-600">Kawasan ini memiliki sistem pengendalian banjir terpadu dan pos keamanan industri 24 jam.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <DrawerFooter className="flex-row gap-4 pt-4 border-t">
                                                <Button className="flex-1 bg-blue-900">Ajukan Minat Investasi</Button>
                                                <DrawerClose asChild>
                                                    <Button variant="outline" className="flex-1">Tutup</Button>
                                                </DrawerClose>
                                            </DrawerFooter>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}