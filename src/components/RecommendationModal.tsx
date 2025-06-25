import React from 'react';
import { X, Clock, BookOpen, Lightbulb, Quote, Target, Star } from 'lucide-react';
import { Recommendation } from '../data/recommendations';

interface RecommendationModalProps {
  recommendation: Recommendation;
  isOpen: boolean;
  onClose: () => void;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ 
  recommendation, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="w-6 h-6" />;
      case 'tip': return <Lightbulb className="w-6 h-6" />;
      case 'quote': return <Quote className="w-6 h-6" />;
      case 'principle': return <Target className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-500 text-white';
      case 'tip': return 'bg-green-500 text-white';
      case 'quote': return 'bg-purple-500 text-white';
      case 'principle': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getExpandedContent = (recommendation: Recommendation) => {
    // Extended content based on the type and topic
    const expandedContent = {
      'r1': `The 90/90 Rule is one of the most practical decluttering principles you can apply to any area of your life. This rule helps eliminate the emotional attachment we often have to our possessions by focusing purely on utility and frequency of use.

**How to Apply the 90/90 Rule:**

1. **Start with one category** - Begin with clothes, books, or kitchen items
2. **Ask the key questions** - When did I last use this? Will I use it in the next 90 days?
3. **Be honest with yourself** - Don't create hypothetical scenarios where you might need the item
4. **Make quick decisions** - The longer you deliberate, the more likely you are to keep it

**Common Applications:**
- **Clothing**: That dress you haven't worn in months but keep "just in case"
- **Books**: Reference books you can easily find information for online
- **Kitchen gadgets**: Single-use tools that gather dust in drawers
- **Digital files**: Old documents, photos, and downloads cluttering your devices

**The Psychology Behind It:**
The 90/90 rule works because it removes the emotional decision-making process and replaces it with logical criteria. Most items we struggle to declutter fall into this category - things we don't actively use but feel we might need someday.

**Pro Tips:**
- Set a timer for each category to avoid overthinking
- Take photos of sentimental items before donating them
- Start with easier categories to build momentum
- Remember: if it's truly important, you can usually replace it

The beauty of this rule is its simplicity. It cuts through the mental clutter of "what if" scenarios and helps you focus on what you actually use and value in your daily life.`,

      'r2': `Quality over quantity isn't just a minimalist principle - it's a life philosophy that can transform how you approach consumption, relationships, and even time management. This mindset shift from accumulation to curation creates more satisfaction with less.

**The True Cost of Cheap Items:**

When we buy low-quality items, we often end up paying more in the long run through:
- **Frequent replacements** - That $10 shirt that falls apart after 5 washes
- **Maintenance costs** - Cheap appliances that break down regularly
- **Opportunity cost** - Time spent shopping for replacements
- **Environmental impact** - Contributing to waste and overconsumption

**How to Implement Quality Over Quantity:**

**Research Before Buying:**
- Read reviews from multiple sources
- Look for items with warranties or guarantees
- Consider the cost per use over the item's lifetime
- Ask yourself: "Will I still love this in 5 years?"

**Investment Categories:**
- **Clothing**: Well-made basics in quality fabrics
- **Tools**: Professional-grade items for your hobbies or work
- **Furniture**: Solid wood pieces that age beautifully
- **Technology**: Devices that will last and receive updates

**The Mindset Shift:**
Instead of asking "How much does this cost?" ask "What is this worth to me?" This reframes purchasing decisions around value rather than price.

**Building a Quality-Focused Wardrobe:**
- Choose natural fibers like wool, cotton, and linen
- Invest in classic cuts that won't go out of style
- Buy from brands known for durability and ethical practices
- Take care of what you own with proper storage and maintenance

**Quality in Relationships:**
This principle extends beyond material possessions. Cultivating deeper relationships with fewer people often brings more fulfillment than maintaining many superficial connections.

Remember: Quality over quantity isn't about being elitist or expensive - it's about being intentional with your choices and valuing longevity over immediate gratification.`,

      'r3': `The One-Touch Rule is a game-changing principle that eliminates one of the biggest obstacles to successful decluttering: procrastination. By committing to making a decision the first time you handle an item, you prevent the accumulation of "maybe" piles that often end up back where they started.

**Why the One-Touch Rule Works:**

**Eliminates Decision Fatigue:**
Every time you pick up an item and put it in a "decide later" pile, you're creating future work for yourself. The one-touch rule forces immediate decision-making when your energy and focus are highest.

**Prevents Emotional Attachment:**
The longer you hold onto an item while deciding, the more likely you are to create reasons to keep it. Quick decisions bypass the emotional storytelling our minds create around possessions.

**Creates Momentum:**
Making quick, decisive choices builds confidence and momentum. Each decision becomes easier than the last.

**Step-by-Step Implementation:**

**Preparation Phase:**
1. Set up three designated areas: Keep, Donate, Trash
2. Have donation bags and trash bags ready
3. Set a timer for your decluttering session
4. Start with the easiest category first

**The Decision Process:**
When you pick up an item, immediately ask:
- Do I use this regularly?
- Does this add value to my life?
- Would I buy this again today?
- Does this fit my current lifestyle?

**If yes to most questions:** Keep pile
**If no to most questions:** Donate or trash
**If unsure:** Apply the 90/90 rule

**Common Challenges and Solutions:**

**"But it was expensive!"**
Remember: The money is already spent. Keeping something you don't use won't get your money back, but donating it can help someone else.

**"It has sentimental value!"**
Ask: Does this item truly represent the memory, or is the memory separate from the object? Consider taking a photo before letting go.

**"I might need it someday!"**
Be realistic about "someday." If you haven't needed it in the past year, you probably won't need it in the next year.

**Advanced Applications:**
- **Email management**: Delete, respond, or file immediately
- **Paper documents**: Scan, file, or shred on first handling
- **Digital photos**: Keep, delete, or edit during initial review

The one-touch rule transforms decluttering from an overwhelming process into a series of simple, binary decisions. It's not about being perfect - it's about being decisive and moving forward.`,

      'default': `This article provides valuable insights into minimalist living and practical strategies for simplifying your life. The principles discussed here can be applied to various aspects of your daily routine, from organizing your physical space to managing your digital life.

**Key Takeaways:**
- Start small and build momentum with easy wins
- Focus on progress, not perfection
- Remember that minimalism is about making room for what matters most
- Every small step contributes to a more intentional lifestyle

**Practical Applications:**
Consider how you can apply these concepts to your current situation. What area of your life would benefit most from this approach? Start there and gradually expand to other areas.

**Next Steps:**
- Identify one specific area to focus on this week
- Set aside 15-30 minutes to implement these ideas
- Track your progress and celebrate small victories
- Share your experience with others on a similar journey

Remember, minimalism isn't about deprivation - it's about creating space for what truly matters in your life.`
    };

    return expandedContent[recommendation.id as keyof typeof expandedContent] || expandedContent.default;
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
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${getTypeColor(recommendation.type)}`}>
                {getTypeIcon(recommendation.type)}
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {recommendation.type}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {recommendation.category}
                  </span>
                  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{recommendation.readTime}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold leading-tight">
                  {recommendation.title}
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
          {/* Summary */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              {recommendation.description}
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {getExpandedContent(recommendation)}
            </div>
          </div>

          {/* Original Content */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Key Insight</h3>
            <p className="text-gray-800 leading-relaxed">
              {recommendation.content}
            </p>
            {recommendation.author && (
              <p className="text-gray-600 italic font-medium mt-4">
                — {recommendation.author}
              </p>
            )}
          </div>

          {/* Action Items */}
          <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Take Action Today
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <p className="text-green-800">
                  Choose one area of your life to apply this principle
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <p className="text-green-800">
                  Set aside 15-30 minutes this week to implement the strategy
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <p className="text-green-800">
                  Track your progress and celebrate small wins
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Found this helpful? Apply these insights to your minimalism journey.
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;