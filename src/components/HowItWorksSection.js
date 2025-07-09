// src/components/HowItWorksSection.js

import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Describe",
      description: "Converse with Zoltrak in natural language. Tell it your goal, your audience, and your aesthetic. Upload sketches or reference images to give your vision clarity."
    },
    {
      number: "2",
      title: "Upload",
      description: "Instantly see your creation in the live preview. Refine every detail with simple follow-up commands like 'Make the header smaller,' or 'Add a testimonial section here.'"
    },
    {
      number: "3",
      title: "Deliver",
      description: "Once your vision is perfected, connect your custom domain and publish your world-class website. No complex configurations, just a seamless launch."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-[#111827]">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-elegant">Your Vision, Realized in Moments</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-20 text-lg">
          Go from a spark of an idea to a live website in three simple, intuitive steps.
        </p>
        <div className="relative">
          {/* This is the decorative connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
            <div className="w-full h-full border-t-2 border-dashed border-gray-700"></div>
          </div>

          <div className="relative grid md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="relative inline-block">
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg font-premium">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-premium">{step.title}</h3>
                <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;