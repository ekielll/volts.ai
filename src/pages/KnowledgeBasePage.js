// src/pages/KnowledgeBasePage.js

import React, { useState, useEffect, useCallback } from 'react';
import Taskbar from '../components/Taskbar';
import AppHeader from '../components/AppHeader';
import FileUpload from '../components/FileUpload';
import { useAuth } from '../AuthContext';
import { FileText, Trash2, Loader2 } from 'lucide-react';

const KnowledgeBasePage = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDocuments = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/getKnowledgeBaseFiles?userId=${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch documents.');
            }
            const data = await response.json();
            setDocuments(data);
        } catch (error) {
            console.error(error);
            alert('Error fetching documents.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);
    
    const handleUploadSuccess = () => {
        // Refresh the document list after a successful upload
        fetchDocuments();
    };

    const handleDelete = async (chunkId) => {
        if (!window.confirm('Are you sure you want to delete this document chunk? This cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch('/api/deleteKnowledgeBaseFile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, chunkId: chunkId }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete document chunk.');
            }
            // Refresh the list after deleting
            fetchDocuments();
        } catch (error) {
            console.error(error);
            alert('Error deleting document.');
        }
    };

    return (
        <div className="flex">
            <Taskbar />
            <main className="flex-grow pl-20">
                <div className='w-full min-h-screen bg-gray-900'>
                    <AppHeader />
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold font-elegant">Custom Knowledge Base</h1>
                            <p className="text-gray-400 mt-2 text-lg">
                                Upload documents to create a knowledge base tailored to your needs. Zoltrak will use this information to provide more accurate and context-aware responses.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 border border-dashed border-gray-600 rounded-xl p-8">
                            <FileUpload onUploadSuccess={handleUploadSuccess} />
                        </div>

                        <div className="mt-16">
                            <h2 className="text-3xl font-bold font-elegant mb-6">Your Documents</h2>
                            {isLoading ? (
                                <div className="text-center py-12 flex items-center justify-center gap-3">
                                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                                    <span className="text-gray-500">Loading documents...</span>
                                </div>
                            ) : documents.length > 0 ? (
                                <ul className="space-y-4">
                                    {documents.map(doc => (
                                        <li key={doc.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <FileText className="w-6 h-6 text-purple-400 flex-shrink-0" />
                                                <div className="flex-grow">
                                                    <p className="font-medium text-white truncate max-w-2xl">
                                                        {doc.content}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Added: {new Date(doc.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-500 rounded-full hover:bg-red-500/10 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
                                    <p className="text-gray-500">Your uploaded documents will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default KnowledgeBasePage;