import React from 'react';
import { Sparkles, Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#18181b] border-b border-[#2d2d31] p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-violet-600 p-2 rounded-lg">
            <Palette className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            StreamCraft AI
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Potenciado por Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};

export default Header;