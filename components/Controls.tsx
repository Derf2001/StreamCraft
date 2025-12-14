import React from 'react';
import { EmoteStyle, EmoteEmotion } from '../types';
import { Wand2, Loader2 } from 'lucide-react';

interface ControlsProps {
  style: EmoteStyle;
  setStyle: (s: EmoteStyle) => void;
  emotion: EmoteEmotion;
  setEmotion: (e: EmoteEmotion) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  style,
  setStyle,
  emotion,
  setEmotion,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  disabled
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            2. Estilo Artístico
          </label>
          <select 
            value={style}
            onChange={(e) => setStyle(e.target.value as EmoteStyle)}
            className="w-full bg-[#1f1f23] border border-gray-700 text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-3"
          >
            {Object.values(EmoteStyle).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            3. Emoción
          </label>
          <select 
            value={emotion}
            onChange={(e) => setEmotion(e.target.value as EmoteEmotion)}
            className="w-full bg-[#1f1f23] border border-gray-700 text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-3"
          >
            {Object.values(EmoteEmotion).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          4. Detalles Adicionales (Opcional)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Haz que tenga ojos brillantes, añade fuego azul de fondo..."
          className="w-full bg-[#1f1f23] border border-gray-700 text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-3 min-h-[80px]"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`w-full py-4 px-6 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
          ${disabled || isGenerating 
            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creando Magia...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generar Emote
          </>
        )}
      </button>
    </div>
  );
};

export default Controls;