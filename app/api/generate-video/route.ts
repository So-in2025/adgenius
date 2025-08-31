import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, duration } = await request.json();

    // Simulación REAL de generación - REMPLAZA CON TU LÓGICA
    const generatedContent = {
      id: Date.now().toString(),
      videoUrl: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4`,
      thumbnail: `https://via.placeholder.com/300x169/0088cc/ffffff?text=Video+Generado`,
      status: 'completed',
      prompt: prompt,
      style: style,
      duration: duration,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      data: generatedContent 
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}