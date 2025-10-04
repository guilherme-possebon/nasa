import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_API_BASE_URL = process.env.NASA_API_BASE_URL;

// Rota: /api/neos/3542519
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const url = `${NASA_API_BASE_URL}/${id}?api_key=${NASA_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 1 dia
    if (!res.ok) throw new Error("Falha na API da NASA");
    const neo = await res.json();

    const diameter =
      (neo.estimated_diameter?.kilometers?.estimated_diameter_min +
        neo.estimated_diameter?.kilometers?.estimated_diameter_max) /
      2;

    // Pega a última aproximação com a Terra
    const earthPasses = neo.close_approach_data?.filter(
      (a: { orbiting_body: string }) => a.orbiting_body === "Earth"
    );
    const lastApproach = earthPasses?.[earthPasses.length - 1];

    const velocity =
      Number(lastApproach?.relative_velocity?.kilometers_per_second) || 0;

    return NextResponse.json({
      id: neo.id,
      name: neo.name,
      diameter_km: diameter,
      velocity_kms: velocity,
      hazardous: neo.is_potentially_hazardous_asteroid,
      data: neo, // opcional: objeto bruto
    });
  } catch (err) {
    console.error("Erro ao buscar NEO:", err);
    return NextResponse.json({ error: "Erro ao obter dados do asteroide." }, { status: 500 });
  }
}
