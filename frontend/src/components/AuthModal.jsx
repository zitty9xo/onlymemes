import React, { useState } from 'react';
import { X, ShieldAlert, Mail, KeyRound, User, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onSignInWithGoogle,
  onSignInWithEmail,
  onSignUpWithEmail
}) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setErrorMessage('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
  };

  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await onSignUpWithEmail(email, password, displayName);
      } else {
        await onSignInWithEmail(email, password);
      }
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await onSignInWithGoogle();
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl shadow-hard-lg p-6 sm:p-8 flex flex-col gap-5">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-1.5">
          <div className="w-13 h-13 rounded-2xl bg-surface-container-low border-2 border-primary flex items-center justify-center shadow-hard mb-1">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">sentiment_very_satisfied</span>
          </div>
          <h2 className="font-modern-20 text-3xl font-normal text-on-surface tracking-wide">
            {mode === 'signin' ? 'Welcome Back to ' : 'Join '}
            <span className="text-primary font-bold">OnlyMemes</span>
          </h2>
          <p className="font-body text-xs text-on-surface-variant max-w-xs">
            {mode === 'signin'
              ? 'Log in to publish memes, trigger comedic AI reviews, and earn karma.'
              : 'Create an account to join the culture engine and post high-entropy memes.'}
          </p>
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low border border-outline-variant/80">
          <button
            type="button"
            onClick={() => handleModeSwitch('signin')}
            className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-surface-container-highest text-primary shadow-sm border border-outline-variant'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-surface-container-highest text-primary shadow-sm border border-outline-variant'
                : 'text-outline hover:text-on-surface'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Security / Validation Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-container/30 border border-error text-error text-xs font-mono flex items-start gap-2.5 animate-shake shadow-hard">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-error" />
            <div className="flex-1">
              <span className="font-bold block uppercase text-[10px] tracking-wider">Security Notice</span>
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuthSubmit} className="flex flex-col gap-3.5">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] text-outline uppercase font-semibold">
                Creator / Display Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-outline absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. MemeLord99"
                  maxLength={30}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface font-body focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[11px] text-outline uppercase font-semibold">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-outline absolute left-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] text-outline uppercase font-semibold">
                Password
              </label>
              {mode === 'signup' && (
                <span className="font-mono text-[10px] text-outline">
                  Min. 6 characters
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-outline absolute left-3 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-9 pr-3 py-2 text-xs text-on-surface font-mono focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-headline text-sm font-bold shadow-hard active:translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-neo"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Option (Only in Sign In mode; hidden while creating an account) */}
        {mode === 'signin' && (
          <>
            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-outline-variant/60 w-full" />
              <span className="bg-surface-container px-3 font-mono text-[10px] text-outline uppercase tracking-wider">
                or
              </span>
            </div>

            {/* Google OAuth Option */}
            <button
              onClick={handleGoogleClick}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline text-xs font-bold border border-outline-variant shadow-hard active:translate-y-0.5 transition-all disabled:opacity-50 btn-neo"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.8 6.9 9.2 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.2-4.7 3.2-8.1z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.9 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.7-2.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5L2.2 17C4 20.5 7.7 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
}
