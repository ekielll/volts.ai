// src/components/Navbar.js

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = ({ handleOpenAuthModal }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    // First, navigate to the home page if we aren't there already.
    navigate('/');
    
    // Then, wait for the next render cycle to find the element and scroll.
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <img 
          src="/logo.png" 
          alt="Volts Logo"
          className="h-10 md:h-12 w-auto cursor-pointer"
          onClick={() => navigate('/')}
        />
        <nav className="hidden md:flex items-center space-x-8 text-gray-300 font-premium">
          <a href="/#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-white transition-colors">Features</a>
          <a href="/#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="hover:text-white transition-colors">How It Works</a>
          <a href="/#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="hover:text-white transition-colors">Pricing</a>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white font-medium py-2 px-5 rounded-lg border-2 border-transparent hover:bg-white/10 transition-all font-premium">Dashboard</Link>
              <button onClick={signOut} className="premium-orange-button text-white font-bold py-2 px-5 rounded-lg font-premium text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleOpenAuthModal('login')} className="text-gray-300 hover:text-white font-medium py-2 px-5 rounded-lg border-2 border-transparent hover:bg-white/10 transition-all font-premium">Login</button>
              <button onClick={() => handleOpenAuthModal('signup')} className="premium-button text-white font-bold py-2 px-5 rounded-lg font-premium">
                Sign Up
              </button>
            </>
          )}
        </div>
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;