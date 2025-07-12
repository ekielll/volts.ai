// src/pages/ProjectsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useProjectContext } from '../ProjectContext';
import AppHeader from '../components/AppHeader';
import Taskbar from '../components/Taskbar';
import { FilePlus2, Loader2, Trash2, Layers, Zap } from 'lucide-react';
import * as cheerio from 'cheerio';

// Helper to generate a summary from HTML
const generateSummary = (html) => {
    if (!html) return { summary: 'No description available.', components: [] };
    const $ = cheerio.load(html);
    const summary = $('title').text() || $('h1').first().text() || 'Untitled Project';
    const components = [];
    $('nav, header, section, footer').each((i, el) => {
        if ($(el).attr('id')) {
            components.push($(el).attr('id'));
        }
    });
    return {
        summary: `A project titled "${summary}".`,
        components: components.slice(0, 4) // Limit to 4 components for UI
    };
};


const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { activeProject, startNewProject } = useProjectContext();

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
            // Enhance projects with summary data
            const enhancedProjects = data.map(p => ({
                ...p,
                ...generateSummary(p.html_code)
            }));
            setProjects(enhancedProjects);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (activeProject) {
            navigate('/ai-interface');
        } else {
            fetchProjects();
        }
    }, [activeProject, fetchProjects, navigate]);

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
        navigate('/ai-interface', {
            state: {
                projectToLoad: {
                    htmlCode: project.html_code,
                    chatHistory: project.chat_history
                }
            }
        });
    };

    const handleNewProjectClick = () => {
        startNewProject();
        navigate('/ai-interface');
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
                                onClick={handleNewProjectClick}
                                className="premium-button inline-flex items-center text-white font-bold py-2 px-6 rounded-lg font-premium"
                            >
                                <Zap className="w-4 h-4 mr-2"/>
                                New Project
                            </button>
                        </div>

                        {loading ? (
                             <div className="text-center py-12 flex items-center justify-center gap-3">
                                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                                <span className="text-gray-500">Loading projects...</span>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map(project => {
                                    const thumbnailHtml = `
                                        <html><head><style>body { margin: 0; overflow: hidden; } .thumbnail-content { width: 400%; height: 400%; transform: scale(0.25); transform-origin: top left; overflow: hidden; background-color: #fff; }</style></head>
                                        <body><div class="thumbnail-content">${project.html_code}</div></body></html>
                                    `;
                                    return (
                                        <div key={project.id} className="group relative glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 flex flex-col">
                                            <div className="aspect-[16/9] w-full overflow-hidden pointer-events-none shadow-inner bg-gray-800">
                                                <iframe srcDoc={thumbnailHtml} title={project.name} className="w-full h-full border-0" scrolling="no" />
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="text-xl font-bold font-premium text-white truncate">{project.name}</h3>
                                                <p className="text-sm text-gray-400 mt-1 flex-grow">{project.summary}</p>
                                                
                                                <div className="mt-4 pt-4 border-t border-white/10">
                                                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-2"><Layers size={14} /> Components</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.components.map(comp => (
                                                            <span key={comp} className="bg-gray-700/80 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">{comp}</span>
                                                        ))}
                                                        {project.components.length === 0 && <p className="text-xs text-gray-500">No components identified.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button onClick={() => handleDeleteProject(project.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm font-bold bg-black/20 p-2 rounded-full"><Trash2 className="w-5 h-5"/></button>
                                                <button onClick={() => handleOpenProject(project)} className="premium-button text-white font-bold py-3 px-8 rounded-lg">Open Project</button>
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