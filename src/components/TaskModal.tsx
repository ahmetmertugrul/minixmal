import React from 'react';
import { X, Clock, Star, Award, CheckCircle, Target, Lightbulb, Users, Zap } from 'lucide-react';
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
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Wardrobe': 'bg-purple-100 text-purple-800',
      'Food': 'bg-green-100 text-green-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Home': 'bg-orange-100 text-orange-800',
      'Finance': 'bg-emerald-100 text-emerald-800',
      'Relationships': 'bg-pink-100 text-pink-800',
      'Work': 'bg-indigo-100 text-indigo-800',
      'Health': 'bg-red-100 text-red-800',
      'Creativity': 'bg-violet-100 text-violet-800',
      'Travel': 'bg-cyan-100 text-cyan-800',
      'Environment': 'bg-teal-100 text-teal-800',
      'Habits': 'bg-amber-100 text-amber-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskDetails = (taskId: string) => {
    const details: { [key: string]: { overview: string; steps: string[]; benefits: string[]; tips: string[] } } = {
      '1': {
        overview: 'A capsule wardrobe is a curated collection of 30-40 versatile pieces that all work together seamlessly. This approach eliminates decision fatigue while ensuring you always look polished and put-together.',
        steps: [
          'Audit your current wardrobe and identify your most-worn pieces',
          'Choose a cohesive color palette of 3-4 colors that complement each other',
          'Select quality basics: well-fitting jeans, classic shirts, blazers, and versatile shoes',
          'Ensure every piece can mix and match with at least 3 other items',
          'Donate or store items that don\'t fit your new capsule criteria',
          'Create outfit combinations and document them for easy reference'
        ],
        benefits: [
          'Reduces decision fatigue and morning stress',
          'Saves money by preventing impulse purchases',
          'Creates a signature style that always looks intentional',
          'Simplifies travel packing and laundry routines'
        ],
        tips: [
          'Start with neutrals like black, white, navy, and beige',
          'Invest in quality pieces that will last multiple seasons',
          'Consider your lifestyle when selecting pieces',
          'Take photos of successful outfit combinations'
        ]
      },
      '2': {
        overview: 'The one-in-one-out rule maintains balance in your wardrobe by ensuring that for every new item you bring in, one existing item must go. This prevents accumulation and keeps your closet curated.',
        steps: [
          'Before purchasing any new clothing item, identify what you\'ll remove',
          'Choose the item to donate based on wear frequency and condition',
          'Ensure the new item serves a clear purpose in your wardrobe',
          'Donate the outgoing item immediately to avoid second-guessing',
          'Keep a donation bag ready for easy implementation',
          'Track your adherence to this rule for the first month'
        ],
        benefits: [
          'Prevents wardrobe bloat and overcrowding',
          'Forces mindful purchasing decisions',
          'Keeps your closet organized and manageable',
          'Helps others through regular donations'
        ],
        tips: [
          'Apply this rule to all clothing categories including accessories',
          'Consider the cost-per-wear of new purchases',
          'Choose higher quality items that will last longer',
          'Make exceptions only for worn-out essentials'
        ]
      },
      '3': {
        overview: 'Seasonal closet rotation involves storing off-season clothes to reduce visual clutter and make your current wardrobe more functional. This creates a cleaner, more organized space.',
        steps: [
          'Sort clothes by season and current weather needs',
          'Clean all items before storing to prevent damage',
          'Use vacuum-sealed bags or clear storage containers',
          'Label storage containers with contents and season',
          'Store in a cool, dry place away from direct sunlight',
          'Set calendar reminders for seasonal transitions'
        ],
        benefits: [
          'Reduces visual clutter in your closet',
          'Makes current options more visible and accessible',
          'Protects off-season clothes from damage',
          'Creates more space for current wardrobe'
        ],
        tips: [
          'Use cedar blocks or lavender sachets to deter moths',
          'Rotate clothes every 3-4 months based on climate',
          'Keep a few transitional pieces accessible year-round',
          'Use this opportunity to assess what you actually wear'
        ]
      },
      '4': {
        overview: 'Limiting your wardrobe to 3-4 complementary colors creates a cohesive, sophisticated look where everything coordinates effortlessly. This approach maximizes outfit combinations while minimizing pieces.',
        steps: [
          'Analyze your current wardrobe to identify dominant colors',
          'Choose 2-3 neutral base colors (black, white, navy, beige, gray)',
          'Select 1-2 accent colors that complement your base palette',
          'Gradually replace items that don\'t fit your color scheme',
          'Test color combinations to ensure they work together',
          'Create a color reference guide for shopping'
        ],
        benefits: [
          'Everything in your wardrobe coordinates automatically',
          'Shopping becomes easier with clear color guidelines',
          'Creates a signature style and sophisticated appearance',
          'Maximizes outfit combinations with fewer pieces'
        ],
        tips: [
          'Consider your skin tone when choosing colors',
          'Start with colors you already love and wear often',
          'Use the 80/20 rule: 80% neutrals, 20% accent colors',
          'Take color swatches when shopping for perfect matches'
        ]
      },
      '5': {
        overview: 'A shoe audit involves keeping only footwear you wear regularly and that serves a clear purpose in your life. Quality over quantity ensures comfort and reduces clutter.',
        steps: [
          'Remove all shoes from storage and lay them out',
          'Try on each pair and assess comfort and condition',
          'Categorize by purpose: work, casual, exercise, formal',
          'Keep only one pair per category unless you have specific needs',
          'Donate shoes in good condition that you don\'t wear',
          'Invest in quality replacements for worn-out essentials'
        ],
        benefits: [
          'Easier shoe selection and organization',
          'Better foot health from wearing comfortable shoes',
          'Reduced storage needs and clutter',
          'Cost savings from buying fewer, better shoes'
        ],
        tips: [
          'Prioritize comfort over trends',
          'Choose versatile colors that match multiple outfits',
          'Invest in quality leather that improves with age',
          'Consider your actual lifestyle when selecting shoes'
        ]
      },
      '6': {
        overview: 'Curating a small collection of versatile accessories means keeping only pieces that enhance multiple outfits and reflect your personal style. Quality accessories can transform basic outfits.',
        steps: [
          'Gather all accessories: jewelry, scarves, belts, bags, watches',
          'Identify pieces you wear regularly and love',
          'Choose accessories that work with your color palette',
          'Keep only timeless pieces that won\'t go out of style',
          'Organize remaining accessories for easy visibility',
          'Donate or gift accessories you no longer wear'
        ],
        benefits: [
          'Simplified morning routine and decision-making',
          'Higher quality accessories that last longer',
          'Cohesive style that always looks intentional',
          'Reduced storage needs and clutter'
        ],
        tips: [
          'Choose classic styles over trendy pieces',
          'Invest in one high-quality watch and handbag',
          'Select jewelry in one metal tone for consistency',
          'Keep accessories visible to remember to wear them'
        ]
      },
      '7': {
        overview: 'Simplifying your laundry routine involves using fewer, more effective products and creating efficient systems. This reduces clutter and makes laundry less overwhelming.',
        steps: [
          'Audit current laundry products and their effectiveness',
          'Choose one high-quality, multi-purpose detergent',
          'Eliminate single-use products like fabric softener',
          'Organize laundry supplies in a designated area',
          'Create a simple sorting system (lights, darks, delicates)',
          'Establish a regular laundry schedule'
        ],
        benefits: [
          'Reduced chemical exposure and environmental impact',
          'Less storage space needed for products',
          'Simplified decision-making during laundry',
          'Cost savings from buying fewer products'
        ],
        tips: [
          'Use white vinegar as a natural fabric softener',
          'Air dry when possible to extend clothing life',
          'Fold clothes immediately to prevent wrinkles',
          'Keep laundry supplies minimal and organized'
        ]
      },
      '8': {
        overview: 'Uniform dressing involves creating a signature style with similar outfits, reducing decision fatigue while maintaining a polished appearance. Many successful people use this strategy.',
        steps: [
          'Identify your lifestyle needs and personal style preferences',
          'Choose a basic outfit formula (e.g., jeans + blouse + blazer)',
          'Select 3-5 variations of this formula in your color palette',
          'Ensure all pieces are high quality and well-fitting',
          'Practice creating outfits within your formula',
          'Gradually replace items that don\'t fit the formula'
        ],
        benefits: [
          'Eliminates daily outfit decision fatigue',
          'Creates a recognizable personal brand',
          'Simplifies shopping and wardrobe maintenance',
          'Always ensures appropriate, polished appearance'
        ],
        tips: [
          'Start with one formula and perfect it before adding variety',
          'Choose comfortable pieces you genuinely enjoy wearing',
          'Consider having different formulas for work and casual',
          'Focus on fit and quality over quantity'
        ]
      },
      '9': {
        overview: 'Essential kitchen tools are the foundation of efficient cooking. By keeping only tools you use weekly, you create a functional, uncluttered kitchen that inspires cooking.',
        steps: [
          'Remove all tools from drawers and cabinets',
          'Sort tools by frequency of use: daily, weekly, monthly, rarely',
          'Keep only daily and weekly use items in prime locations',
          'Store monthly items in less accessible areas',
          'Donate or discard rarely used tools',
          'Organize remaining tools for easy access and visibility'
        ],
        benefits: [
          'Faster meal preparation with easy tool access',
          'Reduced kitchen clutter and easier cleaning',
          'Better quality tools through focused investment',
          'More counter and storage space available'
        ],
        tips: [
          'Invest in one high-quality chef\'s knife',
          'Choose tools that serve multiple purposes',
          'Keep frequently used tools within arm\'s reach of prep area',
          'Replace worn tools with better quality versions'
        ]
      },
      '10': {
        overview: 'An organized pantry with clear containers and labels creates a functional, beautiful space that reduces food waste and makes meal planning easier.',
        steps: [
          'Empty entire pantry and clean all surfaces',
          'Check expiration dates and discard expired items',
          'Group similar items together (grains, spices, canned goods)',
          'Transfer dry goods to airtight, clear containers',
          'Label all containers with contents and expiration dates',
          'Organize shelves with most-used items at eye level'
        ],
        benefits: [
          'Reduced food waste through better visibility',
          'Easier meal planning and grocery shopping',
          'Protection from pests and longer food freshness',
          'Beautiful, Instagram-worthy pantry appearance'
        ],
        tips: [
          'Use uniform containers for a cohesive look',
          'Implement first-in-first-out rotation system',
          'Keep a pantry inventory list for shopping',
          'Store heavy items on lower shelves for safety'
        ]
      },
      '11': {
        overview: 'Removing single-use kitchen gadgets that rarely leave the drawer creates more space and reduces clutter. Focus on versatile tools that serve multiple purposes.',
        steps: [
          'Identify all single-use gadgets in your kitchen',
          'Assess how often you\'ve used each item in the past year',
          'Research alternative methods using basic tools',
          'Keep only gadgets you use monthly or more',
          'Donate gadgets in good condition',
          'Resist purchasing new single-use items'
        ],
        benefits: [
          'More drawer and cabinet space available',
          'Easier cleaning and organization',
          'Reduced decision fatigue when cooking',
          'Cost savings from not buying unnecessary gadgets'
        ],
        tips: [
          'A good knife can replace many specialized cutting tools',
          'Use a regular pot instead of single-use steamers',
          'Consider borrowing rarely-needed tools from friends',
          'Focus on mastering basic cooking techniques'
        ]
      },
      '12': {
        overview: 'A simple weekly meal planning routine reduces stress, saves money, and ensures healthier eating. Planning prevents last-minute decisions and food waste.',
        steps: [
          'Choose a consistent day each week for planning',
          'Review your schedule for the upcoming week',
          'Plan 5-7 meals including prep time considerations',
          'Create a grocery list based on planned meals',
          'Prep ingredients in advance when possible',
          'Keep backup easy meals for busy days'
        ],
        benefits: [
          'Reduced daily stress about meal decisions',
          'Significant cost savings on groceries',
          'Healthier eating through intentional choices',
          'Less food waste and more efficient shopping'
        ],
        tips: [
          'Start with planning just 3-4 meals per week',
          'Choose recipes with overlapping ingredients',
          'Batch cook grains and proteins for multiple meals',
          'Keep a list of family-favorite easy meals'
        ]
      },
      '13': {
        overview: 'Keeping only necessary dishes and utensils simplifies kitchen management and reduces cleaning time. One set per person plus a few extras for guests is sufficient.',
        steps: [
          'Count current household members and typical guests',
          'Keep one complete set per person plus 2-3 extras',
          'Choose durable, dishwasher-safe materials',
          'Donate excess dishes in good condition',
          'Store remaining dishes in easily accessible locations',
          'Resist accumulating promotional or novelty dishes'
        ],
        benefits: [
          'Less time spent washing and organizing dishes',
          'More cabinet space for other essentials',
          'Easier to maintain matching sets',
          'Reduced decision fatigue when setting table'
        ],
        tips: [
          'Choose white or neutral colors for versatility',
          'Invest in quality pieces that stack efficiently',
          'Keep special occasion dishes separate and minimal',
          'Replace broken pieces promptly to maintain sets'
        ]
      },
      '14': {
        overview: 'A curated spice collection with fresh, quality options enhances cooking while reducing clutter. Buy small quantities and replace regularly for best flavor.',
        steps: [
          'Check expiration dates on all current spices',
          'Discard spices older than 2-3 years',
          'Identify spices you use regularly in cooking',
          'Organize remaining spices alphabetically or by cuisine',
          'Buy small quantities of frequently used spices',
          'Label spices with purchase dates'
        ],
        benefits: [
          'Better flavor in cooking with fresh spices',
          'Easier to find spices during cooking',
          'Reduced waste from expired spices',
          'More organized and functional spice storage'
        ],
        tips: [
          'Buy whole spices when possible for longer freshness',
          'Store spices away from heat and light',
          'Keep most-used spices in prime locations',
          'Consider growing fresh herbs for frequently used ones'
        ]
      },
      '15': {
        overview: 'Keeping kitchen counters clear except for daily essentials creates a clean, functional workspace that inspires cooking and makes cleaning easier.',
        steps: [
          'Remove all items from countertops',
          'Identify truly daily-use items (coffee maker, knife block)',
          'Find storage solutions for occasional-use appliances',
          'Create designated homes for items you use weekly',
          'Establish a daily habit of clearing counters',
          'Resist the urge to use counters for storage'
        ],
        benefits: [
          'Easier daily cleaning and maintenance',
          'More workspace available for food preparation',
          'Kitchen appears larger and more organized',
          'Reduced stress from visual clutter'
        ],
        tips: [
          'Use appliance garages or cabinets for storage',
          'Keep only 2-3 items on counters maximum',
          'Choose appliances that serve multiple purposes',
          'Clean as you cook to maintain clear surfaces'
        ]
      },
      '16': {
        overview: 'A digital detox reduces screen time and digital overwhelm, improving mental clarity, sleep quality, and real-world relationships. Start with small, manageable changes.',
        steps: [
          'Track current screen time to establish baseline',
          'Set specific phone-free hours (meals, before bed)',
          'Remove social media apps from your phone',
          'Create physical phone-free zones in your home',
          'Replace digital activities with analog alternatives',
          'Use app timers to limit recreational screen time'
        ],
        benefits: [
          'Improved focus and attention span',
          'Better sleep quality and mental health',
          'Stronger real-world relationships',
          'Increased productivity and creativity'
        ],
        tips: [
          'Start with one hour of phone-free time daily',
          'Use a physical alarm clock instead of your phone',
          'Keep phones out of the bedroom',
          'Find engaging offline hobbies to replace screen time'
        ]
      },
      '17': {
        overview: 'Achieving and maintaining inbox zero creates mental clarity and ensures important emails don\'t get lost. Process emails efficiently with clear systems.',
        steps: [
          'Set aside dedicated time to process current backlog',
          'Unsubscribe from newsletters and promotions you don\'t read',
          'Create folders or labels for different types of emails',
          'Process emails using: delete, delegate, do, or defer',
          'Set specific times for checking email (2-3 times daily)',
          'Use filters and rules to automatically organize emails'
        ],
        benefits: [
          'Reduced stress and mental clutter',
          'Important emails never get lost or forgotten',
          'Faster email processing and response times',
          'Professional appearance and reliability'
        ],
        tips: [
          'Touch each email only once when processing',
          'Use templates for common responses',
          'Turn off email notifications to avoid constant interruption',
          'Archive rather than delete for important records'
        ]
      },
      '18': {
        overview: 'Removing unused apps and organizing your phone creates a more focused, intentional relationship with technology. Keep only apps that add genuine value.',
        steps: [
          'Review all apps on your phone and their last use date',
          'Delete apps you haven\'t used in the past month',
          'Organize remaining apps into logical folders',
          'Move most important apps to home screen',
          'Turn off notifications for non-essential apps',
          'Regularly review and clean up apps monthly'
        ],
        benefits: [
          'Faster phone performance and longer battery life',
          'Reduced digital distractions and time-wasting',
          'Easier to find and use important apps',
          'More intentional technology use'
        ],
        tips: [
          'Keep social media apps off your home screen',
          'Use website versions instead of apps when possible',
          'Group similar apps together in folders',
          'Consider the true value each app adds to your life'
        ]
      },
      '19': {
        overview: 'Organizing and cleaning up your photo library makes memories more accessible and frees up storage space. Remove duplicates and organize meaningfully.',
        steps: [
          'Back up all photos to cloud storage first',
          'Delete obvious duplicates and blurry photos',
          'Create albums for different events and time periods',
          'Remove screenshots and temporary photos',
          'Use photo management tools to identify similar photos',
          'Set up automatic backup for future photos'
        ],
        benefits: [
          'Faster phone performance with more storage',
          'Easier to find and share specific memories',
          'Better organization for printing or sharing',
          'Reduced anxiety from digital clutter'
        ],
        tips: [
          'Delete photos immediately if they\'re not good',
          'Use descriptive album names with dates',
          'Consider printing favorite photos for physical albums',
          'Review and clean up photos monthly'
        ]
      },
      '20': {
        overview: 'Curating your social media feeds by unfollowing accounts that don\'t add value creates a more positive, inspiring online experience.',
        steps: [
          'Review all accounts you follow on each platform',
          'Unfollow accounts that make you feel negative or inadequate',
          'Keep accounts that inspire, educate, or genuinely entertain',
          'Mute keywords related to topics that stress you',
          'Limit the number of platforms you actively use',
          'Set boundaries around social media consumption'
        ],
        benefits: [
          'More positive and inspiring social media experience',
          'Reduced comparison and negative emotions',
          'Better mental health and self-esteem',
          'More time for real-world activities'
        ],
        tips: [
          'Follow accounts aligned with your values and goals',
          'Use the "unfollow" button liberally without guilt',
          'Consider taking regular social media breaks',
          'Focus on quality connections over follower count'
        ]
      },
      '21': {
        overview: 'A password manager simplifies login management while improving security. Use strong, unique passwords for every account without memorizing them.',
        steps: [
          'Research and choose a reputable password manager',
          'Install the password manager on all devices',
          'Import existing passwords or create new strong ones',
          'Enable two-factor authentication where possible',
          'Use the password generator for new accounts',
          'Regularly review and update old passwords'
        ],
        benefits: [
          'Improved security with unique passwords for every account',
          'Simplified login process across all devices',
          'Reduced stress from forgotten passwords',
          'Better protection against data breaches'
        ],
        tips: [
          'Choose a password manager with good reviews and security',
          'Use a strong master password you can remember',
          'Enable automatic password updates when possible',
          'Regularly backup your password database'
        ]
      },
      '22': {
        overview: 'Organizing cloud storage with a clear folder structure makes files easy to find and reduces digital stress. Create logical systems that work for your needs.',
        steps: [
          'Create a folder structure based on your life categories',
          'Move files from desktop and downloads into appropriate folders',
          'Delete duplicate files and old versions',
          'Use consistent naming conventions for files',
          'Set up automatic sync across devices',
          'Regularly clean up and organize new files'
        ],
        benefits: [
          'Faster file retrieval and better productivity',
          'Automatic backup and sync across devices',
          'Reduced stress from lost or disorganized files',
          'Professional organization for work documents'
        ],
        tips: [
          'Use descriptive folder names and file names',
          'Keep folder structure simple and logical',
          'Archive old files rather than deleting important documents',
          'Use tags or labels for additional organization'
        ]
      },
      '23': {
        overview: 'Turning off non-essential notifications reduces interruptions and improves focus. Be intentional about which apps deserve your immediate attention.',
        steps: [
          'Review notification settings for all apps',
          'Turn off notifications for social media and entertainment apps',
          'Keep notifications only for essential communications',
          'Use "Do Not Disturb" mode during focused work time',
          'Set specific times for checking non-urgent messages',
          'Customize notification sounds for different priorities'
        ],
        benefits: [
          'Improved focus and productivity',
          'Reduced stress and anxiety from constant interruptions',
          'Better control over your time and attention',
          'More intentional technology use'
        ],
        tips: [
          'Start by turning off all notifications, then add back only essential ones',
          'Use scheduled "Do Not Disturb" for sleep and work hours',
          'Check messages at designated times rather than reactively',
          'Consider using a separate device for work communications'
        ]
      },
      '24': {
        overview: 'Systematically decluttering each room creates a peaceful, organized home environment. Take it one room at a time to avoid overwhelm.',
        steps: [
          'Choose one room to start with (preferably the easiest)',
          'Remove everything from the room',
          'Clean the empty space thoroughly',
          'Sort items into keep, donate, trash, and relocate piles',
          'Return only items you love and use to the room',
          'Organize remaining items with designated homes'
        ],
        benefits: [
          'Peaceful, organized living environment',
          'Easier cleaning and maintenance',
          'Better mental clarity and reduced stress',
          'More space for activities you enjoy'
        ],
        tips: [
          'Start with the room that will give you the most motivation',
          'Take before and after photos for motivation',
          'Don\'t move on to the next room until the current one is complete',
          'Involve family members in decisions about shared spaces'
        ]
      },
      '25': {
        overview: 'Keeping only furniture that serves a clear purpose creates more open, functional living spaces. Multi-functional pieces maximize utility while minimizing clutter.',
        steps: [
          'List all furniture pieces and their primary functions',
          'Identify pieces that serve multiple purposes',
          'Remove furniture that\'s rarely used or purely decorative',
          'Consider the flow and functionality of each room',
          'Sell or donate excess furniture in good condition',
          'Invest in quality, multi-functional pieces when needed'
        ],
        benefits: [
          'More open, spacious feeling in your home',
          'Easier cleaning and room maintenance',
          'Better traffic flow and functionality',
          'Reduced dusting and upkeep requirements'
        ],
        tips: [
          'Choose furniture that serves multiple functions',
          'Consider the scale of furniture relative to room size',
          'Invest in quality pieces that will last',
          'Leave adequate space for movement and activities'
        ]
      },
      '26': {
        overview: 'Displaying only meaningful decorations and artwork creates a curated, intentional aesthetic. Each piece should bring joy or serve a purpose.',
        steps: [
          'Remove all decorative items from surfaces and walls',
          'Sort items by emotional significance and aesthetic value',
          'Choose only pieces that truly bring you joy',
          'Create focal points rather than scattered decoration',
          'Leave plenty of white space for visual rest',
          'Rotate seasonal decorations rather than displaying everything'
        ],
        benefits: [
          'Cleaner, more sophisticated aesthetic',
          'Easier dusting and cleaning',
          'Greater appreciation for displayed pieces',
          'More peaceful, calming environment'
        ],
        tips: [
          'Follow the rule of odd numbers for groupings',
          'Choose a consistent color palette for cohesion',
          'Display items at eye level for best impact',
          'Leave surfaces mostly clear for functionality'
        ]
      },
      '27': {
        overview: 'Creating organized storage solutions ensures everything has a designated home, making it easier to maintain order and find items when needed.',
        steps: [
          'Assess storage needs for remaining items',
          'Invest in appropriate storage containers and organizers',
          'Label all storage containers clearly',
          'Create zones for different types of items',
          'Use vertical space efficiently with shelving',
          'Implement easy-to-maintain organization systems'
        ],
        benefits: [
          'Everything has a designated place',
          'Faster cleanup and organization',
          'Easier to find items when needed',
          'Maintained organization over time'
        ],
        tips: [
          'Use clear containers to see contents easily',
          'Store frequently used items in accessible locations',
          'Group similar items together',
          'Make organization systems simple enough to maintain'
        ]
      },
      '28': {
        overview: 'Going paperless where possible and organizing important documents reduces physical clutter while improving document security and accessibility.',
        steps: [
          'Gather all paper documents from around your home',
          'Sort into categories: keep, scan, shred',
          'Scan important documents to digital format',
          'Shred sensitive documents securely',
          'Create a simple filing system for remaining papers',
          'Set up digital systems for future documents'
        ],
        benefits: [
          'Reduced physical clutter and storage needs',
          'Better document security and backup',
          'Easier document retrieval and sharing',
          'Environmental benefits from reduced paper use'
        ],
        tips: [
          'Keep only original documents that legally require physical copies',
          'Use cloud storage for digital document backup',
          'Create a simple, logical filing system',
          'Scan documents immediately rather than letting them pile up'
        ]
      },
      '29': {
        overview: 'Using multi-purpose cleaners and reducing chemical clutter creates a simpler, more natural cleaning routine while reducing storage needs.',
        steps: [
          'Inventory all current cleaning products',
          'Research natural, multi-purpose alternatives',
          'Choose 3-5 essential cleaning products maximum',
          'Dispose of excess chemicals safely',
          'Organize remaining products in a designated area',
          'Create simple cleaning routines with fewer products'
        ],
        benefits: [
          'Reduced chemical exposure for family and pets',
          'Less storage space needed for cleaning supplies',
          'Simplified cleaning routines and decisions',
          'Cost savings from buying fewer products'
        ],
        tips: [
          'White vinegar and baking soda handle most cleaning tasks',
          'Choose concentrated products to reduce packaging',
          'Use microfiber cloths for effective cleaning with less product',
          'Make your own simple cleaners with basic ingredients'
        ]
      },
      '30': {
        overview: 'Keeping only necessary linens in good condition simplifies laundry and storage while ensuring you always have fresh, quality bedding and towels.',
        steps: [
          'Gather all linens: sheets, towels, blankets, pillowcases',
          'Assess condition and keep only items in good repair',
          'Follow the rule: 2 sets per bed, 2 towels per person',
          'Donate excess linens in good condition',
          'Organize remaining linens by type and size',
          'Invest in quality replacements for worn items'
        ],
        benefits: [
          'Easier linen closet organization',
          'Simplified laundry routines',
          'Always fresh, quality linens available',
          'Reduced storage space requirements'
        ],
        tips: [
          'Choose neutral colors that coordinate with any decor',
          'Invest in quality linens that improve with washing',
          'Fold linens consistently for neat storage',
          'Replace worn linens promptly to maintain quality'
        ]
      },
      '31': {
        overview: 'Creating a clutter-free, functional entryway sets a positive tone for your home and provides practical storage for daily essentials.',
        steps: [
          'Remove all items currently in the entryway',
          'Install hooks for coats and bags',
          'Add a small table or shelf for keys and mail',
          'Include a basket or tray for shoes',
          'Keep only current season outerwear accessible',
          'Establish daily habits for maintaining organization'
        ],
        benefits: [
          'Welcoming first impression for guests',
          'Easier departure and arrival routines',
          'Reduced lost keys and forgotten items',
          'Sets organized tone for entire home'
        ],
        tips: [
          'Keep entryway minimal and functional',
          'Use furniture that provides both seating and storage',
          'Add a mirror for last-minute appearance checks',
          'Include a small dish for pocket items'
        ]
      },
      '32': {
        overview: 'Keeping only daily-use toiletries and essential products creates a clean, spa-like bathroom environment while simplifying routines.',
        steps: [
          'Remove all products from bathroom surfaces and cabinets',
          'Check expiration dates and discard old products',
          'Keep only products you use daily or weekly',
          'Store backup products in a separate location',
          'Organize remaining products by frequency of use',
          'Create designated spots for each type of product'
        ],
        benefits: [
          'Cleaner, more spa-like bathroom appearance',
          'Easier cleaning and maintenance',
          'Simplified morning and evening routines',
          'Better product visibility and usage'
        ],
        tips: [
          'Use drawer organizers for small items',
          'Keep counters as clear as possible',
          'Choose multi-purpose products when possible',
          'Store daily items within easy reach'
        ]
      },
      '33': {
        overview: 'Transforming your bedroom into a peaceful, clutter-free sanctuary promotes better sleep and creates a calming retreat from daily stress.',
        steps: [
          'Remove all non-sleep related items from the bedroom',
          'Clear nightstands of everything except essentials',
          'Remove electronics and screens from the bedroom',
          'Choose calming, neutral colors for bedding and decor',
          'Ensure adequate storage for clothing and personal items',
          'Create a relaxing bedtime environment'
        ],
        benefits: [
          'Improved sleep quality and duration',
          'Reduced stress and anxiety',
          'Better romantic atmosphere',
          'Clearer mental space for rest and relaxation'
        ],
        tips: [
          'Keep only books, water, and alarm clock on nightstands',
          'Use blackout curtains for better sleep',
          'Choose comfortable, quality bedding',
          'Maintain cool temperature for optimal sleep'
        ]
      },
      '34': {
        overview: 'Creating a simple, sustainable budgeting system helps you track spending and save money without overwhelming complexity. Focus on broad categories and automation.',
        steps: [
          'Track current spending for one month to establish baseline',
          'Create 4-5 broad spending categories',
          'Set realistic limits for each category',
          'Automate savings transfers and bill payments',
          'Review spending weekly and adjust as needed',
          'Use simple tools like spreadsheets or basic apps'
        ],
        benefits: [
          'Better awareness of spending patterns',
          'Increased savings and financial security',
          'Reduced financial stress and anxiety',
          'Achievement of financial goals'
        ],
        tips: [
          'Start with simple categories: housing, food, transportation, savings',
          'Use the 50/30/20 rule as a starting point',
          'Automate as much as possible to reduce decision fatigue',
          'Review and adjust monthly rather than daily'
        ]
      },
      '35': {
        overview: 'Canceling unused subscriptions and memberships eliminates recurring charges for services you don\'t use, freeing up money for things you value.',
        steps: [
          'List all current subscriptions and memberships',
          'Review bank and credit card statements for recurring charges',
          'Assess actual usage of each service',
          'Cancel subscriptions you haven\'t used in the past month',
          'Set calendar reminders for annual subscription renewals',
          'Consider sharing family plans for services you do use'
        ],
        benefits: [
          'Immediate monthly savings on unused services',
          'Simplified financial management',
          'More money available for priorities',
          'Reduced digital clutter from unused services'
        ],
        tips: [
          'Take screenshots of cancellation confirmations',
          'Cancel immediately rather than waiting for renewal',
          'Use free alternatives when possible',
          'Review subscriptions quarterly to catch new unused services'
        ]
      },
      '36': {
        overview: 'Practicing mindful spending by waiting before non-essential purchases helps break impulse buying habits and ensures purchases align with your values.',
        steps: [
          'Implement a 24-48 hour waiting period for non-essential purchases',
          'Ask yourself: Do I need this? Will it add value to my life?',
          'Consider the cost per use of potential purchases',
          'Sleep on big purchases and revisit the decision',
          'Keep a wish list and review it monthly',
          'Focus spending on experiences over things'
        ],
        benefits: [
          'Reduced impulse purchases and buyer\'s remorse',
          'More money available for important goals',
          'Greater satisfaction with purchases made',
          'Alignment of spending with personal values'
        ],
        tips: [
          'Remove shopping apps from your phone',
          'Unsubscribe from promotional emails',
          'Shop with a list and stick to it',
          'Consider borrowing or renting instead of buying'
        ]
      },
      '37': {
        overview: 'Simplifying your banking by consolidating to essential accounts reduces complexity and makes financial management easier.',
        steps: [
          'List all current bank accounts and their purposes',
          'Identify accounts with low balances or high fees',
          'Choose 2-3 accounts maximum: checking, savings, investment',
          'Transfer funds and close unnecessary accounts',
          'Set up automatic transfers between remaining accounts',
          'Simplify by using one primary bank when possible'
        ],
        benefits: [
          'Easier financial tracking and management',
          'Reduced fees and minimum balance requirements',
          'Simplified tax preparation',
          'Better relationship with primary bank'
        ],
        tips: [
          'Keep one checking and one savings account minimum',
          'Choose banks with good customer service and low fees',
          'Automate transfers to make saving effortless',
          'Maintain emergency fund in easily accessible savings'
        ]
      },
      '38': {
        overview: 'Streamlining investments with simple, low-cost index funds reduces complexity while providing diversified market exposure for long-term growth.',
        steps: [
          'Review current investment accounts and holdings',
          'Research low-cost index funds that match your risk tolerance',
          'Consolidate investments with one or two providers',
          'Set up automatic monthly contributions',
          'Rebalance portfolio annually or when significantly off target',
          'Avoid frequent trading and market timing'
        ],
        benefits: [
          'Lower investment fees and better long-term returns',
          'Simplified portfolio management',
          'Reduced stress from complex investment decisions',
          'Better diversification with less effort'
        ],
        tips: [
          'Focus on total stock market and bond index funds',
          'Keep investment fees under 0.5% annually',
          'Automate contributions to dollar-cost average',
          'Ignore short-term market fluctuations'
        ]
      },
      '39': {
        overview: 'Focusing energy on relationships that truly matter creates deeper connections and reduces social stress. Quality over quantity applies to friendships too.',
        steps: [
          'List your current relationships and their impact on your life',
          'Identify relationships that energize vs. drain you',
          'Invest more time in positive, supportive relationships',
          'Set boundaries with negative or demanding people',
          'Let superficial relationships naturally fade',
          'Be intentional about social commitments'
        ],
        benefits: [
          'Deeper, more meaningful relationships',
          'Reduced social stress and obligation',
          'More time for relationships that matter',
          'Better emotional support and connection'
        ],
        tips: [
          'Quality time matters more than quantity of friends',
          'Be honest about relationships that no longer serve you',
          'Invest in relationships that are reciprocal',
          'Don\'t feel guilty about letting some friendships fade'
        ]
      },
      '40': {
        overview: 'Streamlining communication by being direct and honest reduces misunderstandings and creates more authentic relationships.',
        steps: [
          'Practice saying what you mean clearly and kindly',
          'Reduce small talk and focus on meaningful conversation',
          'Listen actively without planning your response',
          'Ask direct questions when you need information',
          'Express appreciation and concerns honestly',
          'Use fewer communication channels and check them less frequently'
        ],
        benefits: [
          'Clearer understanding and fewer misunderstandings',
          'More authentic and meaningful relationships',
          'Reduced time spent on superficial communication',
          'Better conflict resolution and problem-solving'
        ],
        tips: [
          'Practice active listening without interrupting',
          'Be honest about your needs and boundaries',
          'Choose phone calls over text for important conversations',
          'Express gratitude and appreciation regularly'
        ]
      },
      '41': {
        overview: 'Being selective about events and commitments that align with your values protects your time and energy for what matters most.',
        steps: [
          'Review current commitments and their alignment with your values',
          'Learn to say no gracefully to requests that don\'t fit',
          'Choose events that energize rather than drain you',
          'Consider the opportunity cost of each commitment',
          'Protect time for rest and personal priorities',
          'Be honest about your capacity and limits'
        ],
        benefits: [
          'More time for priorities and relationships that matter',
          'Reduced stress and overwhelm from overcommitment',
          'Better energy for commitments you do make',
          'Alignment of actions with personal values'
        ],
        tips: [
          'Practice saying "Let me check my calendar and get back to you"',
          'Remember that saying no to one thing means saying yes to something else',
          'Choose commitments that align with your current life season',
          'Don\'t feel guilty about protecting your time and energy'
        ]
      },
      '42': {
        overview: 'Focusing on meaningful gifts that create experiences rather than clutter shows thoughtfulness while supporting minimalist values.',
        steps: [
          'Consider experiences like concerts, classes, or trips',
          'Give consumables like quality food, wine, or bath products',
          'Offer services like house cleaning or meal delivery',
          'Create handmade gifts that show personal effort',
          'Give gifts that replace multiple lesser items',
          'Focus on the recipient\'s actual needs and interests'
        ],
        benefits: [
          'Gifts that create memories rather than clutter',
          'More thoughtful and personal gift-giving',
          'Support for recipients\' minimalist goals',
          'Often more meaningful than material possessions'
        ],
        tips: [
          'Ask recipients about their current needs or interests',
          'Consider gifts that support their hobbies or goals',
          'Experience gifts often provide lasting memories',
          'Quality over quantity applies to gift-giving too'
        ]
      },
      '43': {
        overview: 'Creating a clean, distraction-free workspace promotes focus and creativity while reducing stress and improving productivity.',
        steps: [
          'Clear your desk of everything except current work',
          'Organize cables and eliminate visual clutter',
          'Keep only essential tools within arm\'s reach',
          'Create designated storage for supplies and documents',
          'Ensure good lighting and ergonomic setup',
          'Establish daily habits for maintaining organization'
        ],
        benefits: [
          'Improved focus and concentration',
          'Increased productivity and creativity',
          'Reduced stress and mental clutter',
          'Professional appearance for video calls'
        ],
        tips: [
          'Use cable management solutions for clean appearance',
          'Keep personal items minimal and meaningful',
          'Invest in good lighting and comfortable seating',
          'Clear your desk at the end of each workday'
        ]
      },
      '44': {
        overview: 'Implementing a simple, effective task management system helps you prioritize work and reduce mental clutter from trying to remember everything.',
        steps: [
          'Choose one task management system and stick with it',
          'Capture all tasks in your system, not in your head',
          'Prioritize tasks using a simple method (urgent/important)',
          'Review and update your task list daily',
          'Focus on completing tasks rather than adding more',
          'Use time-blocking for important work'
        ],
        benefits: [
          'Reduced mental stress from trying to remember everything',
          'Better prioritization of important work',
          'Increased productivity and task completion',
          'Clearer overview of workload and commitments'
        ],
        tips: [
          'Keep your system simple enough to maintain consistently',
          'Review tasks weekly to ensure alignment with goals',
          'Use the two-minute rule: do it now if it takes less than two minutes',
          'Focus on progress, not perfection'
        ]
      },
      '45': {
        overview: 'Reducing unnecessary meetings and making remaining ones more effective saves time and increases productivity for everyone involved.',
        steps: [
          'Question whether each meeting is truly necessary',
          'Suggest alternatives like email or quick calls when appropriate',
          'Set clear agendas and time limits for meetings you do attend',
          'Come prepared and encourage others to do the same',
          'End meetings early when objectives are met',
          'Follow up with clear action items and deadlines'
        ],
        benefits: [
          'More time for focused, productive work',
          'Reduced meeting fatigue and stress',
          'More effective communication and decision-making',
          'Better respect for everyone\'s time'
        ],
        tips: [
          'Default to 25 or 45-minute meetings instead of 30 or 60',
          'Stand during meetings to encourage brevity',
          'Use shared documents for updates instead of status meetings',
          'Practice saying "I don\'t think I can add value to this meeting"'
        ]
      },
      '46': {
        overview: 'Processing work emails efficiently with clear systems and boundaries prevents email from overwhelming your workday and improves response times.',
        steps: [
          'Set specific times for checking and responding to email',
          'Use folders or labels to organize different types of emails',
          'Create templates for common responses',
          'Unsubscribe from unnecessary work-related emails',
          'Use clear, concise subject lines in your emails',
          'Set expectations for response times with colleagues'
        ],
        benefits: [
          'Reduced interruptions and improved focus',
          'Faster email processing and response times',
          'Better organization of important communications',
          'Reduced stress from email overload'
        ],
        tips: [
          'Turn off email notifications during focused work time',
          'Use the BRIEF method: Brief, Relevant, Informative, Engaging, Friendly',
          'Process emails in batches rather than throughout the day',
          'Use auto-responses to set expectations when away'
        ]
      },
      '47': {
        overview: 'Keeping only essential, evidence-based supplements reduces clutter and expense while focusing on what actually benefits your health.',
        steps: [
          'Review all current supplements and their purposes',
          'Research evidence for each supplement\'s effectiveness',
          'Consult with healthcare provider about necessity',
          'Keep only supplements with strong evidence and clear benefits',
          'Check expiration dates and dispose of old supplements',
          'Focus on getting nutrients from whole foods when possible'
        ],
        benefits: [
          'Reduced expense on unnecessary supplements',
          'Less bathroom clutter and organization',
          'Focus on evidence-based health practices',
          'Simplified daily routine'
        ],
        tips: [
          'Vitamin D and B12 are commonly beneficial supplements',
          'Get blood work to identify actual deficiencies',
          'Choose high-quality supplements from reputable brands',
          'Focus on diet and lifestyle before supplementation'
        ]
      },
      '48': {
        overview: 'Creating a simple, sustainable exercise routine you can maintain long-term is more effective than complex programs you\'ll abandon.',
        steps: [
          'Choose activities you genuinely enjoy',
          'Start with 20-30 minutes of movement daily',
          'Focus on consistency over intensity',
          'Use bodyweight exercises that require no equipment',
          'Schedule exercise like any other important appointment',
          'Track progress to maintain motivation'
        ],
        benefits: [
          'Improved physical and mental health',
          'Increased energy and better sleep',
          'Reduced stress and anxiety',
          'Long-term sustainable fitness habits'
        ],
        tips: [
          'Walking is one of the best exercises for most people',
          'Combine strength, cardio, and flexibility training',
          'Exercise outdoors when possible for additional benefits',
          'Find an accountability partner or group'
        ]
      },
      '49': {
        overview: 'Simplifying skincare to essential, effective products reduces clutter and expense while often improving skin health through less irritation.',
        steps: [
          'Identify your skin type and main concerns',
          'Keep only cleanser, moisturizer, and sunscreen as basics',
          'Add one treatment product if needed (retinol, vitamin C)',
          'Remove products that irritate or don\'t show results',
          'Use products consistently for at least 4-6 weeks',
          'Patch test new products before full use'
        ],
        benefits: [
          'Simplified morning and evening routines',
          'Reduced skin irritation from too many products',
          'Cost savings on unnecessary products',
          'Better understanding of what works for your skin'
        ],
        tips: [
          'Less is often more with skincare',
          'Sunscreen is the most important anti-aging product',
          'Introduce new products one at a time',
          'Focus on gentle, fragrance-free products'
        ]
      },
      '50': {
        overview: 'Optimizing your sleep environment for better rest improves every aspect of health and daily performance. Small changes can make big differences.',
        steps: [
          'Keep bedroom temperature between 65-68°F (18-20°C)',
          'Use blackout curtains or eye mask for darkness',
          'Remove electronic devices and screens from bedroom',
          'Invest in comfortable, supportive mattress and pillows',
          'Keep bedroom quiet or use white noise',
          'Establish consistent bedtime and wake time'
        ],
        benefits: [
          'Improved sleep quality and duration',
          'Better mood and mental clarity',
          'Stronger immune system and physical health',
          'Increased productivity and focus'
        ],
        tips: [
          'Stop screen use 1 hour before bedtime',
          'Use bedroom only for sleep and intimacy',
          'Keep a notepad by bed for worries or ideas',
          'Consider blue light blocking glasses in evening'
        ]
      },
      '51': {
        overview: 'Keeping only art supplies you actively use and love creates an inspiring, organized creative space that encourages regular artistic practice.',
        steps: [
          'Gather all art supplies from various locations',
          'Test supplies to ensure they still work properly',
          'Keep only supplies for your current artistic interests',
          'Donate supplies in good condition that you don\'t use',
          'Organize remaining supplies by type and frequency of use',
          'Create a designated creative workspace'
        ],
        benefits: [
          'More inspiring and organized creative space',
          'Easier to find and use supplies when inspired',
          'Reduced guilt about unused expensive supplies',
          'Focus on mastering fewer mediums'
        ],
        tips: [
          'Quality supplies often work better than quantity',
          'Keep supplies visible to encourage use',
          'Focus on one or two artistic mediums',
          'Replace dried or damaged supplies promptly'
        ]
      },
      '52': {
        overview: 'Designing a minimal, inspiring creative workspace removes distractions and provides everything needed for focused artistic work.',
        steps: [
          'Choose a dedicated space for creative work',
          'Ensure excellent lighting (natural light preferred)',
          'Keep surfaces clear except for current project',
          'Organize supplies in easily accessible storage',
          'Include one inspiring element (plant, artwork, view)',
          'Remove distractions like phones or unrelated items'
        ],
        benefits: [
          'Enhanced creativity and artistic flow',
          'Reduced distractions during creative work',
          'Professional-feeling workspace that inspires',
          'Easier cleanup and organization'
        ],
        tips: [
          'Good lighting is essential for any creative work',
          'Keep workspace clean and organized',
          'Include storage for work in progress',
          'Make the space inviting and personally inspiring'
        ]
      },
      '53': {
        overview: 'Limiting yourself to 1-2 active creative projects allows for deeper focus and higher quality results rather than scattered attention.',
        steps: [
          'List all current creative projects and their status',
          'Choose 1-2 projects that excite you most',
          'Put other projects on hold or abandon them',
          'Document ideas for future projects in a notebook',
          'Focus deeply on chosen projects until completion',
          'Resist starting new projects until current ones are finished'
        ],
        benefits: [
          'Higher quality creative output',
          'Greater sense of accomplishment from completion',
          'Reduced creative overwhelm and scattered energy',
          'Better skill development through focused practice'
        ],
        tips: [
          'Finish projects before starting new ones',
          'Keep an idea journal for future inspiration',
          'Set realistic timelines for project completion',
          'Celebrate completed projects before moving to next'
        ]
      },
      '54': {
        overview: 'Organizing digital creative files and removing unused projects creates a streamlined workflow and makes finding assets easier.',
        steps: [
          'Create a logical folder structure for creative work',
          'Move files from desktop and downloads into proper folders',
          'Delete old project files and unused assets',
          'Use consistent naming conventions for files',
          'Archive completed projects separately from active ones',
          'Set up automatic backup for creative work'
        ],
        benefits: [
          'Faster file retrieval and project workflow',
          'Reduced digital clutter and confusion',
          'Better protection of creative work through organization',
          'Professional file management practices'
        ],
        tips: [
          'Use descriptive file names with dates',
          'Keep active projects easily accessible',
          'Archive old projects but don\'t delete them',
          'Back up creative work regularly'
        ]
      },
      '55': {
        overview: 'Curating a focused collection of truly inspiring references helps maintain creative motivation without overwhelming visual clutter.',
        steps: [
          'Gather inspiration from various sources (books, websites, photos)',
          'Choose only pieces that genuinely inspire your current work',
          'Create a physical or digital inspiration board',
          'Regularly refresh inspiration with new sources',
          'Remove inspiration that no longer resonates',
          'Organize inspiration by project or theme'
        ],
        benefits: [
          'Consistent creative inspiration and motivation',
          'Focused aesthetic direction for projects',
          'Reduced visual overwhelm from too much inspiration',
          'Better understanding of personal creative style'
        ],
        tips: [
          'Quality over quantity for inspiration sources',
          'Update inspiration regularly to stay fresh',
          'Include diverse sources for broader perspective',
          'Use inspiration as starting point, not copying'
        ]
      },
      '56': {
        overview: 'Mastering the art of packing light for any trip reduces stress, saves money on baggage fees, and increases travel flexibility.',
        steps: [
          'Choose a versatile color palette for all clothing',
          'Pack only items that can be mixed and matched',
          'Limit shoes to two pairs maximum',
          'Use packing cubes for organization',
          'Bring only essential toiletries in travel sizes',
          'Leave space for souvenirs or purchases'
        ],
        benefits: [
          'Easier mobility and transportation',
          'Reduced baggage fees and restrictions',
          'Less stress about lost luggage',
          'More flexibility in travel plans'
        ],
        tips: [
          'Roll clothes instead of folding to save space',
          'Wear heaviest items on the plane',
          'Choose wrinkle-resistant fabrics',
          'Bring versatile layers for different weather'
        ]
      },
      '57': {
        overview: 'Keeping only essential, multi-purpose travel items reduces luggage weight and ensures you have everything needed without excess.',
        steps: [
          'Audit all current travel gear and accessories',
          'Keep only items that serve multiple purposes',
          'Choose lightweight, durable materials',
          'Test gear before trips to ensure functionality',
          'Donate or sell travel items you never use',
          'Invest in quality pieces that will last many trips'
        ],
        benefits: [
          'Lighter luggage and easier travel',
          'Reduced packing time and decisions',
          'Better quality gear through focused investment',
          'Less storage space needed at home'
        ],
        tips: [
          'Choose gear that works for multiple types of trips',
          'Prioritize lightweight and compact items',
          'Read reviews before purchasing travel gear',
          'Consider renting gear for specialized trips'
        ]
      },
      '58': {
        overview: 'Creating a minimal digital workspace for remote work ensures productivity and professionalism regardless of location.',
        steps: [
          'Choose cloud-based tools for all work functions',
          'Ensure reliable internet backup options',
          'Minimize hardware to essentials only',
          'Create organized digital file systems',
          'Set up professional video call backgrounds',
          'Test all systems before important work'
        ],
        benefits: [
          'Location independence for work',
          'Professional appearance and reliability',
          'Reduced technology stress and complications',
          'Better work-life balance through flexibility'
        ],
        tips: [
          'Invest in good internet and backup options',
          'Keep hardware minimal but high quality',
          'Use cloud storage for all important files',
          'Have backup plans for technology failures'
        ]
      },
      '59': {
        overview: 'Choosing meaningful souvenirs over quantity creates lasting memories without accumulating clutter from every trip.',
        steps: [
          'Set a limit of one meaningful item per trip',
          'Choose items that represent the experience, not just the location',
          'Consider practical items you\'ll actually use',
          'Take photos instead of buying multiple small items',
          'Choose experiences over objects when possible',
          'Buy local products that support the community'
        ],
        benefits: [
          'More meaningful travel memories',
          'Reduced clutter from travel purchases',
          'Better appreciation for chosen souvenirs',
          'Support for local artisans and businesses'
        ],
        tips: [
          'Choose items that tell a story about your experience',
          'Consider consumables like local food or tea',
          'Buy practical items you need anyway',
          'Focus on experiences and photos for memories'
        ]
      },
      '60': {
        overview: 'Reducing household waste to near zero through mindful consumption and creative reuse benefits the environment and often saves money.',
        steps: [
          'Audit current waste production for one week',
          'Refuse single-use items when possible',
          'Reduce consumption of packaged goods',
          'Reuse containers and materials creatively',
          'Recycle properly according to local guidelines',
          'Compost organic waste if possible'
        ],
        benefits: [
          'Significant environmental impact reduction',
          'Cost savings from reduced consumption',
          'Greater awareness of consumption habits',
          'Sense of purpose and environmental responsibility'
        ],
        tips: [
          'Start with the easiest changes first',
          'Bring reusable bags and containers when shopping',
          'Buy in bulk to reduce packaging',
          'Compost food scraps if you have space'
        ]
      },
      '61': {
        overview: 'Eliminating single-use plastics from daily life reduces environmental impact and often leads to healthier, more sustainable choices.',
        steps: [
          'Identify single-use plastics in your daily routine',
          'Replace with reusable alternatives (bags, bottles, containers)',
          'Choose products with minimal or recyclable packaging',
          'Bring your own containers for takeout and shopping',
          'Use refillable products when available',
          'Educate family members about alternatives'
        ],
        benefits: [
          'Reduced environmental impact and plastic pollution',
          'Often healthier alternatives to plastic products',
          'Cost savings from reusable products',
          'Positive example for others'
        ],
        tips: [
          'Keep reusable bags in your car and by the door',
          'Choose glass or stainless steel over plastic',
          'Support businesses that offer plastic-free options',
          'Start with easy swaps and build momentum'
        ]
      },
      '62': {
        overview: 'Reducing home energy usage through conscious consumption habits lowers utility bills and environmental impact.',
        steps: [
          'Replace incandescent bulbs with LED alternatives',
          'Unplug devices when not in use',
          'Use smart power strips to eliminate phantom loads',
          'Adjust thermostat settings for efficiency',
          'Seal air leaks around windows and doors',
          'Use natural light when possible'
        ],
        benefits: [
          'Lower utility bills and energy costs',
          'Reduced environmental impact',
          'More comfortable home environment',
          'Increased awareness of energy consumption'
        ],
        tips: [
          'LED bulbs last longer and use 75% less energy',
          'Small changes can add up to significant savings',
          'Focus on heating and cooling for biggest impact',
          'Use programmable thermostats for automatic efficiency'
        ]
      },
      '63': {
        overview: 'Choosing quality, sustainable products over cheap alternatives reduces waste and often provides better value over time.',
        steps: [
          'Research companies\' sustainability practices before purchasing',
          'Choose products designed for durability and repairability',
          'Support local businesses when possible',
          'Buy secondhand for items that don\'t need to be new',
          'Consider the full lifecycle cost of products',
          'Prioritize companies with ethical labor practices'
        ],
        benefits: [
          'Support for ethical and sustainable businesses',
          'Better quality products that last longer',
          'Reduced environmental impact from consumption',
          'Alignment of purchases with personal values'
        ],
        tips: [
          'Research before buying to make informed choices',
          'Consider cost per use rather than upfront cost',
          'Support B-Corp certified companies when possible',
          'Choose local and seasonal products when available'
        ]
      },
      '64': {
        overview: 'Sourcing food and goods locally reduces environmental impact while supporting your community and often providing fresher, higher quality products.',
        steps: [
          'Find local farmers markets and farm stands',
          'Join a community supported agriculture (CSA) program',
          'Shop at locally-owned businesses when possible',
          'Choose seasonal produce from local sources',
          'Support local artisans and craftspeople',
          'Reduce reliance on shipped and packaged goods'
        ],
        benefits: [
          'Fresher, more nutritious food',
          'Support for local economy and community',
          'Reduced environmental impact from transportation',
          'Connection to local food systems and seasons'
        ],
        tips: [
          'Start with one local source and expand gradually',
          'Learn what\'s in season in your area',
          'Build relationships with local producers',
          'Consider the true cost including environmental impact'
        ]
      },
      '65': {
        overview: 'Creating a streamlined, energizing morning routine sets a positive tone for the entire day and reduces decision fatigue.',
        steps: [
          'Identify 3-5 key activities that energize you',
          'Prepare as much as possible the night before',
          'Wake up at a consistent time every day',
          'Avoid checking phone or email immediately',
          'Include movement, hydration, and planning',
          'Keep the routine simple and sustainable'
        ],
        benefits: [
          'More energy and focus throughout the day',
          'Reduced morning stress and decision fatigue',
          'Better mood and mental clarity',
          'Sense of accomplishment before the day begins'
        ],
        tips: [
          'Start small and build habits gradually',
          'Consistency matters more than complexity',
          'Prepare clothes and breakfast the night before',
          'Include something you enjoy to make it sustainable'
        ]
      },
      '66': {
        overview: 'Establishing a calming evening routine signals to your body that it\'s time to rest and improves sleep quality.',
        steps: [
          'Set a consistent bedtime and stick to it',
          'Dim lights 1-2 hours before sleep',
          'Put away electronic devices',
          'Do relaxing activities like reading or stretching',
          'Prepare for the next day to reduce morning stress',
          'Keep the routine simple and enjoyable'
        ],
        benefits: [
          'Better sleep quality and easier falling asleep',
          'Reduced stress and anxiety',
          'More prepared and organized mornings',
          'Better overall health and mood'
        ],
        tips: [
          'Blue light from screens can interfere with sleep',
          'Keep bedroom cool and dark for better sleep',
          'Try meditation or gentle stretching',
          'Prepare tomorrow\'s priorities to clear your mind'
        ]
      },
      '67': {
        overview: 'Linking new minimal habits to existing routines makes them easier to remember and maintain long-term.',
        steps: [
          'Identify existing strong habits in your routine',
          'Choose small new habits to attach to existing ones',
          'Use the formula: "After I [existing habit], I will [new habit]"',
          'Start with tiny habits that take less than 2 minutes',
          'Be consistent for at least 21 days',
          'Gradually increase the habit once it\'s established'
        ],
        benefits: [
          'Higher success rate for new habit formation',
          'Reduced mental effort to remember new habits',
          'Builds on existing successful routines',
          'Creates positive momentum for change'
        ],
        tips: [
          'Start smaller than you think necessary',
          'Attach new habits to very strong existing habits',
          'Celebrate small wins to reinforce the habit',
          'Be patient - habits take time to become automatic'
        ]
      },
      '68': {
        overview: 'Automating or eliminating daily micro-decisions reduces mental fatigue and frees cognitive energy for important choices.',
        steps: [
          'Identify recurring daily decisions that drain energy',
          'Create standard responses or choices for routine decisions',
          'Automate financial decisions like savings and bill payments',
          'Develop uniform approaches to clothing, meals, and routines',
          'Use checklists and templates for repeated tasks',
          'Eliminate unnecessary choices when possible'
        ],
        benefits: [
          'Reduced mental fatigue and decision overwhelm',
          'More mental energy for important decisions',
          'Increased consistency in daily routines',
          'Better performance on complex tasks'
        ],
        tips: [
          'Focus on decisions you make multiple times daily',
          'Create "good enough" standards rather than perfect choices',
          'Use technology to automate routine decisions',
          'Batch similar decisions together'
        ]
      },
      '69': {
        overview: 'Developing a simple daily mindfulness practice improves mental clarity, reduces stress, and increases overall well-being.',
        steps: [
          'Start with just 5 minutes of daily practice',
          'Choose a consistent time and place',
          'Focus on breath awareness or body sensations',
          'Use guided meditations if helpful',
          'Don\'t judge thoughts, simply notice them',
          'Gradually increase duration as practice develops'
        ],
        benefits: [
          'Reduced stress and anxiety',
          'Improved focus and mental clarity',
          'Better emotional regulation',
          'Increased self-awareness and presence'
        ],
        tips: [
          'Consistency is more important than duration',
          'Use apps or timers to track practice',
          'Find a quiet space free from distractions',
          'Be patient - benefits develop over time'
        ]
      },
      '70': {
        overview: 'Focusing on one task at a time improves productivity, reduces errors, and creates better quality work output.',
        steps: [
          'Close unnecessary browser tabs and applications',
          'Turn off notifications during focused work time',
          'Use time-blocking to dedicate specific periods to specific tasks',
          'Keep a notepad for capturing distracting thoughts',
          'Take regular breaks between focused work sessions',
          'Practice returning attention to the current task when it wanders'
        ],
        benefits: [
          'Higher quality work output',
          'Faster task completion',
          'Reduced stress from scattered attention',
          'Better learning and skill development'
        ],
        tips: [
          'Start with 25-minute focused work sessions',
          'Use the Pomodoro Technique for structure',
          'Create a distraction-free work environment',
          'Practice mindfulness to improve attention control'
        ]
      }
    };

    return details[taskId] || {
      overview: 'This task is designed to help you simplify and organize this area of your life through minimalist principles.',
      steps: ['Review the current situation', 'Identify what to keep vs. remove', 'Organize remaining items', 'Maintain the new system'],
      benefits: ['Reduced clutter and stress', 'Improved organization', 'More time and energy for what matters'],
      tips: ['Start small and build momentum', 'Focus on progress over perfection', 'Be patient with the process']
    };
  };

  const details = getTaskDetails(task.id);

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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-start justify-between pr-12">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(task.category)} bg-white/20 text-white`}>
                  {task.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(task.difficulty)} bg-white/20 text-white border-white/30`}>
                  {task.difficulty} difficulty
                </span>
                <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{task.timeEstimate}</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-2">
                {task.title}
              </h2>
              <p className="text-white/90 text-lg">
                {task.description}
              </p>
            </div>
          </div>
          
          {/* Points Display */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-300" />
              <span className="text-lg font-semibold">+{task.points} Points</span>
            </div>
            <button
              onClick={() => onToggle(task.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                task.completed
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-white text-indigo-600 hover:bg-gray-100'
              }`}
            >
              {task.completed ? 'Completed ✓' : 'Mark Complete'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-indigo-600" />
                Overview
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {details.overview}
              </p>
            </section>

            {/* Step-by-Step Guide */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                Step-by-Step Guide
              </h3>
              <div className="space-y-3">
                {details.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {details.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-2xl border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800 font-medium">{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pro Tips */}
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-orange-500" />
                Pro Tips
              </h3>
              <div className="space-y-3">
                {details.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                    <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-orange-800">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Complete this task to earn <span className="font-semibold text-indigo-600">+{task.points} points</span> and move closer to your minimalism goals.
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onToggle(task.id)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  task.completed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                }`}
              >
                {task.completed ? 'Mark Incomplete' : 'Complete Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;