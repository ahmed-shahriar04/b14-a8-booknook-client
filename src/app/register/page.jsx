'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faEye,
  faEyeSlash,
  faCamera,
  faLink,
  faUser,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { signUp, signIn } from '../../lib/auth-client';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';
import ImageCropperModal from '../../components/ImageCropperModal';

export default function RegisterPage() {
  const router = useRouter();
  const { t, lang } = useLang();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Avatar upload / url states
  const [avatarTab, setAvatarTab] = useState('upload'); // 'upload' | 'url'
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Handle local file selection with < 1MB limit
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error(lang === 'bn' ? 'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন' : 'Please select an image file');
    }

    // 1MB strict limit
    if (file.size > 1024 * 1024) {
      return toast.error(
        lang === 'bn'
          ? 'ছবির সাইজ অবশ্যই ১ মেগাবাইট (1MB)-এর কম হতে হবে!'
          : 'Image size must be strictly less than 1MB!'
      );
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };

  // Handle Cropped Image upload
  const handleCropComplete = async (croppedDataUrl) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      setFormData((prev) => ({ ...prev, photoURL: croppedDataUrl }));
      toast.success(lang === 'bn' ? 'প্রোফাইল ছবি প্রস্তুত!' : 'Profile photo ready!');
      return;
    }

    try {
      setUploadingImage(true);
      // Convert data URL to blob
      const resBlob = await fetch(croppedDataUrl);
      const blob = await resBlob.blob();

      const imgData = new FormData();
      imgData.append('image', blob, 'avatar.jpg');

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });
      const data = await res.json();

      if (data.success && data.data?.url) {
        setFormData((prev) => ({ ...prev, photoURL: data.data.url }));
        toast.success(lang === 'bn' ? 'ছবি আপলোড সফল হয়েছে!' : 'Photo uploaded successfully!');
      } else {
        // Fallback to dataUrl
        setFormData((prev) => ({ ...prev, photoURL: croppedDataUrl }));
        toast.success(lang === 'bn' ? 'প্রোফাইল ছবি সংরক্ষিত হয়েছে' : 'Profile photo saved');
      }
    } catch {
      setFormData((prev) => ({ ...prev, photoURL: croppedDataUrl }));
      toast.success(lang === 'bn' ? 'প্রোফাইল ছবি সংরক্ষিত হয়েছে' : 'Profile photo saved');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return toast.error(passwordError);
    }

    if (formData.password !== confirmPassword) {
      const mismatchMsg = lang === 'bn' ? 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!' : 'Passwords do not match!';
      setErrorMsg(mismatchMsg);
      return toast.error(mismatchMsg);
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: formData.photoURL ? formData.photoURL.trim() : '',
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
      const res = await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
      if (res?.error) {
        toast.error(
          lang === 'bn'
            ? 'গুগল সাইন-ইন এখনও কনফিগার করা হয়নি। অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্টার করুন।'
            : 'Google Sign-In is not configured in Vercel. Please register with email & password.'
        );
      }
    } catch {
      toast.error(lang === 'bn' ? 'গুগল সাইন-ইন ত্রুটি' : 'Google sign-in error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 animate-in fade-in duration-300">
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

        <form onSubmit={handleRegister} className="space-y-4 text-xs font-bangla">
          {/* Full Name */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {t('nameLabel')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'bn' ? 'যেমন: শাহরিয়ার আহমেদ' : 'e.g. John Doe'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {t('emailLabel')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors"
            />
          </div>

          {/* Profile Photo (Upload or URL - Optional, < 1MB with Cropper) */}
          <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-stone-900/40 border border-cream-200 dark:border-darkBorder space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-stone-700 dark:text-darkText font-semibold flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCamera} className="text-[#FF7A59] text-xs" />
                <span>{lang === 'bn' ? 'প্রোফাইল ছবি (ঐচ্ছিক)' : 'Profile Photo (Optional)'}</span>
              </label>
              <span className="text-[10px] text-stone-400 font-mono">&lt; 1MB</span>
            </div>

            {/* Avatar Preview */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-cream-200 dark:bg-stone-800 border-2 border-white dark:border-stone-700 shadow-xs flex items-center justify-center shrink-0 relative">
                {formData.photoURL ? (
                  <Image
                    src={formData.photoURL}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-stone-400 text-base" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-white text-xs" />
                  </div>
                )}
              </div>

              {/* Tabs for Upload or URL */}
              <div className="flex-1 flex gap-1.5 p-1 bg-white dark:bg-darkCard rounded-xl border border-cream-200 dark:border-darkBorder text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setAvatarTab('upload')}
                  className={`flex-1 py-1 rounded-lg transition-all text-center ${
                    avatarTab === 'upload'
                      ? 'bg-forest-950 dark:bg-[#FF7A59] text-white'
                      : 'text-stone-500 dark:text-darkMuted'
                  }`}
                >
                  {lang === 'bn' ? 'আপলোড' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarTab('url')}
                  className={`flex-1 py-1 rounded-lg transition-all text-center ${
                    avatarTab === 'url'
                      ? 'bg-forest-950 dark:bg-[#FF7A59] text-white'
                      : 'text-stone-500 dark:text-darkMuted'
                  }`}
                >
                  {lang === 'bn' ? 'লিঙ্ক (URL)' : 'URL'}
                </button>
              </div>
            </div>

            {avatarTab === 'upload' ? (
              <div>
                <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 hover:border-forest-950 dark:hover:border-[#FF7A59] bg-white dark:bg-darkCard text-stone-700 dark:text-darkText font-medium text-xs transition-colors">
                  <FontAwesomeIcon icon={faCamera} className="text-xs text-[#FF7A59]" />
                  <span>
                    {uploadingImage
                      ? lang === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'
                      : lang === 'bn' ? 'ছবি নির্বাচন ও ক্রপ করুন' : 'Choose & Crop Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-stone-400 mt-1 text-center">
                  {lang === 'bn'
                    ? 'সর্বোচ্চ ১MB (PNG, JPG, WEBP) • প্রোফাইল/বই/ফ্রি মোডে ক্রপ'
                    : 'Max 1MB • Supports Profile, Book & Free crop modes'}
                </p>
              </div>
            ) : (
              <div className="relative">
                <FontAwesomeIcon
                  icon={faLink}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
                />
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.photoURL}
                  onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-cream-300 dark:border-darkBorder bg-white dark:bg-darkCard text-forest-950 dark:text-white text-xs focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59]"
                />
              </div>
            )}
          </div>

          {/* Password with Show/Hide Toggle */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {t('passwordLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={lang === 'bn' ? 'কমপক্ষে ৬ অক্ষর, বড় ও ছোট হাতের অক্ষর' : 'Min 6 chars, 1 uppercase, 1 lowercase'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            <p className="text-[10px] text-stone-400 dark:text-darkMuted mt-1">
              {lang === 'bn'
                ? 'কমপক্ষে ৬ অক্ষর, ১টি বড় হাতের (A-Z) ও ১টি ছোট হাতের (a-z) অক্ষর।'
                : 'Min 6 characters with at least one uppercase & lowercase letter.'}
            </p>
          </div>

          {/* Confirm Password with Show/Hide Toggle */}
          <div>
            <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
              {lang === 'bn' ? 'কনফার্ম পাসওয়ার্ড' : 'Confirm Password'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder={lang === 'bn' ? 'পাসওয়ার্ডটি পুনরায় লিখুন' : 'Re-enter your password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-4 pr-10 py-2.5 rounded-xl border ${
                  confirmPassword && confirmPassword !== formData.password
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-cream-300 dark:border-darkBorder focus:border-forest-950 dark:focus:border-[#FF7A59]'
                } focus:outline-none bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-1"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-xs" />
              </button>
            </div>
            {confirmPassword && confirmPassword !== formData.password && (
              <p className="text-[10px] text-rose-500 mt-1">
                {lang === 'bn' ? 'পাসওয়ার্ড মিলছে না!' : 'Passwords do not match!'}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow disabled:opacity-50 mt-2"
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

      {/* Image Cropper Modal (<1MB, Profile, Book, Free modes) */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={rawImageSrc}
        defaultMode="profile"
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
