// src/components/TemplatePreviewModal.js

import React from 'react';
import { X } from 'lucide-react';

const TemplatePreviewModal = ({ template, onClose, onSelect }) => {
    if (!template) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full h-full max-w-7xl flex flex-col">
                {/* Modal Header */}
                <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold font-premium">{template.name}</h2>
                        <p className="text-sm text-gray-400">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => onSelect(template)}
                            className="premium-button font-bold py-2 px-6 rounded-lg"
                        >
                            Add to Canvas
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>
                </header>
                
                {/* Iframe for Live Preview */}
                <div className="flex-grow bg-white">
                    <iframe
                        srcDoc={template.code}
                        title={template.name}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts" // Sandboxed for security
                    />
                </div>
            </div>
        </div>
    );
};

export default TemplatePreviewModal;