import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('user-id');
  
  return NextResponse.json({ message: 'Sesión cerrada' });
}