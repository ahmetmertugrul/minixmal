import React from 'react';
import { X, Clock, Target, Award, Star, CheckCircle, Lightbulb, TrendingUp, Users, Zap } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onToggle: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  task, 
  isOpen, 
  onClose,
  onToggle 
}) => {
  if (!isOpen) return null;

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

  const getTaskImage = (taskId: string) => {
    const imageMap: { [key: string]: string } = {
      '1': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      '2': 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
      '3': 'https://images.pexels.com/photos/4210864/pexels-photo-4210864.jpeg',
      '4': 'https://images.pexels.com/photos/1148960/pexels-photo-1148960.jpeg',
      '5': 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg',
      '6': 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg',
      '7': 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg',
      '8': 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      '9': 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg',
      '10': 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
      '11': 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
      '12': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      '13': 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
      '14': 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',
      '15': 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg',
      '16': 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
      '17': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
      '18': 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
      '19': 'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg',
      '20': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      '21': 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      '22': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '23': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      '24': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      '25': 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      '26': 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      '27': 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
      '28': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      '29': 'https://images.pexels.com/photos/5591728/pexels-photo-5591728.jpeg',
      '30': 'https://images.pexels.com/photos/6489664/pexels-photo-6489664.jpeg',
      '31': 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg',
      '32': 'https://images.pexels.com/photos/6621186/pexels-photo-6621186.jpeg',
      '33': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      '34': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
      '35': 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
      '36': 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg',
      '37': 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg',
      '38': 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg',
      '39': 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      '40': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      '41': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      '42': 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg',
      '43': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      '44': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '45': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      '46': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
      '47': 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
      '48': 'https://images.pexels.com/photos/2105493/pexels-photo-2105493.jpeg',
      '49': 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
      '50': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      '51': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      '52': 'https://images.unsplash.com/photo-1741466071728-cc5691bfb535',
      '53': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      '54': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '55': 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      '56': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      '57': 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg',
      '58': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      '59': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      '60': 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
      '61': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      '62': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      '63': 'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg',
      '64': 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg',
      '65': 'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg',
      '66': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      '67': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      '68': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '69': 'https://images.pexels.com/photos/2865901/pexels-photo-2865901.jpeg',
      '70': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    };

    return imageMap[taskId] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
  };

  const getDetailedSteps = (task: Task) => {
    const stepMap: { [key: string]: string[] } = {
      '1': [
        'Audit your current wardrobe and count all items',
        'Choose a color palette of 3-4 complementary colors',
        'Select 30 versatile pieces that mix and match',
        'Donate or sell items that don\'t fit your capsule',
        'Organize remaining pieces by category',
        'Test different outfit combinations',
        'Document your favorite combinations for easy reference'
      ],
      '2': [
        'Set up a donation bag in your closet',
        'Before buying anything new, choose one item to remove',
        'Take the removed item to donation immediately',
        'Keep a log of items in vs. items out',
        'Review your purchases monthly to ensure balance'
      ],
      '3': [
        'Sort clothes by season (spring/summer vs. fall/winter)',
        'Clean all off-season items before storing',
        'Use vacuum storage bags to save space',
        'Label storage containers clearly with contents',
        'Store in a cool, dry place away from direct sunlight',
        'Set calendar reminders for seasonal switches'
      ],
      '48': [
        'Assess your current fitness level and goals',
        'Choose 3-4 basic exercises you enjoy (push-ups, squats, walking)',
        'Start with 15-20 minutes, 3 times per week',
        'Focus on consistency over intensity',
        'Track your workouts in a simple log',
        'Gradually increase duration or frequency',
        'Listen to your body and rest when needed'
      ],
      '6': [
        'Gather all accessories in one place',
        'Keep only pieces that match your color palette',
        'Choose versatile items that work with multiple outfits',
        'Donate costume jewelry and trendy pieces',
        'Organize remaining accessories in clear containers',
        'Limit yourself to 1-2 pieces per outfit'
      ],
      '69': [
        'Choose a consistent time each day (morning recommended)',
        'Start with just 5 minutes of focused breathing',
        'Find a quiet, comfortable space',
        'Use a simple technique like counting breaths',
        'Don\'t judge your thoughts, just observe them',
        'Gradually increase to 10-15 minutes',
        'Track your practice to build the habit'
      ],
      '52': [
        'Clear your current creative space completely',
        'Keep only tools and supplies for active projects',
        'Ensure excellent lighting (natural light preferred)',
        'Organize supplies in labeled, accessible containers',
        'Create a clean, inspiring work surface',
        'Add one element of inspiration (plant, artwork)',
        'Establish a routine for maintaining the space'
      ]
    };

    return stepMap[task.id] || [
      'Assess your current situation honestly',
      'Set a clear goal for what you want to achieve',
      'Break the task into smaller, manageable steps',
      'Start with the easiest part to build momentum',
      'Focus on progress, not perfection',
      'Celebrate small wins along the way',
      'Maintain your new system with regular check-ins'
    ];
  };

  const getRecommendations = (task: Task) => {
    const recommendationMap: { [key: string]: string[] } = {
      '1': [
        'Invest in quality basics that will last years',
        'Choose natural fabrics like cotton, wool, and linen',
        'Ensure everything fits well - tailoring is worth it',
        'Take photos of favorite outfits for quick reference'
      ],
      '2': [
        'Be honest about what you actually wear',
        'Consider the cost per wear when making decisions',
        'Donate items in good condition to help others',
        'Wait 24 hours before making impulse purchases'
      ],
      '3': [
        'Use cedar blocks or lavender sachets to protect stored items',
        'Check stored items periodically for any issues',
        'Consider climate-controlled storage for valuable pieces',
        'Take inventory photos before storing'
      ],
      '48': [
        'Choose activities you genuinely enjoy',
        'Bodyweight exercises require no equipment',
        'Walking is one of the best forms of exercise',
        'Consistency beats intensity every time'
      ],
      '6': [
        'Quality over quantity applies especially to accessories',
        'Classic styles never go out of fashion',
        'Consider the maintenance required for each piece',
        'One statement piece is better than many small ones'
      ],
      '69': [
        'Meditation apps can provide guidance for beginners',
        'Even 5 minutes daily is better than 30 minutes weekly',
        'Focus on the breath when your mind wanders',
        'Be patient with yourself as you develop the practice'
      ],
      '52': [
        'Good lighting is essential for creative work',
        'Keep inspiration visible but not overwhelming',
        'Organize supplies by frequency of use',
        'A clean space promotes a clear mind'
      ]
    };

    return recommendationMap[task.id] || [
      'Start small and build momentum gradually',
      'Focus on systems rather than goals',
      'Be patient with yourself during the process',
      'Celebrate progress, not just completion'
    ];
  };

  const getBenefits = (task: Task) => {
    const benefitMap: { [key: string]: string[] } = {
      '1': [
        'Eliminate decision fatigue every morning',
        'Save money by buying fewer, better pieces',
        'Always look put-together and confident',
        'Reduce closet clutter and stress'
      ],
      '2': [
        'Prevent closet overflow and clutter',
        'Become more mindful about purchases',
        'Help others by donating quality items',
        'Maintain a curated, intentional wardrobe'
      ],
      '3': [
        'Reduce visual clutter in your closet',
        'Protect clothes from damage and wear',
        'Make seasonal transitions easier',
        'Create more space for current season items'
      ],
      '48': [
        'Improve physical and mental health',
        'Increase energy levels throughout the day',
        'Build confidence and self-discipline',
        'Reduce stress and improve sleep quality'
      ],
      '6': [
        'Simplify getting ready each day',
        'Ensure accessories always complement your style',
        'Reduce storage needs and clutter',
        'Focus on quality pieces that last'
      ],
      '69': [
        'Reduce stress and anxiety levels',
        'Improve focus and mental clarity',
        'Better emotional regulation',
        'Enhanced self-awareness and presence'
      ],
      '52': [
        'Boost creativity and inspiration',
        'Improve focus during creative work',
        'Reduce time spent looking for supplies',
        'Create a peaceful, inspiring environment'
      ]
    };

    return benefitMap[task.id] || [
      'Reduce stress and mental clutter',
      'Save time and energy',
      'Create more space for what matters',
      'Develop mindful, intentional habits'
    ];
  };

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
              <div className="flex items-center space-x-3">
                {getTypeIcon(task.type)}
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {task.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                    <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{task.timeEstimate}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">
                    {task.title}
                  </h2>
                </div>
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
          {/* Task Image */}
          <div className="mb-6">
            <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden">
              <img 
                src={getTaskImage(task.id)} 
                alt={task.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">About This Task</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Step-by-Step Guide */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-3">
              {getDetailedSteps(task).map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips & Recommendations */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
              Tips & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getRecommendations(task).map((tip, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-green-600" />
              Benefits You'll Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getBenefits(task).map((benefit, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm leading-relaxed">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points Reward */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Complete This Task</h3>
                <p className="text-gray-600">
                  Earn <span className="font-bold text-indigo-600">{task.points} points</span> when you complete this task
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-indigo-600" />
                <span className="text-2xl font-bold text-indigo-600">+{task.points}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Ready to start your minimalism journey with this task?
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggle(task.id);
                  onClose();
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  task.completed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                }`}
              >
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;