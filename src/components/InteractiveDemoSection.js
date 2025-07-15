// src/components/InteractiveDemoSection.js

import React, { useState, useEffect, useRef } from 'react';
import { Zap, BrainCircuit, Paintbrush } from 'lucide-react';

// --- DEMO TEMPLATES ---
// These are the pre-designed HTML versions for our guided demo.

const DEMO_VERSION_1 = `
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif;}.font-serif{font-family:'Playfair Display',serif;}</style>
</head><body class="bg-[#1a1a1a] text-white antialiased">
<header class="py-6 px-8 flex justify-between items-center"><div class="font-serif text-2xl font-bold">AURA</div><nav class="flex gap-8 text-gray-400"><a href="#" class="hover:text-white">Serums</a><a href="#" class="hover:text-white">Rituals</a><a href="#" class="hover:text-white">About</a></nav></header>
<main><section class="text-center py-24 px-8"><h1 class="font-serif text-7xl font-bold leading-tight">Beauty in Simplicity.</h1><p class="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">Discover elemental skincare, crafted from nature's purest ingredients.</p><button class="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold transition-transform hover:scale-105">Explore the Collection</button></section></main>
</body></html>`;

const DEMO_VERSION_2 = `
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif;}.font-serif{font-family:'Playfair Display',serif;}</style>
</head><body class="bg-[#f4f1eb] text-[#3d3d3d] antialiased">
<header class="py-6 px-8 flex justify-between items-center"><div class="font-serif text-2xl font-bold">AURA</div><nav class="flex gap-8 text-gray-500"><a href="#" class="hover:text-black">Serums</a><a href="#" class="hover:text-black">Rituals</a><a href="#" class="hover:text-black">About</a></nav></header>
<main><section class="text-center py-24 px-8"><h1 class="font-serif text-7xl font-bold leading-tight">Beauty in Simplicity.</h1><p class="text-xl text-gray-500 mt-4 max-w-2xl mx-auto">Discover elemental skincare, crafted from nature's purest ingredients.</p><button class="mt-8 px-8 py-3 bg-[#3d3d3d] text-white rounded-full font-bold transition-transform hover:scale-105">Explore the Collection</button></section></main>
</body></html>`;

const DEMO_VERSION_3 = `
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',sans-serif;}.font-serif{font-family:'Playfair Display',serif;}</style>
</head><body class="bg-[#f4f1eb] text-[#3d3d3d] antialiased">
<header class="py-6 px-8 flex justify-between items-center"><div class="font-serif text-2xl font-bold">AURA</div><nav class="flex gap-8 text-gray-500"><a href="#" class="hover:text-black">Serums</a><a href="#" class="hover:text-black">Rituals</a><a href="#" class="hover:text-black">About</a></nav></header>
<main><section class="text-center py-24 px-8"><h1 class="font-serif text-7xl font-bold leading-tight">Beauty in Simplicity.</h1><p class="text-xl text-gray-500 mt-4 max-w-2xl mx-auto">Discover elemental skincare, crafted from nature's purest ingredients.</p><button class="mt-8 px-8 py-3 bg-[#3d3d3d] text-white rounded-full font-bold transition-transform hover:scale-105">Explore the Collection</button></section>
<section class="py-16 px-8"><div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
<div class="text-center"><div class="w-full h-80 bg-[#e4e0da] rounded-lg mb-4"></div><h3 class="font-serif text-2xl">The Hydration Serum</h3><p class="text-gray-500">A featherlight formula for deep, lasting moisture.</p></div>
<div class="text-center mt-12"><div class="w-full h-80 bg-[#d9d4cb] rounded-lg mb-4"></div><h3 class="font-serif text-2xl">The Renewal Mask</h3><p class="text-gray-500">Gently exfoliate and restore your natural radiance.</p></div>
<div class="text-center"><div class="w-full h-80 bg-[#e4e0da] rounded-lg mb-4"></div><h3 class="font-serif text-2xl">The Radiance Oil</h3><p class="text-gray-500">Nourish your skin with a blend of pure botanicals.</p></div>
</div></section></main>
</body></html>`;

// --- THINKING MESSAGES ---
const thinkingMessages = [
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: "Zoltrak is powering up..." },
    { icon: <BrainCircuit className="w-5 h-5 text-purple-400" />, text: "The Architect is designing..." },
    { icon: <Paintbrush className="w-5 h-5 text-blue-400" />, text: "The Designer is choosing colors..." },
];

