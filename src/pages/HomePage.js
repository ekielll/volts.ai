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
    <>
      <Navbar handleOpenAuthModal={handleOpenAuthModal} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        {/* UPDATED: Pass the handleOpenAuthModal function as a prop */}
        <InteractiveDemoSection handleOpenAuthModal={handleOpenAuthModal} />
        <PricingSection handleChoosePlan={handleOpenAuthModal}/>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
