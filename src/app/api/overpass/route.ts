import { NextResponse } from 'next/server';

type OverpassElement = {
  id: number;
  lat: number;
  lon: number;
  tags: { [k: string]: string | undefined };
};

type OverpassResponse = {
  elements: OverpassElement[];
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get('lat'));
    const lon = Number(searchParams.get('lon'));
    const radius = Number(searchParams.get('radius'));

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(radius) || radius <= 0) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos. Envie lat, lon e radius (metros).' },
        { status: 400 },
      );
    }

    const query = `[out:json];
      node(around:${radius},${lat},${lon})["place"~"^(city|town)$"];
      out body;`;

    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'User-Agent': 'Chicxulub/1.0 (Next.js Overpass proxy)',
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Overpass retornou ${res.status}` },
        { status: res.status },
      );
    }

    const data = (await res.json()) as OverpassResponse;
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro interno ao consultar Overpass.' }, { status: 500 });
  }
}
