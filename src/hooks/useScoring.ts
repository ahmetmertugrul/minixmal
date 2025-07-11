import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { UserStats, Badge, PointsTransaction } from '../types/scoring';
import { badges } from '../data/badges';
import { calculateTaskPoints, calculateArticlePoints, calculateStreakBonus } from '../utils/scoring';
import { Task } from '../data/tasks';
import { Recommendation } from '../data/recommendations';

export const useScoring = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (user) {
      loadUserStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Load user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsError) {
        console.error('Error loading user stats:', statsError);
      }

      if (stats) {
        setUserStats(stats);
        
        // Load earned badges
        const earnedBadgeIds = stats.badges_earned || [];
        const earned = badges.filter(badge => earnedBadgeIds.includes(badge.id));
        setEarnedBadges(earned);
      } else {
        // Create initial stats with all zeros
        await createInitialStats();
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInitialStats = async () => {
    if (!user) return;

    const initialStats: Partial<UserStats> = {
      user_id: user.id,
      total_points: 0,
      level: 1,
      experience_points: 0,
      points_to_next_level: 250,
      streak_days: 0,
      longest_streak: 0,
      tasks_completed: 0,
      articles_read: 0,
      rooms_transformed: 0,
      badges_earned: [],
      achievements_unlocked: [],
      last_activity: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_stats')
      .insert(initialStats)
      .select()
      .single();

    if (error) {
      console.error('Error creating initial stats:', error);
    } else {
      setUserStats(data);
    }
  };

  const resetUserStats = async () => {
    if (!user) return;

    try {
      // Reset all stats to zero
      const resetStats: Partial<UserStats> = {
        total_points: 0,
        level: 1,
        experience_points: 0,
        points_to_next_level: 250,
        streak_days: 0,
        longest_streak: 0,
        tasks_completed: 0,
        articles_read: 0,
        rooms_transformed: 0,
        badges_earned: [],
        achievements_unlocked: [],
        last_activity: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_stats')
        .update(resetStats)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error resetting user stats:', error);
      } else {
        setUserStats(data);
        setEarnedBadges([]);
        
        // Clear all points transactions
        await supabase
          .from('points_transactions')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error resetting user stats:', error);
    }
  };

  const updateUserStats = async (updates: Partial<UserStats>) => {
    if (!user || !userStats) return null;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update({
          ...updates,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user stats:', error);
        return null;
      }

      setUserStats(data);
      return data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return null;
    }
  };

  const awardPoints = async (
    points: number,
    type: PointsTransaction['type'],
    sourceId?: string,
    sourceType?: PointsTransaction['source_type'],
    description?: string
  ) => {
    if (!user || !userStats) return;

    try {
      // Create points transaction
      const transaction: Partial<PointsTransaction> = {
        user_id: user.id,
        points,
        type,
        source_id: sourceId,
        source_type: sourceType,
        description: description || `${type.replace('_', ' ')} points`
      };

      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert(transaction);

      if (transactionError) {
        console.error('Error creating points transaction:', transactionError);
      }

      // Update user stats
      const newTotalPoints = userStats.total_points + points;
      const newLevel = calculateLevel(newTotalPoints);
      const pointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      const updatedStats = await updateUserStats({
        total_points: newTotalPoints,
        level: newLevel,
        experience_points: newTotalPoints,
        points_to_next_level: pointsToNextLevel
      });

      if (updatedStats) {
        // Check for new badges
        await checkForNewBadges(updatedStats);
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const deductPoints = async (
    points: number,
    type: PointsTransaction['type'],
    sourceId?: string,
    sourceType?: PointsTransaction['source_type'],
    description?: string
  ) => {
    if (!user || !userStats) return;

    try {
      // Create negative points transaction
      const transaction: Partial<PointsTransaction> = {
        user_id: user.id,
        points: -points, // Negative points for deduction
        type,
        source_id: sourceId,
        source_type: sourceType,
        description: description || `${type.replace('_', ' ')} points deducted`
      };

      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert(transaction);

      if (transactionError) {
        console.error('Error creating points transaction:', transactionError);
      }

      // Update user stats
      const newTotalPoints = Math.max(0, userStats.total_points - points); // Don't go below 0
      const newLevel = calculateLevel(newTotalPoints);
      const pointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      const updatedStats = await updateUserStats({
        total_points: newTotalPoints,
        level: newLevel,
        experience_points: newTotalPoints,
        points_to_next_level: pointsToNextLevel
      });

      if (updatedStats) {
        // Check for badge revocation
        await checkForBadgeRevocation(updatedStats);
      }
    } catch (error) {
      console.error('Error deducting points:', error);
    }
  };

  const completeTask = async (task: Task) => {
    if (!userStats) return;

    const timeOfDay = getTimeOfDay();
    const points = calculateTaskPoints(task, userStats.streak_days, timeOfDay);
    
    await awardPoints(points, 'task_completion', task.id, 'task', `Completed: ${task.title}`);
    
    // Update task completion count
    await updateUserStats({
      tasks_completed: userStats.tasks_completed + 1
    });
  };

  const uncompleteTask = async (task: Task) => {
    if (!userStats) return;

    const timeOfDay = getTimeOfDay();
    const points = calculateTaskPoints(task, userStats.streak_days, timeOfDay);
    
    await deductPoints(points, 'task_completion', task.id, 'task', `Uncompleted: ${task.title}`);
    
    // Update task completion count
    await updateUserStats({
      tasks_completed: Math.max(0, userStats.tasks_completed - 1)
    });
  };

  const readArticle = async (article: Recommendation) => {
    if (!userStats) return;

    const points = calculateArticlePoints(article, userStats.streak_days);
    
    await awardPoints(points, 'article_read', article.id, 'article', `Read: ${article.title}`);
    
    // Update article read count
    await updateUserStats({
      articles_read: userStats.articles_read + 1
    });
  };

  const unreadArticle = async (article: Recommendation) => {
    if (!userStats) return;

    const points = calculateArticlePoints(article, userStats.streak_days);
    
    await deductPoints(points, 'article_read', article.id, 'article', `Unread: ${article.title}`);
    
    // Update article read count
    await updateUserStats({
      articles_read: Math.max(0, userStats.articles_read - 1)
    });
  };

  const transformRoom = async () => {
    if (!userStats) return;

    const points = 300; // Base points for room transformation
    
    await awardPoints(points, 'room_transform', undefined, 'room', 'AI Room Transformation');
    
    // Update room transformation count
    await updateUserStats({
      rooms_transformed: userStats.rooms_transformed + 1
    });
  };

  const checkForNewBadges = async (stats: UserStats) => {
    const currentBadgeIds = stats.badges_earned || [];
    const newlyEarned: Badge[] = [];

    for (const badge of badges) {
      if (currentBadgeIds.includes(badge.id)) continue;

      let earned = false;

      switch (badge.requirements.type) {
        case 'tasks':
          earned = stats.tasks_completed >= badge.requirements.value;
          break;
        case 'articles':
          earned = stats.articles_read >= badge.requirements.value;
          break;
        case 'streak':
          earned = stats.streak_days >= badge.requirements.value;
          break;
        case 'points':
          earned = stats.total_points >= badge.requirements.value;
          break;
        case 'rooms':
          earned = stats.rooms_transformed >= badge.requirements.value;
          break;
        // Add more badge types as needed
      }

      if (earned) {
        newlyEarned.push(badge);
      }
    }

    if (newlyEarned.length > 0) {
      const newBadgeIds = [...currentBadgeIds, ...newlyEarned.map(b => b.id)];
      
      // Update user stats with new badges
      const { error } = await supabase
        .from('user_stats')
        .update({ badges_earned: newBadgeIds })
        .eq('user_id', user.id);

      if (!error) {
        setEarnedBadges(prev => [...prev, ...newlyEarned]);
        setNewBadges(newlyEarned);
        
        // Award points for badges
        for (const badge of newlyEarned) {
          await awardPoints(badge.points_reward, 'badge_earned', badge.id, undefined, `Badge earned: ${badge.name}`);
        }
      }
    }
  };

  const checkForBadgeRevocation = async (stats: UserStats) => {
    const currentBadgeIds = stats.badges_earned || [];
    const badgesToRevoke: string[] = [];
    let totalPointsToDeduct = 0;

    for (const badgeId of currentBadgeIds) {
      const badge = badges.find(b => b.id === badgeId);
      if (!badge) continue;

      let stillEarned = true;

      switch (badge.requirements.type) {
        case 'tasks':
          stillEarned = stats.tasks_completed >= badge.requirements.value;
          break;
        case 'articles':
          stillEarned = stats.articles_read >= badge.requirements.value;
          break;
        case 'streak':
          stillEarned = stats.streak_days >= badge.requirements.value;
          break;
        case 'points':
          stillEarned = stats.total_points >= badge.requirements.value;
          break;
        case 'rooms':
          stillEarned = stats.rooms_transformed >= badge.requirements.value;
          break;
      }

      if (!stillEarned) {
        badgesToRevoke.push(badgeId);
        totalPointsToDeduct += badge.points_reward;
      }
    }

    if (badgesToRevoke.length > 0) {
      const remainingBadgeIds = currentBadgeIds.filter(id => !badgesToRevoke.includes(id));
      
      // Update user stats to remove revoked badges
      const { error } = await supabase
        .from('user_stats')
        .update({ badges_earned: remainingBadgeIds })
        .eq('user_id', user.id);

      if (!error) {
        // Update local state
        setEarnedBadges(prev => prev.filter(badge => !badgesToRevoke.includes(badge.id)));
        
        // Deduct points for revoked badges
        if (totalPointsToDeduct > 0) {
          await deductPoints(totalPointsToDeduct, 'badge_earned', undefined, undefined, `Badge revocation: ${badgesToRevoke.length} badges`);
        }

        // Create negative transactions for each revoked badge
        for (const badgeId of badgesToRevoke) {
          const badge = badges.find(b => b.id === badgeId);
          if (badge) {
            const transaction: Partial<PointsTransaction> = {
              user_id: user.id,
              points: -badge.points_reward,
              type: 'badge_earned',
              source_id: badge.id,
              description: `Badge revoked: ${badge.name}`
            };

            await supabase.from('points_transactions').insert(transaction);
          }
        }
      }
    }
  };

  const dismissNewBadges = () => {
    setNewBadges([]);
  };

  const calculateLevel = (totalPoints: number): number => {
    // Level calculation based on points
    if (totalPoints < 250) return 1;
    if (totalPoints < 750) return 2;
    if (totalPoints < 1500) return 3;
    if (totalPoints < 2500) return 4;
    if (totalPoints < 4000) return 5;
    if (totalPoints < 6000) return 6;
    if (totalPoints < 8500) return 7;
    if (totalPoints < 11500) return 8;
    if (totalPoints < 15500) return 9;
    if (totalPoints < 20500) return 10;
    if (totalPoints < 28000) return 11;
    return 12;
  };

  const calculatePointsToNextLevel = (totalPoints: number): number => {
    const level = calculateLevel(totalPoints);
    const levelThresholds = [0, 250, 750, 1500, 2500, 4000, 6000, 8500, 11500, 15500, 20500, 28000];
    
    if (level >= 12) return 0; // Max level
    
    return levelThresholds[level] - totalPoints;
  };

  const getTimeOfDay = (): 'early' | 'night' | 'weekend' | undefined => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (day === 0 || day === 6) return 'weekend';
    if (hour < 8) return 'early';
    if (hour >= 22) return 'night';
    return undefined;
  };

  return {
    userStats,
    earnedBadges,
    newBadges,
    loading,
    awardPoints,
    deductPoints,
    completeTask,
    uncompleteTask,
    readArticle,
    unreadArticle,
    transformRoom,
    dismissNewBadges,
    loadUserStats,
    resetUserStats
  };
};