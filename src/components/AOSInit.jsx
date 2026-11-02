'use client';

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fast fallback if IntersectionObserver is unsupported
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-aos]').forEach((el) => {
        el.classList.add('aos-animate');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-aos-delay');
            if (delay) {
              entry.target.style.transitionDelay = `${delay}ms`;
            }
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    // Initial query
    const attachObservers = () => {
      document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach((el) => {
        observer.observe(el);
      });
    };

    attachObservers();

    // Re-check when dynamic content loads
    const timer = setTimeout(attachObservers, 400);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
