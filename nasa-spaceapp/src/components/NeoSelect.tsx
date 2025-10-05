"use client";

import { useEffect, useState } from "react";

export type NeoOption = {
  id: string;
  name_limited: string;
  neo_reference_id: string;
};

type Props = {
  value?: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export default function NeoSelect({ value, onChange, disabled }: Props) {
  const [items, setItems] = useState<NeoOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/neos/select");
        const data = await res.json();
        if (active) setItems(Array.isArray(data) ? data : []);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-100 mb-1">
        Celestial Body
      </label>

      <select
        className="w-full rounded-lg border border-gray-500 bg-gray-800 text-gray-100 p-2"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
      >
        <option value="">{loading ? "Loading..." : "Select..."}</option>
        {items.map((it) => (
          <option key={it.id} value={it.id}>
            {it.name_limited}
          </option>
        ))}
      </select>

      <p className="mt-1 text-xs text-gray-300">
        When selecting a celestial body, the diameter and velocity are filled in automatically.
      </p>
    </div>
  );
}