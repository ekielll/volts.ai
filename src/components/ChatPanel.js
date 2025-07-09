// /src/components/ChatPanel.js

import React, { useRef, useEffect } from 'react';
import { Paperclip, ImageIcon } from 'lucide-react';

const ChatPanel = ({
    chatHistory,
    isLoading,
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
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [chatHistory, isLoading]);

    return (
        <div className="w-full h-full bg-black/10 p-4 flex flex-col border-r border-white/10">
            <h2 className="text-lg font-bold mb-4 text-white font-premium flex-shrink-0">Chat with Zoltrak</h2>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${msg.from === 'user' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none' : 'bg-gray-700/80 text-gray-200 rounded-bl-none'}`}>
                            {msg.image && <img src={msg.image} alt="upload-preview" className="rounded-lg mb-2 max-h-40" />}
                            {msg.text}
                        </div>
                    </div>
                ))}

                {showInitialButtons && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {['Website', 'Chatbot', 'Portfolio', 'E-commerce', 'Blog'].map(reply => (
                            <button key={reply} onClick={() => onQuickReply(reply)} className="bg-gray-700/50 hover:bg-purple-600/50 text-purple-200 font-medium py-1.5 px-3 rounded-full text-sm transition-all duration-300 border border-transparent hover:border-purple-400 font-premium">{reply}</button>
                        ))}
                    </div>
                )}

                {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {suggestions.map((suggestion, index) => (
                            <button key={index} onClick={() => onSuggestionClick(suggestion)} className="bg-gray-700/50 hover:bg-purple-600/50 text-purple-200 font-medium py-1.5 px-3 rounded-full text-sm transition-all duration-300 border border-transparent hover:border-purple-400 font-premium">{suggestion}</button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700/80 text-gray-200 rounded-2xl rounded-bl-none p-3 text-center">
                            <p className="text-sm font-premium text-purple-300 mb-2">Zoltrak is thinking...</p>
                            <div className="typing-indicator">
                                <span className="w-2 h-2 bg-purple-400 rounded-full inline-block"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full inline-block"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full inline-block"></span>
                            </div>
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