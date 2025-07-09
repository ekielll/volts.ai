// src/components/AiFuelTracker.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import { Fuel, Info, Loader2, Zap, Infinity as InfinityIcon } from 'lucide-react';

// NEW: Updated plan limits, with Infinity for the "Grid" plan.
const PLAN_LIMITS = {
    'Spark': 100, // Assuming "Free" tier is named "Spark"
    'Volt': 750,
    'Surge': 2000,
    'Grid': Infinity, // Using Infinity to represent the unlimited tier
};

const AiFuelTracker = () => {
    const { profile } = useAuth();
    const [usage, setUsage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Determine plan and limit from the user's profile
    const plan = profile?.subscription_tier || 'Spark';
    const limit = PLAN_LIMITS[plan] || 100;
    
    const fetchUsage = useCallback(async () => {
        if (!profile) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('ai_interaction_count')
                .eq('id', profile.id)
                .single();

            if (error) throw error;

            setUsage(data?.ai_interaction_count || 0);
        } catch (error) {
            console.error("Error fetching AI usage:", error);
        } finally {
            setIsLoading(false);
        }
    }, [profile]);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    // Calculate usage percentage, handling the unlimited case.
    const percentage = limit === Infinity ? 100 : Math.min((usage / limit) * 100, 100);
    
    // NEW: Calculate dynamic color. Hue goes from 120 (green) down to 0 (red).
    const hue = (percentage / 100) * 120;
    const fillColor = `hsl(${hue}, 85%, 50%)`;

    // Show a loader while fetching initial data
    if (isLoading) {
        return <div className="flex items-center gap-4 p-4"><Loader2 className="w-5 h-5 animate-spin text-purple-400" /> <p className="text-gray-400">Loading AI Fuel...</p></div>;
    }

    // NEW: Special UI for the unlimited "Grid" plan
    if (limit === Infinity) {
        return (
            <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Fuel className="w-5 h-5 text-green-400" />
                        <h4 className="font-bold text-white">AI Fuel</h4>
                        <div className="group relative">
                            <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                            <div className="absolute bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/10 text-gray-300 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Your Grid plan includes unlimited AI Fuel. Create without limits!
                            </div>
                        </div>
                    </div>
                    <p className="font-mono text-sm text-white flex items-center gap-1">{usage} / <InfinityIcon className="w-4 h-4" /></p>
                </div>
                <div className="w-full bg-gray-900/50 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `100%` }}
                    ></div>
                </div>
            </div>
        );
    }
    
    // NEW: Special UI for when fuel has run out
    if (usage >= limit) {
         return (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                     <Fuel className="w-5 h-5 text-red-400" />
                     <h4 className="font-bold text-white">AI Fuel Empty</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">You've used all your AI Fuel for this month.</p>
                <button className="premium-button text-sm font-bold py-2 px-4 rounded-lg">
                    <Zap className="w-4 h-4 mr-2"/>
                    Upgrade Plan
                </button>
            </div>
        );
    }

    // Default UI for normal usage
    return (
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-white">AI Fuel</h4>
                    <div className="group relative">
                        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                        <div className="absolute bottom-full mb-2 w-64 p-3 bg-gray-900 border border-white/10 text-gray-300 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            "AI Fuel" represents your monthly AI interactions. Every time you ask Zoltrak to generate code, update a design, or use an AI feature, it consumes fuel. Upgrade your plan for more fuel!
                        </div>
                    </div>
                </div>
                <p className="font-mono text-sm text-white">{usage} / {limit}</p>
            </div>
            <div className="w-full bg-gray-900/50 rounded-full h-4 overflow-hidden">
                <div
                    className="h-4 rounded-full transition-all duration-500"
                    // NEW: Inline style uses the dynamic HSL color
                    style={{ width: `${percentage}%`, backgroundColor: fillColor }}
                ></div>
            </div>
        </div>
    );
};

export default AiFuelTracker;