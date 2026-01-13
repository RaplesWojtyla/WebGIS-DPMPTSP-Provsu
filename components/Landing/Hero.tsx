"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, TrendingUp, Users, Award, MapPin } from "lucide-react";

const statsColumn1 = [
    {
        title: "Izin Terbit 2025",
        value: "12,450+",
        subtext: "Dokumen diterbitkan",
        icon: FileText,
        color: "blue",
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
        valueColor: "text-blue-700"
    },
    {
        title: "Nilai Investasi",
        value: "Rp 45T+",
        subtext: "Realisasi 2025",
        icon: TrendingUp,
        color: "emerald",
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        valueColor: "text-emerald-700"
    },
    {
        title: "Cakupan",
        value: "33",
        subtext: "Kabupaten/Kota",
        icon: MapPin,
        color: "sky",
        bg: "bg-sky-50",
        iconColor: "text-sky-600",
        valueColor: "text-sky-700"
    }
];

const statsColumn2 = [
    {
        title: "Investor",
        value: "5,000+",
        subtext: "Terdaftar di OSS",
        icon: Users,
        color: "purple",
        bg: "bg-purple-50",
        iconColor: "text-purple-600",
        valueColor: "text-purple-700"
    },
    {
        title: "Kepuasan",
        value: "92%",
        subtext: "Indeks Kepuasan Masyarakat",
        icon: Award,
        color: "amber",
        bg: "bg-amber-50",
        iconColor: "text-amber-600",
        valueColor: "text-amber-700"
    },
    {
        title: "Populasi",
        value: "4.5M+",
        subtext: "Penduduk (approx)",
        icon: Users,
        color: "rose",
        bg: "bg-rose-50",
        iconColor: "text-rose-600",
        valueColor: "text-rose-700"
    }
];

export default function Hero() {
    return (
        <section id="beranda" className="relative max-h-screen flex items-center pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 via-70% to-white text-white">
            <style jsx>{`
                @keyframes scroll-up {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes scroll-down {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0); }
                }
                .animate-scroll-up {
                    animation: scroll-up 40s linear infinite;
                }
                .animate-scroll-down {
                    animation: scroll-down 40s linear infinite;
                }
            `}</style>
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 text-blue-100 text-sm font-medium border border-blue-700 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Selamat Datang di DPMPTSP Sumut
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            Mendorong Investasi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Mempermudah Perizinan</span> di Sumatera Utara
                        </h1>

                        <p className="text-lg text-slate-300 max-w-lg">
                            Pelayanan perizinan dan penanaman modal yang cepat, transparan, dan terintegrasi berbasis digital untuk mewujudkan iklim investasi yang kondusif.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-950 hover:to-blue-950 text-white h-12 px-6 text-base shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-900/40 hover:-translate-y-1">
                                Ajukan Perizinan <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="h-12 px-6 text-base border-white/20 hover:bg-white/10 text-blue-950 hover:text-white backdrop-blur-sm">
                                Peta Investasi
                            </Button>
                        </div>
                    </div>

                    <div className="relative hidden md:block h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                        <div className="grid grid-cols-2 gap-4 h-full">
                            {/* Column 1 - Scroll Up */}
                            <div className="animate-scroll-up flex flex-col gap-4">
                                {[...statsColumn1, ...statsColumn1, ...statsColumn1].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 transition-transform duration-300 group hover:scale-[1.02]">
                                        <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                                            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">{stat.title}</h3>
                                        <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.subtext}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Column 2 - Scroll Down */}
                            <div className="animate-scroll-down flex flex-col gap-4">
                                {[...statsColumn2, ...statsColumn2, ...statsColumn2].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 transition-transform duration-300 group hover:scale-[1.02]">
                                        <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                                            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">{stat.title}</h3>
                                        <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.subtext}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decorative blobs */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-400/20 via-blue-600/10 to-transparent blur-3xl rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
