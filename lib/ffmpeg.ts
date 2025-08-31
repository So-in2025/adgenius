import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function getFFmpeg() {
  if (ffmpeg) return ffmpeg;

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  ffmpeg = new FFmpeg();
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  
  return ffmpeg;
}

export async function createVideoFromImagesAndAudio(images: string[], audio: string, captions: string[]) {
  // Implementación básica para el MVP
  return "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
}