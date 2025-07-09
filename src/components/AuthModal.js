import React from 'react';
import { supabase } from '../supabaseClient';
import { X, Lock, User, Mail, Chrome as GoogleIcon } from 'lucide-react';

const AuthModal = ({ mode, onToggleMode, closeModal, selectedPlan }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`${mode === 'signup' ? 'Signing up' : 'Logging in'}... (Functionality to be built)`);
        if (mode === 'signup' && selectedPlan) {
            alert(`Proceeding to payment for the ${selectedPlan} plan... (Stripe integration to be built)`);
        }
        closeModal();
    };

    async function handleGoogleLogin() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) {
        alert('Error logging in with Google: ' + error.message);
      }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-xl w-full max-w-md flex flex-col relative bg-[#1F2937]/80">
                <button onClick={closeModal} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-2 font-premium">
                        {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-center text-gray-400 mb-6">
                        {mode === 'signup' ? `You've selected the ${selectedPlan || 'default'} plan.` : 'Log in to continue.'}
                    </p>
                    
                    <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors mb-4">
                      <GoogleIcon className="w-5 h-5 text-white" />
                      <span className="font-bold text-white font-premium">Continue with Google</span>
                    </button>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                          <span className="bg-[#1F2937] px-2 text-gray-500 font-premium">OR</span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === 'signup' && (
                            <div className="relative">
                                <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" size={20} />
                                <input type="text" placeholder="Full Name" required className="w-full p-3 pl-10 bg-gray-900/50 border-2 border-transparent border-b-white/20 rounded-lg focus:outline-none focus:border-b-purple-500 transition-colors" />
                            </div>
                        )}
                        <div className="relative">
                            <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" size={20} />
                            <input type="email" placeholder="Email Address" required className="w-full p-3 pl-10 bg-gray-900/50 border-2 border-transparent border-b-white/20 rounded-lg focus:outline-none focus:border-b-purple-500 transition-colors" />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" size={20} />
                            <input type="password" placeholder="Password" required className="w-full p-3 pl-10 bg-gray-900/50 border-2 border-transparent border-b-white/20 rounded-lg focus:outline-none focus:border-b-purple-500 transition-colors" />
                        </div>
                        <button type="submit" className="w-full premium-button text-white font-bold py-3 rounded-lg font-premium">
                            {mode === 'signup' ? 'Sign Up with Email' : 'Continue with Email'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={onToggleMode} className="font-bold text-purple-400 hover:underline ml-1">
                            {mode === 'signup' ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;