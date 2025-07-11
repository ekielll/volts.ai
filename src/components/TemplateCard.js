// src/components/TemplateCard.js

import React from 'react';
import { Plus, Eye, Check } from 'lucide-react';

const TemplateCard = ({ template, onComponentSelect, onPreview, selectedComponents }) => {
    return (
        <div className="group relative rounded-xl overflow-hidden glass-card border border-white/10 flex flex-col">
            <div className="relative aspect-[3/4]">
                <img src={`/template-previews/${template.name.toLowerCase()}.jpg`} alt={template.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold font-premium text-white">{template.name}</h3>
                    <p className="text-gray-300">{template.description}</p>
                </div>
                 <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                        onClick={() => onPreview(template)}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-lg text-white font-bold rounded-full hover:bg-white/30 transition-colors"
                        title="Preview"
                    >
                        <Eye size={20} />
                    </button>
                </div>
            </div>
            
            {/* NEW: Section for component checkboxes */}
            <div className="p-4 bg-gray-900/50">
                <h4 className="font-bold text-sm text-gray-300 mb-3">Select Components:</h4>
                <div className="space-y-2">
                    {template.sections.map(section => {
                        const key = `${template.id}-${section}`;
                        const isSelected = !!selectedComponents[key];
                        return (
                             <label key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-purple-500/10 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => onComponentSelect(template, section)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-600 group-hover:border-purple-400'}`}>
                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                </div>
                                <span className="text-gray-300">{section}</span>
                            </label>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default TemplateCard;