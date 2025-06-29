import React from 'react';
import { X, Clock, Star, Award, Target, CheckCircle, Lightbulb } from 'lucide-react';
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
      case 'habit': return <CheckCircle className="w-5 h-5" />;
      case 'declutter': return <Star className="w-5 h-5" />;
      case 'mindset': return <Lightbulb className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'challenge': return 'bg-purple-500 text-white';
      case 'habit': return 'bg-blue-500 text-white';
      case 'declutter': return 'bg-green-500 text-white';
      case 'mindset': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTaskImage = (taskId: string) => {
    // Same image mapping as in TaskCard
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 sm:h-64">
          <img 
            src={getTaskImage(task.id)} 
            alt={task.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Task Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getTypeColor(task.type)}`}>
              {getTypeIcon(task.type)}
              <span className="capitalize">{task.type.replace('-', ' ')}</span>
            </span>
          </div>

          {/* Points Badge */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <Award className="w-5 h-5 text-white" />
            <span className="text-white font-bold">{task.points} pts</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {/* Title and Category */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                {task.category}
              </span>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{task.timeEstimate}</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {task.title}
            </h2>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Tips */}
          {task.tips && task.tips.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                Tips for Success
              </h3>
              <ul className="space-y-2">
                {task.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Indicator */}
          {task.progress !== undefined && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{task.progress}% complete</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 ${
                completed
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>{completed ? 'Mark as Incomplete' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;