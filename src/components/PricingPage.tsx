import React from 'react';
import { Check, Star, Sparkles, Zap, Crown, Users } from 'lucide-react';

const PricingPage: React.FC = () => {
  const features = {
    free: [
      'Access to basic minimalism tasks',
      'Daily recommendations',
      'Progress tracking',
      'Basic decluttering guides',
      'Community support',
      'Mobile app access'
    ],
    pro: [
      'Everything in Free',
      'AI Room Designer with unlimited transformations',
      'Personalized coaching sessions',
      'Advanced analytics and insights',
      'Priority customer support',
      'Exclusive minimalist challenges',
      'Custom habit tracking',
      'Export progress reports',
      'Early access to new features',
      'Ad-free experience'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Choose Your Minimalism Journey
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-3xl mx-auto">
            Start with our free plan or unlock the full potential of minimalist living with Minixmal Pro
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 relative">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Free</h2>
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                $0
                <span className="text-lg text-gray-600 font-normal">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <div className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pro</h2>
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                $19
                <span className="text-lg text-gray-600 font-normal">/month</span>
              </div>
              <p className="text-gray-600">Complete minimalist transformation</p>
            </div>

            <div className="space-y-4 mb-8">
              {features.pro.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              Upgrade to Pro
            </button>
          </div>
        </div>

        {/* Additional Benefits Section */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
              Why Choose Minixmal Pro?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h4>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized recommendations powered by advanced AI that learns your preferences and lifestyle.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Room Transformations</h4>
                <p className="text-gray-600 leading-relaxed">
                  Visualize your space as a minimalist sanctuary with unlimited AI-generated room transformations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Expert Support</h4>
                <p className="text-gray-600 leading-relaxed">
                  Access to minimalism experts and priority support to guide you through your transformation journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-8 max-w-3xl mx-auto">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my Pro subscription anytime?
                </h4>
                <p className="text-gray-600">
                  Yes, you can cancel your Pro subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  What happens to my data if I downgrade?
                </h4>
                <p className="text-gray-600">
                  Your progress and basic data remain intact. You'll lose access to Pro-only features like AI Room Designer and advanced analytics, but your core minimalism journey continues.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a free trial for Pro?
                </h4>
                <p className="text-gray-600">
                  We offer a 7-day free trial for new Pro subscribers. Experience all Pro features risk-free before committing to a subscription.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  How does the AI Room Designer work?
                </h4>
                <p className="text-gray-600">
                  Upload a photo of your room, and our AI analyzes the space to create a minimalist transformation while preserving your room's character and layout. You'll also receive a personalized action plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;