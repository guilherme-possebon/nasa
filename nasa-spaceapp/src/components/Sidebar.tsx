'use client';
import React from 'react';
import SimulatorForm from '@/components/SimulatorForm';
import ResultsPanel from '@/components/ResultsPanel';
import NeoSelect from './NeoSelect';

type NeoDetail = {
    id: string;
    name: string;
    hazardous?: boolean;
    taxonomy?: { spec_B?: string; spec_T?: string; albedo_pv?: number };
};

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
    neoInfo?: NeoDetail | null;
    handleNeoSelect?: (id: string) => void;
}

export default function Sidebar({
    formData,
    onChange,
    onSubmit,
    lockKinematics,
    isSimulating,
    results,
    onReset,
    neoInfo,
    handleNeoSelect,
}: SidebarProps) {
    return (
        <>
            <h1 className="text-2xl font-bold mb-2 text-white">Chicxulub</h1>
            <h2 className="text-lg mb-4 text-gray-100">Asteroid Impact Simulator</h2>

            {handleNeoSelect && (
                <NeoSelect value={neoInfo?.id} onChange={handleNeoSelect} disabled={isSimulating} />
            )}

            {neoInfo && (
                <div className="p-3 rounded-lg bg-gray-800 text-white mb-4">
                    <h3 className="font-bold text-lg">{neoInfo.name}</h3>
                    {neoInfo.hazardous && (
                        <div className="text-sm font-bold text-red-400">Potentially Hazardous</div>
                    )}
                    {neoInfo.taxonomy && (
                        <div className="text-xs">
                            Taxonomy:{' '}
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
                        * In &ldquo;API Data&rdquo;, diameter and velocity are locked (derived from
                        NASA).
                    </div>
                </div>
            )}

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
