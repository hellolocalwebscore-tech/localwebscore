"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!url) return;
    
    // Activamos el estado de carga
    setIsScanning(true);

    // Simulamos un retraso de 3 segundos como si estuviera escaneando
    setTimeout(() => {
      setIsScanning(false);
      alert(`Análisis completado para: ${url}`);
    }, 3000);
  };

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
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://lawebdemicliente.com"
            disabled={isScanning}
            className="flex-1 px-5 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleScan}
            disabled={isScanning || !url}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-[140px]"
          >
            {isScanning ? (
              <span className="animate-pulse">Escaneando...</span>
            ) : (
              "Escanear"
            )}
          </button>
        </div>

      </div>
    </main>
  );
}