const InteractiveDemoSection = () => {
  const [currentHtml, setCurrentHtml] = useState(DEMO_VERSION_1);
  const [chatHistory, setChatHistory] = useState([{ from: 'ai', text: "Welcome to the interactive demo! Click a suggestion below to see me work." }]);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [currentThinkingMessage, setCurrentThinkingMessage] = useState(thinkingMessages[0]);
  const chatEndRef = useRef(null);
  
  const suggestions = [
    { id: 1, text: "Change the theme to light mode", nextHtml: DEMO_VERSION_2, aiResponse: "Done. I've updated the theme to a brighter, light-mode palette." },
    { id: 2, text: "Add a product gallery section", nextHtml: DEMO_VERSION_3, aiResponse: "Of course. I've added a new section to showcase the products." },
    { id: 3, text: "Make the header font more elegant", aiResponse: "This feature is part of the full experience. Start creating for free to try it!" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  useEffect(() => {
    let interval;
    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % thinkingMessages.length;
        setCurrentThinkingMessage(thinkingMessages[index]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDemoClick = (suggestion) => {
    if (disabledButtons.includes(suggestion.id)) return;

    setChatHistory(prev => [...prev, { from: 'user', text: suggestion.text }]);
    setDisabledButtons(prev => [...prev, suggestion.id]);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setChatHistory(prev => [...prev, { from: 'ai', text: suggestion.aiResponse }]);
      if (suggestion.nextHtml) {
        setCurrentHtml(suggestion.nextHtml);
      }
    }, 2500); // Simulate AI thinking time
  };

  return (
    <section id="interactive-demo" className="py-20 bg-grid-pattern bg-[#111827] px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-elegant">Experience It Live</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-12">
          This is a guided tour of Zoltrak's capabilities. Click a suggestion to see it build in real-time.
        </p>
        
        <div className="max-w-7xl mx-auto bg-gray-900/50 border border-white/10 rounded-2xl shadow-2xl p-2 sm:p-4 pt-0">
          <div className="h-10 flex items-center gap-2 px-2 text-gray-600">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>

          {/* UPDATED: Reduced height for better visibility on one page */}
          <div className="h-[65vh] bg-black/20 rounded-lg overflow-hidden">
            {/* --- Start of Simplified AiInterface --- */}
            <div className="w-full h-full bg-[#1a202c]/80 flex flex-col md:flex-row">
              {/* Simplified Chat Panel */}
              <div className="w-full md:w-2/5 h-full bg-black/10 p-4 flex flex-col border-r border-white/10">
                <h2 className="text-lg font-bold mb-4 text-white font-premium flex-shrink-0">Chat with Zoltrak</h2>
                <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${msg.from === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' : 'bg-gray-700/80 text-gray-200 rounded-bl-none'}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700/80 text-gray-200 rounded-2xl rounded-bl-none p-3 text-center">
                        <div className="flex items-center gap-2 text-sm font-premium text-purple-300 mb-2">
                          {currentThinkingMessage.icon}
                          <p>{currentThinkingMessage.text}</p>
                        </div>
                        <div className="typing-indicator"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full inline-block"></span><span className="w-1.5 h-1.5 bg-purple-400 rounded-full inline-block"></span><span className="w-1.5 h-1.5 bg-purple-400 rounded-full inline-block"></span></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
              {/* Simplified Preview Panel */}
              <div className="w-full md:w-3/5 h-full bg-black/10 p-4 flex justify-center items-center">
                 <div className="w-full h-full bg-white rounded-md shadow-lg">
                    <iframe srcDoc={currentHtml} title="Live Preview" className="w-full h-full border-0 rounded-md" sandbox="allow-scripts allow-same-origin" />
                  </div>
              </div>
            </div>
            {/* --- End of Simplified AiInterface --- */}
          </div>
        </div>

        <div className="mt-8">
            <p className="text-sm text-gray-400 mb-3">Try asking Zoltrak to:</p>
            <div className="flex flex-wrap justify-center gap-3">
                {suggestions.map((s) => (
                    <button 
                        key={s.id} 
                        onClick={() => handleDemoClick(s)}
                        disabled={disabledButtons.includes(s.id)}
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium py-2 px-4 rounded-full transition-all duration-200 border border-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-500/10"
                    >
                        {s.text}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemoSection;