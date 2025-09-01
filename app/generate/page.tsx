'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface GenerationStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details?: string;
  progress?: number;
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('corporativo');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const router = useRouter();
  const progressRef = useRef<NodeJS.Timeout>();

  const updateStep = (stepName: string, updates: Partial<GenerationStep>) => {
    setGenerationSteps(prev => prev.map(step => 
      step.step === stepName ? { ...step, ...updates } : step
    ));
  };

  const addStep = (step: GenerationStep) => {
    setGenerationSteps(prev => [...prev, step]);
  };

  const simulateProgress = (totalTime: number) => {
    let currentProgress = 0;
    const interval = 100;
    const increment = (interval / totalTime) * 100;

    return new Promise<void>((resolve) => {
      progressRef.current = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          clearInterval(progressRef.current);
          setProgress(100);
          resolve();
        } else {
          setProgress(Math.min(currentProgress, 99));
        }
      }, interval);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProgress(0);
    setEstimatedTime(25);
    setGenerationSteps([]);

    // Pasos iniciales
    addStep({ step: 'Verificando créditos', status: 'pending' });
    addStep({ step: 'Analizando prompt', status: 'pending' });
    addStep({ step: 'Generando guión con IA', status: 'pending' });
    addStep({ step: 'Buscando videos en Pexels', status: 'pending' });
    addStep({ step: 'Componiendo escenas', status: 'pending' });
    addStep({ step: 'Guardando proyecto', status: 'pending' });

    try {
      // Iniciar progreso simulado
      simulateProgress(25000);

      // Paso 1: Verificar créditos
      updateStep('Verificando créditos', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStep('Verificando créditos', { status: 'completed', progress: 100 });

      // Paso 2: Analizar prompt
      updateStep('Analizando prompt', { status: 'processing', details: `"${prompt.substring(0, 30)}..."` });
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateStep('Analizando prompt', { status: 'completed', progress: 100 });

      // Paso 3: Generar guión con IA (simulado)
      updateStep('Generando guión con IA', { status: 'processing' });
      const scriptSteps = [
        'Creando estructura narrativa...',
        'Definiendo escenas clave...',
        'Optimizando para engagement...',
        'Ajustando al estilo ' + style
      ];
      
      for (let i = 0; i < scriptSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateStep('Generando guión con IA', { 
          status: 'processing', 
          details: scriptSteps[i],
          progress: ((i + 1) / scriptSteps.length) * 100
        });
      }
      updateStep('Generando guión con IA', { status: 'completed', progress: 100 });

      // Paso 4: Buscar videos en Pexels
      updateStep('Buscando videos en Pexels', { status: 'processing' });
      const searchTerms = [prompt, style, '4k', 'motion'];
      for (let i = 0; i < searchTerms.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateStep('Buscando videos en Pexels', { 
          status: 'processing', 
          details: `Buscando: "${searchTerms[i]}"`,
          progress: ((i + 1) / searchTerms.length) * 100
        });
      }
      updateStep('Buscando videos en Pexels', { status: 'completed', progress: 100 });

      // Paso 5: Componer escenas
      updateStep('Componiendo escenas', { status: 'processing' });
      const compositionSteps = [
        'Seleccionando mejores takes...',
        'Ajustando duraciones...',
        'Aplicando transiciones...',
        'Sincronizando con guión...'
      ];
      for (let i = 0; i < compositionSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        updateStep('Componiendo escenas', { 
          status: 'processing', 
          details: compositionSteps[i],
          progress: ((i + 1) / compositionSteps.length) * 100
        });
      }
      updateStep('Componiendo escenas', { status: 'completed', progress: 100 });

      // Paso 6: Guardar proyecto
      updateStep('Guardando proyecto', { status: 'processing' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStep('Guardando proyecto', { status: 'completed', progress: 100 });

      // Llamada REAL al API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, duration }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      // Redirigir al editor
      router.push(`/editor/${data.videoId}`);

    } catch (error: any) {
      clearInterval(progressRef.current);
      setError(error.message);
      setLoading(false);
      setProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Generar Video con IA</h1>
        
        {!loading ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Describe tu video:</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Un video promocional para una startup de tecnología mostrando innovación y trabajo en equipo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Estilo:</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="corporativo">Corporativo</option>
                    <option value="creativo">Creativo</option>
                    <option value="minimalista">Minimalista</option>
                    <option value="dinamico">Dinámico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duración:</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="15">15 segundos</option>
                    <option value="30">30 segundos</option>
                    <option value="60">60 segundos</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                🎬 Generar Video (1 crédito)
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Header de Progreso */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Generando video...</span>
                <span className="text-sm text-gray-500">{formatTime(estimatedTime)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {Math.round(progress)}% completo
              </div>
            </div>

            {/* Lista de Pasos */}
            <div className="space-y-3">
              {generationSteps.map((step, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mr-3">
                    {step.status === 'completed' ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    ) : step.status === 'processing' ? (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{step.step}</div>
                    {step.details && (
                      <div className="text-sm text-gray-600">{step.details}</div>
                    )}
                    {step.progress !== undefined && step.status === 'processing' && (
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-400 h-1 rounded-full"
                          style={{ width: `${step.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Video Preview Simulado */}
            <div className="mt-6 p-4 bg-black rounded-lg">
              <div className="text-center text-white text-sm mb-2">VISTA PREVIA</div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-800 rounded aspect-video flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Escena {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}