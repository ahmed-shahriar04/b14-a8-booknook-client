'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/auth-client';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faCircleNotch,
  faShieldHalved,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lang } = useLang();

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLoggedIn = Boolean(session?.user);

  useEffect(() => {
    document.title =
      lang === 'bn'
        ? 'BookNook | পাসওয়ার্ড পরিবর্তন ও রিসেট'
        : 'BookNook | Change or Reset Password';

    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      const msg =
        lang === 'bn'
          ? 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।'
          : 'New password must be at least 6 characters.';
      setErrorMsg(msg);
      return toast.error(msg);
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      const msg =
        lang === 'bn'
          ? 'পাসওয়ার্ডে অন্তত একটি বড় হাতের (A-Z) ও একটি ছোট হাতের (a-z) অক্ষর থাকতে হবে।'
          : 'Password must contain at least one uppercase and one lowercase letter.';
      setErrorMsg(msg);
      return toast.error(msg);
    }

    if (newPassword !== confirmPassword) {
      const msg =
        lang === 'bn'
          ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!'
          : 'New password and confirm password do not match!';
      setErrorMsg(msg);
      return toast.error(msg);
    }

    try {
      setLoading(true);

      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          currentPassword: isLoggedIn ? currentPassword : '',
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update password');
      }

      toast.success(
        lang === 'bn'
          ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!'
          : 'Password updated successfully!'
      );

      // Redirect
      setTimeout(() => {
        if (isLoggedIn) {
          router.push('/profile');
        } else {
          router.push('/login');
        }
      }, 800);
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-8 border border-cream-200 dark:border-darkBorder shadow-sm">
        {/* Header Badge & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 dark:bg-darkBorder text-stone-700 dark:text-darkText text-xs font-bold uppercase tracking-wider mb-2 font-bangla">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#FF7A59]" />
            <span>{isLoggedIn ? (lang === 'bn' ? 'নিরাপত্তা সেটিংস' : 'Security') : (lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Recovery')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1">
            {isLoggedIn
              ? lang === 'bn'
                ? 'পাসওয়ার্ড পরিবর্তন করুন'
                : 'Change Password'
              : lang === 'bn'
              ? 'পাসওয়ার্ড রিসেট করুন'
              : 'Reset Password'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted mt-1 font-bangla">
            {isLoggedIn
              ? lang === 'bn'
                ? 'আপনার অ্যাকাউন্টের বর্তমান ও নতুন পাসওয়ার্ড প্রদান করুন।'
                : 'Enter your current password and set a new secure password.'
              : lang === 'bn'
              ? 'আপনার অ্যাকাউন্টের ইমেইল ও নতুন পাসওয়ার্ড দিয়ে রিসেট করুন।'
              : 'Enter your account email and choose a new password.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium font-bangla">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bangla">
          {/* Email Address */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {lang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
              />
              <input
                type="email"
                required
                readOnly={isLoggedIn}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder ${
                  isLoggedIn
                    ? 'bg-cream-100/70 dark:bg-stone-900/50 text-stone-500 cursor-not-allowed'
                    : 'bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59]'
                } transition-colors`}
              />
            </div>
          </div>

          {/* Current Password (Only when logged in) */}
          {isLoggedIn && (
            <div>
              <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
                {lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
                />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
                >
                  <FontAwesomeIcon icon={showCurrent ? faEyeSlash : faEye} className="text-xs" />
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faKey}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
              />
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={lang === 'bn' ? 'কমপক্ষে ৬ অক্ষর, বড় ও ছোট হাতের অক্ষর' : 'Min 6 chars, uppercase & lowercase'}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} className="text-xs" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              {lang === 'bn'
                ? 'কমপক্ষে ৬ অক্ষর, অন্তত ১টি বড় হাতের (A-Z) ও ১টি ছোট হাতের (a-z) অক্ষর।'
                : 'At least 6 characters, with 1 uppercase & 1 lowercase letter.'}
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faKey}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
              />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={lang === 'bn' ? 'পাসওয়ার্ডটি পুনরায় লিখুন' : 'Re-enter new password'}
                className={`w-full pl-9 pr-10 py-2.5 rounded-xl border ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-cream-300 dark:border-darkBorder focus:border-forest-950 dark:focus:border-[#FF7A59]'
                } focus:outline-none bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} className="text-xs" />
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-[10px] text-rose-500 mt-1">
                {lang === 'bn' ? 'নতুন পাসওয়ার্ড মিলছে না!' : 'New passwords do not match!'}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow disabled:opacity-50 mt-2 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-xs" />
                <span>{lang === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...'}</span>
              </>
            ) : (
              <span>{isLoggedIn ? (lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password') : (lang === 'bn' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Password')}</span>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-5 border-t border-cream-200 dark:border-darkBorder text-center">
          <Link
            href={isLoggedIn ? '/profile' : '/login'}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-darkMuted hover:text-forest-950 dark:hover:text-white transition-colors font-bangla"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-[10px]" />
            <span>{isLoggedIn ? (lang === 'bn' ? 'প্রোফাইলে ফিরে যান' : 'Back to Profile') : (lang === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Login')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
