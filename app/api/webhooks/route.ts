import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // placeholder para webhooks
  return NextResponse.json({ message: 'Webhooks endpoint' });
}