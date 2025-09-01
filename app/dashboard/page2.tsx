'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirección manejada por el useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="glass-card p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Bienvenido de vuelta, {user.name} 👋
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Videos Creados', value: '12', change: '+3' },
            { title: 'Creditos Restantes', value: '8', change: '-4' },
            { title: 'Tasa de Conversión', value: '24%', change: '+8%' }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-green-600 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Generator */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Video</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Describe tu video..."
                className="input-field"
              />
              <select className="input-field">
                <option>Estilo Corporativo</option>
                <option>Estilo Creativo</option>
                <option>Estilo Minimalista</option>
              </select>
              <button className="btn-primary w-full">
                Generar Video
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Proyectos Recientes</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Video Corporativo #{item}</h4>
                    <p className="text-sm text-gray-500">Hace {item} hora{item > 1 ? 's' : ''}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completado
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn-secondary">Ver Analytics</button>
            <button className="btn-secondary">Descargar Reporte</button>
            <button className="btn-secondary">Compartir Proyecto</button>
            <button className="btn-primary">Crear Nuevo</button>
          </div>
        </div>
      </div>
    </div>
  );
}