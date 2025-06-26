export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'tip' | 'quote' | 'principle';
  content: string;
  author?: string;
  readTime: string;
  illustration: string;
}

export const recommendations: Recommendation[] = [
  {
    id: 'r1',
    title: 'The 90/90 Rule',
    description: 'If you haven\'t used something in 90 days and can\'t see yourself using it in the next 90 days, let it go.',
    category: 'Decluttering',
    type: 'principle',
    content: 'This simple rule helps you make quick decisions about items you\'re unsure about. It removes the emotional attachment and focuses on practical usage. Apply this to clothes, books, kitchen gadgets, and digital files.',
    readTime: '2 min',
    illustration: 'calendar'
  },
  {
    id: 'r2',
    title: 'Quality Over Quantity Philosophy',
    description: 'Invest in fewer, higher-quality items that last longer and bring more joy.',
    category: 'Mindset',
    type: 'principle',
    content: 'When you buy quality items, you reduce the need for frequent replacements, save money long-term, and reduce clutter. This applies to everything from clothing to kitchen tools to furniture.',
    readTime: '3 min',
    illustration: 'quality'
  },
  {
    id: 'r3',
    title: 'The One-Touch Rule',
    description: 'Handle each item only once - decide immediately whether to keep, donate, or discard.',
    category: 'Decluttering',
    type: 'tip',
    content: 'When decluttering, avoid creating "maybe" piles. Make a decision the first time you touch an item. This prevents procrastination and makes the process more efficient.',
    readTime: '2 min',
    illustration: 'touch'
  },
  {
    id: 'r4',
    title: 'Digital Minimalism Benefits',
    description: 'Reducing digital clutter improves focus, reduces anxiety, and increases productivity.',
    category: 'Technology',
    type: 'article',
    content: 'Studies show that digital clutter affects our mental state similarly to physical clutter. Clean up your digital spaces: organize files, delete unused apps, unsubscribe from emails, and curate your social media feeds.',
    readTime: '5 min',
    illustration: 'digital'
  },
  {
    id: 'r5',
    title: 'The 20/80 Principle',
    description: 'We use 20% of our possessions 80% of the time. Focus on that essential 20%.',
    category: 'Mindset',
    type: 'principle',
    content: 'Also known as the Pareto Principle, this concept helps identify what truly matters in your life. Pay attention to what you actually use and enjoy, then consider letting go of the rest.',
    readTime: '3 min',
    illustration: 'percentage'
  },
  {
    id: 'r6',
    title: 'Mindful Consumption',
    description: 'Before buying anything, ask: Do I need this? Will it add value to my life?',
    category: 'Finance',
    type: 'tip',
    content: 'Implement a 24-48 hour waiting period for non-essential purchases. Often, the desire to buy something fades. Consider the true cost: not just money, but time to maintain, space to store, and mental energy to manage.',
    readTime: '4 min',
    illustration: 'thinking'
  },
  {
    id: 'r7',
    title: 'The Container Method',
    description: 'Let the container dictate the quantity - when it\'s full, you\'re done.',
    category: 'Organization',
    type: 'tip',
    content: 'Use this for clothes (closet size), books (bookshelf space), or kitchen items (drawer space). It naturally limits accumulation and forces you to prioritize your favorites.',
    readTime: '2 min',
    illustration: 'container'
  },
  {
    id: 'r8',
    title: 'Experiences Over Things',
    description: 'Invest in experiences that create memories rather than accumulating more possessions.',
    category: 'Lifestyle',
    type: 'principle',
    content: 'Research shows experiences bring more lasting happiness than material purchases. They don\'t take up physical space, can\'t be stolen or broken, and often improve with time as they become cherished memories.',
    readTime: '4 min',
    illustration: 'experience'
  },
  {
    id: 'r9',
    title: 'The 5-Minute Rule',
    description: 'If a task takes less than 5 minutes, do it immediately rather than adding it to your to-do list.',
    category: 'Work',
    type: 'tip',
    content: 'This prevents small tasks from accumulating and becoming overwhelming. It applies to both physical tasks (putting items away) and digital tasks (responding to quick emails).',
    readTime: '2 min',
    illustration: 'clock'
  },
  {
    id: 'r10',
    title: 'Seasonal Decluttering',
    description: 'Review and declutter your possessions with each season change.',
    category: 'Habits',
    type: 'tip',
    content: 'Use seasonal transitions as natural checkpoints. As you switch out seasonal items, evaluate what you actually used and what can be donated. This prevents accumulation over time.',
    readTime: '3 min',
    illustration: 'seasons'
  },
  {
    id: 'r11',
    title: 'The Joy Test',
    description: 'Keep items that spark joy and serve a purpose in your current life.',
    category: 'Decluttering',
    type: 'principle',
    content: 'Popularized by Marie Kondo, this method focuses on positive selection rather than elimination. Hold each item and notice your emotional response. Keep things that make you feel good and serve your current lifestyle.',
    readTime: '3 min',
    illustration: 'joy'
  },
  {
    id: 'r12',
    title: 'Multi-Purpose Items',
    description: 'Choose items that serve multiple functions to reduce overall quantity.',
    category: 'Home',
    type: 'tip',
    content: 'A smartphone eliminates the need for separate camera, music player, GPS, and calculator. A dining table can serve as a workspace. Look for versatile items that reduce the total number of possessions.',
    readTime: '3 min',
    illustration: 'multi-tool'
  },
  {
    id: 'r13',
    title: 'The Minimalist Wardrobe Formula',
    description: 'Build a wardrobe around a cohesive color palette and versatile pieces.',
    category: 'Wardrobe',
    type: 'article',
    content: 'Choose 2-3 neutral colors as your base, add 1-2 accent colors. Ensure every piece can mix and match with others. Focus on quality basics: well-fitting jeans, classic shirts, versatile shoes, and a good jacket.',
    readTime: '6 min',
    illustration: 'wardrobe'
  },
  {
    id: 'r14',
    title: 'Gratitude for What You Have',
    description: 'Regular gratitude practice reduces the desire for more possessions.',
    category: 'Mindset',
    type: 'principle',
    content: 'Spend time appreciating what you already own. This shifts focus from what\'s missing to what\'s present, reducing the urge to acquire more. Try a weekly gratitude practice for your possessions.',
    readTime: '4 min',
    illustration: 'gratitude'
  },
  {
    id: 'r15',
    title: 'The 30-Day Minimalism Game',
    description: 'Remove one item on day 1, two items on day 2, and so on for 30 days.',
    category: 'Decluttering',
    type: 'tip',
    content: 'This gamified approach makes decluttering fun and progressive. By day 30, you\'ll have removed 465 items! Start with easy items and work up to more challenging decisions.',
    readTime: '3 min',
    illustration: 'game'
  },
  {
    id: 'r16',
    title: 'Maintenance Minimalism',
    description: 'Consider the time and energy required to maintain your possessions.',
    category: 'Mindset',
    type: 'principle',
    content: 'Every item you own requires some level of maintenance: cleaning, organizing, repairing, or simply managing. Factor in these hidden costs when deciding what to keep or acquire.',
    readTime: '4 min',
    illustration: 'maintenance'
  },
  {
    id: 'r17',
    title: 'The Minimalist Kitchen Essentials',
    description: 'A well-equipped minimalist kitchen needs surprisingly few tools.',
    category: 'Food',
    type: 'article',
    content: 'Essential tools: chef\'s knife, cutting board, cast iron pan, pot with lid, wooden spoon, can opener, and measuring cups. These basics can handle 90% of cooking tasks. Add specialty items only if you cook specific cuisines regularly.',
    readTime: '5 min',
    illustration: 'kitchen-tools'
  },
  {
    id: 'r18',
    title: 'Digital Decluttering Strategy',
    description: 'Apply minimalism principles to your digital life for better focus.',
    category: 'Technology',
    type: 'article',
    content: 'Organize files with clear folder structures, delete duplicate photos, unsubscribe from unnecessary emails, and curate social media feeds. Digital clutter affects mental clarity just like physical clutter.',
    readTime: '6 min',
    illustration: 'digital-clean'
  },
  {
    id: 'r19',
    title: 'The Power of Empty Space',
    description: 'Empty space in your home creates calm and allows remaining items to shine.',
    category: 'Home',
    type: 'principle',
    content: 'Don\'t feel compelled to fill every surface or wall. Empty space (negative space) is a design element that creates visual rest, makes spaces feel larger, and highlights the items you do display.',
    readTime: '4 min',
    illustration: 'space'
  },
  {
    id: 'r20',
    title: 'Minimalist Gift Ideas',
    description: 'Give experiences, consumables, or high-quality items that replace multiple lesser ones.',
    category: 'Relationships',
    type: 'tip',
    content: 'Great minimalist gifts: concert tickets, cooking classes, high-quality tools that replace cheaper ones, consumables like nice coffee or tea, or services like house cleaning. Focus on adding value, not volume.',
    readTime: '4 min',
    illustration: 'gift'
  },

  // NEW ARTICLES - 30 additional articles covering all task categories
  {
    id: 'r21',
    title: 'The Capsule Wardrobe Revolution',
    description: 'Transform your relationship with clothing through intentional curation.',
    category: 'Wardrobe',
    type: 'article',
    content: 'A capsule wardrobe isn\'t about restriction—it\'s about freedom. By choosing 30-40 versatile pieces that all work together, you eliminate decision fatigue while ensuring you always look put-together. Start by identifying your lifestyle needs and color preferences.',
    readTime: '7 min',
    illustration: 'wardrobe'
  },
  {
    id: 'r22',
    title: 'Kitchen Tool Hierarchy',
    description: 'Understand which kitchen tools are truly essential versus nice-to-have.',
    category: 'Food',
    type: 'principle',
    content: 'Tier 1: Chef\'s knife, cutting board, one good pan. Tier 2: Pot with lid, wooden spoon, measuring cups. Tier 3: Specialty items for your specific cooking style. Most home cooks can create amazing meals with just Tier 1 and 2 tools.',
    readTime: '5 min',
    illustration: 'kitchen'
  },
  {
    id: 'r23',
    title: 'Digital Boundaries for Mental Health',
    description: 'Create healthy limits with technology to reclaim your attention.',
    category: 'Technology',
    type: 'article',
    content: 'Set specific times for checking emails and social media. Use app timers to limit recreational screen time. Create phone-free zones in your bedroom and dining area. The goal isn\'t to eliminate technology, but to use it intentionally.',
    readTime: '6 min',
    illustration: 'digital-detox'
  },
  {
    id: 'r24',
    title: 'The Minimalist Home Office',
    description: 'Design a workspace that promotes focus and creativity.',
    category: 'Work',
    type: 'tip',
    content: 'Keep only essential items on your desk: computer, notebook, pen, and perhaps one personal item. Use cable management to reduce visual clutter. Ensure good lighting and ergonomics. A clean workspace leads to a clear mind.',
    readTime: '4 min',
    illustration: 'workspace'
  },
  {
    id: 'r25',
    title: 'Simplifying Your Financial Life',
    description: 'Reduce complexity in banking, investing, and budgeting.',
    category: 'Finance',
    type: 'article',
    content: 'Consolidate bank accounts to 2-3 maximum. Automate savings and bill payments. Use simple investment strategies like index funds. Track spending in broad categories rather than micro-managing every expense. Simplicity reduces stress and improves financial health.',
    readTime: '8 min',
    illustration: 'budget'
  },
  {
    id: 'r26',
    title: 'Relationship Quality Over Quantity',
    description: 'Focus energy on meaningful connections rather than maintaining many superficial ones.',
    category: 'Relationships',
    type: 'principle',
    content: 'Invest deeply in 5-10 close relationships rather than trying to maintain hundreds of acquaintances. Quality relationships provide more support, joy, and fulfillment than a large network of casual connections.',
    readTime: '5 min',
    illustration: 'relationships'
  },
  {
    id: 'r27',
    title: 'Morning Routine Essentials',
    description: 'Create a simple, energizing start to your day.',
    category: 'Habits',
    type: 'tip',
    content: 'Focus on 3-5 key activities that set a positive tone: hydration, movement, planning your day, and one thing that brings you joy. Avoid checking phones or emails immediately upon waking. Consistency matters more than complexity.',
    readTime: '4 min',
    illustration: 'morning'
  },
  {
    id: 'r28',
    title: 'Minimalist Health Approach',
    description: 'Simplify your wellness routine for sustainable results.',
    category: 'Health',
    type: 'article',
    content: 'Focus on fundamentals: adequate sleep, regular movement, whole foods, and stress management. Avoid complex supplement regimens or extreme diets. Small, consistent actions compound over time to create lasting health improvements.',
    readTime: '6 min',
    illustration: 'health'
  },
  {
    id: 'r29',
    title: 'The Art of Saying No',
    description: 'Protect your time and energy by declining non-essential commitments.',
    category: 'Lifestyle',
    type: 'principle',
    content: 'Every yes to one thing is a no to something else. Before committing, ask: Does this align with my values and goals? Will this energize or drain me? Practice saying no gracefully: "Thank you for thinking of me, but I can\'t commit to this right now."',
    readTime: '5 min',
    illustration: 'boundaries'
  },
  {
    id: 'r30',
    title: 'Organized Living Spaces',
    description: 'Create systems that maintain order with minimal effort.',
    category: 'Organization',
    type: 'tip',
    content: 'Everything should have a designated home. Use the "one-minute rule"—if it takes less than a minute to put something away, do it immediately. Label storage containers clearly. Regular 10-minute tidying sessions prevent clutter accumulation.',
    readTime: '4 min',
    illustration: 'organization'
  },
  {
    id: 'r31',
    title: 'Minimalist Travel Philosophy',
    description: 'Pack light and travel with intention for richer experiences.',
    category: 'Travel',
    type: 'article',
    content: 'Choose versatile clothing that mixes and matches. Limit yourself to one carry-on bag. Focus on experiences over souvenirs. Research destinations thoroughly to make the most of your time. Less stuff means more freedom to explore.',
    readTime: '7 min',
    illustration: 'travel'
  },
  {
    id: 'r32',
    title: 'Creative Space Optimization',
    description: 'Design an inspiring workspace that sparks creativity.',
    category: 'Creativity',
    type: 'tip',
    content: 'Keep only current project materials visible. Store supplies in labeled, accessible containers. Ensure excellent lighting—natural light is best. Include one inspiring element like a plant or artwork. A organized creative space enhances flow and inspiration.',
    readTime: '4 min',
    illustration: 'creative-space'
  },
  {
    id: 'r33',
    title: 'Sustainable Living Simplified',
    description: 'Make eco-friendly choices without overwhelming complexity.',
    category: 'Environment',
    type: 'article',
    content: 'Start with high-impact changes: reduce single-use plastics, buy less overall, choose quality items that last, and support local businesses. Perfect isn\'t the goal—consistent, mindful choices create meaningful environmental impact.',
    readTime: '6 min',
    illustration: 'environment'
  },
  {
    id: 'r34',
    title: 'The Power of Single-Tasking',
    description: 'Improve productivity and reduce stress by focusing on one thing at a time.',
    category: 'Work',
    type: 'principle',
    content: 'Multitasking is a myth—our brains actually switch between tasks, losing efficiency each time. Focus on one task completely before moving to the next. Use time-blocking to dedicate specific periods to specific activities.',
    readTime: '5 min',
    illustration: 'focus'
  },
  {
    id: 'r35',
    title: 'Meal Planning Made Simple',
    description: 'Reduce food waste and decision fatigue with strategic meal planning.',
    category: 'Food',
    type: 'tip',
    content: 'Plan 5-7 meals per week, leaving room for flexibility. Choose recipes with overlapping ingredients. Prep ingredients in batches. Keep a running grocery list. Simple planning saves time, money, and reduces daily stress.',
    readTime: '5 min',
    illustration: 'meal-planning'
  },
  {
    id: 'r36',
    title: 'Digital Photo Organization',
    description: 'Tame your photo library with simple, sustainable systems.',
    category: 'Technology',
    type: 'article',
    content: 'Delete photos immediately after taking them if they\'re not good. Create simple folder structures by year and event. Use cloud storage for automatic backup. Regularly review and delete duplicates. A organized photo library preserves memories without digital overwhelm.',
    readTime: '6 min',
    illustration: 'photos'
  },
  {
    id: 'r37',
    title: 'Mindful Wardrobe Maintenance',
    description: 'Keep your clothes in excellent condition with minimal effort.',
    category: 'Wardrobe',
    type: 'tip',
    content: 'Invest in quality hangers and proper storage. Address stains immediately. Learn basic repairs like sewing buttons. Air-dry when possible to extend fabric life. Taking care of fewer, better pieces is easier than managing a large, low-quality wardrobe.',
    readTime: '4 min',
    illustration: 'clothing-care'
  },
  {
    id: 'r38',
    title: 'The Minimalist Budget',
    description: 'Simplify your financial tracking for better money management.',
    category: 'Finance',
    type: 'principle',
    content: 'Track spending in 4-5 broad categories: housing, food, transportation, savings, and discretionary. Automate as much as possible. Review monthly rather than daily. Focus on trends rather than perfect accuracy. Simple systems are sustainable systems.',
    readTime: '5 min',
    illustration: 'simple-budget'
  },
  {
    id: 'r39',
    title: 'Home Maintenance Essentials',
    description: 'Keep your living space in good condition with minimal tools and effort.',
    category: 'Home',
    type: 'tip',
    content: 'Maintain a basic toolkit: screwdriver set, hammer, level, measuring tape, and flashlight. Address small issues immediately before they become big problems. Create a seasonal maintenance checklist. Prevention is easier than repair.',
    readTime: '4 min',
    illustration: 'home-maintenance'
  },
  {
    id: 'r40',
    title: 'Stress-Free Social Commitments',
    description: 'Navigate social obligations while protecting your energy and time.',
    category: 'Relationships',
    type: 'article',
    content: 'Be selective about events you attend. Suggest alternative ways to connect that align with your values. It\'s okay to leave early or decline invitations. Quality time with people you care about is more valuable than obligatory social appearances.',
    readTime: '5 min',
    illustration: 'social-balance'
  },
  {
    id: 'r41',
    title: 'Evening Wind-Down Rituals',
    description: 'Create a calming end to your day that promotes better sleep.',
    category: 'Habits',
    type: 'tip',
    content: 'Establish a consistent bedtime routine: dim lights, put away devices, prepare for tomorrow, and do something relaxing. Keep it simple—3-4 activities maximum. Consistency signals to your body that it\'s time to rest.',
    readTime: '4 min',
    illustration: 'evening-routine'
  },
  {
    id: 'r42',
    title: 'Simplified Exercise Routine',
    description: 'Stay fit with minimal equipment and time investment.',
    category: 'Health',
    type: 'article',
    content: 'Focus on compound movements that work multiple muscle groups. Bodyweight exercises require no equipment. Aim for consistency over intensity—20 minutes daily beats 2-hour sessions twice a week. Find activities you genuinely enjoy.',
    readTime: '6 min',
    illustration: 'simple-fitness'
  },
  {
    id: 'r43',
    title: 'Intentional Entertainment Choices',
    description: 'Curate your media consumption for more meaningful leisure time.',
    category: 'Lifestyle',
    type: 'principle',
    content: 'Choose books, shows, and podcasts that align with your interests and values. Avoid mindless scrolling or binge-watching. Set specific times for entertainment rather than using it to fill every spare moment. Quality content enriches your life.',
    readTime: '5 min',
    illustration: 'mindful-media'
  },
  {
    id: 'r44',
    title: 'Efficient Cleaning Systems',
    description: 'Maintain a clean home with minimal products and maximum effectiveness.',
    category: 'Organization',
    type: 'tip',
    content: 'Use multi-purpose cleaners to reduce product clutter. Clean as you go rather than letting messes accumulate. Focus on high-impact areas: kitchen counters, bathroom, and entryway. A few quality cleaning tools work better than many specialized ones.',
    readTime: '4 min',
    illustration: 'cleaning-simple'
  },
  {
    id: 'r45',
    title: 'Minimalist Travel Packing',
    description: 'Master the art of packing light for any trip length.',
    category: 'Travel',
    type: 'article',
    content: 'Choose a color scheme for your travel wardrobe so everything coordinates. Pack versatile pieces that can be dressed up or down. Limit shoes to two pairs maximum. Use packing cubes for organization. Remember: you can buy forgotten items at your destination.',
    readTime: '7 min',
    illustration: 'travel-packing'
  },
  {
    id: 'r46',
    title: 'Creative Project Focus',
    description: 'Improve your creative output by limiting work-in-progress projects.',
    category: 'Creativity',
    type: 'principle',
    content: 'Limit yourself to 1-2 active creative projects at a time. Finish before starting something new. Keep an idea journal for future projects. Deep focus on fewer projects produces better results than scattered attention across many.',
    readTime: '4 min',
    illustration: 'creative-focus'
  },
  {
    id: 'r47',
    title: 'Eco-Friendly Minimalism',
    description: 'Align your minimalist practice with environmental consciousness.',
    category: 'Environment',
    type: 'article',
    content: 'Buy less, choose better, make it last. Repair instead of replacing when possible. Choose secondhand first. Support companies with sustainable practices. Minimalism and environmentalism naturally complement each other—both focus on intentional consumption.',
    readTime: '6 min',
    illustration: 'eco-minimalism'
  },
  {
    id: 'r48',
    title: 'Productivity Without Overwhelm',
    description: 'Get more done by doing less, but doing it better.',
    category: 'Work',
    type: 'principle',
    content: 'Identify your 3 most important tasks each day and focus on those first. Use the 80/20 rule—20% of your efforts produce 80% of your results. Say no to low-value activities. Productivity isn\'t about being busy; it\'s about being effective.',
    readTime: '5 min',
    illustration: 'productive-focus'
  },
  {
    id: 'r49',
    title: 'Seasonal Eating Simplified',
    description: 'Enjoy fresh, local foods while simplifying meal planning.',
    category: 'Food',
    type: 'tip',
    content: 'Build meals around what\'s in season in your area. Seasonal produce is fresher, cheaper, and more nutritious. Learn 2-3 simple preparation methods for each seasonal vegetable. Eating seasonally connects you to natural rhythms and reduces decision fatigue.',
    readTime: '5 min',
    illustration: 'seasonal-eating'
  },
  {
    id: 'r50',
    title: 'Digital Minimalism for Families',
    description: 'Create healthy technology habits for the whole household.',
    category: 'Technology',
    type: 'article',
    content: 'Establish device-free meal times and bedrooms. Create a family charging station outside bedrooms. Model healthy tech use for children. Choose quality educational content over quantity. Technology should enhance family life, not dominate it.',
    readTime: '6 min',
    illustration: 'family-digital'
  }
];