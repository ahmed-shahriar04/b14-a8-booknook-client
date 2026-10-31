'use client';

import { useState } from 'react';
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
  faReceipt
} from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from '../lib/auth-client';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch {
      toast.error('Logout failed');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: faHouse },
    { name: 'All Books', href: '/books', icon: faBookOpen },
    ...(session ? [
      { name: 'Add Book', href: '/add-book', icon: faPlus },
      { name: 'My Books', href: '/my-books', icon: faBookBookmark },
      { name: 'My Borrows', href: '/my-borrows', icon: faReceipt }
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Brand & Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-forest-950 rounded-xl hover:bg-cream-100 lg:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-lg" />
        </button>

        {/* Website Name: BookNook */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8DFD6] flex items-center justify-center text-forest-950 font-bold lg:hidden">
            <FontAwesomeIcon icon={faBookJournalWhills} className="text-xs" />
          </div>
          <span className="font-serif font-extrabold text-lg sm:text-xl tracking-tight text-forest-950">
            BookNook
          </span>
        </Link>
      </div>

      {/* Desktop Horizontal Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-wider font-semibold transition-colors pb-1 ${
                isActive
                  ? 'text-forest-950 border-b-2 border-forest-950'
                  : 'text-stone-500 hover:text-forest-950'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Right User Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button
          onClick={() => toast('No new notifications')}
          className="w-9 h-9 rounded-full bg-cream-100 text-stone-600 flex items-center justify-center hover:bg-cream-200 transition-colors"
          title="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-xs" />
        </button>

        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-cream-100/80 hover:bg-cream-200/80 px-2.5 py-1.5 rounded-full transition-all border border-cream-200"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden relative bg-[#E8DFD6] flex items-center justify-center text-forest-950 font-bold shrink-0">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                )}
              </div>
              <span className="text-xs font-semibold text-forest-950 max-w-[100px] sm:max-w-[130px] truncate pr-1">
                {session.user.name || 'Reader'}
              </span>
              <span className="text-[10px] text-stone-500">▼</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-cream-100">
                  <p className="text-xs font-bold text-forest-950 truncate">{session.user.name}</p>
                  <p className="text-[11px] text-stone-500 truncate">{session.user.email}</p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1.5 text-xs text-stone-500 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-stone-400 text-xs" />
                    <span>My Profile</span>
                  </div>
                  <Link
                    href="/my-books"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-cream-100 rounded-lg"
                  >
                    My Added Books
                  </Link>
                  <Link
                    href="/my-borrows"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-1.5 text-xs text-stone-700 hover:bg-cream-100 rounded-lg"
                  >
                    My Borrowed Books
                  </Link>
                </div>

                <div className="pt-1 border-t border-cream-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-forest-950 hover:underline px-2.5 py-1.5"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold bg-forest-950 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-forest-900 shadow-sm transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[57px] bg-white border-b border-cream-200 p-4 space-y-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#FF7A59] text-white font-semibold'
                      : 'text-stone-700 hover:bg-cream-100'
                  }`}
                >
                  <FontAwesomeIcon icon={link.icon} className="text-sm w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {session ? (
            <div className="pt-3 border-t border-cream-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-sm w-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 flex flex-col gap-2 border-t border-cream-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-forest-950 border border-cream-300 rounded-xl hover:bg-cream-50"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold bg-forest-950 text-white rounded-xl hover:bg-forest-900"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
