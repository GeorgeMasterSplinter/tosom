/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
     screens: {
       sm: '480px',
       ph: '820px',   // Fold 7 open
       md: '768px',
       lg: '1024px',
       xl: '1280px',
     },
    extend: {
      /* ── Colors (CSS Variable–driven) ── */
      colors: {
        /* Background */
        'ts-bg': 'var(--ts-bg-primary)',
        'ts-bg-secondary': 'var(--ts-bg-secondary)',
        'ts-bg-surface': 'var(--ts-bg-surface)',
        'ts-bg-elevated': 'var(--ts-bg-surface-elevated)',

        /* UI 6.0 — Premium Dark Base */
        'ts-bg-premium': 'var(--ts-bg-premium)',
        'ts-bg-premium-deep': 'var(--ts-bg-premium-deep)',

        /* Text */
        'ts-text': 'var(--ts-text-primary)',
        'ts-text-secondary': 'var(--ts-text-secondary)',
        'ts-text-muted': 'var(--ts-text-muted)',
        'ts-text-subtle': 'var(--ts-text-subtle)',

        /* UI 6.0 — Premium Text */
        'ts-text-white': 'var(--ts-text-white)',
        'ts-text-gray': 'var(--ts-text-gray)',

        /* Gold */
        'ts-gold': 'var(--ts-gold)',
        'ts-gold-light': 'var(--ts-gold-light)',
        'ts-gold-dark': 'var(--ts-gold-dark)',
        'ts-gold-soft': 'var(--ts-gold-soft)',
        'ts-gold-glow': 'var(--ts-gold-glow)',

        /* UI 6.0 — Gold Accent */
        'ts-gold-accent': 'var(--ts-gold-accent)',

        /* Glass */
        'ts-glass': 'var(--ts-glass-bg)',
        'ts-glass-hover': 'var(--ts-glass-bg-hover)',
        'ts-glass-border': 'var(--ts-glass-border)',
        'ts-glass-border-hover': 'var(--ts-glass-border-hover)',

        /* UI 6.0 — Deep Glass Border */
        'ts-glass-border-deep': 'var(--ts-glass-border-deep)',

        /* Border */
        'ts-border': 'var(--ts-border)',
        'ts-border-light': 'var(--ts-border-light)',

        /* Status */
        'ts-success': 'var(--ts-success)',
        'ts-error': 'var(--ts-error)',
        'ts-warning': 'var(--ts-warning)',
        'ts-info': 'var(--ts-info)',
      },

      /* ── Spacing ──
         MERK: nøklene er prefikset med `ts-` med hensikt.
         Uten prefiks overstyrer de Tailwinds egen sm/md/lg/xl-skala,
         og da blir `max-w-3xl` = 64px i stedet for 48rem. Bruk
         `p-ts-lg`, `gap-ts-xl` osv. for ToSom-avstander. */
      spacing: {
        'ts-xs': 'var(--ts-spacing-xs)',
        'ts-sm': 'var(--ts-spacing-sm)',
        'ts-md': 'var(--ts-spacing-md)',
        'ts-lg': 'var(--ts-spacing-lg)',
        'ts-xl': 'var(--ts-spacing-xl)',
        'ts-2xl': 'var(--ts-spacing-2xl)',
        'ts-3xl': 'var(--ts-spacing-3xl)',
        'ts-4xl': 'var(--ts-spacing-4xl)',

        /* UI 6.0 — Extended spacing */
        '72': 'var(--ts-spacing-72)',
        '84': 'var(--ts-spacing-84)',
        '96': 'var(--ts-spacing-96)',
      },

      /* ── Border Radius ── */
      borderRadius: {
        'ts-sm': 'var(--ts-radius-sm)',
        'ts-md': 'var(--ts-radius-md)',
        'ts-lg': 'var(--ts-radius-lg)',
        'ts-xl': 'var(--ts-radius-xl)',
        'ts-2xl': 'var(--ts-radius-2xl)',
        'ts-3xl': 'var(--ts-radius-3xl)',
        'ts-6xl': 'var(--ts-radius-6xl)',
        'ts-full': 'var(--ts-radius-full)',

        /* UI 6.0 — Premium radius */
        'glass': '18px',
        'cta': '14px',
      },

      /* ── Shadows ── */
      boxShadow: {
        'ts-sm': 'var(--ts-shadow-sm)',
        'ts-md': 'var(--ts-shadow-md)',
        'ts-lg': 'var(--ts-shadow-lg)',
        'ts-xl': 'var(--ts-shadow-xl)',
        'ts-gold': 'var(--ts-shadow-gold)',
        'ts-gold-hover': 'var(--ts-shadow-gold-hover)',

        /* UI 6.0 — Glow & Card shadows */
        'glow': 'var(--ts-shadow-glow)',
        'card': 'var(--ts-shadow-card)',
      },

      /* ── Typography ── */
      fontSize: {
        'display': ['var(--ts-font-heading-xl)', {
          lineHeight: '1.2',
          fontWeight: '600',
        }],
        'heading-xl': ['var(--ts-font-heading-xl)', {
          lineHeight: '1.2',
          fontWeight: '600',
        }],
        'heading-l': ['var(--ts-font-heading-l)', {
          lineHeight: '1.25',
          fontWeight: '600',
        }],
        'heading-m': ['var(--ts-font-heading-m)', {
          lineHeight: '1.3',
          fontWeight: '600',
        }],
        'body': ['var(--ts-font-body)', {
          lineHeight: '1.65',
          fontWeight: '400',
        }],
        'small': ['var(--ts-font-small)', {
          lineHeight: '1.6',
          fontWeight: '400',
        }],
        'xs': ['var(--ts-font-xs)', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
      },

      /* ── Typography Colors ── */
      textColor: {
        'ts-primary': 'var(--ts-text-primary)',
        'ts-secondary': 'var(--ts-text-secondary)',
        'ts-muted': 'var(--ts-text-muted)',
        'ts-subtle': 'var(--ts-text-subtle)',
        'ts-gold': 'var(--ts-gold)',
        'ts-gold-light': 'var(--ts-gold-light)',
        'ts-gold-dark': 'var(--ts-gold-dark)',
      },

      /* ── Background Colors ── */
      backgroundColor: {
        'ts-primary': 'var(--ts-bg-primary)',
        'ts-secondary': 'var(--ts-bg-secondary)',
        'ts-surface': 'var(--ts-bg-surface)',
        'ts-elevated': 'var(--ts-bg-surface-elevated)',
        'ts-glass': 'var(--ts-glass-bg)',
        'ts-glass-hover': 'var(--ts-glass-bg-hover)',
        'ts-gold': 'var(--ts-gold)',
        'ts-gold-soft': 'var(--ts-gold-soft)',
      },

      /* ── Border Colors ── */
      borderColor: {
        'ts': 'var(--ts-border)',
        'ts-light': 'var(--ts-border-light)',
        'ts-glass': 'var(--ts-glass-border)',
        'ts-glass-hover': 'var(--ts-glass-border-hover)',
        'ts-gold': 'var(--ts-gold)',
        'ts-success': 'var(--ts-success)',
        'ts-error': 'var(--ts-error)',
      },

      /* ── Ring Colors ── */
      ringColor: {
        'ts-gold': 'var(--ts-gold)',
        'ts-gold-glow': 'var(--ts-gold-glow)',
        'ts-success': 'var(--ts-success)',
        'ts-error': 'var(--ts-error)',
      },

      /* ── Transition Durations ── */
      transitionDuration: {
        'ts-instant': '80',
        'ts-faster': '120',
        'ts-fast': '150',
        'ts-normal': '250',
        'ts-slow': '350',
        'ts-slower': '500',
        'ts-slowest': '700',
        'ts-page': '400',
      },

      /* ── Transition Timing ── */
      transitionTimingFunction: {
        'ts-ease': 'ease',
        'ts-ease-in': 'ease-in',
        'ts-ease-out': 'ease-out',
        'ts-ease-in-out': 'ease-in-out',
        'ts-linear': 'linear',
        'ts-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ts-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ts-overshoot': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ts-subtleBounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'ts-fadeIn': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ts-slideIn': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ── Animations ── */
      animation: {
        /* Fade */
        'ts-fade-in': 'ts-fadeIn var(--ts-motion-duration-fast, 150ms) var(--ts-motion-easing-fadeIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        'ts-fade-out': 'ts-fadeOut var(--ts-motion-duration-fast, 150ms) var(--ts-motion-easing-fadeIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        /* Slide */
        'ts-slide-up': 'ts-slideUp var(--ts-motion-duration-normal, 250ms) var(--ts-motion-easing-slideIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        'ts-slide-down': 'ts-slideDown var(--ts-motion-duration-normal, 250ms) var(--ts-motion-easing-slideIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        'ts-slide-left': 'ts-slideLeft var(--ts-motion-duration-normal, 250ms) var(--ts-motion-easing-slideIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        'ts-slide-right': 'ts-slideRight var(--ts-motion-duration-normal, 250ms) var(--ts-motion-easing-slideIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        /* Scale */
        'ts-scale-in': 'ts-scaleIn var(--ts-motion-duration-spring, 300ms) var(--ts-motion-easing-spring, cubic-bezier(0.34, 1.56, 0.64, 1)) both',
        'ts-scale-out': 'ts-scaleOut var(--ts-motion-duration-fast, 150ms) var(--ts-motion-easing-fadeIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        /* Bounce / Pop */
        'ts-bounce-in': 'ts-bounceIn var(--ts-motion-duration-slower, 500ms) var(--ts-motion-easing-subtleBounce, cubic-bezier(0.175, 0.885, 0.32, 1.275)) both',
        'ts-pop-in': 'ts-popIn var(--ts-motion-duration-spring, 300ms) var(--ts-motion-easing-overshoot, cubic-bezier(0.68, -0.55, 0.265, 1.55)) both',
        /* Misc */
        'ts-shimmer': 'ts-shimmer 1.5s ease-in-out infinite',
        'ts-pulse': 'ts-pulse 2s ease-in-out infinite',
        'ts-breathe': 'ts-breathe 4s ease-in-out infinite',
        'ts-progress': 'ts-progressFill var(--ts-motion-duration-slow, 350ms) var(--ts-motion-easing-smooth, cubic-bezier(0.25, 0.1, 0.25, 1)) both',
        /* Page transition */
        'ts-page-in': 'ts-pageIn var(--ts-motion-duration-pageTransition, 400ms) var(--ts-motion-easing-fadeIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        'ts-page-out': 'ts-pageOut var(--ts-motion-duration-pageTransition, 400ms) var(--ts-motion-easing-fadeIn, cubic-bezier(0.4, 0, 0.2, 1)) both',
        /* Typewriter */
        'ts-typewriter': 'ts-typewriter 0.8s steps(30) both',
        /* Carousel */
        'ts-carousel-slide': 'ts-carouselSlide 0.5s var(--ts-motion-easing-smooth, cubic-bezier(0.25, 0.1, 0.25, 1)) both',
        /* AgeBadge */
        'fadeInScale': 'fadeInScale 0.6s ease-out both',
        /* None */
        'none': 'none',
      },

      /* ── Keyframes ── */
      keyframes: {
        'ts-fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ts-fadeOut': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'ts-slideUp': {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'ts-slideDown': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'ts-slideLeft': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ts-slideRight': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ts-scaleIn': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'ts-scaleOut': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        'ts-bounceIn': {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '50%': { transform: 'scale(1.02) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'ts-popIn': {
          '0%': { opacity: '0', transform: 'scale(0.7)' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'ts-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'ts-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.01)' },
        },
        'ts-breathe': {
          '0%, 100%': { opacity: '0.65', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.005)' },
        },
        'ts-progressFill': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'ts-pageIn': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ts-pageOut': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        'ts-typewriter': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'ts-carouselSlide': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        /* AgeBadge */
        'fadeInScale': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

      /* ── Backdrop Blur ── */
      backdropBlur: {
        'ts': 'var(--ts-glass-blur)',

        /* UI 6.0 — Glass blur */
        'glass': 'var(--ts-blur-glass)',
        'xl': '24px',
      },

      /* ── Z-Index ── */
      zIndex: {
        'ts-dropdown': '1000',
        'ts-sticky': '1100',
        'ts-elevated': '1200',
        'ts-modal': '1300',
        'ts-drawer': '1400',
        'ts-overlay': '1500',
        'ts-toast': '1600',
        'ts-notification': '1700',
      },

      /* ── Max Width ──
         MERK: ingen egendefinert maxWidth-skala her.
         I Tailwind 4 slår `max-w-*` opp i spacing-skalaen når nøklene
         kolliderer, slik at `max-w-3xl` ble 64px i stedet for 48rem.
         Vi bruker Tailwinds innebygde container-skala i stedet. */

    },
  },
  plugins: [],
}