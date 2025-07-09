// src/components/GlobalStyles.js

import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Playfair+Display:wght@700&family=Sora:wght@400;600;700&display=swap');
    
    html { scroll-behavior: smooth; }
    
    body, #root {
      font-family: 'Inter', sans-serif;
      background-color: #111827;
      color: #fff;
    }
    
    .font-elegant { font-family: 'Playfair Display', serif; }
    .font-premium { font-family: 'Sora', sans-serif; }
    
    .premium-button {
      background-image: linear-gradient(to right, #8e2de2, #4a00e0);
      box-shadow: 0 4px 15px 0 rgba(142, 45, 226, 0.45);
      transition: all 0.3s ease-in-out;
    }
    .premium-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 10px 20px 0 rgba(142, 45, 226, 0.6);
    }
    
    .premium-orange-button {
      background: linear-gradient(to right, #ff8c00, #f76b1c);
      box-shadow: 0 4px 15px 0 rgba(255, 140, 0, 0.4);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }
    .premium-orange-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 10px 20px 0 rgba(255, 140, 0, 0.5);
    }
    .premium-orange-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 5s infinite;
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    
    .feature-card {
      background: rgba(31, 41, 55, 0.5);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .feature-card:hover {
      border-color: rgba(142, 45, 226, 0.5);
      transform: translateY(-5px);
    }
    .feature-card::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(173, 112, 255, 0.1), transparent 40%);
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
    .feature-card:hover::after { opacity: 1; }
    
    @keyframes glowing {
      0% { box-shadow: 0 0 5px #8e2de2; }
      50% { box-shadow: 0 0 20px #4a00e0; }
      100% { box-shadow: 0 0 5px #8e2de2; }
    }
    .pricing-card-popular {
      border: 2px solid #8e2de2;
      animation: glowing 3s infinite ease-in-out;
    }
    
    .typing-indicator span {
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .typing-indicator span:nth-of-type(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-of-type(3) { animation-delay: 0.4s; }
    
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    
    .shimmer-text {
      background: linear-gradient(90deg, #9333ea, #d8b4fe, #9333ea);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: text-shimmer 3s linear infinite;
    }
    
    @keyframes text-shimmer { to { background-position: -200% center; } }
    
    .bg-grid-pattern {
      background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 30px 30px;
    }
    
    .bg-gradient-overlay {
      background: radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.25), transparent 40%);
    }
  `}</style>
);

export default GlobalStyles;