'use client';

import dynamic from 'next/dynamic';

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
    return <MapMain geoJsonData={geoJsonData} />;
}
