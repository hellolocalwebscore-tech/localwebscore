import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL no proporcionada' }, { status: 400 });
    }

    // Limpiamos espacios y comprobamos si falta el http/https
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    // Usamos finalUrl en lugar de url
    const response = await fetch(finalUrl);
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;

    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                             html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    const description = descriptionMatch ? descriptionMatch[1] : null;

    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1] : null;

    return NextResponse.json({
      title: title ? { text: title, length: title.length } : null,
      description: description ? { text: description, length: description.length } : null,
      h1: h1 ? { text: h1, length: h1.length } : null,
    });

  } catch (error) {
    return NextResponse.json({ error: 'No se pudo analizar la web' }, { status: 500 });
  }
}