'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faShieldHalved, faHandshakeAngle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function RulesBorrowingPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 font-bangla">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-10 border border-cream-200 dark:border-darkBorder shadow-sm">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
          কমিউনিটি নিয়মাবলী • BORROWING RULES
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 mb-4">
          বই ধার নেওয়ার নিয়মাবলী
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-darkMuted mb-8 leading-relaxed">
          BookNook হলো বইপ্রেমীদের একটি প্রাণবন্ত উন্মুক্ত কমিউনিটি লাইব্রেরি। পাঠকদের মধ্যে শৃঙ্খলা বজায় রাখতে নিচের নিয়মগুলো মেনে চলার অনুরোধ করা হচ্ছে:
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-darkText">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">ধার নেওয়ার সর্বোচ্চ সময়সীমা</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">প্রতিটি বই সর্বোচ্চ ১৪ (চৌদ্দ) দিনের জন্য ধার নেওয়া যায়। নির্দিষ্ট সময়সীমার মধ্যে বই ফেরত দেওয়া বাধ্যতামূলক।</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">একই বই একাধিকবার ধার নেওয়া নিষেধ (No Double Borrow)</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">একই বই এক পাঠক একই সাথে দুইবার ধার নিতে পারবেন না। পূর্বের বইটি ফেরত দেওয়ার পরই পুনরায় ধার করা যাবে।</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">কপি ও স্টক অটোমেশন</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">বই ধার নেওয়ার সাথে সাথে লাইব্রেরির মোট কপি ১টি কমে যায় এবং ফেরত দিলে স্বয়ংক্রিয়ভাবে কপি যুক্ত হয়।</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream-200 dark:border-darkBorder flex gap-3">
          <Link
            href="/books"
            className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-forest-900 transition-all"
          >
            বইসমগ্র দেখুন
          </Link>
          <Link
            href="/"
            className="border border-cream-300 dark:border-darkBorder text-stone-700 dark:text-darkText text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-cream-50 dark:hover:bg-darkBorder transition-all"
          >
            হোম পেজে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}

