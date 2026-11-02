'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BookCard from './BookCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faHandHoldingHand,
  faClockRotateLeft,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';
import { useSession } from '../lib/auth-client';
import { getServerUrl } from '../lib/api';

export default function HomeSectionsClient({ books: initialBooks = [] }) {
  const { t, lang } = useLang();
  const { data: session } = useSession();
  const [booksList, setBooksList] = useState(initialBooks || []);
  const [loading, setLoading] = useState(!initialBooks || initialBooks.length === 0);
  const [userBorrowedIds, setUserBorrowedIds] = useState(new Set());

  // Fetch user borrows for instant badges
  useEffect(() => {
    if (session?.user) {
      const fetchUserBorrows = async () => {
        try {
          const jwtRes = await fetch('/api/jwt');
          const jwtData = await jwtRes.json();
          const token = jwtData?.token;
          if (token) {
            const serverUrl = getServerUrl();
            const res = await fetch(`${serverUrl}/borrows`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
              setUserBorrowedIds(new Set(data.data.map((b) => b.bookId)));
            }
          }
        } catch (_) {}
      };
      fetchUserBorrows();
    } else {
      setUserBorrowedIds(new Set());
    }
  }, [session]);

  // Dynamic server fetch with automatic retry while server spins up
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 8;
    let timer = null;

    const fetchLiveBooks = async () => {
      try {
        const serverUrl = getServerUrl();
        const res = await fetch(`${serverUrl}/books?limit=6&sort=newest`);
        const data = await res.json();
        if (isMounted && data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBooksList(data.data);
          setLoading(false);
          return;
        }
      } catch (_) {}

      if (isMounted && retryCount < maxRetries && (!booksList || booksList.length === 0)) {
        retryCount++;
        timer = setTimeout(fetchLiveBooks, 3000);
      } else if (isMounted) {
        setLoading(false);
      }
    };

    if (!initialBooks || initialBooks.length === 0) {
      setLoading(true);
      fetchLiveBooks();
    } else {
      setBooksList(initialBooks);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [initialBooks]);

  const categories = [
    { name: 'Fiction', label: lang === 'bn' ? 'উপন্যাস ও ফিকশন' : 'Fiction', count: lang === 'bn' ? 'আকর্ষণীয় গল্প' : 'Engaging Tales', color: 'bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-900/30' },
    { name: 'Science', label: lang === 'bn' ? 'বিজ্ঞান ও প্রযুক্তি' : 'Science & Tech', count: lang === 'bn' ? 'তথ্য ও গবেষণা' : 'Facts & Research', color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-900/30' },
    { name: 'History', label: lang === 'bn' ? 'ইতিহাস ও ঐতিহ্য' : 'History & Heritage', count: lang === 'bn' ? 'ঐতিহাসিক দলিল' : 'Past Chronicles', color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-900/30' },
    { name: 'Kids', label: lang === 'bn' ? 'কিশোর ও শিশুতোষ' : 'Kids & Youth', count: lang === 'bn' ? 'ছোটদের জগৎ' : 'Young Readers', color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/30' },
    { name: 'Others', label: lang === 'bn' ? 'অন্যান্য সাহিত্য' : 'Others', count: lang === 'bn' ? 'বিবিধ প্রবন্ধ' : 'Diverse Essays', color: 'bg-stone-50 dark:bg-stone-900/40 text-stone-900 dark:text-stone-300 border-stone-200 dark:border-stone-800' },
  ];

  return (
    <div className="space-y-10 md:space-y-14">
      {/* 3. New Arrivals (Dynamic from MongoDB) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
              {t('newArrivalsBadge')}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-0.5 font-bangla">
              {t('recommendations')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-darkMuted font-medium font-bangla">
              {t('recommendationsSub')}
            </p>
          </div>
          <Link
            href="/books"
            className="self-start sm:self-auto text-xs font-semibold text-stone-700 dark:text-darkText bg-cream-100 dark:bg-darkCard hover:bg-cream-200 dark:hover:bg-stone-800 px-4 py-1.5 rounded-full border border-cream-300 dark:border-darkBorder transition-colors flex items-center gap-1.5 font-bangla"
          >
            <span>{t('viewAll')}</span>
            <span className="text-[10px]">›</span>
          </Link>
        </div>

        {/* Dynamic Cards Grid or Motivating Waiting State */}
        {loading ? (
          <div className="text-center py-12 sm:py-16 px-6 bg-white dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder shadow-xs space-y-4 animate-in fade-in duration-300">
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-forest-950/10 dark:bg-[#FF7A59]/20 text-forest-950 dark:text-[#FF7A59] flex items-center justify-center text-2xl shadow-inner">
              <FontAwesomeIcon icon={faBookOpen} className="animate-bounce" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-bold text-base sm:text-lg text-forest-950 dark:text-white font-bangla">
                {lang === 'bn'
                  ? 'বইসমূহ লোড হচ্ছে, অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন...'
                  : 'Loading books from library, please wait a moment...'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla italic leading-relaxed">
                {lang === 'bn'
                  ? '“একটি ভালো বই পাঠকের জন্য অপেক্ষা করে, আর ধৈর্য জ্ঞান অর্জনের প্রথম সোপান।”'
                  : '“A great book is worth waiting for. Patience is the companion of wisdom.”'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7A59] animate-ping"></span>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-darkMuted font-bangla">
                  {lang === 'bn'
                    ? 'সার্ভার থেকে সরাসরি ডাটা লোড করা হচ্ছে...'
                    : 'Fetching live books from database...'}
                </span>
              </div>
            </div>
          </div>
        ) : booksList && booksList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {booksList.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  isBorrowed={userBorrowedIds.has(book._id)}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/books"
                className="inline-block bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-semibold text-xs sm:text-sm px-8 py-3 rounded-full transition-all shadow-sm font-bangla"
              >
                {t('seeAllBooks')}
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-6 bg-cream-50 dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder">
            <div className="w-14 h-14 rounded-full bg-cream-200 dark:bg-darkBg text-forest-950 dark:text-[#FF7A59] flex items-center justify-center text-lg mx-auto mb-3 shadow-xs">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <h3 className="text-base font-serif font-bold text-forest-950 dark:text-white mb-1 font-bangla">
              {t('noBooksTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-darkMuted max-w-sm mx-auto mb-6 leading-relaxed font-bangla">
              {t('noBooksDesc')}
            </p>
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-all shadow-sm font-bangla"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span>{t('addFirstBook')}</span>
            </Link>
          </div>
        )}
      </section>

      {/* 4. Book Category Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
              {t('popularCategories')}
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-forest-950 dark:text-white font-bangla">
              {t('browseByNiche')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-bangla">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/books?category=${cat.name}`}
              className={`${cat.color} p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
            >
              <h3 className="font-bold text-xs">{cat.label}</h3>
              <span className="text-[10px] opacity-75 mt-2 block">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. 3 Step Guide: How Borrow Works */}
      <section className="bg-[#EBE5DC] dark:bg-darkCard rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 dark:border-darkBorder">
        <div className="max-w-xl mb-8">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
            {t('threeStepBadge')}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            {t('howBorrowWorks')}
          </h2>
          <p className="text-xs text-stone-600 dark:text-darkMuted mt-1 font-bangla">
            {t('howBorrowDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 font-bangla">
          <div className="bg-white dark:bg-darkBg p-5 rounded-2xl border border-cream-200 dark:border-darkBorder shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#142E2A] text-white flex items-center justify-center font-bold text-xs">
              ১
            </div>
            <h3 className="font-bold text-sm text-forest-950 dark:text-white">{t('step1Title')}</h3>
            <p className="text-xs text-stone-500 dark:text-darkMuted leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-darkBg p-5 rounded-2xl border border-cream-200 dark:border-darkBorder shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-[#FF7A59] text-white flex items-center justify-center font-bold text-xs">
              ২
            </div>
            <h3 className="font-bold text-sm text-forest-950 dark:text-white">{t('step2Title')}</h3>
            <p className="text-xs text-stone-500 dark:text-darkMuted leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-darkBg p-5 rounded-2xl border border-cream-200 dark:border-darkBorder shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
              ৩
            </div>
            <h3 className="font-bold text-sm text-forest-950 dark:text-white">{t('step3Title')}</h3>
            <p className="text-xs text-stone-500 dark:text-darkMuted leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
