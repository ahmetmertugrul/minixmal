import React from 'react';
import { Badge } from '../types/scoring';
import { getRarityColor, getRarityGlow } from '../data/badges';
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
      container: 'w-16 h-20',
      icon: 'w-6 h-6',
      title: 'text-xs',
      description: 'text-xs',
      points: 'text-xs'
    },
    medium: {
      container: 'w-20 h-24',
      icon: 'w-8 h-8',
      title: 'text-sm',
      description: 'text-xs',
      points: 'text-sm'
    },
    large: {
      container: 'w-24 h-28',
      icon: 'w-10 h-10',
      title: 'text-base',
      description: 'text-sm',
      points: 'text-base'
    }
  };

  const classes = sizeClasses[size];
  
  // Get the icon component dynamically
  const IconComponent = (LucideIcons as any)[badge.icon.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')] || LucideIcons.Star;

  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  return (
    <div className={`relative ${classes.container}`}>
      {/* Badge Container */}
      <div 
        className={`
          ${classes.container} 
          ${earned ? 'bg-white' : 'bg-gray-100'} 
          ${earned ? getRarityColor(badge.rarity) : 'text-gray-400 bg-gray-100 border-gray-200'}
          ${earned ? getRarityGlow(badge.rarity) : 'shadow-sm'}
          rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-300
          ${earned ? 'hover:scale-105' : ''}
          ${!earned ? 'opacity-60' : ''}
        `}
      >
        {/* Icon */}
        <div className={`${earned ? '' : 'grayscale'} mb-1`}>
          <IconComponent className={`${classes.icon} ${earned ? '' : 'text-gray-400'}`} />
        </div>
        
        {/* Badge Name */}
        <h4 className={`${classes.title} font-bold text-center leading-tight`}>
          {badge.name}
        </h4>
        
        {/* Points */}
        <div className={`${classes.points} font-semibold text-center`}>
          +{badge.points_reward}
        </div>
      </div>

      {/* Progress Bar for Unearned Badges */}
      {!earned && progress > 0 && (
        <div className="absolute bottom-1 left-1 right-1">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
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
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <LucideIcons.Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Rarity Indicator */}
      <div className={`absolute top-1 left-1 px-1 py-0.5 rounded text-xs font-bold ${getRarityColor(badge.rarity)}`}>
        {badge.rarity.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default BadgeDisplay;