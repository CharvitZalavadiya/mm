// /** @type {import('next').NextConfig} */
// // import cors from 'cors';

// const nextConfig = {
//     reactStrictMode: true,
//     images: {
//         domains: ['img.clerk.com']
//     },
//     typescript: {
//         ignoreBuildErrors: true
//     }
// };

// export default nextConfig;




/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['img.clerk.com'], // Specify allowed image domains
    },
    typescript: {
        ignoreBuildErrors: true, // Allow builds despite TS errors
    },
    async headers() {
        return [
            {
                // Apply headers to all API routes
                source: "/api/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                    {
                        key: "Expires",
                        value: "0",
                    },
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*", // Allow cross-origin requests (adjust as needed)
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
