'use client';

import { useState, useEffect } from 'react';
import BookCard from '../../components/BookCard';

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'BookNook | All Books';
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
      const query = new URLSearchParams();
      if (category && category !== 'All') query.set('category', category);
      if (search.trim()) query.set('search', search.trim());

      const res = await fetch(`${serverUrl}/books?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBooks(data.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const categories = ['All', 'Fiction', 'Science', 'History', 'Kids', 'Others'];

  return (
    <div className="py-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
            COMPLETE ARCHIVE
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
            All Books
          </h1>
          <p className="text-xs text-stone-500">
            Explore our curated selection of literature, science, and non-fiction.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  category === cat
                    ? 'bg-forest-950 text-white border-forest-950 font-semibold'
                    : 'bg-white text-stone-600 border-cream-300 hover:border-forest-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search title/author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-full border border-cream-300 focus:outline-none focus:border-forest-950 bg-white"
            />
            <button
              type="submit"
              className="text-xs bg-cream-200 hover:bg-cream-300 px-3 py-1.5 rounded-full font-semibold text-forest-950 transition-colors"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Grid: 3 cards per row on desktop as required */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-200">
          <p className="text-sm font-semibold text-forest-950 mb-1">No books found</p>
          <p className="text-xs text-stone-500 mb-4">
            Try adjusting your search criteria or add the first book in this category.
          </p>
        </div>
      )}
    </div>
  );
}

