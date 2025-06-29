import React, { useState, useEffect } from 'react';
import { Sparkles, Target, BookOpen, Home, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { useScoring } from './hooks/useScoring';
import AuthForm from './components/AuthForm';
import OnboardingQuiz from './components/OnboardingQuiz';
import LoadingSpinner from './components/LoadingSpinner';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import RecommendationCard from './components/RecommendationCard';
import RecommendationModal from './components/RecommendationModal';
import ProductCard from './components/ProductCard';
import LevelProgress from './components/LevelProgress';
import UserProfile from './components/UserProfile';
import AchievementNotification from './components/AchievementNotification';
import AIRoomDesigner from './components/AIRoomDesigner';
import { tasks, categories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products } from './data/products';
import { Task } from './data/tasks';
import { Recommendation } from './data/recommendations';

type ActiveTab = 'tasks' | 'learn' | 'shop' | 'ai-designer';

function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { profile, loading: onboardingLoading, needsOnboarding, completeOnboarding } = useOnboarding();
  const { userStats, earnedBadges, newBadges, loading: scoringLoading, completeTask, readArticle, transformRoom, dismissNewBadges } = useScoring();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tasks');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [taskStates, setTaskStates] = useState<{ [key: string]: boolean }>({});
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize task states from localStorage
  useEffect(() => {
    if (user) {
      const savedStates = localStorage.getItem(`taskStates_${user.id}`);
      if (savedStates) {
        setTaskStates(JSON.parse(savedStates));
      }
      
      const savedRecommendations = localStorage.getItem(`completedRecommendations_${user.id}`);
      if (savedRecommendations) {
        setCompletedRecommendations(new Set(JSON.parse(savedRecommendations)));
      }
    }
  }, [user]);

  // Save task states to localStorage
  useEffect(() => {
    if (user && Object.keys(taskStates).length > 0) {
      localStorage.setItem(`taskStates_${user.id}`, JSON.stringify(taskStates));
    }
  }, [taskStates, user]);

  // Save completed recommendations to localStorage
  useEffect(() => {
    if (user && completedRecommendations.size > 0) {
      localStorage.setItem(`completedRecommendations_${user.id}`, JSON.stringify([...completedRecommendations]));
    }
  }, [completedRecommendations, user]);

  const handleAuth = async (email: string, password: string) => {
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const { error } = authMode === 'signup' 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setAuthError(error.message);
      }
    } catch (error) {
      setAuthError('An unexpected error occurred');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleOnboardingComplete = async (answers: any[]) => {
    setOnboardingSubmitting(true);
    try {
      await completeOnboarding(answers);
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newState = !taskStates[taskId];
    setTaskStates(prev => ({ ...prev, [taskId]: newState }));

    if (newState) {
      await completeTask({ ...task, completed: true });
    }
  };

  const handleRecommendationToggle = async (recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const newCompletedSet = new Set(completedRecommendations);
    
    if (completedRecommendations.has(recommendationId)) {
      newCompletedSet.delete(recommendationId);
    } else {
      newCompletedSet.add(recommendationId);
      await readArticle(recommendation);
    }
    
    setCompletedRecommendations(newCompletedSet);
  };

  const handleOpenTaskModal = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskModal = () => {
    setSelectedTask(null);
  };

  const handleOpenRecommendationModal = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
  };

  const handleCloseRecommendationModal = () => {
    setSelectedRecommendation(null);
  };

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const tasksWithState = filteredTasks.map(task => ({
    ...task,
    completed: taskStates[task.id] || false
  }));

  const recommendationsWithState = recommendations.map(rec => ({
    ...rec,
    completed: completedRecommendations.has(rec.id),
    points: 25
  }));

  if (authLoading || onboardingLoading || scoringLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center p-4">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          loading={authSubmitting}
          error={authError}
        />
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        loading={onboardingSubmitting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Minixmal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'tasks' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="font-medium">Tasks</span>
              </button>
              <button
                onClick={() => setActiveTab('learn')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'learn' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Learn</span>
              </button>
              <button
                onClick={() => setActiveTab('ai-designer')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'ai-designer' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">AI Designer</span>
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'shop' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium">Shop</span>
              </button>
            </div>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <UserProfile />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('tasks');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'tasks' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Tasks</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('learn');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'learn' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Learn</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('ai-designer');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'ai-designer' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">AI Designer</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('shop');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'shop' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="font-medium">Shop</span>
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <UserProfile />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Level Progress */}
        {userStats && (
          <div className="mb-6 sm:mb-8">
            <LevelProgress totalPoints={userStats.total_points} />
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Your Minimalism Journey
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Complete tasks to earn points, unlock achievements, and transform your life through intentional living.
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all text-sm sm:text-base ${
                    selectedCategory === 'All'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({tasks.length})
                </button>
                {categories.map(category => {
                  const count = tasks.filter(task => task.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all text-sm sm:text-base ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {tasksWithState.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={handleTaskToggle}
                  onClick={() => handleOpenTaskModal(task)}
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Learn Minimalism
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Discover principles, tips, and insights to deepen your understanding of minimalist living.
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendationsWithState.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => handleOpenRecommendationModal(recommendation)}
                  onToggle={handleRecommendationToggle}
                />
              ))}
            </div>
          </div>
        )}

        {/* AI Designer Tab */}
        {activeTab === 'ai-designer' && <AIRoomDesigner />}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Minimalist Marketplace
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Curated products that align with minimalist principles - quality over quantity.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Task Modal - ONLY ADDITION */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={handleCloseTaskModal}
          onToggle={handleTaskToggle}
        />
      )}

      {/* Recommendation Modal */}
      {selectedRecommendation && (
        <RecommendationModal
          recommendation={selectedRecommendation}
          isOpen={!!selectedRecommendation}
          onClose={handleCloseRecommendationModal}
        />
      )}

      {/* Achievement Notifications */}
      {newBadges.map((badge, index) => (
        <AchievementNotification
          key={`${badge.id}-${index}`}
          badge={badge}
          points={badge.points_reward}
          isVisible={true}
          onClose={dismissNewBadges}
          autoClose={true}
          duration={5000}
        />
      ))}
    </div>
  );
}

export default App;