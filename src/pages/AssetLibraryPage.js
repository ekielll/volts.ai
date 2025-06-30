// src/pages/AssetLibraryPage.js

import React, { useState } from 'react';
import Taskbar from '../components/Taskbar';
import AppHeader from '../components/AppHeader';
import LogoUploader from '../components/LogoUploader';
import ColorPaletteManager from '../components/ColorPaletteManager';
import FontManager from '../components/FontManager';
import { useAuth } from '../AuthContext';
import { Telescope, Loader2 } from 'lucide-react';

const BrandSonar = ({ onScanComplete }) => {
    const [url, setUrl] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const handleScan = async () => {
        if (!url || !user) {
            setError("Please enter a valid URL.");
            return;
        }
        setIsScanning(true);
        setError(null);
        try {
            const response = await fetch('/api/scan-brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || "Failed to scan the website's brand.");
            }
            alert("Brand Sonar scan complete! Your assets have been updated.");
            if (onScanComplete) {
                onScanComplete();
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
                <Telescope className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold font-premium">Brand Sonar</h2>
            </div>
            <p className="text-gray-400 mb-4">
                Enter your website URL and let Zoltrak automatically detect your brand's colors and fonts.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 items-start">
                <div className="flex-grow w-full">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://your-website.com"
                        className="w-full p-2 bg-gray-900/50 border-2 border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors text-white font-premium"
                    />
                    <p className="text-xs text-gray-500 mt-1.5 ml-1">e.g., https://www.yourwebsite.com</p>
                </div>
                <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="premium-button font-bold py-2 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    {isScanning && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isScanning ? 'Scanning...' : 'Scan'}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>
    );
}

const AssetLibraryPage = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleScanComplete = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <div className="flex bg-gray-900 text-white">
            <Taskbar />
            <main className="flex-grow pl-20 min-h-screen">
                <AppHeader />
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold font-elegant">Asset Library</h1>
                        <p className="text-gray-400 mt-2 text-lg">
                            Manage your brand assets for Zoltrak to use across your projects.
                        </p>
                    </div>

                    {/* FIXED: Reduced vertical spacing between sections from space-y-16 to space-y-12 */}
                    <div className="space-y-12">
                        <BrandSonar onScanComplete={handleScanComplete} />

                        {/* FIXED: Consolidated Logos, Palette, and Fonts into a single management card for a cleaner look */}
                        <div className="glass-card p-6 sm:p-8 rounded-xl space-y-10">
                            <div>
                                <h2 className="text-2xl font-bold font-premium mb-4">Brand Logos</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gray-800/50 p-6 rounded-xl">
                                        <h3 className="font-semibold text-lg mb-4">Logo for Dark Backgrounds</h3>
                                        <LogoUploader logoType="dark" user={user} key={`dark-logo-${refreshKey}`} refreshTrigger={refreshKey} />
                                    </div>
                                    <div className="bg-gray-800/50 p-6 rounded-xl">
                                        <h3 className="font-semibold text-lg mb-4">Logo for Light Backgrounds</h3>
                                        <LogoUploader logoType="light" user={user} key={`light-logo-${refreshKey}`} refreshTrigger={refreshKey} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div>
                                <h2 className="text-2xl font-bold font-premium mb-4">Color Palette</h2>
                                <ColorPaletteManager key={`colors-${refreshKey}`} refreshTrigger={refreshKey} />
                            </div>

                            <hr className="border-white/10" />

                            <div>
                                <h2 className="text-2xl font-bold font-premium mb-4">Brand Fonts</h2>
                                <FontManager key={`fonts-${refreshKey}`} refreshTrigger={refreshKey} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssetLibraryPage;