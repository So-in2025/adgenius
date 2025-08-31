import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AdGenius - Genera Videos con IA',
  description: 'Crea anuncios profesionales en segundos con inteligencia artificial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}