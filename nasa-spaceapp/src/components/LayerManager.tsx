'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { OverpassElement } from '@/types/overpass';
import type { LeafletMouseEvent } from 'leaflet';
import type Crater from '@/lib/Crater';

interface Props {
    crater: Crater | null;
    cities: OverpassElement[];
    lat: number;
    lon: number;
    onClick?: (lat: number, lon: number) => void;
}

export default function LayerManager({ crater, cities, lat, lon, onClick }: Props) {
    const map = useMap();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const LPromise = import('leaflet');

        LPromise.then((L) => {
            map.eachLayer((layer) => {
                if (layer instanceof L.TileLayer) return;
                map.removeLayer(layer);
            });

            if (!lat && !lon) return;

            L.marker([lat, lon]).addTo(map).bindPopup('Impact site').openPopup();

            if (crater) {
                L.circle([lat, lon], {
                    radius: crater.borderRadius,
                    color: 'red',
                    fillOpacity: 0.3,
                }).addTo(map);
            }

            cities.forEach((city) => {
                if (city.tags.name) {
                    L.marker([city.lat, city.lon])
                        .addTo(map)
                        .bindPopup(`${city.tags.name} (affected)`);
                }
            });

            map.setView([lat, lon], 3);
        });
    }, [map, lat, lon, crater, cities]);

    useEffect(() => {
        if (!onClick) return;

        const handleClick = (e: LeafletMouseEvent) => {
            const { lat: clickedLat, lng: clickedLng } = e.latlng;
            onClick(clickedLat, clickedLng);
        };

        map.on('click', handleClick);

        return () => {
            map.off('click', handleClick);
        };
    }, [map, onClick]);

    return null;
}
