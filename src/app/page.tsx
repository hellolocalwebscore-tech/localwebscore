"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isWidget, setIsWidget] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("widget") === "true") {
        setIsWidget(true);
      }
      if (urlParams.get("success") === "true") {
        setIsSubscribed(true);
      }
    }
  }, []);

  const handleScan = async () => {
    if (!url) return;
    setIsScanning(true);
    setShowResults(false); 
    setScanData(null);
    setHasUnlocked(false);

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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setShowLeadForm(false);
    setHasUnlocked(true);
    setTimeout(() => exportPDF(), 500);
  };

  const exportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    const btn = document.getElementById('pdf-btn');
    if(btn) btn.innerText = "Generando documento...";
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#1f2937' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'auditoria';
      pdf.save(`Auditoria-SEO-${cleanUrl}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Error al generar el PDF.");
    } finally {
      if(btn) btn.innerText = "Volver a descargar PDF";
    }
  };

  // Función para suscribir a la agencia
  const handleSubscription = async () => {
    setIsRedirecting(true);
    try {
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Error al conectar con la pasarela.");
      setIsRedirecting(false);
    }
  };

  const score = scanData ? (scanData.title ? 35 : 0) + (scanData.description ? 35 : 0) + (scanData.h1 ? 30 : 0) : 0;

  return (
    <main className={`min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 ${isWidget ? 'py-10' : 'py-20'}`}>
      <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
        
        {/* Cabecera para Agencias (Solo visible si NO es widget) */}
        {!isWidget && (
          <div className="flex flex-col items-center w-full">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
              LocalWebScore
            </h1>
            <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mt-4">
              El generador de auditorías SEO marca blanca para agencias. Consigue más clientes en piloto automático.
            </p>
            
            {!isSubscribed ? (
              <button 
                onClick={handleSubscription}
                disabled={isRedirecting}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-full shadow-lg shadow-green-900/50 transition-all transform hover:scale-105"
              >
                {isRedirecting ? "Cargando Stripe..." : "Obtener Widget para mi Agencia (19€/mes)"}
              </button>
            ) : (
              <div className="mt-8 bg-green-900/40 border border-green-500 p-6 rounded-xl flex flex-col items-center gap-4 w-full max-w-2xl animate-fade-in">
                <span className="font-bold text-green-400 text-xl">✅ ¡Suscripción Activa!</span>
                <p className="text-gray-300 text-center text-sm">Copia este código y pégalo en tu web para empezar a captar clientes:</p>
                <code className="bg-black/60 p-4 rounded-lg text-sm text-cyan-300 select-all w-full text-center break-all border border-gray-700 shadow-inner">
                  {`<iframe src="https://localwebscore.vercel.app/?widget=true" width="100%" height="800px" frameborder="0" style="border-radius:12px;"></iframe>`}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Buscador de URLs */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4 mt-8">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://lawebdemicliente.com"
            disabled={isScanning}
            className="flex-1 px-5 py-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleScan}
            disabled={isScanning || !url}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-gray-400 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/20 min-w-[140px]"
          >
            {isScanning ? <span className="animate-pulse">Analizando...</span> : "Escanear"}
          </button>
        </div>

        {/* Resultados del Escáner */}
        {showResults && scanData && (
          <div className="w-full mt-8 animate-fade-in flex flex-col items-center">
            <div id="report-content" className="w-full bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl relative overflow-hidden">
              <div className="mb-8 border-b border-gray-700 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Auditoría SEO Local</h2>
                  <p className="text-blue-400 mt-1">{url}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Puntuación SEO</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${score > 70 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>{score}</span>
                    <span className="text-xl text-gray-500">/100</span>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 flex flex-col items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Tiempo Respuesta</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${Number(scanData.loadTime) < 1.0 ? 'text-green-400' : Number(scanData.loadTime) < 2.5 ? 'text-yellow-400' : 'text-red-400'}`}>{scanData.loadTime || "0.00"}</span>
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

              <div className={`transition-all duration-500 ${!hasUnlocked ? 'blur-sm opacity-50 select-none' : ''}`}>
                <h3 className="text-xl font-bold text-white mb-4">Desglose Técnico</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between p-4 rounded-lg border bg-gray-800 border-gray-700">
                    <span className="text-gray-200">Etiqueta Title</span>
                    <span className="text-gray-400">{scanData.title ? "Encontrada" : "Falta"}</span>
                  </li>
                  <li className="flex justify-between p-4 rounded-lg border bg-gray-800 border-gray-700">
                    <span className="text-gray-200">Meta Descripción</span>
                    <span className="text-gray-400">{scanData.description ? "Encontrada" : "Falta"}</span>
                  </li>
                  <li className="flex justify-between p-4 rounded-lg border bg-gray-800 border-gray-700">
                    <span className="text-gray-200">Encabezados H1</span>
                    <span className="text-gray-400">{scanData.h1 ? "Encontrada" : "Falta"}</span>
                  </li>
                </ul>
              </div>

              {!hasUnlocked && (
                <div className="absolute inset-0 top-48 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent flex flex-col items-center justify-end pb-12 px-6">
                  <h4 className="text-2xl font-bold text-white mb-2 text-center">Desbloquea el informe completo</h4>
                  <p className="text-gray-300 text-center mb-6 max-w-md">Introduce tus datos para descargar la auditoría detallada en PDF.</p>
                  <button 
                    onClick={() => setShowLeadForm(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50"
                  >
                    Obtener Auditoría Gratuita
                  </button>
                </div>
              )}
            </div>

            {hasUnlocked && (
              <div className="mt-8">
                <button 
                  id="pdf-btn"
                  onClick={exportPDF}
                  className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-900/50"
                >
                  Volver a descargar PDF
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showLeadForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">¿A dónde te lo enviamos?</h3>
              <button onClick={() => setShowLeadForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                <input 
                  type="text" required
                  value={leadData.name} onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Correo electrónico</label>
                <input 
                  type="email" required
                  value={leadData.email} onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full mt-4 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? "Desbloqueando..." : "Desbloquear PDF"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}