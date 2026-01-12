import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MapsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Main Content Area: Sidebar + Map */}
            <div className="flex flex-1 flex-col md:flex-row">

                {/* Sidebar - Filter */}
                <aside className="w-full md:w-1/4 min-w-[300px] border-r bg-background p-6 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold tracking-tight">Filter Peta</h2>
                        <p className="text-sm text-muted-foreground">Sesuaikan tampilan peta sesuai kebutuhan Anda.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Cari Lokasi</h3>
                            <Input placeholder="Cari nama daerah..." />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-medium">Sektor Investasi</h3>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pertanian" />
                                <label htmlFor="pertanian" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pertanian
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pariwisata" />
                                <label htmlFor="pariwisata" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Pariwisata
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="energi" />
                                <label htmlFor="energi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Energi
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="infrastruktur" />
                                <label htmlFor="infrastruktur" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Infrastruktur
                                </label>
                            </div>
                        </div>

                        <Button className="w-full">Terapkan Filter</Button>
                    </div>
                </aside>

                {/* Map Container */}
                <main className="flex-1 bg-gray-100 relative min-h-[500px]">
                    <div className="w-full h-full flex items-center justify-center p-8">
                        <div className="text-center space-y-4">
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <p className="text-muted-foreground font-medium">Area Peta Interaktif</p>
                                <p className="text-xs text-muted-foreground mt-2">(Peta akan dimuat di sini)</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Bottom Section: Articles */}
            <section className="border-t bg-background py-12">
                <div className="container px-4 md:px-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">Artikel Terkait Investasi</h2>
                        <p className="text-muted-foreground">Berita dan informasi terbaru seputar peluang investasi di Sumatera Utara.</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <Card key={item}>
                                <div className="aspect-video bg-muted w-full relative overflow-hidden rounded-t-xl">
                                    {/* Placeholder for Data Image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                                        Image {item}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">Potensi Sektor Unggulan {item}</CardTitle>
                                    <CardDescription>Dipublikasikan pada 20 Mei 2024</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                    </p>
                                    <Button variant="link" className="px-0 mt-4 text-blue-600">Baca Selengkapnya &rarr;</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
