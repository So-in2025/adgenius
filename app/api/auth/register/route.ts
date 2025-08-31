import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: email, password, name' },
        { status: 400 }
      );
    }

    // Simulación de registro exitoso
    return NextResponse.json({
      success: true,
      user: {
        id: 'user-' + Date.now(),
        email: email.trim(),
        name: name.trim(),
        credits: 5
      },
      message: '✅ Usuario registrado exitosamente'
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error en el registro. Intenta nuevamente.' },
      { status: 400 }
    );
  }
}