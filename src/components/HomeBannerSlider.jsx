'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';

// Swiper core styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomeBannerSlider() {
  const slides = [
    {
      id: 1,
      tag: "EDITOR'S CHOICE",
      title: 'Expand Your Horizons Through Timeless Literature',
      description: 'Discover thousands of community curated books spanning science, history, fiction, and arts. Borrow instantly with a single click.',
      buttonText: 'Browse Books',
      bgColor: 'from-[#FAF8F5] to-[#EFE7DE]',
      accentColor: 'text-[#FF7A59]',
    },
    {
      id: 2,
      tag: 'NEW ARRIVALS 2026',
      title: 'Master Wealth & Psychology with Modern Classics',
      description: 'Dive into award-winning finance and personal growth books like Morgan Housel’s "The Psychology of Money" and Paul Jarvis’s "Company of One".',
      buttonText: 'Browse Books',
      bgColor: 'from-[#F3ECE4] to-[#E7DDD2]',
      accentColor: 'text-emerald-700',
    },
    {
      id: 3,
      tag: 'COMMUNITY LIBRARY',
      title: 'Share the Joy of Reading — Add Your Favorite Book',
      description: 'Join hundreds of fellow bibliophiles. Catalogue books from your personal shelf, manage copies, and track returns seamlessly.',
      buttonText: 'Browse Books',
      bgColor: 'from-[#ECE6DE] to-[#DDD2C5]',
      accentColor: 'text-amber-800',
    },
  ];

  return (
    <div className="rounded-3xl overflow-hidden shadow-sm border border-cream-200">
      <Swiper
        spaceBetween={20}
        centeredSlides={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper rounded-3xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`p-6 sm:p-8 md:p-12 bg-gradient-to-r ${slide.bgColor} flex flex-col justify-center min-h-[240px] sm:min-h-[280px]`}>
              <span className={`text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase ${slide.accentColor} mb-2`}>
                {slide.tag}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-forest-950 mb-3 max-w-2xl leading-snug">
                {slide.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mb-6 max-w-xl leading-relaxed">
                {slide.description}
              </p>
              <div>
                <Link
                  href="/books"
                  className="inline-block bg-forest-950 hover:bg-forest-900 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  {slide.buttonText} →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
