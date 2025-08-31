import { sql } from '@vercel/postgres';

export async function createUser(email: string, passwordHash: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash, created_at)
      VALUES (${email}, ${passwordHash}, NOW())
      RETURNING id, email, created_at
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.message.includes('unique')) {
      throw new Error('El email ya está registrado');
    }
    throw new Error('Error al crear usuario');
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error getting user:', error);
    throw new Error('Error al buscar usuario');
  }
}

export async function getUserById(id: number) {
  try {
    const result = await sql`
      SELECT id, email, created_at FROM users WHERE id = ${id}
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error getting user by id:', error);
    throw new Error('Error al buscar usuario');
  }
}