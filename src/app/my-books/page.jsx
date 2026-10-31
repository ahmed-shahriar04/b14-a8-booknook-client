'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from '../../lib/auth-client';
import toast from 'react-hot-toast';
import StylishSelect from '../../components/StylishSelect';
import { useLang } from '../../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faPlus,
  faPenToSquare,
  faTrashCan,
  faLayerGroup,
  faBookBookmark
} from '@fortawesome/free-solid-svg-icons';

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t, lang } = useLang();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirm Modal State
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | My Books Dashboard';
    if (!isPending && !session?.user) {
      toast.error('বই পরিচালনা করতে অনুগ্রহ করে লগইন করুন');
      router.push('/login?callbackUrl=/my-books');
    }
  }, [session, isPending, router]);

  const fetchMyBooks = async () => {
    if (!session?.user?.email) return;
    try {
      setLoading(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const res = await fetch(`${serverUrl}/books`);
      const data = await res.json();
      if (data.success) {
        const myBooks = (data.data || []).filter((b) => b.userEmail === session.user.email);
        setBooks(myBooks);
      }
    } catch {
      toast.error('বইসমূহ লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyBooks();
    }
  }, [session]);

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const res = await fetch(`${serverUrl}/books/${editingBook._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingBook),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('বইয়ের তথ্য সফলভাবে আপডেট হয়েছে!');
        setEditingBook(null);
        fetchMyBooks();
      } else {
        toast.error(result.message || 'আপডেট ব্যর্থ হয়েছে');
      }
    } catch {
      toast.error('সার্ভার এরর');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingBookId) return;
    setDeleting(true);
    try {
      const jwtRes = await fetch('/api/jwt');
      const jwtData = await jwtRes.json();
      const token = jwtData?.token;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const res = await fetch(`${serverUrl}/books/${deletingBookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success('বইটি লাইব্রেরি থেকে মুছে ফেলা হয়েছে');
        setBooks((prev) => prev.filter((b) => b._id !== deletingBookId));
        setDeletingBookId(null);
      } else {
        toast.error(result.message || 'ডিলিট ব্যর্থ হয়েছে');
      }
    } catch {
      toast.error('এরর দেখা দিয়েছে');
    } finally {
      setDeleting(false);
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
            {lang === 'bn' ? 'ইউজার কন্ট্রোল প্যানেল • MY DASHBOARD' : 'USER CONTROL PANEL • MY DASHBOARD'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 dark:text-white mt-1 font-bangla">
            {t('myBooksTitle')}
          </h1>
          <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla">
            {t('myBooksSub')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm font-bangla"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>{t('addNewBookBtn')}</span>
          </Link>
        </div>
      </div>

      {books.length > 0 ? (
        <div className="bg-white dark:bg-darkCard rounded-3xl border border-cream-200 dark:border-darkBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 dark:bg-stone-900/50 border-b border-cream-200 dark:border-darkBorder text-forest-950 dark:text-white font-bold uppercase tracking-wider text-[11px] font-bangla">
                <tr>
                  <th className="py-4 px-5">{t('bookAndAuthorCol')}</th>
                  <th className="py-4 px-5">{t('categoryField')}</th>
                  <th className="py-4 px-5">{t('copiesRemainingCol')}</th>
                  <th className="py-4 px-5">{t('dateAddedCol')}</th>
                  <th className="py-4 px-5 text-right">{t('actionCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 dark:divide-darkBorder">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-cream-50/50 dark:hover:bg-darkBorder/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-16 rounded-xl overflow-hidden bg-cream-100 dark:bg-stone-800 shrink-0 shadow-inner">
                          <Image
                            src={book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-forest-950 dark:text-white font-bangla">{book.title}</p>
                          <p className="text-[11px] text-stone-500 dark:text-darkMuted font-bangla">
                            {t('authorBy')}: {book.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-3 py-1 rounded-full bg-cream-100 dark:bg-darkBorder text-forest-900 dark:text-cream-200 font-semibold font-bangla text-[11px]">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-forest-950 dark:text-white font-bangla">
                      <span className={book.totalCopies > 0 ? 'text-forest-900 dark:text-emerald-400' : 'text-rose-500'}>
                        {book.totalCopies} {t('copiesCount')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-stone-500 dark:text-darkMuted text-[11px]">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US') : (lang === 'bn' ? 'সাম্প্রতিক' : 'Recent')}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <button
                        onClick={() => setEditingBook({ ...book })}
                        className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-darkText font-semibold hover:bg-cream-100 dark:hover:bg-stone-800 transition-colors font-bangla inline-flex items-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-[10px]" />
                        <span>{t('editBtn')}</span>
                      </button>
                      <button
                        onClick={() => setDeletingBookId(book._id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 transition-colors font-bangla inline-flex items-center gap-1.5"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="text-[10px]" />
                        <span>{t('deleteBtn')}</span>
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
            <FontAwesomeIcon icon={faBookBookmark} />
          </div>
          <h3 className="text-base font-bold text-forest-950 dark:text-white mb-1 font-bangla">
            {t('noBooksAddedYet')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-darkMuted mb-6 max-w-sm mx-auto font-bangla leading-relaxed">
            {t('noBooksAddedSub')}
          </p>
          <button
            onClick={() => router.push('/add-book')}
            className="bg-forest-950 dark:bg-[#FF7A59] text-white text-xs px-6 py-2.5 rounded-full font-bold hover:bg-forest-900 transition-all font-bangla"
          >
            {t('addFirstBookAction')}
          </button>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 max-w-lg w-full border border-cream-200 dark:border-darkBorder shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-forest-950 dark:text-white mb-1 font-bangla">
              {t('editBookTitleModal')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-darkMuted mb-4 font-bangla">
              &ldquo;{editingBook.title}&rdquo; {t('editBookDescModal')}
            </p>

            <form onSubmit={handleUpdateBook} className="space-y-3.5 text-xs font-bangla">
              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('bookTitleField')}</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('authorField')}</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('categoryField')}</label>
                  <StylishSelect
                    value={editingBook.category}
                    onChange={(val) => setEditingBook({ ...editingBook, category: val })}
                    options={[
                      { label: lang === 'bn' ? 'উপন্যাস ও ফিকশন' : 'Fiction', value: 'Fiction' },
                      { label: lang === 'bn' ? 'বিজ্ঞান ও প্রযুক্তি' : 'Science', value: 'Science' },
                      { label: lang === 'bn' ? 'ইতিহাস ও ঐতিহ্য' : 'History', value: 'History' },
                      { label: lang === 'bn' ? 'কিশোর ও শিশুতোষ' : 'Kids', value: 'Kids' },
                      { label: lang === 'bn' ? 'অন্যান্য সাহিত্য' : 'Others', value: 'Others' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('totalCopiesField')}</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingBook.totalCopies}
                    onChange={(e) => setEditingBook({ ...editingBook, totalCopies: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('coverImgField')}</label>
                <input
                  type="url"
                  required
                  value={editingBook.image}
                  onChange={(e) => setEditingBook({ ...editingBook, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-darkText font-semibold mb-1">{t('shortDescField')}</label>
                <textarea
                  rows="3"
                  required
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 dark:border-darkBorder bg-cream-50/50 dark:bg-darkBg text-forest-950 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-darkMuted font-semibold hover:bg-stone-50 dark:hover:bg-darkBorder"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 text-white font-bold shadow-sm transition-all"
                >
                  {savingEdit ? '...' : t('saveChangesBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingBookId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-darkCard rounded-3xl p-6 md:p-8 max-w-sm w-full border border-cream-200 dark:border-darkBorder shadow-2xl text-center font-bangla">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              !
            </div>
            <h3 className="text-lg font-bold text-forest-950 dark:text-white mb-1">
              {t('deleteConfirmModalTitle')}
            </h3>
            <p className="text-xs text-stone-500 dark:text-darkMuted mb-6">
              {t('deleteConfirmModalSub')}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingBookId(null)}
                className="flex-1 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-darkMuted font-semibold text-xs hover:bg-stone-50 dark:hover:bg-darkBorder"
              >
                {t('cancelBtn')}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                {deleting ? '...' : t('yesDeleteBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
