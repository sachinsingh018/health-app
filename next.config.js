/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.shutterstock.com',
            },
            {
                protocol: 'https',
                hostname: 't3.ftcdn.net',
            },
            {
                protocol: 'https',
                hostname: 'media.istockphoto.com',
            },
        ],
    },
};

module.exports = nextConfig;

