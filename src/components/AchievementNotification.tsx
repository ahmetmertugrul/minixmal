import React, { useEffect, useState } from 'react';
import { X, Award, Star, Trophy, Crown } from 'lucide-react';
import { Badge } from '../types/scoring';
import { getRarityColor } from '../data/badges';
import * as LucideIcons from 'lucide-react';

interface AchievementNotificationProps {
  badge: Badge;
  points: number;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  badge,
  points,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[badge.icon.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')] || LucideIcons.Star;

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'epic': return <Trophy className="w-6 h-6 text-purple-500" />;
      case 'rare': return <Award className="w-6 h-6 text-blue-500" />;
      default: return <Star className="w-6 h-6 text-green-500" />;
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 via-pink-500 to-red-500';
      case 'rare': return 'from-blue-400 via-purple-500 to-pink-500';
      default: return 'from-green-400 via-blue-500 to-purple-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Notification */}
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(badge.rarity)} opacity-10 animate-pulse`} />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {getRarityIcon(badge.rarity)}
              <h2 className="text-2xl font-bold text-gray-900">Achievement Unlocked!</h2>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRarityColor(badge.rarity)}`}>
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)} Badge
            </div>
          </div>

          {/* Badge Display */}
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${getRarityGradient(badge.rarity)} rounded-full flex items-center justify-center shadow-2xl animate-bounce`}>
              <IconComponent className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
            <p className="text-gray-600 mb-4">{badge.description}</p>
          </div>

          {/* Points Reward */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-6 h-6" />
              <span className="text-2xl font-bold">+{points} Points</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            Awesome!
          </button>
        </div>

        {/* Confetti Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${getRarityGradient(badge.rarity)} rounded-full animate-ping`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;