'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from '../../lib/auth-client';
import toast from 'react-hot-toast';
import { useLang } from '../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReceipt,
  faBookOpen,
  faArrowRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t, lang } = useLang();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    document.title = lang === 'bn' ? 'BookNook | ধার নেওয়া বইসমূহ' : 'BookNook | My Borrow Records';
    if (!isPending && !session?.user) {
      toast.error(lang === 'bn' ? 'ধার নেওয়া বই দেখতে লগইন করুন' : 'Please login to view borrowed books');
      router.push('/login?callbackUrl=/my-borrows');
    }
  }, [session, isPending, router, lang]);

  const fetchMyBorrows = async () => {
    try {
      setLoading(true);
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const res = await fetch(`${serverUrl}/borrows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setBorrows(data.data || []);
      }
    } catch {
      toast.error(lang === 'bn' ? 'ধার নেওয়ার তথ্য লোড করা যায়নি' : 'Failed to load borrow records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyBorrows();
    }
  }, [session]);

  const handleReturnBook = async (borrowId) => {
    setReturningId(borrowId);
    try {
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const res = await fetch(`${serverUrl}/borrows/${borrowId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(lang === 'bn' ? 'বইটি সফলভাবে ফেরত দেওয়া হয়েছে! কপি সংখ্যা বৃদ্ধি পেয়েছে।' : 'Book returned successfully! Stock replenished.');
        setBorrows((prev) => prev.filter((item) => item._id !== borrowId));
      } else {
        toast.error(result.message || (lang === 'bn' ? 'বই ফেরত দেওয়া সম্ভব হয়নি' : 'Could not return book'));
      }
    } catch {
      toast.error(lang === 'bn' ? 'সার্ভার যোগাযোগে সমস্যা' : 'Server error');
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-4 border-forest-950 dark:border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      {/* Smart Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-cream-50 dark:bg-darkCard p-6 rounded-3xl border border-cream-200 dark:border-darkBorder">
        <div>
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase font-bangla">
            {t('readingTrackerBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            {t('myBorrowsTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla">
            {t('myBorrowsSub')}
          </p>
        </div>

        <Link
          href="/books"
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm font-bangla"
        >
          <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
          <span>{t('findMoreBooksBtn')}</span>
        </Link>
      </div>

      {borrows.length > 0 ? (
        <div className="bg-white dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 dark:bg-stone-900/50 border-b border-cream-200 dark:border-darkBorder text-forest-950 dark:text-white font-bold uppercase tracking-wider text-[11px] font-bangla">
                <tr>
                  <th className="py-4 px-5">{t('bookAndAuthorCol')}</th>
                  <th className="py-4 px-5">{t('borrowDateCol')}</th>
                  <th className="py-4 px-5">{t('returnDueDateCol')}</th>
                  <th className="py-4 px-5 text-right">{t('actionCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 dark:divide-darkBorder">
                {borrows.map((item) => (
                  <tr key={item._id} className="hover:bg-cream-50/50 dark:hover:bg-darkBorder/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-16 rounded-xl overflow-hidden bg-cream-100 dark:bg-stone-800 shrink-0 shadow-inner">
                          <Image
                            src={item.bookImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'}
                            alt={item.bookTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-bold text-sm text-forest-950 dark:text-white font-bangla">{item.bookTitle}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-stone-600 dark:text-darkText font-medium">
                      {new Date(item.borrowDate).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-amber-700 dark:text-amber-400">
                      {new Date(item.returnDate).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US')}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleReturnBook(item._id)}
                        disabled={returningId === item._id}
                        className="bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all font-bangla inline-flex items-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faArrowRotateLeft} className="text-[10px]" />
                        <span>{returningId === item._id ? t('returningBookStatus') : t('returnBookActionBtn')}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-cream-50 dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder">
          <div className="w-14 h-14 rounded-full bg-cream-200 dark:bg-darkBg text-forest-950 dark:text-[#FF7A59] flex items-center justify-center text-lg mx-auto mb-3 shadow-xs">
            <FontAwesomeIcon icon={faReceipt} />
          </div>
          <h3 className="text-base font-bold text-forest-950 dark:text-white mb-1 font-bangla">
            {t('noBorrowedBooksTitle')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-darkMuted mb-6 max-w-sm mx-auto font-bangla leading-relaxed">
            {t('noBorrowedBooksSub')}
          </p>
          <button
            onClick={() => router.push('/books')}
            className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs px-6 py-2.5 rounded-full font-bold hover:bg-forest-900 shadow-sm font-bangla"
          >
            {t('exploreLibraryBtn')}
          </button>
        </div>
      )}
    </div>
  );
}
