// src/components/CommercialAnimation.js

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Infinity, ImageUp } from 'lucide-react';

const scenes = [
  // --- Scene 1: The Spark (3s) ---
  {
    id: 1,
    duration: 3,
    component: (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 p-4">
        <p className="font-mono text-2xl md:text-4xl text-gray-400">
          <span className="text-green-400">C:\volts&gt;</span>
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            transition={{ duration: 2, ease: 'linear' }}
            className="inline-block overflow-hidden whitespace-nowrap"
          >
            Create a calm, modern portfolio for a photographer.
          </motion.span>
          {/* FIXED: Removed the blinking cursor span that was causing the runtime error. */}
          <span className="inline-block w-2 h-8 bg-gray-300 ml-1" />
        </p>
      </div>
    ),
  },
  // --- Scene 2: Conversational Creation (7s) ---
  {
    id: 2,
    duration: 7,
    component: (
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center bg-gray-800/50 p-4 gap-4">
        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-gray-900/50 rounded-lg p-4 flex flex-col text-sm">
           <h3 className="font-bold text-lg text-purple-300 mb-4 font-premium">Chat with Zoltrak</h3>
           <div className="space-y-3">
             <p className="bg-purple-600 text-white p-3 rounded-lg rounded-br-none self-end">Create a calm, modern portfolio for a photographer.</p>
             <p className="bg-gray-700 text-gray-200 p-3 rounded-lg rounded-bl-none self-start">Of course. Here is a dark-themed portfolio to start.</p>
             <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="bg-purple-600 text-white p-3 rounded-lg rounded-br-none self-end"
             >
                Change the theme to light with a warm, earthy palette.
             </motion.p>
           </div>
        </div>
        <div className="w-full md:w-2/3 h-1/2 md:h-full bg-gray-900 rounded-lg p-2 transition-colors duration-1000 relative">
            <motion.div
                key="dark-theme"
                className="absolute inset-0 w-full h-full bg-gray-800 rounded"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
            />
            <motion.div
                key="light-theme"
                className="absolute inset-0 w-full h-full bg-stone-100 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
            />
        </div>
        <div className="absolute bottom-4 left-4 bg-black/50 p-3 rounded-lg">
            <h3 className="text-xl font-bold font-premium text-white flex items-center gap-2"><BrainCircuit className="text-purple-400"/> Conversational Creation</h3>
        </div>
      </div>
    ),
  },
  // --- Scene 3: Beyond Page Limits (5s) ---
  {
    id: 3,
    duration: 5,
    component: (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 p-8 overflow-hidden relative">
            <motion.div
                className="w-48 h-28 bg-purple-600/80 rounded-lg text-center p-4 font-bold text-xl flex items-center justify-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                Homepage
            </motion.div>
             {[{x: 200, y: -80, t: 'About'}, {x: -200, y: -80, t: 'Contact'}, {x: 200, y: 80, t: 'Blog'}, {x: -200, y: 80, t: 'Gallery'}].map((page, i) => (
                <motion.div
                    key={page.t}
                    className="absolute w-32 h-20 bg-gray-700 rounded-lg text-center p-4 flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        x: `calc(50% - 64px + ${page.x}px)`,
                        y: `calc(50% - 40px + ${page.y}px)`,
                        scale: 1,
                        opacity: 1
                    }}
                    transition={{ delay: 1 + i * 0.2, type: 'spring', stiffness: 100 }}
                >
                    {page.t}
                </motion.div>
            ))}
             <div className="absolute bottom-4 left-4 bg-black/50 p-3 rounded-lg">
                <h3 className="text-xl font-bold font-premium text-white flex items-center gap-2"><Infinity className="text-purple-400"/> Beyond Page Limits</h3>
            </div>
        </div>
    ),
  },
    // --- Scene 4: From Vision to Code (7s) ---
  {
    id: 4,
    duration: 7,
    component: (
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-center bg-gray-800/50 p-8 gap-8">
        <div className="w-full md:w-1/2 h-full relative">
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 3, duration: 1 }}
            >
                <div className="w-4/5 h-4/5 bg-white p-4 rounded-xl shadow-2xl text-black">
                    <p className="font-mono text-left">{/* A quick sketch of our app */}</p>
                    <div className="w-full h-8 bg-gray-200 rounded mt-4"></div>
                    <div className="w-full h-32 bg-gray-200 rounded mt-4"></div>
                    <div className="w-1/2 h-8 bg-gray-200 rounded mt-4"></div>
                </div>
            </motion.div>
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
            >
                <div className="w-4/5 h-4/5 bg-gray-900 p-4 rounded-xl shadow-2xl">
                     <div className="w-full h-8 bg-purple-500 rounded mt-4 flex items-center justify-center text-white font-bold">Header</div>
                    <div className="w-full h-32 bg-blue-500/20 rounded mt-4 flex items-center justify-center text-white">Hero Image</div>
                    <div className="w-1/2 h-8 bg-green-500 rounded mt-4 flex items-center justify-center text-white">Button</div>
                </div>
            </motion.div>
        </div>
         <div className="absolute bottom-4 left-4 bg-black/50 p-3 rounded-lg">
            <h3 className="text-xl font-bold font-premium text-white flex items-center gap-2"><ImageUp className="text-purple-400"/> From Vision to Code</h3>
        </div>
      </div>
    ),
  },
  // --- Scene 5: The Reveal (3s) ---
  {
    id: 5,
    duration: 3,
    component: (
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center text-center bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img 
            src="/logo.png" 
            alt="Volts Logo"
            className="h-20 w-auto mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        />
        <motion.h2
            className="text-3xl md:text-4xl font-premium font-bold text-white tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            Create at the Speed of Thought.
        </motion.h2>
      </motion.div>
    ),
  },
];

const CommercialAnimation = () => {
  const [sceneIndex, setSceneIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSceneIndex((prevIndex) => (prevIndex + 1) % scenes.length);
    }, scenes[sceneIndex].duration * 1000);

    return () => clearTimeout(timer);
  }, [sceneIndex]);

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
      <AnimatePresence>
        {scenes.map(
          (scene, index) =>
            index === sceneIndex && (
              <motion.div
                key={scene.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {scene.component}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommercialAnimation;