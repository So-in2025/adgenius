'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DownloadModal from '@/components/DownloadModal';

export default function EditorPage() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      if (!response.ok) throw new Error('Error loading project');
      
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSceneText = (sceneIndex: number, newText: string) => {
    if (!project) return;
    
    const updatedScenes = [...project.scenes];
    updatedScenes[sceneIndex].text = newText;
    setProject({ ...project, scenes: updatedScenes });
  };

  const saveChanges = async () => {
    if (!project) return;

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes: project.scenes }),
      });

      if (!response.ok) throw new Error('Error saving changes');
      alert('✅ Cambios guardados correctamente');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('❌ Error al guardar cambios');
    }
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    // Lógica real de descarga
    if (project?.videoUrl) {
      const link = document.createElement('a');
      link.href = project.videoUrl;
      link.download = `adgenius-video-${project.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando proyecto...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Proyecto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow">
          <h1 className="text-3xl font-bold mb-2">Editor de Video</h1>
          <p className="text-gray-600">Editando: {project.prompt?.substring(0, 50)}...</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="bg-black rounded-lg p-4 shadow">
            <h2 className="text-white text-lg font-semibold mb-4">Vista Previa</h2>
            <div className="aspect-video bg-gray-800 rounded flex items-center justify-center">
              <span className="text-gray-400">Preview del video generado</span>
            </div>
          </div>

          {/* Editor de Escenas */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Editar Escenas</h2>
            
            {project.scenes?.map((scene: any, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2">Escena {index + 1}</h3>
                <textarea
                  value={scene.text}
                  onChange={(e) => updateSceneText(index, e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Texto de la escena..."
                />
                <div className="mt-2 text-sm text-gray-500">
                  Duración: {scene.duration}s • Transición: {scene.transition}
                </div>
              </div>
            ))}

            {/* Botones de Acción */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={saveChanges}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                💾 Guardar Cambios
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                ← Volver al Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Botón de Descarga Fijo */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 flex items-center gap-2"
          >
            ⬇️ Descargar Video
          </button>
        </div>

        {/* Modal de Facebook para Descarga */}
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          onConfirm={confirmDownload}
          videoUrl={project.videoUrl}
        />
      </div>
    </div>
  );
}