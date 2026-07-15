/** @type {import('next').NextConfig} */

// Set SHAREPOINT_DOMAIN (e.g. https://yourtenant.sharepoint.com) in your
// environment variables so this app is allowed to be embedded there in an
// iframe / SharePoint "Embed" web part. Without it, the app can still embed
// itself but will refuse to be framed by any other origin.
const sharePointDomain = process.env.SHAREPOINT_DOMAIN || '';
const frameAncestors = ["'self'", sharePointDomain].filter(Boolean).join(' ');

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${frameAncestors};`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
