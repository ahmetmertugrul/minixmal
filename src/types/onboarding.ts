export interface OnboardingQuestion {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'scale' | 'text';
  question: string;
  description?: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
  required: boolean;
}

export interface OnboardingAnswer {
  questionId: string;
  value: string | string[] | number;
}

export interface OnboardingProfile {
  id: string;
  user_id: string;
  primary_goals: string[];
  current_state: {
    living_situation: string;
    clutter_level: number;
    stress_level: number;
    time_available: string;
  };
  preferences: {
    focus_areas: string[];
    difficulty_preference: string;
    motivation_style: string;
  };
  completed_at: string;
  created_at: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  questions: OnboardingQuestion[];
}