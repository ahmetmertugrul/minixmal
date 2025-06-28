import React from 'react';
import { 
  CheckSquare, 
  BookOpen, 
  Trophy, 
  Camera, 
  Target, 
  TrendingUp, 
  Award,
  ArrowRight,
  Sparkles,
  Users,
  Clock
} from 'lucide-react';

interface HomePageProps {
  totalPoints: number;
  completedTasks: number;
  completedRecommendations: number;
  onNavigate: (tab: 'tasks' | 'learn' | 'score' | 'ai-designer') => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  totalPoints, 
  completedTasks, 
  completedRecommendations,
  onNavigate 
}) => {
  const features = [
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: 'Gamified Tasks',
      description: 'Complete minimalism challenges and earn points while building better habits.',
      color: 'from-blue-500 to-blue-700',
      action: () => onNavigate('tasks')
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Learn & Grow',
      description: 'Discover principles, tips, and insights from minimalism experts.',
      color: 'from-green-500 to-green-700',
      action: () => onNavigate('learn')
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI Room Designer',
      description: 'Transform your space with AI-powered minimalist room transformations.',
      color: 'from-purple-500 to-purple-700',
      action: () => onNavigate('ai-designer')
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Track Progress',
      description: 'Monitor your minimalism journey with detailed stats and achievements.',
      color: 'from-yellow-500 to-orange-600',
      action: () => onNavigate('score')
    }
  ];

  const quickStats = [
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Total Points',
      value: totalPoints,
      color: 'text-yellow-600'
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      label: 'Tasks Completed',
      value: completedTasks,
      color: 'text-green-600'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Articles Read',
      value: completedRecommendations,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight">
            Welcome to Your
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Minimalism Journey
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transform your life through intentional living. Complete tasks, learn principles, 
            and create spaces that spark joy while reducing overwhelm.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center justify-center space-x-3">
                <div className={stat.color}>
                  {stat.icon}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={feature.action}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
          >
            <div className="space-y-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Getting Started Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Begin with simple tasks, learn core principles, and gradually transform your relationship with possessions. 
              Every small step counts toward a more intentional life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Start Small</h3>
              <p className="text-sm text-gray-600">Begin with easy decluttering tasks to build momentum</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900">Learn Principles</h3>
              <p className="text-sm text-gray-600">Understand the philosophy behind minimalist living</p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900">Transform Spaces</h3>
              <p className="text-sm text-gray-600">Create peaceful, organized environments</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            <span>Start Your First Task</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Join the Minimalism Community
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              You're part of a growing community of people choosing intentional living over endless accumulation. 
              Every task completed and article read brings you closer to a more peaceful, purposeful life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-white/80 text-sm">Tasks Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-white/80 text-sm">Lives Simplified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Inspiration */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Daily Minimalism Tip</h3>
          <blockquote className="text-lg text-gray-700 italic max-w-2xl mx-auto leading-relaxed">
            "The things you own end up owning you. Choose consciously, live intentionally, 
            and create space for what truly matters in your life."
          </blockquote>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Updated daily</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;