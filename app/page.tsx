import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass fixed w-full top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gradient">
              AdGenius
            </div>
            <nav className="flex space-x-6">
              <Link href="/login" className="text-text-secondary hover:text-text-primary transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="btn-primary">
                Comenzar Gratis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section pt-32">
        <div className="container text-center">
          <h1 className="heading-1 mb-6 animate-fade-in">
            Genera Videos con IA en 
            <span className="text-gradient"> Segundos</span>
          </h1>
          <p className="text-body mb-8 max-w-2xl mx-auto">
            Crea anuncios profesionales sin experiencia técnica. 
            Plataforma todo-en-uno para negocios que quieren crecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Comenzar Gratis - 3 Días
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-4">
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container">
          <h2 className="heading-2 text-center mb-16">Por Qué Elegirnos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Generación Instantánea',
                description: 'Crea videos profesionales en menos de 60 segundos con nuestra IA avanzada.'
              },
              {
                icon: '🎯',
                title: 'Alta Conversión',
                description: 'Anuncios optimizados que generan resultados reales para tu negocio.'
              },
              {
                icon: '💸',
                title: 'Ahorro Garantizado',
                description: 'Reduce costos de agencias hasta un 70% sin sacrificar calidad.'
              }
            ].map((feature, index) => (
              <div key={index} className="card text-center hover-lift">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="heading-3 mb-4">{feature.title}</h3>
                <p className="text-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container text-center">
          <h2 className="heading-2 mb-6">Comienza Hoy Mismo</h2>
          <p className="text-body mb-8 opacity-90">
            3 generaciones gratis - Sin tarjeta de crédito requerida
          </p>
          <Link href="/register" className="btn-primary bg-white text-blue-600 text-lg px-8 py-4 hover:bg-gray-100">
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-border">
        <div className="container text-center">
          <p className="text-text-secondary">
            © 2024 AdGenius. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}