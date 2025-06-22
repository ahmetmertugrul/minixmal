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
    category: 'Digital',
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
    category: 'Shopping',
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
    category: 'Productivity',
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
    category: 'Shopping',
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
    category: 'Challenge',
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
    category: 'Kitchen',
    type: 'article',
    content: 'Essential tools: chef\'s knife, cutting board, cast iron pan, pot with lid, wooden spoon, can opener, and measuring cups. These basics can handle 90% of cooking tasks. Add specialty items only if you cook specific cuisines regularly.',
    readTime: '5 min',
    illustration: 'kitchen-tools'
  },
  {
    id: 'r18',
    title: 'Digital Decluttering Strategy',
    description: 'Apply minimalism principles to your digital life for better focus.',
    category: 'Digital',
    type: 'article',
    content: 'Organize files with clear folder structures, delete duplicate photos, unsubscribe from unnecessary emails, and curate social media feeds. Digital clutter affects mental clarity just like physical clutter.',
    readTime: '6 min',
    illustration: 'digital-clean'
  },
  {
    id: 'r19',
    title: 'The Power of Empty Space',
    description: 'Empty space in your home creates calm and allows remaining items to shine.',
    category: 'Design',
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
  }
];