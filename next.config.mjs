/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'mongoose' on the client to avoid issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongoose: false,
      };
    }
    return config;
  },
};

export default nextConfig;
