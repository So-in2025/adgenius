import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user-id');
    
    if (!userId?.value) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const user = await getUserById(Number(userId.value));
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error de autenticación' },
      { status: 500 }
    );
  }
}