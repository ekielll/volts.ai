import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111827] border-t border-white/10">
      <div className="container mx-auto px-6 py-6 flex justify-between items-center">
        <p className="text-gray-500 text-sm font-premium">&copy; 2025 volts.ai. All rights reserved.</p>
        <div className="flex space-x-4">
            <a href="/#" className="text-gray-500 hover:text-white transition-colors">
                <Facebook size={20} />
            </a>
            <a href="/#" className="text-gray-500 hover:text-white transition-colors">
                <Twitter size={20} />
            </a>
            <a href="/#" className="text-gray-500 hover:text-white transition-colors">
                <Instagram size={20} />
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;