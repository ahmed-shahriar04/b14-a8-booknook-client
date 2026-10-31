'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-cream-200 text-forest-950 flex items-center justify-center font-bold text-2xl font-serif mb-4 shadow-sm">
        404
      </div>
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mb-2">
        Page Not Found
      </h1>
      <p className="text-xs text-stone-500 max-w-sm mb-6 leading-relaxed">
        The book shelf or page you are looking for has been moved, archived, or does not exist in our library index.
      </p>
      <Link
        href="/"
        className="bg-forest-950 hover:bg-forest-900 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}

