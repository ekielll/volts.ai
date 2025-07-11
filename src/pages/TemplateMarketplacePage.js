// src/pages/TemplateMarketplacePage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Taskbar from '../components/Taskbar';
import AppHeader from '../components/AppHeader';
import TemplateCard from '../components/TemplateCard';
import TemplatePreviewModal from '../components/TemplatePreviewModal';
import { baseTemplates } from '../lib/baseModels'; 
import { Loader2 } from 'lucide-react';

const TemplateMarketplacePage = () => {
    const [selectedComponents, setSelectedComponents] = useState({});
    const [synthesisPrompt, setSynthesisPrompt] = useState('');
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [previewingTemplate, setPreviewingTemplate] = useState(null);
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    const templateList = Object.entries(baseTemplates).map(([key, value], index) => ({
        id: index + 1,
        name: key.charAt(0) + key.slice(1).toLowerCase(),
        description: `A professional base model for a ${key.toLowerCase()} project.`,
        code: value,
        sections: ['Header', 'Hero Section', 'Main Content', 'Footer'],
        tags: [key.toLowerCase()]
    }));

    const handleComponentSelect = (template, section) => {
        setSelectedComponents(prev => {
            const key = `${template.id}-${section}`;
            const newSelection = { ...prev };
            if (newSelection[key]) {
                delete newSelection[key];
            } else {
                newSelection[key] = { templateName: template.name, section };
            }
            return newSelection;
        });
    };
    
    const handleSynthesize = async () => {
        const selectionCount = Object.keys(selectedComponents).length;
        if (selectionCount === 0 || !synthesisPrompt.trim()) {
            alert("Please select at least one template component and describe how you'd like to combine them.");
            return;
        }
        setIsSynthesizing(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    synthesis_request: { 
                        components: selectedComponents,
                        prompt: synthesisPrompt,
                    },
                    userPlan: profile?.subscription_tier || 'Free',
                    userId: user?.id,
                }),
            });
            if (!response.ok) throw new Error("Failed to synthesize the project.");
            const result = await response.json();
            
            navigate('/ai-interface', {
                state: {
                    projectToLoad: { 
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
                                    Select components from the "Base Models" below and instruct Zoltrak to fuse them into a single, unique creation.
                                </p>
                            </div>
                            
                            <div className="sticky top-24 bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-12 z-30 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-premium font-bold">Your Canvas:</h2>
                                        <div className="flex flex-wrap gap-3 mt-3">
                                            {Object.values(selectedComponents).length > 0 ? Object.values(selectedComponents).map((item, index) => (
                                                <div key={index} className="bg-purple-500/20 text-white font-semibold pl-4 pr-4 py-2 rounded-lg text-sm shadow-inner">
                                                    {item.templateName}: <span className="font-normal opacity-80">{item.section}</span>
                                                </div>
                                            )) : <p className="text-gray-500">Select components below to begin...</p>}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSynthesize}
                                        disabled={Object.keys(selectedComponents).length === 0 || isSynthesizing || !synthesisPrompt.trim()} 
                                        className="premium-button font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-6"
                                    >
                                        {isSynthesizing && <Loader2 className="w-5 h-5 animate-spin" />}
                                        {isSynthesizing ? 'Synthesizing...' : 'Synthesize with Zoltrak'}
                                    </button>
                                </div>
                                <textarea
                                    value={synthesisPrompt}
                                    onChange={(e) => setSynthesisPrompt(e.target.value)}
                                    disabled={Object.keys(selectedComponents).length === 0}
                                    placeholder="Describe how to combine your selected components. e.g., 'Use the header from The Bold Startup and the gallery from The Minimalist Photographer...'"
                                    className="w-full p-3 bg-gray-900/50 border-2 border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white font-premium disabled:opacity-50"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {templateList.map(template => (
                                    <TemplateCard 
                                        key={template.id}
                                        template={template}
                                        onComponentSelect={handleComponentSelect}
                                        onPreview={() => setPreviewingTemplate(template)}
                                        selectedComponents={selectedComponents}
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
                    alert("Select individual components directly from the template card.");
                    setPreviewingTemplate(null);
                }}
            />
        </>
    );
};

export default TemplateMarketplacePage;