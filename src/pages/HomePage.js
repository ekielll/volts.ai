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
  console.log("CHECKPOINT 9: HomePage.js - HomePage component is rendering.");
  return (
    <>
      <Navbar handleOpenAuthModal={handleOpenAuthModal} />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InteractiveDemoSection />
      <PricingSection handleChoosePlan={handleOpenAuthModal}/>
      <Footer />
    </>
  );
};

export default HomePage;