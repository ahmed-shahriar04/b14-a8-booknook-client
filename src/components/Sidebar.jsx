'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faBookOpen,
  faPlus,
  faBookBookmark,
  faReceipt,
  faGear,
  faCircleQuestion,
  faRightFromBracket,
  faBookJournalWhills
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from '../lib/auth-client';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch {
      toast.error('Failed to logout');
    }
  };

  const navItems = [
    { name: 'Discover', href: '/', icon: faHouse, public: true },
    { name: 'All Books', href: '/books', icon: faBookOpen, public: true },
    { name: 'Add Book', href: '/add-book', icon: faPlus, public: false },
    { name: 'My Books', href: '/my-books', icon: faBookBookmark, public: false },
    { name: 'My Borrows', href: '/my-borrows', icon: faReceipt, public: false },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-cream-200 hidden lg:flex flex-col justify-between p-6 select-none sticky top-0 h-screen shrink-0 overflow-y-auto">
      <div>
        {/* Brand / Logo: BookNook */}
        <Link href="/" className="flex items-center gap-3 mb-8 px-2 group">
          <div className="w-10 h-10 rounded-2xl bg-[#E8DFD6] flex items-center justify-center text-forest-950 font-bold shadow-inner">
            <FontAwesomeIcon icon={faBookJournalWhills} className="text-forest-900 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-wider text-base text-forest-950 uppercase font-serif">
              BookNook
            </h1>
            <p className="text-[11px] text-stone-400 font-medium tracking-tight">Online Library</p>
          </div>
        </Link>

        {/* Menu Section */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3">
            MENU
          </span>
          <nav className="mt-3 space-y-1.5">
            {navItems.map((item) => {
              if (!item.public && !session) return null;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF7A59] text-white shadow-sm font-semibold'
                      : 'text-stone-600 hover:bg-cream-100 hover:text-forest-950'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-sm ${isActive ? 'text-white' : 'text-stone-400'}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preferences */}
        <div className="pt-4 border-t border-cream-200">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3">
            PREFERENCES
          </span>
          <div className="mt-3 space-y-1.5">
            <button
              onClick={() => toast('Settings preferences available in your profile')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-cream-100 hover:text-forest-950 transition-all text-left"
            >
              <FontAwesomeIcon icon={faGear} className="text-stone-400 text-sm" />
              <span>Setting</span>
            </button>
            <button
              onClick={() => toast('Contact: librarian@booknook.dev')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-cream-100 hover:text-forest-950 transition-all text-left"
            >
              <FontAwesomeIcon icon={faCircleQuestion} className="text-stone-400 text-sm" />
              <span>Help & FAQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Promo & Logout */}
      <div className="space-y-4 pt-4 border-t border-cream-200/60">
        {session ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Log out</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-forest-950 text-white font-medium text-sm hover:bg-forest-900 transition-colors shadow-sm"
          >
            Sign In / Register
          </Link>
        )}

        {/* Aesthetic Badge */}
        <div className="bg-[#D9C4EC] p-3 rounded-2xl flex items-center gap-3 shadow-inner">
          <div className="w-9 h-9 rounded-xl bg-purple-900 flex items-center justify-center text-white text-xs font-bold shadow">
            BN
          </div>
          <div>
            <p className="text-xs font-bold text-purple-950">BookNook Library</p>
            <p className="text-[10px] text-purple-800">Cozy Digital Archive</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
