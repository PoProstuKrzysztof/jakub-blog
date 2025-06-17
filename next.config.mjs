/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Handle Builder.io cross-origin requests
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },

  // Configure image domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Webpack configuration to handle build warnings
  webpack: (config, { dev, isServer }) => {
    // Reduce noise from Supabase warnings in development
    if (dev) {
      config.infrastructureLogging = {
        level: "error",
      };
    }

    // Handle potential module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore certain warnings that are not actionable
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'bufferutil'/,
      /Module not found: Can't resolve 'utf-8-validate'/,
    ];

    return config;
  },

  // Configure TypeScript to be more lenient with certain errors
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configure compression
  compress: true,

  // Disable powered by header for security
  poweredByHeader: false,

  // Configure redirects if needed
  async redirects() {
    return [];
  },

  // Configure rewrites for API routes
  async rewrites() {
    return [];
  },

  // Experimental features (only include valid ones for Next.js 15)
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
