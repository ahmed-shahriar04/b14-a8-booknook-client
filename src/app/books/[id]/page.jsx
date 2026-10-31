'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from '../../../lib/auth-client';
import toast from 'react-hot-toast';

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [returnDate, setReturnDate] = useState('');

  const bookId = params.id;

  useEffect(() => {
    // Default return date: 14 days from today
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setReturnDate(d.toISOString().split('T')[0]);

    const fetchBook = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        const res = await fetch(`${serverUrl}/books/${bookId}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.data);
          document.title = `BookNook | ${data.data.title}`;
        } else {
          toast.error(data.message || 'Book not found');
        }
      } catch {
        toast.error('Failed to load book information');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId]);

  const handleOpenBorrowModal = () => {
    if (!session?.user) {
      toast.error('Please log in to borrow this book');
      return router.push(`/login?callbackUrl=/books/${bookId}`);
    }
    if (book.totalCopies <= 0) {
      return toast.error('This book is currently out of stock');
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
        toast.success('Book borrowed successfully! Enjoy your reading.');
        setBorrowModalOpen(false);
        // Update local state copy count
        setBook((prev) => ({ ...prev, totalCopies: Math.max(0, prev.totalCopies - 1) }));
        router.push('/my-borrows');
      } else {
        toast.error(result.message || 'Borrow failed');
      }
    } catch {
      toast.error('Error connecting to borrow service');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-forest-950">Book Not Found</h2>
        <button
          onClick={() => router.push('/books')}
          className="mt-4 bg-forest-950 text-white text-xs px-6 py-2 rounded-full"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-cream-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-md bg-cream-100">
          <Image
            src={book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Book Details Info */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="inline-block bg-cream-100 px-3 py-1 rounded-full text-xs font-semibold text-forest-950 border border-cream-200 mb-2">
              {book.category}
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mb-1">
              {book.title}
            </h1>
            <p className="text-sm text-stone-500 font-medium mb-4">
              Written by <strong className="text-forest-950">{book.author}</strong>
            </p>

            {/* Copies status */}
            <div className="flex items-center gap-4 py-3 border-y border-cream-200 my-4 text-xs">
              <div>
                <span className="text-stone-400 block">Available Copies</span>
                <span className={`text-base font-bold ${book.totalCopies > 0 ? 'text-forest-950' : 'text-rose-600'}`}>
                  {book.totalCopies > 0 ? `${book.totalCopies} left in stock` : 'Not Available (0 copies)'}
                </span>
              </div>
              <div className="border-l border-cream-200 pl-4">
                <span className="text-stone-400 block">Added by</span>
                <span className="font-semibold text-forest-900">{book.userName || 'Community Reader'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="my-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                About This Edition
              </h3>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>

          {/* Borrow Action */}
          <div className="pt-6">
            <button
              onClick={handleOpenBorrowModal}
              disabled={book.totalCopies <= 0}
              className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm ${
                book.totalCopies > 0
                  ? 'bg-forest-950 hover:bg-forest-900 text-white shadow-md'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {book.totalCopies > 0 ? 'Borrow This Book' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      {borrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-cream-200 shadow-2xl">
            <h2 className="text-xl font-serif font-bold text-forest-950 mb-1">
              Confirm Borrow
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Review your borrower credentials for &ldquo;{book.title}&rdquo;.
            </p>

            <form onSubmit={handleConfirmBorrow} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  readOnly
                  value={session?.user?.name || 'Reader'}
                  className="w-full px-3 py-2 rounded-xl border border-cream-200 bg-cream-100 text-stone-500 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Your Email</label>
                <input
                  type="email"
                  readOnly
                  value={session?.user?.email || ''}
                  className="w-full px-3 py-2 rounded-xl border border-cream-200 bg-cream-100 text-stone-500 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Return Due Date</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setBorrowModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={borrowing}
                  className="flex-1 py-2.5 rounded-full bg-forest-950 hover:bg-forest-900 text-white font-semibold shadow-sm transition-colors"
                >
                  {borrowing ? 'Confirming...' : 'Confirm Borrow'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

