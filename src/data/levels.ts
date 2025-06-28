import { LevelInfo } from '../types/scoring';

export const levels: LevelInfo[] = [
  {
    level: 1,
    title: 'Minimalism Novice',
    description: 'Just starting your minimalism journey',
    points_required: 0,
    total_points_required: 0,
    rewards: {
      features: ['Basic task tracking', 'Article reading']
    }
  },
  {
    level: 2,
    title: 'Declutter Apprentice',
    description: 'Learning the basics of minimalist living',
    points_required: 250,
    total_points_required: 250,
    rewards: {
      badges: ['first_steps'],
      features: ['Progress tracking', 'Basic statistics']
    }
  },
  {
    level: 3,
    title: 'Simplicity Seeker',
    description: 'Building momentum in your minimalism practice',
    points_required: 500,
    total_points_required: 750,
    rewards: {
      features: ['Streak tracking', 'Category insights'],
      customization: ['Profile themes']
    }
  },
  {
    level: 4,
    title: 'Mindful Organizer',
    description: 'Developing consistent minimalist habits',
    points_required: 750,
    total_points_required: 1500,
    rewards: {
      features: ['Advanced analytics', 'Goal setting'],
      badges: ['daily_habit']
    }
  },
  {
    level: 5,
    title: 'Intentional Liver',
    description: 'Living with purpose and clarity',
    points_required: 1000,
    total_points_required: 2500,
    rewards: {
      features: ['AI Room Designer access', 'Custom task creation'],
      customization: ['Badge display options']
    }
  },
  {
    level: 6,
    title: 'Clarity Champion',
    description: 'Mastering the art of intentional living',
    points_required: 1500,
    total_points_required: 4000,
    rewards: {
      features: ['Advanced room transformations', 'Community features'],
      badges: ['week_warrior']
    }
  },
  {
    level: 7,
    title: 'Essence Expert',
    description: 'Understanding what truly matters',
    points_required: 2000,
    total_points_required: 6000,
    rewards: {
      features: ['Mentor mode', 'Advanced sharing'],
      customization: ['Premium themes', 'Custom icons']
    }
  },
  {
    level: 8,
    title: 'Minimalism Mentor',
    description: 'Inspiring others on their journey',
    points_required: 2500,
    total_points_required: 8500,
    rewards: {
      features: ['Teaching tools', 'Community leadership'],
      badges: ['consistency_champion']
    }
  },
  {
    level: 9,
    title: 'Zen Architect',
    description: 'Creating harmony in all aspects of life',
    points_required: 3000,
    total_points_required: 11500,
    rewards: {
      features: ['Advanced AI features', 'Premium content'],
      customization: ['Exclusive themes', 'Custom animations']
    }
  },
  {
    level: 10,
    title: 'Minimalism Master',
    description: 'Achieved mastery in the art of less',
    points_required: 4000,
    total_points_required: 15500,
    rewards: {
      features: ['All premium features', 'Beta access'],
      badges: ['unstoppable_force', 'minimalism_master'],
      customization: ['Master badge', 'Exclusive content']
    }
  },
  {
    level: 11,
    title: 'Simplicity Sage',
    description: 'Wisdom through intentional living',
    points_required: 5000,
    total_points_required: 20500,
    rewards: {
      features: ['Sage insights', 'Advanced mentoring'],
      customization: ['Legendary themes', 'Custom effects']
    }
  },
  {
    level: 12,
    title: 'Zen Legend',
    description: 'Legendary status in minimalist mastery',
    points_required: 7500,
    total_points_required: 28000,
    rewards: {
      features: ['Legend status', 'Exclusive community'],
      badges: ['zen_master'],
      customization: ['Legendary badge', 'Ultimate customization']
    }
  }
];

export const getLevelInfo = (totalPoints: number): LevelInfo => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints >= levels[i].total_points_required) {
      return levels[i];
    }
  }
  return levels[0];
};

export const getNextLevelInfo = (totalPoints: number): LevelInfo | null => {
  const currentLevel = getLevelInfo(totalPoints);
  const nextLevelIndex = levels.findIndex(level => level.level === currentLevel.level) + 1;
  return nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;
};

export const getProgressToNextLevel = (totalPoints: number): { current: number; needed: number; percentage: number } => {
  const currentLevel = getLevelInfo(totalPoints);
  const nextLevel = getNextLevelInfo(totalPoints);
  
  if (!nextLevel) {
    return { current: 0, needed: 0, percentage: 100 };
  }
  
  const pointsInCurrentLevel = totalPoints - currentLevel.total_points_required;
  const pointsNeededForNext = nextLevel.points_required;
  const percentage = Math.min((pointsInCurrentLevel / pointsNeededForNext) * 100, 100);
  
  return {
    current: pointsInCurrentLevel,
    needed: pointsNeededForNext - pointsInCurrentLevel,
    percentage
  };
};