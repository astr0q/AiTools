/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.googleusercontent.com',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.paypal.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: blob: https://*.googleusercontent.com https://*.paypal.com",
                            "connect-src 'self' ws://127.0.0.1:* http://localhost:* https://*.googleapis.com https://*.google.com https://*.firebaseapp.com https://*.firebase.com wss://*.convex.cloud https://*.convex.cloud https://api-inference.huggingface.co https://*.paypal.com",
                            "frame-src 'self' https://*.firebaseapp.com https://*.paypal.com",
                            "font-src 'self'",
                            "media-src 'self' blob: data:",
                        ].join('; ')
                    }
                ],
            },
        ];
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    }
};

export default nextConfig;