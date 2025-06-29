import React from 'react';
import { X, Clock, Star, Target, Award, CheckCircle, Lightbulb, Users, Zap } from 'lucide-react';
import { Task } from '../data/tasks';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onToggle: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onToggle }) => {
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
      case 'habit': return <Zap className="w-5 h-5" />;
      case 'declutter': return <CheckCircle className="w-5 h-5" />;
      case 'mindset': return <Lightbulb className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getDetailedDescription = (taskId: string): { overview: string; steps: string[]; benefits: string[]; tips: string[] } => {
    const descriptions: { [key: string]: { overview: string; steps: string[]; benefits: string[]; tips: string[] } } = {
      '1': {
        overview: 'A capsule wardrobe is a curated collection of 30-40 versatile pieces that all work together seamlessly. This approach eliminates decision fatigue while ensuring you always look put-together and feel confident in your clothing choices.',
        steps: [
          'Audit your current wardrobe and identify pieces you actually wear',
          'Choose a cohesive color palette of 3-4 colors that complement each other',
          'Select quality basics: well-fitting jeans, classic shirts, blazers, and versatile dresses',
          'Ensure every piece can be mixed and matched with at least 3 other items',
          'Donate or sell items that don\'t fit your new capsule criteria'
        ],
        benefits: [
          'Saves time getting dressed each morning',
          'Reduces clothing expenses by focusing on quality over quantity',
          'Creates a signature style that reflects your personality',
          'Simplifies travel packing and laundry routines'
        ],
        tips: [
          'Start with neutrals like black, white, navy, and beige',
          'Invest in quality fabrics that will last longer',
          'Consider your lifestyle when selecting pieces',
          'Take photos of successful outfit combinations for reference'
        ]
      },
      '2': {
        overview: 'The one-in-one-out rule is a simple but powerful strategy to prevent wardrobe accumulation. Every time you bring a new clothing item into your closet, you commit to removing one existing piece.',
        steps: [
          'Before purchasing any new clothing item, identify what you\'ll remove',
          'Choose the item to remove based on wear frequency and condition',
          'Donate, sell, or recycle the outgoing item immediately',
          'Keep a donation bag in your closet for easy implementation',
          'Track your adherence to this rule for the first month'
        ],
        benefits: [
          'Maintains a consistent wardrobe size',
          'Forces mindful purchasing decisions',
          'Keeps your closet organized and manageable',
          'Helps others by donating usable clothing'
        ],
        tips: [
          'Apply this rule to all clothing categories including shoes and accessories',
          'Consider the season when making swaps',
          'Be honest about what you actually wear',
          'Make the donation immediately to avoid second-guessing'
        ]
      },
      '3': {
        overview: 'Seasonal closet rotation involves storing off-season clothing to reduce visual clutter and make your current wardrobe more functional. This practice helps you focus on what\'s relevant for the current weather.',
        steps: [
          'Sort clothing by season and weather appropriateness',
          'Clean all items before storing to prevent damage',
          'Use vacuum-sealed bags or clear storage containers',
          'Label storage containers with contents and season',
          'Store in a cool, dry place away from direct sunlight'
        ],
        benefits: [
          'Makes your closet feel larger and more organized',
          'Protects off-season clothing from damage',
          'Helps you rediscover forgotten pieces each season',
          'Reduces decision fatigue by limiting daily options'
        ],
        tips: [
          'Include a few transitional pieces for unexpected weather',
          'Take photos of stored items for easy reference',
          'Use cedar blocks or lavender sachets to deter moths',
          'Review stored items annually and donate unworn pieces'
        ]
      },
      '4': {
        overview: 'Color palette simplification involves limiting your wardrobe to 3-4 complementary colors that work harmoniously together. This creates a cohesive look and ensures everything in your closet coordinates effortlessly.',
        steps: [
          'Analyze your current wardrobe to identify your most-worn colors',
          'Choose 2-3 neutral base colors (black, white, navy, beige, gray)',
          'Select 1-2 accent colors that complement your base palette',
          'Remove or donate items that don\'t fit your chosen palette',
          'Future purchases should only include your selected colors'
        ],
        benefits: [
          'Everything in your wardrobe coordinates automatically',
          'Shopping becomes easier with clear color guidelines',
          'Creates a sophisticated, intentional appearance',
          'Reduces the number of accessories needed'
        ],
        tips: [
          'Consider your skin tone when choosing colors',
          'Start with colors you already love and wear frequently',
          'Allow for one "wild card" color for special occasions',
          'Test color combinations before committing to purchases'
        ]
      },
      '5': {
        overview: 'A shoe collection audit involves critically evaluating every pair of shoes you own, keeping only those that are comfortable, frequently worn, and serve a specific purpose in your lifestyle.',
        steps: [
          'Gather all shoes from closets, entryways, and storage areas',
          'Try on each pair and assess comfort and fit',
          'Categorize by purpose: work, casual, exercise, formal, seasonal',
          'Keep only one pair per category unless you have specific needs',
          'Donate shoes in good condition, recycle worn-out pairs'
        ],
        benefits: [
          'Reduces entryway clutter and storage needs',
          'Ensures you always have comfortable, appropriate footwear',
          'Saves money by avoiding duplicate purchases',
          'Makes packing for trips much simpler'
        ],
        tips: [
          'Prioritize comfort over trends',
          'Invest in quality shoes that will last longer',
          'Consider your actual lifestyle, not aspirational activities',
          'Keep shoes in good repair with regular maintenance'
        ]
      },
      '6': {
        overview: 'Accessory minimization focuses on curating a small collection of high-quality, versatile accessories that enhance your outfits without overwhelming your style or storage space.',
        steps: [
          'Collect all accessories: jewelry, belts, scarves, bags, watches',
          'Sort by category and frequency of use',
          'Keep only pieces that work with multiple outfits',
          'Choose quality over quantity for remaining pieces',
          'Organize remaining accessories for easy access and visibility'
        ],
        benefits: [
          'Reduces decision fatigue when getting dressed',
          'Ensures accessories always complement your wardrobe',
          'Saves storage space and reduces clutter',
          'Highlights your favorite, most meaningful pieces'
        ],
        tips: [
          'Stick to your established color palette',
          'Choose timeless styles over trendy pieces',
          'Invest in one high-quality bag that works for multiple occasions',
          'Consider the maintenance requirements of delicate accessories'
        ]
      },
      '7': {
        overview: 'Laundry simplification involves streamlining your laundry routine by reducing the number of products, steps, and decisions required to keep your clothes clean and well-maintained.',
        steps: [
          'Audit your current laundry products and tools',
          'Choose one high-quality, multi-purpose detergent',
          'Eliminate specialty products unless absolutely necessary',
          'Establish a simple sorting system (lights, darks, delicates)',
          'Create a consistent washing and folding schedule'
        ],
        benefits: [
          'Reduces storage space needed for laundry supplies',
          'Saves money on unnecessary specialty products',
          'Simplifies the laundry process and reduces decision fatigue',
          'Ensures clothes are properly cared for with consistent routine'
        ],
        tips: [
          'Air dry when possible to extend fabric life',
          'Fold or hang clothes immediately to prevent wrinkles',
          'Use cold water for most loads to save energy',
          'Keep a stain removal pen handy for immediate treatment'
        ]
      },
      '8': {
        overview: 'Uniform dressing involves developing a signature style formula that you can repeat with slight variations. This approach eliminates daily outfit decisions while ensuring you always look polished and feel confident.',
        steps: [
          'Identify your lifestyle needs and personal style preferences',
          'Choose a basic outfit formula (e.g., jeans + blouse + blazer)',
          'Select 3-5 variations of each component in your color palette',
          'Practice mixing and matching within your formula',
          'Refine the formula based on what works best for your body and lifestyle'
        ],
        benefits: [
          'Eliminates morning decision fatigue',
          'Creates a recognizable personal style',
          'Simplifies shopping and wardrobe planning',
          'Ensures you always feel appropriately dressed'
        ],
        tips: [
          'Start with one formula and perfect it before adding variations',
          'Consider having different formulas for work and weekend',
          'Focus on fit and quality rather than variety',
          'Allow for small personal touches like jewelry or scarves'
        ]
      },
      '9': {
        overview: 'Essential kitchen tools focuses on identifying and keeping only the cooking implements you use regularly. This creates a more functional, organized kitchen while eliminating clutter from rarely-used gadgets.',
        steps: [
          'Remove all tools and gadgets from drawers and cabinets',
          'Sort into categories: daily use, weekly use, monthly use, rarely used',
          'Keep only daily and weekly use items in prime kitchen real estate',
          'Store monthly items in less accessible areas',
          'Donate or sell rarely used items unless they serve a specific purpose'
        ],
        benefits: [
          'Faster meal preparation with easy access to needed tools',
          'More counter and storage space for cooking',
          'Easier cleaning and organization',
          'Reduced decision fatigue when cooking'
        ],
        tips: [
          'Prioritize multi-purpose tools over single-use gadgets',
          'Invest in quality versions of your most-used tools',
          'Consider your actual cooking habits, not aspirational ones',
          'Keep a "trial box" for questionable items before donating'
        ]
      },
      '10': {
        overview: 'Pantry organization involves creating a systematic approach to food storage that maximizes space, reduces waste, and makes meal planning and cooking more efficient and enjoyable.',
        steps: [
          'Remove everything from your pantry and clean shelves thoroughly',
          'Check expiration dates and discard expired items',
          'Group similar items together (grains, canned goods, snacks, etc.)',
          'Invest in clear, airtight containers for bulk items',
          'Label everything clearly with contents and expiration dates'
        ],
        benefits: [
          'Reduces food waste by improving visibility',
          'Makes meal planning easier with clear inventory',
          'Prevents duplicate purchases',
          'Creates a more pleasant cooking experience'
        ],
        tips: [
          'Use the "first in, first out" principle for perishables',
          'Keep frequently used items at eye level',
          'Maintain a running grocery list based on pantry inventory',
          'Review and reorganize seasonally'
        ]
      },
      '11': {
        overview: 'Gadget purge involves removing single-use kitchen gadgets that take up valuable space but are rarely used. This creates more room for essential tools and simplifies your cooking process.',
        steps: [
          'Identify all single-use gadgets in your kitchen',
          'Honestly assess how often you\'ve used each item in the past year',
          'Consider if the gadget\'s function can be performed by a multi-use tool',
          'Keep only gadgets you use monthly or that save significant time',
          'Donate or sell the rest to someone who will use them'
        ],
        benefits: [
          'Frees up valuable drawer and cabinet space',
          'Reduces cleaning and maintenance requirements',
          'Simplifies cooking by focusing on versatile tools',
          'Saves money by avoiding future gadget purchases'
        ],
        tips: [
          'Be honest about your actual cooking habits',
          'Consider borrowing specialty items for rare occasions',
          'Focus on quality multi-purpose tools',
          'Resist the temptation to buy new gadgets without removing old ones'
        ]
      },
      '12': {
        overview: 'A meal planning system involves creating a structured approach to deciding what to eat each week, which reduces stress, saves money, and ensures healthier eating habits while minimizing food waste.',
        steps: [
          'Choose a consistent day each week for meal planning',
          'Review your schedule to identify busy days and plan accordingly',
          'Plan 5-7 meals, leaving room for flexibility',
          'Create a grocery list based on your meal plan',
          'Prep ingredients in advance when possible'
        ],
        benefits: [
          'Reduces daily decision fatigue about what to eat',
          'Saves money by avoiding impulse food purchases',
          'Reduces food waste through intentional shopping',
          'Promotes healthier eating habits'
        ],
        tips: [
          'Start with planning just 3-4 meals per week',
          'Choose recipes with overlapping ingredients',
          'Keep a list of go-to meals for busy weeks',
          'Plan for leftovers and batch cooking'
        ]
      },
      '13': {
        overview: 'Dish minimization involves keeping only the dishes and utensils you actually need for your household size and entertaining style, creating a more organized and functional kitchen.',
        steps: [
          'Count how many people you typically cook for daily',
          'Keep one complete set per person plus 2-4 extra for guests',
          'Choose durable, versatile pieces that can serve multiple purposes',
          'Donate excess dishes, especially mismatched or damaged items',
          'Organize remaining dishes for easy access and efficient storage'
        ],
        benefits: [
          'Reduces cabinet clutter and makes dishes easier to find',
          'Simplifies dishwashing and storage',
          'Forces you to wash dishes more regularly',
          'Creates a more cohesive, intentional kitchen aesthetic'
        ],
        tips: [
          'Choose white or neutral colors for versatility',
          'Invest in quality pieces that will last',
          'Consider stackable designs for efficient storage',
          'Keep serving pieces minimal and multi-functional'
        ]
      },
      '14': {
        overview: 'Spice rack simplification involves curating your spice collection to include only fresh, frequently-used spices while organizing them for easy access and optimal flavor retention.',
        steps: [
          'Gather all spices from various locations in your kitchen',
          'Check expiration dates and discard old or stale spices',
          'Keep only spices you use at least once every 3-6 months',
          'Organize remaining spices alphabetically or by cuisine type',
          'Store in airtight containers away from heat and light'
        ],
        benefits: [
          'Ensures you\'re cooking with fresh, flavorful spices',
          'Saves money by avoiding duplicate purchases',
          'Makes cooking more efficient with easy spice access',
          'Reduces cabinet clutter and improves organization'
        ],
        tips: [
          'Buy whole spices when possible for longer freshness',
          'Label containers with purchase or expiration dates',
          'Start with basic spices and add specialty ones as needed',
          'Consider growing fresh herbs for frequently used varieties'
        ]
      },
      '15': {
        overview: 'Counter space clearing involves maintaining clean, uncluttered kitchen counters that provide ample workspace for cooking while creating a more peaceful and functional kitchen environment.',
        steps: [
          'Remove all items from kitchen counters',
          'Identify which items you use daily and truly need counter access',
          'Find proper storage locations for everything else',
          'Establish a "clean as you go" habit while cooking',
          'Designate specific homes for items that must stay on counters'
        ],
        benefits: [
          'Provides more workspace for meal preparation',
          'Makes kitchen cleaning faster and easier',
          'Creates a more peaceful, organized atmosphere',
          'Reduces visual clutter and stress'
        ],
        tips: [
          'Keep only 3-5 items maximum on counters',
          'Choose appliances you use daily for counter storage',
          'Use wall-mounted storage for frequently used items',
          'Establish a nightly counter-clearing routine'
        ]
      },
      '16': {
        overview: 'A digital detox challenge involves intentionally reducing screen time and digital consumption to improve focus, mental health, and real-world connections while breaking unhealthy technology habits.',
        steps: [
          'Track your current screen time to establish a baseline',
          'Set specific goals for reduced usage (e.g., 2 hours less per day)',
          'Create phone-free zones and times (meals, bedroom, first hour of morning)',
          'Replace digital activities with physical ones (reading, walking, hobbies)',
          'Use app timers and restrictions to enforce your limits'
        ],
        benefits: [
          'Improves focus and attention span',
          'Reduces anxiety and improves sleep quality',
          'Increases time for meaningful activities and relationships',
          'Enhances creativity and problem-solving abilities'
        ],
        tips: [
          'Start with small, achievable reductions',
          'Find accountability partners or join digital detox groups',
          'Prepare alternative activities before reducing screen time',
          'Be patient with yourself as you develop new habits'
        ]
      },
      '17': {
        overview: 'Achieving inbox zero means processing all emails so your inbox is empty, creating a system for managing email efficiently and reducing the mental burden of unprocessed messages.',
        steps: [
          'Set aside dedicated time to process your entire inbox',
          'Create folders or labels for different types of emails',
          'Process each email with the 2-minute rule: if it takes less than 2 minutes, do it now',
          'Delete, archive, or file emails immediately after reading',
          'Unsubscribe from newsletters and promotions you don\'t read'
        ],
        benefits: [
          'Reduces mental stress from overwhelming inbox',
          'Improves email response time and professionalism',
          'Makes important emails easier to find',
          'Creates a sense of accomplishment and control'
        ],
        tips: [
          'Process emails at set times rather than constantly checking',
          'Use filters and rules to automatically sort incoming emails',
          'Keep your folder structure simple and intuitive',
          'Maintain inbox zero daily with a 10-minute evening routine'
        ]
      },
      '18': {
        overview: 'An app audit involves reviewing all applications on your devices, removing unused ones, and organizing the remaining apps to reduce digital clutter and improve device performance.',
        steps: [
          'Review all apps on your phone, tablet, and computer',
          'Delete apps you haven\'t used in the past 3 months',
          'Move frequently used apps to your home screen',
          'Organize remaining apps into logical folders',
          'Turn off notifications for non-essential apps'
        ],
        benefits: [
          'Improves device performance and battery life',
          'Reduces digital distractions and decision fatigue',
          'Frees up storage space on your devices',
          'Makes finding and using important apps easier'
        ],
        tips: [
          'Be honest about which apps you actually use',
          'Consider web versions instead of dedicated apps',
          'Review and audit apps quarterly',
          'Resist downloading new apps without removing old ones'
        ]
      },
      '19': {
        overview: 'Photo library cleanup involves organizing, deleting duplicates, and curating your digital photos to create a manageable collection that preserves meaningful memories without overwhelming storage.',
        steps: [
          'Back up all photos to cloud storage before starting',
          'Delete obvious duplicates and blurry or poor-quality photos',
          'Create albums or folders for different events, years, or themes',
          'Remove screenshots and temporary photos you no longer need',
          'Set up automatic backup and organization systems for future photos'
        ],
        benefits: [
          'Frees up significant storage space on devices',
          'Makes finding specific photos much easier',
          'Preserves meaningful memories in an organized way',
          'Improves device performance'
        ],
        tips: [
          'Use photo management apps to identify duplicates automatically',
          'Be selective about keeping multiple similar shots',
          'Create yearly folders for easy chronological organization',
          'Regularly delete photos as you take them to prevent accumulation'
        ]
      },
      '20': {
        overview: 'Social media cleanse involves curating your social media feeds by unfollowing accounts that don\'t add value to your life, reducing negative content consumption and improving mental well-being.',
        steps: [
          'Review all accounts you follow across all platforms',
          'Unfollow accounts that make you feel negative, inadequate, or anxious',
          'Keep accounts that inspire, educate, or genuinely entertain you',
          'Limit the number of platforms you actively use',
          'Set specific times for social media consumption'
        ],
        benefits: [
          'Improves mental health and self-esteem',
          'Reduces time wasted on meaningless content',
          'Creates a more positive and inspiring feed',
          'Increases focus on real-world activities and relationships'
        ],
        tips: [
          'Be ruthless about unfollowing accounts that don\'t serve you',
          'Follow accounts that align with your goals and values',
          'Use social media mindfully rather than as a default activity',
          'Consider taking periodic breaks from social media entirely'
        ]
      },
      '21': {
        overview: 'Setting up a password manager involves using a secure application to generate, store, and manage unique passwords for all your accounts, improving security while simplifying login management.',
        steps: [
          'Research and choose a reputable password manager service',
          'Install the password manager on all your devices',
          'Import existing passwords or add them manually',
          'Generate new, unique passwords for all important accounts',
          'Enable two-factor authentication where possible'
        ],
        benefits: [
          'Dramatically improves online security',
          'Eliminates the need to remember multiple passwords',
          'Saves time logging into accounts',
          'Alerts you to compromised or weak passwords'
        ],
        tips: [
          'Use a strong, unique master password',
          'Enable automatic password generation for new accounts',
          'Regularly review and update passwords for important accounts',
          'Keep your password manager app updated for security'
        ]
      },
      '22': {
        overview: 'Cloud storage organization involves creating a logical, consistent file structure in your cloud storage that makes finding and managing digital files efficient and stress-free.',
        steps: [
          'Create a clear folder hierarchy with main categories',
          'Use consistent naming conventions for files and folders',
          'Delete duplicate files and outdated documents',
          'Set up automatic syncing across all your devices',
          'Regularly review and clean up your cloud storage'
        ],
        benefits: [
          'Makes finding files quick and easy',
          'Ensures important documents are backed up and accessible',
          'Reduces digital clutter and confusion',
          'Improves collaboration when sharing files'
        ],
        tips: [
          'Use descriptive, searchable file names',
          'Create templates for recurring document types',
          'Set up automatic backup for important folders',
          'Review and organize files monthly to prevent accumulation'
        ]
      },
      '23': {
        overview: 'Notification minimization involves turning off non-essential notifications to reduce digital interruptions, improve focus, and regain control over your attention and time.',
        steps: [
          'Review notification settings on all your devices',
          'Turn off notifications for social media, games, and entertainment apps',
          'Keep only essential notifications like calls, texts, and calendar alerts',
          'Set up "Do Not Disturb" schedules for focused work time',
          'Use notification grouping to reduce visual clutter'
        ],
        benefits: [
          'Improves focus and concentration',
          'Reduces stress and anxiety from constant interruptions',
          'Increases productivity and deep work time',
          'Helps you be more intentional about device usage'
        ],
        tips: [
          'Start by turning off all notifications, then selectively enable essential ones',
          'Use different notification sounds for truly important alerts',
          'Check apps manually rather than relying on notifications',
          'Review and adjust notification settings regularly'
        ]
      },
      '24': {
        overview: 'Room-by-room decluttering involves systematically going through each space in your home to remove unnecessary items, creating more organized, peaceful, and functional living areas.',
        steps: [
          'Choose one room to start with (preferably the easiest)',
          'Remove everything from the room and clean thoroughly',
          'Sort items into keep, donate, sell, and trash categories',
          'Only return items you truly need and use regularly',
          'Organize remaining items with designated homes for everything'
        ],
        benefits: [
          'Creates more spacious, peaceful living environments',
          'Makes cleaning and maintenance much easier',
          'Helps you appreciate and use what you keep',
          'Reduces stress and improves mental clarity'
        ],
        tips: [
          'Start with less emotional items like books or kitchen gadgets',
          'Take before and after photos for motivation',
          'Don\'t move clutter to another room - make real decisions',
          'Celebrate progress after completing each room'
        ]
      },
      '25': {
        overview: 'Furniture minimization involves keeping only furniture pieces that serve a clear, essential purpose in your daily life while creating more open, peaceful living spaces.',
        steps: [
          'Evaluate each piece of furniture for its actual usage',
          'Consider if multiple pieces could be replaced by one multi-functional item',
          'Remove furniture that\'s only used for storage of unnecessary items',
          'Ensure remaining pieces fit well in your space and lifestyle',
          'Arrange furniture to maximize flow and openness'
        ],
        benefits: [
          'Creates more open, spacious feeling rooms',
          'Makes cleaning and rearranging much easier',
          'Reduces the temptation to accumulate clutter',
          'Highlights the beauty of remaining pieces'
        ],
        tips: [
          'Focus on quality over quantity',
          'Choose pieces that serve multiple functions',
          'Consider your actual lifestyle, not aspirational decorating',
          'Leave plenty of open space for movement and breathing room'
        ]
      },
      '26': {
        overview: 'Decoration curation involves displaying only meaningful artwork and decorative items that truly enhance your space and bring you joy, while removing excess that creates visual clutter.',
        steps: [
          'Remove all decorative items from walls and surfaces',
          'Sort items by emotional significance and aesthetic value',
          'Choose only pieces that have personal meaning or exceptional beauty',
          'Display items with plenty of white space around them',
          'Store or donate excess decorations'
        ],
        benefits: [
          'Creates a more peaceful, uncluttered visual environment',
          'Highlights the beauty of your favorite pieces',
          'Makes cleaning and dusting much easier',
          'Allows you to truly appreciate displayed items'
        ],
        tips: [
          'Follow the "less is more" principle',
          'Group similar items together for impact',
          'Leave plenty of empty wall space',
          'Rotate seasonal decorations rather than displaying everything'
        ]
      },
      '27': {
        overview: 'Storage system setup involves creating organized, labeled storage solutions that give every item a designated home, making it easy to find things and maintain organization long-term.',
        steps: [
          'Assess what items you need to store after decluttering',
          'Choose appropriate storage containers for different item types',
          'Label everything clearly with contents and categories',
          'Create zones for similar items (office supplies, seasonal items, etc.)',
          'Make frequently used items easily accessible'
        ],
        benefits: [
          'Makes finding items quick and effortless',
          'Maintains organization with minimal effort',
          'Prevents items from becoming lost or forgotten',
          'Creates a sense of order and control'
        ],
        tips: [
          'Use clear containers when possible for easy identification',
          'Keep storage systems simple and intuitive',
          'Store items where you naturally look for them',
          'Review and adjust storage systems seasonally'
        ]
      },
      '28': {
        overview: 'Paper reduction involves digitizing important documents, eliminating unnecessary paper accumulation, and creating systems to manage essential physical documents efficiently.',
        steps: [
          'Gather all papers from throughout your home',
          'Sort into categories: keep, scan, shred, recycle',
          'Scan important documents and store digitally with backup',
          'Shred sensitive documents securely',
          'Set up systems to handle incoming mail and papers immediately'
        ],
        benefits: [
          'Reduces physical clutter and storage needs',
          'Makes important documents easier to find and access',
          'Protects important papers through digital backup',
          'Reduces fire and flood risk to important documents'
        ],
        tips: [
          'Scan documents in searchable PDF format',
          'Use consistent naming conventions for digital files',
          'Set up automatic bill pay to reduce paper mail',
          'Process mail immediately rather than letting it accumulate'
        ]
      },
      '29': {
        overview: 'Cleaning supply simplification involves using fewer, more effective cleaning products that can handle multiple tasks, reducing clutter while maintaining a clean, healthy home.',
        steps: [
          'Inventory all current cleaning products and tools',
          'Research multi-purpose, eco-friendly alternatives',
          'Choose 3-5 essential products that cover all your cleaning needs',
          'Dispose of old, toxic, or redundant products safely',
          'Organize remaining supplies in an accessible location'
        ],
        benefits: [
          'Reduces storage space needed for cleaning supplies',
          'Saves money on unnecessary specialty products',
          'Simplifies cleaning routines and decisions',
          'Often healthier for your family and environment'
        ],
        tips: [
          'Look for plant-based, non-toxic formulations',
          'Consider making your own cleaners with simple ingredients',
          'Choose refillable containers to reduce waste',
          'Keep cleaning supplies in each major area of your home'
        ]
      },
      '30': {
        overview: 'Linen closet organization involves keeping only necessary linens in good condition while creating an organized system that makes finding and storing bedding and towels efficient.',
        steps: [
          'Remove all linens and assess their condition',
          'Keep 2 sets of sheets per bed and 2-3 towels per person',
          'Donate worn or excess linens to animal shelters',
          'Fold linens consistently for neat storage',
          'Organize by type and frequency of use'
        ],
        benefits: [
          'Makes finding linens quick and easy',
          'Reduces laundry burden with fewer items to wash',
          'Creates more storage space for other items',
          'Ensures you\'re using fresh, quality linens'
        ],
        tips: [
          'Store sheet sets inside their matching pillowcase',
          'Keep frequently used items at eye level',
          'Use shelf dividers to maintain organization',
          'Replace linens when they become worn rather than accumulating'
        ]
      },
      '31': {
        overview: 'Entryway simplification involves creating a clutter-free, functional entrance to your home that provides storage for daily essentials while making a welcoming first impression.',
        steps: [
          'Remove all items currently in your entryway',
          'Install hooks for coats and bags at appropriate heights',
          'Add a shoe storage solution that fits your space',
          'Create a designated spot for keys, mail, and daily essentials',
          'Keep only current season items in the entryway'
        ],
        benefits: [
          'Creates a welcoming first impression for guests',
          'Makes leaving and arriving home more efficient',
          'Prevents clutter from spreading to other areas',
          'Provides a transition space between outside and inside'
        ],
        tips: [
          'Keep entryway items to a minimum',
          'Use vertical space with hooks and shelves',
          'Add a small basket for items that need to go upstairs',
          'Maintain the space daily with a quick tidy routine'
        ]
      },
      '32': {
        overview: 'Bathroom essentials involves keeping only daily-use toiletries and products, creating a clean, organized bathroom that supports your health and wellness routines efficiently.',
        steps: [
          'Remove all products from bathroom surfaces and storage',
          'Check expiration dates and discard old products',
          'Keep only products you use daily or weekly',
          'Organize remaining items by frequency of use',
          'Store backup items elsewhere to reduce visual clutter'
        ],
        benefits: [
          'Creates a spa-like, peaceful bathroom environment',
          'Makes cleaning much faster and easier',
          'Ensures you\'re using fresh, effective products',
          'Reduces decision fatigue in daily routines'
        ],
        tips: [
          'Keep counters as clear as possible',
          'Use drawer organizers for small items',
          'Choose multi-purpose products when possible',
          'Store towels and linens in a nearby closet if space is limited'
        ]
      },
      '33': {
        overview: 'Creating a bedroom sanctuary involves designing a peaceful, clutter-free space dedicated to rest and relaxation, promoting better sleep and mental well-being.',
        steps: [
          'Remove all non-sleep related items from the bedroom',
          'Eliminate electronics or move them to another room',
          'Choose calming colors and minimal decorations',
          'Invest in quality bedding and blackout curtains',
          'Create designated storage for clothing and personal items'
        ],
        benefits: [
          'Improves sleep quality and duration',
          'Reduces stress and promotes relaxation',
          'Creates a more romantic, intimate atmosphere',
          'Makes the bedroom easier to clean and maintain'
        ],
        tips: [
          'Keep the room cool, dark, and quiet',
          'Use the bedroom only for sleep and intimacy',
          'Choose furniture with clean, simple lines',
          'Add plants or natural elements for a calming effect'
        ]
      },
      '34': {
        overview: 'Budget simplification involves creating a straightforward, sustainable system for managing your money that reduces financial stress while helping you achieve your financial goals.',
        steps: [
          'Track your income and expenses for one month',
          'Create broad categories for spending (housing, food, transportation, etc.)',
          'Set up automatic transfers for savings and bill payments',
          'Use the 50/30/20 rule as a starting framework',
          'Review and adjust your budget monthly'
        ],
        benefits: [
          'Reduces financial stress and anxiety',
          'Helps you achieve financial goals faster',
          'Prevents overspending and debt accumulation',
          'Creates awareness of spending patterns'
        ],
        tips: [
          'Start with simple categories and refine over time',
          'Use budgeting apps or tools that sync with your accounts',
          'Focus on trends rather than perfect accuracy',
          'Build in flexibility for unexpected expenses'
        ]
      },
      '35': {
        overview: 'Subscription audit involves reviewing all recurring payments and memberships to cancel those you don\'t use regularly, reducing monthly expenses and simplifying your financial life.',
        steps: [
          'Review bank and credit card statements for recurring charges',
          'List all subscriptions and their monthly/annual costs',
          'Evaluate each subscription based on actual usage and value',
          'Cancel subscriptions you haven\'t used in the past month',
          'Set calendar reminders to review subscriptions quarterly'
        ],
        benefits: [
          'Saves money on unused services',
          'Simplifies monthly budgeting and expense tracking',
          'Reduces digital clutter from unused accounts',
          'Forces mindful evaluation of service value'
        ],
        tips: [
          'Be honest about what you actually use vs. what you think you might use',
          'Consider sharing family plans for services you do use',
          'Cancel immediately rather than planning to cancel later',
          'Use free alternatives when possible'
        ]
      },
      '36': {
        overview: 'Mindful spending challenge involves implementing a waiting period before non-essential purchases to reduce impulse buying and ensure purchases align with your values and needs.',
        steps: [
          'Implement a 24-48 hour waiting period for non-essential purchases',
          'Ask yourself key questions: Do I need this? Will it add value? Do I have space?',
          'Keep a wishlist of items you want and review it monthly',
          'Calculate the cost per use for potential purchases',
          'Focus spending on experiences and quality items that last'
        ],
        benefits: [
          'Reduces impulse purchases and buyer\'s remorse',
          'Saves money for more important goals',
          'Helps you buy higher quality items you truly want',
          'Reduces clutter from unnecessary purchases'
        ],
        tips: [
          'Remove shopping apps from your phone',
          'Unsubscribe from promotional emails',
          'Shop with a list and stick to it',
          'Consider the true cost including storage and maintenance'
        ]
      },
      '37': {
        overview: 'Bank account simplification involves consolidating to essential accounts only, reducing complexity in your financial life while maintaining appropriate separation for different purposes.',
        steps: [
          'List all your current bank accounts and their purposes',
          'Identify accounts with low balances or minimal activity',
          'Consolidate similar accounts at the same institution',
          'Keep 2-3 accounts maximum: checking, savings, and possibly one specialized account',
          'Close unused accounts and update automatic payments'
        ],
        benefits: [
          'Simplifies financial tracking and management',
          'Reduces fees and minimum balance requirements',
          'Makes tax preparation easier',
          'Improves your ability to monitor financial health'
        ],
        tips: [
          'Choose accounts with no or low fees',
          'Ensure you maintain any required minimum balances',
          'Update all automatic payments before closing accounts',
          'Keep accounts at institutions with good customer service'
        ]
      },
      '38': {
        overview: 'Investment portfolio review involves simplifying your investments by focusing on low-cost, diversified index funds that require minimal management while providing solid long-term returns.',
        steps: [
          'Review all your current investment accounts and holdings',
          'Calculate fees and expenses for each investment',
          'Research low-cost index funds that match your risk tolerance',
          'Consolidate accounts where possible to reduce complexity',
          'Set up automatic contributions to maintain consistency'
        ],
        benefits: [
          'Reduces investment fees and expenses',
          'Simplifies portfolio management and tracking',
          'Provides broad market diversification',
          'Reduces emotional decision-making in investing'
        ],
        tips: [
          'Focus on total stock market and bond index funds',
          'Keep expense ratios below 0.2% when possible',
          'Rebalance annually rather than constantly adjusting',
          'Stay consistent with contributions regardless of market conditions'
        ]
      },
      '39': {
        overview: 'Social circle evaluation involves focusing your time and energy on relationships that truly matter, while setting boundaries with relationships that drain your energy or don\'t align with your values.',
        steps: [
          'List your current relationships and how they make you feel',
          'Identify relationships that energize vs. drain you',
          'Prioritize time with people who support your growth and values',
          'Set boundaries with negative or demanding relationships',
          'Invest more deeply in your most meaningful connections'
        ],
        benefits: [
          'Improves overall happiness and life satisfaction',
          'Reduces social stress and obligation fatigue',
          'Allows deeper connections with people who matter most',
          'Frees time for personal growth and meaningful activities'
        ],
        tips: [
          'Quality relationships are more valuable than quantity',
          'It\'s okay to let some relationships naturally fade',
          'Be intentional about how you spend your social time',
          'Communicate your boundaries clearly and kindly'
        ]
      },
      '40': {
        overview: 'Communication simplification involves streamlining how you interact with others by being more direct, honest, and intentional in your conversations and correspondence.',
        steps: [
          'Practice being more direct and clear in your communication',
          'Reduce small talk and focus on meaningful conversations',
          'Set specific times for checking and responding to messages',
          'Use phone calls or face-to-face conversations for important topics',
          'Be honest about your availability and boundaries'
        ],
        benefits: [
          'Saves time and reduces miscommunication',
          'Builds stronger, more authentic relationships',
          'Reduces stress from unclear expectations',
          'Improves your reputation for reliability and clarity'
        ],
        tips: [
          'Listen actively and ask clarifying questions',
          'Be concise but warm in your communication style',
          'Address conflicts directly rather than avoiding them',
          'Express appreciation and gratitude regularly'
        ]
      },
      '41': {
        overview: 'Event commitment audit involves being selective about social events and commitments, saying yes only to those that align with your values and bring genuine joy or value to your life.',
        steps: [
          'Review your current commitments and how they make you feel',
          'Identify events you attend out of obligation vs. genuine interest',
          'Practice saying no gracefully to invitations that don\'t serve you',
          'Prioritize events that align with your values and goals',
          'Leave buffer time in your schedule for spontaneous activities'
        ],
        benefits: [
          'Reduces social fatigue and obligation stress',
          'Allows you to be more present at events you do attend',
          'Frees time for activities that truly matter to you',
          'Helps you build a reputation for being selective and intentional'
        ],
        tips: [
          'It\'s better to attend fewer events and be fully present',
          'Have a standard polite decline response ready',
          'Consider your energy levels and other commitments',
          'Remember that saying no to one thing means saying yes to something else'
        ]
      },
      '42': {
        overview: 'Gift-giving simplification involves focusing on meaningful, experiential, or highly useful gifts rather than accumulating more material possessions for yourself and others.',
        steps: [
          'Shift focus from material gifts to experiences and time together',
          'Give consumable gifts like food, flowers, or spa treatments',
          'Choose high-quality items that replace multiple lesser ones',
          'Make gifts yourself when you have a special skill or talent',
          'Discuss gift-giving expectations with family and friends'
        ],
        benefits: [
          'Reduces clutter for both giver and receiver',
          'Creates more meaningful gift-giving experiences',
          'Saves money by focusing on thoughtful rather than expensive gifts',
          'Strengthens relationships through shared experiences'
        ],
        tips: [
          'Pay attention to what people actually need or mention wanting',
          'Experiences often create longer-lasting happiness than objects',
          'Consider gifts that support someone\'s goals or interests',
          'The thought and effort matter more than the price'
        ]
      },
      '43': {
        overview: 'Workspace organization involves creating a clean, distraction-free environment that promotes focus, creativity, and productivity while supporting your work goals and habits.',
        steps: [
          'Clear everything from your desk and workspace',
          'Keep only essential items within arm\'s reach',
          'Organize cables and eliminate visual clutter',
          'Create designated spaces for different types of work',
          'Establish a daily workspace reset routine'
        ],
        benefits: [
          'Improves focus and concentration',
          'Increases productivity and efficiency',
          'Reduces stress and mental fatigue',
          'Creates a more professional appearance for video calls'
        ],
        tips: [
          'Keep your desk surface as clear as possible',
          'Use drawer organizers for small items',
          'Position your monitor at eye level to reduce neck strain',
          'Add one personal item that brings you joy'
        ]
      },
      '44': {
        overview: 'Task management system implementation involves choosing and consistently using a simple, effective method for organizing and prioritizing your work and personal tasks.',
        steps: [
          'Choose one task management system and commit to it',
          'Set up categories or projects that match your life areas',
          'Establish a daily review routine to update and prioritize tasks',
          'Use the two-minute rule: if it takes less than two minutes, do it now',
          'Weekly review to plan ahead and adjust priorities'
        ],
        benefits: [
          'Reduces mental load from trying to remember everything',
          'Improves productivity by focusing on important tasks',
          'Provides a sense of accomplishment as you complete tasks',
          'Helps you make progress on long-term goals'
        ],
        tips: [
          'Keep the system simple and easy to maintain',
          'Capture all tasks in one place rather than multiple lists',
          'Focus on outcomes rather than just activities',
          'Be realistic about what you can accomplish in a day'
        ]
      },
      '45': {
        overview: 'Meeting minimization involves reducing unnecessary meetings while making the meetings you do attend more focused, efficient, and productive for everyone involved.',
        steps: [
          'Question whether each meeting is truly necessary',
          'Suggest alternatives like email updates or brief check-ins',
          'Set clear agendas and time limits for meetings you do schedule',
          'Invite only people who need to be there',
          'End meetings early when objectives are met'
        ],
        benefits: [
          'Frees up time for focused, deep work',
          'Reduces meeting fatigue and improves engagement',
          'Increases overall team productivity',
          'Improves the quality of meetings that do occur'
        ],
        tips: [
          'Start meetings with clear objectives',
          'Use standing meetings to keep them brief',
          'Send pre-meeting materials to make discussions more efficient',
          'Follow up with clear action items and deadlines'
        ]
      },
      '46': {
        overview: 'Email management system involves processing work emails efficiently with clear systems and boundaries to maintain productivity while staying responsive to important communications.',
        steps: [
          'Set specific times for checking and responding to email',
          'Use folders or labels to organize different types of emails',
          'Create templates for common responses',
          'Unsubscribe from unnecessary mailing lists',
          'Use clear, descriptive subject lines in your emails'
        ],
        benefits: [
          'Reduces interruptions and improves focus',
          'Ensures important emails don\'t get lost',
          'Improves response time and professionalism',
          'Reduces stress from overwhelming inbox'
        ],
        tips: [
          'Process emails in batches rather than constantly checking',
          'Use the OHIO principle: Only Handle It Once',
          'Set up automatic filters for routine emails',
          'Keep emails concise and action-oriented'
        ]
      },
      '47': {
        overview: 'Supplement simplification involves keeping only essential, evidence-based supplements that support your specific health needs while eliminating unnecessary or redundant products.',
        steps: [
          'Consult with a healthcare provider about your supplement needs',
          'Research the evidence behind each supplement you\'re taking',
          'Focus on basic supplements like vitamin D, B12, or omega-3 if needed',
          'Eliminate supplements with overlapping benefits',
          'Check expiration dates and dispose of old supplements safely'
        ],
        benefits: [
          'Saves money on unnecessary supplements',
          'Reduces the risk of interactions or overdoses',
          'Simplifies your daily routine',
          'Ensures you\'re taking supplements that actually benefit your health'
        ],
        tips: [
          'Get blood tests to identify actual deficiencies',
          'Focus on getting nutrients from whole foods first',
          'Choose high-quality supplements from reputable brands',
          'Keep a simple routine you can maintain consistently'
        ]
      },
      '48': {
        overview: 'Exercise routine streamlining involves creating a simple, sustainable fitness routine that you can maintain long-term while achieving your health and fitness goals.',
        steps: [
          'Assess your current fitness level and realistic time availability',
          'Choose 3-4 basic exercises that work multiple muscle groups',
          'Start with 20-30 minute sessions 3 times per week',
          'Focus on consistency over intensity',
          'Track your progress to stay motivated'
        ],
        benefits: [
          'Improves overall health and energy levels',
          'Reduces stress and improves mental health',
          'Creates a sustainable habit you can maintain',
          'Saves time by focusing on effective exercises'
        ],
        tips: [
          'Choose activities you actually enjoy',
          'Start small and gradually increase intensity',
          'Use bodyweight exercises that require no equipment',
          'Schedule workouts like important appointments'
        ]
      },
      '49': {
        overview: 'Skincare routine minimization involves simplifying your skincare to essential, effective products that support healthy skin without overwhelming complexity or expense.',
        steps: [
          'Identify your skin type and primary concerns',
          'Focus on three basics: gentle cleanser, moisturizer, and sunscreen',
          'Remove products that irritate your skin or provide no benefit',
          'Introduce new products one at a time to test effectiveness',
          'Maintain consistency with your simplified routine'
        ],
        benefits: [
          'Reduces skin irritation from too many products',
          'Saves money on unnecessary skincare items',
          'Simplifies your daily routine',
          'Makes it easier to identify what works for your skin'
        ],
        tips: [
          'Less is often more when it comes to skincare',
          'Patch test new products before full use',
          'Focus on sun protection as the most important anti-aging step',
          'Be patient - it takes time to see results from skincare changes'
        ]
      },
      '50': {
        overview: 'Sleep environment optimization involves creating ideal conditions in your bedroom that promote deep, restorative sleep and support your overall health and well-being.',
        steps: [
          'Keep your bedroom cool (65-68°F), dark, and quiet',
          'Invest in blackout curtains or an eye mask',
          'Remove electronic devices or use blue light filters',
          'Choose comfortable, supportive bedding and pillows',
          'Establish a consistent bedtime routine'
        ],
        benefits: [
          'Improves sleep quality and duration',
          'Enhances daytime energy and focus',
          'Supports immune system and overall health',
          'Improves mood and emotional regulation'
        ],
        tips: [
          'Use your bedroom only for sleep and intimacy',
          'Keep a consistent sleep schedule, even on weekends',
          'Avoid caffeine and large meals close to bedtime',
          'Consider white noise or earplugs if needed'
        ]
      },
      '51': {
        overview: 'Art supply curation involves keeping only the creative materials you actively use and love, creating an organized, inspiring workspace that supports your artistic practice.',
        steps: [
          'Gather all art supplies from various locations',
          'Test supplies to see if they still work properly',
          'Keep only supplies you\'ve used in the past 6 months',
          'Organize remaining supplies by medium or frequency of use',
          'Donate usable supplies you no longer need'
        ],
        benefits: [
          'Creates a more organized, inspiring creative space',
          'Saves money by using what you have before buying new',
          'Reduces decision fatigue when starting creative projects',
          'Ensures you\'re working with fresh, quality materials'
        ],
        tips: [
          'Invest in fewer, higher-quality supplies',
          'Store supplies where you can see and access them easily',
          'Keep a small, portable kit for creative work on the go',
          'Replace supplies only when they\'re used up or no longer functional'
        ]
      },
      '52': {
        overview: 'Creative space setup involves designing a minimal, inspiring workspace dedicated to your creative pursuits that promotes flow, focus, and artistic expression.',
        steps: [
          'Choose a dedicated space for creative work, even if small',
          'Ensure excellent lighting, preferably natural light',
          'Keep surfaces clear except for current project materials',
          'Add inspiring elements like plants, art, or meaningful objects',
          'Organize supplies for easy access and visibility'
        ],
        benefits: [
          'Enhances creativity and artistic flow',
          'Makes it easier to start and maintain creative projects',
          'Creates a dedicated space that signals creative time',
          'Improves the quality of your creative work'
        ],
        tips: [
          'Good lighting is essential for creative work',
          'Keep the space flexible for different types of projects',
          'Include storage that keeps supplies organized but accessible',
          'Make the space feel special and inspiring to you'
        ]
      },
      '53': {
        overview: 'Project focus challenge involves limiting yourself to 1-2 active creative projects at a time to improve quality, completion rates, and creative satisfaction.',
        steps: [
          'List all your current creative projects',
          'Choose 1-2 projects that excite you most right now',
          'Put other projects on hold and store their materials',
          'Focus all creative energy on your chosen projects',
          'Complete projects before starting new ones'
        ],
        benefits: [
          'Improves the quality of your creative work',
          'Increases project completion rates',
          'Reduces creative overwhelm and decision fatigue',
          'Allows for deeper exploration of ideas'
        ],
        tips: [
          'Keep an idea journal for future projects',
          'Set realistic timelines for project completion',
          'Celebrate finishing projects before starting new ones',
          'It\'s okay to abandon projects that no longer inspire you'
        ]
      },
      '54': {
        overview: 'Digital creative cleanup involves organizing digital creative files, deleting unused projects, and creating systems that make finding and managing creative work efficient.',
        steps: [
          'Create a clear folder structure for different types of creative work',
          'Delete incomplete projects you\'re no longer interested in',
          'Archive completed projects in organized folders',
          'Use consistent naming conventions for files',
          'Set up regular backup systems for important work'
        ],
        benefits: [
          'Makes finding creative files quick and easy',
          'Frees up storage space on your devices',
          'Reduces digital overwhelm and distraction',
          'Protects your creative work through organized backup'
        ],
        tips: [
          'Use descriptive file names that you\'ll understand later',
          'Create separate folders for works in progress vs. completed projects',
          'Regularly export or save work in multiple formats',
          'Consider cloud storage for accessing work from multiple devices'
        ]
      },
      '55': {
        overview: 'Inspiration curation involves creating a focused collection of truly inspiring references, ideas, and examples that fuel your creativity without overwhelming you with too much input.',
        steps: [
          'Gather inspiration from various sources you currently follow',
          'Evaluate each source for how much it actually inspires your work',
          'Keep only sources that consistently provide valuable inspiration',
          'Organize inspiration by project, medium, or theme',
          'Review and refresh your inspiration collection regularly'
        ],
        benefits: [
          'Provides focused, relevant inspiration for your work',
          'Reduces information overload and creative paralysis',
          'Helps you develop your unique creative voice',
          'Makes it easier to find inspiration when you need it'
        ],
        tips: [
          'Quality of inspiration matters more than quantity',
          'Include diverse sources to expand your creative perspective',
          'Regularly purge inspiration that no longer resonates',
          'Balance consuming inspiration with creating original work'
        ]
      },
      '56': {
        overview: 'Minimalist packing system involves mastering the art of packing light for any trip by choosing versatile clothing and essential items that serve multiple purposes.',
        steps: [
          'Choose a color scheme for your travel wardrobe',
          'Pack versatile pieces that can be dressed up or down',
          'Limit yourself to 2 pairs of shoes maximum',
          'Use packing cubes to organize and compress items',
          'Bring only essential toiletries in travel sizes'
        ],
        benefits: [
          'Makes travel easier with lighter, more manageable luggage',
          'Reduces stress about packing and unpacking',
          'Saves money on baggage fees',
          'Forces you to focus on versatile, quality items'
        ],
        tips: [
          'Roll clothes instead of folding to save space',
          'Wear your heaviest items on the plane',
          'Choose fabrics that don\'t wrinkle easily',
          'Remember you can buy forgotten items at your destination'
        ]
      },
      '57': {
        overview: 'Travel gear audit involves keeping only essential, multi-purpose travel items that enhance your travel experience without adding unnecessary weight or complexity.',
        steps: [
          'Gather all travel-specific gear and accessories',
          'Evaluate each item based on how often you actually use it',
          'Keep only items that serve multiple purposes or are truly essential',
          'Choose lightweight, durable versions of items you keep',
          'Test gear before important trips to ensure it works properly'
        ],
        benefits: [
          'Reduces luggage weight and packing complexity',
          'Ensures you have reliable gear when you need it',
          'Saves money by avoiding duplicate or unnecessary purchases',
          'Makes packing faster and more efficient'
        ],
        tips: [
          'Prioritize items that solve multiple problems',
          'Choose gear made from lightweight, durable materials',
          'Consider borrowing or renting specialty items for rare trips',
          'Keep a packing checklist for different types of trips'
        ]
      },
      '58': {
        overview: 'Digital nomad setup involves creating a minimal digital workspace that allows you to work effectively from anywhere while maintaining productivity and work-life balance.',
        steps: [
          'Invest in reliable, portable technology that meets your work needs',
          'Set up cloud-based systems for all your work files and tools',
          'Create backup plans for internet connectivity',
          'Establish routines that work regardless of location',
          'Minimize physical possessions to what fits in a carry-on'
        ],
        benefits: [
          'Enables location independence and travel flexibility',
          'Forces focus on essential tools and systems',
          'Improves digital organization and efficiency',
          'Reduces dependence on physical office space'
        ],
        tips: [
          'Test your setup thoroughly before traveling',
          'Have backup plans for technology failures',
          'Consider time zones when planning work schedules',
          'Maintain consistent routines to stay productive'
        ]
      },
      '59': {
        overview: 'Souvenir mindfulness involves choosing meaningful mementos over quantity when traveling, focusing on experiences and memories rather than accumulating objects.',
        steps: [
          'Set a limit on souvenirs before you travel (e.g., one per trip)',
          'Focus on experiences and photos as primary mementos',
          'Choose items that are truly unique to the location',
          'Consider practical souvenirs you\'ll actually use',
          'Buy local experiences or food rather than manufactured items'
        ],
        benefits: [
          'Reduces clutter from travel memorabilia',
          'Forces you to choose truly meaningful mementos',
          'Saves money and luggage space',
          'Encourages focus on experiences over objects'
        ],
        tips: [
          'Take photos of items you\'re tempted to buy instead',
          'Choose consumable souvenirs like local food or tea',
          'Buy one high-quality item rather than several cheap ones',
          'Consider how the item will fit into your home before purchasing'
        ]
      },
      '60': {
        overview: 'Zero waste challenge involves reducing household waste to near zero through mindful consumption, reusing items creatively, and choosing sustainable alternatives.',
        steps: [
          'Audit your current waste production for one week',
          'Refuse single-use items and unnecessary packaging',
          'Reuse containers and items for new purposes',
          'Recycle properly according to local guidelines',
          'Compost organic waste if possible'
        ],
        benefits: [
          'Significantly reduces environmental impact',
          'Saves money through reduced consumption',
          'Encourages creativity in reusing items',
          'Creates awareness of consumption patterns'
        ],
        tips: [
          'Start with the easiest swaps like reusable bags and water bottles',
          'Buy in bulk to reduce packaging waste',
          'Choose products with minimal or recyclable packaging',
          'Focus on progress, not perfection'
        ]
      },
      '61': {
        overview: 'Plastic reduction involves eliminating single-use plastics from your daily life by choosing reusable alternatives and supporting businesses with sustainable practices.',
        steps: [
          'Identify single-use plastics you use regularly',
          'Replace them with reusable alternatives (bags, bottles, containers)',
          'Choose products with minimal plastic packaging',
          'Support businesses that use sustainable packaging',
          'Properly recycle plastic items you can\'t eliminate'
        ],
        benefits: [
          'Reduces environmental pollution and waste',
          'Often saves money in the long run',
          'Supports businesses with sustainable practices',
          'Reduces exposure to potentially harmful chemicals'
        ],
        tips: [
          'Keep reusable items in convenient locations',
          'Start with the easiest swaps and build momentum',
          'Look for plastic-free alternatives in health food stores',
          'Consider making your own products like cleaning supplies'
        ]
      },
      '62': {
        overview: 'Energy consumption audit involves reducing home energy usage through conscious consumption habits, efficient appliances, and mindful daily practices.',
        steps: [
          'Track your energy usage for a month to establish baseline',
          'Replace incandescent bulbs with LED alternatives',
          'Unplug devices when not in use or use smart power strips',
          'Adjust thermostat settings for energy efficiency',
          'Seal air leaks and improve insulation where possible'
        ],
        benefits: [
          'Reduces utility bills and saves money',
          'Decreases environmental impact',
          'Often improves home comfort',
          'Increases awareness of energy consumption patterns'
        ],
        tips: [
          'Focus on the biggest energy users first (heating, cooling, water heating)',
          'Use natural light when possible',
          'Run full loads in dishwashers and washing machines',
          'Consider programmable thermostats for automatic efficiency'
        ]
      },
      '63': {
        overview: 'Sustainable shopping involves choosing quality, sustainable products over cheap alternatives, supporting ethical businesses, and making purchases that align with your values.',
        steps: [
          'Research companies\' environmental and social practices',
          'Choose quality items that will last longer',
          'Support local businesses when possible',
          'Buy secondhand or refurbished items when appropriate',
          'Consider the full lifecycle cost of purchases'
        ],
        benefits: [
          'Supports businesses with ethical practices',
          'Often results in higher quality, longer-lasting products',
          'Reduces environmental impact of consumption',
          'Aligns spending with personal values'
        ],
        tips: [
          'Buy less overall, but choose better quality',
          'Research before making significant purchases',
          'Consider the true cost including environmental impact',
          'Support companies that align with your values'
        ]
      },
      '64': {
        overview: 'Local living challenge involves sourcing food and goods locally to reduce environmental impact, support your community, and often enjoy fresher, higher-quality products.',
        steps: [
          'Find local farmers markets and farm stands in your area',
          'Join a community-supported agriculture (CSA) program',
          'Shop at locally-owned businesses when possible',
          'Choose seasonal produce that grows in your region',
          'Learn about local producers and artisans'
        ],
        benefits: [
          'Reduces transportation-related environmental impact',
          'Supports local economy and community',
          'Often provides fresher, more nutritious food',
          'Connects you with your local community'
        ],
        tips: [
          'Start with one category like produce and expand gradually',
          'Learn what grows seasonally in your area',
          'Build relationships with local vendors',
          'Be flexible with meal planning based on seasonal availability'
        ]
      },
      '65': {
        overview: 'Morning routine simplification involves creating a streamlined, energizing start to your day that sets a positive tone while being sustainable and realistic for your lifestyle.',
        steps: [
          'Identify 3-5 key activities that energize you in the morning',
          'Prepare as much as possible the night before',
          'Wake up at a consistent time, even on weekends',
          'Avoid checking phone or email immediately upon waking',
          'Include movement, hydration, and planning in your routine'
        ],
        benefits: [
          'Provides a calm, intentional start to the day',
          'Reduces morning stress and decision fatigue',
          'Improves energy and mood throughout the day',
          'Creates consistency and structure'
        ],
        tips: [
          'Start with a simple routine and build gradually',
          'Focus on how activities make you feel rather than what you think you should do',
          'Be flexible and adjust the routine as needed',
          'Prepare everything you need the night before'
        ]
      },
      '66': {
        overview: 'Evening wind-down involves establishing a calming routine that helps you transition from the day\'s activities to restful sleep, improving sleep quality and overall well-being.',
        steps: [
          'Set a consistent bedtime and work backward to plan your routine',
          'Dim lights and avoid screens 1 hour before bed',
          'Include relaxing activities like reading, gentle stretching, or meditation',
          'Prepare for the next day to reduce morning stress',
          'Keep the routine simple and sustainable'
        ],
        benefits: [
          'Improves sleep quality and duration',
          'Reduces stress and anxiety',
          'Creates a peaceful transition between day and night',
          'Helps you wake up feeling more rested'
        ],
        tips: [
          'Keep the routine consistent, even on weekends',
          'Choose activities that genuinely relax you',
          'Prepare your bedroom environment for optimal sleep',
          'Be patient as your body adjusts to the new routine'
        ]
      },
      '67': {
        overview: 'Habit stacking involves linking new minimal habits to existing routines, making it easier to adopt and maintain positive changes in your daily life.',
        steps: [
          'Identify existing habits that are already well-established',
          'Choose small, specific new habits you want to develop',
          'Link new habits to existing ones using "after I... I will..." format',
          'Start with tiny habits that take less than 2 minutes',
          'Be consistent for at least 21 days to establish the connection'
        ],
        benefits: [
          'Makes new habits easier to remember and maintain',
          'Builds on existing successful routines',
          'Creates positive momentum for additional changes',
          'Reduces willpower needed to maintain new habits'
        ],
        tips: [
          'Start with very small habits to ensure success',
          'Choose habits that naturally fit with your existing routine',
          'Be specific about when and where you\'ll do the new habit',
          'Celebrate small wins to reinforce the habit loop'
        ]
      },
      '68': {
        overview: 'Decision fatigue reduction involves automating or eliminating daily micro-decisions to preserve mental energy for more important choices and improve overall productivity.',
        steps: [
          'Identify recurring decisions you make daily',
          'Create standard responses or choices for routine decisions',
          'Automate decisions where possible (meal planning, outfit choices)',
          'Batch similar decisions together',
          'Simplify options to reduce choice complexity'
        ],
        benefits: [
          'Preserves mental energy for important decisions',
          'Reduces stress and overwhelm',
          'Improves consistency in daily routines',
          'Increases productivity and focus'
        ],
        tips: [
          'Start with decisions that happen most frequently',
          'Create "uniforms" for different situations',
          'Use meal planning to eliminate daily food decisions',
          'Set up automatic systems for routine tasks'
        ]
      },
      '69': {
        overview: 'Mindfulness practice involves developing a simple daily routine that cultivates present-moment awareness, reduces stress, and improves overall mental clarity and well-being.',
        steps: [
          'Start with just 5 minutes of daily mindfulness practice',
          'Choose a consistent time and place for practice',
          'Focus on breath awareness or body sensations',
          'Notice when your mind wanders and gently return attention to the present',
          'Gradually increase practice time as it becomes habitual'
        ],
        benefits: [
          'Reduces stress and anxiety',
          'Improves focus and concentration',
          'Enhances emotional regulation',
          'Increases self-awareness and clarity'
        ],
        tips: [
          'Consistency matters more than duration',
          'Use guided meditations if you\'re new to practice',
          'Be patient and kind with yourself as you learn',
          'Practice mindfulness during daily activities too'
        ]
      },
      '70': {
        overview: 'Single-tasking practice involves focusing on one task at a time rather than multitasking, improving productivity, quality of work, and reducing stress and mental fatigue.',
        steps: [
          'Choose one task to focus on completely',
          'Close unnecessary browser tabs and applications',
          'Turn off notifications during focused work time',
          'Use time-blocking to dedicate specific periods to specific tasks',
          'Take breaks between tasks to reset your attention'
        ],
        benefits: [
          'Improves quality and accuracy of work',
          'Increases productivity and efficiency',
          'Reduces stress and mental fatigue',
          'Enhances creativity and problem-solving'
        ],
        tips: [
          'Start with shorter focused periods and build up',
          'Use the Pomodoro Technique for structured focus time',
          'Identify your peak energy times for important tasks',
          'Practice returning attention to the task when your mind wanders'
        ]
      }
    };

    return descriptions[taskId] || {
      overview: 'This task will help you simplify and organize this area of your life, creating more space for what truly matters.',
      steps: ['Assess your current situation', 'Identify what to keep vs. remove', 'Organize remaining items', 'Maintain your new system'],
      benefits: ['Reduces clutter and stress', 'Saves time and energy', 'Creates a more peaceful environment', 'Improves focus on priorities'],
      tips: ['Start small and build momentum', 'Be honest about what you actually use', 'Focus on progress, not perfection', 'Celebrate your achievements']
    };
  };

  const details = getDetailedDescription(task.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl bg-white/20`}>
                {getTypeIcon(task.type)}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {task.type.replace('-', ' ')}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {task.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{task.timeEstimate}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold leading-tight">
                  {task.title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Overview</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {details.overview}
            </p>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Step-by-Step Guide
            </h3>
            <div className="space-y-3">
              {details.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {details.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 bg-green-50 p-3 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-800 text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-orange-500" />
              Pro Tips
            </h3>
            <div className="space-y-2">
              {details.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 bg-orange-50 p-3 rounded-xl">
                  <Lightbulb className="w-4 h-4 text-orange-600 flex-shrink-0 mt-1" />
                  <p className="text-orange-800 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Points Reward */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-center space-x-3">
              <Award className="w-8 h-8" />
              <div className="text-center">
                <div className="text-3xl font-bold">+{task.points} Points</div>
                <div className="text-indigo-100">Complete this task to earn points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Ready to start your minimalism journey with this task?
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggle(task.id);
                  onClose();
                }}
                className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                  task.completed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                }`}
              >
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;