import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createVideoProject, deductCredit } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('🎬 Starting video generation...');
    
    // 1. Verificar autenticación
    const cookieStore = cookies();
    const userId = cookieStore.get('user-id');
    
    if (!userId?.value) {
      console.log('❌ No user authenticated');
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Obtener datos del request
    const { prompt, style, duration } = await request.json();
    console.log('📦 Request data:', { prompt: prompt?.substring(0, 50), style, duration });

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 });
    }

    // 3. Verificar créditos
    console.log('💳 Checking credits for user:', userId.value);
    const creditResult = await deductCredit(Number(userId.value));
    
    if (!creditResult) {
      console.log('❌ Insufficient credits');
      return NextResponse.json({ error: 'Créditos insuficientes' }, { status: 400 });
    }

    console.log('✅ Credits deducted. Remaining:', creditResult.credits);

    // 4. Generar escenas con Pexels
    console.log('🎬 Generating video scenes...');
    const scenes = await generateVideoWithPexels(prompt, style);
    console.log('✅ Generated scenes:', scenes.length);

    // 5. Guardar proyecto en base de datos
    console.log('💾 Saving project to database...');
    const project = await createVideoProject(
      Number(userId.value),
      prompt,
      style,
      duration,
      JSON.stringify(scenes)
    );

    console.log('🚀 Project created successfully. ID:', project.id);

    return NextResponse.json({
      success: true,
      videoId: project.id,
      scenes: scenes,
      creditsRemaining: creditResult.credits,
      status: 'completed',
      message: 'Video generado exitosamente!'
    });

  } catch (error: any) {
    console.error('💥 Error in generate endpoint:', error);
    
    return NextResponse.json(
      { 
        error: 'Error generando video. Intenta nuevamente.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// FUNCIÓN REAL CON PEXELS
async function generateVideoWithPexels(prompt: string, style: string) {
  const scenes = [];
  const searchQuery = `${prompt} ${style}`;
  console.log('🔍 Searching Pexels for:', searchQuery);
  
  try {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      throw new Error('PEXELS_API_KEY not configured');
    }

    // Test connection first
    const testResponse = await fetch(
      'https://api.pexels.com/videos/search?query=technology&per_page=1',
      {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (testResponse.status === 401) {
      throw new Error('Pexels API Key unauthorized');
    }

    if (!testResponse.ok) {
      throw new Error(`Pexels API error: ${testResponse.status}`);
    }

    // Now search for real videos
    const searchResponse = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(searchQuery)}&per_page=3`,
      {
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Search failed: ${searchResponse.status}`);
    }

    const data = await searchResponse.json();
    console.log('🎥 Pexels found videos:', data.videos?.length || 0);
    
    // Create scenes from Pexels videos
    for (const video of data.videos || []) {
      const videoFile = video.video_files?.find((f: any) => f.quality === 'hd') || 
                       video.video_files?.find((f: any) => f.quality === 'sd') ||
                       video.video_files?.[0];
      
      if (videoFile?.link) {
        scenes.push({
          duration: 8,
          visual: videoFile.link,
          text: `${prompt.substring(0, 40)}...`,
          transition: 'fade',
          source: 'Pexels'
        });
      }
    }

    // Fallback if no videos found
    if (scenes.length === 0) {
      console.log('⚠️ No videos found, using fallback');
      scenes.push({
        duration: 10,
        visual: 'https://player.vimeo.com/external/371846138.sd.mp4?s=ada720d5e5bb2aaff06a3ad1fd6cde610aac5d5a&profile_id=139&oauth2_token_id=57447761',
        text: prompt.substring(0, 50) + '...',
        transition: 'fade',
        source: 'Fallback'
      });
    }

    return scenes;

  } catch (error: any) {
    console.error('❌ Pexels error, using fallback:', error.message);
    
    // Emergency fallback
    return [{
      duration: 10,
      visual: 'https://player.vimeo.com/external/371846138.sd.mp4?s=ada720d5e5bb2aaff06a3ad1fd6cde610aac5d5a&profile_id=139&oauth2_token_id=57447761',
      text: prompt.substring(0, 50) + '...',
      transition: 'fade',
      source: 'EmergencyFallback'
    }];
  }
}