'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCompass } from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';

export default function NotFound() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-white dark:bg-darkCard rounded-3xl p-8 border border-cream-200 dark:border-darkBorder shadow-xl text-center space-y-6">
        {/* Badge & Graphic */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-cream-100 dark:bg-stone-800 flex items-center justify-center text-forest-950 dark:text-[#FF7A59] text-3xl font-serif font-extrabold shadow-inner border border-cream-200 dark:border-stone-700">
          <span>404</span>
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#FF7A59] text-white flex items-center justify-center text-xs shadow-md">
            <FontAwesomeIcon icon={faCompass} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-forest-950 dark:text-white mb-2">
            {t('pageNotFound')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-darkMuted font-bangla leading-relaxed max-w-sm mx-auto">
            {t('pageNotFoundDesc')}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white text-xs font-bold transition-all shadow-md font-bangla"
          >
            <FontAwesomeIcon icon={faHouse} className="text-xs" />
            <span>{t('backToHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
