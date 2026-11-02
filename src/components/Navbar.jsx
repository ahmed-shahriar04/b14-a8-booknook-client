'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookJournalWhills,
  faRightFromBracket,
  faUser,
  faBars,
  faXmark,
  faBell,
  faHouse,
  faBookOpen,
  faPlus,
  faBookBookmark,
  faReceipt,
  faSun,
  faMoon,
  faTableColumns,
  faGlobe,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from '../lib/auth-client';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Navbar({ isUserPanel }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const burgerButtonRef = useRef(null);

  // Close dropdown & mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        burgerButtonRef.current &&
        !burgerButtonRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(lang === 'bn' ? 'সফলভাবে লগআউট হয়েছে' : 'Logged out successfully');
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { name: t('home'), href: '/', icon: faHouse },
    { name: t('browseBooks'), href: '/books', icon: faBookOpen },
    ...(session ? [
      { name: t('addBook'), href: '/add-book', icon: faPlus },
      { name: t('myBooks'), href: '/my-books', icon: faTableColumns },
      { name: t('myBorrows'), href: '/my-borrows', icon: faReceipt },
    ] : [])
  ];

  const toggleLanguage = () => {
    const next = lang === 'bn' ? 'en' : 'bn';
    setLang(next);
    toast.success(next === 'bn' ? 'ভাষা: বাংলা' : 'Language: English');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-darkCard/95 backdrop-blur-md border-b border-cream-200 dark:border-darkBorder px-3 sm:px-6 md:px-8 py-3 flex items-center justify-between transition-colors duration-300">
      
      {/* 1. Mobile Left: Hamburger Button | Desktop: Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          ref={burgerButtonRef}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-forest-950 dark:text-darkText rounded-xl hover:bg-cream-100 dark:hover:bg-darkBorder lg:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-xl w-5 h-5" />
        </button>

        <Link href="/" className="hidden lg:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#E8DFD6] dark:bg-forest-900 flex items-center justify-center text-forest-950 dark:text-cream-100 font-bold shadow-inner">
            <FontAwesomeIcon icon={faBookJournalWhills} className="text-sm w-4 h-4" />
          </div>
          <span className="font-serif font-extrabold text-xl tracking-tight text-forest-950 dark:text-white">
            BookNook
          </span>
          <span className="text-[10px] font-bangla px-2 py-0.5 rounded-full bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted font-medium">
            {t('librarySub')}
          </span>
        </Link>
      </div>

      {/* 2. Mobile Center: Website Name (BookNook) */}
      <div className="lg:hidden text-center">
        <Link href="/" className="flex items-center gap-1.5 justify-center">
          <span className="font-serif font-extrabold text-lg tracking-tight text-forest-950 dark:text-white">
            BookNook
          </span>
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-wider font-semibold transition-colors pb-1 font-bangla ${
                isActive
                  ? 'text-forest-950 dark:text-[#FF7A59] border-b-2 border-forest-950 dark:border-[#FF7A59]'
                  : 'text-stone-500 dark:text-darkMuted hover:text-forest-950 dark:hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Right: Lang Switcher, Theme Switcher, Notification & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1 rounded-full bg-cream-100 dark:bg-darkBorder text-forest-950 dark:text-white text-xs font-bold hover:bg-cream-200 dark:hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-xs"
          title="Switch Language"
        >
          <FontAwesomeIcon icon={faGlobe} className="text-[#FF7A59] text-xs" />
          <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-100 dark:bg-darkBorder text-stone-700 dark:text-amber-400 items-center justify-center hover:bg-cream-200 dark:hover:bg-stone-800 transition-all shadow-xs"
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-sm w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => toast(lang === 'bn' ? 'নতুন কোনো নোটিফিকেশন নেই' : 'No new notifications')}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-100 dark:bg-darkBorder text-stone-600 dark:text-darkMuted flex items-center justify-center hover:bg-cream-200 dark:hover:bg-stone-800 transition-colors"
          title="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-xs sm:text-sm w-3.5 h-3.5" />
        </button>

        {/* When Logged In: Modern Avatar Pill with FontAwesome faChevronDown */}
        {session?.user ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 bg-cream-100/90 dark:bg-darkBorder hover:bg-cream-200 dark:hover:bg-stone-800 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full transition-all border border-cream-200 dark:border-stone-700 shadow-xs"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden relative bg-[#E8DFD6] dark:bg-stone-700 flex items-center justify-center text-forest-950 dark:text-white font-bold shrink-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-xs w-3.5 h-3.5" />
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-forest-950 dark:text-white max-w-[120px] truncate">
                {session.user.name || 'User'}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-[9px] text-stone-500 dark:text-darkMuted transition-transform duration-200 ml-0.5 ${
                  dropdownOpen ? 'rotate-180 text-[#FF7A59]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu on Avatar Click */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-cream-200 dark:border-darkBorder p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-cream-100 dark:border-darkBorder">
                  <p className="text-xs font-bold text-forest-950 dark:text-white truncate font-bangla">{session.user.name}</p>
                  <p className="text-[11px] text-stone-500 dark:text-darkMuted truncate">{session.user.email}</p>
                </div>

                <div className="py-1 font-bangla">
                  <Link
                    href="/my-books"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FF7A59] hover:bg-cream-100 dark:hover:bg-darkBorder rounded-xl"
                  >
                    <FontAwesomeIcon icon={faTableColumns} className="w-3.5" />
                    <span>{t('myDashboard')}</span>
                  </Link>

                  <Link
                    href="/my-borrows"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder rounded-xl"
                  >
                    <FontAwesomeIcon icon={faReceipt} className="text-stone-400 w-3.5" />
                    <span>{t('myBorrows')}</span>
                  </Link>

                  <Link
                    href="/add-book"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder rounded-xl"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-stone-400 w-3.5" />
                    <span>{t('addBook')}</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder rounded-xl"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-stone-400 w-3.5" />
                    <span>{t('profileSettings')}</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-cream-100 dark:border-darkBorder font-bangla">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/login"
              className="text-xs font-bold bg-forest-950 dark:bg-[#FF7A59] hover:bg-forest-900 dark:hover:bg-[#ff6842] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm transition-all font-bangla"
            >
              {t('login')}
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-block text-xs font-semibold text-forest-950 dark:text-white border border-cream-300 dark:border-darkBorder px-3.5 py-1.5 rounded-full hover:bg-cream-100 dark:hover:bg-darkBorder transition-all font-bangla"
            >
              {t('register')}
            </Link>
          </div>
        )}
      </div>

      {/* 4. Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 top-[56px] bg-black/40 backdrop-blur-xs z-40 transition-opacity"
            aria-hidden="true"
          />
          <div
            ref={mobileMenuRef}
            className="lg:hidden fixed inset-x-0 top-[56px] bg-white dark:bg-darkCard border-b border-cream-200 dark:border-darkBorder p-4 space-y-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto"
          >
          <nav className="space-y-1 font-bangla">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white'
                  : 'text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder'
              }`}
            >
              <FontAwesomeIcon icon={faHouse} className="text-sm w-4" />
              <span>{t('home')}</span>
            </Link>

            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                pathname === '/books'
                  ? 'bg-forest-950 dark:bg-[#FF7A59] text-white'
                  : 'text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder'
              }`}
            >
              <FontAwesomeIcon icon={faBookOpen} className="text-sm w-4" />
              <span>{t('browseBooks')}</span>
            </Link>

            {session && (
              <>
                <Link
                  href="/my-books"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#FF7A59] hover:bg-cream-100 dark:hover:bg-darkBorder"
                >
                  <FontAwesomeIcon icon={faTableColumns} className="text-sm w-4" />
                  <span>{t('myDashboard')}</span>
                </Link>

                <Link
                  href="/add-book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-sm w-4" />
                  <span>{t('addBook')}</span>
                </Link>

                <Link
                  href="/my-borrows"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder"
                >
                  <FontAwesomeIcon icon={faReceipt} className="text-sm w-4" />
                  <span>{t('myBorrows')}</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder"
                >
                  <FontAwesomeIcon icon={faUser} className="text-sm w-4" />
                  <span>{t('profileSettings')}</span>
                </Link>
              </>
            )}
          </nav>

          {/* Theme & Language Toggler in Mobile Menu */}
          <div className="pt-2 border-t border-cream-200 dark:border-darkBorder space-y-2">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-darkBorder text-stone-800 dark:text-darkText text-xs font-semibold font-bangla"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faGlobe} className="text-sm text-[#FF7A59] w-4" />
                <span>Language (ভাষা): {lang === 'bn' ? 'বাংলা' : 'English'}</span>
              </div>
              <span className="text-[10px] text-[#FF7A59] font-bold">Switch to {lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cream-100 dark:bg-darkBorder text-stone-800 dark:text-darkText text-xs font-semibold font-bangla"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-sm text-amber-500 w-4" />
                <span>{t('toggleTheme')}</span>
              </div>
              <span className="text-[10px] text-stone-500 font-normal">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
          </div>

          {session ? (
            <div className="pt-2 border-t border-cream-200 dark:border-darkBorder font-bangla">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
                <span>{t('logout')}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2 border-t border-cream-200 dark:border-darkBorder font-bangla">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-bold bg-forest-950 dark:bg-[#FF7A59] text-white rounded-xl shadow-sm"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-forest-950 dark:text-white border border-cream-300 dark:border-darkBorder rounded-xl hover:bg-cream-50"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      </>
    )}
  </header>
  );
}
