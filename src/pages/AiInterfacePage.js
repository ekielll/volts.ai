// src/pages/AiInterfacePage.js

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useProjectContext } from '../ProjectContext'; 
import AppHeader from '../components/AppHeader';
import AiInterface from '../components/AiInterface';
import TrialModal from '../components/TrialModal';
import Taskbar from '../components/Taskbar';

const AiInterfacePage = () => {
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const { user, profile, refreshProfile } = useAuth();
    const { activeProject, startNewProject, loadProject, clearActiveProject } = useProjectContext();
    const location = useLocation();
    const navigate = useNavigate();

    const isProjectLoading = useRef(false);

    // --- EFFECT 1: Dedicated to LOADING a saved project from route state ---
    useEffect(() => {
        const projectToLoad = location.state?.projectToLoad;

        if (projectToLoad && projectToLoad.htmlCode && !isProjectLoading.current) {
            isProjectLoading.current = true; 

            const loadedHistory = projectToLoad.chatHistory || [];
            projectToLoad.chatHistory = [...loadedHistory, { from: 'ai', text: "Project loaded. How can I help you continue?" }];
            
            loadProject(projectToLoad);

            navigate(location.pathname, { replace: true, state: {} });
        }
    // UPDATED: Added `location.pathname` to the dependency array to fix the warning.
    }, [location.state, location.pathname, loadProject, navigate]);


    // --- EFFECT 2: Dedicated to STARTING a new project ---
    useEffect(() => {
        if (!activeProject && !location.state?.projectToLoad) {
            startNewProject();
        }
        
        if (!activeProject) {
            isProjectLoading.current = false;
        }
    }, [activeProject, location.state, startNewProject]);

    
    // --- EFFECT 3: Handles the "unsaved changes" warning ---
    useEffect(() => {
        if (isDirty) {
            const handleBeforeUnload = (event) => {
                event.preventDefault();
                event.returnValue = '';
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [isDirty]);

    const handleSaveClick = () => {
        if (!user) {
            alert("Please log in to save your project.");
            return;
        }
        setIsSaveModalOpen(true);
    };

    const handleConfirmSave = async () => {
        if (!projectName.trim()) {
            alert('Please enter a project name.');
            return;
        }
        
        if (activeProject) {
            try {
                const historyToSave = activeProject.chatHistory.filter(
                    msg => !msg.text.includes("Project loaded. How can I help you continue?")
                );

                const response = await fetch('/api/saveProject', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        userId: user.id, 
                        projectName, 
                        htmlCode: activeProject.previewCode, 
                        chatHistory: historyToSave 
                    }),
                });
                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.details || 'Failed to save');
                }
                alert(`Project "${projectName}" saved successfully!`);
                setIsSaveModalOpen(false);
                setProjectName('');
                setIsDirty(false);
                clearActiveProject();
                navigate('/projects');
            } catch (error) {
                alert('Error saving project: ' + error.message);
            }
        }
    };
    
    const handlePremiumFeatureClick = () => {
        if (!user || !profile) {
            alert("Please log in to use premium features.");
            return;
        }
        const hasPaidPlan = profile.subscription_tier === 'Surge' || profile.subscription_tier === 'Grid';
        const hasActiveTrial = profile.trial_ends_at && new Date(profile.trial_ends_at) > new Date();

        if (hasPaidPlan || hasActiveTrial) {
            alert("Knowledge Base UI coming soon!");
        } else {
            setIsTrialModalOpen(true);
        }
    };

    const handleStartTrial = async () => {
        if (!user) return;
        try {
            const response = await fetch('/api/startTrial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });
            if (!response.ok) throw new Error("Could not start trial.");
            alert("Your 7-day trial has started! You now have access to all premium features.");
            
            await refreshProfile();
            setIsTrialModalOpen(false);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="flex">
            <Taskbar onPremiumFeatureClick={handlePremiumFeatureClick} />
            <main className="flex-grow pl-20">
                <div className="flex flex-col h-screen">
                    <AppHeader onSave={handleSaveClick} />
                    <div className="flex-grow min-h-0">
                        {activeProject && (
                            <AiInterface 
                                isFullScreen={true} 
                                onNewMessage={() => setIsDirty(true)} 
                                profile={profile}
                            />
                        )}
                    </div>
                    {isSaveModalOpen && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                            <div className="glass-card rounded-xl w-full max-w-md flex flex-col relative bg-[#1F2937]/80 p-8">
                                <h2 className="text-2xl font-bold text-center mb-4 font-premium">Save Project</h2>
                                <p className="text-center text-gray-400 mb-6">Enter a name for your project to save it to your account.</p>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="My Awesome Website"
                                    className="w-full p-3 mb-4 bg-gray-900/50 border-2 border-transparent border-b-white/20 rounded-lg focus:outline-none focus:border-b-purple-500 transition-colors"
                                />
                                <div className="flex gap-4">
                                    <button onClick={() => setIsSaveModalOpen(false)} className="w-full text-gray-300 font-bold py-3 rounded-lg hover:bg-white/10 transition-colors">Cancel</button>
                                    <button onClick={handleConfirmSave} className="w-full premium-button text-white font-bold py-3 rounded-lg">Save</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isTrialModalOpen && <TrialModal onStartTrial={handleStartTrial} onCancel={() => setIsTrialModalOpen(false)} />}
                </div>
            </main>
        </div>
    );
};

export default AiInterfacePage;