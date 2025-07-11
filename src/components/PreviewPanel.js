// /src/components/PreviewPanel.js

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// NEW: Imported Lightbulb icon for the critique feature
import { Download, Code, Eye, Expand, CheckCircle, Edit, Sparkles, Monitor, Tablet, Smartphone, Undo, Redo, Image as ImageIcon, Lightbulb } from 'lucide-react';

const PreviewPanel = ({
    previewCode,
    projectFiles,
    handleDownloadZip,
    setIsPreviewFullScreen,
    iframeRef,
    handleIframeLoad,
    selectedElement,
    handleToggleLiveMarketing,
    isSubmittingRule,
    onOpenVisualCopilot,
    getRuleStatus,
    previewMode,
    setPreviewMode,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    // NEW: Added onCritique handler
    onCritique,
}) => {
    const [viewMode, setViewMode] = useState('preview');
    const [activeFile, setActiveFile] = useState('html');

    const isRuleEnabled = selectedElement ? getRuleStatus(selectedElement.id) : false;
    
    const previewWidth = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
    }[previewMode];

    return (
        <div className="w-full h-full bg-black/10 p-4 flex flex-col">
            {selectedElement && (
                <div className="absolute top-24 right-8 bg-gray-900/50 backdrop-blur-lg border border-white/10 p-3 rounded-lg shadow-2xl z-20 flex flex-col gap-2 animate-fade-in-fast w-52 visual-copilot-menu">
                    <p className="text-xs text-center text-gray-400 border-b border-white/10 pb-2 mb-1">
                        Selected: <span className="font-bold text-purple-300">{selectedElement.tagName.toLowerCase()}#{selectedElement.id}</span>
                    </p>
                    <button onClick={() => onOpenVisualCopilot('edit-text', selectedElement)} className="flex items-center gap-3 w-full text-left p-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors">
                        <Edit size={16} /> Edit Text
                    </button>
                    {selectedElement.tagName === 'IMG' && (
                        <button onClick={() => onOpenVisualCopilot('change-image', selectedElement)} className="flex items-center gap-3 w-full text-left p-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors">
                            <ImageIcon size={16} /> Change Image
                        </button>
                    )}
                    <button onClick={() => onOpenVisualCopilot('ask-zoltrak', selectedElement)} className="flex items-center gap-3 w-full text-left p-2 rounded-md text-sm text-white hover:bg-white/10 transition-colors">
                        <Sparkles size={16} /> Ask Zoltrak
                    </button>
                     <hr className="border-white/10 my-1"/>
                    <button 
                        onClick={() => handleToggleLiveMarketing(selectedElement)} 
                        disabled={isSubmittingRule} 
                        className={`flex items-center gap-3 w-full text-left p-2 rounded-md text-sm transition-all duration-200 disabled:opacity-50 ${isRuleEnabled ? 'text-green-400 hover:bg-green-500/10' : 'text-yellow-400 hover:bg-yellow-500/10'}`}
                    >
                        {isRuleEnabled ? <CheckCircle size={16} /> : <span className="text-lg leading-none">⚡️</span>}
                        {isSubmittingRule ? 'Saving...' : (isRuleEnabled ? 'Marketing Enabled' : 'Enable Marketing')}
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    {viewMode === 'preview' && (
                        <>
                            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-900/50 border border-white/10">
                                 <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Monitor size={18} /></button>
                                 <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded-md transition-colors ${previewMode === 'tablet' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Tablet size={18} /></button>
                                 <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Smartphone size={18} /></button>
                            </div>
                            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-900/50 border border-white/10">
                                <button onClick={onUndo} disabled={!canUndo} className="p-2 rounded-md transition-colors text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"><Undo size={18} /></button>
                                <button onClick={onRedo} disabled={!canRedo} className="p-2 rounded-md transition-colors text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"><Redo size={18} /></button>
                            </div>
                            {/* NEW: Critique button added to the toolbar */}
                             <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-900/50 border border-white/10">
                                <button onClick={onCritique} className="p-2 rounded-md transition-colors text-gray-400 hover:text-white" title="Critique Design">
                                    <Lightbulb size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {projectFiles ? (
                        <div className="flex items-center gap-2 p-1 rounded-lg bg-gray-900/50 border border-white/10">
                            <button onClick={() => setViewMode('preview')} className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Eye className="w-4 h-4 inline-block mr-2" />Preview</button>
                            <button onClick={() => setViewMode('code')} className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === 'code' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}><Code className="w-4 h-4 inline-block mr-2" />Code</button>
                        </div>
                    ) : (
                         <button onClick={() => setIsPreviewFullScreen(true)} className="p-2 text-gray-400 hover:text-white transition-colors" title="Full Screen Preview"><Expand size={20} /></button>
                    )}
                    {projectFiles && (
                        <button onClick={handleDownloadZip} className="premium-button flex items-center gap-2 text-white font-bold py-2 px-4 rounded-lg font-premium text-sm"><Download size={16} />Download .zip</button>
                    )}
                </div>
            </div>

            {viewMode === 'preview' ? (
                <div className="flex-grow flex justify-center items-center bg-gray-900/10 rounded-lg border border-white/5 p-4 transition-all duration-300 ease-in-out">
                    <div className="h-full bg-white rounded-md shadow-2xl transition-all duration-500 ease-in-out" style={{ width: previewWidth }}>
                        <iframe ref={iframeRef} onLoad={handleIframeLoad} srcDoc={previewCode} title="Live Preview" className="w-full h-full border-0 rounded-md" sandbox="allow-scripts allow-same-origin" />
                    </div>
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