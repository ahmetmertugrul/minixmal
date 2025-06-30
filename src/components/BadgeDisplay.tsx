import React from 'react';
import { Badge } from '../types/scoring';
import { getRarityColor, getRarityGlow, getRarityGradient } from '../data/badges';
import * as LucideIcons from 'lucide-react';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  earned?: boolean;
  progress?: number;
  maxProgress?: number;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badge, 
  size = 'medium', 
  showDetails = true,
  earned = false,
  progress = 0,
  maxProgress = 1
}) => {
  const sizeClasses = {
    small: {
      container: 'w-20 h-24',
      icon: 'w-6 h-6',
      iconContainer: 'w-12 h-12',
      title: 'text-xs',
      description: 'text-xs',
      points: 'text-xs',
      rarity: 'text-xs'
    },
    medium: {
      container: 'w-24 h-28',
      icon: 'w-8 h-8',
      iconContainer: 'w-16 h-16',
      title: 'text-sm',
      description: 'text-xs',
      points: 'text-sm',
      rarity: 'text-xs'
    },
    large: {
      container: 'w-32 h-36',
      icon: 'w-10 h-10',
      iconContainer: 'w-20 h-20',
      title: 'text-base',
      description: 'text-sm',
      points: 'text-base',
      rarity: 'text-sm'
    }
  };

  const classes = sizeClasses[size];
  
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[badge.icon.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')] || LucideIcons.Star;

  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <div className={`relative ${classes.container} group`}>
      {/* Badge Container */}
      <div 
        className={`
          ${classes.container} 
          ${earned ? 'bg-white' : 'bg-gray-50'} 
          ${earned ? getRarityGlow(badge.rarity) : 'shadow-sm'}
          rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300
          ${earned ? 'hover:scale-105 border-transparent' : 'border-gray-200'}
          ${!earned ? 'opacity-60 grayscale' : ''}
          relative overflow-hidden
        `}
      >
        {/* Animated Background for Earned Badges */}
        {earned && (
          <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(badge.rarity)} opacity-10 animate-pulse`} />
        )}

        {/* Icon Container with Gradient Background */}
        <div className={`
          ${classes.iconContainer} 
          ${earned ? `bg-gradient-to-br ${getRarityGradient(badge.rarity)}` : 'bg-gray-300'}
          rounded-full flex items-center justify-center mb-2 relative z-10
          ${earned ? 'shadow-lg' : 'shadow-sm'}
          transition-all duration-300 group-hover:scale-110
        `}>
          <IconComponent className={`${classes.icon} ${earned ? 'text-white' : 'text-gray-500'}`} />
          
          {/* Sparkle Effect for Legendary Badges */}
          {earned && badge.rarity === 'legendary' && (
            <div className="absolute inset-0 rounded-full">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                  style={{
                    left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Badge Name */}
        <h4 className={`${classes.title} font-bold text-center leading-tight mb-1 ${
          earned ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {badge.name}
        </h4>
        
        {/* Points Reward */}
        <div className={`${classes.points} font-semibold text-center ${
          earned ? 'text-green-600' : 'text-gray-400'
        }`}>
          +{badge.points_reward}
        </div>

        {/* Rarity Badge */}
        <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded-full ${classes.rarity} font-bold ${
          earned ? getRarityColor(badge.rarity) : 'bg-gray-200 text-gray-500'
        }`}>
          {badge.rarity.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Progress Bar for Unearned Badges */}
      {!earned && progress > 0 && (
        <div className="absolute bottom-1 left-1 right-1">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            {progress}/{maxProgress}
          </div>
        </div>
      )}

      {/* Earned Indicator */}
      {earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <LucideIcons.Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
        {badge.description}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default BadgeDisplay;