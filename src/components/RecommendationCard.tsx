import React from 'react';
import { Clock, BookOpen, Lightbulb, Quote, Target, ChevronRight } from 'lucide-react';
import { Recommendation } from '../data/recommendations';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
  onClick: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  index, 
  onClick 
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="w-5 h-5" />;
      case 'tip': return <Lightbulb className="w-5 h-5" />;
      case 'quote': return <Quote className="w-5 h-5" />;
      case 'principle': return <Target className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
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
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="text-white text-lg font-bold">90</div>
        </div>
      ),
      quality: (
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-5 h-5 bg-green-500 rounded-full"></div>
          </div>
        </div>
      ),
      percentage: (
        <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-lg font-bold">80%</span>
        </div>
      ),
      default: (
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
      )
    };

    return illustrations[type as keyof typeof illustrations] || illustrations.default;
  };

  const getCardBackground = (index: number) => {
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

  return (
    <div 
      className={`${getCardBackground(index)} backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02] cursor-pointer`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {getIllustration(recommendation.illustration)}
          <div>
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${getTypeColor(recommendation.type)}`}>
              {getTypeIcon(recommendation.type)}
              <span className="capitalize">{recommendation.type}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2 font-medium">{recommendation.category}</div>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
          <Clock className="w-4 h-4" />
          <span>{recommendation.readTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">
          {recommendation.title}
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {recommendation.description}
        </p>
        <p className="text-gray-800 text-sm leading-relaxed">
          {recommendation.content}
        </p>
        {recommendation.author && (
          <p className="text-sm text-gray-600 italic font-medium">
            — {recommendation.author}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200/50">
        <button className="flex items-center space-x-2 text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors group">
          <span>Read full article</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;