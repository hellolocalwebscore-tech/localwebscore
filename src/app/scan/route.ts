import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Recibimos la URL que el usuario ha escrito en la barra de búsqueda
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL no proporcionada' }, { status: 400 });
    }

    // 1. Viajamos a la web del cliente y descargamos su código fuente
    const response = await fetch(url);
    const html = await response.text();

    // 2. Buscamos la etiqueta Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;

    // 3. Buscamos la Meta Descripción
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                             html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    const description = descriptionMatch ? descriptionMatch[1] : null;

    // 4. Buscamos el encabezado H1
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1] : null;

    // 5. Devolvemos los datos reales a nuestro panel frontal
    return NextResponse.json({
      title: title ? { text: title, length: title.length } : null,
      description: description ? { text: description, length: description.length } : null,
      h1: h1 ? { text: h1, length: h1.length } : null,
    });

  } catch (error) {
    return NextResponse.json({ error: 'No se pudo analizar la web' }, { status: 500 });
  }
}