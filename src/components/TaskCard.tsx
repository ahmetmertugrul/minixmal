import React from 'react';
import { Star, Clock, Target, Award, ChevronRight, Check } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onToggle }) => {
  const getTaskImage = (taskId: string) => {
    // Unique, specific image for each task based on its title and content
    const imageMap: { [key: string]: string } = {
      // Wardrobe tasks - each with distinct wardrobe-related imagery
      '1': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', // Capsule wardrobe - minimal clothes on hangers
      '2': 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg', // One-in-one-out - donation box with clothes
      '3': 'https://images.pexels.com/photos/4210864/pexels-photo-4210864.jpeg', // Seasonal rotation - storage boxes and winter clothes
      '4': 'https://images.pexels.com/photos/1148960/pexels-photo-1148960.jpeg', // Color palette - fabric swatches and color coordination
      '5': 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg', // Shoe audit - organized shoe collection
      '6': 'https://images.pexels.com/photos/1927574/pexels-photo-1927574.jpeg', // Accessories - elegant jewelry and accessories
      '7': 'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg', // Laundry - modern washing machine and detergent
      '8': 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', // Uniform dressing - professional business attire
      
      // Food/Kitchen tasks - each with distinct kitchen imagery
      '9': 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg', // Kitchen tools - chef's knife and cutting board
      '10': 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg', // Pantry - glass storage containers with grains
      '11': 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg', // Gadget purge - various kitchen gadgets
      '12': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', // Meal planning - notebook with vegetables and planning
      '13': 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg', // Dish minimization - clean white dishes stacked
      '14': 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg', // Spice rack - organized spices in glass jars
      '15': 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg', // Counter space - clean, minimal kitchen counter
      
      // Technology tasks - each with distinct tech imagery
      '16': 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg', // Digital detox - phone with apps and digital wellness
      '17': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg', // Email inbox - computer screen showing email interface
      '18': 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg', // App audit - smartphone with social media apps
      '19': 'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg', // Photo cleanup - camera with scattered photos
      '20': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg', // Social media - social media icons and notifications
      '21': 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg', // Password manager - security and lock icons
      '22': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', // Cloud storage - cloud computing and file organization
      '23': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg', // Notifications - phone with notification bubbles
      
      // Home tasks - each with distinct home organization imagery
      '24': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', // Room declutter - organized, minimal living room
      '25': 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg', // Furniture - minimalist furniture arrangement
      '26': 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg', // Decoration - minimal wall art and decor
      '27': 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg', // Storage system - organized shelving and storage boxes
      '28': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg', // Paper reduction - organized documents and filing
      '29': 'https://images.pexels.com/photos/4239119/pexels-photo-4239119.jpeg', // Cleaning supplies - eco-friendly cleaning products
      '30': 'https://images.pexels.com/photos/271897/pexels-photo-271897.jpeg', // Linen closet - neatly folded towels and linens
      '31': 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg', // Entryway - organized front door area with hooks
      '32': 'https://images.pexels.com/photos/6621186/pexels-photo-6621186.jpeg', // Bathroom - minimal toiletries and bathroom essentials
      '33': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg', // Bedroom - peaceful, clutter-free bedroom
      
      // Finance tasks - each with distinct financial imagery
      '34': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg', // Budget - calculator, money, and budget planning
      '35': 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg', // Subscriptions - credit cards and subscription services
      '36': 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg', // Mindful spending - shopping cart and money decisions
      '37': 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg', // Bank accounts - banking and financial documents
      '38': 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg', // Investments - stock charts and investment planning
      
      // Relationships tasks - each with distinct social imagery
      '39': 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg', // Social circle - group of close friends
      '40': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg', // Communication - people having meaningful conversation
      '41': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', // Events - calendar and event planning
      '42': 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg', // Gift giving - thoughtfully wrapped gifts
      
      // Work tasks - each with distinct workplace imagery
      '43': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', // Workspace - clean, organized desk setup
      '44': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', // Task management - to-do list and productivity tools
      '45': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg', // Meetings - conference room and meeting setup
      '46': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg', // Email management - organized email inbox
      
      // Health tasks - each with distinct health imagery
      '47': 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg', // Supplements - vitamins and health supplements
      '48': 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg', // Exercise - workout equipment and fitness
      '49': 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg', // Skincare - minimal skincare products
      '50': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg', // Sleep - comfortable bedroom for better sleep
      
      // Creativity tasks - each with distinct creative imagery
      '51': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg', // Art supplies - paintbrushes and art materials
      '52': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', // Creative space - organized art studio
      '53': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg', // Project focus - focused art project work
      '54': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', // Digital creative - computer design work
      '55': 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg', // Inspiration - mood board and inspiration wall
      
      // Travel tasks - each with distinct travel imagery
      '56': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg', // Packing - minimalist packing and suitcase
      '57': 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg', // Travel gear - travel accessories and essentials
      '58': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg', // Digital nomad - laptop and remote work setup
      '59': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg', // Souvenirs - meaningful travel memories
      
      // Environment tasks - each with distinct eco imagery
      '60': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', // Zero waste - recycling and waste reduction
      '61': 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg', // Plastic reduction - reusable bags and eco alternatives
      '62': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', // Energy audit - LED light bulb and energy saving
      '63': 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg', // Sustainable shopping - eco-friendly products
      '64': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', // Local living - farmers market and local produce
      
      // Habits tasks - each with distinct lifestyle imagery
      '65': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', // Morning routine - sunrise and morning rituals
      '66': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg', // Evening routine - peaceful bedtime setup
      '67': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', // Habit stacking - routine and habit formation
      '68': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', // Decision fatigue - choices and decision making
      '69': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', // Mindfulness - meditation and mindful practice
      '70': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', // Single-tasking - focused work and productivity
    };

    return imageMap[taskId] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
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
      <div className="flex justify-between items-start p-3 sm:p-4">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span className="bg-black/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white">
            {task.category}
          </span>
          <span className={`${getDifficultyColor(task.difficulty)} px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white`}>
            {task.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          <span className="text-xs sm:text-sm font-medium text-white">{task.points}</span>
        </div>
      </div>

      {/* Image Area */}
      <div className="px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="w-full h-28 sm:h-36 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden">
          <img 
            src={getTaskImage(task.id)} 
            alt={task.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 space-y-1 sm:space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight line-clamp-2">
          {task.title}
        </h3>
        <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2">
          {getOneLineDescription(task)}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-700" />
            </div>
            <span className="text-xs font-medium text-white capitalize">
              {task.type.replace('-', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-white/80">
            <Clock className="w-3 h-3" />
            <span className="truncate max-w-16 sm:max-w-20">{task.timeEstimate}</span>
          </div>
        </div>
        
        {/* Tick Mark Button */}
        <button
          onClick={handleTickClick}
          className={`
            tick-mark-button w-7 h-7 sm:w-8 sm:h-8 
            rounded-full flex items-center justify-center transition-all duration-300
            shadow-lg hover:shadow-xl flex-shrink-0
            ${task.completed 
              ? 'bg-white text-green-600 hover:bg-gray-100' 
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }
          `}
        >
          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
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