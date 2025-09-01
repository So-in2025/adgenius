const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
}

export async function searchPexelsVideos(query: string, perPage: number = 3): Promise<PexelsVideo[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY!,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error('Pexels API error:', error);
    return [];
  }
}

export async function getBestPexelsVideo(query: string): Promise<string | null> {
  try {
    const videos = await searchPexelsVideos(query, 1);
    
    if (videos.length === 0) return null;

    const video = videos[0];
    // Preferir HD 1080p, luego SD, luego cualquier calidad
    const hdVideo = video.video_files.find(f => f.quality === 'hd' && f.height === 1080);
    const sdVideo = video.video_files.find(f => f.quality === 'sd');
    
    return hdVideo?.link || sdVideo?.link || video.video_files[0]?.link || null;
  } catch (error) {
    console.error('Error getting best Pexels video:', error);
    return null;
  }
}