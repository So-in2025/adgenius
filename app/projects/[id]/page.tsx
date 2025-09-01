'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProjectStatusPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkProjectStatus();
    const interval = setInterval(checkProjectStatus, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const checkProjectStatus = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error('Error fetching project');
      
      const data = await response.json();
      setProject(data);
      
      if (data.status === 'completed') {
        setTimeout(() => router.push(`/editor/${id}`), 2000);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Generando tu video</h1>
        
        {project?.status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Buscando videos en Pexels...</p>
            <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
          </>
        )}
        
        {project?.status === 'completed' && (
          <>
            <div className="text-green-600 text-4xl mb-4">✅</div>
            <p className="text-gray-600">¡Video listo! Redirigiendo al editor...</p>
          </>
        )}
      </div>
    </div>
  );
}