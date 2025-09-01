import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔧 Debug endpoint called');
    return NextResponse.json({ 
      status: 'OK', 
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}