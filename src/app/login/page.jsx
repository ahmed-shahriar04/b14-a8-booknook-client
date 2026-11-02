'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { signIn } from '../../lib/auth-client';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { t, lang } = useLang();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = lang === 'bn' ? 'BookNook | লগইন করুন' : 'BookNook | Sign In';
  }, [lang]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        const msg = res.error.message || (lang === 'bn' ? 'ভুল ইমেইল বা পাসওয়ার্ড' : 'Invalid email or password');
        setErrorMsg(msg);
        toast.error(msg);
      } else {
        toast.success(lang === 'bn' ? 'BookNook-এ আপনাকে স্বাগতম!' : 'Welcome back to BookNook!');
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 300);
      }
    } catch {
      const msg = lang === 'bn' ? 'লগইন করার সময় অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে।' : 'An unexpected error occurred during login.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const res = await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });
      if (res?.error) {
        toast.error(
          lang === 'bn'
            ? 'গুগল সাইন-ইন এখনও কনফিগার করা হয়নি। অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন।'
            : 'Google Sign-In is not configured in Vercel. Please sign in with email & password.'
        );
      }
    } catch {
      toast.error(lang === 'bn' ? 'গুগল সাইন-ইন এরর' : 'Google sign in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 border border-cream-200 dark:border-darkBorder shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
            {t('welcomeBackBadge')}
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted mt-1 font-bangla">
            {t('loginSub')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium font-bangla">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-bangla">
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('emailLabel')}</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('passwordLabel')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-xs" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow"
          >
            {loading ? t('loggingIn') : t('loginBtn')}
          </button>
        </form>

        {/* Social Login Button in Clean Single Line */}
        <div className="mt-6 pt-5 border-t border-cream-200 dark:border-darkBorder">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-full border border-cream-300 dark:border-darkBorder hover:bg-cream-50 dark:hover:bg-darkBorder text-forest-950 dark:text-white font-semibold text-xs transition-colors whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-500 text-sm shrink-0" />
            <span className="font-bangla">{t('orContinueGoogle')}</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500 dark:text-darkMuted font-bangla">
          {t('noAccount')}{' '}
          <Link href="/register" className="font-bold text-forest-950 dark:text-[#FF7A59] hover:underline">
            {t('registerHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
