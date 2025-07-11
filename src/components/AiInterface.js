// /src/components/AiInterface.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { supabase } from '../supabaseClient';
import { useProjectContext } from '../ProjectContext';
import { useAuth } from '../AuthContext';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import * as cheerio from 'cheerio';
import { X, Link, CornerDownLeft, Image as ImageIcon } from 'lucide-react';

const AiInterface = ({ isDemo = false, isFullScreen = false, onNewMessage, profile, project }) => {
    // --- CONTEXT STATE ---
    const { user } = useAuth();
    const {
        activeProject,
        addMessageToHistory,
        updateActiveProject,
        updatePreviewCode
    } = useProjectContext();

    // --- TEMPLATES ---
    const initialWebsitePreview = `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
            <title>Your Professional Website</title>
        </head>
        <body class="bg-gray-900 text-white">
            <nav class="bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
                <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div id="logo" class="font-bold text-xl">YourLogo</div>
                    <ul class="flex gap-8">
                        <li><a href="#hero" id="nav-home" class="hover:text-purple-400 transition-colors">Home</a></li>
                        <li><a href="#services" id="nav-services" class="hover:text-purple-400 transition-colors">Services</a></li>
                        <li><a href="#about" id="nav-about" class="hover:text-purple-400 transition-colors">About</a></li>
                        <li><a href="#contact" id="nav-contact" class="hover:text-purple-400 transition-colors">Contact</a></li>
                    </ul>
                </div>
            </nav>
            <header id="hero" class="container mx-auto px-6 py-24 text-center">
                <h1 id="main-headline" class="text-5xl md:text-7xl font-bold leading-tight">Build Your Digital Presence</h1>
                <p id="sub-headline" class="text-xl text-gray-400 mt-4 max-w-3xl mx-auto">We create stunning websites that captivate and convert. Let's build your success story together.</p>
                <button id="cta-button" class="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold transition-transform duration-300 hover:scale-105">Get a Free Quote</button>
            </header>
            <section id="services" class="py-20 bg-gray-800">
                <div class="container mx-auto px-6 text-center">
                    <h2 class="text-4xl font-bold mb-12">Our Services</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-gray-900 p-8 rounded-xl shadow-lg">
                            <h3 class="text-2xl font-bold mb-4">Web Design</h3>
                            <p class="text-gray-400">Crafting beautiful and intuitive user interfaces that delight your visitors.</p>
                        </div>
                        <div class="bg-gray-900 p-8 rounded-xl shadow-lg">
                            <h3 class="text-2xl font-bold mb-4">Development</h3>
                            <p class="text-gray-400">Building robust and scalable web applications tailored to your specific needs.</p>
                        </div>
                        <div class="bg-gray-900 p-8 rounded-xl shadow-lg">
                            <h3 class="text-2xl font-bold mb-4">SEO</h3>
                            <p class="text-gray-400">Optimizing your site to rank higher on search engines and attract more traffic.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="about" class="py-20">
                <div class="container mx-auto px-6 text-center">
                       <h2 class="text-4xl font-bold mb-4">What Our Clients Say</h2>
                       <blockquote class="max-w-3xl mx-auto mt-8">
                            <p class="text-2xl italic text-gray-300">"Working with them was a game-changer. Our engagement metrics have skyrocketed!"</p>
                            <cite class="block text-right not-italic text-purple-400 mt-4">- Jane Doe, CEO of Awesome Inc.</cite>
                       </blockquote>
                </div>
            </section>
            <footer id="contact" class="bg-gray-800 py-10">
                <div class="container mx-auto px-6 text-center text-gray-400">
                    <p>&copy; 2025 Your Company. All Rights Reserved.</p>
                </div>
            </footer>
        </body>
        </html>`;

    const initialPortfolioPreview = `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
            <title>Your Portfolio</title>
        </head>
        <body class="bg-gray-900 text-white">
            <section id="hero" class="h-screen flex items-center justify-center text-center bg-gradient-to-br from-gray-900 to-purple-900/50">
                <div>
                    <h1 id="portfolio-name" class="text-7xl font-bold">Your Name</h1>
                    <p id="portfolio-title" class="text-2xl text-purple-400 mt-2">Your Professional Title (e.g. Virtual Assistant)</p>
                </div>
            </section>
            <section id="work" class="py-20">
                <div class="container mx-auto px-6">
                    <h2 id="work-title" class="text-4xl font-bold text-center mb-12">My Work</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div id="work-item-1" class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div id="work-item-2" class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div id="work-item-3" class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div id="work-item-4" class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div id="work-item-5" class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                        <div id="work-item-6" class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    </div>
                </div>
            </section>
            <section id="about" class="py-20 bg-gray-800">
                <div class="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                    <div class="md:w-1/3 flex justify-center">
                        <img id="about-headshot" src="https://placehold.co/256x256/7c3aed/ffffff?text=Your\nHeadshot" alt="Headshot" class="w-64 h-64 rounded-full object-cover">
                    </div>
                    <div class="md:w-2/3 text-center md:text-left">
                        <h2 id="about-title" class="text-4xl font-bold mb-4">About Me</h2>
                        <p id="portfolio-bio" class="text-gray-400 text-lg">I'm a passionate and dedicated professional with a knack for creating amazing things. My experience lies in [Your Skill 1], [Your Skill 2], and [Your Skill 3]. Let's create something incredible together.</p>
                    </div>
                </div>
            </section>
            <footer id="contact" class="bg-gray-900 py-10 text-center text-gray-400">
                <p>Get in touch: <a id="contact-email" href="mailto:email@example.com" class="text-purple-400">email@example.com</a></p>
            </footer>
        </body>
        </html>`;
        
    const initialEcommercePreview = `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
            <title>Your Store</title>
        </head>
        <body class="bg-gray-100">
            <div class="bg-purple-600 text-white text-center py-2 text-sm">
                <p>Free Shipping On All Orders Over $50</p>
            </div>
            <nav class="bg-white shadow-md sticky top-0 z-50">
                <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div id="logo" class="font-bold text-xl text-gray-800">YourStore</div>
                    <ul class="flex gap-8 text-gray-600">
                        <li><a href="#products" class="hover:text-purple-600 transition-colors">Products</a></li>
                        <li><a href="#" class="hover:text-purple-600 transition-colors">About</a></li>
                        <li><a href="#" class="hover:text-purple-600 transition-colors">Contact</a></li>
                    </ul>
                </div>
            </nav>
            <header class="bg-gray-200">
                <div class="container mx-auto px-6 py-20 text-center">
                    <h1 class="text-5xl font-bold text-gray-800">Summer Collection is Here</h1>
                    <p class="text-gray-600 mt-4">Discover the latest trends and refresh your style.</p>
                    <button class="mt-8 px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors">Shop Now</button>
                </div>
            </header>
            <main id="products" class="py-20">
                <div class="container mx-auto px-6">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Featured Products</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div class="bg-gray-300 h-56 w-full"></div>
                            <div class="p-6">
                                <h3 class="font-bold text-gray-800">Product Name</h3>
                                <p class="text-gray-600 mt-2">$99.99</p>
                                <button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div class="bg-gray-300 h-56 w-full"></div>
                            <div class="p-6">
                                <h3 class="font-bold text-gray-800">Product Name</h3>
                                <p class="text-gray-600 mt-2">$99.99</p>
                                <button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div class="bg-gray-300 h-56 w-full"></div>
                            <div class="p-6">
                                <h3 class="font-bold text-gray-800">Product Name</h3>
                                <p class="text-gray-600 mt-2">$99.99</p>
                                <button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div class="bg-gray-300 h-56 w-full"></div>
                            <div class="p-6">
                                <h3 class="font-bold text-gray-800">Product Name</h3>
                                <p class="text-gray-600 mt-2">$99.99</p>
                                <button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="bg-gray-800 text-white py-10">
                <div class="container mx-auto text-center"><p>&copy; 2025 YourStore. All Rights Reserved.</p></div>
            </footer>
        </body>
        </html>`;

    const initialBlogPreview = `
        <!DOCTYPE html>
        <html lang="en" class="scroll-smooth">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; } .font-serif { font-family: 'Lora', serif; }</style>
            <title>Your Awesome Blog</title>
        </head>
        <body class="bg-gray-100 text-gray-800">
            <header class="bg-white border-b py-6">
                <div class="container mx-auto px-6 text-center">
                    <h1 id="blog-title" class="text-5xl font-bold">The Daily Chronicle</h1>
                    <p id="blog-subtitle" class="text-gray-500 mt-2">Your daily dose of insights and inspiration.</p>
                </div>
            </header>
            <div class="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <main class="lg:col-span-2">
                    <article class="mb-12">
                        <div class="bg-gray-300 w-full h-80 rounded-lg mb-6"></div>
                        <h2 class="text-4xl font-bold mb-3">Featured Post: Getting Started with AI</h2>
                        <p class="text-gray-500 mb-4">Posted on July 9, 2025</p>
                        <div class="font-serif text-lg leading-relaxed space-y-4">
                            <p>This is an excerpt of your first featured blog post. It's designed for maximum readability and impact, drawing the reader in from the very first sentence...</p>
                        </div>
                        <a href="#" class="text-purple-600 font-bold mt-4 inline-block">Read More &rarr;</a>
                    </article>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <article>
                            <div class="bg-gray-300 w-full h-56 rounded-lg mb-4"></div>
                            <h3 class="text-2xl font-bold mb-2">Previous Post Title</h3>
                            <p class="text-gray-600 font-serif">A short and catchy excerpt for another one of your amazing articles goes right here...</p>
                            <a href="#" class="text-purple-600 font-bold mt-2 inline-block">Read More &rarr;</a>
                        </article>
                        <article>
                            <div class="bg-gray-300 w-full h-56 rounded-lg mb-4"></div>
                            <h3 class="text-2xl font-bold mb-2">Previous Post Title</h3>
                            <p class="text-gray-600 font-serif">A short and catchy excerpt for another one of your amazing articles goes right here...</p>
                            <a href="#" class="text-purple-600 font-bold mt-2 inline-block">Read More &rarr;</a>
                        </article>
                    </div>
                </main>
                <aside class="lg:col-span-1">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="font-bold text-xl mb-4">About the Author</h3>
                        <p class="text-gray-600">A short bio about yourself or your publication. Let your readers know who is behind the words.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md mt-8">
                        <h3 class="font-bold text-xl mb-4">Categories</h3>
                        <ul class="space-y-2 text-purple-600">
                            <li><a href="#" class="hover:underline">Technology</a></li>
                            <li><a href="#" class="hover:underline">Productivity</a></li>
                            <li><a href="#" class="hover:underline">Design</a></li>
                            <li><a href="#" class="hover:underline">Personal Growth</a></li>
                        </ul>
                    </div>
                </aside>
            </div>
            <footer class="bg-gray-800 text-white text-center py-10">
                <p>&copy; 2025 Your Blog. All Rights Reserved.</p>
            </footer>
        </body>
        </html>`;

    const initialChatbotPreview = `
        <!DOCTYPE html>
        <html class="h-full">
        <head>
            <meta charset="UTF-8">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
            <style>body { font-family: 'Poppins', sans-serif; }</style>
        </head>
        <body class="h-full bg-gray-800 p-10 flex items-center justify-center">
            <div class="w-full max-w-sm h-[70vh] flex flex-col bg-gray-900 shadow-2xl border border-white/10 rounded-2xl">
                <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M20 12h-4"/><path d="m15 17-3-3 3-3"/></svg>
                        </div>
                        <div>
                            <h3 id="chatbot-name" class="font-bold text-white text-lg">Your Assistant</h3>
                            <p id="chatbot-status" class="text-xs text-purple-200">Online</p>
                        </div>
                    </div>
                </div>
                <div class="flex-grow p-4 space-y-4 overflow-y-auto">
                    <div class="flex justify-start">
                        <div class="bg-gray-700 text-white py-2 px-4 rounded-2xl rounded-bl-none max-w-xs shadow-md">Hello! How can I help you build your site today?</div>
                    </div>
                    <div class="flex justify-end">
                        <div class="bg-blue-500 text-white py-2 px-4 rounded-2xl rounded-br-none max-w-xs shadow-md">I'd like to know more about your services.</div>
                    </div>
                </div>
                <div class="p-4 bg-gray-900/50 rounded-b-2xl border-t border-white/10">
                    <div class="flex items-center bg-gray-700 rounded-full p-1">
                        <input type="text" placeholder="Type a message..." class="flex-grow bg-transparent focus:outline-none text-white px-4" />
                        <button class="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </body>
        </html>`;

    // --- LOCAL UI STATE ---
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isPreviewFullScreen, setIsPreviewFullScreen] = useState(false);
    const [projectFiles, setProjectFiles] = useState(null);
    const [zipData, setZipData] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [liveMarketingRules, setLiveMarketingRules] = useState([]);
    const [isSubmittingRule, setIsSubmittingRule] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showInitialButtons, setShowInitialButtons] = useState(true);
    const [pageSections, setPageSections] = useState([]);
    const [previewMode, setPreviewMode] = useState('desktop');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const [copilotModal, setCopilotModal] = useState({
        isOpen: false,
        mode: null,
        element: null,
        inputValue: ''
    });

    // --- REFS ---
    const fileInputRef = useRef(null);
    const iframeRef = useRef(null);
    const imageUploadInputRef = useRef(null);

    // --- EFFECTS ---
    useEffect(() => {
        if (activeProject?.previewCode && activeProject.previewCode !== (history[historyIndex] || null)) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(activeProject.previewCode);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeProject?.previewCode]);


    useEffect(() => {
        if (activeProject && activeProject.interactionCount > 0) {
            setShowInitialButtons(false);
        } else if (activeProject && activeProject.interactionCount === 0) {
            setShowInitialButtons(true);
        }
    }, [activeProject]);

    useEffect(() => {
        const fetchRules = async () => {
            if (!project) return;
            const { data, error } = await supabase.from('live_marketing_rules').select('target_element_id, is_enabled').eq('project_id', project.id);
            if (error) console.error("Error fetching live marketing rules:", error);
            else setLiveMarketingRules(data || []);
        };
        fetchRules();
    }, [project]);
    
    useEffect(() => {
        if (activeProject?.previewCode) {
            const $ = cheerio.load(activeProject.previewCode);
            const sections = [];
            $('section[id], header[id], footer[id]').each((i, el) => {
                sections.push($(el).attr('id'));
            });
            setPageSections(sections);
        }
    }, [activeProject?.previewCode]);

    // --- HANDLERS ---
    const handleCritique = () => {
        const critiquePrompt = "As a world-class UI/UX design expert, analyze the following HTML code and provide 3-4 actionable suggestions to improve its design, layout, and user experience. Focus on principles like spacing, typography, color contrast, and call-to-action clarity. Format your response as a friendly, conversational message with bullet points.";
        handleSendMessage(null, critiquePrompt);
    };

    const handleIframeLoad = () => {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        
        const handleClick = (e) => {
            const target = e.target;
            
            if (target.closest('.visual-copilot-menu')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();

            const supportedTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON', 'DIV', 'IMG'];

            if (target && target.id) {
                 if (target.tagName === 'A') {
                    setCopilotModal({
                        isOpen: true,
                        mode: 'edit-link',
                        element: { id: target.id, tagName: target.tagName, currentHref: target.getAttribute('href') },
                        inputValue: target.getAttribute('href') || ''
                    });
                } else if (target.tagName === 'IMG') {
                     setCopilotModal({
                        isOpen: true,
                        mode: 'change-image',
                        element: { id: target.id, tagName: target.tagName, currentSrc: target.src },
                        inputValue: ''
                    });
                } else if (supportedTags.includes(target.tagName)) {
                    setSelectedElement({ id: target.id, tagName: target.tagName, content: target.innerText });
                }
            } else {
                setSelectedElement(null);
            }
        };

        iframeDocument.body.addEventListener('click', handleClick, true);
        return () => { iframeDocument.body.removeEventListener('click', handleClick, true); };
    };

    const handleOpenVisualCopilot = (mode, element) => {
        setSelectedElement(null);
        setCopilotModal({
            isOpen: true,
            mode: mode,
            element: element,
            inputValue: mode === 'edit-text' ? element.content : `For the <${element.tagName.toLowerCase()}> element with the id "${element.id}", `
        });
    };

    const handleCloseVisualCopilot = () => {
        setCopilotModal({ isOpen: false, mode: null, element: null, inputValue: '' });
    };
    
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user || !copilotModal.element) return;
        
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        try {
            const response = await fetch('/api/uploadImage', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Image upload failed.');
            const { url } = await response.json();

            const $ = cheerio.load(activeProject.previewCode, { xmlMode: false });
            $(`#${copilotModal.element.id}`).attr('src', url);
            const updatedCode = $.html();
            updatePreviewCode(updatedCode);
            if (onNewMessage) onNewMessage();

        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
            handleCloseVisualCopilot();
        }
    };


    const handleCopilotSubmit = () => {
        const { mode, element, inputValue } = copilotModal;
        if (mode === 'edit-text') {
            const $ = cheerio.load(activeProject.previewCode, { xmlMode: false });
            $(`#${element.id}`).text(inputValue);
            const updatedCode = $.html();
            updatePreviewCode(updatedCode);
            if (onNewMessage) onNewMessage();
        } else if (mode === 'ask-zoltrak') {
            handleSendMessage(null, inputValue);
        }
        handleCloseVisualCopilot();
    };
    
    const handleLinkToSection = (newHref) => {
        const { element } = copilotModal;
        const $ = cheerio.load(activeProject.previewCode, { xmlMode: false });
        $(`#${element.id}`).attr('href', newHref);
        updatePreviewCode($.html());
        if (onNewMessage) onNewMessage();
        handleCloseVisualCopilot();
    };

    const handleToggleLiveMarketing = async (element) => {
        if (!element || !project || !profile || isSubmittingRule) return;
        setIsSubmittingRule(true);
        const { id: target_element_id, content: original_content } = element;
        const existingRule = liveMarketingRules.find(r => r.target_element_id === target_element_id);
        const newStatus = existingRule ? !existingRule.is_enabled : true;
        try {
            const { error } = await supabase.from('live_marketing_rules').upsert({ project_id: project.id, user_id: profile.id, target_element_id: target_element_id, original_content: original_content, is_enabled: newStatus }, { onConflict: 'project_id, target_element_id' });
            if (error) throw error;
            if (existingRule) { setLiveMarketingRules(rules => rules.map(r => r.target_element_id === target_element_id ? { ...r, is_enabled: newStatus } : r)); }
            else { setLiveMarketingRules(rules => [...rules, { target_element_id, is_enabled: true }]); }
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmittingRule(false);
            setSelectedElement(null);
        }
    };
    
    const handleSendMessage = async (e, promptOverride) => {
        if (e) e.preventDefault();
        const currentInput = promptOverride || input;
        if ((!currentInput.trim() && !uploadedImage) || isLoading) return;

        const userMessage = { from: 'user', text: currentInput, image: uploadedImage };
        // Add user message to history immediately
        addMessageToHistory(userMessage);

        const currentCode = activeProject.previewCode;
        const historyForAPI = [...activeProject.chatHistory, userMessage].map(msg => ({ from: msg.from, text: msg.text }));

        setInput('');
        setUploadedImage(null);
        setIsLoading(true);
        setShowInitialButtons(false);
        setSuggestions([]);
        setSelectedElement(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: historyForAPI,
                    prompt: currentInput,
                    imageBase64: uploadedImage,
                    userPlan: profile?.subscription_tier || 'Free',
                    userId: profile?.id,
                    projectId: project?.id,
                    currentCode: currentCode
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server returned an error: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            const aiMessage = { from: 'ai', text: "" };
            let finalCode = activeProject.previewCode;

            if (result.type === 'visual') {
                const codeMatch = result.data.match(/```html([\s\S]*?)```/);
                finalCode = codeMatch ? codeMatch[1].trim() : finalCode;
                aiMessage.text = result.data.replace(/```html([\s\S]*?)```/, '').trim() || "Here are the changes you requested.";
            } else if (result.type === 'project_zip') {
                finalCode = result.files.html;
                setProjectFiles(result.files);
                setZipData(result.zip);
                aiMessage.text = "I've generated the full project files for you.";
            } else {
                aiMessage.text = result.data;
            }

            // Add the AI's response to the history
            addMessageToHistory(aiMessage);

            // Update the preview code separately
            updateActiveProject({ previewCode: finalCode });

            if (result.suggestions) {
                setSuggestions(result.suggestions);
            }

            if (onNewMessage) onNewMessage();

        } catch (error) {
            addMessageToHistory({ from: 'ai', text: `An error occurred: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadZip = () => {
        if (!zipData) return;
        const link = document.createElement('a');
        link.href = `data:application/zip;base64,${zipData}`;
        link.download = 'volts-ai-project.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleQuickReply = async (reply) => {
        setShowInitialButtons(false);
        let newPreview = '';
        const lowerReply = reply.toLowerCase();

        if (lowerReply === 'website') newPreview = initialWebsitePreview;
        else if (lowerReply === 'portfolio') newPreview = initialPortfolioPreview;
        else if (lowerReply === 'e-commerce') newPreview = initialEcommercePreview;
        else if (lowerReply === 'blog') newPreview = initialBlogPreview;
        else if (lowerReply === 'chatbot') newPreview = initialChatbotPreview;

        if (newPreview) {
            addMessageToHistory({ from: 'user', text: `Create a ${reply} for me.` }); // Add this line
            updatePreviewCode(newPreview);
            addMessageToHistory({ from: 'ai', text: `Here is a standard ${reply} template to get you started. What would you like to change?` });
            updateActiveProject({ interactionCount: (activeProject.interactionCount || 0) + 1 });
            
            try {
                if(project?.id) {
                    await supabase.from('projects').update({ latest_code: newPreview }).eq('id', project.id);
                }
            } catch (error) {
                console.error("Error saving initial template to DB:", error);
            }
        }
    };

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            updatePreviewCode(history[newIndex]);
        }
    }, [history, historyIndex, updatePreviewCode]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            updatePreviewCode(history[newIndex]);
        }
    }, [history, historyIndex, updatePreviewCode]);


    const handleSuggestionClick = (suggestion) => { handleSendMessage(null, suggestion); };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setUploadedImage(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const containerClasses = isFullScreen ? "w-full h-full bg-[#1a202c]/80 backdrop-blur-xl shadow-2xl border border-white/10 rounded-xl overflow-hidden" : `w-full bg-[#1a202c]/80 backdrop-blur-xl shadow-2xl border border-white/10 ${isDemo ? 'rounded-xl overflow-hidden' : ''}`;
    const containerHeight = isDemo ? 'h-[90vh]' : 'h-full';
    
    if (!activeProject) { return null; }

    return (
        <>
            <div className={`${containerClasses} ${containerHeight}`}>
                <PanelGroup direction="horizontal" className="flex flex-col md:flex-row h-full">
                    <Panel defaultSize={40} minSize={30}>
                        <ChatPanel
                            chatHistory={activeProject.chatHistory}
                            isLoading={isLoading}
                            showInitialButtons={showInitialButtons}
                            onQuickReply={handleQuickReply}
                            suggestions={suggestions}
                            onSuggestionClick={handleSuggestionClick}
                            handleSendMessage={handleSendMessage}
                            input={input}
                            setInput={setInput}
                            uploadedImage={uploadedImage}
                            handleFileChange={handleFileChange}
                            fileInputRef={fileInputRef}
                        />
                    </Panel>
                    <PanelResizeHandle className="w-2 flex items-center justify-center bg-transparent group"><div className="w-px h-full bg-white/10 group-hover:bg-purple-500 transition-colors duration-200"></div></PanelResizeHandle>
                    <Panel defaultSize={60} minSize={30}>
                        <PreviewPanel
                            previewCode={activeProject.previewCode}
                            projectFiles={projectFiles}
                            handleDownloadZip={handleDownloadZip}
                            setIsPreviewFullScreen={setIsPreviewFullScreen}
                            iframeRef={iframeRef}
                            handleIframeLoad={handleIframeLoad}
                            selectedElement={selectedElement}
                            handleToggleLiveMarketing={() => handleToggleLiveMarketing(selectedElement)}
                            isSubmittingRule={isSubmittingRule}
                            onOpenVisualCopilot={handleOpenVisualCopilot}
                            getRuleStatus={(elementId) => liveMarketingRules.find(r => r.target_element_id === elementId)?.is_enabled}
                            previewMode={previewMode}
                            setPreviewMode={setPreviewMode}
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            canUndo={historyIndex > 0}
                            canRedo={historyIndex < history.length - 1}
                            onCritique={handleCritique}
                        />
                    </Panel>
                </PanelGroup>
            </div>
            
            <input
                type="file"
                ref={imageUploadInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            
            {copilotModal.isOpen && copilotModal.mode !== 'edit-link' && copilotModal.mode !== 'change-image' && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-xl w-full max-w-lg flex flex-col relative bg-[#1F2937]/80 p-6">
                        <button onClick={handleCloseVisualCopilot} className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold font-premium mb-4">
                            {copilotModal.mode === 'edit-text' ? 'Edit Text Content' : 'Ask Zoltrak'}
                        </h3>
                        <textarea
                            value={copilotModal.inputValue}
                            onChange={(e) => setCopilotModal(prev => ({ ...prev, inputValue: e.target.value }))}
                            placeholder={copilotModal.mode === 'edit-text' ? 'Enter new text...' : `e.g., "Make this text larger and blue"`}
                            className="w-full p-3 mb-4 bg-gray-900/50 border-2 border-white/20 rounded-lg focus:outline-none focus:border-purple-500 transition-colors h-28"
                            autoFocus
                        />
                        <button onClick={handleCopilotSubmit} className="w-full premium-button text-white font-bold py-2 rounded-lg">
                            {copilotModal.mode === 'edit-text' ? 'Update Text' : 'Send to Zoltrak'}
                        </button>
                    </div>
                </div>
            )}
            
            {copilotModal.isOpen && copilotModal.mode === 'change-image' && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-xl w-full max-w-lg flex flex-col relative bg-[#1F2937]/80 p-6">
                        <button onClick={handleCloseVisualCopilot} className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold font-premium mb-4 flex items-center gap-2"><ImageIcon size={20}/> Change Image</h3>
                        <p className="text-sm text-gray-400 mb-4">
                           Current Image:
                        </p>
                        <div className="mb-4 bg-gray-900/50 p-4 rounded-lg flex justify-center items-center">
                            <img src={copilotModal.element.currentSrc} alt="Current" className="max-h-32 rounded-md" />
                        </div>
                        <button onClick={() => imageUploadInputRef.current.click()} className="w-full premium-button text-white font-bold py-2 rounded-lg">
                            Upload New Image
                        </button>
                    </div>
                </div>
            )}

            
            {copilotModal.isOpen && copilotModal.mode === 'edit-link' && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-card rounded-xl w-full max-w-lg flex flex-col relative bg-[#1F2937]/80 p-6">
                        <button onClick={handleCloseVisualCopilot} className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold font-premium mb-4 flex items-center gap-2"><Link size={20}/> Edit Link Destination</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Current Target: <code className="bg-gray-900/50 py-1 px-2 rounded">{copilotModal.element.currentHref || 'None'}</code>
                        </p>
                        <div className="space-y-3">
                            <p className="font-semibold text-gray-200">Link to a section on this page:</p>
                            <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                                {pageSections.map(id => (
                                    <button key={id} onClick={() => handleLinkToSection(`#${id}`)} className="w-full text-left p-3 rounded-lg bg-gray-900/50 hover:bg-purple-600/50 flex items-center justify-between transition-colors">
                                        <span>#{id}</span>
                                        <CornerDownLeft size={16} />
                                    </button>
                                ))}
                                {pageSections.length === 0 && <p className="text-xs text-gray-500 text-center py-4">No sections with IDs found on this page.</p>}
                            </div>
                        </div>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
                            <div className="relative flex justify-center text-sm"><span className="bg-[#1F2937] px-2 text-gray-500 font-premium">OR</span></div>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200 mb-2">Link to a new page or external URL:</p>
                             <input 
                                type="text"
                                value={copilotModal.inputValue}
                                onChange={(e) => setCopilotModal(prev => ({...prev, inputValue: e.target.value}))}
                                placeholder="https://example.com or /about.html"
                                className="w-full p-2 bg-gray-900/50 border-2 border-white/20 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>
                         <button onClick={() => handleLinkToSection(copilotModal.inputValue)} className="w-full premium-button text-white font-bold py-2 rounded-lg mt-6">
                            Update Link
                        </button>
                    </div>
                </div>
            )}

            {isPreviewFullScreen && (
                <div className="fixed inset-0 bg-gray-900 z-[100] flex flex-col p-4">
                    <div className="flex justify-end mb-4"><button onClick={() => setIsPreviewFullScreen(false)} className="premium-button text-white font-bold py-2 px-5 rounded-lg">Close</button></div>
                    <div className="flex-grow bg-white rounded-lg overflow-hidden">
                        <iframe srcDoc={activeProject.previewCode} title="Full Screen Preview" className="w-full h-full border-0" />
                    </div>
                </div>
            )}
        </>
    );
};

export default AiInterface;