import React, { useState } from 'react';
import {
  Search,
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
  TrendingUp,
  Users,
  Award,
  Calendar,
  CheckCircle,
  Lightbulb,
  Zap,
  Heart,
  Shield,
  Globe,
  Sparkles,
  Trophy,
  Medal,
  Crown,
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

type ViewType = 'home' | 'ai-designer' | 'learn' | 'score' | 'tasks' | 'auth';

function App() {
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const { profile, loading: onboardingLoading, needsOnboarding, completeOnboarding } = useOnboarding();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [pendingView, setPendingView] = useState<ViewType | null>(null); // Track which view user wanted to access
  const [activeTab, setActiveTab] = useState('All');
  const [taskList, setTaskList] = useState(tasks);
  const [recommendationList, setRecommendationList] = useState(
    recommendations.map(rec => ({ ...rec, completed: false, points: Math.floor(Math.random() * 50) + 25 }))
  );
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
      } else {
        // Successfully authenticated, go to pending view or home
        setActiveView(pendingView || 'home');
        setPendingView(null);
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

  const toggleRecommendation = (recommendationId: string) => {
    setRecommendationList((prev) =>
      prev.map((rec) =>
        rec.id === recommendationId ? { ...rec, completed: !rec.completed } : rec
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

  // Handle navigation with authentication check
  const handleNavigation = (view: ViewType) => {
    // If user is not authenticated and trying to access Learn or Tasks, show auth form
    if (!user && (view === 'learn' || view === 'tasks')) {
      setActiveView('auth');
      setPendingView(view); // Remember which view they wanted
      return;
    }
    
    setActiveView(view);
    setPendingView(null);
    setActiveTab('All');
    setSearchQuery('');
  };

  // Handle navigation from header (including when on auth page)
  const handleHeaderNavigation = (view: ViewType) => {
    // If user is not authenticated and trying to access Learn or Tasks, stay on auth page
    if (!user && (view === 'learn' || view === 'tasks')) {
      setActiveView('auth');
      setPendingView(view); // Remember which view they wanted
      return;
    }
    
    // For other views, navigate normally
    setActiveView(view);
    setPendingView(null);
    setActiveTab('All');
    setSearchQuery('');
  };

  // Handle sign in button click
  const handleSignInClick = () => {
    setActiveView('auth');
    setPendingView(null);
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
        ? recommendationList
        : recommendationList.filter((rec) => rec.category === activeTab);

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
      case 'learn':
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
      case 'score':
        return ['All Users', 'Friends', 'This Week', 'This Month', 'All Time'];
      case 'ai-designer':
      case 'home':
      case 'auth':
        return [];
      default:
        return ['All'];
    }
  };

  const completedTasks = taskList.filter((t) => t.completed).length;
  const totalTaskPoints = taskList
    .filter((t) => t.completed)
    .reduce((sum, task) => sum + task.points, 0);

  const completedRecommendations = recommendationList.filter((r) => r.completed).length;
  const totalRecommendationPoints = recommendationList
    .filter((r) => r.completed)
    .reduce((sum, rec) => sum + (rec.points || 0), 0);

  const totalPoints = totalTaskPoints + totalRecommendationPoints;

  // Mock leaderboard data
  const leaderboardData = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', points: 2450, tasksCompleted: 45, rank: 1, avatar: '👩‍💼', streak: 12 },
    { id: 2, name: 'Alex Johnson', email: 'alex@example.com', points: 2380, tasksCompleted: 42, rank: 2, avatar: '👨‍💻', streak: 8 },
    { id: 3, name: 'Maria Garcia', email: 'maria@example.com', points: 2290, tasksCompleted: 38, rank: 3, avatar: '👩‍🎨', streak: 15 },
    { id: 4, name: 'David Kim', email: 'david@example.com', points: 2150, tasksCompleted: 35, rank: 4, avatar: '👨‍🔬', streak: 6 },
    { id: 5, name: 'Emma Wilson', email: 'emma@example.com', points: 2080, tasksCompleted: 33, rank: 5, avatar: '👩‍🏫', streak: 9 },
    { id: 6, name: 'You', email: user?.email || 'you@example.com', points: totalPoints, tasksCompleted: completedTasks + completedRecommendations, rank: 6, avatar: '👤', streak: 4 },
    { id: 7, name: 'James Brown', email: 'james@example.com', points: 1950, tasksCompleted: 29, rank: 7, avatar: '👨‍🎯', streak: 3 },
    { id: 8, name: 'Lisa Wang', email: 'lisa@example.com', points: 1890, tasksCompleted: 27, rank: 8, avatar: '👩‍💼', streak: 7 },
  ].sort((a, b) => b.points - a.points).map((user, index) => ({ ...user, rank: index + 1 }));

  // Show loading spinner while checking auth state or onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <div className="relative">
        <LoadingSpinner />
        {/* Bolt Logo */}
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
        >
          <img
            src="/black_circle_360x360.png"
            alt="Powered by Bolt"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    );
  }

  // Show auth form if activeView is 'auth'
  if (activeView === 'auth') {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-6">
        {/* Header Card */}
        <div className="max-w-7xl mx-auto">
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
                    onClick={() => handleHeaderNavigation('home')}
                    className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                      activeView === 'home'
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleHeaderNavigation('ai-designer')}
                    className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                      activeView === 'ai-designer'
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    AI Designer
                  </button>
                  <button
                    onClick={() => handleHeaderNavigation('learn')}
                    className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                      pendingView === 'learn'
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => handleHeaderNavigation('tasks')}
                    className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                      pendingView === 'tasks'
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => handleHeaderNavigation('score')}
                    className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                      activeView === 'score'
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Score
                  </button>
                </div>

                {/* Right side - Sign In Button */}
                <div className="flex items-center space-x-4">
                  <button
                    className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white hover:bg-white/30 transition-colors font-semibold text-base"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex items-center justify-center">
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
        
        {/* Bolt Logo */}
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
        >
          <img
            src="/black_circle_360x360.png"
            alt="Powered by Bolt"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    );
  }

  // Show onboarding quiz if user needs to complete it
  if (user && needsOnboarding) {
    return (
      <div className="relative">
        <OnboardingQuiz
          onComplete={handleOnboardingComplete}
          loading={onboardingSubmitting}
        />
        
        {/* Bolt Logo */}
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
        >
          <img
            src="/black_circle_360x360.png"
            alt="Powered by Bolt"
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-6">
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

              {/* Center - View Toggle (Custom sorted order) */}
              <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1">
                <button
                  onClick={() => handleNavigation('home')}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                    activeView === 'home'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('ai-designer')}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                    activeView === 'ai-designer'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  AI Designer
                </button>
                <button
                  onClick={() => handleNavigation('learn')}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                    activeView === 'learn'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => handleNavigation('tasks')}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                    activeView === 'tasks'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => handleNavigation('score')}
                  className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                    activeView === 'score'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Score
                </button>
              </div>

              {/* Right side - User Menu */}
              <div className="flex items-center space-x-4">
                {user ? (
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
                ) : (
                  <button
                    onClick={handleSignInClick}
                    className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white hover:bg-white/30 transition-colors font-semibold text-base"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          {getTabsForView().length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {getTabsForView().map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 rounded-xl font-semibold text-base transition-all ${
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
        {activeView !== 'ai-designer' && activeView !== 'home' && activeView !== 'score' && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-base"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {activeView === 'home' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Minixmal</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Your comprehensive platform for embracing minimalism and creating a more intentional, peaceful life. 
                  Discover the power of less and unlock the freedom that comes with simplicity.
                </p>
              </div>

              {/* Feature Overview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Guided Tasks</h3>
                  <p className="text-gray-600 text-sm">Step-by-step challenges to declutter every area of your life</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Insights</h3>
                  <p className="text-gray-600 text-sm">Learn from minimalism principles and proven strategies</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">AI Designer</h3>
                  <p className="text-gray-600 text-sm">Transform your spaces with AI-powered minimalist design</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Score & Compete</h3>
                  <p className="text-gray-600 text-sm">Track your progress and compete with other minimalists</p>
                </div>
              </div>
            </div>

            {/* Progress Overview - Only show if user is logged in */}
            {user && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tasks Progress */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Your Tasks</h3>
                      <p className="text-gray-600">Decluttering challenges and habits</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-2xl">
                      <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-2xl">
                      <div className="text-2xl font-bold text-orange-600">{taskList.length - completedTasks}</div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round((completedTasks / taskList.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(completedTasks / taskList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{totalTaskPoints} points</span>
                    </div>
                    <button
                      onClick={() => setActiveView('tasks')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      View Tasks
                    </button>
                  </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Your Learning</h3>
                      <p className="text-gray-600">Insights and principles</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-2xl">
                      <div className="text-2xl font-bold text-green-600">{completedRecommendations}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-2xl">
                      <div className="text-2xl font-bold text-orange-600">{recommendationList.length - completedRecommendations}</div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round((completedRecommendations / recommendationList.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(completedRecommendations / recommendationList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{totalRecommendationPoints} points</span>
                    </div>
                    <button
                      onClick={() => setActiveView('learn')}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                    >
                      Start Learning
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveView('ai-designer')}
                  className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl text-white hover:scale-105 transition-transform shadow-lg"
                >
                  <Camera className="w-8 h-8 mb-3 mx-auto" />
                  <h4 className="font-bold mb-2">Transform Your Room</h4>
                  <p className="text-sm opacity-90">Upload a photo and get AI-powered minimalist design suggestions</p>
                </button>

                <button
                  onClick={() => handleNavigation('tasks')}
                  className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white hover:scale-105 transition-transform shadow-lg"
                >
                  <CheckCircle className="w-8 h-8 mb-3 mx-auto" />
                  <h4 className="font-bold mb-2">Start Decluttering</h4>
                  <p className="text-sm opacity-90">Begin with simple tasks to build momentum in your minimalism journey</p>
                </button>

                <button
                  onClick={() => handleNavigation('learn')}
                  className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white hover:scale-105 transition-transform shadow-lg"
                >
                  <Lightbulb className="w-8 h-8 mb-3 mx-auto" />
                  <h4 className="font-bold mb-2">Learn Principles</h4>
                  <p className="text-sm opacity-90">Discover the philosophy and practical wisdom behind minimalist living</p>
                </button>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
              <h3 className="text-3xl font-bold mb-6 text-center">Why Choose Minimalism?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Reduced Stress</h4>
                  <p className="text-white/90">Less clutter means less mental burden and more peace of mind in your daily life.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Financial Freedom</h4>
                  <p className="text-white/90">Mindful consumption leads to significant savings and better financial health.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Increased Focus</h4>
                  <p className="text-white/90">Simplified environments enhance productivity and help you focus on what truly matters.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'tasks' && user && (
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
                  {totalTaskPoints}
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

        {activeView === 'learn' && user && (
          <>
            {/* Stats Cards for Learn Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {completedRecommendations}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {recommendationList.length - completedRecommendations}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {totalRecommendationPoints}
                </div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((completedRecommendations / recommendationList.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredRecommendations().map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => handleRecommendationClick(recommendation)}
                  onToggle={toggleRecommendation}
                />
              ))}
            </div>
          </>
        )}

        {activeView === 'score' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Leaderboard & Statistics</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                See how you rank among fellow minimalists and track your progress over time.
              </p>
            </div>

            {/* Your Stats */}
            {user && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h3>
                  <p className="text-gray-600">Keep up the great work on your minimalism journey!</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{totalPoints}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{completedTasks + completedRecommendations}</div>
                    <div className="text-sm text-gray-600">Tasks Completed</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl">
                    <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">#{leaderboardData.find(u => u.name === 'You')?.rank || 6}</div>
                    <div className="text-sm text-gray-600">Global Rank</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Global Leaderboard</h3>
                  <p className="text-gray-600">Top minimalists from around the world</p>
                </div>
              </div>

              <div className="space-y-4">
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      user.name === 'You' 
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                        user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                        user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {user.rank === 1 ? <Crown className="w-6 h-6" /> :
                         user.rank === 2 ? <Medal className="w-6 h-6" /> :
                         user.rank === 3 ? <Award className="w-6 h-6" /> :
                         user.rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{user.name}</span>
                          {user.name === 'You' && (
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{user.tasksCompleted} tasks completed</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{user.points.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
                  Weekly Progress
                </h3>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-gray-600">{day}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8">{Math.floor(Math.random() * 10)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-green-600" />
                  Category Breakdown
                </h3>
                <div className="space-y-3">
                  {['Wardrobe', 'Digital', 'Home', 'Finance', 'Health'].map((category, index) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-600">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8">{Math.floor(Math.random() * 20)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'ai-designer' && <AIRoomDesigner />}

        {/* Empty State */}
        {((activeView === 'tasks' && user && getFilteredTasks().length === 0) ||
          (activeView === 'learn' && user &&
            getFilteredRecommendations().length === 0) ||
          (activeView === 'score' && getFilteredProducts().length === 0)) && (
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

      {/* Bolt Logo - Fixed Position */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
      >
        <img
          src="/black_circle_360x360.png"
          alt="Powered by Bolt"
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 opacity-80 hover:opacity-100 transition-opacity"
        />
      </a>
    </div>
  );
}

export default App;