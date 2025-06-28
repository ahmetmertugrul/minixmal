import React from 'react';
import { Star, TrendingUp, Flame, Award, Zap, Plus } from 'lucide-react';
import { ScoreMultiplier } from '../types/scoring';
import { formatPoints } from '../utils/scoring';

interface ScoreBreakdownProps {
  basePoints: number;
  multipliers: ScoreMultiplier[];
  totalPoints: number;
  showAnimation?: boolean;
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ 
  basePoints, 
  multipliers, 
  totalPoints,
  showAnimation = false 
}) => {
  const getMultiplierIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'time': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'category': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'difficulty': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Star className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getMultiplierColor = (type: string) => {
    switch (type) {
      case 'streak': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'category': return 'bg-green-100 text-green-800 border-green-200';
      case 'difficulty': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 ${showAnimation ? 'animate-pulse' : ''}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <Star className="w-5 h-5 text-yellow-500" />
        <span>Points Breakdown</span>
      </h3>

      <div className="space-y-3">
        {/* Base Points */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700">Base Points</span>
          </div>
          <span className="font-bold text-gray-900">+{formatPoints(basePoints)}</span>
        </div>

        {/* Multipliers */}
        {multipliers.map((multiplier, index) => (
          <div key={index} className={`flex items-center justify-between p-3 rounded-xl border ${getMultiplierColor(multiplier.type)}`}>
            <div className="flex items-center space-x-2">
              {getMultiplierIcon(multiplier.type)}
              <span className="font-medium">{multiplier.description}</span>
            </div>
            <span className="font-bold">×{multiplier.multiplier.toFixed(1)}</span>
          </div>
        ))}

        {/* Calculation */}
        {multipliers.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
              <span>{formatPoints(basePoints)}</span>
              {multipliers.map((mult, index) => (
                <React.Fragment key={index}>
                  <Plus className="w-3 h-3" />
                  <span>×{mult.multiplier.toFixed(1)}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span className="font-bold text-lg">Total Points</span>
          </div>
          <span className="font-bold text-xl">+{formatPoints(totalPoints)}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBreakdown;