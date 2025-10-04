"use client";

import * as React from "react";

export interface SimulatorFormProps {
  formData: {
    diameter: number;
    velocity: number;
    lat: number;
    lon: number;
  };
  onChange: (name: keyof SimulatorFormProps["formData"], value: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SimulatorForm({ formData, onChange, onSubmit }: SimulatorFormProps) {
  const handleNumber =
    (name: keyof SimulatorFormProps["formData"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.valueAsNumber;
      onChange(name, Number.isFinite(v) ? v : 0);
    };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label>
        Diameter (m):
        <input
          type="number"
          value={formData.diameter}
          onChange={handleNumber("diameter")}
          min={0}
          required
          className="border p-2 w-full"
        />
      </label>

      <label>
        Velocity (km/s):
        <input
          type="number"
          value={formData.velocity}
          onChange={handleNumber("velocity")}
          min={0}
          required
          className="border p-2 w-full"
        />
      </label>

      <label>
        Latitude:
        <input
          type="number"
          value={formData.lat}
          step="any"
          onChange={handleNumber("lat")}
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
          value={formData.lon}
          step="any"
          onChange={handleNumber("lon")}
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
  );
}
