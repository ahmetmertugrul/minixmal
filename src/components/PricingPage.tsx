import React from 'react';
import { Check, Star, Crown, Zap, X } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../types/subscription';
import { useSubscription } from '../hooks/useSubscription';

const PricingPage: React.FC = () => {
  const { currentPlan, isPro } = useSubscription();

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    alert(`Upgrade to ${planId} - Payment integration would go here`);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Star className="w-8 h-8 text-green-500" />;
      case 'pro_monthly': return <Crown className="w-8 h-8 text-purple-500" />;
      case 'pro_yearly': return <Zap className="w-8 h-8 text-yellow-500" />;
      default: return <Star className="w-8 h-8 text-gray-500" />;
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free': return 'from-green-500 to-emerald-600';
      case 'pro_monthly': return 'from-purple-500 to-indigo-600';
      case 'pro_yearly': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan.id === planId;
  };

  const getYearlySavings = () => {
    const monthlyPrice = SUBSCRIPTION_PLANS.find(p => p.id === 'pro_monthly')?.price || 0;
    const yearlyPrice = SUBSCRIPTION_PLANS.find(p => p.id === 'pro_yearly')?.price || 0;
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    return Math.round(savings);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Start your minimalism journey for free, or unlock the full experience with Pro
        </p>
      </div>

      {/* Current Plan Banner */}
      {isPro() && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">You're on the {currentPlan.name} Plan</h3>
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-purple-100">
            Enjoy unlimited access to all features and content!
          </p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
              isCurrentPlan(plan.id) 
                ? 'border-indigo-500 ring-4 ring-indigo-500/20' 
                : 'border-white/20 hover:border-indigo-300'
            } ${
              plan.id === 'pro_yearly' ? 'md:scale-105' : ''
            }`}
          >
            {/* Popular Badge */}
            {plan.id === 'pro_yearly' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              </div>
            )}

            {/* Current Plan Badge */}
            {isCurrentPlan(plan.id) && (
              <div className="absolute -top-4 right-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Current Plan
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.id)}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">
                  /{plan.interval}
                </span>
              </div>
              {plan.id === 'pro_yearly' && (
                <div className="mt-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Save ${getYearlySavings()}/year
                  </span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Limitations for Free Plan */}
            {plan.id === 'free' && (
              <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 text-sm">Limitations:</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <X className="w-3 h-3 text-red-500" />
                    <span>No AI Room Designer</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <X className="w-3 h-3 text-red-500" />
                    <span>Limited to 10 tasks</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <X className="w-3 h-3 text-red-500" />
                    <span>Limited to 5 articles</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={isCurrentPlan(plan.id)}
              className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all ${
                isCurrentPlan(plan.id)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : plan.id === 'free'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  : `bg-gradient-to-r ${getPlanGradient(plan.id)} text-white hover:shadow-xl transform hover:scale-105`
              }`}
            >
              {isCurrentPlan(plan.id) 
                ? 'Current Plan' 
                : plan.id === 'free' 
                ? 'Get Started Free' 
                : 'Upgrade Now'
              }
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
            <p className="text-gray-600 text-sm">
              Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What's included in the free plan?</h4>
            <p className="text-gray-600 text-sm">
              The free plan includes 10 minimalism tasks, 5 learning articles, and basic progress tracking to get you started.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">How does the AI Room Designer work?</h4>
            <p className="text-gray-600 text-sm">
              Upload a photo of your room and our AI will analyze it and provide a minimalist transformation with actionable steps.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h4>
            <p className="text-gray-600 text-sm">
              Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="text-white/80 mb-4">
          Have questions about our plans?
        </p>
        <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default PricingPage;