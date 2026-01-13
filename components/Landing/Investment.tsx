import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const sectors = [
    {
        title: "Perkebunan & Pertanian",
        desc: "Kelapa sawit, karet, kakao, dan hasil pertanian lainnya dengan lahan produktif yang luas.",
    },
    {
        title: "Energi & Pertambangan",
        desc: "Potensi energi terbarukan dan sumber daya mineral yang melimpah.",
    },
    {
        title: "Pariwisata",
        desc: "Destinasi wisata alam, budaya, dan kuliner yang beragam di Danau Toba dan sekitarnya.",
    },
    {
        title: "Industri Manufaktur",
        desc: "Industri pengolahan hasil perkebunan, makanan-minuman, dan tekstil.",
    },
    {
        title: "Perikanan & Kelautan",
        desc: "Perikanan tangkap, budidaya, dan pengolahan hasil laut dengan garis pantai yang panjang.",
    },
    {
        title: "Ekonomi Digital",
        desc: "Startup teknologi, e-commerce, dan layanan digital yang berkembang pesat.",
    }
];

export default function Investment() {
    return (
        <section id="investasi" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Potensi Investasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-950">Sumatera Utara</span>
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Sumatera Utara menawarkan beragam sektor unggulan dengan potensi investasi yang menjanjikan
                        </p>
                    </div>
                    <Button variant="outline" className="shrink-0 group hover:border-blue-500 hover:text-blue-600">
                        Lihat Semua Sektor <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectors.map((sector, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl h-64 shadow-md bg-gray-900">
                            {/* Fallback pattern */}
                            <div className="absolute inset-0 opacity-50">
                                <div className="w-full h-full bg-slate-800/50 pattern-grid-lg"></div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent p-6 flex flex-col justify-end transition-all duration-500 group-hover:from-blue-900/90 group-hover:via-blue-900/50">
                                <h3 className="text-xl font-bold text-white mb-2">{sector.title}</h3>
                                <p className="text-gray-200 text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                                    {sector.desc}
                                </p>
                                <div className="h-0 group-hover:h-8 transition-all duration-300 overflow-hidden">
                                    <span className="text-blue-300 text-sm font-medium flex items-center mt-2 cursor-pointer hover:text-white">
                                        Pelajari lebih lanjut <ArrowRight className="ml-1 h-3 w-3" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
