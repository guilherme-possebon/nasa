'use client';

import * as React from 'react';

export interface SimulatorFormProps {
  formData: {
    diameter: number;
    velocity: number;
    lat: number;
    lon: number;
  };
  onChange: (name: keyof SimulatorFormProps['formData'], value: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  isDiameterDisabled?: boolean;
  isVelocityDisabled?: boolean;
}

export default function SimulatorForm({
  formData,
  onChange,
  onSubmit,
  disabled,
  isDiameterDisabled = false,
  isVelocityDisabled = false,
}: SimulatorFormProps) {
  const handleNumber =
    (name: keyof SimulatorFormProps['formData']) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.currentTarget.valueAsNumber;
      onChange(name, Number.isFinite(v) ? v : 0);
    };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm p-6 space-y-4"
    >
      <fieldset disabled={disabled}>
        <h2 className="text-lg font-semibold text-gray-800">Simulation Parameters</h2>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Diameter (m)</span>
          <input
            type="number"
            value={formData.diameter}
            onChange={handleNumber('diameter')}
            min={0}
            required
            disabled={isDiameterDisabled}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900
                       placeholder-gray-400 outline-none transition
                       focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Velocity (km/s)</span>
          <input
            type="number"
            value={formData.velocity}
            onChange={handleNumber('velocity')}
            min={0}
            required
            disabled={isVelocityDisabled}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900
                       placeholder-gray-400 outline-none transition
                       focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Latitude</span>
          <input
            type="number"
            value={formData.lat}
            step="any"
            onChange={handleNumber('lat')}
            min={-90}
            max={90}
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900
                       placeholder-gray-400 outline-none transition
                       focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Longitude</span>
          <input
            type="number"
            value={formData.lon}
            step="any"
            onChange={handleNumber('lon')}
            min={-180}
            max={180}
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900
                       placeholder-gray-400 outline-none transition
                       focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60"
          />
        </label>

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white
                     shadow-sm transition hover:bg-sky-700 focus:outline-none
                     focus:ring-4 focus:ring-sky-200/70 active:scale-[0.99] hover:cursor-pointer
                     disabled:cursor-not-allowed disabled:bg-sky-400"
        >
          Simulate
        </button>
      </fieldset>
    </form>
  );
}
