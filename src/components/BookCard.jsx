'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faXmark,
  faCircleCheck,
  faCalendarDays,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useSession } from '../lib/auth-client';
import { useLang } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function BookCard({ book }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLang();

  // Details Modal & Borrow Sub-modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [copies, setCopies] = useState(book.totalCopies ?? 0);

  const coverUrl = book.image && book.image.trim() !== ''
    ? book.image
    : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

  const handleOpenModal = () => {
    // Default 14 days return date
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setReturnDate(d.toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error(t('login') + ' required');
      setModalOpen(false);
      return router.push(`/login?callbackUrl=/books`);
    }

    if (copies <= 0) {
      return toast.error(t('outOfStock'));
    }

    setBorrowing(true);
    try {
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
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
        setCopies((prev) => Math.max(0, prev - 1));
        setModalOpen(false);
        router.push('/my-borrows');
      } else {
        toast.error(result.message || 'Borrow failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <>
      {/* Compact, Sleek Book Card (Much more compact & elegant) */}
      <div
        onClick={handleOpenModal}
        className="bg-white dark:bg-darkCard rounded-2xl p-2.5 sm:p-3 border border-cream-200 dark:border-darkBorder shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group h-full cursor-pointer"
      >
        {/* Compact Book Cover Image */}
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-cream-100 dark:bg-stone-800 mb-2 shadow-inner">
          <Image
            src={coverUrl}
            alt={book.title || 'Book Cover'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-1.5 right-1.5 bg-white/95 dark:bg-darkCard/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] font-bold text-forest-950 dark:text-white border border-cream-200 dark:border-darkBorder shadow-xs font-bangla">
            {book.category || 'General'}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-forest-950 dark:text-white line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-[#FF7A59] transition-colors font-bangla">
              {book.title}
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-darkMuted font-medium line-clamp-1 font-bangla mt-0.5">
              {book.author}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-cream-100 dark:border-darkBorder flex items-center justify-between text-[10px]">
            <span className="text-stone-400 dark:text-darkMuted font-medium font-bangla">
              {t('copiesCount')}: <strong className={copies > 0 ? 'text-forest-900 dark:text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                {copies}
              </strong>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal();
              }}
              className="font-semibold bg-forest-950 dark:bg-[#FF7A59] text-white px-2.5 py-1 rounded-lg hover:bg-forest-900 transition-colors flex items-center gap-1 font-bangla"
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-[9px]" />
              <span>{t('viewDetails')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Book Details Modal (Instead of page redirection) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-darkCard rounded-3xl p-5 sm:p-7 max-w-xl w-full border border-cream-200 dark:border-darkBorder shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted flex items-center justify-center hover:bg-cream-200 dark:hover:bg-stone-800 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>

            {/* Modal Content */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Cover in Modal */}
              <div className="relative w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-cream-100 dark:bg-stone-800 shrink-0 mx-auto sm:mx-0">
                <Image
                  src={coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 space-y-3 font-bangla text-xs">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-cream-100 dark:bg-darkBorder text-[10px] font-bold text-forest-950 dark:text-white">
                    {book.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-forest-950 dark:text-white mt-1 leading-snug">
                    {book.title}
                  </h2>
                  <p className="text-stone-500 dark:text-darkMuted font-medium text-xs">
                    {t('authorBy')}: <strong className="text-forest-950 dark:text-white">{book.author}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-cream-200 dark:border-darkBorder text-[11px]">
                  <div>
                    <span className="text-stone-400 block">{t('availableStock')}</span>
                    <strong className={copies > 0 ? 'text-forest-950 dark:text-emerald-400 text-sm' : 'text-rose-500 text-sm'}>
                      {copies > 0 ? `${copies} ${t('copiesCount')}` : t('outOfStock')}
                    </strong>
                  </div>
                  {book.userName && (
                    <div className="border-l border-cream-200 dark:border-darkBorder pl-4">
                      <span className="text-stone-400 block">{t('addedBy')}</span>
                      <strong className="text-forest-900 dark:text-white">{book.userName}</strong>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-forest-950 dark:text-white text-xs mb-1">
                    {t('aboutBook')}
                  </h4>
                  <p className="text-stone-600 dark:text-darkMuted leading-relaxed max-h-32 overflow-y-auto pr-1">
                    {book.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Form Area Inside Modal */}
            <form onSubmit={handleBorrow} className="mt-5 pt-4 border-t border-cream-200 dark:border-darkBorder font-bangla">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full flex items-center gap-2 bg-cream-50 dark:bg-darkBg px-3 py-2 rounded-xl border border-cream-200 dark:border-darkBorder">
                  <FontAwesomeIcon icon={faCalendarDays} className="text-[#FF7A59] text-xs" />
                  <span className="text-xs text-stone-500 dark:text-darkMuted shrink-0">{t('returnDueDate')}:</span>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-transparent text-xs text-forest-950 dark:text-white focus:outline-none w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={borrowing || copies <= 0}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all whitespace-nowrap ${
                    copies > 0
                      ? 'bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 text-white'
                      : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {borrowing ? 'Confirming...' : copies > 0 ? t('borrowThisBook') : t('outOfStock')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
