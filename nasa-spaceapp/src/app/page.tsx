"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { OverpassElement, OverpassResponse } from "@/types/overpass";
import LayerManager from "@/components/LayerManager";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [diameter, setDiameter] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [results, setResults] = useState("");
  const [cities, setCities] = useState<OverpassElement[]>([]);
  const [blastRadius, setBlastRadius] = useState(0);

  async function fetchCities(
    lat: number,
    lon: number,
    radius: number
  ): Promise<OverpassElement[]> {
    const query = `[out:json];
      node(around:${radius},${lat},${lon})["place"="city"];
      out body;`;
    const url =
      "https://overpass-api.de/api/interpreter?data=" +
      encodeURIComponent(query);
    const response = await fetch(url);
    const data: OverpassResponse = await response.json();
    return data.elements || [];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const density = 3000;
    const r = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
    const mass = density * volume;
    const velocityMs = velocity * 1000;
    const energy = 0.5 * mass * velocityMs * velocityMs;
    const tnt = energy / 4.184e9;
    const br = diameter * 100;

    setResults(
      `Mass: ${(mass / 1e9).toFixed(2)} billion kg
Impact Energy: ${(tnt / 1e6).toFixed(2)} Megatons TNT
Blast radius: ${(br / 1000).toFixed(2)} km
Loading affected cities...`
    );

    setBlastRadius(br);

    try {
      const cs = await fetchCities(lat, lon, br);
      setCities(cs);
      if (cs.length === 0) {
        setResults((prev) => prev + "\nNo cities found in blast radius.");
      } else {
        const names = cs.map((c) => c.tags.name).filter(Boolean).join(", ");
        setResults((prev) => prev + `\nAffected cities: ${names}`);
      }
    } catch (err) {
      console.error(err);
      setResults((prev) => prev + "\nError fetching cities data.");
    }
  }

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
              onChange={(e) => setDiameter(Number(e.target.value))}
              required
              className="border p-2 w-full"
            />
          </label>
          <label>
            Velocity (km/s):
            <input
              type="number"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
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
              onChange={(e) => setLat(Number(e.target.value))}
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
              onChange={(e) => setLon(Number(e.target.value))}
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
            <LayerManager
              lat={lat}
              lon={lon}
              blastRadius={blastRadius}
              cities={cities}
            />
          </Map>
        </div>
      </div>
    </div>
  );
}
