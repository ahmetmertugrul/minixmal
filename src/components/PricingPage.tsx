import React, { useState } from 'react';
import { Check, Star, Crown, Zap, X } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

const PricingPage: React.FC = () => {
  const { currentPlan, isPro } = useSubscription();
  const [isYearly, setIsYearly] = useState(false);

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with Stripe or another payment processor
    alert(`Upgrade to ${planId} - Payment integration would go here`);
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlan.id === planId;
  };

  // Calculate savings for yearly plan
  const monthlyCost = 4.99 * 12; // $59.88
  const yearlyCost = 49.99;
  const savings = Math.round(monthlyCost - yearlyCost); // $10 savings

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        { name: 'Tasks', value: '10 starter tasks', included: true },
        { name: 'Learn Section', value: '5 articles', included: true },
        { name: 'AI Room Designer', value: '', included: false },
        { name: 'Advanced Progress Tracking', value: '', included: false },
        { name: 'Special Badges & Achievements', value: 'Starter badges only', included: 'partial' },
        { name: 'Experience', value: 'May contain ads', included: 'partial' }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isYearly ? 49.99 : 4.99,
      interval: isYearly ? 'year' : 'month',
      features: [
        { name: 'Tasks', value: 'All Tasks (70)', included: true },
        { name: 'Learn Section', value: 'All Articles (50)', included: true },
        { name: 'AI Room Designer', value: '300 DESIGN CREDITS / MONTH', included: true },
        { name: 'Advanced Progress Tracking', value: 'Advanced stats & progress by category', included: true },
        { name: 'Special Badges & Achievements', value: 'All task & achievement badges', included: true },
        { name: 'Experience', value: '100% Ad-Free', included: true }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Planınızı Seçin</h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Minimalizm yolculuğunuza ücretsiz başlayın veya Pro ile tam deneyimin kilidini açın
        </p>
      </div>

      {/* Monthly/Yearly Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex items-center">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              !isYearly
                ? 'bg-white text-indigo-600 shadow-lg'
                : 'text-white hover:text-white/80'
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
              isYearly
                ? 'bg-white text-indigo-600 shadow-lg'
                : 'text-white hover:text-white/80'
            }`}
          >
            Yıllık
            {isYearly && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                ${savings} tasarruf
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Current Plan Banner */}
      {isPro() && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Şu anda {currentPlan.name} Planındasınız</h3>
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-purple-100">
            Tüm özelliklere ve içeriğe sınırsız erişimin keyfini çıkarın!
          </p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
              isCurrentPlan(plan.id) 
                ? 'border-indigo-500 ring-4 ring-indigo-500/20' 
                : 'border-white/20 hover:border-indigo-300'
            } ${
              plan.id === 'pro' ? 'md:scale-105 relative' : ''
            }`}
          >
            {/* Popular Badge */}
            {plan.id === 'pro' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  En Popüler
                </div>
              </div>
            )}

            {/* Current Plan Badge */}
            {isCurrentPlan(plan.id) && (
              <div className="absolute -top-4 right-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Mevcut Plan
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {plan.id === 'free' ? (
                  <Star className="w-8 h-8 text-green-500" />
                ) : (
                  <Crown className="w-8 h-8 text-purple-500" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">
                  /{plan.interval === 'year' ? 'yıl' : 'ay'}
                </span>
              </div>
              {plan.id === 'pro' && isYearly && (
                <div className="mt-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Yılda ${savings} tasarruf edin
                  </span>
                </div>
              )}
            </div>

            {/* Features Table */}
            <div className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm mb-1">
                      {feature.name}
                    </div>
                    {feature.value && (
                      <div className="text-gray-600 text-xs">
                        {feature.value}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {feature.included === true ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : feature.included === false ? (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={isCurrentPlan(plan.id)}
              className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all ${
                isCurrentPlan(plan.id)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : plan.id === 'free'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isCurrentPlan(plan.id) 
                ? 'Mevcut Plan' 
                : plan.id === 'free' 
                ? 'Ücretsiz Başla' 
                : 'Şimdi Yükselt'
              }
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sıkça Sorulan Sorular</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">İstediğim zaman iptal edebilir miyim?</h4>
            <p className="text-gray-600 text-sm">
              Evet! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. Fatura döneminin sonuna kadar erişiminiz devam eder.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Ücretsiz planda neler var?</h4>
            <p className="text-gray-600 text-sm">
              Ücretsiz plan 10 minimalizm görevi, 5 öğrenme makalesi ve temel ilerleme takibi içerir.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">AI Oda Tasarımcısı nasıl çalışır?</h4>
            <p className="text-gray-600 text-sm">
              Odanızın fotoğrafını yükleyin, AI'mız analiz edip minimalist dönüşüm ve uygulanabilir adımlar sağlar.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Para iade garantisi var mı?</h4>
            <p className="text-gray-600 text-sm">
              Evet! 30 günlük para iade garantisi sunuyoruz. Memnun kalmazsanız, ödemenizi tam olarak iade ederiz.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="text-white/80 mb-4">
          Planlarımız hakkında sorularınız mı var?
        </p>
        <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-colors">
          Destek ile İletişime Geç
        </button>
      </div>
    </div>
  );
};

export default PricingPage;