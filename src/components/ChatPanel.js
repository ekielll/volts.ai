// /src/components/ChatPanel.js

import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, ImageIcon, Zap, BrainCircuit, Paintbrush, Loader2 } from 'lucide-react';

const thinkingMessages = [
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, text: "Zoltrak is powering up..." },
    { icon: <BrainCircuit className="w-5 h-5 text-purple-400" />, text: "The Architect is designing your layout..." },
    { icon: <Paintbrush className="w-5 h-5 text-blue-400" />, text: "The Designer is choosing a color palette..." },
];

const ChatPanel = ({
    chatHistory,
    isLoading,
    isThinking, // New prop for intelligent loading states
    showInitialButtons,
    onQuickReply,
    suggestions,
    onSuggestionClick,
    handleSendMessage,
    input,
    setInput,
    uploadedImage,
    handleFileChange,
    fileInputRef
}) => {
    const chatEndRef = useRef(null);
    const [currentThinkingMessage, setCurrentThinkingMessage] = useState(thinkingMessages[0]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, isLoading]);

    useEffect(() => {
        let interval;
        if (isThinking) { // Only cycle messages when "thinking"
            let index = 0;
            interval = setInterval(() => {
                index = (index + 1) % thinkingMessages.length;
                setCurrentThinkingMessage(thinkingMessages[index]);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isThinking]);

    return (
        <div className="w-full h-full bg-black/10 p-4 flex flex-col border-r border-white/10">
            <h2 className="text-lg font-bold mb-4 text-white font-premium flex-shrink-0">Chat with Zoltrak</h2>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.from === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0">
                                {/* This is Zoltrak's new profile picture */}
                            </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${msg.from === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' : 'bg-gray-700/80 text-gray-200 rounded-bl-none'}`}>
                            {msg.image && <img src={msg.image} alt="upload-preview" className="rounded-lg mb-2 max-h-40" />}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {showInitialButtons && !isLoading && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {['Website', 'Chatbot', 'Portfolio', 'E-commerce', 'Landing Page'].map(reply => (
                            <button key={reply} onClick={() => onQuickReply(reply)} className="bg-gray-700/50 hover:bg-purple-600/50 text-purple-200 font-medium py-1.5 px-3 rounded-full text-sm transition-all duration-300 border border-transparent hover:border-purple-400 font-premium">{reply}</button>
                        ))}
                    </div>
                )}

                {suggestions.length > 0 && !isLoading && (
                    <div className="pt-2">
                        <p className="text-xs text-gray-400 mb-2 font-premium">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button key={index} onClick={() => onSuggestionClick(suggestion)} className="bg-gray-700/50 hover:bg-purple-600/50 text-purple-200 font-medium py-1.5 px-3 rounded-full text-sm transition-all duration-300 border border-transparent hover:border-purple-400 font-premium">{suggestion}</button>
                            ))}
                        </div>
                    </div>
                )}
                
                {isLoading && (
                    <div className="flex items-end gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0"></div>
                        <div className="bg-gray-700/80 text-gray-200 rounded-2xl rounded-bl-none p-3 text-center">
                           {isThinking ? (
                                <>
                                    <div className="flex items-center gap-2 text-sm font-premium text-purple-300 mb-2">
                                        {currentThinkingMessage.icon}
                                        <p>{currentThinkingMessage.text}</p>
                                    </div>
                                    <div className="typing-indicator">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full inline-block"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full inline-block"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full inline-block"></span>
                                    </div>
                                </>
                           ) : (
                               <div className="flex items-center gap-2 text-sm text-gray-400">
                                   <Loader2 className="w-4 h-4 animate-spin"/>
                                   <span>Processing...</span>
                               </div>
                           )}
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex-shrink-0 flex items-center bg-gray-900/50 rounded-lg p-1 border border-white/10">
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