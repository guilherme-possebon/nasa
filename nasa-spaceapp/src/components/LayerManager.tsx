'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { OverpassElement } from '@/types/overpass';
import type { LeafletMouseEvent } from 'leaflet';

interface Props {
  blastRadius: number;
  cities: OverpassElement[];
  lat: number;
  lon: number;
  onClick?: (lat: number, lon: number) => void;
}

export default function LayerManager({ blastRadius, cities, lat, lon, onClick }: Props) {
  const map = useMap();

  useEffect(() => {
    // Dynamically import leaflet only in the browser
    if (typeof window === 'undefined') return;

    const LPromise = import('leaflet');

    LPromise.then((L) => {
      // Clear previous layers except tile layer
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) return;
        map.removeLayer(layer);
      });

      // Don't draw anything if lat/lon are at their initial zero state
      if (!lat && !lon) return;

      // Draw marker and circle based on props
      L.marker([lat, lon]).addTo(map).bindPopup('Impact site').openPopup();

      L.circle([lat, lon], {
        radius: blastRadius,
        color: 'red',
        fillOpacity: 0.3,
      }).addTo(map);

      cities.forEach((city) => {
        if (city.tags.name) {
          L.marker([city.lat, city.lon]).addTo(map).bindPopup(`${city.tags.name} (affected)`);
        }
      });

      map.setView([lat, lon], 3);
    });
  }, [map, lat, lon, blastRadius, cities]);

  useEffect(() => {
    if (!onClick) return; // If no onClick prop, do nothing

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
