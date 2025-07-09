// src/components/FileUpload.js

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, XCircle } from 'lucide-react';
import { useAuth } from '../AuthContext'; // Import useAuth to get the user ID

const FileUpload = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const { user } = useAuth(); // Get the current user

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prevFiles => {
            const newFiles = acceptedFiles.filter(
                newFile => !prevFiles.some(prevFile => prevFile.path === newFile.path)
            );
            return [...prevFiles, ...newFiles];
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        }
    });

    const removeFile = (filePath) => {
        setFiles(files.filter(file => file.path !== filePath));
    };

    const handleUpload = async () => {
        if (files.length === 0 || !user) {
            if (!user) alert("Please make sure you are logged in.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        // Use Promise.all to handle all file uploads concurrently
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', user.id);

            return fetch('/api/uploadToKnowledgeBase', {
                method: 'POST',
                body: formData,
            });
        });

        try {
            const responses = await Promise.all(uploadPromises);
            
            // Check if any of the uploads failed
            const failedUploads = responses.filter(res => !res.ok);
            if (failedUploads.length > 0) {
                const errorData = await failedUploads[0].json();
                throw new Error(errorData.details || 'An error occurred during upload.');
            }

            setIsUploading(false);
            onUploadSuccess(files.map(f => f.name));
            setFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError(error.message);
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
                    ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                    <UploadCloud className="w-16 h-16 text-gray-500 mb-4" />
                    {isDragActive ? (
                        <p className="text-xl font-semibold text-purple-400">Drop the files here ...</p>
                    ) : (
                        <p className="text-xl font-semibold text-gray-300">Drag & drop files here, or click to select</p>
                    )}
                    <p className="text-gray-500 mt-2">Supports: TXT, PDF, DOC, DOCX</p>
                </div>
            </div>

            {uploadError && (
                <div className="mt-4 text-center text-red-400 bg-red-500/10 p-3 rounded-lg">
                    <p>Upload Failed: {uploadError}</p>
                </div>
            )}

            {files.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Files to Upload:</h3>
                    <ul className="space-y-3">
                        {files.map(file => (
                            <li key={file.path} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">{file.name}</span>
                                    <span className="text-sm text-gray-500">- {(file.size / 1024).toFixed(2)} KB</span>
                                </div>
                                <button onClick={() => removeFile(file.path)} className="p-1 text-gray-500 hover:text-red-500 transition-colors">
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex justify-end gap-4">
                        <button onClick={() => setFiles([])} className="font-bold py-3 px-6 rounded-lg hover:bg-white/10 transition-colors">
                            Clear All
                        </button>
                        <button onClick={handleUpload} disabled={isUploading} className="premium-button font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;