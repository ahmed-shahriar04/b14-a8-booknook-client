'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BookCard from './BookCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faHandHoldingHand,
  faClockRotateLeft,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';
import { getServerUrl } from '../lib/api';

export default function HomeSectionsClient({ books: initialBooks = [] }) {
  const { t, lang } = useLang();
  const [booksList, setBooksList] = useState(initialBooks || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialBooks && initialBooks.length > 0) {
      setBooksList(initialBooks);
      setLoading(false);
    } else if (booksList.length === 0) {
      setLoading(true);
      const serverUrl = getServerUrl();
      fetch(`${serverUrl}/books?limit=6&sort=newest`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
            setBooksList(data.data);
          }
        })
        .catch((err) => {
          console.error('Failed to load books on client:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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

        {/* Dynamic Cards Grid (Sleek compact cards: 2 on mobile, 3 on tablet, 5 or 6 on desktop) */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-forest-950 dark:border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : booksList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {booksList.map((book) => (
                <BookCard key={book._id} book={book} />
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
          <h2 className="text-lg sm:text-xl font-serif font-bold text-forest-950 dark:text-white font-bangla">
            {t('popularCategories')}
          </h2>
          <span className="text-xs text-stone-400 font-medium font-bangla">{t('browseByNiche')}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/books?category=${encodeURIComponent(cat.name)}`}
              className={`w-[calc(50%-0.5rem)] sm:w-auto p-4 rounded-2xl border text-center transition-all hover:-translate-y-1 hover:shadow-md ${cat.color}`}
            >
              <h4 className="text-xs font-bold leading-tight mb-1 font-bangla">{cat.label}</h4>
              <p className="text-[10px] opacity-75 font-bangla">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How Borrowing Works Section */}
      <section className="bg-cream-50 dark:bg-darkCard rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200 dark:border-darkBorder">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-widest uppercase font-bangla">
            {t('threeStepBadge')}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            {t('howBorrowWorks')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-darkMuted mt-1 font-bangla">
            {t('howBorrowDesc')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-3 sm:gap-6 font-bangla">
          <div className="w-[calc(50%-0.5rem)] sm:w-auto bg-white dark:bg-darkBg p-4 sm:p-6 rounded-2xl border border-cream-200 dark:border-darkBorder text-center shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream-100 dark:bg-stone-800 text-forest-950 dark:text-[#FF7A59] font-bold mx-auto flex items-center justify-center text-sm mb-3">
                <FontAwesomeIcon icon={faBookOpen} />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-forest-950 dark:text-white mb-1">
                {t('step1Title')}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-darkMuted leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>
          </div>

          <div className="w-[calc(50%-0.5rem)] sm:w-auto bg-white dark:bg-darkBg p-4 sm:p-6 rounded-2xl border border-cream-200 dark:border-darkBorder text-center shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream-100 dark:bg-stone-800 text-forest-950 dark:text-[#FF7A59] font-bold mx-auto flex items-center justify-center text-sm mb-3">
                <FontAwesomeIcon icon={faHandHoldingHand} />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-forest-950 dark:text-white mb-1">
                {t('step2Title')}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-darkMuted leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>
          </div>

          <div className="w-[85%] sm:w-auto bg-white dark:bg-darkBg p-4 sm:p-6 rounded-2xl border border-cream-200 dark:border-darkBorder text-center shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream-100 dark:bg-stone-800 text-forest-950 dark:text-[#FF7A59] font-bold mx-auto flex items-center justify-center text-sm mb-3">
                <FontAwesomeIcon icon={faClockRotateLeft} />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-forest-950 dark:text-white mb-1">
                {t('step3Title')}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 dark:text-darkMuted leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

