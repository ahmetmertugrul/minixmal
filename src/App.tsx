import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  BookOpen, 
  ShoppingBag, 
  Camera, 
  Trophy,
  Menu,
  X,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import AuthForm from './components/AuthForm';
import OnboardingQuiz from './components/OnboardingQuiz';
import LoadingSpinner from './components/LoadingSpinner';
import TaskCard from './components/TaskCard';
import RecommendationCard from './components/RecommendationCard';
import RecommendationModal from './components/RecommendationModal';
import ProductCard from './components/ProductCard';
import AIRoomDesigner from './components/AIRoomDesigner';
import UserProfile from './components/UserProfile';
import { tasks, categories as taskCategories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products, categories as productCategories } from './data/products';
import { Task } from './data/tasks';
import { Recommendation } from './data/recommendations';
import { OnboardingAnswer } from './types/onboarding';

type TabType = 'tasks' | 'learn' | 'score' | 'ai-designer';

const App: React.FC = () => {
  const { user, loading: authLoading, signUp, signIn, signOut, resetPassword } = useAuth();
  const { profile, loading: onboardingLoading, needsOnboarding, completeOnboarding } = useOnboarding();
  
  // UI State
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitLoading, setAuthSubmitLoading] = useState(false);
  const [onboardingSubmitLoading, setOnboardingSubmitLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Tasks State
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<string>('All');

  // Learn State
  const [selectedLearnCategory, setSelectedLearnCategory] = useState<string>('All');
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  // Score State
  const [selectedScoreCategory, setSelectedScoreCategory] = useState<string>('All');

  // Calculate user stats
  const completedTasks = taskList.filter(task => task.completed).length;
  const totalPoints = taskList.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);
  const completedRecommendationsCount = completedRecommendations.size;

  // Auth handlers
  const handleAuth = async (email: string, password: string) => {
    setAuthSubmitLoading(true);
    setAuthError(null);
    
    try {
      const { error } = authMode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password);
      
      if (error) {
        setAuthError(error.message);
      }
    } catch (error) {
      setAuthError('An unexpected error occurred');
    } finally {
      setAuthSubmitLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    const { error } = await resetPassword(email);
    if (error) {
      throw new Error(error.message);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setAuthError(null);
  };

  // Onboarding handler
  const handleOnboardingComplete = async (answers: OnboardingAnswer[]) => {
    setOnboardingSubmitLoading(true);
    try {
      await completeOnboarding(answers);
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setOnboardingSubmitLoading(false);
    }
  };

  // Task handlers
  const toggleTask = (taskId: string) => {
    setTaskList(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = selectedTaskCategory === 'All' 
    ? taskList 
    : taskList.filter(task => task.category === selectedTaskCategory);

  // Learn handlers
  const toggleRecommendation = (id: string) => {
    setCompletedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredRecommendations = selectedLearnCategory === 'All'
    ? recommendations
    : recommendations.filter(rec => rec.category === selectedLearnCategory);

  const recommendationsWithCompletion = filteredRecommendations.map(rec => ({
    ...rec,
    completed: completedRecommendations.has(rec.id),
    points: 25
  }));

  // Score handlers
  const filteredProducts = selectedScoreCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedScoreCategory);

  // Loading states
  if (authLoading || onboardingLoading) {
    return <LoadingSpinner />;
  }

  // Auth flow
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-4 sm:p-6 flex items-center justify-center">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          onToggleMode={toggleAuthMode}
          onForgotPassword={handleForgotPassword}
          loading={authSubmitLoading}
          error={authError}
        />
      </div>
    );
  }

  // Onboarding flow
  if (needsOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        loading={onboardingSubmitLoading}
      />
    );
  }

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'tasks': return <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'learn': return <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'score': return <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'ai-designer': return <Camera className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'tasks': return 'Tasks';
      case 'learn': return 'Learn';
      case 'score': return 'Score';
      case 'ai-designer': return 'AI Designer';
    }
  };

  const tabs: TabType[] = ['tasks', 'learn', 'score', 'ai-designer'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img 
                src="/logo.png" 
                alt="Minixmal Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Minixmal
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getTabIcon(tab)}
                  <span>{getTabLabel(tab)}</span>
                </button>
              ))}
            </nav>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* User Stats (Desktop) */}
              <div className="hidden sm:flex items-center space-x-4 text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{totalPoints}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  <span>{completedTasks}</span>
                </div>
              </div>

              {/* User Profile Button */}
              <div className="relative">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="flex items-center space-x-2 p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-600" />
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                
                {showUserProfile && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <UserProfile />
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {getTabIcon(tab)}
                    <span className="text-sm">{getTabLabel(tab)}</span>
                  </button>
                ))}
              </div>
              
              {/* Mobile User Stats */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{totalPoints} points</span>
                </div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  <span>{completedTasks} completed</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Minimalism Tasks</h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Complete tasks to earn points and build your minimalist lifestyle. Start with easy wins and work your way up!
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {['All', ...taskCategories].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedTaskCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-2xl font-semibold transition-all text-xs sm:text-sm ${
                      selectedTaskCategory === category
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </div>
        )}

        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Learn Minimalism</h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Discover principles, tips, and insights to deepen your minimalism practice. Read articles and earn points!
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {['All', 'Decluttering', 'Mindset', 'Technology', 'Finance', 'Lifestyle', 'Organization', 'Work', 'Wardrobe', 'Food', 'Home', 'Relationships', 'Environment', 'Habits', 'Health', 'Creativity', 'Travel'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedLearnCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-2xl font-semibold transition-all text-xs sm:text-sm ${
                      selectedLearnCategory === category
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendationsWithCompletion.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => setSelectedRecommendation(recommendation)}
                  onToggle={toggleRecommendation}
                />
              ))}
            </div>

            {/* Recommendation Modal */}
            {selectedRecommendation && (
              <RecommendationModal
                recommendation={selectedRecommendation}
                isOpen={!!selectedRecommendation}
                onClose={() => setSelectedRecommendation(null)}
              />
            )}
          </div>
        )}

        {/* Score Tab */}
        {activeTab === 'score' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Minimalist Score</h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Discover curated minimalist products and tools to support your journey. Quality over quantity, always.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 text-center">
                <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalPoints}</div>
                <div className="text-gray-600 text-sm sm:text-base">Total Points</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 text-center">
                <CheckSquare className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{completedTasks}</div>
                <div className="text-gray-600 text-sm sm:text-base">Tasks Completed</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 text-center">
                <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{completedRecommendationsCount}</div>
                <div className="text-gray-600 text-sm sm:text-base">Articles Read</div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {['All', ...productCategories].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedScoreCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-2xl font-semibold transition-all text-xs sm:text-sm ${
                      selectedScoreCategory === category
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* AI Designer Tab */}
        {activeTab === 'ai-designer' && <AIRoomDesigner />}
      </main>

      {/* Click outside to close user profile */}
      {showUserProfile && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
};

export default App;