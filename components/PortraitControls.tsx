import React from 'react';
import { PortraitStyle } from '../types';
import { Palette, Loader2, Sparkles } from 'lucide-react';

interface PortraitControlsProps {
  style: PortraitStyle;
  setStyle: (s: PortraitStyle) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const PortraitControls: React.FC<PortraitControlsProps> = ({
  style,
  setStyle,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  disabled
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4 text-violet-400" />
          2. Elige tu Estilo de Dibujo
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(PortraitStyle).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center gap-2
                ${style === s 
                  ? 'bg-violet-600/20 border-violet-500 text-white ring-1 ring-violet-500' 
                  : 'bg-[#1f1f23] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }
              `}
            >
              <div className={`w-3 h-3 rounded-full ${style === s ? 'bg-violet-500' : 'bg-gray-600'}`} />
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          3. Detalles Extra (Opcional)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Ponme gafas futuristas, haz que el fondo sea una ciudad, hazme parecer un superhéroe..."
          className="w-full bg-[#1f1f23] border border-gray-700 text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-3 min-h-[80px]"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`w-full py-4 px-6 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
          ${disabled || isGenerating 
            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
            : 'bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Dibujando Retrato...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generar Mi Versión Dibujo
          </>
        )}
      </button>
    </div>
  );
};

export default PortraitControls;