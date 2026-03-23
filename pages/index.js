import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, X, ChevronRight, AlertCircle, HardHat, Lightbulb, Wallet } from 'lucide-react';

// --- COMPONENTES AUXILIARES (TODO EN UN SOLO ARCHIVO) ---

const StyleCard = ({ id, label, selected, onSelect }) => (
  <div 
    onClick={() => onSelect(id)}
    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
      selected === id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
    }`}
  >
    <p className="text-center font-bold text-sm">{label}</p>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function DesignStudio() {
  const [step, setStep] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [sketchPreview, setSketchPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSketchPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulación de carga para Vercel
    setTimeout(() => {
      setResults({
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
        costs: { total: 12500, detail: "Mobiliario: $5k, Revestimientos: $4k, Iluminación: $3.5k" },
        tips: "Priorizar la ventilación cruzada y el uso de materiales nobles como madera de petiribí."
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black tracking-tighter mb-2">STUDIO <span className="text-orange-500 italic">iB</span></h1>
          <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-bold">Arquitectura e Inteligencia Artificial</p>
        </header>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">Tipo de Ambiente</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
                  value={roomType} 
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="living">Living / Estar</option>
                  <option value="cocina">Cocina Comedor</option>
                  <option value="dormitorio">Dormitorio Principal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">Inversión Estimada</label>
                <select 
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl focus:border-orange-500 outline-none"
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Rango de presupuesto...</option>
                  <option value="eco">Económico (Reciclado)</option>
                  <option value="std">Estándar (Obra seca)</option>
                  <option value="premium">Premium (Alta gama)</option>
                </select>
              </div>

              <div className="p-10 border-2 border-dashed border-zinc-800 rounded-[32px] text-center hover:border-orange-500/50 transition-colors">
                {!sketchPreview ? (
                  <label className="cursor-pointer">
                    <Upload className="mx-auto mb-4 text-orange-500" />
                    <p className="text-sm font-bold">Subir plano o foto del estado actual</p>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                ) : (
                  <div className="relative inline-block">
                    <img src={sketchPreview} className="h-32 rounded-xl" alt="Preview" />
                    <button onClick={() => setSketchPreview(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"><X size={12}/></button>
                  </div>
                )}
              </div>

              <ButtonPrimary onClick={() => setStep(1)} disabled={!roomType || !budget}>Siguiente Paso</ButtonPrimary>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold italic">Seleccioná una estética:</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Moderno', 'Industrial', 'Nórdico', 'Minimalista'].map(s => (
                  <StyleCard key={s} label={s} id={s} selected={style} onSelect={setStyle} />
                ))}
              </div>
              <ButtonPrimary onClick={handleGenerate} disabled={!style || isGenerating}>
                {isGenerating ? "Generando propuesta..." : "Generar Diseño IA"}
              </ButtonPrimary>
            </motion.div>
          )}
        </AnimatePresence>

        {results && (
          <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="mt-12 space-y-8 pb-20">
            <div className="rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl">
              <img src={results.image} alt="Render" className="w-full object-cover" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-900 rounded-[32px]">
                <div className="flex items-center gap-2 mb-2 text-orange-500">
                  <Wallet size={18} />
                  <h3 className="font-bold text-sm uppercase">Presupuesto</h3>
                </div>
                <p className="text-2xl font-black italic">${results.costs.total} USD</p>
                <p className="text-xs text-zinc-500 mt-2">{results.costs.detail}</p>
              </div>
              <div className="p-6 bg-zinc-900 rounded-[32px]">
                <div className="flex items-center gap-2 mb-2 text-orange-500">
                  <Lightbulb size={18} />
                  <h3 className="font-bold text-sm uppercase">Tips FADU</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">{results.tips}</p>
              </div>
            </div>

            <a 
              href="https://www.instagram.com/ib.arquitectura_" 
              className="block w-full p-6 bg-white text-black text-center rounded-[32px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all"
            >
              Contactar a @ib.arquitectura_
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ButtonPrimary({ children, onClick, disabled }) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className="w-full h-16 bg-white text-black rounded-full font-black text-lg hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 disabled:grayscale"
    >
      {children}
    </button>
  );
}
