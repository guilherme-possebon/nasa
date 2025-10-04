"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { OverpassElement, OverpassResponse } from "@/types/overpass";
import LayerManager from "@/components/LayerManager";
import SimulatorForm from "@/components/SimulatorForm";
import Crater from "@/lib/Crater";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const [formData, setFormData] = useState({
    diameter: 0,
    velocity: 0,
    density: 3000,
    lat: 0,
    lon: 0,
  });
  const [results, setResults] = useState("");
  const [cities, setCities] = useState<OverpassElement[]>([]);
  const [blastRadius, setBlastRadius] = useState(0);

  const handleFormChange = (name: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function fetchCities(lat: number, lon: number, radius: number): Promise<OverpassElement[]> {
    const query = `[out:json];
      node(around:${radius},${lat},${lon})["place"="city"];
      out body;`;
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);
    const response = await fetch(url);
    const data: OverpassResponse = await response.json();
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
      const cs = await fetchCities(lat, lon, crater.borderRadius);
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
    <div className="font-sans min-h-screen flex justify-center">
      <div className="container">
        <h1 className="text-2xl font-bold mb-4">Asteroid Impact Simulator</h1>

        <SimulatorForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
        />

        <pre className="mt-6 whitespace-pre-wrap">{results}</pre>

        <div className="mt-6 h-96 w-full rounded border overflow-hidden">
          <Map>
            <LayerManager
              lat={formData.lat}
              lon={formData.lon}
              blastRadius={blastRadius}
              cities={cities}
            />
          </Map>
        </div>
      </div>
    </div>
  );
}
