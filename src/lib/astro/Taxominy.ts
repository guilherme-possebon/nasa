export type DensityEstimate = {
    rho_g_cm3: number;
    source: 'taxonomy' | 'albedo' | 'fallback';
    range?: [number, number];
};

export function densityFromTaxonomy(spec?: string): DensityEstimate | undefined {
    if (!spec) return undefined;
    const s = spec.toUpperCase();

    if (s.startsWith('S') || s.startsWith('Q') || s.startsWith('V')) {
        return { rho_g_cm3: 3.0, range: [2.5, 3.5], source: 'taxonomy' };
    }
    if (s.startsWith('C') || s.startsWith('B')) {
        return { rho_g_cm3: 1.7, range: [1.2, 2.2], source: 'taxonomy' };
    }
    if (s.startsWith('M') || s === 'XK' || s === 'XC') {
        return { rho_g_cm3: 6.0, range: [5.0, 8.0], source: 'taxonomy' };
    }

    return undefined;
}

export function densityFromAlbedo(pv?: number): DensityEstimate | undefined {
    if (pv == null) return undefined;
    if (pv < 0.08) return { rho_g_cm3: 1.7, range: [1.2, 2.2], source: 'albedo' };
    if (pv > 0.2) return { rho_g_cm3: 3.0, range: [2.5, 3.5], source: 'albedo' };
    return undefined;
}
