import React from 'react';
import { X, Clock, Target, Award, Star, CheckCircle, Lightbulb, TrendingUp, Users, Zap } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onToggleComplete 
}) => {
  if (!isOpen || !task) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge': return <Target className="w-5 h-5" />;
      case 'habit': return <TrendingUp className="w-5 h-5" />;
      case 'declutter': return <CheckCircle className="w-5 h-5" />;
      case 'mindset': return <Lightbulb className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getTaskBenefits = (task: Task) => {
    const benefitsMap: { [key: string]: string[] } = {
      '1': [
        'Reduces decision fatigue by 80%',
        'Saves 30+ minutes daily choosing outfits',
        'Creates a cohesive, polished appearance',
        'Reduces clothing expenses by focusing on quality',
        'Simplifies laundry and organization'
      ],
      '2': [
        'Prevents wardrobe overflow and clutter',
        'Encourages mindful purchasing decisions',
        'Maintains optimal closet size',
        'Helps others through donations',
        'Saves money by reducing impulse buys'
      ],
      '9': [
        'Frees up 40% more kitchen storage space',
        'Reduces cleaning and maintenance time',
        'Improves cooking efficiency and flow',
        'Eliminates duplicate and broken tools',
        'Creates a more organized, peaceful kitchen'
      ],
      '16': [
        'Improves focus and concentration by 60%',
        'Reduces anxiety and mental overwhelm',
        'Better sleep quality and duration',
        'Increased productivity and creativity',
        'Stronger real-world relationships'
      ],
      '24': [
        'Creates a calm, peaceful living environment',
        'Reduces cleaning time by 50%',
        'Improves mental clarity and focus',
        'Increases home value and appeal',
        'Reduces stress and anxiety levels'
      ],
      '34': [
        'Reduces financial stress and anxiety',
        'Increases savings rate by 25%',
        'Provides clear spending visibility',
        'Enables better financial decisions',
        'Creates long-term financial security'
      ],
      'default': [
        'Reduces stress and mental clutter',
        'Saves time on daily maintenance',
        'Creates more peaceful living spaces',
        'Improves focus and productivity',
        'Enhances overall life satisfaction'
      ]
    };

    return benefitsMap[task.id] || benefitsMap.default;
  };

  const getDetailedSteps = (task: Task) => {
    const stepsMap: { [key: string]: string[] } = {
      '1': [
        'Audit your current wardrobe - lay everything out',
        'Identify your lifestyle needs (work, casual, formal)',
        'Choose 3-4 base colors that complement each other',
        'Select 30 versatile pieces that all work together',
        'Donate or sell items that don\'t fit the capsule',
        'Organize remaining pieces by category',
        'Create outfit combinations and document them',
        'Maintain the capsule with seasonal reviews'
      ],
      '2': [
        'Set up a donation bag in your closet',
        'Before buying anything new, choose one item to remove',
        'Ensure the new item is higher quality or more versatile',
        'Donate the removed item within 24 hours',
        'Track your purchases and donations monthly',
        'Review and adjust the rule based on your needs'
      ],
      '9': [
        'Empty all kitchen drawers and cabinets',
        'Group similar tools together',
        'Test each tool - does it work properly?',
        'Keep only tools you\'ve used in the past 3 months',
        'Prioritize multi-purpose and high-quality items',
        'Donate or discard broken/duplicate tools',
        'Organize remaining tools by frequency of use',
        'Create designated spots for each tool'
      ],
      '16': [
        'Track your current screen time for one week',
        'Set specific phone-free hours (meals, before bed)',
        'Remove social media apps from your phone',
        'Use website blockers during work hours',
        'Create tech-free zones in your home',
        'Replace digital activities with analog alternatives',
        'Practice mindful technology use',
        'Review and adjust your digital boundaries weekly'
      ],
      '24': [
        'Start with the easiest room to build momentum',
        'Set a timer for focused 25-minute sessions',
        'Sort items into keep, donate, trash, and relocate',
        'Apply the 90/90 rule for uncertain items',
        'Clean and organize as you go',
        'Take before and after photos for motivation',
        'Move to the next room only when current is complete',
        'Maintain with daily 10-minute tidying sessions'
      ],
      '34': [
        'Track all expenses for one month to understand patterns',
        'Choose a simple budgeting method (50/30/20 or envelope)',
        'Automate savings transfers and bill payments',
        'Set up separate accounts for different goals',
        'Review and adjust budget monthly',
        'Use cash or debit cards to avoid debt',
        'Plan for irregular expenses and emergencies',
        'Celebrate financial milestones and progress'
      ],
      'default': [
        'Start with a clear goal and timeline',
        'Break the task into smaller, manageable steps',
        'Set aside dedicated time without distractions',
        'Gather any necessary tools or supplies',
        'Begin with the easiest part to build momentum',
        'Take breaks to avoid overwhelm',
        'Document your progress with photos or notes',
        'Maintain your results with regular check-ins'
      ]
    };

    return stepsMap[task.id] || stepsMap.default;
  };

  const getRecommendations = (task: Task) => {
    const recommendationsMap: { [key: string]: string[] } = {
      '1': [
        'Start with basics: 5 tops, 3 bottoms, 2 dresses, 1 jacket',
        'Choose fabrics that don\'t wrinkle easily',
        'Invest in quality undergarments and shoes',
        'Document successful outfit combinations',
        'Shop your closet before buying anything new'
      ],
      '2': [
        'Keep a "maybe" box for items you\'re unsure about',
        'Take photos of sentimental items before donating',
        'Shop with a specific list to avoid impulse purchases',
        'Consider the cost-per-wear of new items',
        'Donate to local charities or shelters'
      ],
      '9': [
        'Keep one high-quality version of each tool type',
        'Prioritize tools you use for 80% of your cooking',
        'Store frequently used items in easy-to-reach places',
        'Consider the cleaning and storage requirements',
        'Test tools before deciding to keep them'
      ],
      '16': [
        'Use grayscale mode to make your phone less appealing',
        'Replace your smartphone with an alarm clock for bedtime',
        'Find offline hobbies to fill the time gap',
        'Use app timers and restrictions',
        'Practice the "phone in another room" rule'
      ],
      '24': [
        'Play upbeat music to make the process enjoyable',
        'Invite a friend to help and keep you motivated',
        'Start with visible areas for immediate satisfaction',
        'Use the "one-touch rule" - decide immediately',
        'Reward yourself after completing each room'
      ],
      '34': [
        'Use budgeting apps or simple spreadsheets',
        'Pay yourself first by automating savings',
        'Review subscriptions and recurring charges monthly',
        'Use the 24-hour rule for non-essential purchases',
        'Focus on tracking trends rather than every penny'
      ],
      'default': [
        'Start small and build momentum gradually',
        'Set realistic timelines and expectations',
        'Focus on progress, not perfection',
        'Celebrate small wins along the way',
        'Ask for help or support when needed'
      ]
    };

    return recommendationsMap[task.id] || recommendationsMap.default;
  };

  const benefits = getTaskBenefits(task);
  const steps = getDetailedSteps(task);
  const recommendations = getRecommendations(task);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                {getTypeIcon(task.type)}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {task.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{task.timeEstimate}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">{task.points} pts</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold leading-tight">
                  {task.title}
                </h2>
                <p className="text-white/90 mt-2">
                  {task.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Benefits */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  What You'll Gain
                </h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-green-800 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Pro Tips
                </h3>
                <div className="space-y-3">
                  {recommendations.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-blue-800 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Step-by-Step Guide */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Step-by-Step Guide
                </h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-purple-800 leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Tips */}
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Quick Tips
                </h3>
                <div className="space-y-3">
                  {task.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-orange-800 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Ready to transform your space and mindset? Start this task today!
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggleComplete(task.id);
                  onClose();
                }}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all flex items-center space-x-2 ${
                  task.completed
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span>{task.completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;