import React from 'react';
import { Star, Clock, Target, Award, ChevronRight, Check } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onToggle }) => {
  const getTaskImage = (category: string, illustration: string) => {
    // Map categories and illustrations to relevant images from Pexels
    const imageMap: { [key: string]: string } = {
      // Wardrobe images
      'wardrobe': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'Wardrobe': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      
      // Kitchen/Food images
      'kitchen': 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg',
      'Food': 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg',
      
      // Technology/Digital images
      'digital-detox': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      'Technology': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      
      // Home images
      'home': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'Home': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      
      // Workspace/Work images
      'workspace': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      'Work': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      
      // Finance images
      'budget': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
      'Finance': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
      
      // Relationships images
      'relationships': 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      'Relationships': 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      
      // Health images
      'Health': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      
      // Creativity images
      'Creativity': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      
      // Travel images
      'Travel': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      
      // Environment images
      'Environment': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      
      // Habits images
      'Habits': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    };

    return imageMap[category] || imageMap[illustration] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
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

  const getOneLineDescription = (task: Task) => {
    // Create concise one-line descriptions for each task
    const descriptions: { [key: string]: string } = {
      '1': 'Build a versatile wardrobe with 30 quality pieces that all work together.',
      '2': 'Maintain balance by donating one item for every new purchase.',
      '3': 'Store off-season clothes to keep your closet focused and organized.',
      '4': 'Choose 3-4 colors that complement each other for a cohesive look.',
      '5': 'Keep only comfortable shoes you actually wear regularly.',
      '6': 'Curate a small collection of timeless, versatile accessories.',
      '7': 'Simplify your laundry routine with fewer, better products.',
      '8': 'Develop a signature style to eliminate daily decision fatigue.',
      '9': 'Keep only the cooking tools you use every week.',
      '10': 'Organize your pantry with clear containers and smart labeling.',
      '11': 'Remove single-use gadgets that rarely leave the drawer.',
      '12': 'Plan your meals weekly to reduce stress and food waste.',
      '13': 'Keep just enough dishes for your household plus a few guests.',
      '14': 'Maintain a curated spice collection with fresh, quality options.',
      '15': 'Keep counters clear except for daily essentials.',
      '16': 'Reduce screen time and digital overwhelm for better mental clarity.',
      '17': 'Process emails efficiently to maintain a clean, organized inbox.',
      '18': 'Remove unused apps and organize your phone for better focus.',
      '19': 'Clean up your photo library by removing duplicates and organizing.',
      '20': 'Curate your social media feeds to see only valuable content.',
      '21': 'Secure and simplify your digital life with a password manager.',
      '22': 'Create a logical file structure in your cloud storage.',
      '23': 'Turn off distracting notifications to improve focus and productivity.',
      '24': 'Go through each room systematically to remove unnecessary items.',
      '25': 'Keep only furniture that serves a clear, essential purpose.',
      '26': 'Display only meaningful decorations that bring you joy.',
      '27': 'Create organized storage systems for everything you keep.',
      '28': 'Digitize important documents and reduce paper clutter.',
      '29': 'Use fewer, more effective cleaning products and tools.',
      '30': 'Keep only necessary linens in good condition.',
      '31': 'Create a functional, welcoming entrance to your home.',
      '32': 'Keep only daily-use toiletries and essential products.',
      '33': 'Transform your bedroom into a peaceful, clutter-free sanctuary.',
      '34': 'Create a simple budgeting system you can actually maintain.',
      '35': 'Cancel subscriptions and memberships you no longer use.',
      '36': 'Practice mindful spending by waiting before non-essential purchases.',
      '37': 'Simplify your banking by consolidating to essential accounts.',
      '38': 'Streamline investments with simple, low-cost index funds.',
      '39': 'Focus your energy on relationships that truly matter.',
      '40': 'Communicate more effectively with clarity and intention.',
      '41': 'Be selective about events and commitments that align with your values.',
      '42': 'Give meaningful gifts that create experiences rather than clutter.',
      '43': 'Design a workspace that promotes focus and creativity.',
      '44': 'Implement a simple system to manage tasks and priorities.',
      '45': 'Reduce unnecessary meetings and make remaining ones more effective.',
      '46': 'Process work emails efficiently with clear systems and boundaries.',
      '47': 'Keep only essential, evidence-based supplements for your health.',
      '48': 'Create a sustainable exercise routine you can maintain long-term.',
      '49': 'Simplify skincare to essential, effective products that work.',
      '50': 'Optimize your sleep environment for better rest and recovery.',
      '51': 'Keep only art supplies you actively use and love.',
      '52': 'Design a minimal, inspiring workspace for creative work.',
      '53': 'Focus on 1-2 active projects to improve quality and completion.',
      '54': 'Organize digital creative files and remove unused projects.',
      '55': 'Curate a focused collection of truly inspiring references.',
      '56': 'Master packing light for any trip with versatile essentials.',
      '57': 'Keep only essential, multi-purpose travel gear.',
      '58': 'Create a minimal digital workspace for remote work.',
      '59': 'Choose meaningful souvenirs over quantity when traveling.',
      '60': 'Reduce household waste to near zero through mindful consumption.',
      '61': 'Eliminate single-use plastics from your daily routine.',
      '62': 'Reduce home energy usage through conscious consumption habits.',
      '63': 'Choose quality, sustainable products over cheap alternatives.',
      '64': 'Source food and goods locally to reduce environmental impact.',
      '65': 'Create a streamlined morning routine that energizes your day.',
      '66': 'Establish a calming evening routine for better sleep.',
      '67': 'Link new minimal habits to existing routines for success.',
      '68': 'Automate or eliminate daily micro-decisions to reduce fatigue.',
      '69': 'Develop a simple daily mindfulness practice for clarity.',
      '70': 'Focus on one task at a time for better productivity.'
    };

    return descriptions[task.id] || task.description;
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
        h-80 sm:h-96 relative
        bg-gradient-to-br ${getCardBackground(index)}
        rounded-2xl sm:rounded-3xl overflow-hidden
        hover:scale-[1.02] transition-all duration-300 cursor-pointer
        shadow-xl hover:shadow-2xl backdrop-blur-sm
      `}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
            {task.category}
          </span>
          <span className={`${getDifficultyColor(task.difficulty)} px-3 py-1 rounded-full text-xs font-medium text-white`}>
            {task.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <Award className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">{task.points}</span>
        </div>
      </div>

      {/* Image Area */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="w-full h-32 sm:h-40 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
          <img 
            src={getTaskImage(task.category, task.illustration)} 
            alt={task.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 space-y-2 sm:space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {task.title}
        </h3>
        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
          {getOneLineDescription(task)}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-700" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-white capitalize">
              {task.type.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs sm:text-sm text-white/80">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{task.timeEstimate}</span>
          </div>
        </div>
        
        {/* Tick Mark Button */}
        <button
          onClick={handleTickClick}
          className={`
            tick-mark-button w-8 h-8 sm:w-10 sm:h-10 
            rounded-full flex items-center justify-center transition-all duration-300
            shadow-lg hover:shadow-xl
            ${task.completed 
              ? 'bg-white text-green-600 hover:bg-gray-100' 
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }
          `}
        >
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Completion Overlay */}
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