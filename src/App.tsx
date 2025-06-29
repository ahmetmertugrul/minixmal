import React, { useState, useEffect } from 'react';
import { Sparkles, Target, BookOpen, Trophy, User, Home, Wand2, ShoppingBag, Zap } from 'lucide-react';
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
import LevelProgress from './components/LevelProgress';
import BadgeDisplay from './components/BadgeDisplay';
import AchievementNotification from './components/AchievementNotification';
import UserProfile from './components/UserProfile';
import { tasks, categories } from './data/tasks';
import { recommendations } from './data/recommendations';
import { products, categories as productCategories } from './data/products';
import { badges } from './data/badges';
import { Task } from './data/tasks';
import { Recommendation } from './data/recommendations';

type TabType = 'home' | 'ai-designer' | 'learn' | 'tasks' | 'score';

const App: React.FC = () => {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { needsOnboarding, loading: onboardingLoading, completeOnboarding } = useOnboarding();
  const { userStats, earnedBadges, newBadges, loading: scoringLoading, completeTask, readArticle, dismissNewBadges } = useScoring();

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

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompletedTasks = new Set(completedTasks);
    
    if (completedTasks.has(taskId)) {
      // Task is being uncompleted - remove from completed set
      newCompletedTasks.delete(taskId);
      // Note: Points are not deducted when uncompleting tasks
      // This prevents gaming the system by repeatedly completing/uncompleting
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
      newCompletedRecommendations.delete(recommendationId);
    } else {
      newCompletedRecommendations.add(recommendationId);
      // Award points for reading article
      if (userStats) {
        await readArticle(recommendation);
      }
    }
    
    setCompletedRecommendations(newCompletedRecommendations);
  };

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const filteredProducts = selectedProductCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedProductCategory);

  const tasksWithCompletion = filteredTasks.map(task => ({
    ...task,
    completed: completedTasks.has(task.id)
  }));

  const recommendationsWithCompletion = recommendations.map(rec => ({
    ...rec,
    completed: completedRecommendations.has(rec.id),
    points: 25 // Base points for reading an article
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
            </div>

            {/* Stats Overview */}
            {userStats && (
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
            )}

            {/* Level Progress */}
            {userStats && (
              <LevelProgress totalPoints={userStats.total_points} />
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveTab('tasks')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Start Tasks</h3>
                <p className="text-gray-600">Begin your minimalism journey with guided tasks</p>
              </button>

              <button
                onClick={() => setActiveTab('ai-designer')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Room Designer</h3>
                <p className="text-gray-600">Transform your space with AI-powered design</p>
              </button>

              <button
                onClick={() => setActiveTab('learn')}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 text-left group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Learn & Grow</h3>
                <p className="text-gray-600">Discover minimalism principles and tips</p>
              </button>
            </div>

            {/* Recent Badges */}
            {earnedBadges.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                  Recent Achievements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {earnedBadges.slice(-6).map((badge) => (
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
          </div>
        );

      case 'ai-designer':
        return <AIRoomDesigner />;

      case 'learn':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Learn Minimalism</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover principles, tips, and insights to guide your minimalism journey
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

      case 'tasks':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Minimalism Tasks</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Complete tasks to earn points and build your minimalist lifestyle
              </p>
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
        );

      case 'score':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Your Progress</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Track your minimalism journey and celebrate achievements
              </p>
            </div>

            {userStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Level Progress */}
                <LevelProgress totalPoints={userStats.total_points} />

                {/* Badges */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                    Badges Earned ({earnedBadges.length})
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {earnedBadges.map((badge) => (
                      <BadgeDisplay
                        key={badge.id}
                        badge={badge}
                        size="small"
                        earned={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Badges */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">All Badges</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {badges.map((badge) => {
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
        );

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

              {/* Navigation Pills */}
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
                  onClick={() => setActiveTab('ai-designer')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'ai-designer'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  AI Designer
                </button>
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'learn'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Learn
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'tasks'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('score')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    activeTab === 'score'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Score
                </button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                {showUserProfile && (
                  <div className="absolute right-0 top-14 z-50">
                    <UserProfile />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
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
            onClick={() => setActiveTab('ai-designer')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'ai-designer' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Wand2 className="w-5 h-5" />
            <span className="text-xs mt-1">AI</span>
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'learn' ? 'text-white' : 'text-white/60'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs mt-1">Learn</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'tasks' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-xs mt-1">Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('score')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'score' ? 'text-white' : 'text-white/60'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs mt-1">Score</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* ElevenLabs Convai Widget - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-40">
        <elevenlabs-convai agent-id="agent_01jyy2fqh9ffgs6vmwqyfhrn1c"></elevenlabs-convai>
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
            className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
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