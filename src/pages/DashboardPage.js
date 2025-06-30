// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import Taskbar from '../components/Taskbar';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../AuthContext';
import { Zap, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import AiFuelTracker from '../components/AiFuelTracker';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  
  const [inspirationItems, setInspirationItems] = useState([]);
  const [isLoadingInspiration, setIsLoadingInspiration] = useState(true);

  const firstName = profile?.full_name?.split(' ')[0] || user?.email || 'there';

  // The briefingItems array now only contains the static items.
  const briefingItems = [
      { icon: <Zap className="w-5 h-5 text-green-400" />, text: "Your 'Photography Portfolio' is looking great. Have you considered adding a testimonials section?" },
  ];

  useEffect(() => {
    const fetchInspiration = async () => {
      try {
        setIsLoadingInspiration(true);
        const response = await fetch('/api/get-inspiration');
        if (!response.ok) {
          throw new Error('Failed to fetch inspiration items');
        }
        const data = await response.json();
        setInspirationItems(data);
      } catch (error) {
        console.error(error);
        setInspirationItems([]);
      } finally {
        setIsLoadingInspiration(false);
      }
    };

    fetchInspiration();
  }, []);

  return (
    <div className="flex">
      <Taskbar />
      <main className="flex-grow pl-20">
        <div className='w-full min-h-screen bg-gray-900'>
            <AppHeader />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h1 className="text-4xl font-bold font-elegant">Hi, {firstName}.</h1>
                <p className="text-gray-400 mt-2 text-lg">
                  Welcome to your Mission Control. Here are your AI-powered insights for today.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2">
                    <div className="glass-card h-full p-6 rounded-xl">
                        <h2 className="text-2xl font-bold font-premium mb-4 flex items-center gap-3">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Zoltrak's Daily Briefing
                        </h2>
                        {/* FIXED: Restored original ul/li structure */}
                        <ul className="space-y-4">
                            {/* Conditionally render the AiFuelTracker or its loader as the first list item */}
                            <li className="p-0">
                                {profile ? <AiFuelTracker /> : <div className="flex items-center gap-4 p-4"><Loader2 className="w-5 h-5 animate-spin text-purple-400" /> <p className="text-gray-400">Loading AI Fuel...</p></div>}
                            </li>
                            
                            {/* Map over the remaining static briefing items */}
                            {briefingItems.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                    <div className="flex-shrink-0">{item.icon}</div>
                                    <p className="text-gray-300">{item.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-card h-full p-6 rounded-xl">
                         <h2 className="text-2xl font-bold font-premium mb-4 flex items-center gap-3">
                            <Lightbulb className="w-6 h-6 text-yellow-400" />
                            Inspiration Feed
                         </h2>
                        <div className="space-y-4">
                           {isLoadingInspiration ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                                </div>
                           ) : (
                                inspirationItems.map((item) => (
                                   <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg group cursor-pointer hover:bg-purple-500/10">
                                       <img src={item.thumbnail_url} alt={item.title} className="w-20 h-16 object-cover rounded-md" />
                                       <div className="flex-grow">
                                           <h3 className="font-semibold text-white">{item.title}</h3>
                                           <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                                       </div>
                                       <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                   </div>
                               ))
                           )}
                        </div>
                    </div>
                </div>

              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;