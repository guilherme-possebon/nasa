'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ISimulatorFormContext {
    formData: {
        diameter: number;
        velocity: number;
        density: number;
        lat: number;
        lon: number;
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            diameter: number;
            velocity: number;
            density: number;
            lat: number;
            lon: number;
        }>
    >;
}

const SimulatorFormContext = createContext<ISimulatorFormContext | undefined>(undefined);

export const useSimulatorForm = (): ISimulatorFormContext => {
    const context = useContext(SimulatorFormContext);
    if (!context) {
        throw new Error('useSimulatorForm must be used within a SimulatorFormProvider');
    }
    return context;
};

export const SimulatorFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState({
        diameter: 0,
        velocity: 0,
        density: 3000,
        lat: 0,
        lon: 0,
    });

    return (
        <SimulatorFormContext.Provider value={{ formData, setFormData }}>
            {children}
        </SimulatorFormContext.Provider>
    );
};
