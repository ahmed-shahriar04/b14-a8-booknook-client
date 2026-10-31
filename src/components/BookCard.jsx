import Image from 'next/image';
import Link from 'next/link';

export default function BookCard({ book }) {
  // Graceful fallback for unrendered or missing cover links
  const coverUrl = book.image && book.image.trim() !== ''
    ? book.image
    : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-cream-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full">
      {/* Book Cover Image Container */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-cream-100 mb-3 shadow-inner">
        <Image
          src={coverUrl}
          alt={book.title || 'Book Cover'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-forest-950 border border-cream-200 shadow-xs">
          {book.category || 'General'}
        </div>
      </div>

      {/* Book Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-forest-950 line-clamp-1 group-hover:text-amber-800 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-stone-500 font-medium mb-1 line-clamp-1">
            by {book.author}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-medium">
            Copies: <strong className={book.totalCopies > 0 ? 'text-forest-900 font-bold' : 'text-rose-500 font-bold'}>
              {book.totalCopies ?? 0}
            </strong>
          </span>

          <Link
            href={`/books/${book._id}`}
            className="text-xs font-semibold bg-forest-950 text-white px-3.5 py-1.5 rounded-xl hover:bg-forest-900 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
