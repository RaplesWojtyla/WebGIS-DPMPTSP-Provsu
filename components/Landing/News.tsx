import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
    {
        title: "Pembaruan Sistem OSS Nasional",
        excerpt: "Sistem OSS telah diperbarui dengan fitur baru untuk kemudahan pengajuan perizinan berusaha.",
        date: "10 Jan 2026",
        author: "Admin",
        category: "Teknologi"
    },
    {
        title: "Penghargaan Pelayanan Publik",
        excerpt: "DPMPTSP Sumut meraih penghargaan pelayanan publik terbaik tingkat nasional tahun 2025.",
        date: "05 Jan 2026",
        author: "Humas",
        category: "Prestasi"
    },
    {
        title: "Sosialisasi Investasi 2026",
        excerpt: "Agenda sosialisasi peluang investasi dan kemudahan perizinan untuk pelaku usaha.",
        date: "28 Dec 2025",
        author: "Bidang Promosi",
        category: "Kegiatan"
    }
];

export default function News() {
    return (
        <section id="berita" className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Berita & Pengumuman <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-950">Terkini</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Informasi terbaru seputar kegiatan, regulasi, dan peluang investasi di Sumatera Utara
                        </p>
                    </div>
                    <Button variant="outline" className="shrink-0 bg-white hover:bg-gray-100 hover:text-green-600 hover:border-green-200">
                        Lihat Semua Berita <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsItems.map((item, index) => (
                        <article key={index} className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                            <div className="h-48 bg-gray-200 rounded-t-xl relative overflow-hidden">
                                {/* Placeholder for image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 group-hover:scale-105 transition-transform duration-500">
                                    Image Placeholder
                                </div>
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm">
                                    {item.category}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {item.author}</span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                                    <Link href="#">{item.title}</Link>
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {item.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <Link href="#" className="inline-flex items-center text-green-600 text-sm font-medium hover:underline hover:text-green-700">
                                        Baca Selengkapnya <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
