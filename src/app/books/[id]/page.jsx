'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faCalendarDays,
  faUser,
  faCircleCheck,
  faXmark,
  faArrowLeft,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { useSession } from '../../../lib/auth-client';
import { useLang } from '../../../context/LanguageContext';
import { getServerUrl } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t, lang } = useLang();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  const bookId = params?.id;

  // Strict Private Route Protection per Section 4.3 of assignment specs
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error(
        lang === 'bn'
          ? 'বইয়ের বিবরণ দেখতে ও ধার নিতে অনুগ্রহ করে লগইন করুন'
          : 'Please sign in to view book details and borrow'
      );
      router.push(`/login?callbackUrl=/books/${bookId}`);
    }
  }, [session, isPending, router, bookId, lang]);

  useEffect(() => {
    // Default return date: 14 days from today
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setReturnDate(d.toISOString().split('T')[0]);

    const fetchBook = async () => {
      try {
        const serverUrl = getServerUrl();
        const res = await fetch(`${serverUrl}/books/${bookId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBook(data.data);
          document.title = `BookNook | ${data.data.title}`;
        } else {
          toast.error(data.message || (lang === 'bn' ? 'বইটি খুঁজে পাওয়া যায়নি' : 'Book not found'));
        }
      } catch {
        toast.error(lang === 'bn' ? 'বইয়ের তথ্য লোড করতে ব্যর্থ হয়েছে' : 'Failed to load book information');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId, lang]);

  // Check if current logged-in user already borrowed this book
  useEffect(() => {
    if (session?.user && bookId) {
      const checkBorrow = async () => {
        try {
          const jwtRes = await fetch('/api/jwt');
          const jwtData = await jwtRes.json();
          const token = jwtData?.token;
          if (token) {
            const serverUrl = getServerUrl();
            const res = await fetch(`${serverUrl}/borrows/check/${bookId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success && data.hasBorrowed) {
              setAlreadyTaken(true);
            }
          }
        } catch (_) {}
      };
      checkBorrow();
    }
  }, [session, bookId]);

  const handleOpenBorrowModal = () => {
    if (!session?.user) {
      toast.error(lang === 'bn' ? 'ধার নিতে লগইন করুন' : 'Please log in to borrow');
      return router.push(`/login?callbackUrl=/books/${bookId}`);
    }
    if (alreadyTaken) {
      return toast.error(lang === 'bn' ? 'আপনি ইতোমধ্যে বইটি ধার নিয়েছেন' : 'Already taken by you');
    }
    if (book.totalCopies <= 0) {
      return toast.error(t('outOfStock'));
    }
    setBorrowModalOpen(true);
  };

  const handleConfirmBorrow = async (e) => {
    e.preventDefault();
    setBorrowing(true);

    try {
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = getServerUrl();
      const res = await fetch(`${serverUrl}/borrows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          returnDate: returnDate,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(t('borrowSuccess'));
        setBorrowModalOpen(false);
        setAlreadyTaken(true);
        setBook((prev) => ({ ...prev, totalCopies: Math.max(0, (prev?.totalCopies || 1) - 1) }));
        router.push('/my-borrows');
      } else {
        toast.error(result.message || 'Borrow failed');
      }
    } catch {
      toast.error(lang === 'bn' ? 'সার্ভার যোগাযোগ ত্রুটি' : 'Error connecting to borrow service');
    } finally {
      setBorrowing(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-4 border-forest-950 dark:border-[#FF7A59] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 bg-cream-50 dark:bg-darkCard rounded-3xl p-8 border border-cream-200 dark:border-darkBorder max-w-md mx-auto my-10">
        <h2 className="text-xl font-bold font-serif text-forest-950 dark:text-white mb-2">
          {lang === 'bn' ? 'বইটি খুঁজে পাওয়া যায়নি' : 'Book Not Found'}
        </h2>
        <p className="text-xs text-stone-500 dark:text-darkMuted mb-6 font-bangla">
          {lang === 'bn' ? 'এই বইটি লাইব্রেরি ইনডেক্সে বিদ্যমান নেই।' : 'This book was not found in our catalogue.'}
        </p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 bg-forest-950 dark:bg-[#FF7A59] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-all font-bangla"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          <span>{lang === 'bn' ? 'সকল বইয়ে ফিরুন' : 'Back to All Books'}</span>
        </Link>
      </div>
    );
  }

  const coverUrl =
    book.image && book.image.trim() !== ''
      ? book.image
      : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 font-bangla animate-in fade-in duration-300">
      {/* Top back navigation */}
      <div className="mb-4">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-darkMuted hover:text-forest-950 dark:hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          <span>{lang === 'bn' ? 'সকল বইয়ের তালিকায় ফিরুন' : 'Back to All Books'}</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-10 border border-cream-200 dark:border-darkBorder shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md bg-cream-100 dark:bg-stone-800 border border-cream-200 dark:border-darkBorder">
          <Image
            src={coverUrl}
            alt={book.title || 'Book cover'}
            fill
            className="object-cover"
          />
          {alreadyTaken && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1.5 z-10">
              <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
              <span>{lang === 'bn' ? 'আপনার ধার করা' : 'Already Taken by You'}</span>
            </div>
          )}
        </div>

        {/* Book Details Info */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-cream-100 dark:bg-darkBorder px-3 py-1 rounded-full text-xs font-semibold text-forest-950 dark:text-white border border-cream-200 dark:border-stone-700 mb-2">
              {book.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mb-1">
              {book.title}
            </h1>
            <p className="text-sm text-stone-500 dark:text-darkMuted font-medium mb-4">
              {t('authorBy')}: <strong className="text-forest-950 dark:text-white">{book.author}</strong>
            </p>

            {/* Copies status */}
            <div className="flex items-center gap-4 py-3 border-y border-cream-200 dark:border-darkBorder my-4 text-xs">
              <div>
                <span className="text-stone-400 block">{t('availableStock')}</span>
                <span
                  className={`text-base font-bold ${
                    alreadyTaken
                      ? 'text-amber-600 dark:text-amber-400'
                      : book.totalCopies > 0
                      ? 'text-forest-950 dark:text-emerald-400'
                      : 'text-rose-600'
                  }`}
                >
                  {alreadyTaken
                    ? lang === 'bn' ? 'ইতোমধ্যে আপনি ধার নিয়েছেন' : 'Already taken by you'
                    : book.totalCopies > 0
                    ? `${book.totalCopies} ${t('copiesCount')}`
                    : t('outOfStock')}
                </span>
              </div>
              <div className="border-l border-cream-200 dark:border-darkBorder pl-4">
                <span className="text-stone-400 block">{t('addedBy')}</span>
                <span className="font-semibold text-forest-900 dark:text-white">
                  {book.userName || 'Community Reader'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="my-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-darkMuted mb-2">
                {t('aboutBook')}
              </h3>
              <p className="text-xs md:text-sm text-stone-600 dark:text-darkText leading-relaxed whitespace-pre-line">
                {book.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Borrow Action Area */}
          <div className="pt-6">
            {alreadyTaken ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-base">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                      {lang === 'bn' ? 'ইতোমধ্যে আপনি ধার নিয়েছেন (Already taken by you)' : 'Already taken by you'}
                    </h4>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                      {t('alreadyTakenDesc')}
                    </p>
                  </div>
                </div>

                <Link
                  href="/my-borrows"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all text-center whitespace-nowrap"
                >
                  {t('viewInMyBorrows')}
                </Link>
              </div>
            ) : (
              <button
                onClick={handleOpenBorrowModal}
                disabled={book.totalCopies <= 0}
                className={`w-full py-3.5 rounded-full font-bold text-xs tracking-wide transition-all shadow-sm ${
                  book.totalCopies > 0
                    ? 'bg-forest-950 hover:bg-forest-900 dark:bg-[#FF7A59] dark:hover:bg-[#ff6842] text-white shadow-md'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                }`}
              >
                {book.totalCopies > 0 ? t('borrowThisBook') : t('outOfStock')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      {borrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 max-w-md w-full border border-cream-200 dark:border-darkBorder shadow-2xl relative">
            <button
              onClick={() => setBorrowModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted flex items-center justify-center hover:bg-cream-200"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>

            <h2 className="text-xl font-serif font-bold text-forest-950 dark:text-white mb-1">
              {t('confirmBorrowTitle')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-darkMuted mb-4">
              {book.title}
            </p>

            <form onSubmit={handleConfirmBorrow} className="space-y-3.5 text-xs font-bangla">
              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
                  {lang === 'bn' ? 'ব্যবহারকারীর নাম' : 'User Name'}
                </label>
                <input
                  type="text"
                  readOnly
                  value={session?.user?.name || 'Reader'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-200 dark:border-darkBorder bg-cream-100 dark:bg-stone-900 text-stone-500 dark:text-darkMuted cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
                  {lang === 'bn' ? 'ব্যবহারকারীর ইমেইল' : 'User Email'}
                </label>
                <input
                  type="email"
                  readOnly
                  value={session?.user?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-200 dark:border-darkBorder bg-cream-100 dark:bg-stone-900 text-stone-500 dark:text-darkMuted cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">
                  {t('returnDueDate')}
                </label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none focus:border-forest-950 dark:focus:border-[#FF7A59]"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setBorrowModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-stone-300 dark:border-darkBorder text-stone-600 dark:text-darkMuted font-semibold hover:bg-stone-50 dark:hover:bg-darkBorder transition-colors"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex-1 py-2.5 rounded-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-bold shadow-md transition-all"
                >
                  {borrowing ? '...' : t('confirmBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
