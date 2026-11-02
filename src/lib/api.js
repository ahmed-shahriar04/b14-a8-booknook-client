export const getServerUrl = () => {
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    // In browser, always use same-origin proxy to completely eliminate CORS errors
    return '/api/server';
  }

  // Server-side SSR
  return 'https://b14-a8-booknook-server.onrender.com';
};
