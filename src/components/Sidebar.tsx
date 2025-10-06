'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import ResultsPanel from '@/components/ResultsPanel';
import SimulationSetup from './SimulationSetup';

export interface ISimulatorFormData {
    diameter: number;
    velocity: number;
    density: number;
    lat: number;
    lon: number;
}

export type NeoDetail = {
    id: string;
    name: string;
    hazardous?: boolean;
    taxonomy?: { spec_B?: string; spec_T?: string; albedo_pv?: number };
};

export interface SidebarProps {
    formData: ISimulatorFormData;
    onChange: (name: keyof ISimulatorFormData, value: number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    lockKinematics: boolean;
    isSimulating: boolean;
    results: string;
    onReset: () => void;
    neoInfo?: NeoDetail | null;
    handleNeoSelect?: (id: string) => void;
}

export default function Sidebar(props: SidebarProps) {
    const { isSimulating, results, onReset } = props;
    const router = useRouter();

    const handleBack = () => {
        router.push('/');
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">Chicxulub</h1>
                <button
                    onClick={handleBack}
                    title="Voltar à página inicial"
                    className="text-white flex items-center gap-2 bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                    <ArrowLeftIcon size={20} />
                    Voltar
                </button>
            </div>

            <h2 className="text-lg mb-4 text-gray-100">Spatial Impact Simulator</h2>

            <SimulationSetup {...props} />

            <div className="mt-8 rounded-lg  bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">Map Legends</h2>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-red-500"></div>
                        <p className="text-sm text-gray-600">
                            <strong className="font-medium text-gray-900">Crater Zone: </strong>
                            represents the central impact point, where excavation and total
                            destruction occur.
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-orange-500"></div>
                        <p className="text-sm text-gray-600">
                            <strong className="font-medium text-gray-900">
                                Blast Wave Radius:{' '}
                            </strong>
                            shows the propagation radius of the seismic and atmospheric pressure
                            waves.
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-yellow-400"></div>
                        <p className="text-sm text-gray-600">
                            <strong className="font-medium text-gray-900">
                                Thermal Impact Area:{' '}
                            </strong>
                            indicates the area affected by extreme heat, responsible for fires and
                            surface vaporization.
                        </p>
                    </li>
                </ul>
            </div>
            {/* <ResultsPanel results={results} isSimulating={isSimulating} onReset={onReset} /> */}
        </>
    );
}
