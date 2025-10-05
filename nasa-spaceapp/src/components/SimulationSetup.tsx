'use client';

import React from 'react';
import SimulatorForm from '@/components/SimulatorForm';
import NeoSelect from './NeoSelect';
// Import the shared types from a central location or the parent component
import { ISimulatorFormData, NeoDetail } from './Sidebar';

// Define props with specific types inferred from the application's context
interface SimulationSetupProps {
    formData: ISimulatorFormData;
    onChange: (name: keyof ISimulatorFormData, value: number) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    lockKinematics: boolean;
    isSimulating: boolean;
    neoInfo?: NeoDetail | null;
    handleNeoSelect?: (id: string) => void;
}

export default function SimulationSetup({
    formData,
    onChange,
    onSubmit,
    lockKinematics,
    isSimulating,
    neoInfo,
    handleNeoSelect,
}: SimulationSetupProps) {
    return (
        <>
            {handleNeoSelect && (
                <NeoSelect value={neoInfo?.id} onChange={handleNeoSelect} disabled={isSimulating} />
            )}

            {neoInfo && (
                <div className="p-3 rounded-lg bg-gray-800 text-white mb-4 animate-fade-in">
                    <h3 className="font-bold text-lg">{neoInfo.name}</h3>
                    {neoInfo.hazardous && (
                        <div className="text-sm font-bold text-red-400">Potentially Hazardous</div>
                    )}
                </div>
            )}

            <SimulatorForm
                formData={formData}
                onChange={onChange}
                onSubmit={onSubmit}
                lockKinematics={lockKinematics}
            />
        </>
    );
}
