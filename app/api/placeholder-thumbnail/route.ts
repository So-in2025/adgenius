import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect('https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg');
}