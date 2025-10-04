import { NextResponse } from "next/server";

const NASA_KEY = process.env.NASA_API_KEY;

export async function GET() {
  try {
    // Busca os primeiros 50 asteroides (pode ajustar o tamanho)
    const url = `https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=50&api_key=${NASA_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Falha ao buscar dados da NASA");

    const data = await res.json();

    // Normaliza os dados — apenas o necessário para o <select>
    const options = (data.near_earth_objects ?? []).map((neo: { id: string; name_limited?: string; name?: string }) => ({
      id: neo.id,
      name_limited: neo.name_limited ?? neo.name,
    }));

    return NextResponse.json(options);
  } catch (err) {
    console.error("Erro ao gerar lista de select:", err);
    return NextResponse.json({ error: "Erro ao carregar asteroides" }, { status: 500 });
  }
}