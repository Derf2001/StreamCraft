import React, { useRef, useState, useEffect } from 'react';
import { Download, Instagram, Twitter, MoveHorizontal } from 'lucide-react';

interface ResultViewProps {
  generatedImage: string | null;
  originalImage: string | null;
  isGenerating: boolean;
  mode: 'emote' | 'portrait' | 'remove-bg';
}

const ResultView: React.FC<ResultViewProps> = ({ generatedImage, originalImage, isGenerating, mode }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container size to ensure inner images are exactly the same size
  // avoiding the "squashing" effect when the clipping div resizes.
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [generatedImage, originalImage]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    let clientX;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const getAccentColor = () => {
    if (mode === 'emote') return 'text-violet-400 border-violet-400/30 bg-violet-400/10';
    if (mode === 'portrait') return 'text-pink-400 border-pink-400/30 bg-pink-400/10';
    return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
  };

  if (isGenerating) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#18181b] rounded-xl border border-[#2d2d31] p-8 animate-pulse">
        <div className={`bg-gray-700 rounded-full mb-4 opacity-50 ${mode === 'emote' ? 'w-32 h-32' : 'w-48 h-48'}`}></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3 opacity-50"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 opacity-50"></div>
        <p className={`mt-8 font-medium animate-bounce
          ${mode === 'emote' ? 'text-violet-400' : mode === 'portrait' ? 'text-pink-400' : 'text-cyan-400'}`}>
          {mode === 'emote' && 'La IA está dibujando tu emote...'}
          {mode === 'portrait' && 'La IA está creando tu retrato...'}
          {mode === 'remove-bg' && 'La IA está aislando el sujeto...'}
        </p>
      </div>
    );
  }

  if (!generatedImage) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#18181b] rounded-xl border border-[#2d2d31] p-8 text-center">
        <div className="bg-[#2d2d31] p-6 rounded-full mb-4">
          <span className="text-4xl">🎨</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Esperando tu obra maestra</h3>
        <p className="text-gray-400 max-w-sm">
          {mode === 'emote' && 'Sube una imagen y configura las opciones para ver tu emote aquí.'}
          {mode === 'portrait' && 'Sube una foto y elige un estilo para ver tu versión dibujo aquí.'}
          {mode === 'remove-bg' && 'Sube una imagen para extraer el sujeto y cambiar el fondo.'}
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `twitchmote-ai-${mode}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="bg-[#18181b] rounded-xl border border-[#2d2d31] p-6 flex flex-col items-center">
        <h3 className="text-white font-semibold mb-4 w-full text-left flex justify-between items-center">
          <span>Resultado Final</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline-block">
              Arrastra para comparar
            </span>
            <span className={`text-xs font-normal border px-2 py-1 rounded ${getAccentColor()}`}>
              Generado con Gemini
            </span>
          </div>
        </h3>
        
        <div className={`bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-[#25252b] p-4 rounded-lg shadow-2xl mb-6 
           ${mode === 'emote' ? '' : 'w-full max-w-md'}`}>
           
           {/* Comparison Slider Container */}
           <div 
             ref={containerRef}
             className={`relative overflow-hidden rounded cursor-col-resize group select-none
              ${mode === 'emote' ? 'w-64 h-64' : 'w-full aspect-square md:aspect-auto md:min-h-[300px]'}`}
             onMouseMove={handleMove}
             onTouchMove={handleMove}
             onMouseLeave={() => setSliderPosition(50)}
           >
              {/* After Image (Background Layer - Base) */}
              <img 
                src={generatedImage} 
                alt="After" 
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Before Image (Top Layer - Clipped) */}
              {originalImage && containerSize.width > 0 && (
                <div 
                  className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none z-10 border-r-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{ width: `${sliderPosition}%` }}
                >
                   {/* 
                     Key Fix: The inner image must be the exact size of the parent container 
                     to prevent "squishing" or "dragging" effect. It stays static while the 
                     parent div clips it.
                   */}
                   <div style={{ width: containerSize.width, height: containerSize.height, position: 'relative' }}>
                     <img 
                        src={originalImage} 
                        alt="Before" 
                        className="absolute top-0 left-0 w-full h-full object-contain"
                      />
                      {/* Overlay label "Original" */}
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        Original
                      </div>
                   </div>
                </div>
              )}

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-0 z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
                  <MoveHorizontal className="w-4 h-4 text-gray-800" />
                </div>
              </div>

              {/* Overlay label "Resultado" (only visible on right side) */}
              <div className="absolute top-2 right-2 bg-violet-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-0">
                Resultado
              </div>

           </div>
        </div>

        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors text-sm font-medium w-full md:w-auto justify-center"
        >
          <Download className="w-4 h-4" /> Descargar Imagen
        </button>
      </div>

      {/* Mode Specific Previews */}
      {mode === 'emote' ? (
        <div className="bg-[#18181b] rounded-xl border border-[#2d2d31] p-6">
          <h3 className="text-white font-semibold mb-4">Previsualización Twitch</h3>
          <div className="flex items-end justify-center gap-8 bg-[#0e0e10] p-6 rounded-lg border border-[#2d2d31]">
            <div className="flex flex-col items-center gap-2">
              <img src={generatedImage} className="w-[112px] h-[112px] object-contain" alt="112px" />
              <span className="text-xs text-gray-500">112px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={generatedImage} className="w-[56px] h-[56px] object-contain" alt="56px" />
              <span className="text-xs text-gray-500">56px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <img src={generatedImage} className="w-[28px] h-[28px] object-contain" alt="28px" />
              <span className="text-xs text-gray-500">28px</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#18181b] rounded-xl border border-[#2d2d31] p-6">
          <h3 className="text-white font-semibold mb-4">Listo para Compartir</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-lg flex items-center justify-center gap-2 text-white font-bold cursor-pointer hover:opacity-90">
                <Instagram className="w-5 h-5" /> Instagram
             </div>
             <div className="bg-black p-4 rounded-lg flex items-center justify-center gap-2 text-white font-bold border border-gray-700 cursor-pointer hover:bg-gray-900">
                <Twitter className="w-5 h-5" /> X / Twitter
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;