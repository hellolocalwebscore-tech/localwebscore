import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL no proporcionada' }, { status: 400 });
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`El servidor rechazó la conexión: ${response.status}`);
    }

    const html = await response.text();

    // Utilizamos [\s\S]*? para capturar todo el contenido, incluso si hay saltos de línea
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                             html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : null;

    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    // Limpiamos cualquier etiqueta HTML anidada (como <span> o <strong>) para sacar solo el texto limpio
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null;

    return NextResponse.json({
      title: title ? { text: title, length: title.length } : null,
      description: description ? { text: description, length: description.length } : null,
      h1: h1 ? { text: h1, length: h1.length } : null,
    });

  } catch (error) {
    console.error("Fallo en el escáner:", error);
    return NextResponse.json({ error: 'No se pudo analizar la web' }, { status: 500 });
  }
}