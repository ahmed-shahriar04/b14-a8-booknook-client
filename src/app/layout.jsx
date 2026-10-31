import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Clean modern Google Fonts
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "BookNook | A Cozy Modern Online Library",
  description: "Borrow, explore, and share books in a cozy and modern online reading hub.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="bg-cream-100 text-forest-900 antialiased min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#142E2A',
              color: '#F4EFEA',
              borderRadius: '16px',
              padding: '12px 20px',
              fontWeight: 500,
            },
          }}
        />

        {/* Full-width App Layout */}
        <div className="w-full min-h-screen flex bg-white">
          {/* Fixed Sticky Left Sidebar (Does NOT scroll with page) */}
          <Sidebar />

          {/* Main Content Area (Full remaining width, scrolls naturally) */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#FAFAF8] min-h-screen">
            {/* Top Navbar */}
            <Navbar />

            {/* Dynamic Page Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
              {children}
            </main>

            {/* Shared Footer */}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
