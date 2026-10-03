"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scanData, setScanData] = useState<any>(null);

  const handleScan = async () => {
    if (!url) return;
    
    setIsScanning(true);
    setShowResults(false); 
    setScanData(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      setScanData(data);
      setShowResults(true);
    } catch (error) {
      alert("Hubo un problema al analizar la web.");
    } finally {
      setIsScanning(false);
    }
  };

  const exportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    const btn = document.getElementById('pdf-btn');
    if(btn) btn.innerText = "Generando documento...";

    try {
      // Importamos la versión PRO que sí soporta colores modernos
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: '#1f2937' 
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      pdf.save(`Auditoria-SEO-${cleanUrl}.pdf`);

    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF.");
    } finally {
      if(btn) btn.innerText = "Descargar Informe PDF (Función Pro)";
    }
  };

  const calculateScore = () => {
    if (!scanData) return 0;
    let score = 0;
    if (scanData.title) score += 35;
    if (scanData.description) score += 35;
    if (scanData.h1) score += 30;
    return score;
  };

  const score = calculateScore();

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-20 px-6">
      <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
          LocalWebScore
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl">
          Auditorías SEO en segundos. La herramienta definitiva para agencias y freelancers.
        </p>

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
              <span className="animate-pulse">Analizando...</span>
            ) : (
              "Escanear"
            )}
          </button>
        </div>

        {showResults && scanData && (
          <div className="w-full mt-12 animate-fade-in flex flex-col items-center">
            
            <div id="report-content" className="w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <div className="mb-8 border-b border-gray-700 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Auditoría SEO Local</h2>
                  <p className="text-blue-400 mt-1">{url}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-gray-500 text-sm italic">Generado por LocalWebScore</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Puntuación SEO</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {score}
                    </span>
                    <span className="text-xl text-gray-500">/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Tiempo Respuesta</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${Number(scanData.loadTime) < 1.0 ? 'text-green-400' : Number(scanData.loadTime) < 2.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {scanData.loadTime || "0.00"}
                    </span>
                    <span className="text-xl text-gray-500">s</span>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Estado General</span>
                  <span className={`text-2xl font-bold mt-2 ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {score > 70 ? 'Óptimo' : score > 40 ? 'Mejorable' : 'Crítico'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 text-left">
                <h3 className="text-xl font-bold text-white mb-4">Desglose Técnico</h3>
                <ul className="space-y-3">
                  <li className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${scanData.title ? 'bg-gray-800 border-gray-700' : 'bg-red-900/20 border-red-900/50'}`}>
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <span className={scanData.title ? "text-green-400 text-xl" : "text-red-400 text-xl"}>
                        {scanData.title ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-200 font-medium">Etiqueta Title</span>
                    </div>
                    <span className={scanData.title ? "text-gray-400 text-sm" : "text-red-400/80 text-sm"}>
                      {scanData.title ? `Encontrada (${scanData.title.length} caract.)` : "Falta la etiqueta"}
                    </span>
                  </li>

                  <li className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${scanData.description ? 'bg-gray-800 border-gray-700' : 'bg-red-900/20 border-red-900/50'}`}>
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <span className={scanData.description ? "text-green-400 text-xl" : "text-red-400 text-xl"}>
                        {scanData.description ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-200 font-medium">Meta Descripción</span>
                    </div>
                    <span className={scanData.description ? "text-gray-400 text-sm" : "text-red-400/80 text-sm"}>
                      {scanData.description ? `Encontrada (${scanData.description.length} caract.)` : "Falta la etiqueta"}
                    </span>
                  </li>

                  <li className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${scanData.h1 ? 'bg-gray-800 border-gray-700' : 'bg-red-900/20 border-red-900/50'}`}>
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <span className={scanData.h1 ? "text-green-400 text-xl" : "text-red-400 text-xl"}>
                        {scanData.h1 ? "✓" : "✗"}
                      </span>
                      <span className="text-gray-200 font-medium">Encabezado H1</span>
                    </div>
                    <span className={scanData.h1 ? "text-gray-400 text-sm" : "text-red-400/80 text-sm"}>
                      {scanData.h1 ? `Encontrado (${scanData.h1.length} caract.)` : "Falta la etiqueta"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 w-full max-w-2xl">
              <div className="p-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800 rounded-xl flex flex-col items-center text-center gap-4 shadow-lg shadow-blue-900/20">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <span className="text-yellow-400">⚡</span> Pásate a LocalWebScore PRO
                  </h4>
                  <p className="text-gray-300 text-sm mt-2">
                    Descarga esta auditoría en un PDF profesional para enviárselo a tus clientes y cerrar más ventas.
                  </p>
                </div>
                <button 
                  id="pdf-btn"
                  onClick={exportPDF}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-colors shadow-lg w-full sm:w-auto"
                >
                  Descargar Informe PDF (Función Pro)
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}