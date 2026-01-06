import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import { RegionData } from '../types';
import { CITY_TO_REGION, REGION_CODES } from '../constants';
import { getColorForPercentage } from '../dataUtils';
import '../styles/TurkeyMap.css';

// Türkiye harita verisi URL adresi
const TURKEY_TOPO_URL = 'https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json';

interface TurkeyMapProps {
    regionData: Record<string, RegionData>;
}

interface TooltipState {
    show: boolean;
    content: string;
    x: number;
    y: number;
}

interface CityLabelState {
    show: boolean;
    cityName: string;
    x: number;
    y: number;
}

const TurkeyMap: React.FC<TurkeyMapProps> = ({ regionData }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipState>({
        show: false,
        content: '',
        x: 0,
        y: 0
    });

    const [cityLabel, setCityLabel] = useState<CityLabelState>({
        show: false,
        cityName: '',
        x: 0,
        y: 0
    });

    const [zoom, setZoom] = useState(1.0); // Varsayılan yakınlaştırma seviyesi
    const [center, setCenter] = useState<[number, number]>([35, 39]);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [geoData, setGeoData] = useState<any>(null);

    // İstanbul bölge ayrımı işlemi
    useEffect(() => {
        fetch(TURKEY_TOPO_URL)
            .then(response => response.json())
            .then(data => {
                const features = data.features.map((feature: any) => {
                    // İstanbul ili tespiti (ID: 40)
                    if (feature.id === 40 && feature.properties.name === 'İstanbul') {
                        const avrupaPolygons: any[] = [];
                        const anadoluPolygons: any[] = [];

                        // Çoklu poligon yapısı
                        if (feature.geometry.type === 'MultiPolygon') {
                            feature.geometry.coordinates.forEach((polygon: any) => {
                                // Ortalama boylam hesaplaması
                                let totalLng = 0;
                                let count = 0;

                                polygon.forEach((ring: any) => {
                                    ring.forEach((coord: any) => {
                                        totalLng += coord[0];
                                        count++;
                                    });
                                });

                                const avgLng = totalLng / count;

                                // Boğaz hattına göre kıta ayrımı (Boylam: 29.05)
                                if (avgLng < 29.05) {
                                    avrupaPolygons.push(polygon);
                                } else {
                                    anadoluPolygons.push(polygon);
                                }
                            });
                        }

                        // İki ayrı bölge oluşturulur
                        return [
                            {
                                ...feature,
                                id: '40-avrupa',
                                properties: { ...feature.properties, name: 'İstanbul (Avrupa)' },
                                geometry: {
                                    type: 'MultiPolygon',
                                    coordinates: avrupaPolygons
                                }
                            },
                            {
                                ...feature,
                                id: '40-anadolu',
                                properties: { ...feature.properties, name: 'İstanbul (Anadolu)' },
                                geometry: {
                                    type: 'MultiPolygon',
                                    coordinates: anadoluPolygons
                                }
                            }
                        ];
                    }
                    return feature;
                }).flat();

                setGeoData({ ...data, features });
            })
            .catch(error => console.error('GeoJSON yüklenirken hata:', error));
    }, []);

    // Kontrollü yakınlaştırma yönetimi
    useEffect(() => {
        const container = mapContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // Ctrl ile yakınlaştırma aktif
            if (e.ctrlKey) {
                e.preventDefault();
                const zoomSensitivity = 0.001;
                const delta = -e.deltaY * zoomSensitivity;
                setZoom(prevZoom => Math.min(Math.max(prevZoom + delta, 0.5), 8));
            }
            // Normal kaydırma davranışı
        };

        // Varsayılan davranışı engellemek için pasif mod kapalı
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);


    // Şehir ve bölge verisi eşleştirmesi
    const cityToRegionData = useMemo(() => {
        const map: Record<string, {
            regionName: string;
            color: string;
            percentage: number;
            regionCode: string;
            totalCount: number;
            matchCount: number;
        }> = {};

        Object.values(regionData).forEach((data) => {
            const color = getColorForPercentage(data.percentage);

            // Şehir veri eşleştirmesi
            Object.entries(CITY_TO_REGION).forEach(([city, region]) => {
                if (region === data.regionName) {
                    map[city] = {
                        regionName: data.regionName,
                        color,
                        percentage: data.percentage,
                        regionCode: data.regionCode,
                        totalCount: data.totalCount,
                        matchCount: data.matchCount
                    };
                }
            });
        });

        // Bölge verileri işlenir

        return map;
    }, [regionData]);


    const calculateTooltipPosition = (
        clientX: number,
        clientY: number,
        tooltipWidth: number,
        tooltipHeight: number,
        mapContainer: HTMLDivElement | null
    ): { x: number; y: number } => {
        const offset = 14;

        if (!mapContainer) {
            return {
                x: clientX + offset,
                y: clientY + offset,
            };
        }

        const rect = mapContainer.getBoundingClientRect();

        // Harita içi konum hesaplaması
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        let x = relX + offset;
        let y = relY + offset;

        const containerWidth = rect.width;
        const containerHeight = rect.height;

        // -----------------------------
        //        SAĞ KENAR KONTROLU
        // -----------------------------
        if (x + tooltipWidth > containerWidth) {
            x = relX - tooltipWidth - offset;
        }

        // -----------------------------
        //        SOL KENAR KONTROLU
        // -----------------------------
        if (x < 0) {
            x = offset;
        }

        // -----------------------------
        //        ALT KENAR KONTROLU
        // -----------------------------
        if (y + tooltipHeight > containerHeight) {
            y = relY - tooltipHeight - offset;
        }

        // -----------------------------
        //        ÜST KENAR KONTROLU
        // -----------------------------
        if (y < 0) {
            y = offset;
        }

        return { x, y };
    };


    // Bölge üzeri fare hareketi başlangıcı
    const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
        const cityName = geo.properties.name || geo.properties.NAME || geo.properties.il_adi;
        const regionInfo = cityToRegionData[cityName];

        if (regionInfo) {
            setHoveredRegion(regionInfo.regionName);

            // İstanbul bölge verisi gösterimi
            let tooltipContent = '';
            let tooltipWidth = 320;
            let tooltipHeight = 150;

            // İpucu içeriği oluşturma
            if (cityName === 'İstanbul (Avrupa)') {
                const avrupaData = regionData[REGION_CODES["İstanbul Avrupa Bölge Ofisi"]];

                if (avrupaData) {
                    tooltipContent = `
                <strong>İstanbul Avrupa Bölge Ofisi</strong><br/>
                Bölge Kodu: ${REGION_CODES["İstanbul Avrupa Bölge Ofisi"]}<br/>
                Oran: <strong>${avrupaData.percentage.toFixed(1)}%</strong><br/>
                Eşleşen: ${avrupaData.matchCount} / ${avrupaData.totalCount}
                    `;
                }

            } else if (cityName === 'İstanbul (Anadolu)') {
                const anadoluData = regionData[REGION_CODES["İstanbul Anadolu Bölge Ofisi"]];

                if (anadoluData) {
                    tooltipContent = `
                <strong>İstanbul Anadolu Bölge Ofisi</strong><br/>
                Bölge Kodu: ${REGION_CODES["İstanbul Anadolu Bölge Ofisi"]}<br/>
                Oran: <strong>${anadoluData.percentage.toFixed(1)}%</strong><br/>
                Eşleşen: ${anadoluData.matchCount} / ${anadoluData.totalCount}
                    `;
                }

            } else {
                tooltipContent = `
            <strong>${regionInfo.regionName}</strong><br/>
            Bölge Kodu: ${regionInfo.regionCode}<br/>
            Oran: <strong>${regionInfo.percentage.toFixed(1)}%</strong><br/>
            Eşleşen: ${regionInfo.matchCount} / ${regionInfo.totalCount}
          `;
            }

            // Konum hesaplaması
            const { x, y } = calculateTooltipPosition(
                event.clientX,
                event.clientY,
                tooltipWidth,
                tooltipHeight,
                mapContainerRef.current
            );

            setTooltip({ show: true, content: tooltipContent, x, y });


            // Şehir etiketi konumlandırma
            if (mapContainerRef.current) {
                const rect = mapContainerRef.current.getBoundingClientRect();
                const relX = event.clientX - rect.left;
                const relY = event.clientY - rect.top;

                const cityLabelX = relX;
                const cityLabelY = y > relY ? relY - 40 : relY + 40;

                setCityLabel({
                    show: true,
                    cityName: cityName,
                    x: cityLabelX,
                    y: cityLabelY
                });
            } else {
                setCityLabel({
                    show: true,
                    cityName: cityName,
                    x: event.clientX,
                    y: event.clientY + 40
                });
            }
        }
    };

    // Fare hareketi takibi
    const handleMouseMove = (event: React.MouseEvent) => {
        if (tooltip.show) {
            // Tahmini boyutlandırma
            const tooltipWidth = 320;
            const tooltipHeight = 150;

            const { x, y } = calculateTooltipPosition(
                event.clientX,
                event.clientY,
                tooltipWidth,
                tooltipHeight,
                mapContainerRef.current
            );

            setTooltip(prev => ({ ...prev, x, y }));

            if (cityLabel.show) {
                // Etiket görünürlüğü kontrolü
                if (mapContainerRef.current) {
                    const rect = mapContainerRef.current.getBoundingClientRect();
                    const relX = event.clientX - rect.left;
                    const relY = event.clientY - rect.top;
                    const labelY = y > relY ? relY - 40 : relY + 40;

                    setCityLabel(prev => ({
                        ...prev,
                        x: relX,
                        y: labelY
                    }));
                }
            }
        }
    };

    // Fare çıkış işlemi
    const handleMouseLeave = () => {
        setTooltip({ show: false, content: '', x: 0, y: 0 });
        setCityLabel({ show: false, cityName: '', x: 0, y: 0 });
        setHoveredRegion(null);
    };

    // Yakınlaştırma sıfırlama
    const handleResetZoom = () => {
        setZoom(1);
        setCenter([35, 39]);
    };

    return (
        <div className="map-container" ref={mapContainerRef}>
            <div className="zoom-controls">
                <button
                    className="zoom-btn zoom-in"
                    onClick={() => setZoom(Math.min(zoom * 1.2, 4))}
                    title="Yakınlaştır"
                >
                    +
                </button>
                <button
                    className="zoom-btn zoom-out"
                    onClick={() => setZoom(Math.max(zoom / 1.2, 1))}
                    title="Uzaklaştır"
                >
                    −
                </button>
                <button
                    className="zoom-btn zoom-reset"
                    onClick={handleResetZoom}
                    title="Sıfırla"
                >
                    ↺
                </button>
            </div>

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 2500,
                    center: center
                }}
                style={{
                    width: '100%',
                    height: 'auto'
                }}
            >
                {/* Varsayılan kaydırma davranışı yönetimi */}
                <ZoomableGroup
                    zoom={zoom}
                    center={center}
                    minZoom={0.5}
                    maxZoom={8}
                    disablePanning={false}
                    disableZooming={true} // Yakınlaştırma kontrolü
                    onMoveEnd={({ coordinates, zoom: newZoom }: { coordinates: [number, number]; zoom: number }) => {
                        setCenter(coordinates);
                        // Yakınlaştırma güncelleme eşiği
                        if (Math.abs(newZoom - zoom) > 0.001) {
                            setZoom(newZoom);
                        }
                    }}
                >
                    {/* İl sınırları katmanı */}
                    {geoData && (
                        <Geographies geography={geoData}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo) => {
                                    const cityName = geo.properties.name || geo.properties.NAME || geo.properties.il_adi;
                                    const regionInfo = cityToRegionData[cityName];
                                    const fillColor = regionInfo?.color || '#D6D6DA';
                                    const isInHoveredRegion = hoveredRegion && regionInfo?.regionName === hoveredRegion;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={fillColor}
                                            stroke="#E5E7EB"
                                            strokeWidth={0.2}
                                            onMouseEnter={(event: React.MouseEvent) => handleMouseEnter(geo, event)}
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={handleMouseLeave}
                                            style={{
                                                default: {
                                                    fill: fillColor,
                                                    stroke: '#E5E7EB',
                                                    strokeWidth: isInHoveredRegion ? 2.5 : 0.2,
                                                    outline: 'none',
                                                },
                                                hover: {
                                                    fill: fillColor,
                                                    stroke: '#FFD700',
                                                    strokeWidth: 2.5,
                                                    outline: 'none',
                                                    filter: 'brightness(1.1)',
                                                    cursor: 'pointer',
                                                },
                                                pressed: {
                                                    fill: fillColor,
                                                    stroke: '#FFD700',
                                                    strokeWidth: 2.5,
                                                    outline: 'none',
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    )}

                    {/* Aktif bölge sınırları katmanı */}
                    {hoveredRegion && geoData && (
                        <Geographies geography={geoData}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo) => {
                                    const cityName = geo.properties.name || geo.properties.NAME || geo.properties.il_adi;
                                    const cityRegion = CITY_TO_REGION[cityName];
                                    const isInHoveredRegion = cityRegion === hoveredRegion;

                                    if (!isInHoveredRegion) return null;

                                    return (
                                        <Geography
                                            key={`border-${geo.rsmKey}`}
                                            geography={geo}
                                            fill="none"
                                            stroke="#1F2937"
                                            strokeWidth={3}
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            style={{
                                                default: {
                                                    fill: 'none',
                                                    stroke: '#1F2937',
                                                    strokeWidth: 3,
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                hover: {
                                                    fill: 'none',
                                                    stroke: '#1F2937',
                                                    strokeWidth: 3,
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                pressed: {
                                                    fill: 'none',
                                                    stroke: '#1F2937',
                                                    strokeWidth: 3,
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    )}
                </ZoomableGroup>
            </ComposableMap>

            {/* Bilgi penceresi */}
            {tooltip.show && (
                <div
                    className="region-tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        position: 'absolute',
                        zIndex: 10000
                    }}
                    dangerouslySetInnerHTML={{ __html: tooltip.content }}
                />
            )}

            {/* Şehir ismi etiketi */}
            {cityLabel.show && (
                <div
                    className="city-label"
                    style={{
                        left: cityLabel.x,
                        top: cityLabel.y,
                        position: 'absolute',
                        zIndex: 9999
                    }}
                >
                    {cityLabel.cityName}
                </div>
            )}

            {/* Renk skalası ve açıklama */}
            <div className="map-legend">
                <div className="legend-title">Yüzde Oranı</div>
                <div className="legend-gradient">
                    <div className="legend-bar" />
                    <div className="legend-labels">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>
                <div className="legend-note">
                    <div className="border-sample province">İl Sınırı</div>
                    <div className="border-sample region">Bölge Sınırı</div>
                </div>
            </div>
        </div>
    );
};

export default TurkeyMap;
