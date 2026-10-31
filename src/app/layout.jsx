import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import AppLayoutWrapper from "../components/AppLayoutWrapper";

// Configure config for FontAwesome SSR
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

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
  description: "Borrow, explore, and share books in a cozy and modern online reading hub with multi-language Bangla support.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${outfit.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-cream-100 dark:bg-darkBg text-forest-900 dark:text-darkText antialiased min-h-screen transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
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

            <AppLayoutWrapper>
              {children}
            </AppLayoutWrapper>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
