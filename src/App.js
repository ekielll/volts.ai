// src/App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ProjectProvider } from './ProjectContext'; // 1. Import the new ProjectProvider
import GlobalStyles from './components/GlobalStyles';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import AiInterfacePage from './pages/AiInterfacePage';
import DashboardPage from './pages/DashboardPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import ProjectsPage from './pages/ProjectsPage';
import AssetLibraryPage from './pages/AssetLibraryPage';
import TemplateMarketplacePage from './pages/TemplateMarketplacePage';

const App = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('signup');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (user && isAuthModalOpen) {
            setIsAuthModalOpen(false);
        }
    }, [user, isAuthModalOpen]);

    const handleOpenAuthModal = (mode, plan = null) => {
        setAuthMode(mode);
        setSelectedPlan(plan);
        setIsAuthModalOpen(true);
    };

    const handleToggleAuthMode = () => {
        setAuthMode(prevMode => prevMode === 'signup' ? 'login' : 'signup');
    };

    return (
        // 2. Wrap the entire app content inside the ProjectProvider
        <ProjectProvider>
            <GlobalStyles />
            <Routes>
                <Route path="/" element={<HomePage handleOpenAuthModal={handleOpenAuthModal} />} />
                <Route path="/ai-interface" element={<AiInterfacePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/assets" element={<AssetLibraryPage />} />
                <Route path="/templates" element={<TemplateMarketplacePage />} />
            </Routes>
            {isAuthModalOpen && !user && <AuthModal mode={authMode} onToggleMode={handleToggleAuthMode} closeModal={() => setIsAuthModalOpen(false)} selectedPlan={selectedPlan} />}
        </ProjectProvider>
    );
};

export default App;