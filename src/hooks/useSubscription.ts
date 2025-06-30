import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserSubscription, SUBSCRIPTION_PLANS, SubscriptionPlan } from '../types/subscription';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setLoading(false);
      setSubscription(null);
    }
  }, [user]);

  const loadSubscription = async () => {
    // For now, we'll simulate subscription data
    // In a real app, this would fetch from Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, all users start with free plan
      const freeSubscription: UserSubscription = {
        id: 'sub_free',
        user_id: user!.id,
        plan_id: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setSubscription(freeSubscription);
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
    
    return SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.plan_id) || SUBSCRIPTION_PLANS[0];
  };

  const hasFeature = (feature: keyof SubscriptionPlan['limits']): boolean => {
    const plan = getCurrentPlan();
    const limit = plan.limits[feature];
    
    if (typeof limit === 'boolean') {
      return limit;
    }
    
    return limit === 'unlimited' || limit > 0;
  };

  const getLimit = (feature: keyof SubscriptionPlan['limits']): number | 'unlimited' => {
    const plan = getCurrentPlan();
    return plan.limits[feature];
  };

  const canAccessContent = (contentType: 'tasks' | 'articles', currentCount: number): boolean => {
    const limit = getLimit(contentType);
    
    if (limit === 'unlimited') {
      return true;
    }
    
    return currentCount < limit;
  };

  const isPro = (): boolean => {
    const plan = getCurrentPlan();
    return plan.id !== 'free';
  };

  return {
    subscription,
    loading,
    currentPlan: getCurrentPlan(),
    hasFeature,
    getLimit,
    canAccessContent,
    isPro,
    loadSubscription
  };
};