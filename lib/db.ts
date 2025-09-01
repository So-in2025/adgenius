import { sql } from '@vercel/postgres';

// USER FUNCTIONS
export async function createUser(email: string, passwordHash: string, name: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash, name, created_at)
      VALUES (${email}, ${passwordHash}, ${name}, NOW())
      RETURNING id, email, name, created_at, credits
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
      SELECT id, email, name, created_at, credits FROM users WHERE id = ${id}
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error getting user by id:', error);
    throw new Error('Error al buscar usuario');
  }
}

// CREDIT FUNCTIONS
export async function deductCredit(userId: number) {
  try {
    const result = await sql`
      UPDATE users 
      SET credits = credits - 1,
          updated_at = NOW()
      WHERE id = ${userId} AND credits > 0
      RETURNING id, credits
    `;
    return result.rows[0] ? { success: true, credits: result.rows[0].credits } : null;
  } catch (error: any) {
    console.error('Error deducting credit:', error);
    throw new Error('Error al descontar crédito');
  }
}

// PROJECT FUNCTIONS
export async function createVideoProject(
  userId: number,
  prompt: string,
  style: string,
  duration: string,
  scenes: string
) {
  try {
    const result = await sql`
      INSERT INTO video_projects 
        (user_id, prompt, style, duration, scenes, status, created_at)
      VALUES 
        (${userId}, ${prompt}, ${style}, ${duration}, ${scenes}, 'completed', NOW())
      RETURNING *
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error creating video project:', error);
    throw new Error('Error al crear proyecto');
  }
}

export async function getVideoProject(projectId: number) {
  try {
    const result = await sql`
      SELECT * FROM video_projects WHERE id = ${projectId}
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error getting project:', error);
    throw new Error('Error al obtener proyecto');
  }
}

export async function getUserProjects(userId: number) {
  try {
    const result = await sql`
      SELECT * FROM video_projects 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    return result.rows;
  } catch (error: any) {
    console.error('Error getting user projects:', error);
    throw new Error('Error al obtener proyectos');
  }
}

export async function updateVideoProject(projectId: number, updates: any) {
  try {
    const { status, scenes, video_url } = updates;
    
    const result = await sql`
      UPDATE video_projects 
      SET 
        status = COALESCE(${status}, status),
        scenes = COALESCE(${scenes}, scenes),
        video_url = COALESCE(${video_url}, video_url),
        updated_at = NOW()
      WHERE id = ${projectId}
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error: any) {
    console.error('Error updating project:', error);
    throw new Error('Error al actualizar proyecto');
  }
}

export async function trackDownload(projectId: number) {
  try {
    const result = await sql`
      UPDATE video_projects 
      SET download_count = COALESCE(download_count, 0) + 1,
          last_downloaded = NOW()
      WHERE id = ${projectId}
      RETURNING download_count
    `;
    return result.rows[0];
  } catch (error: any) {
    console.error('Error tracking download:', error);
    throw new Error('Error al registrar descarga');
  }
}