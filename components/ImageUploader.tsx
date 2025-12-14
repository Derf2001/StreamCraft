import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  selectedImage: string | null;
  onImageSelect: (base64: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedImage, onImageSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        1. Imagen de Referencia
      </label>
      
      {!selectedImage ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-[#1f1f23] hover:bg-[#26262c] transition-colors hover:border-violet-500 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="bg-[#2d2d31] p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-violet-400" />
            </div>
            <p className="mb-2 text-sm text-gray-300">
              <span className="font-semibold">Click para subir</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG (Max. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative w-full h-64 bg-[#1f1f23] rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
          <img 
            src={selectedImage} 
            alt="Reference" 
            className="max-w-full max-h-full object-contain"
          />
          <button 
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Referencia
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;