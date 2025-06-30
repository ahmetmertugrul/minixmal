import { Badge } from '../types/scoring';

export const badges: Badge[] = [
  // Points Milestone Badges (Primary progression)
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Earn your first 50 points',
    icon: 'footprints',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'points',
      value: 50
    },
    points_reward: 25
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Reach 250 points',
    icon: 'play-circle',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'points',
      value: 250
    },
    points_reward: 50
  },
  {
    id: 'momentum_builder',
    name: 'Momentum Builder',
    description: 'Achieve 500 points',
    icon: 'trending-up',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'points',
      value: 500
    },
    points_reward: 75
  },
  {
    id: 'dedicated_minimalist',
    name: 'Dedicated Minimalist',
    description: 'Accumulate 1,000 points',
    icon: 'target',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'points',
      value: 1000
    },
    points_reward: 100
  },
  {
    id: 'point_master',
    name: 'Point Master',
    description: 'Earn 2,500 points',
    icon: 'award',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'points',
      value: 2500
    },
    points_reward: 150
  },
  {
    id: 'minimalism_expert',
    name: 'Minimalism Expert',
    description: 'Reach 5,000 points',
    icon: 'star',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'points',
      value: 5000
    },
    points_reward: 250
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Achieve 10,000 points',
    icon: 'crown',
    category: 'milestone',
    rarity: 'legendary',
    requirements: {
      type: 'points',
      value: 10000
    },
    points_reward: 500
  },
  {
    id: 'minimalism_legend',
    name: 'Minimalism Legend',
    description: 'Reach the ultimate 25,000 points',
    icon: 'gem',
    category: 'milestone',
    rarity: 'legendary',
    requirements: {
      type: 'points',
      value: 25000
    },
    points_reward: 1000
  },

  // Task Completion Badges
  {
    id: 'task_starter',
    name: 'Task Starter',
    description: 'Complete your first task',
    icon: 'check-circle',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'tasks',
      value: 1
    },
    points_reward: 25
  },
  {
    id: 'task_explorer',
    name: 'Task Explorer',
    description: 'Complete 5 tasks',
    icon: 'compass',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'tasks',
      value: 5
    },
    points_reward: 50
  },
  {
    id: 'task_achiever',
    name: 'Task Achiever',
    description: 'Complete 15 tasks',
    icon: 'medal',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'tasks',
      value: 15
    },
    points_reward: 100
  },
  {
    id: 'task_champion',
    name: 'Task Champion',
    description: 'Complete 30 tasks',
    icon: 'trophy',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'tasks',
      value: 30
    },
    points_reward: 200
  },
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete 50 tasks',
    icon: 'crown',
    category: 'milestone',
    rarity: 'legendary',
    requirements: {
      type: 'tasks',
      value: 50
    },
    points_reward: 400
  },

  // Learning Badges
  {
    id: 'curious_learner',
    name: 'Curious Learner',
    description: 'Read your first article',
    icon: 'book-open',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'articles',
      value: 1
    },
    points_reward: 25
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Read 5 articles',
    icon: 'graduation-cap',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'articles',
      value: 5
    },
    points_reward: 50
  },
  {
    id: 'wisdom_collector',
    name: 'Wisdom Collector',
    description: 'Read 15 articles',
    icon: 'brain',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'articles',
      value: 15
    },
    points_reward: 100
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Read 30 articles',
    icon: 'scroll',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'articles',
      value: 30
    },
    points_reward: 200
  },

  // Streak Badges
  {
    id: 'daily_habit',
    name: 'Daily Habit',
    description: 'Maintain a 3-day streak',
    icon: 'calendar-check',
    category: 'streak',
    rarity: 'common',
    requirements: {
      type: 'streak',
      value: 3
    },
    points_reward: 75
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'rare',
    requirements: {
      type: 'streak',
      value: 7
    },
    points_reward: 150
  },
  {
    id: 'consistency_champion',
    name: 'Consistency Champion',
    description: 'Maintain a 14-day streak',
    icon: 'zap',
    category: 'streak',
    rarity: 'epic',
    requirements: {
      type: 'streak',
      value: 14
    },
    points_reward: 300
  },
  {
    id: 'unstoppable_force',
    name: 'Unstoppable Force',
    description: 'Maintain a 30-day streak',
    icon: 'rocket',
    category: 'streak',
    rarity: 'legendary',
    requirements: {
      type: 'streak',
      value: 30
    },
    points_reward: 750
  },

  // Category Mastery Badges
  {
    id: 'wardrobe_wizard',
    name: 'Wardrobe Wizard',
    description: 'Complete 5 wardrobe tasks',
    icon: 'shirt',
    category: 'mastery',
    rarity: 'rare',
    requirements: {
      type: 'categories',
      value: 5,
      category: 'Wardrobe'
    },
    points_reward: 200
  },
  {
    id: 'kitchen_guru',
    name: 'Kitchen Guru',
    description: 'Complete 5 food/kitchen tasks',
    icon: 'chef-hat',
    category: 'mastery',
    rarity: 'rare',
    requirements: {
      type: 'categories',
      value: 5,
      category: 'Food'
    },
    points_reward: 200
  },
  {
    id: 'digital_detox_expert',
    name: 'Digital Detox Expert',
    description: 'Complete 5 technology tasks',
    icon: 'smartphone',
    category: 'mastery',
    rarity: 'rare',
    requirements: {
      type: 'categories',
      value: 5,
      category: 'Technology'
    },
    points_reward: 200
  },
  {
    id: 'home_harmony_master',
    name: 'Home Harmony Master',
    description: 'Complete 8 home organization tasks',
    icon: 'home',
    category: 'mastery',
    rarity: 'epic',
    requirements: {
      type: 'categories',
      value: 8,
      category: 'Home'
    },
    points_reward: 350
  },
  {
    id: 'financial_freedom_seeker',
    name: 'Financial Freedom Seeker',
    description: 'Complete 3 finance tasks',
    icon: 'dollar-sign',
    category: 'mastery',
    rarity: 'rare',
    requirements: {
      type: 'categories',
      value: 3,
      category: 'Finance'
    },
    points_reward: 200
  },

  // AI Room Designer Badges
  {
    id: 'room_transformer',
    name: 'Room Transformer',
    description: 'Transform your first room with AI',
    icon: 'wand-2',
    category: 'special',
    rarity: 'rare',
    requirements: {
      type: 'rooms',
      value: 1
    },
    points_reward: 300
  },
  {
    id: 'space_architect',
    name: 'Space Architect',
    description: 'Transform 3 rooms with AI',
    icon: 'layout',
    category: 'special',
    rarity: 'epic',
    requirements: {
      type: 'rooms',
      value: 3
    },
    points_reward: 600
  },
  {
    id: 'home_designer',
    name: 'Home Designer',
    description: 'Transform 5 rooms with AI',
    icon: 'palette',
    category: 'special',
    rarity: 'legendary',
    requirements: {
      type: 'rooms',
      value: 5
    },
    points_reward: 1000
  },

  // Special Achievement Badges
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a task before 8 AM',
    icon: 'sunrise',
    category: 'special',
    rarity: 'rare',
    requirements: {
      type: 'special',
      value: 1,
      timeframe: 'morning'
    },
    points_reward: 150
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a task after 10 PM',
    icon: 'moon',
    category: 'special',
    rarity: 'rare',
    requirements: {
      type: 'special',
      value: 1,
      timeframe: 'night'
    },
    points_reward: 150
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete 5 tasks on weekends',
    icon: 'calendar-days',
    category: 'special',
    rarity: 'rare',
    requirements: {
      type: 'special',
      value: 5,
      timeframe: 'weekend'
    },
    points_reward: 200
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete all tasks in a category',
    icon: 'check-circle-2',
    category: 'special',
    rarity: 'epic',
    requirements: {
      type: 'special',
      value: 1
    },
    points_reward: 400
  }
];

export const getBadgesByCategory = (category: string) => {
  return badges.filter(badge => badge.category === category);
};

export const getBadgesByRarity = (rarity: string) => {
  return badges.filter(badge => badge.rarity === rarity);
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-700 bg-gray-100 border-gray-300';
    case 'rare': return 'text-blue-700 bg-blue-100 border-blue-300';
    case 'epic': return 'text-purple-700 bg-purple-100 border-purple-300';
    case 'legendary': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    default: return 'text-gray-700 bg-gray-100 border-gray-300';
  }
};

export const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'shadow-md';
    case 'rare': return 'shadow-lg shadow-blue-200';
    case 'epic': return 'shadow-xl shadow-purple-300';
    case 'legendary': return 'shadow-2xl shadow-yellow-300 animate-pulse';
    default: return 'shadow-md';
  }
};

export const getRarityGradient = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-orange-500';
    default: return 'from-gray-400 to-gray-600';
  }
};