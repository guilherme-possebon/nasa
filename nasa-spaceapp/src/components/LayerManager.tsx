'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { OverpassElement } from '@/types/overpass';

interface Props {
  lat: number;
  lon: number;
  blastRadius: number;
  cities: OverpassElement[];
}

export default function LayerManager({ lat, lon, blastRadius, cities }: Props) {
  const map = useMap();

  useEffect(() => {
    // Dynamically import leaflet only in the browser
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      // Clear previous layers except tile layer
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) return;
        map.removeLayer(layer);
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
  }, [map, lat, lon, blastRadius, cities]);

  return null;
}
