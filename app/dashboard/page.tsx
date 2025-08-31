'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

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

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState({
    title: '',
    prompt: '',
    style: 'professional',
    duration: '30'
  })
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('create')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado - obtener datos de Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() })
        } else {
          router.push('/login')
        }
      } else {
        // No autenticado - redirigir a login
        router.push('/login')
      }
    })

    // Cargar proyectos desde localStorage
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }

    return () => unsubscribe()
  }, [router])

  const generateScript = async () => {
    if (!user || user.credits <= 0) {
      alert('No tienes créditos disponibles. Regístrate para obtener 3 créditos gratis.')
      return
    }
    
    if (!currentProject.prompt.trim()) {
      alert('Por favor, describe tu anuncio primero.')
      return
    }
    
    setGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProject)
      })

      const data = await response.json()
      
      if (data.success) {
        const newProject: Project = {
          id: Date.now().toString(),
          title: currentProject.title || `Proyecto ${projects.length + 1}`,
          prompt: currentProject.prompt,
          script: data.script,
          videoUrl: data.videoUrl,
          thumbnail: data.thumbnail,
          style: currentProject.style,
          duration: currentProject.duration,
          createdAt: new Date().toISOString(),
          status: 'completed'
        }

        const updatedProjects = [newProject, ...projects]
        setProjects(updatedProjects)
        localStorage.setItem('projects', JSON.stringify(updatedProjects))

        // Restar crédito en Firebase
        if (auth.currentUser) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            credits: user.credits - 1
          })
          setUser({ ...user, credits: user.credits - 1 })
        }

        setCurrentProject({
          title: '',
          prompt: '',
          style: 'professional',
          duration: '30'
        })
        
        alert('¡Guion generado exitosamente! Revisa la pestaña "Mis Proyectos".')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el guion. Intenta nuevamente.')
    }
    
    setGenerating(false)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('projects')
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Hola, {user.name} 👋</h1>
              <p className="text-gray-600 text-sm">Crea anuncios increíbles con IA</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {user.credits} créditos restantes
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="tabs flex space-x-4 mb-8">
          <button 
            className={`tab ${activeTab === 'create' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            🎬 Crear Nuevo
          </button>
          <button 
            className={`tab ${activeTab === 'projects' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            📁 Mis Proyectos ({projects.length})
          </button>
        </div>

        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Generar Nuevo Anuncio</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Título del proyecto</label>
                <input
                  type="text"
                  placeholder="Ej: Anuncio Restaurant Italiano"
                  value={currentProject.title}
                  onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estilo del video</label>
                <select
                  value={currentProject.style}
                  onChange={(e) => setCurrentProject({...currentProject, style: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="professional">🎯 Profesional</option>
                  <option value="casual">😊 Casual</option>
                  <option value="emotional">❤️ Emocional</option>
                  <option value="modern">🚀 Moderno</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Descripción del anuncio *</label>
                <textarea
                  placeholder="Describe tu producto o servicio... Ej: 'Anuncio para redes sociales de un restaurante italiano elegante'"
                  value={currentProject.prompt}
                  onChange={(e) => setCurrentProject({...currentProject, prompt: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duración (segundos)</label>
                <input
                  type="number"
                  value={currentProject.duration}
                  onChange={(e) => setCurrentProject({...currentProject, duration: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="15"
                  max="60"
                />
              </div>
            </div>

            <button
              onClick={generateScript}
              disabled={generating || user.credits <= 0 || !currentProject.prompt.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generando...' : `✨ Generar Guion (${user.credits} créditos)`}
            </button>

            {user.credits === 0 && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
                <p className="text-yellow-800">¡No tienes créditos disponibles! Actualiza tu plan.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mis Proyectos</h2>
              <span className="text-gray-600">{projects.length} proyectos</span>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold mb-2">No hay proyectos aún</h3>
                <p className="text-gray-600">Crea tu primer anuncio para verlo aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48 bg-gray-200">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => window.open(project.videoUrl, '_blank')}
                          className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold"
                        >
                          ▶️ Ver Video
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {project.style}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {new Date(project.createdAt).toLocaleDateString('es-ES')}
                      </p>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {project.script.substring(0, 100)}...
                      </p>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm">
                          📋 Copiar Guion
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm">
                          🎬 Renderizar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}