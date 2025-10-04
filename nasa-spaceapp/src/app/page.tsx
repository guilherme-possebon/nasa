'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { OverpassElement, OverpassResponse } from '@/types/overpass';
import LayerManager from '@/components/LayerManager';
import SimulatorForm from '@/components/SimulatorForm';
import Crater from '@/lib/Crater';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
  const [formData, setFormData] = useState({
    diameter: 0,
    velocity: 0,
    density: 3000,
    lat: 0,
    lon: 0,
  });
  const [results, setResults] = useState('');
  const [cities, setCities] = useState<OverpassElement[]>([]);
  const [blastRadius, setBlastRadius] = useState(0);

  const handleFormChange = (name: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function fetchCitiesViaApi(lat: number, lon: number, radius: number): Promise<OverpassElement[]> {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      radius: String(radius),
    });

    const res = await fetch(`/api/overpass?${params.toString()}`);
    if (!res.ok) throw new Error(`API /overpass: ${res.status}`);
    const data: OverpassResponse = await res.json();
    return data.elements || [];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { diameter, velocity, density, lat, lon } = formData;

    const crater: Crater = new Crater(diameter, velocity, density);

    setResults(
      `Mass: ${(crater.mass / 1e9).toFixed(2)} billion kg
Impact Energy: ${(crater.tnt / 1e6).toFixed(2)} Megatons TNT
Blast radius: ${(crater.borderRadius / 1000).toFixed(2)} km
Loading affected cities...`,
    );
    setBlastRadius(crater.borderRadius);

    try {
      const cs = await fetchCitiesViaApi(lat, lon, crater.borderRadius);
      setCities(cs);

      if (cs.length === 0) {
        setResults((prev) => prev + '\nNo cities found in blast radius.');
      } else {
        const names = cs.map((c) => c.tags.name).filter(Boolean).join(', ');
        setResults((prev) => prev + `\nAffected cities: ${names}`);
      }
    } catch (err) {
      console.error(err);
      setResults((prev) => prev + '\nError fetching cities data.');
    }
  }

  return (
    <div className="font-sans min-h-screen flex">
      <div className="w-4/6 h-screen border-r border-gray-300">
        <Map>
          <LayerManager
            blastRadius={blastRadius}
            cities={cities}
            onClick={(lat, lon) => {
              setFormData((prev) => ({ ...prev, lat, lon }));
            }}
          />
        </Map>
      </div>

      <div className="w-2/6 h-screen p-6 overflow-y-auto bg-gray-700">
        <h1 className="text-2xl font-bold mb-2 text-white">Chicxulub</h1>
        <h2 className="text-lg mb-4 text-gray-100">Asteroid Impact Simulator</h2>

        <SimulatorForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />

        <pre className="mt-6 whitespace-pre-wrap text-sm text-gray-100">{results}</pre>
      </div>
    </div>
  );
}
