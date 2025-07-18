// src/components/HeroSection.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import AnimatedTagline from './AnimatedTagline';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative text-center py-20 md:py-40 px-6 overflow-hidden bg-[#111827]">
      <div className="absolute inset-0 bg-grid-pattern"></div>
      <div className="absolute inset-0 bg-gradient-overlay"></div>
      <div className="relative z-10 container mx-auto">
        <AnimatedTagline />
        <div className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-8 mb-10 font-premium tracking-wider">
            <span className="shimmer-text font-bold">Describe</span>
            <span className="text-gray-500 mx-2">·</span>
            <span className="shimmer-text font-bold">Upload</span>
            <span className="text-gray-500 mx-2">·</span>
            <span className="shimmer-text font-bold">Deliver</span>
        </div>
        <button
          onClick={() => navigate('/ai-interface')}
          className="premium-button text-white font-bold py-3 px-10 rounded-lg text-lg font-premium"
        >
          Start Creating for Free
        </button>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-gray-400 text-sm">
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400/80" /> No Card Required</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400/80" /> 7-day Premium Trial</span>
            <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400/80" /> Starts in seconds</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;