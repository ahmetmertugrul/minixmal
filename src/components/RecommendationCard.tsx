import React from 'react';
import { Clock, BookOpen, Lightbulb, Quote, Target, ChevronRight, Check } from 'lucide-react';
import { Recommendation } from '../data/recommendations';

interface RecommendationCardProps {
  recommendation: Recommendation & { completed?: boolean; points?: number };
  index: number;
  onClick: () => void;
  onToggle: (id: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  index, 
  onClick,
  onToggle
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'tip': return <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'quote': return <Quote className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'principle': return <Target className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-500 text-white';
      case 'tip': return 'bg-green-500 text-white';
      case 'quote': return 'bg-purple-500 text-white';
      case 'principle': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getIllustration = (type: string) => {
    const illustrations = {
      calendar: (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="text-white text-base sm:text-lg font-bold">90</div>
        </div>
      ),
      quality: (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full"></div>
          </div>
        </div>
      ),
      percentage: (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-base sm:text-lg font-bold">80%</span>
        </div>
      ),
      default: (
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
      )
    };

    return illustrations[type as keyof typeof illustrations] || illustrations.default;
  };

  const getCardBackground = (index: number) => {
    if (recommendation.completed) {
      return 'bg-gradient-to-br from-green-500 to-green-600';
    }
    
    const backgrounds = [
      'bg-white/90',
      'bg-gradient-to-br from-blue-50 to-indigo-100',
      'bg-gradient-to-br from-green-50 to-emerald-100',
      'bg-gradient-to-br from-purple-50 to-pink-100',
      'bg-gradient-to-br from-yellow-50 to-orange-100',
      'bg-gradient-to-br from-pink-50 to-rose-100',
      'bg-gradient-to-br from-indigo-50 to-blue-100',
      'bg-gradient-to-br from-teal-50 to-cyan-100'
    ];
    return backgrounds[index % backgrounds.length];
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If the card is completed, clicking anywhere should toggle it back
    if (recommendation.completed) {
      e.stopPropagation();
      onToggle(recommendation.id);
      return;
    }
    
    // If not completed, clicking the card opens the modal
    onClick();
  };

  const handleTickClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(recommendation.id);
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    // Only allow reading more if not completed
    if (!recommendation.completed) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div 
      className={`${getCardBackground(index)} backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02] cursor-pointer relative ${
        recommendation.completed ? 'ring-4 ring-green-400/50' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {getIllustration(recommendation.illustration)}
          <div>
            <div className={`inline-flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getTypeColor(recommendation.type)}`}>
              {getTypeIcon(recommendation.type)}
              <span className="capitalize">{recommendation.type}</span>
            </div>
            <div className={`text-xs sm:text-sm mt-2 font-medium ${
              recommendation.completed ? 'text-white/90' : 'text-gray-600'
            }`}>
              {recommendation.category}
            </div>
          </div>
        </div>
        <div className={`flex items-center space-x-1 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${
          recommendation.completed 
            ? 'bg-white/20 text-white' 
            : 'text-gray-500 bg-white/50'
        }`}>
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{recommendation.readTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className={`text-lg sm:text-xl font-bold leading-tight line-clamp-2 ${
          recommendation.completed ? 'text-white' : 'text-gray-900'
        }`}>
          {recommendation.title}
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
          recommendation.completed ? 'text-white/90' : 'text-gray-700'
        }`}>
          {recommendation.description}
        </p>
        <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
          recommendation.completed ? 'text-white/90' : 'text-gray-800'
        }`}>
          {recommendation.content}
        </p>
        {recommendation.author && (
          <p className={`text-xs sm:text-sm italic font-medium ${
            recommendation.completed ? 'text-white/80' : 'text-gray-600'
          }`}>
            — {recommendation.author}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50 flex items-center justify-between">
        <button 
          onClick={handleReadMoreClick}
          className={`flex items-center space-x-2 text-xs sm:text-sm font-semibold transition-colors group ${
            recommendation.completed 
              ? 'text-white/70 cursor-not-allowed' 
              : 'text-indigo-600 hover:text-indigo-700'
          }`}
          disabled={recommendation.completed}
        >
          <span>Read full article</span>
          {!recommendation.completed && (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
        
        {/* Tick Mark Button */}
        <button
          onClick={handleTickClick}
          className={`
            w-8 h-8 sm:w-10 sm:h-10 
            rounded-full flex items-center justify-center transition-all duration-300
            shadow-lg hover:shadow-xl flex-shrink-0
            ${recommendation.completed
              ? 'bg-white text-green-600 hover:bg-gray-100 scale-110'
              : 'bg-white/80 text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          <Check className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
            recommendation.completed ? 'scale-110' : ''
          }`} />
        </button>
      </div>

      {/* Completion Overlay */}
      {recommendation.completed && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/95 to-green-600/95 backdrop-blur-sm flex items-center justify-center rounded-2xl sm:rounded-3xl cursor-pointer hover:from-green-500/90 hover:to-green-600/90 transition-all duration-300">
          <div className="text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold mb-2 text-white">Completed!</p>
            <p className="text-base sm:text-lg text-white mb-2">+{recommendation.points || 25} points</p>
            <p className="text-xs sm:text-sm text-green-200 mt-2 opacity-80">Click to undo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;