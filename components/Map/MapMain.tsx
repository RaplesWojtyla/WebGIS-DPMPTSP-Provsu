'use client'

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useMemo } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

interface MapMainProps {
    geoJsonData: any
}

interface RegionMarker {
    position: [number, number]
    name: string
}

const MapMain = ({ geoJsonData }: MapMainProps) => {
    // Posisi tengah sumut
    const position: [number, number] = [2.1154, 99.5451]

    // Calculate markers for each region (regency/city)
    const regionMarkers = useMemo(() => {
        if (!geoJsonData || !geoJsonData.features) return [];

        return geoJsonData.features.map((feature: any) => {
            try {
                // Create a temporary layer to calculate the center
                const layer = L.geoJSON(feature);
                const bounds = layer.getBounds();
                const center = bounds.getCenter();

                // Get the name from properties (prioritize province property as seen in file)
                const name = feature.properties.province || feature.properties.VARNAME_2 || 'Unknown Region';

                return {
                    position: [center.lat, center.lng],
                    name: name
                } as RegionMarker;
            } catch (e) {
                console.error("Error calculating center for feature", e);
                return null;
            }
        }).filter((m: RegionMarker | null) => m !== null);
    }, [geoJsonData]);

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={position}
                zoom={8}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ background: '#f0f0f0' }}
            >
                <TileLayer
                    attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {geoJsonData && (
                    <GeoJSON
                        data={geoJsonData}
                        style={() => ({
                            color: '#4a83ec',
                            weight: 2,
                            opacity: 1,
                            fillColor: '#8ecae6',
                            fillOpacity: 0.5
                        })}
                    />
                )}

                {regionMarkers.map((marker: RegionMarker, index: number) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>
                            {marker.name}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapMain
