import { OnboardingStep } from '../types/onboarding';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Your Minimalism Journey!",
    description: "Let's start by understanding what brought you here and what you hope to achieve.",
    questions: [
      {
        id: 'primary_goals',
        type: 'multiple-choice',
        question: 'What are your main goals with minimalism?',
        description: 'Select all that apply - this helps us personalize your experience',
        options: [
          'Declutter my living space',
          'Reduce digital overwhelm',
          'Save money and reduce spending',
          'Simplify my wardrobe',
          'Create more peaceful routines',
          'Focus on what truly matters',
          'Reduce stress and anxiety',
          'Live more sustainably'
        ],
        required: true
      },
      {
        id: 'motivation',
        type: 'single-choice',
        question: 'What motivated you to start this journey?',
        options: [
          'Feeling overwhelmed by my possessions',
          'Moving to a new home',
          'Wanting to save money',
          'Seeking more peace and clarity',
          'Environmental concerns',
          'Inspired by minimalist content',
          'Life transition or change',
          'Other'
        ],
        required: true
      }
    ]
  },
  {
    id: 2,
    title: "Your Current Situation",
    description: "Help us understand where you're starting from so we can provide the most relevant guidance.",
    questions: [
      {
        id: 'living_situation',
        type: 'single-choice',
        question: 'What best describes your living situation?',
        options: [
          'Studio apartment',
          'One-bedroom apartment',
          'Multi-bedroom apartment',
          'Small house',
          'Large house',
          'Shared living space',
          'Temporary housing',
          'Other'
        ],
        required: true
      },
      {
        id: 'clutter_level',
        type: 'scale',
        question: 'How would you rate your current clutter level?',
        description: 'Be honest - this helps us recommend the right starting point',
        scaleMin: 1,
        scaleMax: 10,
        scaleLabels: {
          min: 'Very organized',
          max: 'Very cluttered'
        },
        required: true
      },
      {
        id: 'stress_level',
        type: 'scale',
        question: 'How much does clutter/disorganization stress you?',
        scaleMin: 1,
        scaleMax: 10,
        scaleLabels: {
          min: 'Not stressful',
          max: 'Very stressful'
        },
        required: true
      }
    ]
  },
  {
    id: 3,
    title: "Your Preferences",
    description: "Let's customize your experience based on how you like to work and learn.",
    questions: [
      {
        id: 'focus_areas',
        type: 'multiple-choice',
        question: 'Which areas would you like to focus on first?',
        description: 'We\'ll prioritize tasks and recommendations in these areas',
        options: [
          'Bedroom and closet',
          'Kitchen and dining',
          'Living room',
          'Home office/workspace',
          'Digital life (phone, computer)',
          'Financial habits',
          'Daily routines',
          'Relationships and social life'
        ],
        required: true
      },
      {
        id: 'time_available',
        type: 'single-choice',
        question: 'How much time can you typically dedicate to minimalism tasks?',
        options: [
          '15-30 minutes per day',
          '30-60 minutes per day',
          '1-2 hours per day',
          'A few hours on weekends',
          'Whenever I have free time',
          'I prefer intensive sessions'
        ],
        required: true
      },
      {
        id: 'difficulty_preference',
        type: 'single-choice',
        question: 'How do you prefer to approach challenges?',
        options: [
          'Start with easy wins to build momentum',
          'Mix of easy and challenging tasks',
          'Jump into the hardest challenges first',
          'Let me choose as I go'
        ],
        required: true
      }
    ]
  },
  {
    id: 4,
    title: "Motivation & Support",
    description: "Finally, let's understand how to keep you motivated and engaged.",
    questions: [
      {
        id: 'motivation_style',
        type: 'single-choice',
        question: 'What motivates you most?',
        options: [
          'Seeing visible progress and results',
          'Earning points and achievements',
          'Learning new concepts and tips',
          'Connecting with like-minded people',
          'Tracking metrics and data',
          'Personal reflection and mindfulness'
        ],
        required: true
      },
      {
        id: 'biggest_challenge',
        type: 'single-choice',
        question: 'What do you think will be your biggest challenge?',
        options: [
          'Finding time to declutter',
          'Deciding what to keep vs. donate',
          'Staying motivated long-term',
          'Dealing with sentimental items',
          'Getting family/roommates on board',
          'Avoiding buying new things',
          'Maintaining organization systems'
        ],
        required: true
      },
      {
        id: 'success_vision',
        type: 'text',
        question: 'Describe your vision of success',
        description: 'In a few words, what would your ideal minimalist life look like?',
        required: false
      }
    ]
  }
];