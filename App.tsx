import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import PortraitControls from './components/PortraitControls';
import RemoveBgControls from './components/RemoveBgControls';
import ResultView from './components/ResultView';
import { EmoteStyle, EmoteEmotion, PortraitStyle, BackgroundOption } from './types';
import { generateEmote, generatePortrait, removeBackground } from './services/geminiService';
import { AlertCircle, Smile, Image as ImageIcon, Scissors } from 'lucide-react';

type AppMode = 'emote' | 'portrait' | 'remove-bg';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('emote');
  
  // Shared State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Emote Mode State
  const [emoteStyle, setEmoteStyle] = useState<EmoteStyle>(EmoteStyle.CARTOON);
  const [emoteEmotion, setEmoteEmotion] = useState<EmoteEmotion>(EmoteEmotion.HYPE);
  const [emotePrompt, setEmotePrompt] = useState<string>('');

  // Portrait Mode State
  const [portraitStyle, setPortraitStyle] = useState<PortraitStyle>(PortraitStyle.DISNEY_3D);
  const [portraitPrompt, setPortraitPrompt] = useState<string>('');

  // Remove Bg Mode State
  const [bgOption, setBgOption] = useState<BackgroundOption>(BackgroundOption.TRANSPARENT);
  const [bgPrompt, setBgPrompt] = useState<string>('');

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let result;
      if (mode === 'emote') {
        result = await generateEmote({
          imageBase64: selectedImage,
          style: emoteStyle,
          emotion: emoteEmotion,
          prompt: emotePrompt
        });
      } else if (mode === 'portrait') {
        result = await generatePortrait({
          imageBase64: selectedImage,
          style: portraitStyle,
          prompt: portraitPrompt
        });
      } else {
        result = await removeBackground({
          imageBase64: selectedImage,
          background: bgOption,
          prompt: bgPrompt
        });
      }
      setGeneratedImage(result);
    } catch (err) {
      setError('Hubo un error generando tu imagen. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-[#efeff1] font-sans selection:bg-violet-500 selection:text-white">
      <Header />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-[#1f1f23] p-1 rounded-xl border border-[#2d2d31] inline-flex whitespace-nowrap">
            <button
              onClick={() => { setMode('emote'); setGeneratedImage(null); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all
                ${mode === 'emote' 
                  ? 'bg-violet-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2d2d31]'
                }`}
            >
              <Smile className="w-4 h-4" />
              Generador Emotes
            </button>
            <button
              onClick={() => { setMode('portrait'); setGeneratedImage(null); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all
                ${mode === 'portrait' 
                  ? 'bg-pink-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2d2d31]'
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              Tu Versión Dibujo
            </button>
            <button
              onClick={() => { setMode('remove-bg'); setGeneratedImage(null); setError(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all
                ${mode === 'remove-bg' 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2d2d31]'
                }`}
            >
              <Scissors className="w-4 h-4" />
              Quitar Fondo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#18181b] rounded-xl border border-[#2d2d31] p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                  ${mode === 'emote' ? 'bg-violet-600' : mode === 'portrait' ? 'bg-pink-600' : 'bg-cyan-600'}`}>
                  1
                </span>
                Configuración
              </h2>
              
              <div className="space-y-8">
                <ImageUploader 
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />
                
                <div className="h-px bg-[#2d2d31]" />

                {mode === 'emote' && (
                  <Controls 
                    style={emoteStyle}
                    setStyle={setEmoteStyle}
                    emotion={emoteEmotion}
                    setEmotion={setEmoteEmotion}
                    prompt={emotePrompt}
                    setPrompt={setEmotePrompt}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    disabled={!selectedImage}
                  />
                )}
                
                {mode === 'portrait' && (
                  <PortraitControls
                    style={portraitStyle}
                    setStyle={setPortraitStyle}
                    prompt={portraitPrompt}
                    setPrompt={setPortraitPrompt}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    disabled={!selectedImage}
                  />
                )}

                {mode === 'remove-bg' && (
                  <RemoveBgControls
                    background={bgOption}
                    setBackground={setBgOption}
                    prompt={bgPrompt}
                    setPrompt={setBgPrompt}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    disabled={!selectedImage}
                  />
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
            
            <div className={`border rounded-xl p-6
              ${mode === 'emote' ? 'bg-violet-900/20 border-violet-500/20' : 
                mode === 'portrait' ? 'bg-pink-900/20 border-pink-500/20' : 
                'bg-cyan-900/20 border-cyan-500/20'}`}>
              <h4 className={`font-bold mb-2
                ${mode === 'emote' ? 'text-violet-300' : 
                  mode === 'portrait' ? 'text-pink-300' : 
                  'text-cyan-300'}`}>
                💡 Pro Tip
              </h4>
              <p className="text-sm text-gray-400">
                {mode === 'emote' && "Para emotes pequeños, usa expresiones exageradas y colores brillantes."}
                {mode === 'portrait' && "Para la versión dibujo, asegúrate de que tu cara se vea clara en la foto original para que la IA capte tus rasgos."}
                {mode === 'remove-bg' && "Si eliges 'Chroma Key', usa un software externo para volver el verde transparente fácilmente."}
              </p>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
             <ResultView 
               generatedImage={generatedImage} 
               originalImage={selectedImage}
               isGenerating={isGenerating}
               mode={mode}
             />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;