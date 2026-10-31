'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHandshake, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 font-bangla">
      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 sm:p-10 border border-cream-200 dark:border-darkBorder shadow-sm">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
          আদর্শ পাঠাগার নীতি • COMMUNITY GUIDELINES
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 mb-4">
          কমিউনিটি গাইডলাইন
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-darkMuted mb-8 leading-relaxed">
          BookNook একটি উন্মুক্ত ও সৌহার্দ্যপূর্ণ বইপ্রেমীদের মিলনমেলা। এখানে একে অপরকে সম্মান ও সহযোগিতার মাধ্যমে সেরা রিডিং অভিজ্ঞতা নিশ্চিত করা আমাদের লক্ষ্য।
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-darkText">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">সৎ ও নির্ভরযোগ্য তথ্য প্রদান</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">নতুন বই যোগ করার সময় সঠিক নাম, সঠিক লেখক ও বাস্তবসম্মত কপি সংখ্যা উল্লেখ করুন।</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkBg border border-cream-200 dark:border-darkBorder">
            <FontAwesomeIcon icon={faCircleCheck} className="text-[#FF7A59] mt-1 shrink-0" />
            <div>
              <h4 className="font-bold text-forest-950 dark:text-white mb-0.5">জ্ঞান বিতরণে পারস্পরিক শ্রদ্ধা</h4>
              <p className="text-stone-500 dark:text-darkMuted text-xs">পাঠকদের মতামত ও বিভিন্ন বিষয়ের বইয়ের প্রতি শ্রদ্ধাশীল মনোভাব বজায় রাখুন।</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream-200 dark:border-darkBorder flex gap-3">
          <Link
            href="/books"
            className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-forest-900 transition-all"
          >
            বইসমগ্র এক্সপ্লোর করুন
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

