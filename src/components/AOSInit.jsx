'use client';

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    // Dynamic import to support SSR and Next.js client hydration
    import('aos')
      .then((AOS) => {
        import('aos/dist/aos.css')
          .then(() => {
            AOS.default.init({
              duration: 700,
              once: true,
              easing: 'ease-out-cubic',
              offset: 40,
            });
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, []);

  return null;
}

