'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession, authClient } from '../../lib/auth-client';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LanguageContext';
import ImageCropperModal from '../../components/ImageCropperModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faCamera,
  faLink,
  faFloppyDisk,
  faCircleNotch,
  faBookOpen,
  faReceipt,
  faCalendarCheck,
  faShieldHalved,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t, lang } = useLang();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState({ booksContributed: 0, activeBorrows: 0 });
  const [memberSince, setMemberSince] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  useEffect(() => {
    document.title = lang === 'bn' ? 'BookNook | প্রোফাইল সেটিংস' : 'BookNook | Profile Settings';
    if (!isPending && !session?.user) {
      toast.error(lang === 'bn' ? 'প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন' : 'Please sign in to view your profile');
      router.push('/login?callbackUrl=/profile');
    }
  }, [session, isPending, router, lang]);

  // Load user profile details
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImageUrl(session.user.image || '');
      setEmail(session.user.email || '');

      // Fetch live stats from API
      fetch('/api/user/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            if (data.user.name) setName(data.user.name);
            if (data.user.image) setImageUrl(data.user.image);
            if (data.user.stats) setStats(data.user.stats);
            if (data.user.createdAt) setMemberSince(new Date(data.user.createdAt));
          }
        })
        .catch(() => {
          // Fallback to session details
        });
    }
  }, [session]);

  // Handle local file selection with < 1MB limit & open cropper
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error(t('invalidImageFileError'));
    }

    if (file.size > 1024 * 1024) {
      return toast.error(t('imageSizeLimitError'));
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Cropped Image upload
  const handleCropComplete = async (croppedDataUrl) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      setImageUrl(croppedDataUrl);
      setImageError(false);
      toast.success(t('avatarUploadSuccess'));
      return;
    }

    try {
      setUploadingImage(true);
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
        setImageUrl(data.data.url);
        setImageError(false);
        toast.success(t('avatarUploadSuccess'));
      } else {
        setImageUrl(croppedDataUrl);
        setImageError(false);
        toast.success(t('avatarUploadSuccess'));
      }
    } catch {
      setImageUrl(croppedDataUrl);
      setImageError(false);
      toast.success(t('avatarUploadSuccess'));
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Profile Update Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error(lang === 'bn' ? 'নাম খালি রাখা যাবে না' : 'Name cannot be empty');
    }

    try {
      setSaving(true);

      // 1. Update in MongoDB via our API route
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // 2. Also sync with BetterAuth Client if updateUser is supported
      if (authClient?.updateUser) {
        try {
          await authClient.updateUser({
            name: name.trim(),
            image: imageUrl.trim(),
          });
        } catch (_) {
          // BetterAuth sync best-effort
        }
      }

      toast.success(t('profileUpdatedSuccess'));

      // Smooth soft refresh after short delay so header avatar reflects instantly
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error(err.message || t('profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center py-20">
        <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-4xl text-[#FF7A59] mb-4" />
        <p className="text-stone-500 font-medium font-bangla">
          {lang === 'bn' ? 'প্রোফাইল লোড হচ্ছে...' : 'Loading profile...'}
        </p>
      </div>
    );
  }

  const formattedDate = memberSince
    ? memberSince.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : lang === 'bn'
    ? '২০২৬'
    : '2026';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#F4EFEA] dark:bg-darkCard border border-cream-200 dark:border-darkBorder rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 dark:bg-darkBorder text-stone-700 dark:text-darkText text-xs font-bold uppercase tracking-wider mb-2 font-bangla">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#FF7A59]" />
            <span>{t('membershipBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 dark:text-white font-serif tracking-tight">
            {t('profileTitle')}
          </h1>
          <p className="text-sm text-stone-600 dark:text-darkMuted mt-1 font-bangla">
            {t('profileSub')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-stone-800 border border-cream-200 dark:border-darkBorder shadow-xs">
          <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-sm" />
          <span className="text-xs font-bold text-forest-950 dark:text-white font-bangla">
            {lang === 'bn' ? 'যাচাইকৃত সদস্য' : 'Verified Member'}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Avatar & Stats, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Avatar & Reader Stats (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Avatar Card */}
          <div className="bg-white dark:bg-darkCard border border-cream-200 dark:border-darkBorder rounded-3xl p-6 shadow-sm text-center">
            <h3 className="text-sm font-bold text-forest-950 dark:text-white font-bangla uppercase tracking-wider mb-5">
              {t('profilePhoto')}
            </h3>

            {/* Avatar Circle */}
            <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-cream-100 dark:bg-stone-800 border-4 border-[#F4EFEA] dark:border-stone-700 shadow-md flex items-center justify-center group mb-4">
              {imageUrl && !imageError ? (
                <Image
                  src={imageUrl}
                  alt={name || 'Profile'}
                  fill
                  sizes="150px"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-4xl sm:text-5xl text-stone-400" />
              )}

              {uploadingImage && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-bangla gap-1.5">
                  <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-xl text-[#FF7A59]" />
                  <span>{t('uploadingPhoto')}</span>
                </div>
              )}
            </div>

            <p className="text-base font-extrabold text-forest-950 dark:text-white truncate font-bangla">
              {name || session?.user?.name || 'Reader'}
            </p>
            <p className="text-xs text-stone-500 dark:text-darkMuted truncate mt-0.5">
              {email}
            </p>

            {/* Tab switch between File Upload and URL */}
            <div className="mt-6 pt-5 border-t border-cream-100 dark:border-darkBorder">
              <div className="grid grid-cols-2 p-1 bg-cream-100 dark:bg-darkBorder rounded-2xl mb-4 text-xs font-bold font-bangla">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'upload'
                      ? 'bg-white dark:bg-darkCard text-forest-950 dark:text-white shadow-xs'
                      : 'text-stone-500 dark:text-darkMuted hover:text-forest-950'
                  }`}
                >
                  <FontAwesomeIcon icon={faCamera} className="text-xs" />
                  <span>{lang === 'bn' ? 'ছবি আপলোড' : 'Upload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'url'
                      ? 'bg-white dark:bg-darkCard text-forest-950 dark:text-white shadow-xs'
                      : 'text-stone-500 dark:text-darkMuted hover:text-forest-950'
                  }`}
                >
                  <FontAwesomeIcon icon={faLink} className="text-xs" />
                  <span>{lang === 'bn' ? 'ইমেজ লিঙ্ক' : 'Image URL'}</span>
                </button>
              </div>

              {activeTab === 'upload' ? (
                <div>
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-white dark:bg-[#FF7A59] dark:hover:bg-[#ff6842] text-xs font-bold transition-all shadow-xs font-bangla">
                    <FontAwesomeIcon icon={faCamera} />
                    <span>{uploadingImage ? t('uploadingPhoto') : (lang === 'bn' ? 'ছবি নির্বাচন ও ক্রপ করুন' : 'Select & Crop Photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-stone-400 mt-2 font-bangla">
                    {lang === 'bn'
                      ? 'সর্বোচ্চ ১MB (PNG, JPG, WEBP) • ফ্রি, প্রোফাইল ও বুক মোডে ক্রপ'
                      : 'Max size 1MB • Free, Profile & Book crop modes'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faLink}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
                    />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImageError(false);
                      }}
                      placeholder={t('photoUrlPlaceholder')}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-900/50 text-forest-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/40"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 text-left font-bangla">
                    {lang === 'bn'
                      ? 'যেকোনো পাবলিক ছবির সরাসরি লিঙ্ক পেস্ট করুন'
                      : 'Paste any public image direct link'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reader Stats Card */}
          <div className="bg-white dark:bg-darkCard border border-cream-200 dark:border-darkBorder rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-forest-950 dark:text-white uppercase tracking-wider font-bangla">
              {lang === 'bn' ? 'পাঠক পরিচিতি ও পরিসংখ্যান' : 'Reader Activity Overview'}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F4EFEA] dark:bg-stone-800 border border-cream-200/60 dark:border-darkBorder">
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-bangla mb-1">
                  <FontAwesomeIcon icon={faBookOpen} className="text-[#FF7A59]" />
                  <span>{t('statsContributedBooks')}</span>
                </div>
                <p className="text-2xl font-extrabold text-forest-950 dark:text-white">
                  {stats.booksContributed}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F4EFEA] dark:bg-stone-800 border border-cream-200/60 dark:border-darkBorder">
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs font-bangla mb-1">
                  <FontAwesomeIcon icon={faReceipt} className="text-purple-600" />
                  <span>{t('statsActiveBorrows')}</span>
                </div>
                <p className="text-2xl font-extrabold text-forest-950 dark:text-white">
                  {stats.activeBorrows}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-cream-100 dark:border-darkBorder text-xs text-stone-600 dark:text-darkMuted font-bangla">
              <FontAwesomeIcon icon={faCalendarCheck} className="text-emerald-500 text-sm" />
              <span>
                {t('memberSince')}: <strong className="text-forest-950 dark:text-white">{formattedDate}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Edit Form (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-darkCard border border-cream-200 dark:border-darkBorder rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-6 border-b border-cream-100 dark:border-darkBorder">
              <div className="w-10 h-10 rounded-2xl bg-[#E8DFD6] dark:bg-stone-800 flex items-center justify-center text-forest-950 dark:text-white shadow-inner">
                <FontAwesomeIcon icon={faUser} className="text-base" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-forest-950 dark:text-white font-serif">
                  {t('personalInfo')}
                </h3>
                <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla">
                  {lang === 'bn' ? 'আপনার অ্যাকাউন্টের বিবরণ ও পরিচিতি' : 'Your account details and credentials'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-forest-950 dark:text-white uppercase tracking-wider mb-2 font-bangla">
                  {t('fullNameLabel')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-cream-300 dark:border-stone-700 bg-cream-50/50 dark:bg-stone-900/50 text-forest-950 dark:text-white text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/40 focus:border-[#FF7A59] transition-all"
                  />
                </div>
              </div>

              {/* Email Address (Read-only) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-forest-950 dark:text-white uppercase tracking-wider font-bangla">
                    {t('emailAddressLabel')}
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cream-200 dark:bg-stone-700 text-stone-600 dark:text-darkMuted font-bangla">
                    {t('emailReadOnlyBadge')}
                  </span>
                </div>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"
                  />
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={email}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-cream-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 text-sm cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5 font-bangla">
                  {lang === 'bn'
                    ? 'সুরক্ষা নিশ্চিত করতে ইমেইল পরিবর্তন করা সম্ভব নয়।'
                    : 'Email address cannot be changed for account security.'}
                </p>
              </div>

              {/* Avatar Direct URL Input (Always available in form for quick edit) */}
              <div>
                <label className="block text-xs font-bold text-forest-950 dark:text-white uppercase tracking-wider mb-2 font-bangla">
                  {lang === 'bn' ? 'ছবির লিংক (ঐচ্ছিক)' : 'Image URL (Optional)'}
                </label>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faLink}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm"
                  />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError(false);
                    }}
                    placeholder="https://i.ibb.co/..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-cream-300 dark:border-stone-700 bg-cream-50/50 dark:bg-stone-900/50 text-forest-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/40 focus:border-[#FF7A59] transition-all font-mono text-xs"
                  />
                </div>
              </div>

              {/* Action Button: Save Profile */}
              <div className="pt-4 border-t border-cream-100 dark:border-darkBorder flex items-center justify-end font-bangla">
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-forest-950 hover:bg-forest-900 dark:bg-[#FF7A59] dark:hover:bg-[#ff6842] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-sm" />
                      <span>{t('savingProfile')}</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFloppyDisk} className="text-sm" />
                      <span>{t('saveProfileBtn')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

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
