import React from 'react';
import { Star, TrendingUp, Flame, Award, Zap } from 'lucide-react';
import { formatPoints } from '../utils/scoring';
import { ScoreMultiplier } from '../types/scoring';

interface PointsDisplayProps {
  points: number;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
  multipliers?: ScoreMultiplier[];
  breakdown?: boolean;
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ 
  points, 
  showAnimation = false, 
  size = 'medium',
  multipliers = [],
  breakdown = false
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  const getMultiplierIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className={`${iconSizes[size]} text-orange-500`} />;
      case 'time': return <Zap className={`${iconSizes[size]} text-blue-500`} />;
      case 'category': return <TrendingUp className={`${iconSizes[size]} text-green-500`} />;
      case 'difficulty': return <Award className={`${iconSizes[size]} text-purple-500`} />;
      default: return <Star className={`${iconSizes[size]} text-yellow-500`} />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${showAnimation ? 'animate-pulse' : ''}`}>
        <Star className={`${iconSizes[size]} text-yellow-500`} />
        <span className={`font-bold text-gray-900 ${sizeClasses[size]}`}>
          {formatPoints(points)}
        </span>
      </div>
      
      {breakdown && multipliers.length > 0 && (
        <div className="flex items-center space-x-1">
          {multipliers.map((multiplier, index) => (
            <div 
              key={index}
              className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full"
              title={multiplier.description}
            >
              {getMultiplierIcon(multiplier.type)}
              <span className="text-xs font-medium text-gray-700">
                {multiplier.multiplier.toFixed(1)}x
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PointsDisplay;