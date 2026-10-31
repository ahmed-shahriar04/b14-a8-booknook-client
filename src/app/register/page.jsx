'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signUp, signIn } from '../../lib/auth-client';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { t, lang } = useLang();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = lang === 'bn' ? 'BookNook | রেজিস্টার করুন' : 'BookNook | Create Account';
  }, [lang]);

  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return lang === 'bn' ? 'পাসওয়ার্ডের দৈর্ঘ্য ন্যূনতম ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters long.';
    }
    if (!/[A-Z]/.test(pass)) {
      return lang === 'bn' ? 'পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে।' : 'Password must contain at least one uppercase letter (A-Z).';
    }
    if (!/[a-z]/.test(pass)) {
      return lang === 'bn' ? 'পাসওয়ার্ডে অন্তত একটি ছোট হাতের অক্ষর (a-z) থাকতে হবে।' : 'Password must contain at least one lowercase letter (a-z).';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return toast.error(passwordError);
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.photoURL || '',
      });

      if (res.error) {
        const msg = res.error.message || (lang === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' : 'Registration failed');
        setErrorMsg(msg);
        toast.error(msg);
      } else {
        toast.success(lang === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন হয়েছে! এবার লগইন করুন।' : 'Account created successfully! Please sign in.');
        router.push('/login');
      }
    } catch {
      const msg = lang === 'bn' ? 'অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে। আবার চেষ্টা করুন।' : 'An unexpected error occurred. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch {
      toast.error(lang === 'bn' ? 'গুগল সাইন-ইন ত্রুটি' : 'Google sign-in error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 border border-cream-200 dark:border-darkBorder shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
            {t('joinCommunityBadge')}
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            {t('registerTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted mt-1 font-bangla">
            {t('registerSub')}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium font-bangla">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-bangla">
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('nameLabel')} *</label>
            <input
              type="text"
              required
              placeholder={lang === 'bn' ? 'যেমন: শাহরিয়ার আহমেদ' : 'e.g. John Doe'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('emailLabel')} *</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('photoUrlLabel')}</label>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={formData.photoURL}
              onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('passwordLabel')} *</label>
            <input
              type="password"
              required
              placeholder={lang === 'bn' ? 'কমপক্ষে ৬ অক্ষর, বড় ও ছোট হাতের অক্ষর' : 'Min 6 chars, 1 uppercase, 1 lowercase'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
            <p className="text-[10px] text-stone-400 dark:text-darkMuted mt-1">
              {lang === 'bn'
                ? 'ন্যূনতম ৬ অক্ষর, অন্তত ১টি বড় হাতের (A-Z) ও ১টি ছোট হাতের (a-z) অক্ষর থাকতে হবে।'
                : 'Minimum 6 characters with at least one uppercase (A-Z) and one lowercase (a-z) letter.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow"
          >
            {loading ? t('registering') : t('registerBtn')}
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
          {t('hasAccount')}{' '}
          <Link href="/login" className="font-bold text-forest-950 dark:text-[#FF7A59] hover:underline">
            {t('loginHere')}
          </Link>
        </p>
      </div>
    </div>
  );
}
