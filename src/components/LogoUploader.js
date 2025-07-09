// src/components/LogoUploader.js

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const LogoUploader = ({ logoType, user, refreshTrigger }) => { // FIXED: Accepting 'refreshTrigger' instead of 'key'
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogo = useCallback(async () => {
        setIsLoading(true);
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        const columnToSelect = logoType === 'light' ? 'logo_url_light' : 'logo_url_dark';
        try {
            const { data, error: fetchError } = await supabase
                .from('brand_assets')
                .select(columnToSelect)
                .eq('user_id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw new Error(fetchError.message);
            }

            if (data && data[columnToSelect]) {
                setPreview(data[columnToSelect]);
            } else {
                setPreview(null);
            }
        } catch (err) {
            console.error("Error fetching logo:", err);
            setError("Could not load existing logo.");
        } finally {
            setIsLoading(false);
        }
    }, [user, logoType]);

    // FIXED: useEffect now correctly depends on refreshTrigger
    useEffect(() => {
        fetchLogo();
    }, [fetchLogo, refreshTrigger]);

    const onDrop = useCallback(acceptedFiles => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/svg+xml': ['.svg'] },
        multiple: false,
    });

    const handleUpload = async () => {
        if (!file || !user) {
            setError('No file selected or user not logged in.');
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);
        formData.append('logoType', logoType);

        try {
            const response = await fetch('/api/uploadLogo', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Upload failed');
            }

            const result = await response.json();
            setPreview(result.url); 
            setFile(null); 
            alert('Logo uploaded successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!user || !preview) return;
        if (!window.confirm('Are you sure you want to remove this logo?')) return;
        
        setError(null);
        try {
             const response = await fetch('/api/deleteLogo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, logoType }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to remove logo');
            }
            setPreview(null);
            setFile(null);
        } catch(err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <div className="p-8 h-48 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div>
    }

    return (
        <div className="text-center">
            <div
                {...getRootProps()}
                className={`group relative p-8 h-48 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
                    ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'}`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <img src={preview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-12 h-12 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-500">PNG, JPG, SVG</p>
                    </div>
                )}
                {preview && !file && (
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                        className="absolute top-2 right-2 p-1.5 bg-gray-900/50 rounded-full text-gray-400 hover:bg-red-500/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove logo"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {file && (
                <div className="mt-4">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full premium-button font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isUploading ? 'Uploading...' : 'Save Logo'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default LogoUploader;