import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Importación condicional solo para servidor
let canvas: any = null;
let loadImage: any = null;
let createCanvas: any = null;

if (typeof window === 'undefined') {
  // Solo en servidor (Node.js)
  const canvasModule = require('canvas');
  createCanvas = canvasModule.createCanvas;
  loadImage = canvasModule.loadImage;
} else {
  // En cliente, usamos funciones mock o vacías
  createCanvas = () => null;
  loadImage = () => null;
}

export interface VideoGenerationOptions {
  width: number;
  height: number;
  duration: number;
  framesPerSecond: number;
  outputPath: string;
  assets: {
    imagePaths: string[];
    textOverlays: {
      text: string;
      x: number;
      y: number;
      color: string;
      fontSize: number;
    }[];
  };
}

export class VideoGenerator {
  static async generate(options: VideoGenerationOptions): Promise<string> {
    // Solo ejecutar en servidor
    if (typeof window !== 'undefined') {
      throw new Error('Video generation is only available on the server');
    }

    const { width, height, outputPath, assets } = options;
    
    // Crear directorio si no existe
    const outputDir = join(process.cwd(), 'public', 'generated');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Crear canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    try {
      // Cargar y dibujar imágenes de fondo
      for (const imagePath of assets.imagePaths) {
        const image = await loadImage(join(process.cwd(), 'public', imagePath));
        ctx.drawImage(image, 0, 0, width, height);
      }

      // Dibujar textos
      for (const overlay of assets.textOverlays) {
        ctx.fillStyle = overlay.color;
        ctx.font = `${overlay.fontSize}px Arial`;
        ctx.fillText(overlay.text, overlay.x, overlay.y);
      }

      // Guardar frame
      const buffer = canvas.toBuffer('image/png');
      const finalPath = join(outputDir, outputPath);
      writeFileSync(finalPath, buffer);

      return `/generated/${outputPath}`;

    } catch (error) {
      console.error('Error generating video frame:', error);
      throw new Error('Failed to generate video content');
    }
  }

  static async generateVideoPreview(options: VideoGenerationOptions): Promise<string> {
    // Implementación para preview
    return this.generate({
      ...options,
      outputPath: `preview-${Date.now()}.png`
    });
  }

  // Método para cliente que llama a la API
  static async generateClientPreview(options: VideoGenerationOptions): Promise<string> {
    if (typeof window === 'undefined') {
      return this.generateVideoPreview(options);
    }

    // En cliente, llamar a la API
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      return data.previewUrl;
    } catch (error) {
      console.error('Error generating video preview:', error);
      throw error;
    }
  }
}

export default VideoGenerator;