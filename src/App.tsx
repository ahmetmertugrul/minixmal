import React, { useState } from 'react';
import {
  Search,
  Bell,
  User,
  Star,
  BarChart3,
  ShoppingBag,
  BookOpen,
  Home,
  Target,
  Filter,
  Pause,
  Play,
  Menu,
  X,
  Camera,
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { tasks, categories as taskCategories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products, categories as productCategories } from './data/products';
import TaskCard from './components/TaskCard';
import RecommendationCard from './components/RecommendationCard';
import RecommendationModal from './components/RecommendationModal';
import ProductCard from './components/ProductCard';
import AuthForm from './components/AuthForm';
import LoadingSpinner from './components/LoadingSpinner';
import UserProfile from './components/UserProfile';
import OnboardingQuiz from './components/OnboardingQuiz';
import AIRoomDesigner from './components/AIRoomDesigner';
import { Recommendation } from './data/recommendations';

type ViewType = 'tasks' | 'recommendations' | 'store' | 'ai-designer';

function App() {
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const { profile, loading: onboardingLoading, needsOnboarding, completeOnboarding } = useOnboarding();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  
  const [activeView, setActiveView] = useState<ViewType>('tasks');
  const [activeTab, setActiveTab] = useState('All');
  const [taskList, setTaskList] = useState(tasks);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state for recommendations
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAuth = async (email: string, password: string) => {
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
    }
  };

  const handleOnboardingComplete = async (answers: any[]) => {
    setOnboardingSubmitting(true);
    try {
      await completeOnboarding(answers);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // You might want to show an error message to the user here
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecommendation(null);
  };

  const getFilteredTasks = () => {
    let filtered =
      activeTab === 'All'
        ? taskList
        : taskList.filter((task) => task.category === activeTab);

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getFilteredRecommendations = () => {
    let filtered =
      activeTab === 'All'
        ? recommendations
        : recommendations.filter((rec) => rec.category === activeTab);

    if (searchQuery) {
      filtered = filtered.filter(
        (rec) =>
          rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getFilteredProducts = () => {
    let filtered =
      activeTab === 'All'
        ? products
        : products.filter((product) => product.category === activeTab);

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getTabsForView = () => {
    switch (activeView) {
      case 'tasks':
        return ['All', ...taskCategories];
      case 'recommendations':
        return [
          'All',
          'Decluttering',
          'Mindset',
          'Digital',
          'Kitchen',
          'Wardrobe',
          'Lifestyle',
          'Organization',
        ];
      case 'store':
        return ['All', ...productCategories];
      case 'ai-designer':
        return [];
      default:
        return ['All'];
    }
  };

  const completedTasks = taskList.filter((t) => t.completed).length;
  const totalPoints = taskList
    .filter((t) => t.completed)
    .reduce((sum, task) => sum + task.points, 0);

  // Show loading spinner while checking auth state or onboarding status
  if (authLoading || onboardingLoading) {
    return <LoadingSpinner />;
  }

  // Show auth form if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-6 flex items-center justify-center">
        <AuthForm
          mode={authMode}
          onSubmit={handleAuth}
          onToggleMode={() => {
            setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
            setAuthError(null);
          }}
          loading={false}
          error={authError}
        />
      </div>
    );
  }

  // Show onboarding quiz if user needs to complete it
  if (needsOnboarding) {
    return (
      <OnboardingQuiz
        onComplete={handleOnboardingComplete}
        loading={onboardingSubmitting}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-between w-full">
              {/* Left side - Logo and Title */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Pause className="w-6 h-6 text-yellow-800" />
                </div>
                <h1 className="text-3xl font-bold text-white">Minixmal</h1>
              </div>

              {/* Center - View Toggle */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1">
                <button
                  onClick={() => {
                    setActiveView('tasks');
                    setActiveTab('All');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    activeView === 'tasks'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => {
                    setActiveView('recommendations');
                    setActiveTab('All');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    activeView === 'recommendations'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setActiveTab('All');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    activeView === 'store'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Store
                </button>
                <button
                  onClick={() => {
                    setActiveView('ai-designer');
                    setActiveTab('All');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    activeView === 'ai-designer'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  AI Designer
                </button>
              </div>

              {/* Right side - User Menu */}
              <div className="flex items-center space-x-4">
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserProfile(!showUserProfile)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {showUserProfile && (
                    <div className="absolute top-12 right-0 z-50">
                      <UserProfile />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          {getTabsForView().length > 0 && (
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {getTabsForView().map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        {activeView !== 'ai-designer' && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {activeView === 'tasks' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {completedTasks}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {taskList.length - completedTasks}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {totalPoints}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((completedTasks / taskList.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>

            {/* Task Grid - Uniform 4-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredTasks().map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={toggleTask}
                />
              ))}
            </div>
          </>
        )}

        {activeView === 'recommendations' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Minimalism Insights
              </h2>
              <p className="text-white/80 text-lg">
                Discover principles, tips, and wisdom to guide your minimalist
                journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredRecommendations().map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => handleRecommendationClick(recommendation)}
                />
              ))}
            </div>
          </>
        )}

        {activeView === 'store' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Minimalist Store
              </h2>
              <p className="text-white/80 text-lg">
                Curated products to support your minimalist lifestyle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredProducts().map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {activeView === 'ai-designer' && <AIRoomDesigner />}

        {/* Empty State */}
        {((activeView === 'tasks' && getFilteredTasks().length === 0) ||
          (activeView === 'recommendations' &&
            getFilteredRecommendations().length === 0) ||
          (activeView === 'store' && getFilteredProducts().length === 0)) && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No results found
            </h3>
            <p className="text-white/70 text-lg">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Recommendation Modal */}
      {selectedRecommendation && (
        <RecommendationModal
          recommendation={selectedRecommendation}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}

      {/* Click outside to close user profile */}
      {showUserProfile && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
}

export default App;