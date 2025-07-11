// src/components/Taskbar.js

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Library, Bot, Sparkles, LogOut, Package } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Taskbar = ({ onPremiumFeatureClick }) => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleLogout = () => {
        signOut();
        navigate('/');
    };

    const navItems = [
        { to: "/dashboard", icon: <LayoutDashboard size={24} />, label: "Dashboard" },
        { to: "/projects", icon: <FolderKanban size={24} />, label: "Projects" },
        { to: "/templates", icon: <Package size={24} />, label: "Templates" },
        { to: "/assets", icon: <Library size={24} />, label: "Assets" },
        { to: "/knowledge-base", icon: <Bot size={24} />, label: "Knowledge", premium: true },
    ];

    const getNavLinkClass = ({ isActive }) =>
        `flex items-center justify-center w-16 h-16 transition-all duration-300 ease-in-out relative group ${
            isActive ? 'text-white' : 'text-gray-500 hover:text-white'
        }`;

    return (
        <aside className="fixed top-0 left-0 h-screen w-20 bg-gray-900/50 backdrop-blur-lg border-r border-white/10 flex flex-col items-center justify-between py-6 z-40">
            <div className="flex flex-col items-center gap-2">
                <img
                    src="/logo.png"
                    alt="Volts Logo"
                    className="h-12 w-auto mb-6 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                />
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={getNavLinkClass}
                        onClick={(e) => {
                            if (item.premium && onPremiumFeatureClick) {
                                e.preventDefault();
                                onPremiumFeatureClick();
                            }
                        }}
                    >
                        {item.icon}
                        {item.premium && (
                            <Sparkles className="absolute top-2 right-2 w-3.5 h-3.5 text-yellow-400" />
                        )}
                        <span className="absolute left-full ml-4 w-auto min-w-max px-3 py-1.5 bg-gray-800 text-white text-sm font-bold rounded-md shadow-lg scale-0 origin-left transition-transform group-hover:scale-100">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>

            <div className="flex flex-col items-center">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-16 h-16 text-gray-500 hover:text-red-500 transition-colors group relative"
                >
                    <LogOut size={24} />
                    <span className="absolute left-full ml-4 w-auto px-3 py-1.5 bg-gray-800 text-white text-sm font-bold rounded-md shadow-lg scale-0 origin-left transition-transform group-hover:scale-100">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Taskbar;