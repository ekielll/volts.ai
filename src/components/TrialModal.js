import React from 'react';
import { Sparkles } from 'lucide-react';

const TrialModal = ({ onStartTrial, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
        <div className="glass-card rounded-xl w-full max-w-lg flex flex-col relative bg-[#1F2937]/80 p-8 text-center items-center">
            <div className="p-4 bg-purple-500/20 rounded-full mb-6 border border-purple-500/30">
                <Sparkles className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-elegant">This is a Premium Feature</h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
                Start your free 7-day trial of the **Surge Plan** to upload a custom knowledge base and unlock all other premium features. No credit card required.
            </p>
            <div className="flex gap-4 w-full">
                <button onClick={onCancel} className="w-full text-gray-300 font-bold py-3 rounded-lg hover:bg-white/10 transition-colors">Maybe Later</button>
                <button onClick={onStartTrial} className="w-full premium-button text-white font-bold py-3 rounded-lg">Start 7-Day Free Trial</button>
            </div>
        </div>
    </div>
);

export default TrialModal;