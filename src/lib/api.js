export const getServerUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    }
    // In production browser, use Next.js same-origin rewrite to completely bypass browser CORS
    return '/api/server';
  }
  // Server-side (SSR / Node.js on Vercel)
  return process.env.NEXT_PUBLIC_SERVER_URL || 'https://b14-a8-booknook-server.onrender.com';
};

