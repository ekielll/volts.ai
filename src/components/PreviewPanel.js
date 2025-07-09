// /src/components/PreviewPanel.js

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Download, Code, Eye, Expand, CheckCircle } from 'lucide-react';

const PreviewPanel = ({
    previewCode,
    projectFiles,
    handleDownloadZip,
    setIsPreviewFullScreen,
    iframeRef,
    handleIframeLoad,
    selectedElement,
    isRuleEnabled,
    handleToggleLiveMarketing,
    isSubmittingRule
}) => {
    const [viewMode, setViewMode] = useState('preview');
    const [activeFile, setActiveFile] = useState('html');

    return (
        <div className="w-full h-full bg-black/10 p-4 flex flex-col">
            {selectedElement && (
                <div className="bg-gray-900/50 border border-white/10 p-3 flex justify-between items-center rounded-lg mb-4 shadow-lg z-10 flex-shrink-0">
                    <p className="text-sm text-white">
                        <span className="font-bold">Selected:</span>
                        <span className="ml-2 font-mono bg-gray-700 py-1 px-2 rounded-md text-purple-300">{selectedElement.tagName.toLowerCase()}#{selectedElement.id}</span>
                    </p>
                    <button onClick={handleToggleLiveMarketing} disabled={isSubmittingRule} className={`premium-button flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg font-premium text-sm transition-all duration-200 disabled:opacity-50 ${isRuleEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
                        {isRuleEnabled ? <CheckCircle size={18} /> : <span className="text-lg">⚡️</span>}
                        {isSubmittingRule ? 'Saving...' : (isRuleEnabled ? 'Marketing Enabled' : 'Enable Marketing')}
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                {projectFiles ? (
                    <div className="flex items-center gap-2 p-1 rounded-lg bg-gray-900/50 border border-white/10">
                        <button onClick={() => setViewMode('preview')} className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Eye className="w-4 h-4 inline-block mr-2" />Live Preview</button>
                        <button onClick={() => setViewMode('code')} className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'code' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Code className="w-4 h-4 inline-block mr-2" />View Code</button>
                    </div>
                ) : (
                    <h2 className="text-lg font-bold text-white font-premium">Live Preview</h2>
                )}
                {projectFiles ? (
                    <button onClick={handleDownloadZip} className="premium-button flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg font-premium text-sm"><Download size={16} />Download .zip</button>
                ) : (
                    <button onClick={() => setIsPreviewFullScreen(true)} className="p-2 text-gray-400 hover:text-white transition-colors" title="Full Screen Preview"><Expand size={20} /></button>
                )}
            </div>

            {viewMode === 'preview' ? (
                <div className="flex-grow bg-white rounded-lg border border-white/10 overflow-hidden shadow-inner">
                    <iframe ref={iframeRef} onLoad={handleIframeLoad} srcDoc={previewCode} title="Live Preview" className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin" />
                </div>
            ) : (
                <div className="flex-grow flex flex-col bg-[#1E1E1E] rounded-lg border border-white/10 overflow-hidden shadow-inner">
                    <div className="flex border-b border-white/10 flex-shrink-0">
                        <button onClick={() => setActiveFile('html')} className={`px-4 py-2 text-sm transition-colors ${activeFile === 'html' ? 'bg-gray-900/50 text-white' : 'text-gray-400 hover:bg-gray-900/20'}`}>index.html</button>
                        <button onClick={() => setActiveFile('css')} className={`px-4 py-2 text-sm transition-colors ${activeFile === 'css' ? 'bg-gray-900/50 text-white' : 'text-gray-400 hover:bg-gray-900/20'}`}>style.css</button>
                        <button onClick={() => setActiveFile('js')} className={`px-4 py-2 text-sm transition-colors ${activeFile === 'js' ? 'bg-gray-900/50 text-white' : 'text-gray-400 hover:bg-gray-900/20'}`}>script.js</button>
                    </div>
                    <div className="flex-grow overflow-auto">
                        <SyntaxHighlighter language={activeFile} style={vscDarkPlus} customStyle={{ margin: 0, height: '100%', background: '#1E1E1E' }} showLineNumbers>
                            {projectFiles ? projectFiles[activeFile] : ''}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewPanel;