import React from 'react';
import { Crown, Star, ArrowRight, X } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description: string;
  onUpgrade: () => void;
  onClose: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  description,
  onUpgrade,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
            <p className="text-purple-100">
              Unlock the full Minixmal experience
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature}</h3>
            <p className="text-gray-600">{description}</p>
          </div>

          {/* Pro Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">All 70+ minimalism tasks</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">All 50+ learning articles</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">AI Room Designer</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Unlimited room transformations</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Advanced analytics</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 mb-6">
            <div className="text-center">
              <div className="flex items-baseline justify-center space-x-1 mb-2">
                <span className="text-3xl font-bold text-gray-900">$9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">
                Or save with yearly: $99.99/year
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-600 py-2 px-6 rounded-2xl font-medium hover:bg-gray-100 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;