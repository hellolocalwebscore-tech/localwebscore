"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleScan = () => {
    if (!url) return;
    
    setIsScanning(true);
    setShowResults(false); 

    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true); 
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-20 px-6">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
          LocalWebScore
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl">
          Analiza, optimiza y domina el SEO local de cualquier negocio en segundos.
        </p>

        {/* Barra de Búsqueda */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 mt-8">
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

        {/* Panel de Resultados */}
        {showResults && (
          <div className="w-full mt-12 bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl animate-fade-in">
            <div className="mb-8 border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-bold text-white">Resultados del análisis</h2>
              <p className="text-blue-400 mt-1">{url}</p>
            </div>
            
            {/* Tarjetas Superiores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center transition-transform hover:scale-105">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Puntuación SEO</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-green-400">85</span>
                  <span className="text-xl text-gray-500">/100</span>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center transition-transform hover:scale-105">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Velocidad</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-yellow-400">1.2</span>
                  <span className="text-xl text-gray-500">s</span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center transition-transform hover:scale-105">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Estado General</span>
                <span className="text-2xl font-bold text-blue-400 mt-2">Óptimo</span>
              </div>
            </div>

            {/* Checklist de Análisis Detallado */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-left">
              <h3 className="text-xl font-bold text-white mb-4">Desglose Técnico</h3>
              <ul className="space-y-3">
                <li className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-200 font-medium">Etiqueta Title</span>
                  </div>
                  <span className="text-gray-400 text-sm text-left sm:text-right">Correcta (55 caracteres)</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 rounded-lg border border-red-900/50">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <span className="text-red-400 text-xl">✗</span>
                    <span className="text-gray-200 font-medium">Meta Descripción</span>
                  </div>
                  <span className="text-red-400/80 text-sm text-left sm:text-right">Falta la etiqueta</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <span className="text-green-400 text-xl">✓</span>
                    <span className="text-gray-200 font-medium">Encabezado H1</span>
                  </div>
                  <span className="text-gray-400 text-sm text-left sm:text-right">1 encontrado</span>
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}