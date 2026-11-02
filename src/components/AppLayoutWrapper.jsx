'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getServerUrl } from '../lib/api';

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Background server wake-up ping on application load
  useEffect(() => {
    try {
      const serverUrl = getServerUrl();
      fetch(`${serverUrl}/health`, { method: 'GET', keepalive: true }).catch(() => {});
    } catch (_) {}
  }, []);

  // Top progress bar on route change
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  // User private/management routes where sidebar should be visible
  const isUserPanelRoute =
    pathname.startsWith('/my-books') ||
    pathname.startsWith('/my-borrows') ||
    pathname.startsWith('/add-book') ||
    pathname.startsWith('/profile');

  return (
    <div className="w-full min-h-screen flex bg-cream-50 dark:bg-darkBg transition-colors duration-300 relative">
      {/* Top Page Transition Progress Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A59] via-amber-400 to-[#142E2A] z-50 animate-pulse transition-all"></div>
      )}

      {/* Sidebar: ONLY rendered on user panel/management pages */}
      {isUserPanelRoute && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAF8] dark:bg-darkBg min-h-screen transition-colors duration-300">
        <Navbar isUserPanel={isUserPanelRoute} />

        <main className={`flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full ${isUserPanelRoute ? 'max-w-7xl' : 'max-w-7xl'} mx-auto`}>
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
