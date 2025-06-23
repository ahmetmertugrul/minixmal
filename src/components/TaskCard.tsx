import React from 'react';
import { Star, Clock, Target, Award, ChevronRight } from 'lucide-react';
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
          <div className="w-16 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-2">
            <div className="w-10 h-12 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="w-12 h-16 bg-orange-400 rounded-xl absolute -right-2 -top-2"></div>
        </div>
      ),
      kitchen: (
        <div className="relative">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-yellow-800">🍳</span>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange-400 rounded-2xl flex items-center justify-center">
            <span className="text-lg font-bold text-orange-800">3</span>
          </div>
        </div>
      ),
      'digital-detox': (
        <div className="relative">
          <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center transform rotate-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-sm text-white font-bold">!</span>
          </div>
        </div>
      ),
      home: (
        <div className="flex space-x-2">
          <div className="w-10 h-16 bg-green-500 rounded-xl transform -rotate-6"></div>
          <div className="w-10 h-14 bg-blue-500 rounded-xl transform rotate-3 mt-1"></div>
          <div className="w-10 h-12 bg-yellow-500 rounded-xl transform -rotate-12 mt-2"></div>
        </div>
      ),
      workspace: (
        <div className="relative">
          <div className="w-18 h-12 bg-green-600 rounded-xl transform -rotate-6">
            <div className="w-full h-3 bg-green-400 rounded-t-xl mt-2"></div>
          </div>
          <div className="absolute top-2 right-0 w-10 h-8 bg-gray-300 rounded-lg transform rotate-12"></div>
        </div>
      ),
      budget: (
        <div className="relative">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-green-200">💰</span>
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 bg-green-800 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-green-200" />
          </div>
        </div>
      ),
      relationships: (
        <div className="flex space-x-1">
          <div className="w-8 h-8 bg-pink-400 rounded-full"></div>
          <div className="w-8 h-8 bg-purple-400 rounded-full -ml-3"></div>
          <div className="w-8 h-8 bg-blue-400 rounded-full -ml-3"></div>
        </div>
      ),
      default: (
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <Star className="w-10 h-10 text-white/80" />
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

  return (
    <div
      className={`
        h-80
        bg-gradient-to-br ${getCardBackground(index)}
        rounded-3xl p-6 text-white relative overflow-hidden
        hover:scale-[1.02] transition-all duration-300 cursor-pointer
        shadow-xl hover:shadow-2xl backdrop-blur-sm
      `}
      onClick={() => onToggle(task.id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
            {task.category}
          </span>
          <span className={`${getDifficultyColor(task.difficulty)} px-3 py-1 rounded-full text-xs font-medium`}>
            {task.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">{task.points}</span>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mb-4">
        {getIllustration(task.illustration)}
      </div>

      {/* Content */}
      <div className="space-y-3 flex-1">
        <h3 className="text-lg font-bold leading-tight line-clamp-2">
          {task.title}
        </h3>
        <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* Progress Bar */}
        {task.progress && (
          <div className="mt-3">
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
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-yellow-700" />
          </div>
          <span className="text-xs font-medium capitalize">
            {task.type.replace('-', ' ')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-white/80">
            <Clock className="w-3 h-3" />
            <span className="truncate max-w-16">{task.timeEstimate}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/60" />
        </div>
      </div>

      {/* Completion Overlay */}
      {task.completed && (
        <div className="absolute inset-0 bg-green-600/95 backdrop-blur-sm flex items-center justify-center rounded-3xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-2xl font-bold mb-2">Completed!</p>
            <p className="text-lg text-green-100">+{task.points} points</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;