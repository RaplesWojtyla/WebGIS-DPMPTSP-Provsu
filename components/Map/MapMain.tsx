'use client'

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemo } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { cn } from '@/lib/utils'

// @ts-expect-error: _getIconUrl is not defined in the type definition but exists on prototype
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
})

interface MapMainProps {
    geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>
    onRegionSelect?: (feature: GeoJSON.Feature<GeoJSON.Geometry>) => void
    baseLayer?: 'osm' | 'satellite' | 'dark'
    className?: string
}

interface RegionMarker {
    position: [number, number]
    name: string
    feature: GeoJSON.Feature<GeoJSON.Geometry>
}

const tileLayers = {
    osm: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy Esri &mdash Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    dark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy <a href="https://carto.com/attributions">CARTO</a>'
    }
}

const MapMain = ({
    geoJsonData,
    onRegionSelect,
    baseLayer = 'osm',
    className
}: MapMainProps) => {
    // Posisi tengah sumut
    const position: [number, number] = [2.1154, 99.5451]

    const regionMarkers = useMemo(() => {
        if (!geoJsonData || !geoJsonData.features) return []

        return geoJsonData.features.map((feature: GeoJSON.Feature<GeoJSON.Geometry>) => {
            try {
                console.log(feature)
                // Hitung titik tengah wilayah
                const layer = L.geoJSON(feature)
                const bounds = layer.getBounds()
                const center = bounds.getCenter()

                const name = feature.properties!.province || feature.properties!.VARNAME_2 || 'Unknown Region'

                return {
                    position: [center.lat, center.lng],
                    name: name,
                    feature: feature
                } as RegionMarker
            } catch (e) {
                console.error("Error calculating center for feature", e)
                return null
            }
        }).filter((m: RegionMarker | null) => m !== null)
    }, [geoJsonData])

    const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry>, layer: L.Layer) => {
        layer.on({
            click: () => {
                if (onRegionSelect) {
                    onRegionSelect(feature)
                }
            },
            mouseover: (e: L.LeafletEvent) => {
                const layer = e.target
                layer.setStyle({
                    weight: 3,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                })
            },
            mouseout: (e: L.LeafletEvent) => {
                const layer = e.target
                layer.setStyle({
                    color: '#4a83ec',
                    weight: 2,
                    opacity: 1,
                    fillColor: '#8ecae6',
                    fillOpacity: 0.5
                })
            }
        })
    }

    return (
        <div className={cn("w-full h-full relative z-0", className)}>
            <MapContainer
                center={position}
                zoom={8}
                scrollWheelZoom={true}
                zoomControl={false}
                className="w-full h-full rounded-lg outline-none"
                style={{ background: '#f0f0f0' }}
            >
                <TileLayer
                    attribution={tileLayers[baseLayer]?.attribution || tileLayers.osm.attribution}
                    url={tileLayers[baseLayer]?.url || tileLayers.osm.url}
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
                        onEachFeature={onEachFeature}
                    />
                )}

                {regionMarkers.map((marker: RegionMarker, index: number) => (
                    <Marker
                        key={index}
                        position={marker.position}
                        eventHandlers={{
                            click: () => {
                                if (onRegionSelect) {
                                    onRegionSelect(marker.feature)
                                }
                            }
                        }}
                    >
                        <Popup>
                            <span className="font-semibold">{marker.name}</span>
                            <br />
                            <span className="text-xs text-blue-600 cursor-pointer" onClick={() => onRegionSelect && onRegionSelect(marker.feature)}>
                                Click for details
                            </span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapMain
