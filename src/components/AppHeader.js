// src/components/AppHeader.js

import React from 'react';
import { useAuth } from '../AuthContext';
import { useProjectContext } from '../ProjectContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Save, XCircle } from 'lucide-react';

const AppHeader = ({ onSave }) => {
  const { user } = useAuth();
  const { clearActiveProject } = useProjectContext();
  const location = useLocation();
  const navigate = useNavigate();

  const showActionButtons = location.pathname === '/ai-interface';

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this session? All unsaved changes will be lost.')) {
        clearActiveProject();
        navigate('/projects');
    }
  };

  return (
    <header className="bg-gray-900/50 backdrop-blur-lg h-20 flex items-center border-b border-white/10 flex-shrink-0">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4">
            {user ? (
              <div className='flex items-center gap-4'>
                {showActionButtons && (
                  <div className="flex items-center gap-2">
                    <button onClick={handleDiscard} className="text-gray-400 hover:text-white flex items-center gap-2 font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-all font-premium text-sm">
                        <XCircle size={16} />
                        Discard
                    </button>
                    <button onClick={onSave} className="premium-button flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg font-premium text-sm">
                        <Save size={16} />
                        Save Project
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/" className="text-gray-300 hover:text-white font-medium py-2 px-5 rounded-lg hover:bg-white/10 transition-all font-premium text-sm">
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;