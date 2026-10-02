export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          LocalWebScore
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400">
          Analiza, optimiza y domina el SEO local de cualquier negocio en segundos.
        </p>

        {/* Barra de Búsqueda */}
        <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mt-8">
          <input
            type="url"
            placeholder="https://lawebdemicliente.com"
            className="flex-1 px-5 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
          />
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            Escanear
          </button>
        </div>

      </div>
    </main>
  );
}