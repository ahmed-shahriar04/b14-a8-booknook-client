'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/auth-client';
import toast from 'react-hot-toast';
import StylishSelect from '../../components/StylishSelect';
import { useLang } from '../../context/LanguageContext';
import { getServerUrl } from '../../lib/api';

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t, lang } = useLang();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    image: '',
    totalCopies: 1,
    description: '',
  });

  useEffect(() => {
    document.title = lang === 'bn' ? 'BookNook | নতুন বই যোগ করুন' : 'BookNook | Add Book';
    if (!isPending && !session?.user) {
      toast.error(lang === 'bn' ? 'বই যোগ করতে অনুগ্রহ করে লগইন করুন' : 'Please log in to add a book');
      router.push('/login?callbackUrl=/add-book');
    }
  }, [session, isPending, router, lang]);

  const categoryOptions = [
    { label: lang === 'bn' ? 'উপন্যাস ও ফিকশন' : 'Fiction', value: 'Fiction' },
    { label: lang === 'bn' ? 'বিজ্ঞান ও প্রযুক্তি' : 'Science', value: 'Science' },
    { label: lang === 'bn' ? 'ইতিহাস ও ঐতিহ্য' : 'History', value: 'History' },
    { label: lang === 'bn' ? 'কিশোর ও শিশুতোষ' : 'Kids', value: 'Kids' },
    { label: lang === 'bn' ? 'অন্যান্য সাহিত্য' : 'Others', value: 'Others' },
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
      toast(lang === 'bn' ? 'সরাসরি ছবি আপলোড প্রস্তুত' : 'Using direct image upload fallback');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
      return;
    }

    try {
      setUploadingImage(true);
      const imgData = new FormData();
      imgData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success(lang === 'bn' ? 'কভার ছবি আপলোড সফল হয়েছে!' : 'Book cover image uploaded!');
      } else {
        toast.error(lang === 'bn' ? 'ছবি আপলোড ব্যর্থ হয়েছে' : 'Image upload failed: ' + (data.error?.message || 'Error'));
      }
    } catch {
      toast.error(lang === 'bn' ? 'ইমেজ হোস্টে সংযোগ ব্যর্থ' : 'Error connecting to image host');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      return toast.error(lang === 'bn' ? 'অনুগ্রহ করে বইয়ের কভার ছবি দিন' : 'Please upload or provide a book cover image');
    }

    setLoading(true);
    try {
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = getServerUrl();
      const res = await fetch(`${serverUrl}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(lang === 'bn' ? 'বইটি সফলভাবে লাইব্রেরিতে যুক্ত হয়েছে!' : 'Book published to BookNook successfully!');
        router.push('/books');
      } else {
        toast.error(result.message || (lang === 'bn' ? 'বই যোগ করতে ব্যর্থ হয়েছে' : 'Failed to add book'));
      }
    } catch (err) {
      console.error('Add book error:', err);
      toast.error(lang === 'bn' ? 'সার্ভার যোগাযোগ ত্রুটি' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-forest-950 dark:border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 font-bangla">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 border border-cream-200 dark:border-darkBorder shadow-sm transition-colors duration-300">
        <div className="mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
            {lang === 'bn' ? 'কমিউনিটি সংগ্রহশালা • লাইব্রেরিতে বই দান' : 'CONTRIBUTE TO CATALOGUE • COMMUNITY LIBRARY'}
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1">
            {lang === 'bn' ? 'নতুন বই যোগ করুন' : 'Add a New Book'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted">
            {lang === 'bn'
              ? 'আপনার শেলফ থেকে একটি চমৎকার বই সবার পড়ার জন্য লাইব্রেরিতে তালিকাভুক্ত করুন।'
              : 'Share a literary gem from your bookshelf with fellow BookNook readers.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-darkText mb-1">
              {lang === 'bn' ? 'বইয়ের নাম *' : 'Book Title *'}
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'bn' ? 'যেমন: চাঁদের পাহাড় / সঞ্চয়িতা' : 'e.g. The Psychology of Money'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-darkText mb-1">
              {lang === 'bn' ? 'লেখকের নাম *' : 'Author Name *'}
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'bn' ? 'যেমন: বিভূতিভূষণ বন্দ্যোপাধ্যায় / রবীন্দ্রনাথ ঠাকুর' : 'e.g. Morgan Housel'}
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stylish Category Dropdown */}
            <div>
              <label className="block font-semibold text-stone-700 dark:text-darkText mb-1">
                {lang === 'bn' ? 'ক্যাটাগরি *' : 'Category *'}
              </label>
              <StylishSelect
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={categoryOptions}
                placeholder={lang === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'Select Category'}
              />
            </div>

            {/* Total Copies */}
            <div>
              <label className="block font-semibold text-stone-700 dark:text-darkText mb-1">
                {lang === 'bn' ? 'মোট কপি সংখ্যা *' : 'Total Copies Available *'}
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-darkText mb-1">
              {lang === 'bn' ? 'বইয়ের কভার ছবি (Upload or Direct URL) *' : 'Book Cover Image (Upload or Direct URL) *'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-forest-950 dark:file:bg-[#FF7A59] file:text-white hover:file:bg-forest-900 cursor-pointer"
              />
              <span className="text-stone-400 self-center text-[11px]">{lang === 'bn' ? 'বা' : 'OR'}</span>
              <input
                type="url"
                placeholder={lang === 'bn' ? 'সরাসরি ইমেজ URL পেস্ট করুন' : 'Paste direct image URL'}
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-4 py-2 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
              />
            </div>
            {uploadingImage && <p className="text-[11px] text-amber-500 mt-1">{lang === 'bn' ? 'ছবি আপলোড হচ্ছে...' : 'Uploading image...'}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block font-semibold text-stone-700 dark:text-darkText mb-1">
              {lang === 'bn' ? 'সংক্ষিপ্ত বিবরণ *' : 'Short Description *'}
            </label>
            <textarea
              rows="4"
              required
              placeholder={lang === 'bn' ? 'বইটির বিষয়বস্তু বা মূল পটভূমি সম্পর্কে কিছু লিখুন...' : 'Write a concise overview of the book plot, key ideas, or intended audience...'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59] bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white"
            />
          </div>

          {/* User Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-stone-500 dark:text-darkMuted mb-1">
                {lang === 'bn' ? 'সংযোজনকারী (User Name)' : 'Added By (Name)'}
              </label>
              <input
                type="text"
                readOnly
                value={session?.user?.name || 'User'}
                className="w-full px-4 py-2 rounded-xl border border-cream-200 dark:border-darkBorder bg-cream-100 dark:bg-stone-900 text-stone-500 dark:text-darkMuted cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-500 dark:text-darkMuted mb-1">
                {lang === 'bn' ? 'ইউজার ইমেইল (User Email)' : 'User Email'}
              </label>
              <input
                type="email"
                readOnly
                value={session?.user?.email || 'user@booknook.dev'}
                className="w-full px-4 py-2 rounded-xl border border-cream-200 dark:border-darkBorder bg-cream-100 dark:bg-stone-900 text-stone-500 dark:text-darkMuted cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              {loading ? (lang === 'bn' ? 'বই যুক্ত হচ্ছে...' : 'Publishing...') : (lang === 'bn' ? 'বই যুক্ত করুন' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
