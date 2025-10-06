export type DensitySource = 'measured' | 'taxonomy' | 'albedo' | 'fallback';

export function isFiniteNumber(n: unknown): n is number | string {
    return n !== null && n !== undefined && Number.isFinite(Number(n));
}

export async function safeText(res: Response) {
    try {
        const t = await res.text();
        return t?.slice(0, 300);
    } catch {
        return '';
    }
}

/** Estimativa de densidade com base na taxonomia (bulk density) */
export function densityFromTaxonomy(spec?: string) {
    if (!spec) return undefined;
    const s = spec.toUpperCase();
    if (s.startsWith('S') || s.startsWith('Q') || s.startsWith('V'))
        return { rho_g_cm3: 3.0, source: 'taxonomy' as const };
    if (s.startsWith('C') || s.startsWith('B'))
        return { rho_g_cm3: 1.7, source: 'taxonomy' as const };
    if (s.startsWith('M') || s.startsWith('X') || s === 'XK' || s === 'XC')
        return { rho_g_cm3: 6.0, source: 'taxonomy' as const };
    return undefined;
}

/** Estimativa de densidade via albedo geométrico (pv) */
export function densityFromAlbedo(pv?: number) {
    if (pv == null || !Number.isFinite(pv)) return undefined;
    if (pv < 0.08) return { rho_g_cm3: 1.7, source: 'albedo' as const };
    if (pv > 0.2) return { rho_g_cm3: 3.0, source: 'albedo' as const };
    return undefined;
}
