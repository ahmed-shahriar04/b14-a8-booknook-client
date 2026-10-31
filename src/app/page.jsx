import Link from 'next/link';
import DiscoverHeader from '../components/DiscoverHeader';
import HomeBannerSlider from '../components/HomeBannerSlider';
import BookCard from '../components/BookCard';

// Dynamic server-side fetch from Express API
async function getNewArrivals() {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const res = await fetch(`${serverUrl}/books?limit=6&sort=newest`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.error('Error fetching new arrivals from server:', error);
    return [];
  }
}

export default async function HomePage() {
  const books = await getNewArrivals();

  const categories = [
    { name: 'Fiction', count: 'Explore stories', color: 'bg-purple-50 text-purple-900 border-purple-200' },
    { name: 'Science', count: 'Discover facts', color: 'bg-blue-50 text-blue-900 border-blue-200' },
    { name: 'History', count: 'Past chronicles', color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { name: 'Kids', count: 'Youth & wonder', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { name: 'Others', count: 'Diverse genres', color: 'bg-stone-50 text-stone-900 border-stone-200' },
  ];

  return (
    <div className="w-full space-y-8 md:space-y-12">
      {/* 1. Discover Header with Search Bar */}
      <DiscoverHeader />

      {/* 2. Swiper Banner Slider */}
      <HomeBannerSlider />

      {/* 3. New Arrivals (Dynamic from MongoDB) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
              NEW ARRIVALS
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-0.5">
              Book Recommendation
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Latest books catalogued in the BookNook community shelves
            </p>
          </div>
          <Link
            href="/books"
            className="self-start sm:self-auto text-xs font-semibold text-stone-700 bg-cream-100 hover:bg-cream-200 px-4 py-1.5 rounded-full border border-cream-300 transition-colors flex items-center gap-1.5"
          >
            <span>View all</span>
            <span className="text-[10px]">›</span>
          </Link>
        </div>

        {/* Dynamic Cards Grid or Clean Empty State */}
        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Required "See All Books" button below cards */}
            <div className="mt-8 text-center">
              <Link
                href="/books"
                className="inline-block bg-forest-950 hover:bg-forest-900 text-white font-semibold text-xs sm:text-sm px-8 py-3 rounded-full transition-all shadow-sm"
              >
                See All Books
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-6 bg-cream-50 rounded-3xl border border-cream-200">
            <div className="w-12 h-12 rounded-full bg-cream-200 text-forest-950 flex items-center justify-center font-serif font-bold mx-auto mb-3">
              📚
            </div>
            <h3 className="text-base font-serif font-bold text-forest-950 mb-1">
              No books found in the library yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6 leading-relaxed">
              Be the first reader to catalogue a book! Add any title from your shelf to start building the collection.
            </p>
            <Link
              href="/add-book"
              className="inline-block bg-forest-950 hover:bg-forest-900 text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-all shadow-sm"
            >
              Add Your First Book
            </Link>
          </div>
        )}
      </section>

      {/* 4. Book Category Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-forest-950">
            Book Category
          </h2>
          <span className="text-xs text-stone-400 font-medium">Browse by collection</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/books?category=${encodeURIComponent(cat.name)}`}
              className={`p-4 rounded-2xl border text-center transition-all hover:-translate-y-1 hover:shadow-sm ${cat.color}`}
            >
              <h4 className="text-xs font-bold leading-tight mb-1">{cat.name}</h4>
              <p className="text-[10px] opacity-75">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How Borrowing Works Section */}
      <section className="bg-cream-50 rounded-3xl p-6 sm:p-8 md:p-10 border border-cream-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-widest uppercase">
            SIMPLE 3-STEP SYSTEM
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
            How Borrowing Works at BookNook
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Enjoy frictionless borrowing without library fines or paper cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-cream-200 text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cream-100 text-forest-950 font-bold mx-auto flex items-center justify-center text-sm mb-3">
              1
            </div>
            <h3 className="font-bold text-sm text-forest-950 mb-1">Pick Your Book</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Browse our vast collection, check live availability copies, and read honest overviews.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-200 text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cream-100 text-forest-950 font-bold mx-auto flex items-center justify-center text-sm mb-3">
              2
            </div>
            <h3 className="font-bold text-sm text-forest-950 mb-1">One-Click Borrow</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Confirm your borrow in a flash. Our system automatically reserves your copy for 14 days.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-cream-200 text-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cream-100 text-forest-950 font-bold mx-auto flex items-center justify-center text-sm mb-3">
              3
            </div>
            <h3 className="font-bold text-sm text-forest-950 mb-1">Read & Return</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              View your borrows in your private dashboard. When finished, hit return to replenish the stock!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
