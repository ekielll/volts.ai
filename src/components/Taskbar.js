// src/components/Taskbar.js

import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useProjectContext } from '../ProjectContext'; // UPDATED: Import the project context hook
import { LayoutDashboard, FolderKanban, Library, Store, BrainCircuit, Settings as SettingsIcon } from 'lucide-react';

const Taskbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { activeProject } = useProjectContext(); // UPDATED: Get the active project from context

    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard', title: 'Dashboard' },
        // UPDATED: The 'Projects' item is now just a placeholder for logic below
        { path: '/projects', icon: <FolderKanban size={24} />, label: 'Projects', title: 'Your Projects' },
        { path: '/assets', icon: <Library size={24} />, label: 'Asset Library', title: 'Asset Library' },
        { path: '/templates', icon: <Store size={24} />, label: 'Templates', title: 'Template Marketplace' },
        { path: '/knowledge-base', icon: <BrainCircuit size={24} />, label: 'Knowledge Base', title: 'Custom Knowledge Base' },
    ];

    return (
        <div className="group fixed left-0 top-0 h-full w-20 hover:w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-2 z-40 transition-all duration-300 ease-in-out">
            <Link to="/" className="mb-6 flex-shrink-0">
                <img src="/logo.png" alt="Volts Logo" className="h-8 w-auto"/>
            </Link>
            
            <div className="flex flex-col gap-2 w-full">
                {navItems.map(item => {
                    // UPDATED: Smarter isActive check and onClick navigation for 'Projects'
                    const isProjectsTab = item.label === 'Projects';
                    
                    // The Projects tab is active if we are on the project list OR the AI interface.
                    const isActive = isProjectsTab
                        ? location.pathname === '/projects' || location.pathname === '/ai-interface'
                        : location.pathname === item.path;
                    
                    // The Projects tab navigates to the active session if one exists.
                    const targetPath = isProjectsTab
                        ? (activeProject ? '/ai-interface' : '/projects')
                        : item.path;

                    return (
                        <button 
                            key={item.path}
                            onClick={() => navigate(targetPath)} 
                            className={`w-full flex items-center gap-4 px-6 py-3 transition-colors ${
                                isActive 
                                ? 'bg-purple-500/20 text-white' 
                                : 'text-gray-400 hover:bg-purple-500/20 hover:text-white'
                            }`}
                            title={item.title}
                        >
                            <div className="flex-shrink-0">{item.icon}</div>
                            <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200 overflow-hidden font-premium whitespace-nowrap">{item.label}</span>
                        </button>
                    )
                })}
            </div>

            <button onClick={() => alert('Settings will be available soon!')} className="w-full flex items-center gap-4 px-6 py-3 text-gray-400 hover:bg-purple-500/20 hover:text-white transition-colors mt-auto" title="Settings">
                <SettingsIcon size={24} className="flex-shrink-0" />
                <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200 overflow-hidden font-premium whitespace-nowrap">Settings</span>
            </button>
        </div>
    );
};

export default Taskbar;