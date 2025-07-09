import React from 'react';
import AiInterface from './AiInterface';

const InteractiveDemoSection = () => {
  return (
    <section id="interactive-demo" className="py-20 bg-[#1F2937] px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-elegant">Experience It Live</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-12">
          Get a feel for our AI. Type a prompt below to see how it responds, or click "Try It Now" for the full-screen experience.
        </p>
        <div className="max-w-5xl mx-auto">
          <AiInterface isDemo={true} />
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-600 font-premium">
            <img src="/logo.png" alt="Volts Logo" className="h-4 w-auto opacity-50" />
            <span>Powered by volts.ai</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;