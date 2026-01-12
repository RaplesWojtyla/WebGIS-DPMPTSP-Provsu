import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { promises as fs } from 'fs';
import path from 'path';
import MapInterface from '@/components/Map/MapInterface';

export default async function MapsPage() {
    const geoJsonPath = path.join(process.cwd(), 'public', 'north-sumatera-geo.json');
    let geoJsonData = null;
    let errorMessage = null;

    try {
        const geoJsonFileContents = await fs.readFile(geoJsonPath, 'utf8');
        geoJsonData = JSON.parse(geoJsonFileContents);
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
        errorMessage = "Failed to load map data. System could not retrieve necessary files.";
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">

            {/* Header / Page Title */}
            <div className="bg-white border-b py-8">
                <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Peta Potensi Investasi</h1>
                    <p className="text-gray-600">Jelajahi peluang investasi di Sumatera Utara melalui peta interaktif</p>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-6 py-8 space-y-12">

                {/* Map Container */}
                <div className="relative w-full h-[650px]">
                    {errorMessage ? (
                        <div className="w-full h-full flex items-center justify-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                            <p>{errorMessage}</p>
                        </div>
                    ) : (
                        <MapInterface geoJsonData={geoJsonData} />
                    )}
                </div>

                {/* Related Articles Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Artikel Terkait Investasi</h2>
                            <p className="text-gray-600 mt-1">Berita dan informasi terbaru seputar peluang investasi di Sumatera Utara.</p>
                        </div>
                        <Button variant="outline" className="hidden md:flex hover:text-green-600 hover:border-green-200">
                            Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <Card key={item} className="group hover:shadow-lg transition-shadow duration-300 border-gray-100">
                                <div className="aspect-video bg-gray-100 w-full relative overflow-hidden rounded-t-xl group-hover:opacity-90 transition-opacity">
                                    {/* Placeholder for Data Image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                                        Thumbnail Image {item}
                                    </div>
                                </div>
                                <CardHeader className="p-5">
                                    <div className="w-fit px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full mb-2">
                                        PELUANG INVESTASI
                                    </div>
                                    <CardTitle className="text-lg leading-tight group-hover:text-green-700 transition-colors">
                                        Analisis Potensi Sektor Unggulan di Kawasan Danau Toba {item}
                                    </CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        Dipublikasikan pada 20 Mei 2024
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                    </p>
                                    <Button variant="link" className="px-0 mt-4 text-green-600 font-bold text-xs p-0 h-auto hover:text-green-700 hover:no-underline">
                                        BACA SELENGKAPNYA <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}
