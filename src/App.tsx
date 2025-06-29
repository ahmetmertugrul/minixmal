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

const App: React.FC = () => {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, completeOnboarding } = useOnboarding();
  const { userStats, earnedBadges, newBadges, loading: scoringLoading, completeTask, readArticle, dismissNewBadges } = useScoring();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load ElevenLabs widget script
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="elevenlabs"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src*="elevenlabs"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleAuth = async (email: string, password: string) => {
    setAuthSubmitting(true);
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

  if (authLoading || onboardingLoading || scoringLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-4 sm:p-6 flex items-center justify-center">
        {/* ElevenLabs AI Agent Widget */}
        <elevenlabs-convai agent-id="agent_01jyy2fqh9ffgs6vmwqyfhrn1c"></elevenlabs-convai>
        
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
      <>
        {/* ElevenLabs AI Agent Widget */}
        <elevenlabs-convai agent-id="agent_01jyy2fqh9ffgs6vmwqyfhrn1c"></elevenlabs-convai>
        
        <OnboardingQuiz
          onComplete={handleOnboardingComplete}
          loading={onboardingSubmitting}
        />
      </>
    );
  }

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const tasksWithCompletion = filteredTasks.map(task => ({
    ...task,
    completed: completedTasks.has(task.id)
  }));

  const recommendationsWithCompletion = recommendations.map(rec => ({
    ...rec,
    completed: completedRecommendations.has(rec.id),
    points: 25
  }));

  const completedTasksCount = completedTasks.size;
  const totalTasks = tasks.length;
  const completedRecommendationsCount = completedRecommendations.size;
  const totalRecommendations = recommendations.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Welcome to Minixmal
              </h1>
              <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
                Your journey to intentional living starts here. Simplify your life, one mindful choice at a time.
              </p>
            </div>

            {/* Stats Overview */}
            {userStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{completedTasksCount}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Tasks Completed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{completedRecommendationsCount}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Articles Read</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{userStats.total_points.toLocaleString()}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Total Points</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{earnedBadges.length}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Badges Earned</p>
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
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Badges</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
                  {earnedBadges.slice(0, 8).map((badge) => (
                    <BadgeDisplay
                      key={badge.id}
                      badge={badge}
                      size="small"
                      earned={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <button
                onClick={() => setActiveTab('tasks')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02] text-left group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Complete Tasks</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {totalTasks - completedTasksCount} tasks remaining
                </p>
              </button>

              <button
                onClick={() => setActiveTab('learn')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02] text-left group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Learn & Grow</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {totalRecommendations - completedRecommendationsCount} articles to read
                </p>
              </button>

              <button
                onClick={() => setActiveTab('ai-designer')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-[1.02] text-left group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">AI Room Designer</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Transform your space with AI
                </p>
              </button>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Minimalism Tasks</h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Complete these curated tasks to build your minimalist lifestyle. Each task is designed to simplify and enhance your daily life.
              </p>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Your Progress</h3>
                <span className="text-sm sm:text-base text-gray-600">
                  {completedTasksCount} of {totalTasks} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(completedTasksCount / totalTasks) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {((completedTasksCount / totalTasks) * 100).toFixed(1)}% complete
              </p>
            </div>

            {/* Category Filter */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Filter by Category</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 sm:px-4 py-2 rounded-2xl font-medium transition-all text-xs sm:text-sm ${
                    selectedCategory === 'All'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({totalTasks})
                </button>
                {categories.map((category) => {
                  const categoryCount = tasks.filter(task => task.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 sm:px-4 py-2 rounded-2xl font-medium transition-all text-xs sm:text-sm ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category} ({categoryCount})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {tasksWithCompletion.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={handleTaskToggle}
                />
              ))}
            </div>
          </div>
        );

      case 'learn':
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Learn Minimalism</h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Discover principles, tips, and insights to deepen your understanding of minimalist living.
              </p>
            </div>

            {/* Progress Overview */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Reading Progress</h3>
                <span className="text-sm sm:text-base text-gray-600">
                  {completedRecommendationsCount} of {totalRecommendations} read
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(completedRecommendationsCount / totalRecommendations) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {((completedRecommendationsCount / totalRecommendations) * 100).toFixed(1)}% complete
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Minimalist Shop</h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Curated products that align with minimalist principles. Quality over quantity, always.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
      {/* ElevenLabs AI Agent Widget */}
      <elevenlabs-convai agent-id="agent_01jyy2fqh9ffgs6vmwqyfhrn1c"></elevenlabs-convai>
      
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Minixmal</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                { id: 'learn', label: 'Learn', icon: BookOpen },
                { id: 'shop', label: 'Shop', icon: ShoppingBag },
                { id: 'ai-designer', label: 'AI Designer', icon: Wand2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as Tab)}
                  className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-2xl font-medium transition-all text-sm lg:text-base ${
                    activeTab === id
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* User Stats (Desktop) */}
              {userStats && (
                <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
                  <div className="flex items-center space-x-1 lg:space-x-2 bg-white/20 backdrop-blur-sm px-2 lg:px-3 py-1 lg:py-2 rounded-2xl">
                    <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-300" />
                    <span className="text-white font-semibold text-xs lg:text-sm">
                      {userStats.total_points.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 lg:space-x-2 bg-white/20 backdrop-blur-sm px-2 lg:px-3 py-1 lg:py-2 rounded-2xl">
                    <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-300" />
                    <span className="text-white font-semibold text-xs lg:text-sm">
                      Level {userStats.level}
                    </span>
                  </div>
                </div>
              )}

              {/* User Menu */}
              <div className="relative">
                <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="flex flex-col space-y-2">
                {[
                  { id: 'home', label: 'Home', icon: Home },
                  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                  { id: 'learn', label: 'Learn', icon: BookOpen },
                  { id: 'shop', label: 'Shop', icon: ShoppingBag },
                  { id: 'ai-designer', label: 'AI Designer', icon: Wand2 },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all text-left ${
                      activeTab === id
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Mobile User Stats */}
              {userStats && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-2xl">
                      <Star className="w-4 h-4 text-yellow-300" />
                      <span className="text-white font-semibold text-sm">
                        {userStats.total_points.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-2xl">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-white font-semibold text-sm">
                        Level {userStats.level}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {renderTabContent()}
      </main>

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
          key={badge.id}
          badge={badge}
          points={badge.points_reward}
          isVisible={true}
          onClose={dismissNewBadges}
          autoClose={true}
          duration={5000 + (index * 1000)} // Stagger multiple notifications
        />
      ))}
    </div>
  );
};

export default App;