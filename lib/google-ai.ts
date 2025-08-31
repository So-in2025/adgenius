export async function generateWithGoogleAI(prompt: string, platform: string, style: string): Promise<string> {
  const API_KEY = process.env.GOOGLE_AI_API_KEY;
  
  if (!API_KEY) {
    return generateFallbackScript(prompt, platform, style);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Genera un guion JSON para anuncio de ${platform}, estilo ${style}. Tema: ${prompt}. Incluye escenas con visual, texto y duración.`
            }]
          }]
        })
      }
    );

    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || generateFallbackScript(prompt, platform, style);
    
  } catch (error) {
    return generateFallbackScript(prompt, platform, style);
  }
}

function generateFallbackScript(prompt: string, platform: string, style: string): string {
  return JSON.stringify({
    proyecto: `Anuncio ${platform} - ${style}`,
    tema: prompt,
    escenas: [
      {
        numero: 1,
        visual: `Imagen impactante de ${prompt}`,
        texto: `Descubre ${prompt}`,
        duracion: 4
      },
      {
        numero: 2,
        visual: "Demostración del producto",
        texto: "Solución perfecta para tus necesidades",
        duracion: 6
      },
      {
        numero: 3,
        visual: "Llamado a la acción",
        texto: "¡Comienza ahora mismo!",
        duracion: 3
      }
    ],
    duracion_total: 13,
    plataforma: platform,
    estilo: style
  }, null, 2);
}