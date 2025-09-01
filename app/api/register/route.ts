import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: email, password, name' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario en la base de datos
    const user = await createUser(email.trim(), passwordHash, name.trim());

    // Crear sesión
    const cookieStore = cookies();
    cookieStore.set('user-id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 semana
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits || 5
      },
      message: '✅ Usuario registrado exitosamente'
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Error en el registro. Intenta nuevamente.' },
      { status: 400 }
    );
  }
}