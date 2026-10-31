'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from '../../lib/auth-client';
import toast from 'react-hot-toast';

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingBook, setEditingBook] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirm Modal State (custom modal per requirement)
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = 'BookNook | My Books';
    if (!isPending && !session?.user) {
      toast.error('Please log in to manage your books');
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
        // Filter only books added by the logged in user
        const myBooks = (data.data || []).filter((b) => b.userEmail === session.user.email);
        setBooks(myBooks);
      }
    } catch {
      toast.error('Failed to load your books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchMyBooks();
    }
  }, [session]);

  // Handle Edit Submit
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
        toast.success('Book updated successfully!');
        setEditingBook(null);
        fetchMyBooks();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch {
      toast.error('Server communication error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle Delete Confirmation
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
        toast.success('Book deleted from catalogue');
        setBooks((prev) => prev.filter((b) => b._id !== deletingBookId));
        setDeletingBookId(null);
      } else {
        toast.error(result.message || 'Failed to delete');
      }
    } catch {
      toast.error('Error deleting book');
    } finally {
      setDeleting(false);
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
          CONTRIBUTION ARCHIVE
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
          My Books
        </h1>
        <p className="text-xs text-stone-500">
          Books you have catalogued into the BookNook library system.
        </p>
      </div>

      {books.length > 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-cream-200 text-forest-950 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Book</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Available Copies</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                          <Image
                            src={book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-forest-950">{book.title}</p>
                          <p className="text-[11px] text-stone-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-cream-100 text-forest-900 font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-forest-950">
                      {book.totalCopies}
                    </td>
                    <td className="py-3 px-4 text-stone-400">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingBook({ ...book })}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-cream-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingBookId(book._id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-semibold hover:bg-rose-100 transition-colors"
                      >
                        Delete
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
          <p className="text-sm font-semibold text-forest-950 mb-1">No books added yet</p>
          <p className="text-xs text-stone-500 mb-4">
            You haven&apos;t contributed any books to the community library yet.
          </p>
          <button
            onClick={() => router.push('/add-book')}
            className="bg-forest-950 text-white text-xs px-6 py-2.5 rounded-full font-semibold hover:bg-forest-900 shadow-sm"
          >
            Add Your First Book
          </button>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-cream-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-forest-950 mb-1">
              Edit Book Information
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Update details for &ldquo;{editingBook.title}&rdquo;.
            </p>

            <form onSubmit={handleUpdateBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Author</label>
                <input
                  type="text"
                  required
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category</label>
                  <select
                    value={editingBook.category}
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 cursor-pointer"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Kids">Kids</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingBook.totalCopies}
                    onChange={(e) => setEditingBook({ ...editingBook, totalCopies: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={editingBook.image}
                  onChange={(e) => setEditingBook({ ...editingBook, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingBook.description}
                  onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-600 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-full bg-forest-950 hover:bg-forest-900 text-white font-semibold shadow-sm transition-colors"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal (no browser confirm per rules) */}
      {deletingBookId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-cream-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              !
            </div>
            <h3 className="text-lg font-serif font-bold text-forest-950 mb-1">
              Delete This Book?
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Are you sure you want to remove this book from BookNook? This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingBookId(null)}
                className="flex-1 py-2.5 rounded-full border border-stone-300 text-stone-600 font-semibold text-xs hover:bg-stone-50"
              >
                Keep Book
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

