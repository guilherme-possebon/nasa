'use client';

import * as React from 'react';
import FormField from './FormField'; // Import the new component

// This interface should match the one from your context/parent component
export interface ISimulatorFormData {
    diameter: number; // Stored in meters
    velocity: number; // Stored in m/s
    density: number; // Stored in kg/m³
    lat: number;
    lon: number;
}

export interface SimulatorFormProps {
    formData: ISimulatorFormData;
    onChange: (name: keyof ISimulatorFormData, value: number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
    lockKinematics?: boolean;
}

export default function SimulatorForm({
    formData,
    onChange,
    onSubmit,
    disabled,
    lockKinematics = false,
}: SimulatorFormProps) {
    // Generic handler for number inputs. It handles NaN cases.
    const handleNumberChange = (
        name: keyof ISimulatorFormData,
        value: number,
        multiplier: number = 1,
    ) => {
        const numericValue = Number.isFinite(value) ? value : 0;
        onChange(name, numericValue * multiplier);
    };

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-gray-200/80 bg-white p-6 space-y-4"
        >
            <fieldset disabled={disabled} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Simulation Parameters</h2>

                {/* Diameter Input */}
                <FormField
                    label="Diameter"
                    unit="km"
                    type="number"
                    value={formData.diameter > 0 ? formData.diameter / 1000 : ''}
                    onChange={(e) =>
                        handleNumberChange('diameter', e.currentTarget.valueAsNumber, 1000)
                    }
                    step="any"
                    min={0}
                    required
                    isLocked={lockKinematics}
                    lockedValue={`${(formData.diameter / 1000).toFixed(3)} km`}
                />

                {/* Velocity Input */}
                <FormField
                    label="Velocity"
                    unit="km/h" // <-- Unit changed
                    type="number"
                    // Convert internal state (m/s) to km/h for display
                    value={formData.velocity > 0 ? formData.velocity * 3.6 : ''}
                    onChange={(e) =>
                        // Convert input (km/h) back to internal state (m/s)
                        handleNumberChange('velocity', e.currentTarget.valueAsNumber, 1 / 3.6)
                    }
                    step="any"
                    min={0}
                    required
                    isLocked={lockKinematics}
                    // Also update the locked value display to km/h
                    lockedValue={`${(formData.velocity * 3.6).toFixed(2)} km/h`}
                />

                {/* Density Input (FIXED: Added missing field) */}
                <FormField
                    label="Density"
                    unit="kg/m³"
                    type="number"
                    value={formData.density > 0 ? formData.density : ''}
                    onChange={(e) => handleNumberChange('density', e.currentTarget.valueAsNumber)}
                    step="1"
                    min={0}
                    required
                    isLocked={lockKinematics}
                    lockedValue={`${formData.density} kg/m³`}
                />

                {/* Latitude and Longitude Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Latitude"
                        unit="°"
                        type="number"
                        value={formData.lat}
                        onChange={(e) => handleNumberChange('lat', e.currentTarget.valueAsNumber)}
                        step="any"
                        required
                    />
                    <FormField
                        label="Longitude"
                        unit="°"
                        type="number"
                        value={formData.lon}
                        onChange={(e) => handleNumberChange('lon', e.currentTarget.valueAsNumber)}
                        step="any"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="!mt-6 w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white
                               shadow-sm transition hover:bg-sky-700 focus:outline-none
                               focus:ring-4 focus:ring-sky-200/70 active:scale-[0.99]
                               disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Simulate Impact
                </button>
            </fieldset>
        </form>
    );
}
