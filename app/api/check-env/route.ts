import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    pexelsKey: process.env.PEXELS_API_KEY ? '✅ CONFIGURADA' : '❌ NO CONFIGURADA',
    keyLength: process.env.PEXELS_API_KEY?.length,
    keyStart: process.env.PEXELS_API_KEY?.substring(0, 10),
    keyEnd: process.env.PEXELS_API_KEY?.substring(process.env.PEXELS_API_KEY?.length - 10),
    nodeEnv: process.env.NODE_ENV
  });
}