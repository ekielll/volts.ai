// src/components/FontManager.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import { Loader2, ChevronDown, Check } from 'lucide-react';

const CustomFontSelect = ({ label, options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left p-3 bg-gray-900/50 border-2 border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors font-premium"
            >
                <span>{selectedValue}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 border border-white/10 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {options.map(font => (
                        <div
                            key={font.name}
                            onClick={() => {
                                onSelect(font.name);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-white hover:bg-purple-600/50 cursor-pointer font-premium text-sm"
                            style={{ fontFamily: font.name }}
                        >
                            {font.name} <span className="text-gray-400 text-xs">({font.type})</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FontManager = ({ refreshTrigger }) => { // FIXED: Accepting 'refreshTrigger' instead of 'key'
    const [availableFonts] = useState([
        { name: 'Playfair Display', type: 'serif' },
        { name: 'Lora', type: 'serif' },
        { name: 'Merriweather', type: 'serif' },
        { name: 'Inter', type: 'sans-serif' },
        { name: 'Sora', type: 'sans-serif' },
        { name: 'Poppins', type: 'sans-serif' },
        { name: 'Montserrat', type: 'sans-serif' },
        { name: 'Roboto', type: 'sans-serif' },
    ]);

    const [headingFont, setHeadingFont] = useState('Playfair Display');
    const [bodyFont, setBodyFont] = useState('Sora');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const { user } = useAuth();

    const fetchFonts = useCallback(async () => {
        if (!user) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('brand_assets').select('font_pair').eq('user_id', user.id).single();
            if (error && error.code !== 'PGRST116') throw error;
            if (data && data.font_pair) {
                setHeadingFont(data.font_pair.heading);
                setBodyFont(data.font_pair.body);
            }
        } catch(err) {
             console.error("Error fetching fonts: ", err);
        } finally {
            setIsLoading(false);
            setIsDirty(false);
        }
    }, [user]);

    // FIXED: useEffect now correctly depends on refreshTrigger
    useEffect(() => { fetchFonts(); }, [fetchFonts, refreshTrigger]);

    const handleSaveFonts = async () => {
        if (!user) return alert('You must be logged in to save.');
        
        setIsSaving(true);
        try {
            const fontPair = { heading: headingFont, body: bodyFont };
            const response = await fetch('/api/updateFontPair', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, fontPair }),
            });
            if (!response.ok) { throw new Error((await response.json()).details || 'Failed to save fonts.'); }
            setIsDirty(false);
        } catch (error) {
            console.error('Save failed:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleHeadingChange = (value) => {
        setHeadingFont(value);
        setIsDirty(true);
    };

    const handleBodyChange = (value) => {
        setBodyFont(value);
        setIsDirty(true);
    };

    if (isLoading) {
        return <div className="text-center py-12 flex items-center justify-center gap-3 text-gray-500"><Loader2 className="w-6 h-6 animate-spin" />Loading Fonts...</div>
    }

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFontSelect label="Heading Font" options={availableFonts} selectedValue={headingFont} onSelect={handleHeadingChange} />
                <CustomFontSelect label="Body Font" options={availableFonts} selectedValue={bodyFont} onSelect={handleBodyChange} />
            </div>
             <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSaveFonts}
                    disabled={isSaving || !isDirty}
                    className="premium-button font-bold py-2 px-6 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                     !isDirty ? <Check className="w-5 h-5" /> : null}
                    {isSaving ? 'Saving...' : !isDirty ? 'Saved' : 'Save Fonts'}
                </button>
            </div>
        </div>
    );
};

export default FontManager;