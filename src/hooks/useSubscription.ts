import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useAdmin } from './useAdmin';
import { UserSubscription, SUBSCRIPTION_PLANS, SubscriptionPlan } from '../types/subscription';

export const useSubscription = () => {
  const { user } = useAuth();
  const { isAdmin, hasFullAccess, hasProFeatures, hasUnlimitedContent, loading: adminLoading } = useAdmin();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !adminLoading) {
      loadSubscription();
    } else if (!user) {
      setLoading(false);
      setSubscription(null);
    }
  }, [user, adminLoading]);

  const loadSubscription = async () => {
    // For now, we'll simulate subscription data
    // In a real app, this would fetch from Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If user is admin with full access, give them pro subscription
      if (isAdmin && hasFullAccess()) {
        const adminSubscription: UserSubscription = {
          id: 'sub_admin',
          user_id: user!.id,
          plan_id: 'pro_yearly', // Give admin the best plan
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          credits_remaining: 999999, // Unlimited for admin
          credits_used: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setSubscription(adminSubscription);
      } else {
        // For demo purposes, all non-admin users start with free plan
        const freeSubscription: UserSubscription = {
          id: 'sub_free',
          user_id: user!.id,
          plan_id: 'free',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          credits_remaining: 0, // Free plan has no credits
          credits_used: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setSubscription(freeSubscription);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = (): SubscriptionPlan => {
    if (!subscription) {
      return SUBSCRIPTION_PLANS[0]; // Free plan
    }
    
    // If admin with unlimited content, always return pro plan
    if (isAdmin && hasUnlimitedContent()) {
      return SUBSCRIPTION_PLANS.find(plan => plan.id === 'pro_yearly') || SUBSCRIPTION_PLANS[2];
    }
    
    return SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.plan_id) || SUBSCRIPTION_PLANS[0];
  };

  const hasFeature = (feature: keyof SubscriptionPlan['limits']): boolean => {
    // Admin override - if admin has pro features, grant access
    if (isAdmin && hasProFeatures()) {
      return true;
    }

    const plan = getCurrentPlan();
    const limit = plan.limits[feature];
    
    if (typeof limit === 'boolean') {
      return limit;
    }
    
    return limit === 'unlimited' || limit > 0;
  };

  const getLimit = (feature: keyof SubscriptionPlan['limits']): number | 'unlimited' => {
    // Admin override - if admin has unlimited content, return unlimited
    if (isAdmin && hasUnlimitedContent()) {
      return 'unlimited';
    }

    const plan = getCurrentPlan();
    return plan.limits[feature];
  };

  const canAccessContent = (contentType: 'tasks' | 'articles', currentCount: number): boolean => {
    // Admin override - if admin has unlimited content, always allow access
    if (isAdmin && hasUnlimitedContent()) {
      return true;
    }

    const limit = getLimit(contentType);
    
    if (limit === 'unlimited') {
      return true;
    }
    
    return currentCount < limit;
  };

  const isPro = (): boolean => {
    // Admin override - if admin has pro features, consider them pro
    if (isAdmin && hasProFeatures()) {
      return true;
    }

    const plan = getCurrentPlan();
    return plan.id !== 'free';
  };

  const getCreditsRemaining = (): number => {
    // Admin override - unlimited credits
    if (isAdmin && hasUnlimitedContent()) {
      return 999999;
    }

    return subscription?.credits_remaining || 0;
  };

  const getCreditsUsed = (): number => {
    return subscription?.credits_used || 0;
  };

  const canUseAIDesigner = (): boolean => {
    // Admin override
    if (isAdmin && hasProFeatures()) {
      return true;
    }

    // Must have pro plan and credits remaining
    return isPro() && getCreditsRemaining() > 0;
  };

  const useCredit = async (): Promise<boolean> => {
    if (!subscription) return false;

    // Admin override - always allow
    if (isAdmin && hasUnlimitedContent()) {
      return true;
    }

    if (subscription.credits_remaining <= 0) {
      return false;
    }

    // Update local state immediately for better UX
    const updatedSubscription = {
      ...subscription,
      credits_remaining: subscription.credits_remaining - 1,
      credits_used: subscription.credits_used + 1,
      updated_at: new Date().toISOString()
    };

    setSubscription(updatedSubscription);

    // In a real app, this would update the database
    // For now, we'll just simulate the API call
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      // Revert on error
      setSubscription(subscription);
      return false;
    }
  };

  return {
    subscription,
    loading: loading || adminLoading,
    currentPlan: getCurrentPlan(),
    hasFeature,
    getLimit,
    canAccessContent,
    isPro,
    loadSubscription,
    isAdmin, // Expose admin status
    getCreditsRemaining,
    getCreditsUsed,
    canUseAIDesigner,
    useCredit
  };
};