'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
      // Aquí iría la llamada a tu API para obtener datos del usuario
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-4 text-gray-600">
            Bienvenido a tu panel de control de AdGenius
          </p>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">Funcionalidades</h2>
            <ul className="mt-4 space-y-2">
              <li>• Gestión de campañas publicitarias</li>
              <li>• Análisis de rendimiento</li>
              <li>• Generación de contenidos con IA</li>
              <li>• Reportes automáticos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';