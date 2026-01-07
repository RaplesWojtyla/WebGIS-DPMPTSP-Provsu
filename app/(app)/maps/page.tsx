import { promises as fs } from 'fs';
import path from 'path';
import MapWrapper from '@/components/Map/MapWrapper';

export default async function MapPage() {
    const geoJsonPath = path.join(process.cwd(), 'public', 'north-sumatera-geo.json');
    let geoJsonData = null;

    try {
        const geoJsonFileContents = await fs.readFile(geoJsonPath, 'utf8');
        geoJsonData = JSON.parse(geoJsonFileContents);
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
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
