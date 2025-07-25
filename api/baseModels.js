// src/lib/baseModels.js

// This file centralizes the master HTML templates for the "10-Second Wow" feature.

export const baseTemplates = {

WEBSITE: `
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
                    <li><a href="#hero" class="hover:text-purple-400 transition-colors">Home</a></li>
                    <li><a href="#services" class="hover:text-purple-400 transition-colors">Services</a></li>
                    <li><a href="#about" class="hover:text-purple-400 transition-colors">About</a></li>
                    <li><a href="#contact" class="hover:text-purple-400 transition-colors">Contact</a></li>
                </ul>
            </div>
        </nav>
        <header id="hero" class="container mx-auto px-6 py-24 text-center">
            <h1 id="main-headline" class="text-5xl md:text-7xl font-bold leading-tight">[HEADLINE]</h1>
            <p id="sub-headline" class="text-xl text-gray-400 mt-4 max-w-3xl mx-auto">We create stunning websites that captivate and convert. Let's build your success story together.</p>
            <button id="cta-button" class="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold transition-transform duration-300 hover:scale-105">Get a Free Quote</button>
        </header>
        <section id="services" class="py-20 bg-gray-800">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-4xl font-bold mb-12">Our Services</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-gray-900 p-8 rounded-xl shadow-lg"><h3 class="text-2xl font-bold mb-4">Web Design</h3><p class="text-gray-400">Crafting beautiful and intuitive user interfaces that delight your visitors.</p></div>
                    <div class="bg-gray-900 p-8 rounded-xl shadow-lg"><h3 class="text-2xl font-bold mb-4">Development</h3><p class="text-gray-400">Building robust and scalable web applications tailored to your specific needs.</p></div>
                    <div class="bg-gray-900 p-8 rounded-xl shadow-lg"><h3 class="text-2xl font-bold mb-4">SEO</h3><p class="text-gray-400">Optimizing your site to rank higher on search engines and attract more traffic.</p></div>
                </div>
            </div>
        </section>
        <section id="about" class="py-20">
            <div class="container mx-auto px-6 text-center">
                 <h2 class="text-4xl font-bold mb-4">What Our Clients Say</h2>
                 <blockquote class="max-w-3xl mx-auto mt-8"><p class="text-2xl italic text-gray-300">"Working with them was a game-changer. Our engagement metrics have skyrocketed!"</p><cite class="block text-right not-italic text-purple-400 mt-4">- Jane Doe, CEO of Awesome Inc.</cite></blockquote>
            </div>
        </section>
        <footer id="contact" class="bg-gray-800 py-10"><div class="container mx-auto px-6 text-center text-gray-400"><p>&copy; 2025 Your Company. All Rights Reserved.</p></div></footer>
    </body>
    </html>`,

PORTFOLIO: `
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
                <h1 id="portfolio-name" class="text-7xl font-bold">[NAME]</h1>
                <p id="portfolio-title" class="text-2xl text-purple-400 mt-2">[TITLE]</p>
            </div>
        </section>
        <section id="work" class="py-20">
            <div class="container mx-auto px-6">
                <h2 class="text-4xl font-bold text-center mb-12">My Work</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                    <div class="bg-gray-800 aspect-square rounded-lg flex items-center justify-center text-gray-500">Placeholder for your work</div>
                </div>
            </div>
        </section>
        <section id="about" class="py-20 bg-gray-800">
            <div class="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <div class="md:w-1/3 flex justify-center"><div class="w-64 h-64 bg-purple-500 rounded-full flex items-center justify-center text-white">Your Headshot</div></div>
                <div class="md:w-2/3 text-center md:text-left"><h2 class="text-4xl font-bold mb-4">About Me</h2><p id="portfolio-bio" class="text-gray-400 text-lg">I'm a passionate and dedicated professional with a knack for creating amazing things. My experience lies in [Your Skill 1], [Your Skill 2], and [Your Skill 3]. Let's create something incredible together.</p></div>
            </div>
        </section>
        <footer id="contact" class="bg-gray-900 py-10 text-center text-gray-400"><p>Get in touch: <a href="mailto:email@example.com" class="text-purple-400">email@example.com</a></p></footer>
    </body>
    </html>`,

ECOMMERCE: `
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
        <div class="bg-purple-600 text-white text-center py-2 text-sm"><p>Free Shipping On All Orders Over $50</p></div>
        <nav class="bg-white shadow-md sticky top-0 z-50"><div class="container mx-auto px-6 py-4 flex justify-between items-center"><div id="logo" class="font-bold text-xl text-gray-800">YourStore</div><ul class="flex gap-8 text-gray-600"><li><a href="#products" class="hover:text-purple-600 transition-colors">Products</a></li><li><a href="#" class="hover:text-purple-600 transition-colors">About</a></li><li><a href="#" class="hover:text-purple-600 transition-colors">Contact</a></li></ul></div></nav>
        <header class="bg-gray-200"><div class="container mx-auto px-6 py-20 text-center"><h1 class="text-5xl font-bold text-gray-800">[PROMOTION_HEADLINE]</h1><p class="text-gray-600 mt-4">Discover the latest trends and refresh your style.</p><button class="mt-8 px-8 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors">Shop Now</button></div></header>
        <main id="products" class="py-20"><div class="container mx-auto px-6"><h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Featured Products</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"><div class="bg-white rounded-lg shadow-md overflow-hidden"><div class="bg-gray-300 h-56 w-full"></div><div class="p-6"><h3 class="font-bold text-gray-800">Product Name</h3><p class="text-gray-600 mt-2">$99.99</p><button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button></div></div><div class="bg-white rounded-lg shadow-md overflow-hidden"><div class="bg-gray-300 h-56 w-full"></div><div class="p-6"><h3 class="font-bold text-gray-800">Product Name</h3><p class="text-gray-600 mt-2">$99.99</p><button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button></div></div><div class="bg-white rounded-lg shadow-md overflow-hidden"><div class="bg-gray-300 h-56 w-full"></div><div class="p-6"><h3 class="font-bold text-gray-800">Product Name</h3><p class="text-gray-600 mt-2">$99.99</p><button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button></div></div><div class="bg-white rounded-lg shadow-md overflow-hidden"><div class="bg-gray-300 h-56 w-full"></div><div class="p-6"><h3 class="font-bold text-gray-800">Product Name</h3><p class="text-gray-600 mt-2">$99.99</p><button class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Add to Cart</button></div></div></div></div></main>
        <footer class="bg-gray-800 text-white py-10"><div class="container mx-auto text-center"><p>&copy; 2025 YourStore. All Rights Reserved.</p></div></footer>
    </body>
    </html>`,

LANDINGPAGE: `
    <!DOCTYPE html>
    <html lang="en" class="scroll-smooth">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
        <style>body { font-family: 'Poppins', sans-serif; }</style>
        <title>Your Awesome Landing Page</title>
    </head>
    <body class="bg-gray-100 text-gray-800">
        <header class="bg-white border-b py-6"><div class="container mx-auto px-6 text-center"><h1 id="blog-title" class="text-5xl font-bold">[LANDINGPAGE_NAME]</h1><p id="blog-subtitle" class="text-gray-500 mt-2">Your daily dose of insights and inspiration.</p></div></header>
        <div class="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <main class="lg:col-span-2">
                <article class="mb-12"><div class="bg-gray-300 w-full h-80 rounded-lg mb-6"></div><h2 class="text-4xl font-bold mb-3">Featured Post: Getting Started with AI</h2><p class="text-gray-500 mb-4">Posted on July 9, 2025</p><div class="font-serif text-lg leading-relaxed space-y-4"><p>This is an excerpt of your first featured blog post. It's designed for maximum readability and impact, drawing the reader in from the very first sentence...</p></div><a href="#" class="text-purple-600 font-bold mt-4 inline-block">Read More &rarr;</a></article>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <article><div class="bg-gray-300 w-full h-56 rounded-lg mb-4"></div><h3 class="text-2xl font-bold mb-2">Previous Post Title</h3><p class="text-gray-600 font-serif">A short and catchy excerpt for another one of your amazing articles goes right here...</p><a href="#" class="text-purple-600 font-bold mt-2 inline-block">Read More &rarr;</a></article>
                    <article><div class="bg-gray-300 w-full h-56 rounded-lg mb-4"></div><h3 class="text-2xl font-bold mb-2">Previous Post Title</h3><p class="text-gray-600 font-serif">A short and catchy excerpt for another one of your amazing articles goes right here...</p><a href="#" class="text-purple-600 font-bold mt-2 inline-block">Read More &rarr;</a></article>
                </div>
            </main>
            <aside class="lg:col-span-1"><div class="bg-white p-6 rounded-lg shadow-md"><h3 class="font-bold text-xl mb-4">About the Author</h3><p class="text-gray-600">A short bio about yourself or your publication. Let your readers know who is behind the words.</p></div><div class="bg-white p-6 rounded-lg shadow-md mt-8"><h3 class="font-bold text-xl mb-4">Categories</h3><ul class="space-y-2 text-purple-600"><li><a href="#" class="hover:underline">Technology</a></li><li><a href="#" class="hover:underline">Productivity</a></li><li><a href="#" class="hover:underline">Design</a></li><li><a href="#" class="hover:underline">Personal Growth</a></li></ul></div></aside>
        </div>
        <footer class="bg-gray-800 text-white text-center py-10"><p>&copy; 2025 Your Landing Page. All Rights Reserved.</p></footer>
    </body>
    </html>`,

CHATBOT: `
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
                    <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white"><path d="M12 8V4H8"/><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M20 12h-4"/><path d="m15 17-3-3 3-3"/></svg></div>
                    <div><h3 id="chatbot-name" class="font-bold text-white text-lg">[ASSISTANT_NAME]</h3><p id="chatbot-status" class="text-xs text-purple-200">Online</p></div>
                </div>
            </div>
            <div class="flex-grow p-4 space-y-4 overflow-y-auto"><div class="flex justify-start"><div class="bg-gray-700 text-white py-2 px-4 rounded-2xl rounded-bl-none max-w-xs shadow-md">Hello! How can I help you build your site today?</div></div><div class="flex justify-end"><div class="bg-blue-500 text-white py-2 px-4 rounded-2xl rounded-br-none max-w-xs shadow-md">I'd like to know more about your services.</div></div></div>
            <div class="p-4 bg-gray-900/50 rounded-b-2xl border-t border-white/10">
                <div class="flex items-center bg-gray-700 rounded-full p-1">
                    <input type="text" placeholder="Type a message..." class="flex-grow bg-transparent focus:outline-none text-white px-4" />
                    <button class="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-white"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
                </div>
            </div>
        </div>
    </body>
    </html>`,
};