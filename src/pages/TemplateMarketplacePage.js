// src/pages/TemplateMarketplacePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Taskbar from '../components/Taskbar';
import AppHeader from '../components/AppHeader';
import TemplateCard from '../components/TemplateCard';
import TemplatePreviewModal from '../components/TemplatePreviewModal';
// UPDATED: Corrected the import from 'baseModels' to 'baseTemplates'
import { baseTemplates } from '../lib/baseModels'; 
import { Loader2, X } from 'lucide-react';

const TemplateMarketplacePage = () => {
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [synthesisPrompt, setSynthesisPrompt] = useState('');
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [previewingTemplate, setPreviewingTemplate] = useState(null);
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    // UPDATED: Create a structured list from the imported templates object
    const templateList = Object.entries(baseTemplates).map(([key, value], index) => ({
        id: index + 1,
        name: key.charAt(0) + key.slice(1).toLowerCase(), // e.g., 'Website', 'Portfolio'
        description: `A professional base model for a ${key.toLowerCase()} project.`,
        code: value,
        tags: [key.toLowerCase()]
    }));

    const handleTemplateSelect = (template) => {
        setSelectedTemplates(prev => {
            if (prev.find(t => t.id === template.id)) {
                return prev.filter(t => t.id !== template.id);
            }
            if (prev.length < 3) {
                return [...prev, template];
            }
            return prev;
        });
    };

    const handleSynthesize = async () => {
        if (selectedTemplates.length === 0 || !synthesisPrompt.trim()) {
            alert("Please select at least one template and describe how you'd like to combine them.");
            return;
        }
        setIsSynthesizing(true);
        try {
            const baseModelCodes = selectedTemplates.map(t => t.code);
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: synthesisPrompt,
                    baseModelCodes: baseModelCodes,
                    userPlan: profile?.subscription_tier || 'Free',
                    userId: user?.id,
                    history: [],
                    currentCode: '',
                }),
            });
            if (!response.ok) throw new Error("Failed to synthesize the project.");
            const result = await response.json();
            
            // Navigate to the AI interface with the synthesized code
            navigate('/ai-interface', {
                state: {
                    projectToLoad: { // Ensure state is nested correctly
                        htmlCode: result.files ? result.files.html : result.data.match(/```html([\s\S]*?)```/)?.[1].trim(),
                        chatHistory: [{ from: 'ai', text: "Here is the new website I synthesized for you based on your instructions. What would you like to change?" }]
                    }
                }
            });
        } catch (error) {
            console.error(error);
            alert("An error occurred during synthesis. Please try again.");
        } finally {
            setIsSynthesizing(false);
        }
    };

    return (
        <>
            <div className="flex">
                <Taskbar />
                <main className="flex-grow pl-20">
                    <div className='w-full min-h-screen bg-gray-900'>
                        <AppHeader />
                        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h1 className="text-5xl font-bold font-elegant shimmer-text inline-block pb-1">The Chimera Engine</h1>
                                <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
                                    Select up to 3 "Base Models" and instruct Zoltrak to fuse their best parts into a single, unique creation.
                                </p>
                            </div>
                            
                            <div className="sticky top-24 bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-12 z-30 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-premium font-bold">Your Canvas:</h2>
                                        <div className="flex gap-4">
                                            {selectedTemplates.map(t => (
                                                <div key={t.id} className="relative pt-2 pr-2">
                                                    <div className="bg-purple-500/20 text-white font-semibold pl-4 pr-4 py-2 rounded-lg text-sm">
                                                        {t.name}
                                                    </div>
                                                    <button 
                                                        onClick={() => handleTemplateSelect(t)} 
                                                        className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-purple-500/50 rounded-full text-white hover:bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] hover:scale-110 transition-all duration-200"
                                                        title={`Remove ${t.name}`}
                                                    >
                                                        <X size={12} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ))}
                                            {selectedTemplates.length === 0 && <p className="text-gray-500">Select templates below to begin...</p>}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSynthesize}
                                        disabled={selectedTemplates.length === 0 || isSynthesizing || !synthesisPrompt.trim()} 
                                        className="premium-button font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSynthesizing && <Loader2 className="w-5 h-5 animate-spin" />}
                                        {isSynthesizing ? 'Synthesizing...' : 'Synthesize with Zoltrak'}
                                    </button>
                                </div>
                                <textarea
                                    value={synthesisPrompt}
                                    onChange={(e) => setSynthesisPrompt(e.target.value)}
                                    disabled={selectedTemplates.length === 0}
                                    placeholder="Describe how to combine your selected templates here. e.g., 'Use the header from The Bold Startup and the gallery from The Minimalist Photographer...'"
                                    className="w-full p-3 bg-gray-900/50 border-2 border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white font-premium disabled:opacity-50"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* UPDATED: Map over the structured templateList */}
                                {templateList.map(template => (
                                    <TemplateCard 
                                        key={template.id}
                                        {...template}
                                        onSelect={() => handleTemplateSelect(template)}
                                        onPreview={() => setPreviewingTemplate(template)}
                                        isSelected={!!selectedTemplates.find(t => t.id === template.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <TemplatePreviewModal 
                template={previewingTemplate}
                onClose={() => setPreviewingTemplate(null)}
                onSelect={(template) => {
                    handleTemplateSelect(template);
                    setPreviewingTemplate(null);
                }}
            />
        </>
    );
};

export default TemplateMarketplacePage;