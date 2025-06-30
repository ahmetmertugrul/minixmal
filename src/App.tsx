import React, { useState, useEffect } from 'react';
import { Sparkles, Target, BookOpen, Trophy, User, Home, Wand2, ShoppingBag, Zap, LogIn, LogOut, CreditCard, Shield } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useOnboarding } from './hooks/useOnboarding';
import { useScoring } from './hooks/useScoring';
import { useSubscription } from './hooks/useSubscription';
import { useAdmin } from './hooks/useAdmin';
import AuthForm from './components/AuthForm';
import OnboardingQuiz from './components/OnboardingQuiz';
import LoadingSpinner from './components/LoadingSpinner';
import TaskCard from './components/TaskCard';
import TaskDetailModal from './components/TaskDetailModal';
import RecommendationCard from './components/RecommendationCard';
import RecommendationModal from './components/RecommendationModal';
import ProductCard from './components/ProductCard';
import AIRoomDesigner from './components/AIRoomDesigner';
import LevelProgress from './components/LevelProgress';
import BadgeDisplay from './components/BadgeDisplay';
import AchievementNotification from './components/AchievementNotification';
import UserProfile from './components/UserProfile';
import PricingPage from './components/PricingPage';
import UpgradePrompt from './components/UpgradePrompt';
import AdminPanel from './components/AdminPanel';
import { tasks, categories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products, categories as productCategories } from './data/products';
import { badges } from './data/badges';
import { Task } from './data/tasks';
import { Recommendation } from './data/recommendations';

type TabType = 'home' | 'ai-designer' | 'learn' | 'tasks' | 'score' | 'pricing' | 'admin';

const App: React.FC = () => {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, completeOnboarding } = useOnboarding();
  const { 
    userStats, 
    earnedBadges, 
    newBadges, 
    loading: scoringLoading, 
    completeTask, 
    uncompleteTask,
    readArticle, 
    unreadArticle,
    dismissNewBadges,
    resetUserStats
  } = useScoring();
  const { currentPlan, canAccessContent, hasFeature, loading: subscriptionLoading, isAdmin } = useSubscription();
  const { adminUser, loading: adminLoading } = useAdmin();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('All');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [upgradePrompt, setUpgradePrompt] = useState<{
    show: boolean;
    feature: string;
    description: string;
  }>({ show: false, feature: '', description: '' });

  // Initialize with empty sets and reset stats when user first loads
  useEffect(() => {
    if (user && userStats) {
      // Check if this is a fresh user or if stats need to be reset
      const hasAnyCompletedItems = completedTasks.size > 0 || completedRecommendations.size > 0;
      const hasStatsButNoCompletions = (userStats.tasks_completed > 0 || userStats.articles_read > 0 || userStats.total_points > 0) && !hasAnyCompletedItems;
      
      if (hasStatsButNoCompletions) {
        // Reset stats to match the actual completion state (all zeros)
        resetUserStats();
      }
    }
  }, [user, userStats, completedTasks.size, completedRecommendations.size]);

  // Load completed items from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('completedTasks');
    const savedRecommendations = localStorage.getItem('completedRecommendations');
    
    if (savedTasks) {
      setCompletedTasks(new Set(JSON.parse(savedTasks)));
    }
    if (savedRecommendations) {
      setCompletedRecommendations(new Set(JSON.parse(savedRecommendations)));
    }
  }, []);

  // Save completed items to localStorage
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('completedRecommendations', JSON.stringify([...completedRecommendations]));
  }, [completedRecommendations]);

  // Close user profile when clicking outside or when user changes
  useEffect(() => {
    if (!user) {
      setShowUserProfile(false);
    }
  }, [user]);

  const handleAuth = async (email: string, password: string) => {
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const { error } = authMode === 'signup' 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setAuthError(error.message);
      } else {
        // Successfully signed in, close auth form and go to home
        setShowAuthForm(false);
        setActiveTab('home');
      }
    } catch (err) {
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

  const handleSignOut = async () => {
    try {
      console.log('App: Starting sign out process...');
      console.log('App: Current user before sign out:', user?.email);
      
      // Close user profile dropdown immediately
      setShowUserProfile(false);
      
      // Call the signOut function from useAuth
      await signOut();
      
      // Go to home page after sign out
      setActiveTab('home');
      
      console.log('App: Sign out completed successfully');
    } catch (error) {
      console.error('App: Sign out error:', error);
    }
  };

  const handleSignInClick = () => {
    setShowAuthForm(true);
    setAuthMode('signin');
  };

  const handleUpgradePrompt = (feature: string, description: string) => {
    // Don't show upgrade prompt for admins
    if (isAdmin) return;
    setUpgradePrompt({ show: true, feature, description });
  };

  const handleUpgrade = () => {
    setUpgradePrompt({ show: false, feature: '', description: '' });
    setActiveTab('pricing');
  };

  const handleTabClick = (tab: TabType) => {
    // Pricing page is always accessible to everyone
    if (tab === 'pricing') {
      setActiveTab(tab);
      return;
    }

    // Check if user needs to sign in for other protected tabs
    if (!user) {
      if (tab === 'ai-designer' || tab === 'tasks' || tab === 'learn' || tab === 'score' || tab === 'admin') {
        handleSignInClick();
        return;
      }
    } else {
      // Check AI Designer access (skip for admins)
      if (tab === 'ai-designer' && !hasFeature('aiDesigner') && !isAdmin) {
        handleUpgradePrompt(
          'AI Room Designer',
          'Transform your space with AI-powered minimalist design recommendations and step-by-step action plans.'
        );
        return;
      }
      
      // Check admin access
      if (tab === 'admin' && !isAdmin) {
        return; // Don't allow access to admin panel for non-admins
      }
    }
    
    setActiveTab(tab);
  };

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedTasks = new Set(completedTasks);
    
    if (completedTasks.has(taskId)) {
      // Task is being uncompleted - remove from completed set and deduct points/stats
      newCompletedTasks.delete(taskId);
      if (userStats) {
        await uncompleteTask(task);
      }
    } else {
      // Task is being completed - add to completed set and award points
      newCompletedTasks.add(taskId);
      if (userStats) {
        await completeTask(task);
      }
    }
    
    setCompletedTasks(newCompletedTasks);
  };

  const handleTaskCardClick = (task: Task) => {
    // Only open modal if task is not completed
    if (!completedTasks.has(task.id)) {
      setSelectedTask(task);
    }
  };

  const handleRecommendationToggle = async (recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return;

    const newCompletedRecommendations = new Set(completedRecommendations);
    
    if (completedRecommendations.has(recommendationId)) {
      // Article is being uncompleted - remove from completed set and deduct points/stats
      newCompletedRecommendations.delete(recommendationId);
      if (userStats) {
        await unreadArticle(recommendation);
      }
    } else {
      // Article is being completed - add to completed set and award points
      newCompletedRecommendations.add(recommendationId);
      if (userStats) {
        await readArticle(recommendation);
      }
    }
    
    setCompletedRecommendations(newCompletedRecommendations);
  };

  // Filter content based on subscription
  const getFilteredTasks = () => {
    let filtered = selectedCategory === 'All' 
      ? tasks 
      : tasks.filter(task => task.category === selectedCategory);
    
    // Apply subscription limits (skip for admins)
    if (user && !canAccessContent('tasks', filtered.length) && !isAdmin) {
      const limit = currentPlan.limits.tasks as number;
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  const getFilteredRecommendations = () => {
    let filtered = recommendations;
    
    // Apply subscription limits (skip for admins)
    if (user && !canAccessContent('articles', filtered.length) && !isAdmin) {
      const limit = currentPlan.limits.articles as number;
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const filteredRecommendations = getFilteredRecommendations();
  const filteredProducts = selectedProductCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedProductCategory);

  const tasksWithCompletion = filteredTasks.map(task => ({
    ...task,
    completed: completedTasks.has(task.id)
  }));

  const recommendationsWithCompletion = filteredRecommendations.map(rec => ({
    ...rec,
    completed: completedRecommendations.has(rec.id),
    points: 25 // Base points for reading an article
  }));

  // Show loading spinner while checking authentication
  if (authLoading || onboardingLoading || scoringLoading || subscriptionLoading || adminLoading) {
    return (
      <div>
        <LoadingSpinner />
        
        {/* Custom Logo - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-40">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:scale-105 transition-transform duration-200"
          >
            <img
              src="/black_circle_360x360 copy.png"
              alt="Powered by Bolt"
              className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            />
          </a>
        </div>
      </div>
    );
  }

  // Show login form if user clicked sign in
  if (showAuthForm && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
        {/* Header - Show even on login page */}
        <div className="p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Main Header Container */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Minixmal</h1>
                </div>

                {/* Navigation Pills */}
                <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleSignInClick()}
                    className="px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    AI Designer
                  </button>
                  <button
                    onClick={() => handleSignInClick()}
                    className="px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => handleSignInClick()}
                    className="px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => handleSignInClick()}
                    className="px-4 py-2 rounded-xl font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Score
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === 'pricing'
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Pricing
                  </button>
                </div>

                {/* Back to Home Button */}
                <button
                  onClick={() => {
                    setShowAuthForm(false);
                    setActiveTab('home');
                  }}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl font-semibold hover:bg-white/30 transition-colors shadow-lg flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex items-center justify-center p-4">
          <AuthForm
            mode={authMode}
            onSubmit={handleAuth}
            onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            loading={authSubmitting}
            error={authError}
          />
        </div>

        {/* Custom Logo - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-40">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:scale-105 transition-transform duration-200"
          >
            <img
              src="/black_circle_360x360 copy.png"
              alt="Powered by Bolt"
              className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            />
          </a>
        </div>
      </div>
    );
  }

  // Show onboarding if user needs it
  if (user && needsOnboarding) {
    return (
      <div>
        <OnboardingQuiz
          onComplete={handleOnboardingComplete}
          loading={onboardingSubmitting}
        />
        
        {/* Custom Logo - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-40">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:scale-105 transition-transform duration-200"
          >
            <img
              src="/black_circle_360x360 copy.png"
              alt="Powered by Bolt"
              className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            />
          </a>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                Welcome to Minixmal
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Your journey to intentional living starts here. Discover the freedom that comes with less.
              </p>
              {/* Admin Badge */}
              {isAdmin && (
                <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-full shadow-lg">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Administrator</span>
                </div>
              )}
            </div>

            {/* What is Minimalism Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">What is Minimalism?</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Minimalism is about living intentionally with less. It's not about deprivation—it's about 
                    making room for what truly matters by removing the excess that distracts us from our values, 
                    relationships, and personal growth.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By embracing minimalism, you'll discover more time, energy, and mental clarity to focus on 
                    experiences, relationships, and pursuits that bring genuine fulfillment to your life.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits of Minimalism</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Reduced stress and anxiety</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">More time for what matters</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Financial freedom</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Improved focus and clarity</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Environmental consciousness</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How Minixmal Works */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">How Minixmal Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Tasks</h3>
                  <p className="text-gray-600">
                    Work through 70+ carefully designed minimalism tasks that guide you step-by-step 
                    through decluttering and simplifying different areas of your life.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Learn & Grow</h3>
                  <p className="text-gray-600">
                    Discover minimalism principles, tips, and insights through our curated collection 
                    of articles that deepen your understanding and motivation.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                  <p className="text-gray-600">
                    Earn points, unlock badges, and level up as you progress. Our gamified approach 
                    makes minimalism engaging and rewarding.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => handleTabClick('tasks')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Start Tasks</h3>
                <p className="text-gray-600">Begin your minimalism journey with guided tasks</p>
                {user && (
                  <p className="text-sm text-indigo-600 mt-2">
                    {isAdmin ? 'All tasks available (Admin)' : 
                     currentPlan.limits.tasks === 'unlimited' ? 'All tasks available' : `${currentPlan.limits.tasks} tasks available`}
                  </p>
                )}
              </button>

              <button
                onClick={() => handleTabClick('ai-designer')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Room Designer</h3>
                <p className="text-gray-600">Transform your space with AI-powered design</p>
                {user && !hasFeature('aiDesigner') && !isAdmin && (
                  <p className="text-sm text-orange-600 mt-2">Pro feature - Upgrade to unlock</p>
                )}
                {user && isAdmin && (
                  <p className="text-sm text-green-600 mt-2">Available (Admin Access)</p>
                )}
              </button>

              <button
                onClick={() => handleTabClick('learn')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Learn & Grow</h3>
                <p className="text-gray-600">Discover minimalism principles and tips</p>
                {user && (
                  <p className="text-sm text-indigo-600 mt-2">
                    {isAdmin ? 'All articles available (Admin)' :
                     currentPlan.limits.articles === 'unlimited' ? 'All articles available' : `${currentPlan.limits.articles} articles available`}
                  </p>
                )}
              </button>
            </div>

            {/* Call to Action for non-logged in users */}
            {!user && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
                <p className="text-gray-600 mb-6">Join thousands of people who have simplified their lives with Minixmal</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleSignInClick}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Get Started Today
                  </button>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="bg-white/80 text-indigo-600 px-8 py-3 rounded-2xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    View Pricing
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'ai-designer':
        return user ? <AIRoomDesigner /> : <div>Please sign in to access AI Room Designer</div>;

      case 'learn':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Learn Minimalism</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover principles, tips, and insights to guide your minimalism journey
              </p>
              {user && currentPlan.limits.articles !== 'unlimited' && !isAdmin && (
                <p className="text-white/70 text-sm mt-2">
                  Showing {Math.min(filteredRecommendations.length, currentPlan.limits.articles as number)} of {recommendations.length} articles
                  {currentPlan.limits.articles !== 'unlimited' && (
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="ml-2 text-yellow-300 hover:text-yellow-200 underline"
                    >
                      Upgrade for all articles
                    </button>
                  )}
                </p>
              )}
              {user && isAdmin && (
                <p className="text-green-300 text-sm mt-2">
                  All {recommendations.length} articles available (Admin Access)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationsWithCompletion.map((recommendation, index) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  index={index}
                  onClick={() => setSelectedRecommendation(recommendation)}
                  onToggle={user ? handleRecommendationToggle : () => handleSignInClick()}
                />
              ))}
            </div>
          </div>
        );

      case 'tasks':
        return user ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Minimalism Tasks</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Complete tasks to earn points and build your minimalist lifestyle
              </p>
              {currentPlan.limits.tasks !== 'unlimited' && !isAdmin && (
                <p className="text-white/70 text-sm mt-2">
                  Showing {Math.min(filteredTasks.length, currentPlan.limits.tasks as number)} of {tasks.length} tasks
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="ml-2 text-yellow-300 hover:text-yellow-200 underline"
                  >
                    Upgrade for all tasks
                  </button>
                </p>
              )}
              {isAdmin && (
                <p className="text-green-300 text-sm mt-2">
                  All {tasks.length} tasks available (Admin Access)
                </p>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
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
              {tasksWithCompletion.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onToggle={handleTaskToggle}
                  onCardClick={handleTaskCardClick}
                />
              ))}
            </div>
          </div>
        ) : <div>Please sign in to access tasks</div>;

      case 'score':
        return user && userStats ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Your Progress</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Track your minimalism journey and celebrate achievements
              </p>
            </div>

            {/* Stats Overview - Moved from Home page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.tasks_completed}</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.articles_read}</div>
                <div className="text-sm text-gray-600">Articles Read</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.total_points}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{userStats.streak_days}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Level Progress */}
              <LevelProgress totalPoints={userStats.total_points} />

              {/* Badges Earned */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                  Badges Earned ({earnedBadges.length})
                </h3>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                    {earnedBadges.map((badge) => (
                      <BadgeDisplay
                        key={badge.id}
                        badge={badge}
                        size="small"
                        earned={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No badges earned yet</p>
                    <p className="text-sm text-gray-400 mt-1">Complete tasks and earn points to unlock badges!</p>
                  </div>
                )}
              </div>
            </div>

            {/* All Badges */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">All Badges</h3>
              
              {/* Badge Categories */}
              <div className="space-y-8">
                {/* Points Milestone Badges */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-indigo-600 mr-2" />
                    Points Milestones
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {badges.filter(badge => badge.requirements.type === 'points').map((badge) => {
                      const earned = earnedBadges.some(eb => eb.id === badge.id);
                      const progress = userStats ? userStats.total_points : 0;
                      return (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          size="small"
                          earned={earned}
                          progress={progress}
                          maxProgress={badge.requirements.value}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Task Completion Badges */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    Task Achievements
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {badges.filter(badge => badge.requirements.type === 'tasks').map((badge) => {
                      const earned = earnedBadges.some(eb => eb.id === badge.id);
                      const progress = userStats ? userStats.tasks_completed : 0;
                      return (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          size="small"
                          earned={earned}
                          progress={progress}
                          maxProgress={badge.requirements.value}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Learning Badges */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                    Learning Journey
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {badges.filter(badge => badge.requirements.type === 'articles').map((badge) => {
                      const earned = earnedBadges.some(eb => eb.id === badge.id);
                      const progress = userStats ? userStats.articles_read : 0;
                      return (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          size="small"
                          earned={earned}
                          progress={progress}
                          maxProgress={badge.requirements.value}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Streak Badges */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Zap className="w-5 h-5 text-orange-600 mr-2" />
                    Consistency Streaks
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {badges.filter(badge => badge.requirements.type === 'streak').map((badge) => {
                      const earned = earnedBadges.some(eb => eb.id === badge.id);
                      const progress = userStats ? userStats.streak_days : 0;
                      return (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          size="small"
                          earned={earned}
                          progress={progress}
                          maxProgress={badge.requirements.value}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Special Badges */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                    Special Achievements
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {badges.filter(badge => badge.category === 'special' || badge.category === 'mastery').map((badge) => {
                      const earned = earnedBadges.some(eb => eb.id === badge.id);
                      return (
                        <BadgeDisplay
                          key={badge.id}
                          badge={badge}
                          size="small"
                          earned={earned}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : <div>Please sign in to view your progress</div>;

      case 'pricing':
        return <PricingPage />;

      case 'admin':
        return user && isAdmin ? <AdminPanel /> : <div>Access denied. Admin privileges required.</div>;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Header Container */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Minixmal</h1>
              </div>

              {/* Navigation Pills - Show for all users */}
              <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'home'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleTabClick('ai-designer')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'ai-designer'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  AI Designer
                </button>
                <button
                  onClick={() => handleTabClick('learn')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'learn'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => handleTabClick('tasks')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'tasks'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => handleTabClick('score')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'score'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Score
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Pricing
                </button>
                {/* Admin Button - Only show for admins */}
                {isAdmin && (
                  <button
                    onClick={() => handleTabClick('admin')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === 'admin'
                        ? 'bg-white text-blue-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    {/* User Profile Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserProfile(!showUserProfile)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg ${
                          isAdmin ? 'bg-purple-600/40 ring-2 ring-purple-400' : 'bg-white/20'
                        }`}
                      >
                        {isAdmin ? <Shield className="w-5 h-5 sm:w-6 sm:h-6" /> : <User className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>
                      
                      {showUserProfile && (
                        <div className="absolute right-0 top-14 z-50">
                          <UserProfile onSignOut={handleSignOut} />
                        </div>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl font-semibold hover:bg-white/30 transition-colors shadow-lg flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignInClick}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-2xl font-semibold hover:bg-white/30 transition-colors shadow-lg flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Show for all users */}
      <div className="md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20 px-4 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'home' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => handleTabClick('ai-designer')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'ai-designer' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Wand2 className="w-5 h-5" />
            <span className="text-xs mt-1">AI</span>
          </button>
          <button
            onClick={() => handleTabClick('learn')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'learn' ? 'text-white' : 'text-white/60'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs mt-1">Learn</span>
          </button>
          <button
            onClick={() => handleTabClick('tasks')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'tasks' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-xs mt-1">Tasks</span>
          </button>
          <button
            onClick={() => handleTabClick('score')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'score' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs mt-1">Score</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'pricing' ? 'text-white' : 'text-white/60'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs mt-1">Pricing</span>
          </button>
          {/* Admin Button for Mobile */}
          {isAdmin && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                activeTab === 'admin' ? 'text-white' : 'text-white/60'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs mt-1">Admin</span>
            </button>
          )}
          {/* Auth buttons for mobile */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex flex-col items-center py-2 px-3 rounded-lg text-white/60"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs mt-1">Out</span>
            </button>
          ) : (
            <button
              onClick={handleSignInClick}
              className="flex flex-col items-center py-2 px-3 rounded-lg text-white/60"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-xs mt-1">In</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Custom Logo - Bottom Right - ENLARGED */}
      <div className="fixed bottom-4 right-4 z-40">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:scale-105 transition-transform duration-200"
        >
          <img
            src="/black_circle_360x360 copy.png"
            alt="Powered by Bolt"
            className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
          />
        </a>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggleComplete={handleTaskToggle}
          completed={completedTasks.has(selectedTask.id)}
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

      {/* Upgrade Prompt - Don't show for admins */}
      {upgradePrompt.show && !isAdmin && (
        <UpgradePrompt
          feature={upgradePrompt.feature}
          description={upgradePrompt.description}
          onUpgrade={handleUpgrade}
          onClose={() => setUpgradePrompt({ show: false, feature: '', description: '' })}
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