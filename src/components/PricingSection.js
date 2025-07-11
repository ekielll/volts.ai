// src/components/PricingSection.js

import React, { useState } from 'react';
import { CheckCircle, Plus } from 'lucide-react';

const PricingSection = ({ handleChoosePlan }) => {
  const [billingCycle, setBillingCycle] = useState('annual');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedGridTier, setSelectedGridTier] = useState('base');

  const plans = {
    monthly: [
      { name: 'Spark', price: '$0', tagline: 'For trying out ideas', features: ['100 AI Interactions /mo', '2 Saved Projects', 'Website Generation', 'volts.ai Subdomain'], popular: false },
      { name: 'Volt', price: '$15', priceSuffix: '/mo', tagline: 'For personal & simple sites', features: ['750 AI Interactions /mo', '10 Saved Projects', 'Connect Custom Domain', 'Basic Chatbot Generation'], popular: false },
      { name: 'Surge', price: '$39', priceSuffix: '/mo', tagline: 'For freelancers & businesses', features: ['2,000 AI Interactions /mo', '50 Saved Projects', 'Pro Code Export (.zip)', 'Custom AI Knowledge Base'], popular: true },
    ],
    annual: [
      { name: 'Spark', price: '$0', tagline: 'For trying out ideas', features: ['100 AI Interactions /mo', '2 Saved Projects', 'Website Generation', 'volts.ai Subdomain'], popular: false },
      { name: 'Volt', price: '$12', originalPrice: '$15', priceSuffix: '/mo', tagline: 'For personal & simple sites', features: ['750 AI Interactions /mo', '10 Saved Projects', 'Connect Custom Domain', 'Basic Chatbot Generation'], popular: false },
      { name: 'Surge', price: '$32', originalPrice: '$39', priceSuffix: '/mo', tagline: 'For freelancers & businesses', features: ['2,000 AI Interactions /mo', '50 Saved Projects', 'Pro Code Export (.zip)', 'Custom AI Knowledge Base'], popular: true },
    ]
  };

  const gridPlanTiers = {
    base: { monthly: { price: '$99', interactions: '5,000 AI Interactions /mo' }, annual: { price: '$70', originalPrice: '$99', interactions: '5,000 AI Interactions /mo' } },
    plus: { monthly: { price: '$129', interactions: '7,500 AI Interactions /mo' }, annual: { price: '$92', originalPrice: '$129', interactions: '7,500 AI Interactions /mo' } },
    pro: { monthly: { price: '$199', interactions: 'Unlimited Interactions' }, annual: { price: '$141', originalPrice: '$199', interactions: 'Unlimited Interactions' } },
  };
  
  const featureList = [
    { category: 'Core Features', items: [
      { name: 'AI Interactions', values: ['100 /mo', '750 /mo', '2,000 /mo', 'Up to Unlimited'] },
      { name: 'Saved Projects', values: ['2', '10', '50', 'Unlimited'] },
      { name: 'Website Generation', values: ['✓', '✓', '✓', '✓'] },
    ]},
    { category: 'Publishing', items: [
      { name: 'volts.ai Subdomain', values: ['✓', '✓', '✓', '✓'] },
      { name: 'Connect Custom Domain', values: ['', '✓', '✓', '✓'] },
      { name: 'Remove "Powered By" Badge', values: ['', '', '✓', '✓'] },
      { name: 'Pro Code Export (.zip)', values: ['', '', '✓', '✓'] },
    ]},
    { category: 'Premium Features', items: [
      { name: 'Basic Chatbot Generation', values: ['', '✓', '✓', '✓'] },
      { name: 'Advanced Chatbot Features', values: ['', '', '✓', '✓'] },
      { name: 'Custom AI Knowledge Base', values: ['', '', '✓', '✓'] },
    ]},
    { category: 'Support', items: [
      { name: 'Community Support', values: ['✓', '✓', '✓', '✓'] },
      { name: 'Email Support', values: ['', '✓', '✓', '✓'] },
      { name: 'Priority Support', values: ['', '', '✓', '✓'] },
    ]}
  ];
  
  const currentGridPlan = gridPlanTiers[selectedGridTier][billingCycle];

  return (
    <section id="pricing" className="py-20 px-6 bg-[#111827]">
      <style>{`
        .silver-shimmer { background: linear-gradient(90deg, #9E9E9E, #FFFFFF, #9E9E9E); background-size: 200% auto; background-clip: text; -webkit-background-clip: text; color: transparent; animation: text-shimmer 3s linear infinite; }
        .segmented-control-bg { background-color: rgba(255, 255, 255, 0.05); }
        .segmented-control-indicator { box-shadow: 0 2px 10px rgba(142, 45, 226, 0.5); }
      `}</style>
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-elegant">The smartest way to build</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-lg">
          Choose a plan that scales with your ambition. Start for free, no credit card required.
        </p>
        <div className="flex items-center justify-center space-x-4 mb-16 font-premium">
            <span className={`font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <div onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')} className="w-20 h-10 rounded-full p-1 cursor-pointer flex items-center bg-gray-900/50 border border-white/10 relative">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg transform transition-transform duration-300 ease-in-out ${billingCycle === 'annual' ? 'translate-x-10' : ''}`}></div>
            </div>
            <span className={`font-medium transition-colors ${billingCycle === 'annual' ? 'text-white' : 'text-gray-500'}`}>Annual (Save up to 29%)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
          {plans[billingCycle].map((plan) => (
            <div key={plan.name} className={`glass-card h-full p-8 rounded-xl text-left flex flex-col transition-transform duration-300 ${plan.popular ? 'pricing-card-popular scale-100 md:scale-105' : 'scale-100 md:scale-95'}`}>
              {plan.popular && <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-6 font-premium">MOST POPULAR</span>}
              <h3 className="text-2xl font-bold mb-2 font-premium">{plan.name}</h3>
              <p className="text-gray-400 mb-6 h-10">{plan.tagline}</p>
              <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-5xl font-bold font-premium">{plan.price}</p>
                  <p className="text-gray-400 font-premium">{plan.priceSuffix}</p>
                   {billingCycle === 'annual' && plan.originalPrice && (
                      <p className="text-lg font-medium text-gray-500 line-through self-end mb-1.5">{plan.originalPrice}</p>
                    )}
              </div>
              <ul className="space-y-4 text-gray-300 mb-8 flex-grow">
                {plan.features.map((feature, i) => ( <li key={i} className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>{feature}</span></li> ))}
              </ul>
              <button onClick={() => handleChoosePlan('signup', plan.name)} className={`w-full font-bold py-3 px-6 rounded-lg mt-auto font-premium ${plan.popular ? 'premium-orange-button text-white' : 'premium-button text-white'}`}>
                {plan.price === '$0' ? 'Start for Free' : 'Choose Plan'}
              </button>
            </div>
          ))}

          <div className="glass-card h-full p-8 rounded-xl text-left flex flex-col transition-transform duration-300 scale-100 md:scale-95">
              <h3 className="text-2xl font-bold mb-2 font-premium">Grid</h3>
              <p className="text-gray-400 mb-6 h-10">For power users & teams</p>
              <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-5xl font-bold font-premium">{currentGridPlan.price}</p>
                  <p className="text-gray-400 font-premium">/mo</p>
                   {billingCycle === 'annual' && currentGridPlan.originalPrice && (
                      <p className="text-lg font-medium text-gray-500 line-through self-end mb-1.5">{currentGridPlan.originalPrice}</p>
                    )}
              </div>
              <div className="font-premium text-sm mb-6">
                <p className="text-gray-400 mb-2">AI Interaction Limit:</p>
                <div className="relative flex w-full p-1 rounded-full segmented-control-bg">
                  <button onClick={() => setSelectedGridTier('base')} className="flex-1 p-2 rounded-full z-10 transition-colors text-xs">5k</button>
                  <button onClick={() => setSelectedGridTier('plus')} className="flex-1 p-2 rounded-full z-10 transition-colors text-xs">7.5k</button>
                  <button onClick={() => setSelectedGridTier('pro')} className="flex-1 p-2 rounded-full z-10 transition-colors text-xs">Max</button>
                  <div className={`absolute top-1 bottom-1 left-1 w-1/3 h-auto premium-button rounded-full segmented-control-indicator transition-transform duration-300 ease-in-out ${
                    selectedGridTier === 'plus' ? 'translate-x-full' : selectedGridTier === 'pro' ? 'translate-x-[200%]' : ''
                  }`}></div>
                </div>
              </div>
              <ul className="space-y-4 text-gray-300 mb-8 flex-grow">
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>{currentGridPlan.interactions}</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Unlimited Projects</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Pro Code Export (.zip)</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Advanced Chatbot Features</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" /><span>Priority Support</span></li>
              </ul>
              <button onClick={() => handleChoosePlan('signup', 'Grid')} className="w-full font-bold py-3 px-6 rounded-lg mt-auto font-premium premium-button text-white">
                Choose Plan
              </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20">
            <div className="border border-white/10 rounded-lg">
                <button onClick={() => setIsCompareOpen(!isCompareOpen)} className="w-full flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 group transition-colors duration-300">
                    <h3 className="text-2xl font-bold font-premium silver-shimmer">Compare all features</h3>
                    <Plus className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 group-hover:text-white ${isCompareOpen ? 'rotate-45' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCompareOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="p-6 pt-0">
                        <div className="grid grid-cols-5 gap-4 pb-4 border-b border-white/10 sticky top-0 bg-[#111827]">
                            <div className="col-span-1"></div>
                            {plans.monthly.map(plan => ( <h4 key={plan.name} className="text-lg font-bold font-premium text-center">{plan.name}</h4> ))}
                            <h4 className="text-lg font-bold font-premium text-center">Grid</h4>
                        </div>
                        {featureList.map(category => (
                            <div key={category.category}>
                                <h5 className="inline-block text-xl font-bold font-premium pt-8 pb-4 col-span-5 silver-shimmer">{category.category}</h5>
                                {category.items.map(item => (
                                    <div key={item.name} className="grid grid-cols-5 gap-4 py-4 border-b border-white/5 items-center">
                                        <p className="col-span-1 text-left text-gray-300 font-premium">{item.name}</p>
                                        {item.values.map((value, index) => (
                                            <div key={index} className="col-span-1 text-center">
                                                {value === '✓' ? ( <CheckCircle className="w-6 h-6 text-green-400 mx-auto" /> ) : ( <span className="text-gray-200 font-premium">{value || '—'}</span> )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;