'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';

const MapMain = dynamic(() => import('./MapMain'), {
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p>Loading Map...</p>
        </div>
    ),
    ssr: false
});

interface MapWrapperProps {
    geoJsonData: any;
}

export default function MapWrapper({ geoJsonData }: MapWrapperProps) {
    const [selectedRegion, setSelectedRegion] = useState<any | null>(null);

    const handleRegionSelect = (feature: any) => {
        setSelectedRegion(feature);
    };

    const handleCloseSidebar = () => {
        setSelectedRegion(null);
    };

    const handlePredict = () => {
        // Todo: Prediksi Peluang Investasi
        console.log("Predict requested for:", selectedRegion?.properties?.province);
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <Sidebar
                selectedRegion={selectedRegion}
                onClose={handleCloseSidebar}
                onPredict={handlePredict}
            />
            <div className="w-full h-full">
                <MapMain
                    geoJsonData={geoJsonData}
                    onRegionSelect={handleRegionSelect}
                />
            </div>
        </div>
    );
}
