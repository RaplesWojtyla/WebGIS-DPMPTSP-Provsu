import { promises as fs } from 'fs';
import path from 'path';
import MapWrapper from '@/components/Map/MapWrapper';

export default async function MapPage() {
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

    if (errorMessage) {
        return (
            <main className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 text-red-600 gap-4">
                <h1 className="text-2xl font-bold">Map Error</h1>
                <p>{errorMessage}</p>
            </main>
        );
    }

    return (
        <main className="w-full h-screen flex flex-col">
            <div className="flex-1 w-full h-full relative">
                <MapWrapper
                    geoJsonData={geoJsonData}
                />
            </div>
        </main>
    );
}
