'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { OverpassElement } from '@/types/overpass';
import type { LeafletMouseEvent } from 'leaflet';
import type Crater from '@/lib/Crater';
import { Impact } from '@/lib/Impact';

interface Props {
    crater: Crater | null;
    Impact: Impact | null;
    cities: OverpassElement[];
    lat: number;
    lon: number;
    onClick?: (lat: number, lon: number) => void;
}

export default function LayerManager({ crater, Impact, cities, lat, lon, onClick }: Props) {
    const map = useMap();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const LPromise = import('leaflet');

        LPromise.then((L) => {
            map.eachLayer((layer) => {
                if (layer instanceof L.TileLayer || layer instanceof L.Control) return;
                map.removeLayer(layer);
            });

            if (!lat && !lon) return;

            const impactMarker = L.marker([lat, lon]);
            impactMarker.addTo(map);
            impactMarker.openPopup();

            if (crater && Impact) {
                L.circle([lat, lon], {
                    radius: Impact.devastationRadiusKm,
                    color: 'yellow',
                    fillOpacity: 0.3,
                    weight: 3,
                }).addTo(map);
                L.circle([lat, lon], {
                    radius: crater.blastRadius,
                    color: 'orange',
                    fillOpacity: 0.3,
                    weight: 3,
                }).addTo(map);
                L.circle([lat, lon], {
                    radius: crater.craterRadius,
                    color: 'red',
                    fillOpacity: 0.3,
                    weight: 3,
                }).addTo(map);
            }

            // ... (your existing cities logic)
            //cities.forEach((city) => {
            //  if (city.tags.name) {
            //    const cityMarker = L.marker([city.lat, city.lon]);
            //  cityMarker.addTo(map);
            //cityMarker.bindPopup(`${city.tags.name} (affected)`);
            //}
            // });

            map.setView([lat, lon], 3);
        });
    }, [map, lat, lon, crater, cities, Impact]);

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
