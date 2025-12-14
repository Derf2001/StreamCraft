import React from 'react';
import { BackgroundOption } from '../types';
import { Layers, Loader2, Eraser } from 'lucide-react';

interface RemoveBgControlsProps {
  background: BackgroundOption;
  setBackground: (s: BackgroundOption) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const RemoveBgControls: React.FC<RemoveBgControlsProps> = ({
  background,
  setBackground,
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
          <Layers className="w-4 h-4 text-cyan-400" />
          2. Elige el Nuevo Fondo
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(BackgroundOption).map((bg) => (
            <button
              key={bg}
              onClick={() => setBackground(bg)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center gap-2
                ${background === bg 
                  ? 'bg-cyan-600/20 border-cyan-500 text-white ring-1 ring-cyan-500' 
                  : 'bg-[#1f1f23] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }
              `}
            >
              <div className={`w-3 h-3 rounded-full border border-gray-500 ${
                bg.includes('Blanco') ? 'bg-white' : 
                bg.includes('Negro') ? 'bg-black' : 
                bg.includes('Verde') ? 'bg-green-500' : 
                bg.includes('Transparente') ? 'bg-gray-400 bg-opacity-25' : // approximate transparent
                'bg-cyan-500'
              }`} />
              {bg}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          3. Ajustes Manuales (Opcional)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Asegúrate de incluir mi sombrero, haz que la iluminación sea más oscura..."
          className="w-full bg-[#1f1f23] border border-gray-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-3 min-h-[80px]"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`w-full py-4 px-6 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
          ${disabled || isGenerating 
            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando Fondo...
          </>
        ) : (
          <>
            <Eraser className="w-5 h-5" />
            Cambiar Fondo / Aislar
          </>
        )}
      </button>
      
      <p className="text-xs text-center text-gray-500 mt-2">
        Nota: La IA regenerará el sujeto sobre el nuevo fondo. Puede haber ligeras variaciones.
      </p>
    </div>
  );
};

export default RemoveBgControls;