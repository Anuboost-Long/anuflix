import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "streamed.pk",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  async headers() {
    const scripts = process.env.NODE_ENV === "development"
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'"

    return [{
      source: "/(.*)",
      headers: [{
        key: "Content-Security-Policy",
        value: `default-src 'self'; img-src 'self' data: https://image.tmdb.org https://streamed.pk; frame-src https://www.vidking.net https://embed.st; ${scripts}; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' data:;`,
      }],
    }]
  },
};

export default nextConfig;
