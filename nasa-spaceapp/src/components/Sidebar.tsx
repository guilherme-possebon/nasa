'use client';
import React from 'react';
import SimulatorForm from '@/components/SimulatorForm';
import ResultsPanel from '@/components/ResultsPanel';

interface SidebarProps {
    formData: {
        diameter: number;
        velocity: number;
        density: number;
        lat: number;
        lon: number;
    };
    onChange: (name: keyof SidebarProps['formData'], value: number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    lockKinematics: boolean;
    isSimulating: boolean;
    results: string;
    onReset: () => void;
}

export default function Sidebar({
    formData,
    onChange,
    onSubmit,
    lockKinematics,
    isSimulating,
    results,
    onReset,
}: SidebarProps) {
    return (
        <>
            <h1 className="text-2xl font-bold mb-2 text-white">Chicxulub</h1>
            <h2 className="text-lg mb-4 text-gray-100">Asteroid Impact Simulator</h2>

            <SimulatorForm
                formData={formData}
                onChange={onChange}
                onSubmit={onSubmit}
                lockKinematics={lockKinematics}
            />

            <ResultsPanel results={results} isSimulating={isSimulating} onReset={onReset} />
        </>
    );
}
