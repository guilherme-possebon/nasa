"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";

interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: string | undefined;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export default function Home() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  const [diameter, setDiameter] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);

  const [results, setResults] = useState<string>("");

  // Initialize map once
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(leafletMap.current);
    }
  }, []);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Physics
    const density = 3000; // kg/m³
    const radius = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = density * volume;
    const velocityMs = velocity * 1000;
    const energy = 0.5 * mass * velocityMs * velocityMs; // Joules
    const tnt = energy / 4.184e9;
    const blastRadius = diameter * 100;

    setResults(
      `Mass: ${(mass / 1e9).toFixed(2)} billion kg
Impact Energy: ${(tnt / 1e6).toFixed(2)} Megatons TNT
Blast radius: ${(blastRadius / 1000).toFixed(2)} km
Loading affected cities...`
    );

    if (!leafletMap.current) return;

    // Clear previous overlays but leave base layer
    leafletMap.current.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        leafletMap.current?.removeLayer(layer);
      }
    });

    // Add marker and circle
    L.marker([lat, lon])
      .addTo(leafletMap.current)
      .bindPopup("Impact site")
      .openPopup();

    L.circle([lat, lon], {
      radius: blastRadius,
      color: "red",
      fillOpacity: 0.3,
    }).addTo(leafletMap.current);

    leafletMap.current.setView([lat, lon], 3);

    try {
      const cities = await fetchCities(lat, lon, blastRadius);

      if (cities.length === 0) {
        setResults((prev) => prev + "\nNo cities found in blast radius.");
      } else {
        const names = cities.map((c) => c.tags.name).filter(Boolean).join(", ");
        setResults((prev) => prev + `\nAffected cities: ${names}`);

        cities.forEach((city) => {
          if (city.tags.name) {
            L.marker([city.lat, city.lon])
              .addTo(leafletMap.current!)
              .bindPopup(`${city.tags.name} (affected)`);
          }
        });
      }
    } catch (error) {
      console.error(error);
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
        <div
          ref={mapRef}
          id="map"
          className="mt-6 h-96 w-full rounded border"
        />
      </div>
    </div>
  );
}
