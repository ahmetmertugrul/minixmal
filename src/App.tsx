import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Target, 
  BookOpen, 
  ShoppingBag, 
  Sparkles, 
  Trophy,
  DollarSign,
  User,
  Menu,
  X
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
import PricingPage from './components/PricingPage';
import UserProfile from './components/UserProfile';
import { tasks } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products } from './data/products';

type Page = 'home' | 'tasks' | 'learn' | 'shop' | 'ai-designer' | 'pricing';

function App() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { profile, loading: onboardingLoading, needsOnboarding, completeOnboarding } = useOnboarding();
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  // Task and recommendation state
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

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

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleRecommendation = (recommendationId: string) => {
    setCompletedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId);
      } else {
        newSet.add(recommendationId);
      }
      return newSet;
    });
  };

  const openRecommendationModal = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setShowRecommendationModal(true);
  };

  const closeRecommendationModal = () => {
    setShowRecommendationModal(false);
    setSelectedRecommendation(null);
  };

  // Calculate user score
  const totalPoints = completedTasks.size * 50 + completedRecommendations.size * 25;

  if (authLoading || onboardingLoading) {
    return <LoadingSpinner />;
  }

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

  const menuItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'tasks' as Page, label: 'Tasks', icon: Target },
    { id: 'learn' as Page, label: 'Learn', icon: BookOpen },
    { id: 'shop' as Page, label: 'Shop', icon: ShoppingBag },
    { id: 'ai-designer' as Page, label: 'AI Designer', icon: Sparkles },
    { id: 'pricing' as Page, label: 'Pricing', icon: DollarSign },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user.email.split('@')[0]}! 👋
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Continue your minimalism journey with personalized tasks and insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <Trophy className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Your Score</h3>
                  <p className="text-3xl font-bold">{totalPoints}</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <Target className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Tasks Done</h3>
                  <p className="text-3xl font-bold">{completedTasks.size}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                  <BookOpen className="w-8 h-8 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Articles Read</h3>
                  <p className="text-3xl font-bold">{completedRecommendations.size}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tasks.slice(0, 4).map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={{ ...task, completed: completedTasks.has(task.id) }}
                  index={index}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Minimalism Tasks</h2>
              <p className="text-white/80 text-lg">
                Complete tasks to earn points and build minimalist habits
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={{ ...task, completed: completedTasks.has(task.id) }}
                  index={index}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </div>
        );

      case 'learn':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Learn Minimalism</h2>
              <p className="text-white/80 text-lg">
                Discover principles, tips, and insights for minimalist living
              </p>
            </div>
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
                  onClick={() => openRecommendationModal(recommendation)}
                  onToggle={toggleRecommendation}
                />
              ))}
            </div>
          </div>
        );

      case 'shop':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Minimalist Shop</h2>
              <p className="text-white/80 text-lg">
                Curated products to support your minimalist lifestyle
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

      case 'pricing':
        return <PricingPage />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Minixmal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all ${
                      currentPage === item.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Score and User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                <Trophy className="w-5 h-5" />
                <span>{totalPoints}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
                {showUserProfile && (
                  <div className="absolute right-0 top-12 z-50">
                    <UserProfile />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-white/20">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      currentPage === item.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
                    <Trophy className="w-5 h-5" />
                    <span>{totalPoints}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserProfile(!showUserProfile);
                      setMobileMenuOpen(false);
                    }}
                    className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
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
          isOpen={showRecommendationModal}
          onClose={closeRecommendationModal}
        />
      )}

      {/* User Profile Overlay for Mobile */}
      {showUserProfile && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowUserProfile(false)}>
          <div className="absolute top-20 right-4">
            <UserProfile />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;