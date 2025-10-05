import { NextRequest, NextResponse } from 'next/server';
import {
  isFiniteNumber,
  safeText,
  densityFromTaxonomy,
  densityFromAlbedo,
  type DensitySource,
} from '@/lib/astro/neo-helpers';

const NASA_API_KEY = process.env.NASA_API_KEY ?? 'DEMO_KEY';
const NASA_API_BASE_URL = process.env.NASA_API_BASE_URL ?? 'https://api.nasa.gov/neo/rest/v1/neo';

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const neowsUrl = `${NASA_API_BASE_URL}/${encodeURIComponent(id)}?api_key=${encodeURIComponent(
      NASA_API_KEY,
    )}`;
    const neowsRes = await fetch(neowsUrl, { next: { revalidate: 86400 } });
    if (!neowsRes.ok)
      throw new Error(`NeoWs fetch failed: ${neowsRes.status} ${await safeText(neowsRes)}`);
    const neo = await neowsRes.json();

    // Diâmetro médio
    const dkMin = neo?.estimated_diameter?.kilometers?.estimated_diameter_min;
    const dkMax = neo?.estimated_diameter?.kilometers?.estimated_diameter_max;
    const diameter_km =
      isFiniteNumber(dkMin) && isFiniteNumber(dkMax)
        ? (Number(dkMin) + Number(dkMax)) / 2
        : isFiniteNumber(dkMin)
          ? Number(dkMin)
          : isFiniteNumber(dkMax)
            ? Number(dkMax)
            : undefined;

    // Velocidade (km/s)
    let velocity_kms: number | undefined;
    if (Array.isArray(neo?.close_approach_data)) {
      const last = neo.close_approach_data
        .filter((a: { orbiting_body: string }) => a.orbiting_body === 'Earth')
        .sort(
          (a: { close_approach_date_full: string }, b: { close_approach_date_full: string }) =>
            new Date(b.close_approach_date_full || 0).getTime() -
            new Date(a.close_approach_date_full || 0).getTime(),
        )[0];
      const v = last?.relative_velocity?.kilometers_per_second;
      if (isFiniteNumber(v)) velocity_kms = Number(v);
    }

    // 2️⃣ SBDB (com phys-par)
    const sstr = neo?.neo_reference_id || neo?.name || neo?.designation || id;
    const sbdbUrl = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(
      sstr,
    )}&phys-par=true`;
    const sbdbRes = await fetch(sbdbUrl, { next: { revalidate: 86400 } });
    const sbdb = sbdbRes.ok ? await sbdbRes.json() : null;

    // Log completo do phys_par
    console.log('\n===== SBDB RAW RETURN =====');
    console.log(JSON.stringify(sbdb?.phys_par, null, 2));
    console.log('===== END RAW RETURN =====\n');

    // Extrair phys_par de forma genérica (pois não vem em objeto, mas array)
    const phys_par = Array.isArray(sbdb?.phys_par) ? sbdb.phys_par : [];
    const findVal = (name: string) =>
      phys_par.find((p: { name: string }) => p.name === name)?.value ?? undefined;

    const spec_T = findVal('spec_T');
    const spec_B = findVal('spec_B');
    const albedo = findVal('albedo');

    // Logar os valores encontrados
    console.log('spec_T:', spec_T, 'spec_B:', spec_B, 'albedo:', albedo);

    // Estimar densidade
    let density_g_cm3: number | undefined;
    let density_source: DensitySource = 'fallback';

    const tax = densityFromTaxonomy(spec_B ?? spec_T);
    const alb = densityFromAlbedo(Number(albedo));
    const est = tax ?? alb;

    if (est) {
      density_g_cm3 = est.rho_g_cm3;
      density_source = est.source;
    } else {
      density_g_cm3 = 3.0;
      density_source = 'fallback';
    }

    const density_kg_m3 = density_g_cm3 * 1000;

    return NextResponse.json({
      id: neo?.id ?? id,
      name: neo?.name ?? sstr,
      diameter_km,
      velocity_kms,
      hazardous: Boolean(neo?.is_potentially_hazardous_asteroid),
      taxonomy: { spec_B, spec_T, albedo },
      density_g_cm3,
      density_kg_m3,
      density_source,
    });
  } catch (err) {
    console.error('NEO detail error:', err);
    return NextResponse.json({ error: 'Erro ao obter dados do asteroide.' }, { status: 500 });
  }
}
