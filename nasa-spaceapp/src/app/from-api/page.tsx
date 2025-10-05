'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { OverpassElement, OverpassResponse } from '@/types/overpass';
import LayerManager from '@/components/LayerManager';
import Crater from '@/lib/Crater';
import { useSimulatorForm } from '@/context/SimulatorFormContext';
import SimulationLayout from '@/components/SimulationLayout';
import Sidebar from '@/components/Sidebar';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
    const { formData, setFormData } = useSimulatorForm();
    const [results, setResults] = useState('');
    const [cities, setCities] = useState<OverpassElement[]>([]);
    const [blastRadius, setBlastRadius] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleFormChange = (name: keyof typeof formData, value: number) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    async function fetchCitiesViaApi(lat: number, lon: number, radius: number) {
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
        setIsSimulating(true);
        const { diameter, velocity, density, lat, lon } = formData;

        const crater = new Crater(diameter, velocity, density);

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
                const names = cs
                    .map((c) => c.tags.name)
                    .filter(Boolean)
                    .join(', ');
                setResults((prev) => prev + `\nAffected cities: ${names}`);
            }
        } catch {
            setResults((prev) => prev + '\nError fetching cities data.');
        }
    }

    const handleReset = () => {
        setIsSimulating(false);
        setFormData({ diameter: 0, velocity: 0, density: 3000, lat: 0, lon: 0 });
        setResults('');
        setCities([]);
        setBlastRadius(0);
    };

    return (
        <SimulationLayout
            map={
                <Map>
                    <LayerManager
                        blastRadius={blastRadius}
                        cities={cities}
                        lat={formData.lat}
                        lon={formData.lon}
                        onClick={
                            !isSimulating
                                ? (lat, lon) => setFormData((prev) => ({ ...prev, lat, lon }))
                                : undefined
                        }
                    />
                </Map>
            }
            sidebar={
                <Sidebar
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    lockKinematics={false}
                    isSimulating={isSimulating}
                    results={results}
                    onReset={handleReset}
                />
            }
        />
    );
}
