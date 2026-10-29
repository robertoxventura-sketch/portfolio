/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl": "1440px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        success: "hsl(var(--success))",
        border: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        serif: ["Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["Geist", "ui-monospace", "monospace"],
      },
      fontSize: {
        micro: ["11px", { lineHeight: "1.4" }],
        caption: ["12px", { lineHeight: "1.5" }],
        "body-sm": ["13px", { lineHeight: "1.55" }],
        body: ["15px", { lineHeight: "1.55" }],
        "body-lg": ["17px", { lineHeight: "1.5" }],
        "display-xs": ["1.5rem", { lineHeight: "1.12", letterSpacing: "-0.03em" }],
        "display-sm": ["2rem", { lineHeight: "1.08", letterSpacing: "-0.035em" }],
        "display-md": ["2.625rem", { lineHeight: "1.05", letterSpacing: "-0.04em" }],
        "display-lg": ["3rem", { lineHeight: "1.02", letterSpacing: "-0.045em" }],
        "display-xl": ["3.75rem", { lineHeight: "0.98", letterSpacing: "-0.045em" }],
      },
      boxShadow: {
        card: "0 1px 2px hsl(0 0% 0% / 0.04), 0 8px 24px -8px hsl(0 0% 0% / 0.08)",
        pop: "0 12px 40px -12px hsl(0 0% 0% / 0.18)",
      },
      keyframes: {
        moveVertical: {
          "0%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(50%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        moveInCircle: {
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        moveHorizontal: {
          "0%": { transform: "translateX(-50%) translateY(-10%)" },
          "50%": { transform: "translateX(50%) translateY(10%)" },
          "100%": { transform: "translateX(-50%) translateY(-10%)" },
        },
      },
      animation: {
        first: "moveVertical 60s ease infinite",
        second: "moveInCircle 50s reverse infinite",
        third: "moveInCircle 70s linear infinite",
        fourth: "moveHorizontal 80s ease infinite",
        fifth: "moveInCircle 55s ease infinite",
      },
    },
  },
  plugins: [],
};
