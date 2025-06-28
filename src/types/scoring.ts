export interface UserStats {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  experience_points: number;
  points_to_next_level: number;
  streak_days: number;
  longest_streak: number;
  tasks_completed: number;
  articles_read: number;
  rooms_transformed: number;
  badges_earned: string[];
  achievements_unlocked: string[];
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'mastery' | 'special' | 'seasonal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'tasks' | 'articles' | 'streak' | 'points' | 'rooms' | 'categories' | 'special';
    value: number;
    category?: string;
    timeframe?: string;
  };
  points_reward: number;
  unlocked?: boolean;
  earned_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirements: {
    type: string;
    value: number;
    conditions?: any;
  };
  points_reward: number;
  badge_reward?: string;
  unlocked?: boolean;
  progress?: number;
  max_progress?: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  description: string;
  points_required: number;
  total_points_required: number;
  rewards: {
    badges?: string[];
    features?: string[];
    customization?: string[];
  };
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'task_completion' | 'article_read' | 'streak_bonus' | 'badge_earned' | 'level_up' | 'room_transform' | 'daily_login';
  source_id?: string;
  source_type?: 'task' | 'article' | 'badge' | 'achievement' | 'room';
  description: string;
  created_at: string;
}

export interface ScoreMultiplier {
  type: 'difficulty' | 'streak' | 'category' | 'time' | 'perfect_week';
  multiplier: number;
  description: string;
  active: boolean;
}