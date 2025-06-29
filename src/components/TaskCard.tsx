import React from 'react';
import { Star, Clock, Target, Award, ChevronRight, Check } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onToggle }) => {
  const getIllustration = (type: string) => {
    const illustrations = {
      wardrobe: (
        <div className="relative">
          <div className="w-12 h-16 sm:w-16 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-2">
            <div className="w-8 h-10 sm:w-10 sm:h-12 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="w-10 h-12 sm:w-12 sm:h-16 bg-orange-400 rounded-xl absolute -right-2 -top-2"></div>
        </div>
      ),
      kitchen: (
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-yellow-800">🍳</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-orange-400 rounded-2xl flex items-center justify-center">
            <span className="text-sm sm:text-lg font-bold text-orange-800">3</span>
          </div>
        </div>
      ),
      'digital-detox': (
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-3xl flex items-center justify-center transform rotate-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-lg"></div>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs sm:text-sm text-white font-bold">!</span>
          </div>
        </div>
      ),
      home: (
        <div className="flex space-x-1 sm:space-x-2">
          <div className="w-8 h-12 sm:w-10 sm:h-16 bg-green-500 rounded-xl transform -rotate-6"></div>
          <div className="w-8 h-10 sm:w-10 sm:h-14 bg-blue-500 rounded-xl transform rotate-3 mt-1"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-12 bg-yellow-500 rounded-xl transform -rotate-12 mt-2"></div>
        </div>
      ),
      workspace: (
        <div className="relative">
          <div className="w-14 h-10 sm:w-18 sm:h-12 bg-green-600 rounded-xl transform -rotate-6">
            <div className="w-full h-2 sm:h-3 bg-green-400 rounded-t-xl mt-2"></div>
          </div>
          <div className="absolute top-2 right-0 w-8 h-6 sm:w-10 sm:h-8 bg-gray-300 rounded-lg transform rotate-12"></div>
        </div>
      ),
      budget: (
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-green-200">💰</span>
          </div>
          <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-800 rounded-full flex items-center justify-center">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-green-200" />
          </div>
        </div>
      ),
      relationships: (
        <div className="flex space-x-1">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full"></div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-400 rounded-full -ml-2 sm:-ml-3"></div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full -ml-2 sm:-ml-3"></div>
        </div>
      ),
      default: (
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center">
          <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
        </div>
      )
    };

    return illustrations[type as keyof typeof illustrations] || illustrations.default;
  };

  const getCardBackground = (index: number) => {
    const backgrounds = [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-pink-600',
      'from-yellow-400 to-orange-500',
      'from-pink-400 to-purple-500',
      'from-green-500 to-teal-600',
      'from-blue-600 to-indigo-700',
      'from-red-500 to-pink-600',
      'from-indigo-500 to-purple-600',
      'from-teal-500 to-green-600',
      'from-orange-500 to-red-600'
    ];
    return backgrounds[index % backgrounds.length];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on the tick mark
    if ((e.target as HTMLElement).closest('.tick-mark-button')) {
      return;
    }
    // If the task is completed, clicking anywhere should toggle it
    if (task.completed) {
      onToggle(task.id);
    }
  };

  const handleTickClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  return (
    <div
      className={`
        h-72 sm:h-80 relative
        bg-gradient-to-br ${getCardBackground(index)}
        rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white overflow-hidden
        hover:scale-[1.02] transition-all duration-300 cursor-pointer
        shadow-xl hover:shadow-2xl backdrop-blur-sm
      `}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span className="bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
            {task.category}
          </span>
          <span className={`${getDifficultyColor(task.difficulty)} px-2 sm:px-3 py-1 rounded-full text-xs font-medium`}>
            {task.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{task.points}</span>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mb-3 sm:mb-4">
        {getIllustration(task.illustration)}
      </div>

      {/* Content */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-2">
          {task.title}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* Progress Bar */}
        {task.progress && (
          <div className="mt-2 sm:mt-3">
            <div className="bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-white/80 mt-1 block">{task.progress}% complete</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-700" />
          </div>
          <span className="text-xs font-medium capitalize">
            {task.type.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-white/80">
            <Clock className="w-3 h-3" />
            <span className="truncate max-w-12 sm:max-w-16">{task.timeEstimate}</span>
          </div>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
        </div>
      </div>

      {/* Tick Mark Button - Bottom Right */}
      <button
        onClick={handleTickClick}
        className={`
          tick-mark-button absolute bottom-4 right-4 w-8 h-8 sm:w-10 sm:h-10 
          rounded-full flex items-center justify-center transition-all duration-300
          shadow-lg hover:shadow-xl z-10
          ${task.completed 
            ? 'bg-white text-green-600 hover:bg-gray-100' 
            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
          }
        `}
      >
        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Completion Overlay - Full green overlay like in the image */}
      {task.completed && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center rounded-2xl sm:rounded-3xl cursor-pointer">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold mb-2 text-white">Completed!</p>
            <p className="text-base sm:text-lg text-white mb-2">+{task.points} points</p>
            <p className="text-sm text-white/80">Click to undo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;