import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const LOCKOUT_KEY = 'onlymeme_admin_lockout_until';
const ATTEMPTS_KEY = 'onlymeme_admin_failed_attempts';
const MAX_ATTEMPTS = 3;
const COOLDOWN_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export default function AdminLoginModal({
  isOpen,
  onClose,
  onAdminLoginSuccess,
  currentUser
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Sync lockout state from localStorage on open / mount
  useEffect(() => {
    if (!isOpen) return;

    const savedLockout = localStorage.getItem(LOCKOUT_KEY);
    if (savedLockout) {
      const remainingMs = Number(savedLockout) - Date.now();
      if (remainingMs > 0) {
        setCooldownRemaining(Math.ceil(remainingMs / 1000));
      } else {
        localStorage.removeItem(LOCKOUT_KEY);
        setCooldownRemaining(0);
      }
    }

    const savedAttempts = localStorage.getItem(ATTEMPTS_KEY);
    if (savedAttempts) {
      setFailedAttempts(Number(savedAttempts) || 0);
    }
  }, [isOpen]);

  // Countdown timer effect during active cooldown
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(LOCKOUT_KEY);
          localStorage.removeItem(ATTEMPTS_KEY);
          setFailedAttempts(0);
          setErrorMessage('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  if (!isOpen) return null;

  const isLockedOut = cooldownRemaining > 0;

  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Cryptographic authorization simulation
    await new Promise((r) => setTimeout(r, 600));

    const cleanPassword = password.trim();
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
    const envAdminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();

    // Valid admin passcodes configured via environment
    const validPasswords = envAdminPassword ? [envAdminPassword] : ['admin@onlymeme'];

    const isValidAdmin = validPasswords.includes(cleanPassword);

    if (!isValidAdmin) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      localStorage.setItem(ATTEMPTS_KEY, nextAttempts.toString());

      if (nextAttempts >= MAX_ATTEMPTS) {
        // Trigger 5-minute cooldown
        const lockoutUntil = Date.now() + COOLDOWN_DURATION_MS;
        localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
        setCooldownRemaining(Math.ceil(COOLDOWN_DURATION_MS / 1000));
        setErrorMessage('Security Lockdown: 3 consecutive failed attempts. Admin access is locked for 5 minutes.');
      } else {
        const attemptsLeft = MAX_ATTEMPTS - nextAttempts;
        setErrorMessage(`Access Denied: Incorrect password. Attempt ${nextAttempts} of ${MAX_ATTEMPTS} (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before 5-min cooldown).`);
      }

      setIsLoading(false);
      return;
    }

    // Success: Reset failed attempts & clear lockout
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCKOUT_KEY);
    setFailedAttempts(0);
    setSuccessMessage('Credentials Verified. Elevated to Super-Admin.');
    setIsLoading(false);

    // Construct upgraded Super-Admin user object
    const adminUser = {
      uid: currentUser?.uid || 'super_admin_01',
      displayName: currentUser?.displayName || 'Super Admin',
      email: adminEmail,
      photoURL: currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'admin',
      bio: 'Super-Administrator with 1-Click Takedown ("Nuke") authority.',
      postsCount: currentUser?.postsCount || 0,
      likesReceived: currentUser?.likesReceived || 0,
      emailVerified: true,
      createdAt: currentUser?.createdAt || '2026-10-23'
    };

    localStorage.setItem('onlymeme_demo_user', JSON.stringify(adminUser));

    setTimeout(() => {
      onAdminLoginSuccess(adminUser);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      
      {/* Admin Login Dialog Card */}
      <div className="relative w-full max-w-md bg-surface-container border-2 border-error/40 rounded-2xl shadow-hard-lg p-6 sm:p-8 flex flex-col gap-5 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Close admin login modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-4">
          <div className="w-11 h-11 rounded-xl bg-error/15 border-2 border-error flex items-center justify-center shadow-hard shrink-0 text-error">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide">
                NOT<span className="text-error font-bold">ADMIN</span>
              </h2>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-error/20 text-error border border-error/40 font-bold uppercase">
                Restricted
              </span>
            </div>
            <p className="font-mono text-[11px] text-outline">
              Super-Admin Authorization & Moderation Gateway
            </p>
          </div>
        </div>

        {/* Cooldown / Lockout Banner */}
        {isLockedOut ? (
          <div className="p-4 rounded-xl bg-error/20 border-2 border-error text-error flex flex-col gap-2 font-mono text-xs animate-shake">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0 text-error" />
              <span>Security Lockdown Active</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              3 consecutive failed login attempts detected. Admin access is suspended for security protection.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-error/30 mt-1">
              <span className="text-[11px] text-outline uppercase font-semibold">Cooldown Remaining:</span>
              <span className="font-mono text-base font-bold text-error flex items-center gap-1.5 bg-error/25 px-2.5 py-0.5 rounded-lg border border-error/40">
                <Clock className="w-4 h-4 animate-spin" />
                {formatCountdown(cooldownRemaining)}
              </span>
            </div>
          </div>
        ) : errorMessage ? (
          /* Error Alert Banner */
          <div className="p-3 rounded-xl bg-error/15 border border-error/40 text-error flex items-start gap-2.5 font-mono text-xs animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-error" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        ) : null}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-primary/15 border border-primary/40 text-primary flex items-center gap-2 font-mono text-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Fields: Only Email & Password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Master Password Field Only (Email is hidden for security) */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[11px] text-outline uppercase font-semibold flex items-center justify-between">
              <span>Admin Passcode</span>
              <div className="flex items-center gap-2">
                {failedAttempts > 0 && !isLockedOut && (
                  <span className="text-error text-[10px] font-mono">
                    {failedAttempts}/{MAX_ATTEMPTS} failed attempts
                  </span>
                )}
                {!isLockedOut && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-outline hover:text-on-surface text-[10px] flex items-center gap-1 lowercase"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'hide' : 'show'}</span>
                  </button>
                )}
              </div>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLockedOut || isLoading}
                required
                autoFocus
                placeholder="Enter admin passcode..."
                className="w-full bg-surface-container-low border border-outline-variant focus:border-error rounded-xl px-3.5 py-2.5 text-xs text-on-surface font-mono placeholder:text-outline/60 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-outline hover:text-on-surface font-mono text-xs font-bold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || isLockedOut}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-error hover:bg-red-500 text-white font-headline text-xs font-bold shadow-hard active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed btn-neo"
            >
              {isLockedOut ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Locked ({formatCountdown(cooldownRemaining)})</span>
                </>
              ) : isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Token...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
