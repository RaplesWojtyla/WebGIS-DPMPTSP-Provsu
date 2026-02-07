"use client"

import * as React from "react"
import { Regulations } from "@/components/Info/Regulations"
import { UserGuide } from "@/components/Info/UserGuide"
import { Info } from "lucide-react"

export default function InfoPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <section className="bg-linear-to-b from-blue-900 to-blue-800 text-white pt-32 pb-16">
                <div className="container px-4 md:px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <Info className="w-8 h-8 text-blue-200" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Pusat Informasi & Layanan
                    </h1>
                    <p className="max-w-2xl mx-auto text-blue-100 text-lg md:text-xl leading-relaxed">
                        Akses dokumen regulasi terbaru dan panduan penggunaan WebGIS untuk memaksimalkan pengalaman investasi Anda di Sumatera Utara.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main>
                <div className="space-y-0"> {/* Removed gap between sections for cleaner flow */}
                    <Regulations />
                    <UserGuide />
                </div>
            </main>
        </div>
    )
}
