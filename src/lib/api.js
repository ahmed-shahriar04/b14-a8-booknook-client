export const getServerUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    }
    // In production browser, use direct server URL to avoid Vercel 10s gateway proxy timeouts on cold starts
    return process.env.NEXT_PUBLIC_SERVER_URL || 'https://b14-a8-booknook-server.onrender.com';
  }
  // Server-side (SSR / Node.js on Vercel)
  return process.env.NEXT_PUBLIC_SERVER_URL || 'https://b14-a8-booknook-server.onrender.com';
};

