'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXTwitter,
  faGithub,
  faLinkedinIn,
  faFacebookF
} from '@fortawesome/free-brands-svg-icons';
import { faHeart, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLang } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Footer() {
  const { lang, setLang, t } = useLang();

  const handleLangChange = (selected) => {
    setLang(selected);
    toast.success(selected === 'bn' ? 'ভাষা পরিবর্তন করা হয়েছে: বাংলা' : 'Language changed to: English');
  };

  return (
    <footer className="bg-white dark:bg-darkCard border-t border-cream-200 dark:border-darkBorder mt-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 text-stone-600 dark:text-darkMuted w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Row Wise Layout Above HR Line */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-8">
          
          {/* Column 1: Brand & Community Mission */}
          <div className="lg:max-w-md space-y-3">
            <span className="font-bold text-2xl tracking-tight text-forest-950 dark:text-white font-serif">
              BookNook
            </span>
            <p className="text-xs text-stone-500 dark:text-darkMuted leading-relaxed font-bangla">
              {t('footerDesc')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder flex items-center justify-center text-forest-950 dark:text-darkText hover:bg-forest-950 hover:text-white transition-all text-xs"
              >
                <FontAwesomeIcon icon={faXTwitter} className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder flex items-center justify-center text-forest-950 dark:text-darkText hover:bg-forest-950 hover:text-white transition-all text-xs"
              >
                <FontAwesomeIcon icon={faGithub} className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder flex items-center justify-center text-forest-950 dark:text-darkText hover:bg-forest-950 hover:text-white transition-all text-xs"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-cream-100 dark:bg-darkBorder flex items-center justify-center text-forest-950 dark:text-darkText hover:bg-forest-950 hover:text-white transition-all text-xs"
              >
                <FontAwesomeIcon icon={faFacebookF} className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Row of Navigations & Info on Desktop / Flex on Mobile */}
          <div className="flex flex-wrap sm:flex-nowrap gap-10 sm:gap-16 w-full lg:w-auto">
            {/* Quick Links */}
            <div className="space-y-2 min-w-[140px]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 dark:text-white font-bangla">
                {t('quickLinks')}
              </h4>
              <ul className="text-xs space-y-2 text-stone-500 dark:text-darkMuted font-bangla">
                <li>
                  <Link href="/" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {t('home')}
                  </Link>
                </li>
                <li>
                  <Link href="/books" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {t('browseBooks')}
                  </Link>
                </li>
                <li>
                  <Link href="/add-book" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {t('addBook')}
                  </Link>
                </li>
                <li>
                  <Link href="/my-borrows" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {t('myBorrows')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community Rules Links (Dedicated Pages) */}
            <div className="space-y-2 min-w-[150px]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 dark:text-white font-bangla">
                {t('communityRules')}
              </h4>
              <ul className="text-xs space-y-2 text-stone-500 dark:text-darkMuted font-bangla">
                <li>
                  <Link href="/rules/borrowing" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {lang === 'bn' ? 'ধার নেওয়ার নিয়মাবলী' : 'Borrowing Rules'}
                  </Link>
                </li>
                <li>
                  <Link href="/rules/free-exchange" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {lang === 'bn' ? 'বিনামূল্যে আদান-প্রদান' : 'Free Exchange'}
                  </Link>
                </li>
                <li>
                  <Link href="/rules/book-care" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {lang === 'bn' ? 'বইয়ের যত্ন ও নিরাপত্তা' : 'Book Care & Safety'}
                  </Link>
                </li>
                <li>
                  <Link href="/rules/community-guidelines" className="hover:text-forest-950 dark:hover:text-white transition-colors">
                    {lang === 'bn' ? 'কমিউনিটি গাইডলাইন' : 'Community Guidelines'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact info */}
            <div className="space-y-2 min-w-[140px]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 dark:text-white font-bangla">
                {t('contactSupport')}
              </h4>
              <p className="text-xs text-stone-500 dark:text-darkMuted font-bangla">ধানমন্ডি, ঢাকা, বাংলাদেশ</p>
              <p className="text-xs text-stone-500 dark:text-darkMuted font-medium">librarian@booknook.dev</p>
              <p className="text-xs text-stone-500 dark:text-darkMuted">+880 1700-000000</p>
            </div>
          </div>

        </div>

        {/* Multi-language Selector in Footer (Only Bangla & English as requested) */}
        <div className="py-4 border-t border-cream-200 dark:border-darkBorder flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600 dark:text-darkMuted font-bangla">
            <FontAwesomeIcon icon={faGlobe} className="text-[#FF7A59]" />
            <span className="font-semibold">{t('selectLanguage')}</span>
          </div>

          {/* Only 2 languages: BN & ENG */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLangChange('bn')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                lang === 'bn'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white shadow-xs'
                  : 'bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted hover:bg-cream-200'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              onClick={() => handleLangChange('en')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                lang === 'en'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white shadow-xs'
                  : 'bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted hover:bg-cream-200'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* HR Line Separator */}
        <hr className="border-cream-200 dark:border-darkBorder my-2" />

        {/* Bottom Copyright & Personal Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 dark:text-darkMuted gap-3">
          <p>© {new Date().getFullYear()} BookNook Library System. {t('rightsReserved')}</p>
          <p className="flex items-center gap-1.5 font-medium">
            {t('createdBy')} <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-[10px]" /> by{' '}
            <a
              href="https://shahriarahmedriaz.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="text-forest-950 dark:text-[#FF7A59] font-bold hover:underline"
            >
              Shahriar Ahmed Riaz
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
