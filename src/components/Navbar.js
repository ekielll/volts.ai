// src/components/Navbar.js

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = ({ handleOpenAuthModal }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    navigate('/');
    
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    // UPDATED: Reduced vertical padding for a slimmer look.
    <header className="sticky top-0 z-50 py-4 px-6 bg-[#111827] border-b border-white/10">
      <div className="container mx-auto grid grid-cols-3 items-center">
        
        {/* Left-aligned navigation links */}
        {/* UPDATED: Added margin to bring links closer to the center */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-300 font-premium justify-self-start ml-8">
          <a href="/#features" onClick={(e) => handleNavClick(e, 'features')} className="tracking-wider hover:text-white transition-colors duration-300">Features</a>
          <a href="/#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="tracking-wider hover:text-white transition-colors duration-300">How It Works</a>
          <a href="/#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="tracking-wider hover:text-white transition-colors duration-300">Pricing</a>
        </nav>

        {/* Centered Logo */}
        <div className="justify-self-center">
          {/* UPDATED: Increased logo size for more prominence */}
          <img 
            src="/logo.png" 
            alt="Volts Logo"
            className="h-14 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Right-aligned authentication buttons */}
        {/* UPDATED: Added margin to bring buttons closer to the center */}
        <div className="hidden md:flex items-center space-x-4 justify-self-end mr-8">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium py-2 px-5 rounded-lg border border-transparent hover:bg-white/10 transition-all font-premium">Dashboard</Link>
              <button onClick={signOut} className="premium-orange-button text-white font-bold py-2 px-5 rounded-lg font-premium text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleOpenAuthModal('login')} className="text-gray-300 font-medium py-2 px-5 rounded-lg border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all font-premium">Login</button>
              <button onClick={() => handleOpenAuthModal('signup')} className="premium-button text-white font-bold py-2 px-5 rounded-lg font-premium">
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden justify-self-end text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;