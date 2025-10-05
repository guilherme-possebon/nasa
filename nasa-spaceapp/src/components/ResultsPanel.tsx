'use client';
import React from 'react';

interface ResultsPanelProps {
    results: string;
    isSimulating: boolean;
    onReset: () => void;
}

export default function ResultsPanel({ results, isSimulating, onReset }: ResultsPanelProps) {
    return (
        <div>
            {isSimulating && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white
                     shadow-sm transition hover:bg-red-700 focus:outline-none
                     focus:ring-4 focus:ring-red-200/70 active:scale-[0.99] hover:cursor-pointer"
                >
                    Reset Simulation
                </button>
            )}
            <pre className="mt-6 whitespace-pre-wrap text-sm text-gray-100">{results}</pre>
        </div>
    );
}
