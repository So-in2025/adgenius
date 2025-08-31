import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Thumbnail sample de prueba
  const sampleThumbnail = 'https://via.placeholder.com/300x169/2563eb/ffffff?text=AdGenius+Video';
  return NextResponse.redirect(sampleThumbnail);
}