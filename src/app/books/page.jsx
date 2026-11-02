'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookCard from '../../components/BookCard';
import StylishSelect from '../../components/StylishSelect';
import { useLang } from '../../context/LanguageContext';
import { useSession } from '../../lib/auth-client';
import { getServerUrl } from '../../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSliders,
  faRotateRight,
  faFolderOpen,
  faMagnifyingGlass,
  faLayerGroup,
  faPenNib,
  faCheck,
  faBolt,
  faXmark,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons';

function BooksContent() {
  const searchParams = useSearchParams();
  const { lang, t } = useLang();
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBorrowedIds, setUserBorrowedIds] = useState(new Set());

  // Smart Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'All');
  const [selectedAuthor, setSelectedAuthor] = useState(searchParams?.get('author') || 'All');
  const [authorOptions, setAuthorOptions] = useState([
    { label: lang === 'bn' ? 'সকল লেখক' : 'All Authors', value: 'All' },
  ]);
  const [search, setSearch] = useState(searchParams?.get('search') || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const retryRef = useRef(0);

  // Sync with searchParams if navigated from external
  useEffect(() => {
    const s = searchParams?.get('search');
    const c = searchParams?.get('category');
    const a = searchParams?.get('author');
    if (s !== null && s !== undefined) setSearch(s);
    if (c !== null && c !== undefined) setSelectedCategory(c);
    if (a !== null && a !== undefined) setSelectedAuthor(a);
  }, [searchParams]);

  useEffect(() => {
    document.title = lang === 'bn' ? 'BookNook | বইসমগ্র (Browse Books)' : 'BookNook | Browse Library Books';
  }, [lang]);

  // Fetch unique authors dynamically from real database books
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const serverUrl = getServerUrl();
        const res = await fetch(`${serverUrl}/books?limit=200`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const unique = Array.from(
            new Set(json.data.map((b) => b.author?.trim()).filter(Boolean))
          ).sort((a, b) => a.localeCompare(b));

          const list = unique.map((author) => ({ label: author, value: author }));
          setAuthorOptions([
            { label: lang === 'bn' ? 'সকল লেখক' : 'All Authors', value: 'All' },
            ...list,
          ]);
        }
      } catch (_) {}
    };

    fetchAuthors();
  }, [lang]);

  // Fetch user's active borrowed book IDs
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
              const ids = new Set(data.data.map((b) => b.bookId));
              setUserBorrowedIds(ids);
            }
          }
        } catch (_) {}
      };
      fetchUserBorrows();
    } else {
      setUserBorrowedIds(new Set());
    }
  }, [session]);

  const categories = [
    { label: lang === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories', value: 'All' },
    { label: lang === 'bn' ? 'উপন্যাস ও ফিকশন' : 'Fiction', value: 'Fiction' },
    { label: lang === 'bn' ? 'বিজ্ঞান ও প্রযুক্তি' : 'Science', value: 'Science' },
    { label: lang === 'bn' ? 'ইতিহাস ও ঐতিহ্য' : 'History', value: 'History' },
    { label: lang === 'bn' ? 'কিশোর ও শিশুতোষ' : 'Kids', value: 'Kids' },
    { label: lang === 'bn' ? 'অন্যান্য সাহিত্য' : 'Others', value: 'Others' },
  ];

  const fetchBooks = async (isRetry = false) => {
    try {
      if (!isRetry) setLoading(true);
      const serverUrl = getServerUrl();
      const query = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') query.set('category', selectedCategory);
      if (search.trim()) query.set('search', search.trim());
      if (selectedAuthor && selectedAuthor !== 'All') query.set('search', selectedAuthor);

      const res = await fetch(`${serverUrl}/books?${query.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setBooks(data.data);
        retryRef.current = 0;
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.warn('Fetch books notice (server may be waking up):', err.message);
      if (retryRef.current < 6) {
        retryRef.current++;
        setTimeout(() => fetchBooks(true), 3500);
        return;
      }
      setBooks([]);
    } finally {
      if (retryRef.current === 0 || retryRef.current >= 6) {
        setLoading(false);
      }
    }
  };

  // Live Speed Search: Debounced search whenever search text or filters change
  useEffect(() => {
    retryRef.current = 0;
    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedAuthor]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchBooks();
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedAuthor('All');
    setSearch('');
  };

  const activeCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedAuthor !== 'All' ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="py-2 sm:py-4 font-bangla">
      {/* Top Page Header */}
      <div className="mb-6 bg-cream-50 dark:bg-darkCard p-6 rounded-3xl border border-cream-200 dark:border-darkBorder">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-widest uppercase">
          {lang === 'bn' ? 'বইপ্রেমীদের উন্মুক্ত সংগ্রহশালা • BROWSE BOOKS' : 'OPEN COMMUNITY ARCHIVE • BROWSE BOOKS'}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-forest-950 dark:text-white mt-1">
          {lang === 'bn' ? 'বাংলা ও বিশ্ব সাহিত্যের বইয়ের বিশাল লাইব্রেরি' : 'Explore Global & Bengali Literary Gems'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-darkMuted mt-1">
          {lang === 'bn'
            ? 'ক্যাটাগরি, লেখক ও প্রকাশকাল ফিল্টার করে আপনার পছন্দের বইটি সহজে খুঁজে নিন ও বিনামূল্যে ধার করুন।'
            : 'Filter by category, author, and era to quickly discover and borrow books from the community catalogue.'}
        </p>
      </div>

      {/* Main Browse Layout: Left Filter Panel + Right Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        
        {/* Left Smart Filter Panel with Stylish Custom Selects */}
        <aside className="hidden lg:block bg-white dark:bg-darkCard rounded-3xl p-5 border border-cream-200 dark:border-darkBorder shadow-sm sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkBorder">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSliders} className="text-[#FF7A59] text-sm" />
              <h3 className="font-bold text-sm text-forest-950 dark:text-white">{t('filterTitle')}</h3>
            </div>
            {activeCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#FF7A59] hover:underline flex items-center gap-1 font-semibold"
              >
                <FontAwesomeIcon icon={faRotateRight} className="text-[10px]" />
                <span>{t('resetBtn')} ({activeCount})</span>
              </button>
            )}
          </div>

          {/* 1. Category Filter Section */}
          <div>
            <label className="block font-bold text-xs text-forest-950 dark:text-white mb-2.5 flex items-center gap-2">
              <FontAwesomeIcon icon={faLayerGroup} className="text-stone-400 text-xs" />
              <span>{t('categoryLabel')}</span>
            </label>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'bg-forest-950 dark:bg-[#FF7A59] text-white shadow-xs'
                        : 'text-stone-600 dark:text-darkMuted hover:bg-cream-100 dark:hover:bg-darkBorder hover:text-forest-950 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {isSelected && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Author Filter with Stylish Select */}
          <div className="pt-4 border-t border-cream-100 dark:border-darkBorder">
            <label className="block font-bold text-xs text-forest-950 dark:text-white mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faPenNib} className="text-stone-400 text-xs" />
              <span>{t('authorLabel')}</span>
            </label>
            <StylishSelect
              value={selectedAuthor}
              onChange={(val) => setSelectedAuthor(val)}
              options={authorOptions}
              searchable={true}
              searchPlaceholder={lang === 'bn' ? 'লেখক সার্চ করুন...' : 'Search author...'}
              placeholder={lang === 'bn' ? 'লেখক নির্বাচন করুন' : 'Select Author'}
            />
          </div>
        </aside>

        {/* Right Books Grid Area */}
        <div className="lg:col-span-3">
          {/* Search Bar & Result Counter + Mobile Filter Trigger */}
          <div className="bg-white dark:bg-darkCard rounded-2xl p-3.5 mb-6 border border-cream-200 dark:border-darkBorder shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs text-stone-500 dark:text-darkMuted">
                {lang === 'bn' ? 'মোট প্রাপ্তি: ' : 'Total Books: '}
                <strong className="text-forest-950 dark:text-white font-bold">{books.length}</strong> {lang === 'bn' ? 'টি বই' : 'titles'}
              </span>

              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-100 dark:bg-darkBorder text-forest-950 dark:text-white text-xs font-semibold"
              >
                <FontAwesomeIcon icon={faSliders} className="text-[#FF7A59] text-xs" />
                <span>{t('filterBtn')} ({activeCount})</span>
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:w-72 flex items-center gap-2 bg-cream-50 dark:bg-darkBg px-3.5 py-1.5 rounded-full border border-cream-300 dark:border-darkBorder relative focus-within:border-[#FF7A59] transition-colors">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-stone-400 text-xs shrink-0" />
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'লাইভ বই খুঁজুন (নাম বা লেখক)...' : 'Live speed search (title, author)...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-none text-forest-950 dark:text-white pr-6"
                />

                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-white flex items-center justify-center text-[9px]"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                    <FontAwesomeIcon icon={faBolt} className="text-[8px] animate-pulse" />
                    <span>{lang === 'bn' ? 'লাইভ' : 'Live'}</span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-forest-900 transition-colors shrink-0"
              >
                {t('searchBtn')}
              </button>
            </form>
          </div>

          {/* Compact Books Grid (3 cards per row on desktop per assignment specs) */}
          {loading ? (
            <div className="text-center py-16 px-6 bg-white dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder shadow-xs space-y-4 animate-in fade-in duration-300">
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-forest-950/10 dark:bg-[#FF7A59]/20 text-forest-950 dark:text-[#FF7A59] flex items-center justify-center text-2xl shadow-inner">
                <FontAwesomeIcon icon={faBookOpen} className="animate-bounce" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-bold text-base sm:text-lg text-forest-950 dark:text-white font-bangla">
                  {lang === 'bn'
                    ? 'বইসমূহ লোড হচ্ছে, অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন...'
                    : 'Loading books from catalogue, please wait a moment...'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla italic leading-relaxed">
                  {lang === 'bn'
                    ? '“বই পড়া মানুষের মনের তৃষ্ণা মেটায়, চিন্তাশক্তিকে প্রসারিত করে।”'
                    : '“A reader lives a thousand lives before he dies. Great books are worth a moment’s patience.”'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 font-bangla">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A59] animate-ping"></span>
                  <span className="text-[11px] font-semibold text-stone-500 dark:text-darkMuted">
                    {lang === 'bn'
                      ? 'সার্ভার থেকে সরাসরি ডাটা লোড করা হচ্ছে...'
                      : 'Fetching live books from database...'}
                  </span>
                </div>
              </div>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  isBorrowed={userBorrowedIds.has(book._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-6 bg-cream-50 dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder">
              <div className="w-14 h-14 rounded-full bg-cream-200 dark:bg-darkBg text-forest-950 dark:text-[#FF7A59] flex items-center justify-center text-lg mx-auto mb-3 shadow-xs">
                <FontAwesomeIcon icon={faFolderOpen} />
              </div>
              <h3 className="text-base font-bold text-forest-950 dark:text-white mb-1">
                {lang === 'bn' ? 'এই অনুসন্ধানে কোনো বই পাওয়া যায়নি' : 'No books found matching this filter'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-darkMuted mb-5 max-w-sm mx-auto leading-relaxed">
                {lang === 'bn'
                  ? 'অনুগ্রহ করে ফিল্টার পরিবর্তন করুন অথবা রিসেট করে সম্পূর্ণ লাইব্রেরি ব্রাউজ করুন।'
                  : 'Please adjust your search criteria or reset filters to browse the entire collection.'}
              </p>
              <button
                onClick={resetFilters}
                className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs px-6 py-2.5 rounded-full font-bold shadow-sm"
              >
                {t('seeAllBooks')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-in Filter Modal with StylishSelect */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 lg:hidden">
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 max-w-sm w-full border border-cream-200 dark:border-darkBorder shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkBorder">
              <h3 className="font-bold text-sm text-forest-950 dark:text-white">{t('filterTitle')}</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-950 dark:text-white mb-2">{t('categoryLabel')}</label>
              <StylishSelect
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                options={categories}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-950 dark:text-white mb-2">{t('authorLabel')}</label>
              <StylishSelect
                value={selectedAuthor}
                onChange={(val) => setSelectedAuthor(val)}
                options={authorOptions}
                searchable={true}
                searchPlaceholder={lang === 'bn' ? 'লেখক সার্চ করুন...' : 'Search author...'}
                placeholder={lang === 'bn' ? 'লেখক নির্বাচন করুন' : 'Select Author'}
              />
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 rounded-full border border-cream-300 dark:border-darkBorder text-xs text-stone-600 dark:text-darkMuted font-semibold"
              >
                {t('resetBtn')}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 rounded-full bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold"
              >
                {t('applyBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <div className="w-9 h-9 border-4 border-forest-950 dark:border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
