export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    tasks: number | 'unlimited';
    articles: number | 'unlimited';
    aiDesigner: boolean;
    roomTransforms: number | 'unlimited';
  };
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '10 minimalism tasks',
      '5 learning articles',
      'Basic progress tracking',
      'Community access'
    ],
    limits: {
      tasks: 10,
      articles: 5,
      aiDesigner: false,
      roomTransforms: 0
    }
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    price: 4.99,
    interval: 'month',
    features: [
      'All 70+ minimalism tasks',
      'All 50+ learning articles',
      'AI Room Designer',
      '300 design credits per month',
      'Advanced progress analytics',
      'Priority support',
      'Ad-free experience'
    ],
    limits: {
      tasks: 'unlimited',
      articles: 'unlimited',
      aiDesigner: true,
      roomTransforms: 'unlimited'
    }
  },
  {
    id: 'pro_yearly',
    name: 'Pro (Yearly)',
    price: 49.99,
    interval: 'year',
    features: [
      'All 70+ minimalism tasks',
      'All 50+ learning articles',
      'AI Room Designer',
      '300 design credits per month',
      'Advanced progress analytics',
      'Priority support',
      'Ad-free experience',
      '$10 savings per year!'
    ],
    limits: {
      tasks: 'unlimited',
      articles: 'unlimited',
      aiDesigner: true,
      roomTransforms: 'unlimited'
    }
  }
];