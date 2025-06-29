import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CheckSquare, 
  BookOpen, 
  ShoppingBag, 
  Wand2, 
  User,
  Star,
  Award,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
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
import AIRoomDesigner from './components/AIRoomDesigner';
import UserProfile from './components/UserProfile';
import LevelProgress from './components/LevelProgress';
import BadgeDisplay from './components/BadgeDisplay';
import AchievementNotification from './components/AchievementNotification';
import { tasks, categories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products } from './data/products';
import { badges } from './data/badges';

type Tab = 'home' | 'tasks' | 'learn' | 'shop' | 'ai-designer';

function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, completeOnboarding } = useOnboarding();
  const { 
    userStats, 
    earnedBadges, 
    newBadges, 
    loading: scoringLoading, 
    completeTask, 
    readArticle, 
    dismissNewBadges 
  } = useScoring();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authFormLoading, setAuthFormLoading] = useState(false);
  const [onboardingFormLoading, setOnboardingFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<typeof tasks[0] | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<typeof recommendations[0] | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle authentication
  const handleAuth = async (email: string, password: string) => {
    setAuthFormLoading(true);
    setAuthError(null);
    
    try {
      const { error } = authMode === 'signup' 
        ? await signUp(email, password)
        : await signIn(email, password);
      
      if (error) {
        setAuthError(error.message);
      }
    } catch (error: any) {
      setAuthError(error.message || 'An unexpected error occurred');
    } finally {
      setAuthFormLoading(false);
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = async (answers: any[]) => {
    setOnboardingFormLoading(true);
    try {
      await completeOnboarding(answers);
    } catch (error: any) {
      console.error('Onboarding error:', error);
    } finally {
      setOnboardingFormLoading(false);
    }
  };

  // Handle task toggle
  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedTasks = new Set(completedTasks);
    
    if (completedTasks.has(taskId)) {
      newCompletedTasks.delete(taskId);
    } else {
      newCompletedTasks.add(taskId);
      if (userStats) {
        await completeTask(task);
      }
    }
    
    setCompletedTasks(newCompletedTasks);
  };

  // Handle recommendation toggle
  const handleRecommendationToggle = async (recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const newCompletedRecommendations = new Set(completedRecommendations);
    
    if (completedRecommendations.has(recommendationId)) {
      newCompletedRecommendations.delete(recommendationId);
    } else {
      newCompletedRecommendations.add(recommendationId);
      if (userStats) {
        await readArticle(recommendation);
      }
    }
    
    setCompletedRecommendations(newCompletedRecommendations);
  };

  // Filter tasks by category
  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  // Add completion status to tasks
  const tasksWithCompletion = filteredTasks.map(task => ({
    ...task,
    completed: completedTasks.has(task.id)
  }));

  // Add completion status to recommendations
  const recommendationsWithCompletion = recommendations.map(rec => ({
    ...rec,
    completed: completedRecommendations.has(rec.id),
    points: 25 // Base points for reading articles
  }));

  // Show loading spinner while checking auth and onboarding status
  if (authLoading || onboardingLoading || scoringLoading) {
    return <LoadingSpinner />;
  }

  // Show auth form if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center p-4">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          onToggleMode={() => {
            setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
            setAuthError(null);
          }}
          loading={authFormLoading}
          error={authError}
        />
      </div>
    );
  }

  // Show onboarding if user needs it
  if (needsOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        loading={onboardingFormLoading}
      />
    );
  }

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'ai-designer', label: 'AI Designer', icon: Wand2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                Welcome to Minixmal
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Your journey to intentional living starts here. Simplify your life, 
                one mindful choice at a time.
              </p>
            </div>

            {/* Stats Overview */}
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{userStats.tasks_completed}</p>
                      <p className="text-gray-600">Tasks Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{userStats.articles_read}</p>
                      <p className="text-gray-600">Articles Read</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{userStats.total_points}</p>
                      <p className="text-gray-600">Total Points</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Level Progress */}
            {userStats && (
              <LevelProgress totalPoints={userStats.total_points} />
            )}

            {/* Recent Badges */}
            {earnedBadges.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-yellow-500" />
                  Your Badges
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {earnedBadges.slice(0, 6).map((badge) => (
                    <BadgeDisplay
                      key={badge.id}
                      badge={badge}
                      size="medium"
                      earned={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveTab('tasks')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Start Tasks</h3>
                <p className="text-gray-600 text-sm">Begin your minimalism journey with guided tasks</p>
              </button>

              <button
                onClick={() => setActiveTab('learn')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Learn More</h3>
                <p className="text-gray-600 text-sm">Discover principles and tips for minimalist living</p>
              </button>

              <button
                onClick={() => setActiveTab('ai-designer')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Designer</h3>
                <p className="text-gray-600 text-sm">Transform your space with AI-powered design</p>
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Shop</h3>
                <p className="text-gray-600 text-sm">Discover quality products for minimalist living</p>
              </button>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Minimalism Tasks</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Complete these carefully designed tasks to transform your life through minimalism. 
                Each task is crafted to help you declutter, organize, and simplify.
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({tasks.length})
                </button>
                {categories.map((category) => {
                  const count = tasks.filter(task => task.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tasksWithCompletion.map((task, index) => (
                <div key={task.id} onClick={() => setSelectedTask(task)}>
                  <TaskCard
                    task={task}
                    index={index}
                    onToggle={handleTaskToggle}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'learn':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Learn Minimalism</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover the principles, tips, and wisdom that will guide your minimalism journey. 
                Each article is designed to inspire and educate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationsWithCompletion.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => setSelectedRecommendation(recommendation)}
                  onToggle={handleRecommendationToggle}
                />
              ))}
            </div>
          </div>
        );

      case 'shop':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Minimalist Shop</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover carefully curated products that support your minimalist lifestyle. 
                Quality over quantity, always.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );

      case 'ai-designer':
        return <AIRoomDesigner />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-white">Minixmal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:block">
              <UserProfile />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 border-t border-white/20">
                <UserProfile />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggle={handleTaskToggle}
        />
      )}

      {/* Recommendation Modal */}
      {selectedRecommendation && (
        <RecommendationModal
          recommendation={selectedRecommendation}
          isOpen={!!selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
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