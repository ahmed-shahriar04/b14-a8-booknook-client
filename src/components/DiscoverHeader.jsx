'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function DiscoverHeader() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set('search', searchTerm.trim());
    if (selectedCategory && selectedCategory !== 'All Categories') {
      query.set('category', selectedCategory);
    }
    router.push(`/books?${query.toString()}`);
  };

  return (
    <div className="bg-[#EBE5DC] rounded-3xl p-5 sm:p-7 md:p-8 border border-cream-200">
      <div className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-forest-950 tracking-tight font-serif mb-4 sm:mb-6">
          Discover
        </h1>

        {/* Responsive Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl sm:rounded-full p-2 sm:pl-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shadow-sm border border-stone-200"
        >
          {/* Category Dropdown */}
          <div className="flex items-center gap-1 text-xs text-stone-600 font-semibold px-2 border-b sm:border-b-0 sm:border-r border-stone-200 py-1.5 sm:py-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer pr-2 text-forest-950 font-medium text-xs w-full"
            >
              <option value="All Categories">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 px-2 py-1 sm:py-0">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-stone-400 text-xs shrink-0" />
            <input
              type="text"
              placeholder="find the book you like...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-forest-950 placeholder-stone-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* Search Action Button */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#142E2A] hover:bg-[#1B3B36] text-white px-6 py-2.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
