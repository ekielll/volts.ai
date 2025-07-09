// src/components/TemplateCard.js

import React from 'react';
import { Plus, Eye } from 'lucide-react';

const TemplateCard = ({ name, description, imageUrl, onSelect, onPreview, isSelected }) => {
    return (
        <div className="group relative rounded-xl overflow-hidden glass-card border border-white/10 aspect-[3/4]">
            <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            
            {/* Overlay for buttons and text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
                <div className="p-6">
                    <h3 className="text-2xl font-bold font-premium text-white">{name}</h3>
                    <p className="text-gray-300">{description}</p>
                </div>
            </div>

            {/* Buttons that appear on hover */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                    onClick={onPreview}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white font-bold py-3 px-6 rounded-lg hover:bg-white/30 transition-colors"
                >
                    <Eye size={20} /> Preview
                </button>
                <button
                    onClick={onSelect}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'bg-green-500 text-white' : 'bg-black/40 text-gray-200 backdrop-blur-sm hover:bg-purple-600 hover:text-white'}`}
                    title={isSelected ? "Remove from Canvas" : "Add to Creation Canvas"}
                >
                    <Plus className={`transition-transform duration-300 ${isSelected ? 'rotate-45' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default TemplateCard;