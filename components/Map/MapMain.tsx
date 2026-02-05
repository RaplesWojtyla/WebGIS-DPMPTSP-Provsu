'use client'

import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemo, useEffect } from 'react'
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
    selectedRegion?: GeoJSON.Feature<GeoJSON.Geometry> | null
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

// Component to handle map effects like flyTo
const MapEffect = () => {
    const map = useMap()

    useEffect(() => {
        // Check for desktop/sidebar width
        // MapInterface uses lg (1024px) breakpoint for switching between Drawer and Sidebar
        const isDesktop = window.innerWidth >= 1024
        // Sidebar width is 350px on desktop
        const sidebarWidth = isDesktop ? 350 : 0

        // Bounds for North Sumatra (Approximate)
        // SouthWest: [0.5, 96.5], NorthEast: [4.5, 100.5]
        const bounds: L.LatLngBoundsExpression = [
            [0.1, 96.5], // South West
            [4.8, 101.0]  // North East
        ]

        // Initial animation fly to fit bounds
        map.flyToBounds(bounds, {
            duration: 2,
            // Add padding to the left to account for sidebar on desktop
            // [x, y] -> x is left padding, y is top padding
            paddingTopLeft: [sidebarWidth + 20, 20],
            paddingBottomRight: [20, 20],
            easeLinearity: 0.25
        })
    }, [map])

    return null
}

const MapMain = ({
    geoJsonData,
    onRegionSelect,
    baseLayer = 'osm',
    className,
    selectedRegion
}: MapMainProps) => {

    // Posisi tengah sumut
    const position: [number, number] = [3.5, 98.5]

    const regionMarkers = useMemo(() => {
        if (!geoJsonData || !geoJsonData.features) return []

        return geoJsonData.features.map((feature: GeoJSON.Feature<GeoJSON.Geometry>) => {
            try {
                // console.log(feature)
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
                <MapEffect />
                <TileLayer
                    attribution={tileLayers[baseLayer]?.attribution || tileLayers.osm.attribution}
                    url={tileLayers[baseLayer]?.url || tileLayers.osm.url}
                />

                {/* Base Layer */}
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

                {/* Selected Region Highlight Layer */}
                {selectedRegion && (
                    <GeoJSON
                        key={`selected-${selectedRegion.properties?.ID_2 || selectedRegion.properties?.province || 'region'}`}
                        data={selectedRegion}
                        style={() => ({
                            color: '#f59e0b', // Amber-500
                            weight: 4,
                            opacity: 1,
                            fillColor: '#fbbf24', // Amber-400
                            fillOpacity: 0.6,
                            dashArray: '5, 5'
                        })}
                        interactive={false} // Allow clicks to pass through to base layer triggers if needed, but visually on top
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
        </div >
    )
}

export default MapMain
