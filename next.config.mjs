/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Enable experimental features if needed
    appDir: true,
  },

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

  // Configure allowed origins for development (Builder.io)
  allowedDevOrigins: [
    "*.builder.codes",
    "*.builder.io",
    "localhost:3000",
    "localhost:*",
  ],

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
    // Don't fail build on TypeScript errors during development
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Don't run ESLint during builds to speed up development
    ignoreDuringBuilds: false,
  },

  // Configure output for better error handling
  poweredByHeader: false,

  // Configure compression
  compress: true,

  // Configure redirects if needed
  async redirects() {
    return [
      // Add any redirects here
    ];
  },

  // Configure rewrites for API routes
  async rewrites() {
    return [
      // Add any rewrites here
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configure build output
  output: "standalone",

  // Configure tracing for better debugging
  experimental: {
    instrumentationHook: false,
    optimizeCss: true,
    swcMinify: true,
  },
};

export default nextConfig;
