import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CheckSquare, 
  BookOpen, 
  Wand2, 
  ShoppingBag, 
  User,
  Menu,
  X,
  Star,
  Award
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { useScoring } from './hooks/useScoring';
import AuthForm from './components/AuthForm';
import OnboardingQuiz from './components/OnboardingQuiz';
import LoadingSpinner from './components/LoadingSpinner';
import UserProfile from './components/UserProfile';
import TaskCard from './components/TaskCard';
import RecommendationCard from './components/RecommendationCard';
import RecommendationModal from './components/RecommendationModal';
import ProductCard from './components/ProductCard';
import AIRoomDesigner from './components/AIRoomDesigner';
import PointsDisplay from './components/PointsDisplay';
import LevelProgress from './components/LevelProgress';
import BadgeDisplay from './components/BadgeDisplay';
import AchievementNotification from './components/AchievementNotification';
import MinixmalLogo from './components/MinixmalLogo';
import { tasks, categories as taskCategories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products, categories as productCategories } from './data/products';
import { badges } from './data/badges';
import { OnboardingAnswer } from './types/onboarding';
import { Recommendation } from './data/recommendations';

type Page = 'home' | 'tasks' | 'learn' | 'ai-designer' | 'shop' | 'profile';

function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { profile, loading: onboardingLoading, needsOnboarding, completeOnboarding } = useOnboarding();
  const { userStats, earnedBadges, newBadges, loading: scoringLoading, completeTask, readArticle, transformRoom, dismissNewBadges } = useScoring();
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<string>('All');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('All');

  // Show loading spinner while checking auth state
  if (authLoading || onboardingLoading || scoringLoading) {
    return <LoadingSpinner />;
  }

  // Show auth form if user is not authenticated
  if (!user) {
    const handleAuthSubmit = async (email: string, password: string) => {
      setAuthSubmitting(true);
      setAuthError(null);
      
      try {
        const { error } = authMode === 'signup' 
          ? await signUp(email, password)
          : await signIn(email, password);
        
        if (error) {
          setAuthError(error.message);
        }
      } catch (err) {
        setAuthError('An unexpected error occurred');
      } finally {
        setAuthSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center p-4">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuthSubmit}
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          loading={authSubmitting}
          error={authError}
        />
      </div>
    );
  }

  // Show onboarding if user needs it
  if (needsOnboarding) {
    const handleOnboardingComplete = async (answers: OnboardingAnswer[]) => {
      setOnboardingSubmitting(true);
      try {
        await completeOnboarding(answers);
      } catch (error) {
        console.error('Onboarding error:', error);
      } finally {
        setOnboardingSubmitting(false);
      }
    };

    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        loading={onboardingSubmitting}
      />
    );
  }

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = new Set(completedTasks);
    if (completedTasks.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      await completeTask(task);
    }
    setCompletedTasks(newCompleted);
  };

  const handleRecommendationToggle = async (recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const newCompleted = new Set(completedRecommendations);
    if (completedRecommendations.has(recommendationId)) {
      newCompleted.delete(recommendationId);
    } else {
      newCompleted.add(recommendationId);
      await readArticle(recommendation);
    }
    setCompletedRecommendations(newCompleted);
  };

  const handleLogoClick = () => {
    setCurrentPage('home');
    setMobileMenuOpen(false);
  };

  const filteredTasks = selectedTaskCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedTaskCategory);

  const filteredProducts = selectedProductCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedProductCategory);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Welcome to Your Minimalism Journey
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Simplify your life, one intentional choice at a time. Track your progress, 
                learn new concepts, and transform your spaces with AI.
              </p>
            </div>

            {/* Stats Overview */}
            {userStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LevelProgress totalPoints={userStats.total_points} size="medium" />
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Your Progress</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasks Completed</span>
                      <span className="font-bold text-gray-900">{userStats.tasks_completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Articles Read</span>
                      <span className="font-bold text-gray-900">{userStats.articles_read}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rooms Transformed</span>
                      <span className="font-bold text-gray-900">{userStats.rooms_transformed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-bold text-gray-900">{userStats.streak_days} days</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-500" />
                    <span>Recent Badges</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {earnedBadges.slice(-6).map((badge) => (
                      <BadgeDisplay
                        key={badge.id}
                        badge={badge}
                        size="small"
                        showDetails={false}
                        earned={true}
                      />
                    ))}
                    {earnedBadges.length === 0 && (
                      <div className="col-span-3 text-center text-gray-500 text-sm py-4">
                        Complete tasks to earn badges!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setCurrentPage('tasks')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <CheckSquare className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Tasks</h3>
                <p className="text-gray-600 text-sm">Gamified challenges to simplify your life</p>
              </button>

              <button
                onClick={() => setCurrentPage('learn')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <BookOpen className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Learn & Grow</h3>
                <p className="text-gray-600 text-sm">Discover minimalism principles and tips</p>
              </button>

              <button
                onClick={() => setCurrentPage('ai-designer')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <Wand2 className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Designer</h3>
                <p className="text-gray-600 text-sm">Transform your rooms with AI assistance</p>
              </button>

              <button
                onClick={() => setCurrentPage('shop')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:scale-105 transition-all text-left group"
              >
                <ShoppingBag className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mindful Shop</h3>
                <p className="text-gray-600 text-sm">Curated minimalist products and tools</p>
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
                Complete gamified challenges to build minimalist habits and earn points.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedTaskCategory('All')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedTaskCategory === 'All'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                All
              </button>
              {taskCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedTaskCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedTaskCategory === category
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={{
                    ...task,
                    completed: completedTasks.has(task.id)
                  }}
                  index={index}
                  onToggle={handleTaskToggle}
                />
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
                Discover principles, tips, and wisdom to guide your minimalism journey.
              </p>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={{
                    ...recommendation,
                    completed: completedRecommendations.has(recommendation.id),
                    points: 25
                  }}
                  index={index}
                  onClick={() => setSelectedRecommendation(recommendation)}
                  onToggle={handleRecommendationToggle}
                />
              ))}
            </div>
          </div>
        );

      case 'ai-designer':
        return <AIRoomDesigner />;

      case 'shop':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Mindful Marketplace</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Curated products to support your minimalist lifestyle with quality over quantity.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedProductCategory('All')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedProductCategory === 'All'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                All
              </button>
              {productCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedProductCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedProductCategory === category
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Your Profile</h2>
              <p className="text-white/80 text-lg">
                Track your progress and achievements on your minimalism journey.
              </p>
            </div>

            {userStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LevelProgress totalPoints={userStats.total_points} size="large" />
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">All Badges</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {badges.map((badge) => {
                      const earned = earnedBadges.some(eb => eb.id === badge.id);
                      return (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          size="small"
                          showDetails={false}
                          earned={earned}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

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
            <MinixmalLogo 
              size="medium" 
              showText={true} 
              onClick={handleLogoClick}
            />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'home'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('tasks')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'tasks'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('learn')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'learn'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('ai-designer')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'ai-designer'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Designer</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('shop')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'shop'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </button>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {/* Points Display */}
              {userStats && (
                <PointsDisplay 
                  points={userStats.total_points} 
                  size="medium"
                />
              )}

              {/* Profile Button */}
              <button
                onClick={() => setCurrentPage('profile')}
                className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'profile'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => { setCurrentPage('tasks'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
              </button>
              <button
                onClick={() => { setCurrentPage('learn'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Learn</span>
              </button>
              <button
                onClick={() => { setCurrentPage('ai-designer'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Designer</span>
              </button>
              <button
                onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop</span>
              </button>
              <button
                onClick={() => { setCurrentPage('profile'); setMobileMenuOpen(false); }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
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
          onClose={() => {
            if (index === newBadges.length - 1) {
              dismissNewBadges();
            }
          }}
        />
      ))}
    </div>
  );
}

export default App;