// types/index.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface User {
  name: string;
  email: string;
  credits: number;
  plan: 'free' | 'premium';
  joined: string;
}

interface Project {
  id: string;
  title: string;
  prompt: string;
  script: string;
  videoUrl: string;
  thumbnail: string;
  style: string;
  duration: string;
  createdAt: string;
  status: 'generating' | 'completed';
}