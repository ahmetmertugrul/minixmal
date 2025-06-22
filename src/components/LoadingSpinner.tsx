import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Minixmal</h2>
        <p className="text-white/80">Preparing your minimalism journey...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;