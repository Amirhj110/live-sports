import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  basePath: '/live-sports',
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
