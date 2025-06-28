import { Badge } from '../types/scoring';

export const badges: Badge[] = [
  // Milestone Badges
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first minimalism task',
    icon: 'footprints',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'tasks',
      value: 1
    },
    points_reward: 25
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Complete 5 tasks',
    icon: 'play',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'tasks',
      value: 5
    },
    points_reward: 50
  },
  {
    id: 'momentum_builder',
    name: 'Momentum Builder',
    description: 'Complete 10 tasks',
    icon: 'trending-up',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'tasks',
      value: 10
    },
    points_reward: 100
  },
  {
    id: 'dedicated_minimalist',
    name: 'Dedicated Minimalist',
    description: 'Complete 25 tasks',
    icon: 'target',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'tasks',
      value: 25
    },
    points_reward: 250
  },
  {
    id: 'minimalism_master',
    name: 'Minimalism Master',
    description: 'Complete 50 tasks',
    icon: 'crown',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'tasks',
      value: 50
    },
    points_reward: 500
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Complete 100 tasks',
    icon: 'sparkles',
    category: 'milestone',
    rarity: 'legendary',
    requirements: {
      type: 'tasks',
      value: 100
    },
    points_reward: 1000
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

  // Knowledge Badges
  {
    id: 'curious_learner',
    name: 'Curious Learner',
    description: 'Read 5 minimalism articles',
    icon: 'book-open',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'articles',
      value: 5
    },
    points_reward: 100
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Read 15 minimalism articles',
    icon: 'graduation-cap',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'articles',
      value: 15
    },
    points_reward: 250
  },
  {
    id: 'wisdom_collector',
    name: 'Wisdom Collector',
    description: 'Read 30 minimalism articles',
    icon: 'brain',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'articles',
      value: 30
    },
    points_reward: 500
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

  // Points Milestone Badges
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 1,000 total points',
    icon: 'star',
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
    description: 'Earn 5,000 total points',
    icon: 'award',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'points',
      value: 5000
    },
    points_reward: 500
  },
  {
    id: 'point_legend',
    name: 'Point Legend',
    description: 'Earn 10,000 total points',
    icon: 'trophy',
    category: 'milestone',
    rarity: 'legendary',
    requirements: {
      type: 'points',
      value: 10000
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
    case 'common': return 'text-gray-600 bg-gray-100 border-gray-200';
    case 'rare': return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'epic': return 'text-purple-600 bg-purple-100 border-purple-200';
    case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

export const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'shadow-gray-200';
    case 'rare': return 'shadow-blue-200 shadow-lg';
    case 'epic': return 'shadow-purple-300 shadow-xl';
    case 'legendary': return 'shadow-yellow-300 shadow-2xl animate-pulse';
    default: return 'shadow-gray-200';
  }
};