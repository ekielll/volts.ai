// src/components/FeaturesSection.js

import React from 'react';
// NEW ICONS: BrainCircuit for AI, Infinity for no limits, ImageUp for visual input
import { BrainCircuit, Infinity, ImageUp } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BrainCircuit size={32} className="text-purple-400" />,
      title: "Conversational Creation",
      description: "Simply talk to Zoltrak. Describe your vision, ask for changes, and watch as your words are translated into a fully functional, beautiful website in real-time."
    },
    {
      icon: <Infinity size={32} className="text-purple-400" />,
      title: "Beyond Page Limits",
      description: "While most platforms restrict you by page count, we don’t. Volts.ai gives you unlimited freedom, so you can create as much as you need without artificial limits."
    },
    {
      icon: <ImageUp size={32} className="text-purple-400" />,
      title: "From Vision to Code",
      description: "Have a mockup, sketch, or a photo for inspiration? Upload any image and our AI will analyze its layout, colors, and style to kickstart your design."
    }
  ];

  return (
    <section id="features" className="py-20 bg-[#1F2937] px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-elegant">A Radically New Workflow</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-16 text-lg">
          Experience a creation process where your ideas, not tool limitations, define the outcome.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card p-8 rounded-xl flex flex-col items-center text-center">
              <div className="bg-gray-900/50 p-5 rounded-full mb-6 border border-white/10 relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 font-premium relative z-10">{feature.title}</h3>
              <p className="text-gray-400 relative z-10 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;