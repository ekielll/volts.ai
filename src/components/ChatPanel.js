// src/components/ChatPanel.js

import React, { useRef, useEffect } from 'react';
import { Paperclip, ImageIcon, Loader2 } from 'lucide-react';

// Remove Typewriter and thinkingMessages logic

const ChatPanel = ({
    chatHistory,
    isLoading,
    isThinking,
    showInitialButtons,
    onQuickReply,
    suggestions,
    onSuggestionClick,
    handleSendMessage,
    input,
    setInput,
    uploadedImage,
    handleFileChange,
    fileInputRef,
    onRemoveSuggestions // new prop
}) => {
    const chatEndRef = useRef(null);
    // Remove currentThinkingMessage state

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // Debug: Log chatHistory being rendered
        console.log('[DEBUG] ChatPanel rendering chatHistory:', chatHistory);
    }, [chatHistory, isLoading]);

    // Remove useEffect for thinking message animation

    // Remove if (isThinking) { console.log('[DEBUG] currentThinkingMessage:', currentThinkingMessage); }
    return (
        <div className="w-full h-full bg-black/10 p-4 flex flex-col border-r border-white/10">
            <h2 className="text-lg font-bold mb-4 text-white font-premium flex-shrink-0">Chat with Zoltrak</h2>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {chatHistory.map((msg, index) => {
                    // Fallback: Parse suggestions from text if not present as a property
                    let suggestions = msg.suggestions;
                    let displayText = msg.text;
                    if (!suggestions && typeof msg.text === 'string' && msg.text.includes('---[suggestions]---')) {
                        const match = msg.text.match(/---\[suggestions\]---\s*(\[.*?\])/s);
                        if (match && match[1]) {
                            try {
                                suggestions = JSON.parse(match[1]);
                            } catch (e) {
                                suggestions = [];
                            }
                        }
                        // Remove the suggestions block from the displayed text
                        displayText = msg.text.replace(/---\[suggestions\]---\s*\[.*?\]/s, '').trim();
                    }
                    return (
                        <div key={index} className={`flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-end gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.from === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 items-center justify-center flex self-start">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M12 12V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                )}
                                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${msg.from === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' : 'bg-gray-700/80 text-gray-200 rounded-bl-none'}`}>
                                    {msg.image && <img src={msg.image} alt="upload-preview" className="rounded-lg mb-2 max-h-40" />}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayText}</p>
                                </div>
                            </div>
                            {/* Inline suggestions for AI messages */}
                            {msg.from === 'ai' && suggestions && suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1 ml-12">
                                    {suggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onSuggestionClick(suggestion, index)}
                                            className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 font-medium py-1.5 px-3 rounded-full text-xs transition-all duration-300"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {showInitialButtons && !isLoading && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {['Website', 'Chatbot', 'Portfolio', 'E-commerce', 'Landing Page'].map(reply => (
                            <button key={reply} onClick={() => onQuickReply(reply)} className="bg-gray-700/50 hover:bg-purple-600/50 text-purple-200 font-medium py-1.5 px-3 rounded-full text-sm transition-all duration-300 border border-transparent hover:border-purple-400 font-premium">{reply}</button>
                        ))}
                    </div>
                )}
                
                {isLoading && isThinking && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 items-center justify-center flex">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 12V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-gray-700/80 text-gray-200 rounded-bl-none flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-sm font-premium text-purple-300">Zoltrak is thinking...</span>
                        </div>
                    </div>
                )}
                {isLoading && !isThinking && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0 items-center justify-center flex">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 12V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-gray-700/80 text-gray-200 rounded-bl-none flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-sm font-premium text-gray-400">Processing...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {!isLoading && suggestions && suggestions.length > 0 && (
                <div className="flex-shrink-0 pt-3 mb-2 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, i) => (
                            <button key={i} onClick={() => onSuggestionClick(suggestion)} className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 font-medium py-1.5 px-3 rounded-full text-xs transition-all duration-300">
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center bg-gray-900/50 rounded-lg p-1 border border-white/10">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current.click()} type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-grow flex items-center">
                    {uploadedImage && <ImageIcon className="text-purple-400 mx-2" size={20} />}
                    <input type="text" placeholder={uploadedImage ? "Image attached. Add a message..." : "Describe your idea..."} className="w-full bg-transparent focus:outline-none text-white px-2" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} />
                </div>
                <button type="submit" disabled={isLoading || (!input.trim() && !uploadedImage)} className="premium-button text-white p-2 rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;