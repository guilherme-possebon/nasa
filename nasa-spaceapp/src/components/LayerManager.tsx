'use client';

import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import type { OverpassElement } from '@/types/overpass';

interface Props {
  blastRadius: number;
  cities: OverpassElement[];
  onClick?: (lat: number, lon: number) => void;
}

export default function LayerManager({ blastRadius, cities, onClick }: Props) {
  const map = useMap();

  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  useEffect(() => {
    // Dynamically import leaflet only in the browser
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      // Clear previous layers except tile layer
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) return;
        map.removeLayer(layer);
      });

      map.addEventListener('click', (e) => {
        const { lat: clickedLat, lng: clickedLng } = e.latlng;
        setLat(clickedLat);
        setLon(clickedLng);

        if (onClick) onClick(clickedLat, clickedLng);
      });

      if (!lat && !lon) return;

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
  }, [map, lat, lon, blastRadius, cities, onClick]);

  return null;
}
