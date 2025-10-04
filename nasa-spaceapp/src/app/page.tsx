"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { OverpassElement, OverpassResponse } from "@/types/overpass";

// ⚠️ Garanta que o componente Map também tem "use client" e importa Leaflet dentro do useEffect.
// Aqui, reforçamos que ele NUNCA renderiza no SSR.
const Map = dynamic(() => import("@/components/Map"), { ssr: false });
// ⚠️ Se o LayerManager tocar em leaflet/window, carregue dinamicamente também:
const LayerManager = dynamic(() => import("@/components/LayerManager"), { ssr: false });

export default function Home() {
  const [diameter, setDiameter] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [results, setResults] = useState<string>("");
  const [cities, setCities] = useState<OverpassElement[]>([]);
  const [blastRadius, setBlastRadius] = useState<number>(0);

  // Mantém um AbortController por submissão
  const fetchCtrlRef = useRef<AbortController | null>(null);

  function isLat(n: number) {
    return Number.isFinite(n) && n >= -90 && n <= 90;
  }
  function isLon(n: number) {
    return Number.isFinite(n) && n >= -180 && n <= 180;
  }

  async function fetchCities(
    lat: number,
    lon: number,
    radius: number,
    signal?: AbortSignal
  ): Promise<OverpassElement[]> {
    const query = `[out:json];
      node(around:${radius},${lat},${lon})["place"="city"];
      out body;`;
    const url =
      "https://overpass-api.de/api/interpreter?data=" +
      encodeURIComponent(query);

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Overpass ${res.status}`);
    const data: OverpassResponse = await res.json();
    return data.elements || [];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validações mínimas
    if (!(diameter > 0) || !(velocity > 0)) {
      setResults("Preencha diâmetro e velocidade com valores válidos.");
      return;
    }
    if (!isLat(lat) || !isLon(lon)) {
      setResults("Latitude deve estar entre -90 e 90 e longitude entre -180 e 180.");
      return;
    }

    // Física (simplificada)
    const density = 3000; // kg/m³ (rocha)
    const r = diameter / 2; // m
    const volume = (4 / 3) * Math.PI * Math.pow(r, 3); // m³
    const mass = density * volume; // kg
    const velocityMs = velocity * 1000; // km/s -> m/s
    const energy = 0.5 * mass * velocityMs * velocityMs; // Joules
    const tnt = energy / 4.184e9; // equivalente em toneladas de TNT
    const br = diameter * 100; // raio de explosão (m) — modelo simplificado

    setResults(
      `Mass: ${(mass / 1e9).toFixed(2)} billion kg
Impact Energy: ${(tnt / 1e6).toFixed(2)} Megatons TNT
Blast radius: ${(br / 1000).toFixed(2)} km
Loading affected cities...`
    );
    setBlastRadius(br);

    // Cancela requisição anterior, se houver
    fetchCtrlRef.current?.abort();
    const ctrl = new AbortController();
    fetchCtrlRef.current = ctrl;

    try {
      const cs = await fetchCities(lat, lon, br, ctrl.signal);
      setCities(cs);

      if (cs.length === 0) {
        setResults((prev) => prev + "\nNo cities found in blast radius.");
      } else {
        const names = cs.map((c) => c.tags.name).filter(Boolean).join(", ");
        setResults((prev) => prev + `\nAffected cities: ${names}`);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return; // submissão anterior cancelada
      console.error(err);
      setResults((prev) => prev + "\nError fetching cities data.");
    } finally {
      fetchCtrlRef.current = null;
    }
  }

  // Handlers que evitam NaN e coerções
  const handleNumber =
    (setter: (n: number) => void, allowFloat = false) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.valueAsNumber;
      if (Number.isFinite(v)) setter(v);
      else setter(0);
    };

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 grid place-items-center">
      <div className="container max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Asteroid Impact Simulator</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Diameter (m):
            <input
              type="number"
              value={diameter}
              onChange={handleNumber(setDiameter)}
              min={0}
              required
              className="border p-2 w-full"
            />
          </label>
          <label>
            Velocity (km/s):
            <input
              type="number"
              value={velocity}
              onChange={handleNumber(setVelocity)}
              min={0}
              required
              className="border p-2 w-full"
            />
          </label>
          <label>
            Latitude:
            <input
              type="number"
              value={lat}
              step="any"
              onChange={handleNumber(setLat, true)}
              min={-90}
              max={90}
              required
              className="border p-2 w-full"
            />
          </label>
          <label>
            Longitude:
            <input
              type="number"
              value={lon}
              step="any"
              onChange={handleNumber(setLon, true)}
              min={-180}
              max={180}
              required
              className="border p-2 w-full"
            />
          </label>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Simulate
          </button>
        </form>

        <pre className="mt-6 whitespace-pre-wrap">{results}</pre>

        <div className="mt-6 h-96 w-full rounded border overflow-hidden">
          <Map>
            <LayerManager lat={lat} lon={lon} blastRadius={blastRadius} cities={cities} />
          </Map>
        </div>
      </div>
    </div>
  );
}