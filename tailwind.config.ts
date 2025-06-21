import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
      // Enhanced responsive breakpoints for better mobile experience
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Mobile-first spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // Mobile-optimized max widths
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'screen-xs': '475px',
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      // Mobile-optimized font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
  		colors: {
  			background: '#F6F6F6',
  			foreground: '#2F2F2F',
  			card: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#2F2F2F'
  			},
  			popover: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#2F2F2F'
  			},
  			primary: {
  				DEFAULT: '#FFCB74',
  				foreground: '#2F2F2F'
  			},
  			secondary: {
  				DEFAULT: '#2F2F2F',
  				foreground: '#F6F6F6'
  			},
  			muted: {
  				DEFAULT: '#F0F0F0',
  				foreground: '#2F2F2F'
  			},
  			accent: {
  				DEFAULT: '#FFCB74',
  				foreground: '#2F2F2F'
  			},
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#F6F6F6'
  			},
  			border: '#E0E0E0',
  			input: '#E0E0E0',
  			ring: '#FFCB74',
  			chart: {
  				'1': '#FFCB74',
  				'2': '#2F2F2F',
  				'3': '#F6F6F6',
  				'4': '#E0E0E0',
  				'5': '#D0D0D0'
  			},
  			sidebar: {
  				DEFAULT: '#FFFFFF',
  				foreground: '#2F2F2F',
  				primary: '#FFCB74',
  				'primary-foreground': '#2F2F2F',
  				accent: '#F6F6F6',
  				'accent-foreground': '#2F2F2F',
  				border: '#E0E0E0',
  				ring: '#FFCB74'
  			},
  			'navy-blue': {
  				DEFAULT: '#2F2F2F',
  				50: '#F6F6F6',
  				100: '#F0F0F0',
  				200: '#E0E0E0',
  				300: '#D0D0D0',
  				400: '#A0A0A0',
  				500: '#808080',
  				600: '#606060',
  				700: '#404040',
  				800: '#2F2F2F',
  				900: '#1F1F1F',
  				950: '#0F0F0F'
  			},
  			'light-gray': {
  				DEFAULT: '#F6F6F6',
  				50: '#FEFEFE',
  				100: '#FCFCFC',
  				200: '#F8F8F8',
  				300: '#F6F6F6',
  				400: '#F0F0F0',
  				500: '#E8E8E8',
  				600: '#D8D8D8',
  				700: '#C0C0C0',
  				800: '#A0A0A0',
  				900: '#808080'
  			},
  			'success-green': {
  				DEFAULT: '#10B981',
  				50: '#ECFDF5',
  				100: '#D1FAE5',
  				200: '#A7F3D0',
  				300: '#6EE7B7',
  				400: '#34D399',
  				500: '#10B981',
  				600: '#059669',
  				700: '#047857',
  				800: '#065F46',
  				900: '#064E3B'
  			},
  			'alert-red': {
  				DEFAULT: '#EF4444',
  				50: '#FEF2F2',
  				100: '#FEE2E2',
  				200: '#FECACA',
  				300: '#FCA5A5',
  				400: '#F87171',
  				500: '#EF4444',
  				600: '#DC2626',
  				700: '#B91C1C',
  				800: '#991B1B',
  				900: '#7F1D1D'
  			},
  			'text-gray': {
  				DEFAULT: '#2F2F2F',
  				50: '#F9FAFB',
  				100: '#F6F6F6',
  				200: '#F0F0F0',
  				300: '#E0E0E0',
  				400: '#C0C0C0',
  				500: '#A0A0A0',
  				600: '#808080',
  				700: '#606060',
  				800: '#404040',
  				900: '#2F2F2F'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        // Mobile-optimized animations
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate")
  ],
};
export default config;
