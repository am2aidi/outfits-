import React, { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

import HuranowLogo from './HuranowLogo';

export default function AuthModal() {
  const {
    isAuthOpen,
    setIsAuthOpen,
    authMode,
    setAuthMode,
    authPromptMessage,
    login,
    signup
  } = useShop();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        await login(username, password);
      } else {
        if (!email) {
          throw new Error('Please provide a valid email address.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signup(username, email, password);
      }
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-md bg-[#0e0e11] border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon */}
        <div className="flex items-center gap-2 mb-6">
          <HuranowLogo className="w-8 h-8" showText={true} textClassName="text-xl" />
        </div>

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'login' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'signup' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Join Membership
          </button>
        </div>

        <h3 className="text-2xl font-black uppercase text-white font-display mb-1">
          {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          {authMode === 'login'
            ? 'Sign in to access your fitting studio, saved bag, and order history.'
            : 'Join HURANOW to unlock instant checkout, fitting studio saves, and VIP drop access.'}
        </p>

        {/* Gated Action Prompt Message */}
        {authPromptMessage && (
          <div className="mb-4 p-3 bg-zinc-900 border border-amber-500/50 rounded-xl text-xs text-amber-300 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping"></span>
            <span>{authPromptMessage}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              {authMode === 'login' ? 'Username or Email' : 'Username'}
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={authMode === 'login' ? 'Enter username or email' : 'Choose a username'}
                className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Email for Signup */}
          {authMode === 'signup' && (
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#151518] border border-zinc-700 text-white placeholder-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-extrabold py-3.5 px-6 rounded-full text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo note */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>Local test credentials securely stored in your browser</span>
        </div>

      </div>

    </div>
  );
}
