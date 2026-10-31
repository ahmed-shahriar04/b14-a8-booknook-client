'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from '../../lib/auth-client';
import toast from 'react-hot-toast';

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    document.title = 'BookNook | My Borrows';
    if (!isPending && !session?.user) {
      toast.error('Please log in to see your borrowed books');
      router.push('/login?callbackUrl=/my-borrows');
    }
  }, [session, isPending, router]);

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
      toast.error('Failed to load borrow records');
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
        toast.success('Book returned successfully! Thank you for returning on time.');
        setBorrows((prev) => prev.filter((item) => item._id !== borrowId));
      } else {
        toast.error(result.message || 'Failed to return book');
      }
    } catch {
      toast.error('Error connecting to return service');
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
          READING IN PROGRESS
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
          My Borrows
        </h1>
        <p className="text-xs text-stone-500">
          Books you have borrowed from the library. Return them once you finish to replenish copies!
        </p>
      </div>

      {borrows.length > 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-cream-200 text-forest-950 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Book Title</th>
                  <th className="py-3.5 px-4">Borrow Date</th>
                  <th className="py-3.5 px-4">Return Due Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {borrows.map((item) => (
                  <tr key={item._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                          <Image
                            src={item.bookImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'}
                            alt={item.bookTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-bold text-forest-950">{item.bookTitle}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-medium">
                      {new Date(item.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-800">
                      {new Date(item.returnDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleReturnBook(item._id)}
                        disabled={returningId === item._id}
                        className="bg-forest-950 hover:bg-forest-900 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm transition-colors"
                      >
                        {returningId === item._id ? 'Returning...' : 'Return Book'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-200">
          <p className="text-sm font-semibold text-forest-950 mb-1">No borrowed books</p>
          <p className="text-xs text-stone-500 mb-4">
            You do not have any active book loans. Ready to read something new?
          </p>
          <button
            onClick={() => router.push('/books')}
            className="bg-forest-950 text-white text-xs px-6 py-2.5 rounded-full font-semibold hover:bg-forest-900 shadow-sm"
          >
            Explore Library
          </button>
        </div>
      )}
    </div>
  );
}

