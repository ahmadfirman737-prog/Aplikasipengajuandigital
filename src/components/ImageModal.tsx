import React from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImageModalProps {
  src: string | null;
  title?: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, title, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-sm">
            <ZoomIn className="w-4 h-4 text-blue-600" />
            <span>{title || "Pratinjau Foto Barang"}</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden max-h-[70vh] p-2 border border-gray-100">
          <img 
            src={src} 
            alt="Foto Barang" 
            className="max-h-[65vh] w-auto object-contain rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
};
