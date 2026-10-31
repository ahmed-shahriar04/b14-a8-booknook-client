'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSliders,
  faXmark,
  faPenNib,
  faLayerGroup,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';
import StylishSelect from './StylishSelect';
import { getServerUrl } from '../lib/api';

export default function DiscoverHeader() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');

  const categories = [
    { label: lang === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories', value: 'All' },
    { label: lang === 'bn' ? 'উপন্যাস ও ফিকশন' : 'Fiction', value: 'Fiction' },
    { label: lang === 'bn' ? 'বিজ্ঞান ও প্রযুক্তি' : 'Science', value: 'Science' },
    { label: lang === 'bn' ? 'ইতিহাস ও ঐতিহ্য' : 'History', value: 'History' },
    { label: lang === 'bn' ? 'কিশোর ও শিশুতোষ' : 'Kids', value: 'Kids' },
    { label: lang === 'bn' ? 'অন্যান্য সাহিত্য' : 'Others', value: 'Others' },
  ];

  const [authorOptions, setAuthorOptions] = useState([
    { label: lang === 'bn' ? 'সকল লেখক (All Authors)' : 'All Authors', value: 'All' },
  ]);

  // Fetch unique authors dynamically from books database
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
            { label: lang === 'bn' ? 'সকল লেখক (All Authors)' : 'All Authors', value: 'All' },
            ...list,
          ]);
        }
      } catch (err) {
        console.error('Failed to load authors:', err);
      }
    };

    fetchAuthors();
  }, [lang]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set('search', searchTerm.trim());
    if (selectedCategory !== 'All') query.set('category', selectedCategory);
    if (selectedAuthor !== 'All') query.set('author', selectedAuthor);

    setFilterModalOpen(false);
    router.push(`/books?${query.toString()}`);
  };

  const handleReset = () => {
    setSelectedCategory('All');
    setSelectedAuthor('All');
  };

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + (selectedAuthor !== 'All' ? 1 : 0);

  return (
    <div className="bg-[#EBE5DC] dark:bg-darkCard rounded-3xl p-5 sm:p-7 md:p-8 border border-cream-200 dark:border-darkBorder transition-colors duration-300">
      <div className="max-w-3xl">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-widest uppercase font-bangla">
          {t('discoverBadge')}
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-forest-950 dark:text-white tracking-tight font-serif mt-1 mb-2">
          {t('discoverTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-darkMuted mb-6 font-bangla leading-relaxed">
          {t('discoverDesc')}
        </p>

        {/* Search Bar with Filter Open Trigger */}
        <form
          onSubmit={handleSearch}
          className="bg-white dark:bg-darkBg rounded-2xl sm:rounded-full p-2 sm:pl-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shadow-md border border-stone-200 dark:border-darkBorder"
        >
          {/* Filter Modal Trigger Button */}
          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            className="flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2 rounded-xl sm:rounded-full bg-cream-50 dark:bg-darkCard hover:bg-cream-100 dark:hover:bg-stone-800 text-forest-950 dark:text-white text-xs font-semibold border border-cream-200 dark:border-darkBorder transition-all font-bangla"
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSliders} className="text-[#FF7A59] text-xs" />
              <span>{t('filterBtn')}</span>
            </div>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF7A59] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 px-2 py-1 sm:py-0">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-stone-400 text-xs shrink-0" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-forest-950 dark:text-white placeholder-stone-400 focus:outline-none bg-transparent font-bangla"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#142E2A] dark:bg-[#FF7A59] hover:bg-[#1B3B36] dark:hover:bg-[#ff6842] text-white px-7 py-2.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm font-bangla"
          >
            {t('searchBtn')}
          </button>
        </form>
      </div>

      {/* Advanced Filter Modal with StylishSelect */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-cream-200 dark:border-darkBorder shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-cream-200 dark:border-darkBorder">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSliders} className="text-[#FF7A59]" />
                <h3 className="font-bold text-base text-forest-950 dark:text-white font-bangla">
                  {t('filterTitle')}
                </h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted flex items-center justify-center hover:bg-cream-200"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <div className="space-y-5 font-bangla text-xs">
              {/* Category */}
              <div>
                <label className="block font-bold text-forest-950 dark:text-white mb-2 flex items-center gap-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-stone-400 text-xs" />
                  <span>{t('categoryLabel')}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedCategory(c.value)}
                      className={`px-3 py-2 rounded-xl text-left border transition-all truncate ${
                        selectedCategory === c.value
                          ? 'bg-forest-950 dark:bg-[#FF7A59] text-white font-bold border-forest-950 dark:border-[#FF7A59]'
                          : 'bg-cream-50/50 dark:bg-darkBg text-stone-700 dark:text-darkText border-cream-200 dark:border-darkBorder hover:bg-cream-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author with StylishSelect */}
              <div>
                <label className="block font-bold text-forest-950 dark:text-white mb-2 flex items-center gap-2">
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
            </div>

            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-cream-200 dark:border-darkBorder font-bangla">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-300 dark:border-darkBorder text-stone-600 dark:text-darkMuted text-xs font-semibold hover:bg-cream-50 dark:hover:bg-darkBorder"
              >
                <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                <span>{t('resetBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSearch()}
                className="flex-1 bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white py-2.5 rounded-full text-xs font-bold shadow-md transition-all text-center"
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
