import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, duration } = await request.json();

    // Simulación de generación con IA
    const generatedScript = `
# GUION GENERADO PARA: "${prompt}"

**Estilo:** ${style}
**Duración:** ${duration} segundos

## ESCENA 1 (0-10s)
- [VISUAL] Introducción con logo/marca
- [AUDIO] Música de fondo
- [TEXTO] "Transformando ideas en realidad"

## ESCENA 2 (10-20s)  
- [VISUAL] Demostración del producto/servicio
- [AUDIO] Voz en off explicando beneficios
- [TEXTO] "Resultados comprobados"

## ESCENA 3 (20-${duration}s)
- [VISUAL] Llamado a acción claro
- [AUDIO] Contacto y oferta especial
- [TEXTO] "¡Contáctanos ahora!"

---

*Guion generado por AdGenius AI*
    `.trim();

    return NextResponse.json({
      success: true,
      script: generatedScript,
      videoUrl: '/api/sample-video',
      thumbnail: '/api/sample-thumbnail',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error generando guion' },
      { status: 500 }
    );
  }
}