'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHeart, faHandHoldingHeart, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function BookCarePage() {
  return (
    <div className="max-w-4xl mx-auto py-6 font-bangla">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-10 border border-cream-200 dark:border-darkBorder shadow-sm">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
          বই সংরক্ষণ • BOOK CARE
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 mb-4">
          বইয়ের যত্ন ও নিরাপত্তা
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-darkMuted mb-8 leading-relaxed">
          প্রতিটি বই জ্ঞানের একটি অমূল্য রত্ন। আমাদের কমিউনিটির প্রতিটি বইয়ের সঠিক সংরক্ষণ পাঠকদের নৈতিক দায়িত্ব।
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-darkText">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">মৌলিক তথ্য সংরক্ষণ</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">বইয়ের শিরোনাম, লেখক এবং কভার ছবির মান বজায় রেখে সঠিক তথ্য প্রদান করতে হবে।</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">সময়মতো রিটার্ন সংস্কৃতি</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">বই পড়া শেষ হলে দেরি না করে রিটার্ন বাটনে চাপুন যাতে পরবর্তী পাঠক পড়ার সুযোগ পায়।</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream-200 dark:border-darkBorder flex gap-3">
          <Link
            href="/my-borrows"
            className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-forest-900 transition-all"
          >
            আমার ধার নেওয়া বই
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

