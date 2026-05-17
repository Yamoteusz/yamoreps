/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare Pages doesn't run Next's built-in image optimizer; serve
    // images directly from their origin to avoid 502s and slow first paint.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      { protocol: 'https', hostname: 'media.usfans.com' },
      { protocol: 'https', hostname: 'purecatamphetamine.github.io' },
      { protocol: 'https', hostname: 'img.vectoreps.pl' },
      { protocol: 'https', hostname: 'gd.kakobuy.com' },
      { protocol: 'https', hostname: 'img.kakobuy.com' },
      { protocol: 'https', hostname: 'cbu01.alicdn.com' },
      { protocol: 'https', hostname: 'img.alicdn.com' },
      { protocol: 'https', hostname: 'gw.alicdn.com' },
      { protocol: 'https', hostname: 'wd.geilicdn.com' },
      { protocol: 'https', hostname: 's2.wd-static.com' },
      { protocol: 'https', hostname: 'si.geilicdn.com' },
    ],
  },
};

export default nextConfig;
