import { Task } from '../data/tasks';
import { Recommendation } from '../data/recommendations';
import { ScoreMultiplier } from '../types/scoring';

// Base point values
export const BASE_POINTS = {
  TASK_EASY: 50,
  TASK_MEDIUM: 100,
  TASK_HARD: 200,
  ARTICLE_READ: 25,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 25,
  ROOM_TRANSFORM: 300,
  BADGE_EARNED: 50,
  LEVEL_UP: 100
};

// Difficulty multipliers
export const DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0
};

// Category multipliers (some categories are more challenging)
export const CATEGORY_MULTIPLIERS = {
  'Wardrobe': 1.0,
  'Food': 1.1,
  'Technology': 1.2,
  'Home': 1.0,
  'Finance': 1.3,
  'Relationships': 1.4,
  'Work': 1.2,
  'Health': 1.1,
  'Creativity': 1.1,
  'Travel': 1.0,
  'Environment': 1.2,
  'Habits': 1.3
};

// Streak multipliers
export const STREAK_MULTIPLIERS = {
  0: 1.0,
  3: 1.1,   // 10% bonus after 3 days
  7: 1.2,   // 20% bonus after 1 week
  14: 1.3,  // 30% bonus after 2 weeks
  21: 1.4,  // 40% bonus after 3 weeks
  30: 1.5   // 50% bonus after 1 month
};

// Time-based multipliers
export const TIME_MULTIPLIERS = {
  EARLY_BIRD: 1.2,  // Before 8 AM
  NIGHT_OWL: 1.1,   // After 10 PM
  WEEKEND: 1.15     // Saturday/Sunday
};

export const calculateTaskPoints = (
  task: Task, 
  streakDays: number = 0, 
  timeOfDay?: 'early' | 'night' | 'weekend'
): number => {
  // Base points from difficulty
  let points = BASE_POINTS[`TASK_${task.difficulty.toUpperCase()}` as keyof typeof BASE_POINTS] || BASE_POINTS.TASK_MEDIUM;
  
  // Apply difficulty multiplier
  points *= DIFFICULTY_MULTIPLIERS[task.difficulty];
  
  // Apply category multiplier
  const categoryMultiplier = CATEGORY_MULTIPLIERS[task.category as keyof typeof CATEGORY_MULTIPLIERS] || 1.0;
  points *= categoryMultiplier;
  
  // Apply streak multiplier
  const streakMultiplier = getStreakMultiplier(streakDays);
  points *= streakMultiplier;
  
  // Apply time-based multipliers
  if (timeOfDay === 'early') {
    points *= TIME_MULTIPLIERS.EARLY_BIRD;
  } else if (timeOfDay === 'night') {
    points *= TIME_MULTIPLIERS.NIGHT_OWL;
  } else if (timeOfDay === 'weekend') {
    points *= TIME_MULTIPLIERS.WEEKEND;
  }
  
  return Math.round(points);
};

export const calculateArticlePoints = (
  article: Recommendation,
  streakDays: number = 0
): number => {
  let points = BASE_POINTS.ARTICLE_READ;
  
  // Longer articles give more points
  const readTimeMinutes = parseInt(article.readTime.replace(/\D/g, '')) || 2;
  const timeMultiplier = Math.min(readTimeMinutes / 2, 3); // Cap at 3x for very long articles
  points *= timeMultiplier;
  
  // Apply streak multiplier
  const streakMultiplier = getStreakMultiplier(streakDays);
  points *= streakMultiplier;
  
  return Math.round(points);
};

export const getStreakMultiplier = (streakDays: number): number => {
  const streakTiers = Object.keys(STREAK_MULTIPLIERS)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending
  
  for (const tier of streakTiers) {
    if (streakDays >= tier) {
      return STREAK_MULTIPLIERS[tier as keyof typeof STREAK_MULTIPLIERS];
    }
  }
  
  return 1.0;
};

export const calculateStreakBonus = (streakDays: number): number => {
  if (streakDays < 3) return 0;
  
  // Exponential bonus for longer streaks
  const baseBonus = BASE_POINTS.STREAK_BONUS;
  const streakMultiplier = Math.floor(streakDays / 7) + 1; // +1 for each week
  
  return baseBonus * streakMultiplier;
};

export const getActiveMultipliers = (
  streakDays: number,
  timeOfDay?: 'early' | 'night' | 'weekend',
  category?: string
): ScoreMultiplier[] => {
  const multipliers: ScoreMultiplier[] = [];
  
  // Streak multiplier
  const streakMultiplier = getStreakMultiplier(streakDays);
  if (streakMultiplier > 1.0) {
    multipliers.push({
      type: 'streak',
      multiplier: streakMultiplier,
      description: `${streakDays}-day streak bonus`,
      active: true
    });
  }
  
  // Time multipliers
  if (timeOfDay === 'early') {
    multipliers.push({
      type: 'time',
      multiplier: TIME_MULTIPLIERS.EARLY_BIRD,
      description: 'Early bird bonus',
      active: true
    });
  } else if (timeOfDay === 'night') {
    multipliers.push({
      type: 'time',
      multiplier: TIME_MULTIPLIERS.NIGHT_OWL,
      description: 'Night owl bonus',
      active: true
    });
  } else if (timeOfDay === 'weekend') {
    multipliers.push({
      type: 'time',
      multiplier: TIME_MULTIPLIERS.WEEKEND,
      description: 'Weekend warrior bonus',
      active: true
    });
  }
  
  // Category multiplier
  if (category) {
    const categoryMultiplier = CATEGORY_MULTIPLIERS[category as keyof typeof CATEGORY_MULTIPLIERS];
    if (categoryMultiplier && categoryMultiplier > 1.0) {
      multipliers.push({
        type: 'category',
        multiplier: categoryMultiplier,
        description: `${category} category bonus`,
        active: true
      });
    }
  }
  
  return multipliers;
};

export const formatPoints = (points: number): string => {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`;
  } else if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return points.toString();
};

export const getPointsBreakdown = (
  basePoints: number,
  multipliers: ScoreMultiplier[]
): { base: number; multipliers: ScoreMultiplier[]; total: number } => {
  const totalMultiplier = multipliers.reduce((acc, mult) => acc * mult.multiplier, 1);
  const total = Math.round(basePoints * totalMultiplier);
  
  return {
    base: basePoints,
    multipliers,
    total
  };
};