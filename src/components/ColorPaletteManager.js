// src/components/ColorPaletteManager.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import { ChromePicker } from 'react-color';
import { Plus, X, Loader2, Check, Save } from 'lucide-react';

const ColorPaletteManager = ({ refreshTrigger }) => {
    const examplePalettes = [
        { name: 'Retro Warmth', colors: ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653'] },
        { name: 'Cool Blues', colors: ['#ade8f4', '#48cae4', '#0096c7', '#0077b6', '#023e8a'] },
        { name: 'Earthy Tones', colors: ['#cb997e', '#ddbea9', '#ffe8d6', '#b7b7a4', '#6b705c'] },
        { name: 'Vibrant & Bold', colors: ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d'] },
    ];

    const [palette, setPalette] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState('#ffffff');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const { user } = useAuth();

    const fetchPalette = useCallback(async () => {
        if (!user) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const { data, error } = await supabase.from('brand_assets').select('color_palette').eq('user_id', user.id).single();
            if (error && error.code !== 'PGRST116') throw error;
            if (data && Array.isArray(data.color_palette)) {
                setPalette(data.color_palette);
            } else {
                setPalette([]);
            }
        } catch (err) {
            console.error("Error fetching palette: ", err);
        } finally {
            setIsLoading(false);
            setIsDirty(false);
        }
    }, [user]);

    useEffect(() => { fetchPalette(); }, [fetchPalette, refreshTrigger]);

    const handleAddColor = () => {
        if (palette.length < 8 && !palette.includes(currentColor)) {
            setPalette([...palette, currentColor]);
            setIsDirty(true);
        }
        setShowPicker(false);
    };

    const removeColor = (colorToRemove) => {
        setPalette(palette.filter(color => color !== colorToRemove));
        setIsDirty(true);
    };

    const handleSavePalette = async () => {
        if (!user) return alert('You must be logged in to save.');

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('brand_assets')
                .upsert({ user_id: user.id, color_palette: palette }, { onConflict: 'user_id' });

            if (error) throw error;
            setIsDirty(false);
            alert("Palette Saved!");
        } catch (error) {
            console.error('Save failed:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const applyExamplePalette = (colors) => {
        setPalette(colors.slice(0, 8));
        setIsDirty(true);
    };

    if (isLoading) {
        return <div className="text-center py-12 flex items-center justify-center gap-3 text-gray-500"><Loader2 className="w-6 h-6 animate-spin" />Loading Palette...</div>
    }

    return (
        <>
            <div className="bg-gray-800/50 p-6 rounded-xl">
                {/* FIXED: Main container is now a flexbox to align items */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap items-center gap-3">
                        {palette.map((color, index) => (
                            <div key={index} className="relative group">
                                {/* FIXED: Reduced swatch size */}
                                <div className="w-12 h-12 rounded-lg border-2 border-white/20" style={{ backgroundColor: color }}></div>
                                <button onClick={() => removeColor(color)} className="absolute -top-2 -right-2 p-1 bg-gray-700 rounded-full text-gray-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {palette.length < 8 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowPicker(!showPicker)}
                                    // FIXED: Reduced add button size
                                    className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-purple-500 transition-colors"
                                >
                                    <Plus className="text-gray-500" />
                                </button>
                                {showPicker && (
                                    <div className="absolute top-full mt-2 z-10 p-2 bg-gray-700 rounded-lg shadow-lg">
                                        <div className="absolute -top-1 right-2 cursor-pointer" onClick={() => setShowPicker(false)}>
                                            <X size={18} className="text-gray-400 hover:text-white" />
                                        </div>
                                        <ChromePicker disableAlpha={true} color={currentColor} onChange={(color) => setCurrentColor(color.hex)} />
                                        <button onClick={handleAddColor} className="w-full bg-purple-600 text-white font-bold py-2 mt-2 rounded-md">Add Color</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* FIXED: Save button is now a direct flex child, no extra margin */}
                    {palette.length > 0 && (
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleSavePalette}
                                disabled={isSaving || !isDirty}
                                className="premium-button font-bold py-2 px-6 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                    !isDirty ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                {isSaving ? 'Saving...' : !isDirty ? 'Saved' : 'Save Palette'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <p className="text-sm text-gray-400 mb-3 font-premium">Or start with a curated palette:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {examplePalettes.map(example => (
                        <div key={example.name} onClick={() => applyExamplePalette(example.colors)} className="cursor-pointer group">
                            {/* FIXED: Reduced example palette height */}
                            <div className="flex h-10 rounded-lg overflow-hidden border border-transparent group-hover:border-purple-500 transition-all duration-300 group-hover:scale-105">
                                {example.colors.map(color => (
                                    <div key={color} className="w-full h-full" style={{ backgroundColor: color }}></div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 group-hover:text-white mt-1.5 transition-colors">{example.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ColorPaletteManager;