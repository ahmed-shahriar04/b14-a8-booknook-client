'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signIn } from '../../lib/auth-client';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = 'BookNook | লগইন (Login)';
  }, []);

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
        setErrorMsg(res.error.message || 'ভুল ইমেইল বা পাসওয়ার্ড');
        toast.error(res.error.message || 'লগইন ব্যর্থ হয়েছে');
      } else {
        toast.success('BookNook-এ আপনাকে স্বাগতম!');
        router.push(callbackUrl);
      }
    } catch {
      setErrorMsg('লগইন করার সময় অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে।');
      toast.error('লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });
    } catch {
      toast.error('গুগল সাইন-ইন এরর');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 border border-cream-200 dark:border-darkBorder shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
            স্বাগতম পাঠক • WELCOME BACK
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            BookNook-এ প্রবেশ করুন
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted mt-1 font-bangla">
            আপনার ধার নেওয়া বই ও ব্যক্তিগত শেলফ পরিচালনা করুন।
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium font-bangla">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs font-bangla">
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">ইমেইল ঠিকানা (Email)</label>
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-stone-700 dark:text-darkText font-semibold">পাসওয়ার্ড (Password)</label>
              <button
                type="button"
                onClick={() => toast('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হবে!')}
                className="text-[11px] text-stone-400 hover:text-forest-950 dark:hover:text-white transition-colors"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow"
          >
            {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন (Login)'}
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
            <span className="font-bangla">Or continue with Google (গুগল দিয়ে প্রবেশ করুন)</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-stone-500 dark:text-darkMuted font-bangla">
          এখনো কোনো অ্যাকাউন্ট নেই?{' '}
          <Link href="/register" className="font-bold text-forest-950 dark:text-[#FF7A59] hover:underline">
            নতুন রেজিস্টার করুন
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
