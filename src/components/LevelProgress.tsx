import React from 'react';
import { Crown, Star, TrendingUp, Award } from 'lucide-react';
import { getLevelInfo, getNextLevelInfo, getProgressToNextLevel } from '../data/levels';
import { formatPoints } from '../utils/scoring';

interface LevelProgressProps {
  totalPoints: number;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LevelProgress: React.FC<LevelProgressProps> = ({ 
  totalPoints, 
  showDetails = true, 
  size = 'medium' 
}) => {
  const currentLevel = getLevelInfo(totalPoints);
  const nextLevel = getNextLevelInfo(totalPoints);
  const progress = getProgressToNextLevel(totalPoints);

  const sizeClasses = {
    small: {
      container: 'p-3',
      title: 'text-sm',
      level: 'text-lg',
      description: 'text-xs',
      progress: 'h-2',
      icon: 'w-4 h-4'
    },
    medium: {
      container: 'p-4',
      title: 'text-base',
      level: 'text-xl',
      description: 'text-sm',
      progress: 'h-3',
      icon: 'w-5 h-5'
    },
    large: {
      container: 'p-6',
      title: 'text-lg',
      level: 'text-2xl',
      description: 'text-base',
      progress: 'h-4',
      icon: 'w-6 h-6'
    }
  };

  const classes = sizeClasses[size];

  const getLevelIcon = (level: number) => {
    if (level >= 10) return <Crown className={`${classes.icon} text-yellow-500`} />;
    if (level >= 7) return <Award className={`${classes.icon} text-purple-500`} />;
    if (level >= 4) return <TrendingUp className={`${classes.icon} text-blue-500`} />;
    return <Star className={`${classes.icon} text-green-500`} />;
  };

  const getLevelGradient = (level: number) => {
    if (level >= 10) return 'from-yellow-400 to-orange-500';
    if (level >= 7) return 'from-purple-400 to-pink-500';
    if (level >= 4) return 'from-blue-400 to-indigo-500';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl ${classes.container} shadow-lg border border-white/20`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-r ${getLevelGradient(currentLevel.level)} rounded-full p-2 shadow-lg`}>
            {getLevelIcon(currentLevel.level)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-gray-900 ${classes.level}`}>
                Level {currentLevel.level}
              </span>
              <span className={`text-gray-600 ${classes.title}`}>
                {formatPoints(totalPoints)} pts
              </span>
            </div>
            <h3 className={`font-semibold text-gray-800 ${classes.title}`}>
              {currentLevel.title}
            </h3>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Description */}
          <p className={`text-gray-600 mb-4 ${classes.description}`}>
            {currentLevel.description}
          </p>

          {/* Progress to Next Level */}
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-gray-700 font-medium ${classes.description}`}>
                  Progress to Level {nextLevel.level}
                </span>
                <span className={`text-gray-600 ${classes.description}`}>
                  {formatPoints(progress.current)} / {formatPoints(nextLevel.points_required)}
                </span>
              </div>
              
              <div className={`w-full bg-gray-200 rounded-full ${classes.progress}`}>
                <div 
                  className={`bg-gradient-to-r ${getLevelGradient(currentLevel.level)} ${classes.progress} rounded-full transition-all duration-500 relative overflow-hidden`}
                  style={{ width: `${progress.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-gray-500 ${classes.description}`}>
                  {progress.percentage.toFixed(1)}% complete
                </span>
                <span className={`text-gray-500 ${classes.description}`}>
                  {formatPoints(progress.needed)} points needed
                </span>
              </div>
            </div>
          )}

          {/* Max Level Reached */}
          {!nextLevel && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-bold text-yellow-600">Max Level Reached!</span>
                <Crown className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 text-sm">
                You've achieved the highest level of minimalism mastery!
              </p>
            </div>
          )}

          {/* Current Level Rewards */}
          {currentLevel.rewards && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className={`font-semibold text-gray-800 mb-2 ${classes.description}`}>
                Level Perks:
              </h4>
              <div className="space-y-1">
                {currentLevel.rewards.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="w-3 h-3 text-green-500" />
                    <span className={`text-gray-600 ${classes.description}`}>{feature}</span>
                  </div>
                ))}
                {currentLevel.rewards.badges?.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Award className="w-3 h-3 text-purple-500" />
                    <span className={`text-gray-600 ${classes.description}`}>Badge: {badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LevelProgress;