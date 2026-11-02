'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const revealElements = () => {
      const elements = document.querySelectorAll('[data-aos]');
      const windowHeight = window.innerHeight || 800;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in the viewport or nearby, reveal it immediately!
        if (rect.top <= windowHeight + 150) {
          const delay = el.getAttribute('data-aos-delay');
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('aos-animate');
        }
      });
    };

    // 1. Run immediately on page load / route change
    revealElements();

    // 2. IntersectionObserver for elements appearing upon scrolling
    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = entry.target.getAttribute('data-aos-delay');
              if (delay) entry.target.style.transitionDelay = `${delay}ms`;
              entry.target.classList.add('aos-animate');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
      );

      document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach((el) => {
        observer.observe(el);
      });
    } else {
      document.querySelectorAll('[data-aos]').forEach((el) => {
        el.classList.add('aos-animate');
      });
    }

    // 3. Staggered fail-safe timers to guarantee dynamic API content is revealed
    const t1 = setTimeout(revealElements, 150);
    const t2 = setTimeout(revealElements, 400);
    const t3 = setTimeout(revealElements, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
