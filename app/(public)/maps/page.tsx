import { promises as fs } from 'fs'
import path from 'path'
import MapInterface from '@/components/Map/MapInterface'
import { auth } from "@/lib/better-auth/auth"
import { headers } from "next/headers"

export default async function MapsPage() {
    const geoJsonPath = path.join(process.cwd(), 'public', 'north-sumatera-geo.json')
    let geoJsonData = null
    let errorMessage = null


    let isAuthenticated = false
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        isAuthenticated = !!session?.user
    } catch (error) {
        console.error("Error checking session:", error)
    }

    try {
        const geoJsonFileContents = await fs.readFile(geoJsonPath, 'utf8')
        geoJsonData = JSON.parse(geoJsonFileContents)
    } catch (error) {
        console.error("Error loading GeoJSON:", error)
        errorMessage = "Failed to load map data. System could not retrieve necessary files."
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
                <div className="relative w-full h-[75vh] md:h-[calc(100vh-240px)] min-h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    {errorMessage ? (
                        <div className="w-full h-full flex items-center justify-center text-red-600 bg-red-50 rounded-xl border border-red-200">
                            <p>{errorMessage}</p>
                        </div>
                    ) : (
                        <MapInterface geoJsonData={geoJsonData} isAuthenticated={isAuthenticated} />
                    )}
                </div>
            </main>
        </div>
    )
}
