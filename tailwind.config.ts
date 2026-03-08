import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        "3xl": "1600px",
        "4xl": "1800px",
      },
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#69140E",
            h1: {
              color: "#69140E",
            },
            h2: {
              color: "#69140E",
            },
            h3: {
              color: "#69140E",
            },
            h4: {
              color: "#69140E",
            },
            h5: {
              color: "#69140E",
            },
            h6: {
              color: "#69140E",
            },
            strong: {
              color: "#69140E",
            },
            em: {
              color: "#69140E",
            },
            a: {
              color: "#69140E",
            },
            "li::marker": {
              color: "#69140E",
            },
            hr: {
              borderColor: "#69140E",
            },
            blockquote: {
              color: "#69140E",
            },
          },
        },
      },
      colors: {
        // 브랜드 배경 토큰
        comfortWhite: "#F5F5F5",
        hanji: "#E4E0D5",
        "hanji-dark": "#DAD6CB",
        "article-bg": "#f8f5f0",
        // 브랜드 UI 토큰
        "banner-green": "#214E34",
        "lyric-mark": "#FFD966",
        "lyric-mark-dark": "#84894A",
        "lyric-mark-text-dark": "#FDF7C3",
        "link-blue": "#1976d2",
        // shadcn/ui 시맨틱 토큰
        border: "#69140E",
        input: "#69140E",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  safelist: [
    // DB에 저장된 기존 번역 콘텐츠의 레거시 하이라이트 클래스 보존
    "bg-[#FFD966]",
    "text-[#69140E]",
  ],
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
