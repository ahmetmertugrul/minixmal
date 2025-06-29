import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Target, 
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
import TaskDetailModal from './components/TaskDetailModal';
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
  const { userStats, earnedBadges, newBadges, loading: scoringLoading, completeTask, readArticle, dismissNewBadges } = useScoring();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedArticles, setCompletedArticles] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle authentication
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
    } catch (error: any) {
      setAuthError(error.message || 'An unexpected error occurred');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle onboarding completion
  const handleOnboardingComplete = async (answers: any[]) => {
    setOnboardingSubmitting(true);
    try {
      await completeOnboarding(answers);
    } catch (error: any) {
      console.error('Onboarding error:', error);
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  // Handle task completion
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

  // Handle article completion
  const handleArticleToggle = async (articleId: string) => {
    const article = recommendations.find(r => r.id === articleId);
    if (!article) return;

    const newCompletedArticles = new Set(completedArticles);
    
    if (completedArticles.has(articleId)) {
      newCompletedArticles.delete(articleId);
    } else {
      newCompletedArticles.add(articleId);
      if (userStats) {
        await readArticle(article);
      }
    }
    
    setCompletedArticles(newCompletedArticles);
  };

  // Handle task card click
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle recommendation card click
  const handleRecommendationClick = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setIsRecommendationModalOpen(true);
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
    completed: completedArticles.has(rec.id),
    points: 25
  }));

  // Show loading spinner
  if (authLoading || onboardingLoading || scoringLoading) {
    return <LoadingSpinner />;
  }

  // Show authentication form
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-4 flex items-center justify-center">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          onToggleMode={() => {
            setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
            setAuthError(null);
          }}
          loading={authSubmitting}
          error={authError}
        />
      </div>
    );
  }

  // Show onboarding
  if (needsOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        loading={onboardingSubmitting}
      />
    );
  }

  const navigation = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: Target },
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                Welcome to Minixmal
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
                Your journey to intentional living starts here. Discover the freedom that comes with less.
              </p>
            </div>

            {/* Stats Overview */}
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.tasks_completed}</div>
                  <div className="text-gray-600">Tasks Completed</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.articles_read}</div>
                  <div className="text-gray-600">Articles Read</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.total_points}</div>
                  <div className="text-gray-600">Total Points</div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{userStats.streak_days}</div>
                  <div className="text-gray-600">Day Streak</div>
                </div>
              </div>
            )}

            {/* Level Progress */}
            {userStats && (
              <LevelProgress totalPoints={userStats.total_points} />
            )}

            {/* Recent Badges */}
            {earnedBadges.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
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
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Minimalism Tasks
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                Transform your life one intentional action at a time. Each task brings you closer to the freedom of less.
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
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
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tasksWithCompletion.map((task, index) => (
                <div key={task.id} onClick={() => handleTaskClick(task)}>
                  <TaskCard
                    task={task}
                    index={index}
                    onToggle={handleTaskToggle}
                  />
                </div>
              ))}
            </div>

            {/* Task Detail Modal */}
            <TaskDetailModal
              task={selectedTask}
              isOpen={isTaskModalOpen}
              onClose={() => setIsTaskModalOpen(false)}
              onToggleComplete={handleTaskToggle}
            />
          </div>
        );

      case 'learn':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Learn Minimalism
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                Discover principles, tips, and wisdom to guide your minimalist journey.
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {recommendationsWithCompletion.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => handleRecommendationClick(recommendation)}
                  onToggle={handleArticleToggle}
                />
              ))}
            </div>

            {/* Recommendation Modal */}
            <RecommendationModal
              recommendation={selectedRecommendation}
              isOpen={isRecommendationModalOpen}
              onClose={() => setIsRecommendationModalOpen(false)}
            />
          </div>
        );

      case 'shop':
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Minimalist Shop
              </h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                Curated products that align with minimalist principles. Quality over quantity, always.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <UserProfile />
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as Tab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        activeTab === item.id
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <UserProfile />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

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