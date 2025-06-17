/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jmtmhwzgvqnsitdgdgwa.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.builder.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Wyłączam optymalizację CSS, która powoduje błąd z critters
    // optimizeCss: true,
    // Poprawki dla Next.js 15 i React Server Components
    serverComponentsExternalPackages: ['@tiptap/core', '@tiptap/pm', '@tiptap/starter-kit'],
  },
  // Dodaję konfigurację webpack dla lepszego zarządzania chunkami
  webpack: (config, { isServer, dev }) => {
    // Fix dla problemów z ładowaniem chunków w React Server Components
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
              enforce: true,
            },
            // Oddzielny chunk dla edytora TipTap
            editor: {
              test: /[\\/]node_modules[\\/](@tiptap|prosemirror)/,
              name: 'editor',
              priority: 10,
              chunks: 'all',
              enforce: true,
            },
            // Oddzielny chunk dla Chart.js
            charts: {
              test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)/,
              name: 'charts',
              priority: 10,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }
    }

    // Fix dla problemów z TipTap i innymi bibliotekami
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      },
    }

    // Poprawka dla dynamicznych importów w Next.js 15
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.builder.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.builder.io",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob: https://cdn.builder.io",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.builder.io https://builder.io",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          // HTTP Strict Transport Security
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // X-XSS-Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          }
        ]
      }
    ]
  }
}

export default nextConfig