'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faPlus,
  faBookBookmark,
  faReceipt,
  faRightFromBracket,
  faBookJournalWhills
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from '../lib/auth-client';
import { useLang } from '../context/LanguageContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, lang } = useLang();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(lang === 'bn' ? 'সফলভাবে লগআউট হয়েছে' : 'Logged out successfully');
      window.location.href = '/';
    } catch {
      toast.error(lang === 'bn' ? 'লগআউট ব্যর্থ হয়েছে' : 'Failed to logout');
    }
  };

  const navItems = [
    { name: lang === 'bn' ? 'আমার বইসমূহ' : 'My Books', href: '/my-books', icon: faBookBookmark, sub: 'My Books' },
    { name: lang === 'bn' ? 'ধার নেওয়া বই' : 'My Borrows', href: '/my-borrows', icon: faReceipt, sub: 'My Borrows' },
    { name: lang === 'bn' ? 'নতুন বই যোগ' : 'Add Book', href: '/add-book', icon: faPlus, sub: 'Add Book' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-darkCard border-r border-cream-200 dark:border-darkBorder hidden lg:flex flex-col justify-between p-6 select-none sticky top-0 h-screen shrink-0 overflow-y-auto transition-colors duration-300">
      <div>
        {/* Brand / Logo: BookNook */}
        <Link href="/" className="flex items-center gap-3 mb-8 px-2 group">
          <div className="w-10 h-10 rounded-2xl bg-[#E8DFD6] dark:bg-forest-900 flex items-center justify-center text-forest-950 dark:text-cream-100 font-bold shadow-inner">
            <FontAwesomeIcon icon={faBookJournalWhills} className="text-forest-900 dark:text-cream-100 group-hover:rotate-12 transition-transform duration-300 w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-wider text-base text-forest-950 dark:text-white uppercase font-serif">
              BookNook
            </h1>
            <p className="text-[11px] text-stone-400 font-medium tracking-tight font-bangla">
              {lang === 'bn' ? 'ইউজার কন্ট্রোল প্যানেল' : 'User Control Desk'}
            </p>
          </div>
        </Link>

        {/* User Panel Management Menu */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 font-bangla">
            {t('userDashboard')}
          </span>
          <nav className="mt-3 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF7A59] text-white shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder hover:text-forest-950 dark:hover:text-white'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-sm w-4 ${isActive ? 'text-white' : 'text-stone-400'}`}
                  />
                  <div>
                    <p className="leading-tight font-bangla font-semibold">{item.name}</p>
                    <p className={`text-[10px] ${isActive ? 'text-white/80' : 'text-stone-400'}`}>{item.sub}</p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Back to Public Library */}
        <div className="pt-4 border-t border-cream-200 dark:border-darkBorder">
          <Link
            href="/books"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-darkText hover:bg-cream-100 dark:hover:bg-darkBorder font-bangla"
          >
            <FontAwesomeIcon icon={faBookOpen} className="text-stone-400 w-4" />
            <span>{t('backToPublicLibrary')}</span>
          </Link>
        </div>
      </div>

      {/* Bottom Profile Details & Logout */}
      <div className="space-y-4 pt-4 border-t border-cream-200 dark:border-darkBorder">
        {session?.user && (
          <div className="px-2">
            <p className="text-xs font-bold text-forest-950 dark:text-white truncate">{session.user.name}</p>
            <p className="text-[10px] text-stone-400 truncate">{session.user.email}</p>
          </div>
        )}

        {session ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all font-bangla"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5" />
            <span>{t('logout')}</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-950 dark:bg-[#FF7A59] text-white font-medium text-xs hover:bg-forest-900 transition-colors shadow-sm"
          >
            {t('login')} / {t('register')}
          </Link>
        )}

        <div className="bg-[#D9C4EC] dark:bg-purple-950/40 p-3 rounded-2xl flex items-center gap-3 shadow-inner">
          <div className="w-9 h-9 rounded-xl bg-purple-900 flex items-center justify-center text-white text-xs font-bold shadow">
            BN
          </div>
          <div>
            <p className="text-xs font-bold text-purple-950 dark:text-purple-200">BookNook Library</p>
            <p className="text-[10px] text-purple-800 dark:text-purple-300 font-bangla">
              {t('personalReaderDashboard')}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
