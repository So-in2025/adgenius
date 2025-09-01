'use client';
import { useState } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  videoUrl: string;
}

export default function DownloadModal({ isOpen, onClose, onConfirm, videoUrl }: DownloadModalProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText('https://www.facebook.com/SolucionesSOIN');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">🎁 ¡Antes de descargar!</h2>
        
        <div className="text-center mb-4">
          <p className="text-gray-700 mb-2">
            Síguenos en Facebook para más herramientas gratuitas:
          </p>
          <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
            <p className="text-blue-800 font-medium">facebook.com/SolucionesSOIN</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={copyLink}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            {copied ? '✓ Copiado!' : 'Copiar Enlace'}
          </button>
          <a
            href="https://www.facebook.com/SolucionesSOIN"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center transition-colors"
          >
            Ir a Facebook
          </a>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            ✅ Ya seguí, descargar
          </button>
        </div>
      </div>
    </div>
  );
}