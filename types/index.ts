export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
}

export interface VideoProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  script: string;
  style: string;
  target_platform: 'instagram' | 'tiktok' | 'facebook';
  status: 'draft' | 'generating' | 'completed' | 'failed';
  video_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}