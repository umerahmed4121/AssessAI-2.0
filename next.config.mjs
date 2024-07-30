/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "firebasestorage.googleapis.com",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com",
        port: ''
      }
    ]
  }
};

export default nextConfig;