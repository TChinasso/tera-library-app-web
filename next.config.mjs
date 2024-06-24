/** @type {import('next').NextConfig} */
import * as path from 'path'
const nextConfig = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  },
};

export default nextConfig;
