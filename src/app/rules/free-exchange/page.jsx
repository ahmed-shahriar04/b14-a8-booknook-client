'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookBookmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function FreeExchangePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 font-bangla">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-10 border border-cream-200 dark:border-darkBorder shadow-sm">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
          কমিউনিটি নির্দেশিকা • FREE EXCHANGE
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 mb-4">
          বিনামূল্যে বই আদান-প্রদান নীতি
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-darkMuted mb-8 leading-relaxed">
          BookNook সম্পূর্ণ অলাভজনক একটি ডিজিটাল প্ল্যাটফর্ম। বই পড়া এবং জ্ঞান বিতরণে কোনো আর্থিক লেনদেন বা সাবস্ক্রিপশন ফি নেওয়া হয় না।
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-darkText">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">১০০% সম্পূর্ণ ফ্রি</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">বই পড়া, তালিকাভুক্ত করা এবং ধার নেওয়া সকলের জন্য আজীবন বিনামূল্যে উন্মুক্ত থাকবে।</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">উন্মুক্ত অবদান</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">যে কেউ নিজের ব্যক্তিগত বইয়ের তালিকা যোগ করে অন্য পাঠকদের সাথে ভাগাভাগি করতে পারেন।</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream-200 dark:border-darkBorder flex gap-3">
          <Link
            href="/add-book"
            className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-forest-900 transition-all"
          >
            বই যোগ করুন
          </Link>
          <Link
            href="/"
            className="border border-cream-300 dark:border-darkBorder text-stone-700 dark:text-darkText text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-cream-50 dark:hover:bg-darkBorder transition-all"
          >
            হোম পেজ
          </Link>
        </div>
      </div>
    </div>
  );
}

