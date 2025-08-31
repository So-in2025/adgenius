import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // placeholder para videos
  return NextResponse.json({ message: 'Videos endpoint' });
}