import { NextResponse } from 'next/server';
import { trackDownload } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Registrar descarga en analytics
    await trackDownload(Number(params.id));
    
    return NextResponse.json({ 
      success: true,
      message: 'Download tracked'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error tracking download' },
      { status: 500 }
    );
  }
}