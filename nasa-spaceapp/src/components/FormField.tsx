'use client';

import React from 'react';

// Define the props for our new reusable component
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    unit?: string;
    isLocked?: boolean;
    lockedValue?: string | number;
}

export default function FormField({
    label,
    unit,
    isLocked = false,
    lockedValue,
    ...props // Pass through any other standard input props like 'type', 'min', 'step', etc.
}: FormFieldProps) {
    // If the field is locked, display a styled div instead of an input
    if (isLocked) {
        return (
            <div>
                <div className="mb-1 block text-sm font-medium text-gray-700">{label} (locked)</div>
                <div className="rounded-xl text-sm font-medium text-gray-800 bg-gray-100 border border-gray-200 p-3">
                    {lockedValue ?? '—'}
                </div>
            </div>
        );
    }

    // Otherwise, render the label and the input field
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
                {label} {unit && `(${unit})`}
            </span>
            <input
                {...props}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900
                           placeholder-gray-400 outline-none transition
                           focus:border-sky-500 focus:ring-4 focus:ring-sky-200/60
                           disabled:cursor-not-allowed disabled:bg-gray-100"
            />
        </label>
    );
}
