'use client';
import React, { ReactNode } from 'react';

interface SimulationLayoutProps {
    map: ReactNode;
    sidebar: ReactNode;
}

export default function SimulationLayout({ map, sidebar }: SimulationLayoutProps) {
    return (
        <div className="font-sans min-h-screen flex">
            <div className="w-4/6 h-screen border-r border-gray-300">{map}</div>
            <div className="w-2/6 h-screen p-6 overflow-y-auto bg-gray-700">{sidebar}</div>
        </div>
    );
}
