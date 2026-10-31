'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();

  // User private/management routes where sidebar should be visible
  const isUserPanelRoute =
    pathname.startsWith('/my-books') ||
    pathname.startsWith('/my-borrows') ||
    pathname.startsWith('/add-book') ||
    pathname.startsWith('/profile');

  return (
    <div className="w-full min-h-screen flex bg-cream-50 dark:bg-darkBg transition-colors duration-300">
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

