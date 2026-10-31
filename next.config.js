/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/server/:path*',
        destination: 'https://b14-a8-booknook-server.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
