'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { OverpassElement, OverpassResponse } from '@/types/overpass';
import LayerManager from '@/components/LayerManager';
import Crater from '@/lib/Crater';
import NeoSelect from '@/components/NeoSelect';
import { useSimulatorForm } from '@/context/SimulatorFormContext';
import SimulationLayout from '@/components/SimulationLayout';
import Sidebar from '@/components/Sidebar';

type NeoDetail = {
  id: string;
  name: string;
  diameter_km?: number;
  velocity_kms?: number;
  hazardous?: boolean;
  taxonomy?: { spec_B?: string; spec_T?: string; albedo_pv?: number };
  density_g_cm3?: number;
  density_kg_m3?: number;
  density_source?: 'measured' | 'taxonomy' | 'albedo' | 'fallback';
};

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
    const { formData, setFormData } = useSimulatorForm();
    const [results, setResults] = useState('');
    const [cities, setCities] = useState<OverpassElement[]>([]);
    const [crater, setCrater] = useState<Crater | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [neoInfo, setNeoInfo] = useState<NeoDetail | null>(null);
    const [selectedNeoId, setSelectedNeoId] = useState<string>('');
    const [loadingNeo, setLoadingNeo] = useState(false);


    const handleFormChange = (name: keyof typeof formData, value: number) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

  async function fetchCitiesViaApi(
    lat: number,
    lon: number,
    radius: number,
  ): Promise<OverpassElement[]> {
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

  async function handleSelectNeo(id: string) {
    setSelectedNeoId(id);
    if (!id) {
      setNeoInfo(null);
      return;
    }

    try {
      setLoadingNeo(true);
      const res = await fetch(`/api/neos/${id}`);
      if (!res.ok) throw new Error('Falha ao obter dados do NEO');
      const neo: NeoDetail = await res.json();

      // Converte p/ unidades internas do motor
      const diameterM = neo?.diameter_km ? neo.diameter_km * 1000 : 0; // km → m
      const velocityMs = neo?.velocity_kms ? neo.velocity_kms * 1000 : 0; // km/s → m/s

      setFormData((prev) => ({
        ...prev,
        diameter: diameterM,
        velocity: velocityMs,
        // usa diretamente o que o backend já retorna em kg/m³ (com fallback nele)
        density: neo?.density_kg_m3 ?? prev.density,
      }));

      // guarda info para o painel
      setNeoInfo(neo);

      // feedback textual
      setResults((prev) =>
        [
          `Selecionado: ${neo?.name ?? id}`,
          `Diâmetro ≈ ${neo?.diameter_km ? neo.diameter_km.toFixed(3) : 'n/d'} km`,
          `Velocidade ≈ ${neo?.velocity_kms ? neo.velocity_kms.toFixed(2) : 'n/d'} km/s`,
          `Densidade: ${
            neo?.density_g_cm3 != null ? `${neo.density_g_cm3.toFixed(2)} g/cm³` : 'n/d'
          } ${neo?.density_source ? `(${neo.density_source})` : ''}`,
          prev ? `\n${prev}` : '',
        ].join('\n'),
      );
    } catch (e) {
      console.error(e);
      setResults((prev) => prev + '\nErro ao carregar dados do asteroide.');
    } finally {
      setLoadingNeo(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSimulating(true); // Lock the map and form
    const { diameter, velocity, density, lat, lon } = formData;
    if (diameter <= 0 || velocity <= 0 || density <= 0) {
      setResults('Preencha um asteroide válido (diâmetro/velocidade) e densidade > 0.');
      return;
    }

        const newCrater = new Crater(diameter, velocity, density);
        setCrater(newCrater);

        setResults(
            `Mass: ${(newCrater.mass / 1e9).toFixed(2)} billion kg
Impact Energy: ${(newCrater.tnt / 1e6).toFixed(2)} Megatons TNT
Blast radius: ${(newCrater.borderRadius / 1000).toFixed(2)} km
Loading affected cities...`,
        );

        try {
            const cs = await fetchCitiesViaApi(lat, lon, newCrater.borderRadius);
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
        setNeoInfo(null);
    };

    return (
        <SimulationLayout
            map={
                <Map>
                    <LayerManager
                        crater={crater}
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
  return (
    <div className="font-sans min-h-screen flex">
      <div className="w-3/4 h-screen border-r border-gray-300">
        <Map>
          <LayerManager
            cities={cities}
            lat={formData.lat}
            lon={formData.lon}
            onClick={
              !isSimulating
                ? (lat, lon) => {
                    setFormData((prev) => ({ ...prev, lat, lon }));
                  }
                : undefined
            }
          />
        </Map>
      </div>

      <div className="w-1/4 h-screen p-6 overflow-y-auto bg-gray-700">
        <h1 className="text-2xl font-bold mb-2 text-white">Chicxulub</h1>
        <h2 className="text-lg mb-4 text-gray-100">Asteroid Impact Simulator</h2>

        <NeoSelect value={selectedNeoId} onChange={handleSelectNeo} disabled={isSimulating} />

        {neoInfo && (
          <div className="mb-4 rounded-xl border border-gray-600 bg-gray-800 p-4 text-sm text-gray-100 space-y-1">
            <div className="font-semibold">{neoInfo.name}</div>
            <div>
              Diâmetro: <strong>{neoInfo.diameter_km?.toFixed(3) ?? '—'} km</strong>
            </div>
            <div>
              Velocidade: <strong>{neoInfo.velocity_kms?.toFixed(2) ?? '—'} km/s</strong>
            </div>
            <div>
              Densidade:{' '}
              <strong>
                {neoInfo.density_g_cm3 != null ? `${neoInfo.density_g_cm3.toFixed(2)} g/cm³` : '—'}
              </strong>
              {neoInfo.density_source ? (
                <span className="ml-2 rounded bg-gray-700 px-2 py-0.5 text-xs uppercase tracking-wide">
                  {neoInfo.density_source}
                </span>
              ) : null}
            </div>
            {(neoInfo.taxonomy?.spec_B || neoInfo.taxonomy?.spec_T) && (
              <div>
                Taxonomia:{' '}
                <span className="font-medium">
                  {neoInfo.taxonomy?.spec_B ?? neoInfo.taxonomy?.spec_T}
                </span>
                {neoInfo.taxonomy?.albedo_pv != null && (
                  <span className="ml-2 text-gray-300">
                    (albedo: {(neoInfo.taxonomy.albedo_pv as number).toFixed(2)})
                  </span>
                )}
              </div>
            )}
            <div className="text-xs text-gray-300">
              * Em “Dados da API”, diâmetro e velocidade estão travados (derivados da NASA).
            </div>
          </div>
        )}

        <SimulatorForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          lockKinematics={true}
          disabled={loadingNeo}
        />

        {isSimulating && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white
                       shadow-sm transition hover:bg-red-700 focus:outline-none
                       focus:ring-4 focus:ring-red-200/70 active:scale-[0.99] hover:cursor-pointer"
          >
            Reset Simulation
          </button>
        )}

        <pre className="mt-6 whitespace-pre-wrap text-sm text-gray-100">{results}</pre>
      </div>
    </div>
  );
}
