import React, { useState } from 'react';
import { X, Clock, Target, Lightbulb, TrendingUp, Users, CheckCircle, Play, Award, Star } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  completed: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onToggleComplete,
  completed
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'benefits' | 'community'>('overview');

  if (!isOpen) return null;

  // Comprehensive task-specific data
  const getTaskData = (task: Task) => {
    const taskData: { [key: string]: any } = {
      // Wardrobe Tasks (1-8)
      '1': {
        whatYoullDo: 'Choose 3-4 colors that complement each other and build your entire wardrobe around this palette for maximum versatility and cohesion.',
        whyItMatters: 'A limited color palette ensures everything in your closet works together, maximizing outfit combinations while creating a signature style.',
        expectedOutcome: 'Every piece in your wardrobe will coordinate with every other piece, giving you more outfit options with fewer clothes.',
        steps: [
          'Assess your current wardrobe and identify which colors you wear most often',
          'Choose 2-3 neutral base colors (black, white, gray, navy, beige)',
          'Select 1-2 accent colors that complement your base palette',
          'Remove or donate items that don\'t fit your chosen color scheme',
          'Create a visual guide or mood board of your color palette',
          'Test outfit combinations to ensure everything works together',
          'Make future purchases only in your chosen colors'
        ],
        benefits: [
          'Simplified shopping decisions',
          'More outfit combinations with fewer pieces',
          'Cohesive, polished appearance',
          'Reduced decision fatigue when getting dressed',
          'Better cost-per-wear on clothing investments'
        ],
        challenges: [
          'Letting go of favorite pieces that don\'t fit the palette',
          'Resisting trendy colors outside your scheme',
          'Initial investment in replacing non-conforming pieces'
        ]
      },
      '2': {
        whatYoullDo: 'Implement a strict one-in-one-out policy: for every new clothing item you bring home, donate one existing piece.',
        whyItMatters: 'This prevents wardrobe creep and forces you to be intentional about new purchases while maintaining a manageable closet size.',
        expectedOutcome: 'Your wardrobe will stay at an optimal size while continuously improving in quality and relevance.',
        steps: [
          'Count your current clothing items to establish a baseline',
          'Set up a donation bag or box in your closet',
          'Before buying anything new, identify what you\'ll remove',
          'When you bring home a new item, immediately select one to donate',
          'Ensure the donated item is clean and in good condition',
          'Drop off donations regularly to avoid accumulation',
          'Track your adherence to the rule for the first month'
        ],
        benefits: [
          'Prevents closet overflow',
          'Forces mindful purchasing decisions',
          'Keeps wardrobe fresh and current',
          'Helps others through donations',
          'Maintains optimal wardrobe size'
        ],
        challenges: [
          'Breaking old shopping habits',
          'Choosing which item to remove',
          'Remembering the rule when shopping'
        ]
      },
      '9': {
        whatYoullDo: 'Audit your kitchen tools and keep only the essentials you use weekly, donating or storing the rest.',
        whyItMatters: 'Most home cooks use only 20% of their kitchen tools 80% of the time. Focusing on essentials creates a more functional, efficient kitchen.',
        expectedOutcome: 'A streamlined kitchen with easy-to-find tools, more counter space, and faster meal preparation.',
        steps: [
          'Empty all kitchen drawers and cabinets of tools and gadgets',
          'Sort items into three categories: daily use, occasional use, rarely used',
          'Keep only daily and weekly use items in prime locations',
          'Store seasonal or specialty items in less accessible areas',
          'Donate duplicate tools and single-use gadgets',
          'Organize remaining tools by frequency of use',
          'Create designated spots for each essential tool'
        ],
        benefits: [
          'Faster meal preparation',
          'More counter and storage space',
          'Easier cleaning and maintenance',
          'Reduced decision fatigue when cooking',
          'Better tool quality through focused investment'
        ],
        challenges: [
          'Letting go of "just in case" items',
          'Deciding between similar tools',
          'Resistance from family members'
        ]
      },
      '16': {
        whatYoullDo: 'Reduce screen time and digital overwhelm through intentional technology use and regular digital breaks.',
        whyItMatters: 'Digital clutter affects mental clarity and focus just like physical clutter. Mindful technology use improves well-being and productivity.',
        expectedOutcome: 'Improved focus, better sleep, more meaningful real-world connections, and reduced anxiety from digital overwhelm.',
        steps: [
          'Track current screen time using built-in phone analytics',
          'Set specific times for checking emails and social media',
          'Create phone-free zones (bedroom, dining table)',
          'Use app timers to limit recreational screen time',
          'Implement a digital sunset 1 hour before bed',
          'Replace mindless scrolling with intentional activities',
          'Schedule regular digital detox periods'
        ],
        benefits: [
          'Improved sleep quality',
          'Better focus and concentration',
          'More present in relationships',
          'Reduced anxiety and FOMO',
          'Increased productivity'
        ],
        challenges: [
          'Breaking habitual phone checking',
          'FOMO when disconnected',
          'Work-related digital demands'
        ]
      }
    };

    // Default template for tasks without specific data
    const defaultData = {
      whatYoullDo: `Complete the ${task.title.toLowerCase()} by following the structured approach outlined in this task.`,
      whyItMatters: `This task helps you progress toward a more minimalist lifestyle by ${task.description.toLowerCase()}.`,
      expectedOutcome: `You'll experience the benefits of minimalism in this area of your life, creating more space, time, and mental clarity.`,
      steps: [
        'Assess your current situation in this area',
        'Identify what truly adds value to your life',
        'Remove or reduce unnecessary items/habits',
        'Organize what remains in a functional way',
        'Create systems to maintain your progress',
        'Reflect on the positive changes you\'ve made'
      ],
      benefits: [
        'Reduced clutter and visual noise',
        'More time for what matters most',
        'Decreased stress and overwhelm',
        'Improved focus and clarity',
        'Greater appreciation for what you keep'
      ],
      challenges: [
        'Emotional attachment to items',
        'Fear of needing something later',
        'Pressure from others to keep things',
        'Breaking old habits and patterns'
      ]
    };

    return taskData[task.id] || defaultData;
  };

  const getCommunityData = (task: Task) => {
    // Category-based community stats and stories
    const categoryData: { [key: string]: any } = {
      'Wardrobe': {
        completionRate: 78,
        avgTimeToComplete: '2-3 weeks',
        topTip: 'Start with one category at a time - don\'t try to do your entire wardrobe at once!',
        successStory: 'Sarah reduced her wardrobe from 200 to 50 pieces and now gets dressed in 5 minutes every morning.',
        relatedTasks: ['Capsule Wardrobe Challenge', 'Seasonal Closet Rotation', 'Accessory Minimization']
      },
      'Food': {
        completionRate: 85,
        avgTimeToComplete: '1-2 weeks',
        topTip: 'Focus on keeping tools you use weekly - if you haven\'t used it in a month, you probably don\'t need it.',
        successStory: 'Mike cleared 60% of his kitchen gadgets and now cooks more often because everything is easy to find.',
        relatedTasks: ['Pantry Organization', 'Meal Planning System', 'Counter Space Clearing']
      },
      'Technology': {
        completionRate: 72,
        avgTimeToComplete: '1 month',
        topTip: 'Use app timers and phone settings to create automatic boundaries - willpower alone isn\'t enough.',
        successStory: 'Emma reduced her screen time by 3 hours daily and started reading books again.',
        relatedTasks: ['Email Inbox Zero', 'App Audit', 'Social Media Cleanse']
      },
      'Home': {
        completionRate: 80,
        avgTimeToComplete: '2-4 weeks',
        topTip: 'Work on one room at a time and celebrate small wins to maintain momentum.',
        successStory: 'The Johnson family decluttered their entire home and now spend weekends exploring instead of cleaning.',
        relatedTasks: ['Room-by-Room Declutter', 'Storage System Setup', 'Paper Reduction']
      }
    };

    const defaultData = {
      completionRate: 75,
      avgTimeToComplete: '1-2 weeks',
      topTip: 'Start small and build momentum - consistency beats perfection every time.',
      successStory: 'Community members report feeling lighter and more focused after completing this task.',
      relatedTasks: ['Related Task 1', 'Related Task 2', 'Related Task 3']
    };

    return categoryData[task.category] || defaultData;
  };

  const taskData = getTaskData(task);
  const communityData = getCommunityData(task);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* What You'll Do */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">What You'll Do</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{taskData.whatYoullDo}</p>
            </div>

            {/* Why It Matters */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Why It Matters</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{taskData.whyItMatters}</p>
            </div>

            {/* Expected Outcome */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Expected Outcome</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{taskData.expectedOutcome}</p>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{task.points}</div>
                <div className="text-sm text-gray-600">Points Reward</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{task.timeEstimate}</div>
                <div className="text-sm text-gray-600">Time Needed</div>
              </div>
            </div>
          </div>
        );

      case 'steps':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Play className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Step-by-Step Guide</h3>
            </div>
            <div className="space-y-3">
              {taskData.steps.map((step: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            
            {/* Potential Challenges */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Potential Challenges</h4>
              <ul className="space-y-1">
                {taskData.challenges.map((challenge: string, index: number) => (
                  <li key={index} className="text-yellow-700 text-sm">• {challenge}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Benefits You'll Experience</h3>
            </div>
            <div className="grid gap-3">
              {taskData.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-green-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Long-term Impact */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Long-term Impact</h4>
              <p className="text-blue-700 text-sm">
                Completing this task contributes to your overall minimalism journey, creating lasting positive changes 
                in how you interact with your possessions and environment.
              </p>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Community Insights</h3>
            </div>
            
            {/* Community Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{communityData.completionRate}%</div>
                <div className="text-sm text-purple-700">Completion Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{communityData.avgTimeToComplete}</div>
                <div className="text-sm text-purple-700">Average Time</div>
              </div>
            </div>

            {/* Community Tip */}
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Community Tip
              </h4>
              <p className="text-yellow-700 text-sm">{communityData.topTip}</p>
            </div>

            {/* Success Story */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Success Story</h4>
              <p className="text-green-700 text-sm italic">"{communityData.successStory}"</p>
            </div>

            {/* Related Tasks */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Related Tasks</h4>
              <div className="space-y-2">
                {communityData.relatedTasks.map((relatedTask: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{relatedTask}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {task.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.difficulty === 'easy' ? 'bg-green-500' :
                  task.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {task.difficulty}
                </span>
                <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{task.timeEstimate}</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold leading-tight mb-2">
                {task.title}
              </h2>
              <p className="text-white/90 text-base">
                {task.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'steps', label: 'Step-by-Step', icon: Play },
              { id: 'benefits', label: 'Benefits', icon: Award },
              { id: 'community', label: 'Community', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === id
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {completed ? 'Task completed! Great work!' : 'Ready to start this task?'}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggleComplete(task.id);
                  onClose();
                }}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  completed
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;