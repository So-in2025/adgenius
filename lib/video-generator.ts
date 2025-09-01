import { getBestPexelsVideo } from './pexels';
import { generateWithGoogleAI } from './google-ai';

export interface VideoScene {
  duration: number;
  visual: string;
  text: string;
  transition: string;
}

export async function generateVideoFromPrompt(prompt: string, style: string): Promise<VideoScene[]> {
  try {
    // 1. Generar script con IA
    const script = await generateWithGoogleAI(prompt, style, '30');
    const scriptData = JSON.parse(script);
    
    const scenes: VideoScene[] = [];

    // 2. Para cada escena, buscar video en Pexels
    for (const scene of scriptData.escenas) {
      const searchQuery = `${scene.visual} ${style} style`;
      const videoUrl = await getBestPexelsVideo(searchQuery);
      
      if (videoUrl) {
        scenes.push({
          duration: scene.duracion || 5,
          visual: videoUrl,
          text: scene.texto,
          transition: 'fade'
        });
      }
    }

    // 3. Si no hay escenas, crear una de fallback
    if (scenes.length === 0) {
      scenes.push({
        duration: 10,
        visual: 'https://player.vimeo.com/external/371846138.sd.mp4?s=ada720d5e5bb2aaff06a3ad1fd6cde610aac5d5a&profile_id=139&oauth2_token_id=57447761',
        text: prompt.substring(0, 100) + '...',
        transition: 'fade'
      });
    }

    return scenes;
    
  } catch (error) {
    console.error('Error generating video:', error);
    // Fallback básico
    return [{
      duration: 10,
      visual: 'https://player.vimeo.com/external/371846138.sd.mp4?s=ada720d5e5bb2aaff06a3ad1fd6cde610aac5d5a&profile_id=139&oauth2_token_id=57447761',
      text: prompt.substring(0, 100) + '...',
      transition: 'fade'
    }];
  }
}