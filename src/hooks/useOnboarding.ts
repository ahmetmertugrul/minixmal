import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { OnboardingProfile, OnboardingAnswer } from '../types/onboarding';
import { useAuth } from './useAuth';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setLoading(false);
      setNeedsOnboarding(false);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking onboarding status:', error);
      }

      if (data) {
        setProfile(data);
        setNeedsOnboarding(false);
      } else {
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (answers: OnboardingAnswer[]) => {
    if (!user) throw new Error('User not authenticated');

    // Process answers into structured data
    const primaryGoals = answers.find(a => a.questionId === 'primary_goals')?.value as string[] || [];
    const focusAreas = answers.find(a => a.questionId === 'focus_areas')?.value as string[] || [];
    
    const profileData = {
      user_id: user.id,
      primary_goals: primaryGoals,
      current_state: {
        living_situation: answers.find(a => a.questionId === 'living_situation')?.value as string || '',
        clutter_level: answers.find(a => a.questionId === 'clutter_level')?.value as number || 5,
        stress_level: answers.find(a => a.questionId === 'stress_level')?.value as number || 5,
        time_available: answers.find(a => a.questionId === 'time_available')?.value as string || '',
      },
      preferences: {
        focus_areas: focusAreas,
        difficulty_preference: answers.find(a => a.questionId === 'difficulty_preference')?.value as string || '',
        motivation_style: answers.find(a => a.questionId === 'motivation_style')?.value as string || '',
      },
      completed_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('onboarding_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    setProfile(data);
    setNeedsOnboarding(false);
    return data;
  };

  return {
    profile,
    loading,
    needsOnboarding,
    completeOnboarding,
    checkOnboardingStatus,
  };
};