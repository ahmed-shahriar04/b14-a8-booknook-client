'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HomeBannerSlider() {
  const { lang, t } = useLang();

  const slides = [
    {
      id: 1,
      tag: lang === 'bn' ? 'প্রেরণাদায়ী বাণী • INSPIRATION' : 'INSPIRING WISDOM',
      quote: lang === 'bn'
        ? '“বই হচ্ছে এমন এক মাধ্যম যা কোনো সীমানা মানে না, আত্মার গভীরতম স্থানকে জাগিয়ে তোলে।”'
        : '“Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.”',
      subQuote: lang === 'bn'
        ? '“Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.”'
        : '“বই হচ্ছে এমন এক মাধ্যম যা কোনো সীমানা মানে না, আত্মার গভীরতম স্থানকে জাগিয়ে তোলে।”',
      authorName: lang === 'bn' ? 'রবীন্দ্রনাথ ঠাকুর' : 'Rabindranath Tagore',
      authorTitle: lang === 'bn' ? 'নোবেলজয়ী বিশ্বকবি ও সাহিত্যিক' : 'Nobel Laureate Poet & Philosopher',
      image: 'https://cdn.britannica.com/49/134949-050-242B08C7/Rabindranath-Tagore.jpg',
      gradient: 'from-[#FAF6F0] via-[#F2EAE0] to-[#E6DACB] dark:from-[#1E2522] dark:via-[#19201D] dark:to-[#121615]',
      accentColor: 'text-[#FF7A59]',
    },
    {
      id: 2,
      tag: lang === 'bn' ? 'সাহিত্য দর্শন • LITERARY WISDOM' : 'LITERARY PASSION',
      quote: lang === 'bn'
        ? '“বই পড়া মানুষের মনের তৃষ্ণা মেটায়, চিন্তাশক্তিকে প্রসারিত করে এবং একজন মানুষকে প্রকৃত মানুষ হিসেবে গড়ে তোলে।”'
        : '“A reader lives a thousand lives before he dies. The man who never reads lives only one.”',
      subQuote: lang === 'bn'
        ? '“A reader lives a thousand lives before he dies. The man who never reads lives only one.”'
        : '“বই পড়া মানুষের মনের তৃষ্ণা মেটায়, চিন্তাশক্তিকে প্রসারিত করে এবং একজন মানুষকে প্রকৃত মানুষ হিসেবে গড়ে তোলে।”',
      authorName: lang === 'bn' ? 'কাজী নজরুল ইসলাম' : 'Kazi Nazrul Islam',
      authorTitle: lang === 'bn' ? 'বিদ্রোহী কবি ও জাতীয় কবি' : 'National Rebel Poet of Bangladesh',
      image: 'https://m.media-amazon.com/images/M/MV5BMThhMDNlZTgtNDhlYS00OGVjLWIwZjMtZTdhYTE1Yjk4MGY1XkEyXkFqcGc@._V1_.jpg',
      gradient: 'from-[#F5EFE6] via-[#E8DFD4] to-[#DDD0C0] dark:from-[#212925] dark:via-[#1A221F] dark:to-[#121615]',
      accentColor: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      id: 3,
      tag: lang === 'bn' ? 'জ্ঞানের আলো • PHILOSOPHY OF READING' : 'BEACON OF KNOWLEDGE',
      quote: lang === 'bn'
        ? '“লাইব্রেরি হলো এমন একটি মন্দির, যেখানে সকল যুগের জ্ঞানী ব্যক্তিদের চিন্তা সংরক্ষিত থাকে মানুষের কল্যাণে।”'
        : '“There is no friend as loyal as a book. In books, we discover the collective wisdom of all humanity.”',
      subQuote: lang === 'bn'
        ? '“There is no friend as loyal as a book. In books, we discover the collective wisdom of humanity.”'
        : '“লাইব্রেরি হলো এমন একটি মন্দির, যেখানে সকল যুগের জ্ঞানী ব্যক্তিদের চিন্তা সংরক্ষিত থাকে মানুষের কল্যাণে।”',
      authorName: lang === 'bn' ? 'হুমায়ূন আহমেদ' : 'Humayun Ahmed',
      authorTitle: lang === 'bn' ? 'জনপ্রিয় কথাসাহিত্যিক ও চলচ্চিত্রকার' : 'Legendary Novelist & Storyteller',
      image: 'https://i.ucanews.com/ucanews/uploads/2012/07/ahmed.gif',
      gradient: 'from-[#ECE6DC] via-[#E0D5C7] to-[#D5C6B5] dark:from-[#252E2A] dark:via-[#1C2420] dark:to-[#121615]',
      accentColor: 'text-amber-800 dark:text-amber-400',
    },
  ];

  return (
    <div className="rounded-3xl overflow-hidden shadow-sm border border-cream-200 dark:border-darkBorder bg-[#F4EFEA] dark:bg-[#1A221F] transition-colors duration-300">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        fadeEffect={{
          crossFade: true,
        }}
        speed={700}
        loop={true}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="mySwiper rounded-3xl bg-[#F4EFEA] dark:bg-[#1A221F]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative bg-gradient-to-r ${slide.gradient} p-6 sm:p-10 md:p-12 min-h-[300px] sm:min-h-[340px] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden`}>
              {/* Right Side: Brush Styled Translucent Author Silhouette */}
              <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none opacity-25 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen overflow-hidden">
                <div className="relative w-full h-full [mask-image:linear-gradient(to_left,black_60%,transparent_100%)]">
                  <Image
                    src={slide.image}
                    alt={slide.authorName}
                    fill
                    className="object-cover object-center filter grayscale contrast-125"
                  />
                </div>
              </div>

              {/* Left Side: Motivational Quote & Speaker Details */}
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faQuoteLeft} className={`${slide.accentColor} text-sm`} />
                  <span className={`text-[11px] font-extrabold tracking-widest uppercase ${slide.accentColor} font-bangla`}>
                    {slide.tag}
                  </span>
                </div>

                {/* Primary Motivational Quote */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-forest-950 dark:text-white leading-snug sm:leading-relaxed mb-3 font-bangla">
                  {slide.quote}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-darkMuted italic font-serif mb-4 leading-relaxed line-clamp-2">
                  {slide.subQuote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-2 mb-6">
                  <div className="w-1.5 h-10 rounded-full bg-[#142E2A] dark:bg-[#FF7A59]"></div>
                  <div>
                    <h4 className="font-bold text-sm text-forest-950 dark:text-white font-bangla">
                      {slide.authorName}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla">
                      {slide.authorTitle}
                    </p>
                  </div>
                </div>

                <div>
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg font-bangla"
                  >
                    <FontAwesomeIcon icon={faBookOpenReader} className="text-xs" />
                    <span>{t('bannerBrowseBtn')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
