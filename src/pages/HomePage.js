// src/pages/HomePage.js

import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import InteractiveDemoSection from '../components/InteractiveDemoSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';

const HomePage = ({ handleOpenAuthModal }) => {
  return (
    <div className="bg-[#111827] text-white">
      <Navbar handleOpenAuthModal={handleOpenAuthModal} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InteractiveDemoSection />
        <PricingSection handleChoosePlan={handleOpenAuthModal}/>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;