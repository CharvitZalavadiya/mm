/** @type {import('next').NextConfig} */
// import cors from 'cors';

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['img.clerk.com']
    },
    typescript: {
        ignoreBuildErrors: true
    }
};

export default nextConfig;