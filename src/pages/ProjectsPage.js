// src/pages/ProjectsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useProjectContext } from '../ProjectContext'; // UPDATED: Import the project context hook
import AppHeader from '../components/AppHeader';
import Taskbar from '../components/Taskbar';
import { FilePlus2, Loader2, Trash2 } from 'lucide-react';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); 
    const { user } = useAuth();
    const navigate = useNavigate();
    const { startNewProject } = useProjectContext(); // UPDATED: Get the startNewProject function

    const fetchProjects = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/api/getProjects?userId=${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch('/api/deleteProject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, projectId: projectId })
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.details || 'Failed to delete project');
            }
            fetchProjects();
            alert('Project deleted successfully.');
        } catch (error) {
            alert('Error deleting project: ' + error.message);
        }
    };

    const handleOpenProject = (project) => {
        // BUG FIX: The state object must match what AiInterfacePage expects.
        // It needs to be nested inside a `projectToLoad` key.
        navigate('/ai-interface', { 
            state: { 
                projectToLoad: {
                    htmlCode: project.html_code, 
                    chatHistory: project.chat_history 
                }
            } 
        });
    };

    // UPDATED: This function now correctly starts a new session in the context
    const handleNewProjectClick = () => {
        startNewProject(); // This resets the context to a fresh workbench
        navigate('/ai-interface'); // Then navigates to the AI interface
    };

    return (
        <div className="flex">
            <Taskbar />
            <main className="flex-grow pl-20">
                <div className='w-full min-h-screen bg-gray-900'>
                    <AppHeader />
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl font-bold font-elegant">Your Projects</h1>
                            <button
                                onClick={handleNewProjectClick} // UPDATED: Use the new handler
                                className="premium-button inline-flex items-center text-white font-bold py-2 px-6 rounded-lg font-premium"
                            >
                                + New Project
                            </button>
                        </div>
                        
                        {loading ? (
                             <div className="text-center py-12 flex items-center justify-center gap-3">
                                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                                <span className="text-gray-500">Loading projects...</span>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                {projects.map(project => {
                                    const thumbnailHtml = `
                                        <html><head><style>body { margin: 0; overflow: hidden; } .thumbnail-content { width: 400%; height: 400%; transform: scale(0.25); transform-origin: top left; overflow: hidden; background-color: #fff; }</style></head>
                                        <body><div class="thumbnail-content">${project.html_code}</div></body></html>
                                    `;
                                    return (
                                        <div key={project.id} className="group relative glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50">
                                            <div className="aspect-[4/3] w-full h-full overflow-hidden pointer-events-none shadow-inner bg-gray-800">
                                                <iframe srcDoc={thumbnailHtml} title={project.name} className="w-full h-full border-0" scrolling="no" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-4">
                                                <h3 className="text-lg font-bold font-premium text-white">{project.name}</h3>
                                                <p className="text-xs text-gray-400">Created: {new Date(project.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button onClick={() => handleDeleteProject(project.id)} className="text-red-400 hover:text-red-300 text-sm font-bold bg-black/20 p-2 rounded-full"><Trash2 className="w-5 h-5"/></button>
                                                <button onClick={() => handleOpenProject(project)} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg">Open</button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center">
                                <FilePlus2 className="w-16 h-16 text-gray-600 mb-4" />
                                <h2 className="text-xl font-semibold text-white">No projects found.</h2>
                                <p className="text-gray-400 mt-2">Click "+ New Project" to start creating!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectsPage;