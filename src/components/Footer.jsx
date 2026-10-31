import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXTwitter,
  faGithub,
  faLinkedinIn,
  faFacebookF
} from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-cream-200 mt-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 text-stone-600 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-forest-950 font-serif">
              BookNook
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
            BookNook is a cozy online community library where readers unite. Borrow compelling titles,
            catalogue new gems, and inspire your reading journey with timeless stories.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {/* New X logo per explicit rule #194 */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-forest-950 hover:bg-forest-950 hover:text-white transition-all text-xs"
            >
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-forest-950 hover:bg-forest-950 hover:text-white transition-all text-xs"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-forest-950 hover:bg-forest-950 hover:text-white transition-all text-xs"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-forest-950 hover:bg-forest-950 hover:text-white transition-all text-xs"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950">
            Navigation
          </h4>
          <ul className="text-xs space-y-1.5 text-stone-500">
            <li>
              <Link href="/" className="hover:text-forest-950 transition-colors">
                Discover Home
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-forest-950 transition-colors">
                All Collections
              </Link>
            </li>
            <li>
              <Link href="/add-book" className="hover:text-forest-950 transition-colors">
                Add a Book
              </Link>
            </li>
            <li>
              <Link href="/my-borrows" className="hover:text-forest-950 transition-colors">
                Borrow Records
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950">
            Contact & Support
          </h4>
          <p className="text-xs text-stone-500">742 Evergreen Library Avenue, Suite 4B</p>
          <p className="text-xs text-stone-500 font-medium">librarian@booknook.dev</p>
          <p className="text-xs text-stone-500">+1 (800) 426-READ</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
        <p>© {new Date().getFullYear()} BookNook Library System. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Curated with <FontAwesomeIcon icon={faHeart} className="text-rose-500 text-[10px]" /> for passionate book lovers.
        </p>
      </div>
    </footer>
  );
}
