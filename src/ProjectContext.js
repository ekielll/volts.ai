// src/ProjectContext.js

import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => {
    return useContext(ProjectContext);
};

// CORRECTED: This default state now includes the scripts for Tailwind CSS
// and is designed to work with your original AiInterface.js component.
const initialProjectState = {
    previewCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Poppins', sans-serif; }</style>
    <title>Volts.ai</title>
</head>
<body style="background-color: #1a202c;">
    </body>
</html>`,
    chatHistory: [
        { from: 'ai', text: "Hello. I'm Zoltrak. Ask me to design something! What kind of project are you starting?" }
    ],
    // Setting interactionCount to 0 ensures your original logic will show the template buttons
    interactionCount: 0, 
};


export const ProjectProvider = ({ children }) => {
    const [activeProject, setActiveProject] = useState(initialProjectState);

    // This function starts a completely new, temporary session
    const startNewProject = () => {
        setActiveProject(initialProjectState);
    };

    // This function loads a saved project's state into the session
    const loadProject = (projectData) => {
        setActiveProject({
            previewCode: projectData.htmlCode,
            chatHistory: projectData.chatHistory,
            interactionCount: projectData.chatHistory.length,
        });
    };
    
    // This function clears the session (e.g., after saving)
    const clearActiveProject = () => {
        setActiveProject(null);
    };
    
    // These functions allow child components to modify the session state
    const updatePreviewCode = (newCode) => {
        if (!activeProject) return;
        setActiveProject(prev => ({ ...prev, previewCode: newCode }));
    };

    const addMessageToHistory = (message) => {
        if (!activeProject) return;
        const updatedHistory = [...activeProject.chatHistory, message];
        setActiveProject(prev => ({ ...prev, chatHistory: updatedHistory, interactionCount: prev.interactionCount + 1 }));
    };

    const updateActiveProject = (updates) => {
        if (!activeProject) return;
        setActiveProject(prev => ({ ...prev, ...updates }));
    };

    const value = {
        activeProject,
        startNewProject,
        loadProject,
        clearActiveProject,
        updatePreviewCode,
        addMessageToHistory,
        updateActiveProject
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};