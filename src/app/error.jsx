'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faRotateRight, faHouse } from '@fortawesome/free-solid-svg-icons';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[450px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-darkCard rounded-3xl p-8 border border-cream-200 dark:border-darkBorder shadow-lg text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </div>

        <div>
          <h2 className="text-xl font-bold font-serif text-forest-950 dark:text-white mb-2">
            অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে
          </h2>
          <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla leading-relaxed">
            পেজটি লোড করার সময় সাময়িক সমস্যা হয়েছিল। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা হোমপেজে ফিরে যান।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-bangla text-xs font-bold">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-950 dark:bg-[#FF7A59] text-white hover:opacity-90 transition-all shadow-sm"
          >
            <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
            <span>আবার চেষ্টা করুন</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cream-100 dark:bg-darkBorder text-stone-700 dark:text-darkText hover:bg-cream-200 transition-all"
          >
            <FontAwesomeIcon icon={faHouse} className="text-xs" />
            <span>হোমে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

