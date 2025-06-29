import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Star, 
  Award, 
  Target, 
  CheckCircle, 
  Lightbulb, 
  TrendingUp,
  Group,
  Calendar,
  Zap,
  BookOpen,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  completed: boolean;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onToggleComplete,
  completed 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guide' | 'benefits' | 'community'>('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'hard': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge': return <Target className="w-5 h-5" />;
      case 'habit': return <CheckCircle className="w-5 h-5" />;
      case 'declutter': return <Star className="w-5 h-5" />;
      case 'mindset': return <Lightbulb className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'challenge': return 'bg-purple-500 text-white';
      case 'habit': return 'bg-blue-500 text-white';
      case 'declutter': return 'bg-green-500 text-white';
      case 'mindset': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTaskImage = (taskId: string) => {
    const imageMap: { [key: string]: string } = {
      '1': 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      '2': 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
      '3': 'https://images.pexels.com/photos/4210864/pexels-photo-4210864.jpeg',
      '4': 'https://images.pexels.com/photos/1148960/pexels-photo-1148960.jpeg',
      '5': 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg',
      '6': 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg',
      '7': 'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg',
      '8': 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      '9': 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg',
      '10': 'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
      '11': 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg',
      '12': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      '13': 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg',
      '14': 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg',
      '15': 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg',
      '16': 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg',
      '17': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
      '18': 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
      '19': 'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg',
      '20': 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
      '21': 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      '22': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '23': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      '24': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      '25': 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
      '26': 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      '27': 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg',
      '28': 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      '29': 'https://images.pexels.com/photos/5591728/pexels-photo-5591728.jpeg',
      '30': 'https://images.pexels.com/photos/6489664/pexels-photo-6489664.jpeg',
      '31': 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg',
      '32': 'https://images.pexels.com/photos/6621186/pexels-photo-6621186.jpeg',
      '33': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      '34': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg',
      '35': 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
      '36': 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg',
      '37': 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg',
      '38': 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg',
      '39': 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      '40': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      '41': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      '42': 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg',
      '43': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      '44': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '45': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      '46': 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg',
      '47': 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
      '48': 'https://images.pexels.com/photos/2105493/pexels-photo-2105493.jpeg',
      '49': 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
      '50': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      '51': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      '52': 'https://images.unsplash.com/photo-1741466071728-cc5691bfb535',
      '53': 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      '54': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '55': 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      '56': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      '57': 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg',
      '58': 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      '59': 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
      '60': 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg',
      '61': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      '62': 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
      '63': 'https://images.pexels.com/photos/6347888/pexels-photo-6347888.jpeg',
      '64': 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg',
      '65': 'https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg',
      '66': 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      '67': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      '68': 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      '69': 'https://images.pexels.com/photos/2865901/pexels-photo-2865901.jpeg',
      '70': 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    };

    return imageMap[taskId] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
  };

  // Comprehensive task-specific data
  const getTaskDetails = (task: Task) => {
    const taskData: { [key: string]: any } = {
      // Wardrobe Tasks
      '1': {
        overview: {
          whatYoullDo: "Create a curated collection of 30-40 versatile clothing pieces that all work together, eliminating decision fatigue and ensuring you always look put-together.",
          whyItMatters: "A capsule wardrobe saves time, money, and mental energy while ensuring you always have something appropriate to wear. It reduces decision fatigue and helps you develop a signature style.",
          expectedOutcome: "You'll spend less time choosing outfits, feel more confident in your style, and have a closet full of pieces you truly love and wear regularly."
        },
        stepByStepGuide: [
          "Empty your entire closet and lay everything out on your bed",
          "Try on each piece and assess fit, condition, and how it makes you feel",
          "Choose a color palette of 3-4 colors that work well together",
          "Select versatile basics: well-fitting jeans, classic shirts, blazer",
          "Add 2-3 statement pieces that reflect your personality",
          "Ensure every piece can mix and match with at least 3 others",
          "Organize by category and donate items that don't fit your vision"
        ],
        benefits: [
          "Faster morning routines with less decision fatigue",
          "Higher quality wardrobe with pieces you actually wear",
          "Reduced shopping impulses and better spending habits",
          "Increased confidence in your personal style",
          "Less laundry and easier closet maintenance"
        ],
        commonChallenges: [
          "Emotional attachment to rarely-worn items",
          "Fear of not having enough variety",
          "Difficulty choosing a color palette",
          "Perfectionism preventing progress"
        ],
        solutions: [
          "Take photos of sentimental items before donating",
          "Remember: fewer pieces = more outfit combinations",
          "Start with colors you already love wearing",
          "Aim for progress, not perfection - you can refine over time"
        ]
      },
      '2': {
        overview: {
          whatYoullDo: "Implement a simple rule: for every new clothing item you bring home, donate one existing piece to maintain balance in your wardrobe.",
          whyItMatters: "This prevents wardrobe creep and forces you to be intentional about new purchases while maintaining the benefits of your capsule wardrobe.",
          expectedOutcome: "You'll maintain a consistently organized closet, make more thoughtful purchases, and avoid accumulating clothes you don't wear."
        },
        stepByStepGuide: [
          "Set up a donation bag in your closet for easy access",
          "Before shopping, identify what you actually need",
          "When you buy something new, immediately choose what to donate",
          "Consider the new item's versatility and fit with existing pieces",
          "Make the donation within 24 hours to avoid second-guessing",
          "Track your purchases to stay mindful of spending patterns"
        ],
        benefits: [
          "Maintains optimal closet size and organization",
          "Reduces impulse purchases and buyer's remorse",
          "Keeps your wardrobe fresh and current",
          "Helps others through donations",
          "Develops mindful shopping habits"
        ],
        commonChallenges: [
          "Forgetting to apply the rule when shopping",
          "Difficulty choosing what to donate",
          "Temptation to keep 'just one more' item",
          "Family members not following the rule"
        ],
        solutions: [
          "Set a phone reminder before shopping trips",
          "Choose the least-worn item in the same category",
          "Remember your minimalism goals and benefits",
          "Lead by example and explain the benefits to family"
        ]
      },
      '3': {
        overview: {
          whatYoullDo: "Store off-season clothing in bins or vacuum bags to keep your active closet focused on current weather and reduce visual clutter.",
          whyItMatters: "Seasonal rotation keeps your daily choices relevant and manageable while protecting off-season clothes from damage and wrinkles.",
          expectedOutcome: "You'll have a cleaner, more organized closet with only seasonally appropriate choices, making daily dressing easier and more efficient."
        },
        stepByStepGuide: [
          "Sort clothes by season and current weather needs",
          "Clean all off-season items before storing",
          "Use clear bins or vacuum bags for easy identification",
          "Label containers with contents and season",
          "Store in a cool, dry place away from direct sunlight",
          "Set calendar reminders for seasonal switches",
          "Do a quick review when rotating to declutter further"
        ],
        benefits: [
          "Cleaner, less cluttered closet appearance",
          "Easier daily outfit selection",
          "Better protection for off-season clothes",
          "More space for current season items",
          "Natural decluttering opportunity twice yearly"
        ],
        commonChallenges: [
          "Lack of storage space for off-season items",
          "Forgetting what's in storage",
          "Unpredictable weather requiring stored items",
          "Procrastinating the seasonal switch"
        ],
        solutions: [
          "Use under-bed storage or vacuum bags to save space",
          "Keep a simple inventory list with storage containers",
          "Keep 1-2 transitional pieces accessible year-round",
          "Set specific dates for seasonal switches and stick to them"
        ]
      },
      '4': {
        overview: {
          whatYoullDo: "Choose 3-4 colors that complement each other and build your entire wardrobe around this palette for maximum versatility and cohesion.",
          whyItMatters: "A limited color palette ensures everything in your closet works together, maximizing outfit combinations while creating a signature style.",
          expectedOutcome: "Every piece in your wardrobe will coordinate with every other piece, giving you more outfit options with fewer clothes."
        },
        stepByStepGuide: [
          "Analyze your current favorite outfits for color patterns",
          "Choose 2 neutral colors (black, white, gray, navy, beige)",
          "Add 1-2 accent colors that you love and look good in",
          "Test the palette with existing pieces to see what works",
          "Gradually replace non-palette items as they wear out",
          "Use the 80/20 rule: 80% neutrals, 20% accent colors"
        ],
        benefits: [
          "Every piece works with every other piece",
          "Simplified shopping decisions",
          "More outfit combinations with fewer clothes",
          "Cohesive, polished appearance",
          "Reduced decision fatigue when getting dressed"
        ],
        commonChallenges: [
          "Fear of being boring or limited",
          "Existing clothes don't fit the chosen palette",
          "Difficulty choosing which colors work best",
          "Pressure to follow trends instead of personal palette"
        ],
        solutions: [
          "Remember: limitations create freedom and style",
          "Transition gradually as items need replacing",
          "Consider your skin tone and lifestyle when choosing",
          "Focus on timeless colors rather than trendy ones"
        ]
      },
      '5': {
        overview: {
          whatYoullDo: "Evaluate every pair of shoes you own and keep only those you wear regularly, are comfortable, and serve a specific purpose in your lifestyle.",
          whyItMatters: "Shoes take up significant space and most people wear only 20% of their shoe collection regularly. Reducing to essentials saves space and simplifies choices.",
          expectedOutcome: "You'll have a curated collection of comfortable, versatile shoes that you actually wear, with more storage space and easier daily decisions."
        },
        stepByStepGuide: [
          "Gather all shoes from closets, entryways, and storage areas",
          "Try on each pair and assess comfort and condition",
          "Categorize by purpose: work, casual, exercise, formal, seasonal",
          "Keep only 1-2 pairs per category based on your actual lifestyle",
          "Prioritize comfort and versatility over trends",
          "Donate shoes in good condition, recycle worn-out pairs"
        ],
        benefits: [
          "More closet and entryway space",
          "Easier shoe selection for any occasion",
          "Better foot health from wearing comfortable shoes",
          "Reduced spending on unnecessary footwear",
          "Simplified travel packing"
        ],
        commonChallenges: [
          "Sentimental attachment to special occasion shoes",
          "Fear of not having the 'right' shoe for an event",
          "Expensive shoes that are rarely worn",
          "Different shoe sizes making decisions difficult"
        ],
        solutions: [
          "Be realistic about your actual lifestyle and events",
          "Remember: you can rent or borrow for rare occasions",
          "Consider cost-per-wear rather than original price",
          "Keep shoes that fit well now, not aspirational sizes"
        ]
      },
      '6': {
        overview: {
          whatYoullDo: "Curate a small collection of timeless, versatile accessories that enhance your outfits without overwhelming your style or storage space.",
          whyItMatters: "Accessories can transform basic outfits, but too many create clutter and decision paralysis. A curated collection ensures you use what you own.",
          expectedOutcome: "You'll have a refined collection of accessories that you regularly use and love, with easier storage and styling decisions."
        },
        stepByStepGuide: [
          "Gather all accessories: jewelry, scarves, belts, bags, watches",
          "Sort by category and assess condition and frequency of use",
          "Choose versatile pieces that work with multiple outfits",
          "Keep items that reflect your current style and lifestyle",
          "Limit each category: 2-3 bags, 5-7 jewelry pieces, etc.",
          "Store remaining pieces in an organized, visible way"
        ],
        benefits: [
          "Easier accessory selection and coordination",
          "More space in drawers and jewelry boxes",
          "Better care and appreciation for kept pieces",
          "Reduced spending on duplicate accessories",
          "Streamlined travel packing"
        ],
        commonChallenges: [
          "Sentimental value of inherited or gifted jewelry",
          "Expensive pieces that are rarely worn",
          "Accessories that don't match current style",
          "Fear of regretting donations"
        ],
        solutions: [
          "Keep truly meaningful pieces, display them beautifully",
          "Consider selling valuable unused pieces",
          "Focus on your current lifestyle, not past preferences",
          "Take photos before donating to preserve memories"
        ]
      },
      '7': {
        overview: {
          whatYoullDo: "Streamline your laundry routine by using fewer, more effective products and establishing efficient systems for washing, drying, and storing clothes.",
          whyItMatters: "Simplified laundry routines save time, money, and mental energy while being gentler on your clothes and the environment.",
          expectedOutcome: "You'll spend less time on laundry tasks, use fewer products, and maintain your clothes better with a streamlined system."
        },
        stepByStepGuide: [
          "Audit current laundry products and eliminate duplicates",
          "Choose one high-quality, multi-purpose detergent",
          "Establish a simple sorting system (lights, darks, delicates)",
          "Set specific laundry days to create routine",
          "Fold or hang clothes immediately after drying",
          "Designate specific places for clean and dirty clothes"
        ],
        benefits: [
          "Less time spent on laundry decisions and tasks",
          "Reduced product clutter in laundry area",
          "Better care for clothes extends their lifespan",
          "Lower environmental impact from fewer chemicals",
          "More efficient use of time and energy"
        ],
        commonChallenges: [
          "Habit of using multiple specialized products",
          "Procrastination leading to overwhelming laundry piles",
          "Family members not following the system",
          "Stains requiring special treatment"
        ],
        solutions: [
          "Test one multi-purpose product to prove effectiveness",
          "Set small, manageable laundry goals",
          "Involve family in creating and maintaining the system",
          "Keep one stain remover for emergencies"
        ]
      },
      '8': {
        overview: {
          whatYoullDo: "Develop a signature style formula with similar outfits that work for your lifestyle, reducing daily decision-making while maintaining a polished appearance.",
          whyItMatters: "Uniform dressing eliminates decision fatigue, ensures you always look appropriate, and can actually increase creativity by removing one daily decision.",
          expectedOutcome: "You'll have a go-to outfit formula that makes you feel confident and put-together while saving significant time and mental energy each morning."
        },
        stepByStepGuide: [
          "Identify your best-fitting, most-loved outfit combinations",
          "Analyze what makes these outfits work (fit, colors, style)",
          "Create 3-5 outfit formulas for different occasions",
          "Ensure you have multiples of key pieces in your formulas",
          "Test your formulas for a week to refine them",
          "Document your formulas with photos for reference"
        ],
        benefits: [
          "Eliminated morning decision fatigue",
          "Consistent, polished appearance",
          "Simplified shopping and wardrobe planning",
          "Increased confidence in your style",
          "More time for important decisions"
        ],
        commonChallenges: [
          "Fear of being boring or predictable",
          "Pressure to follow fashion trends",
          "Difficulty finding the right formula",
          "Others commenting on repeated outfits"
        ],
        solutions: [
          "Remember: consistency creates sophistication",
          "Focus on fit and quality over trends",
          "Start with one formula and expand gradually",
          "Confidence in your choices matters more than others' opinions"
        ]
      },

      // Kitchen/Food Tasks
      '9': {
        overview: {
          whatYoullDo: "Evaluate every kitchen tool and gadget, keeping only those you use regularly to create a more functional cooking space with essential, high-quality tools.",
          whyItMatters: "A streamlined kitchen with essential tools makes cooking more enjoyable and efficient while reducing clutter and maintenance time.",
          expectedOutcome: "You'll have more counter space, easier access to tools you actually use, and a more peaceful, functional cooking environment."
        },
        stepByStepGuide: [
          "Remove all tools and gadgets from drawers and cabinets",
          "Group similar items together (cutting tools, measuring, etc.)",
          "Identify tools you use weekly vs. monthly vs. rarely",
          "Keep one high-quality version of each essential tool",
          "Test if specialty gadgets can be replaced by versatile tools",
          "Organize remaining tools for easy access and visibility",
          "Donate or sell tools you haven't used in 6+ months"
        ],
        benefits: [
          "More counter and storage space for cooking",
          "Easier to find and access the tools you need",
          "Reduced cleaning and maintenance time",
          "Better quality tools that last longer",
          "More enjoyable and efficient cooking experience"
        ],
        commonChallenges: [
          "Expensive gadgets that are rarely used",
          "Gifts from family members with sentimental value",
          "Fear of needing a tool after donating it",
          "Difficulty determining what's truly essential"
        ],
        solutions: [
          "Consider cost-per-use rather than original price",
          "Keep meaningful gifts but donate duplicates",
          "Remember: you can borrow or buy again if truly needed",
          "Focus on tools you use weekly, not hypothetical needs"
        ]
      },
      '10': {
        overview: {
          whatYoullDo: "Transform your pantry into an organized, efficient space using clear containers, logical groupings, and smart labeling systems.",
          whyItMatters: "An organized pantry reduces food waste, saves money, makes meal planning easier, and creates a more pleasant cooking experience.",
          expectedOutcome: "You'll easily see what you have, reduce duplicate purchases, waste less food, and enjoy a visually pleasing, functional pantry."
        },
        stepByStepGuide: [
          "Empty the entire pantry and clean all surfaces",
          "Check expiration dates and discard expired items",
          "Group similar items together (grains, canned goods, snacks)",
          "Invest in clear, airtight containers for bulk items",
          "Label everything with contents and expiration dates",
          "Arrange items by frequency of use and height accessibility",
          "Create a simple inventory system for tracking"
        ],
        benefits: [
          "Reduced food waste and duplicate purchases",
          "Easier meal planning and grocery shopping",
          "Better food freshness and pest prevention",
          "More efficient cooking and baking",
          "Visually appealing and calming kitchen space"
        ],
        commonChallenges: [
          "Initial cost of containers and organizing supplies",
          "Maintaining the system over time",
          "Family members not following the organization",
          "Limited pantry space for ideal organization"
        ],
        solutions: [
          "Start with a few key containers and expand gradually",
          "Make the system simple and intuitive to maintain",
          "Involve family in creating and maintaining the system",
          "Maximize vertical space with shelves and door organizers"
        ]
      },

      // Technology Tasks
      '16': {
        overview: {
          whatYoullDo: "Reduce screen time and digital overwhelm by setting boundaries with technology, creating tech-free zones, and developing healthier digital habits.",
          whyItMatters: "Digital minimalism improves focus, sleep quality, and real-world relationships while reducing anxiety and information overload.",
          expectedOutcome: "You'll feel more present, focused, and in control of your technology use rather than controlled by it, with improved well-being and relationships."
        },
        stepByStepGuide: [
          "Track your current screen time for awareness",
          "Identify your most problematic apps or devices",
          "Set specific times for checking emails and social media",
          "Create phone-free zones (bedroom, dining table)",
          "Use app timers and notification controls",
          "Replace digital activities with analog alternatives",
          "Establish a digital sunset routine before bed"
        ],
        benefits: [
          "Improved sleep quality and duration",
          "Better focus and productivity during work",
          "Stronger real-world relationships and connections",
          "Reduced anxiety and information overwhelm",
          "More time for hobbies and meaningful activities"
        ],
        commonChallenges: [
          "FOMO (fear of missing out) on digital content",
          "Habitual phone checking without awareness",
          "Work requirements for constant connectivity",
          "Social pressure to be always available"
        ],
        solutions: [
          "Remember: most digital content isn't urgent or important",
          "Use mindfulness to become aware of automatic behaviors",
          "Set clear work boundaries and communicate them",
          "Model healthy digital habits for others"
        ]
      },

      // Default template for tasks without specific data
      'default': {
        overview: {
          whatYoullDo: task.description,
          whyItMatters: "This task is designed to help you create more intentional living spaces and reduce decision fatigue in your daily life.",
          expectedOutcome: "You'll experience increased clarity, reduced stress, and a more organized environment that supports your minimalist goals."
        },
        stepByStepGuide: [
          "Set aside dedicated time and gather necessary supplies",
          "Start with the easiest items to build momentum",
          "Sort items into keep, donate, and discard categories",
          "Apply the 90/90 rule: if you haven't used it in 90 days and won't in the next 90, let it go",
          "Organize remaining items with clear, simple systems",
          "Take photos to track your progress and celebrate wins",
          "Maintain the system with regular 10-minute tidying sessions"
        ],
        benefits: [
          "Reduced visual clutter and mental overwhelm",
          "Easier maintenance and cleaning routines",
          "More space for activities that matter to you",
          "Increased focus and productivity",
          "Greater appreciation for items you choose to keep"
        ],
        commonChallenges: [
          "Emotional attachment to items",
          "Fear of making the wrong decision",
          "Perfectionism preventing progress",
          "Lack of time or energy"
        ],
        solutions: [
          "Start small with just 15 minutes",
          "Use the 'one-touch rule' for quick decisions",
          "Take photos of sentimental items before donating",
          "Focus on progress, not perfection"
        ]
      }
    };

    return taskData[task.id] || taskData['default'];
  };

  const taskDetails = getTaskDetails(task);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* What You'll Do */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Target className="w-5 h-5 text-blue-500 mr-2" />
                What You'll Do
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {taskDetails.overview.whatYoullDo}
              </p>
            </div>

            {/* Why It Matters */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                Why It Matters
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {taskDetails.overview.whyItMatters}
              </p>
            </div>

            {/* Expected Outcome */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Expected Outcome
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {taskDetails.overview.expectedOutcome}
              </p>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{task.points}</div>
                <div className="text-sm text-gray-600">Points Reward</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{task.timeEstimate}</div>
                <div className="text-sm text-gray-600">Time Needed</div>
              </div>
            </div>
          </div>
        );

      case 'guide':
        return (
          <div className="space-y-6">
            {/* Step-by-Step Guide */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Play className="w-5 h-5 text-blue-500 mr-2" />
                Step-by-Step Guide
              </h3>
              <div className="space-y-3">
                {taskDetails.stepByStepGuide.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips for Success */}
            {task.tips && task.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Pro Tips
                </h3>
                <div className="space-y-2">
                  {task.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-xl">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Challenges & Solutions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                Common Challenges & Solutions
              </h3>
              <div className="space-y-3">
                {taskDetails.commonChallenges.map((challenge: string, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{challenge}</span>
                    </div>
                    <div className="flex items-start space-x-3 ml-7">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{taskDetails.solutions[index]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'benefits':
        return (
          <div className="space-y-6">
            {/* Key Benefits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Key Benefits
              </h3>
              <div className="grid gap-3">
                {taskDetails.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Impact */}
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 text-indigo-500 mr-2" />
                Long-term Impact
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Completing this task is more than just organizing—it's about creating sustainable systems that support your ideal lifestyle. The habits you build here will compound over time, leading to lasting positive changes in how you interact with your environment and make decisions.
              </p>
            </div>

            {/* Progress Tracking */}
            {task.progress !== undefined && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${task.progress}%` }}
                  >
                    <span className="text-white text-xs font-bold">{task.progress}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Keep going! You're making great progress.</p>
              </div>
            )}
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-2xl">
                <div className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 5000) + 1000}</div>
                <div className="text-sm text-gray-600">People completed this</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-2xl">
                <div className="text-2xl font-bold text-green-600">4.{Math.floor(Math.random() * 3) + 7}★</div>
                <div className="text-sm text-gray-600">Average rating</div>
              </div>
            </div>

            {/* Success Stories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Group className="w-5 h-5 text-purple-500 mr-2" />
                Success Stories
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Sarah M.</div>
                      <div className="text-sm text-gray-500">Completed 2 weeks ago</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "This task completely transformed my daily routine. I used to spend so much time on decisions, now everything flows smoothly and I feel more in control!"
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      M
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Mike R.</div>
                      <div className="text-sm text-gray-500">Completed 1 month ago</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "The step-by-step guide made this so much easier than I expected. I was dreading it but actually enjoyed the process and the results are amazing!"
                  </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Alex K.</div>
                      <div className="text-sm text-gray-500">Completed 3 weeks ago</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">
                    "I wish I had done this sooner! The benefits section really motivated me, and now I understand why this is such a game-changer for minimalist living."
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tasks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 text-indigo-500 mr-2" />
                Related Tasks
              </h3>
              <div className="space-y-2">
                {task.category === 'Wardrobe' && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Color Palette Simplification</span>
                      <span className="text-sm text-indigo-600 font-medium">Next →</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Seasonal Closet Rotation</span>
                      <span className="text-sm text-indigo-600 font-medium">Recommended</span>
                    </div>
                  </>
                )}
                {task.category === 'Food' && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Meal Planning System</span>
                      <span className="text-sm text-indigo-600 font-medium">Next →</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Counter Space Clearing</span>
                      <span className="text-sm text-indigo-600 font-medium">Recommended</span>
                    </div>
                  </>
                )}
                {task.category === 'Technology' && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">App Audit</span>
                      <span className="text-sm text-indigo-600 font-medium">Next →</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Notification Minimization</span>
                      <span className="text-sm text-indigo-600 font-medium">Recommended</span>
                    </div>
                  </>
                )}
                {/* Default related tasks for other categories */}
                {!['Wardrobe', 'Food', 'Technology'].includes(task.category) && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Room-by-Room Declutter</span>
                      <span className="text-sm text-indigo-600 font-medium">Popular</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">Digital Detox Challenge</span>
                      <span className="text-sm text-indigo-600 font-medium">Recommended</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 sm:h-64">
          <img 
            src={getTaskImage(task.id)} 
            alt={task.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Task Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getTypeColor(task.type)}`}>
              {getTypeIcon(task.type)}
              <span className="capitalize">{task.type.replace('-', ' ')}</span>
            </span>
          </div>

          {/* Points Badge */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <Award className="w-5 h-5 text-white" />
            <span className="text-white font-bold">{task.points} pts</span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-20">
            <div className="text-sm font-medium text-white/80 bg-black/20 px-3 py-1 rounded-full inline-block mb-2">
              {task.category}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {task.title}
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'guide', label: 'Step-by-Step', icon: Play },
              { id: 'benefits', label: 'Benefits', icon: TrendingUp },
              { id: 'community', label: 'Community', icon: Group }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
          {renderTabContent()}
        </div>

        {/* Footer Action */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{task.timeEstimate}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Award className="w-4 h-4" />
                <span className="text-sm">{task.points} points</span>
              </div>
            </div>
            
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 ${
                completed
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {completed ? <RotateCcw className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span>{completed ? 'Mark Incomplete' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;