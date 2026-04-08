import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "streak-orange": "#FF6B2B",
        "streak-orange-light": "#FF8C5A",
        "accent-purple": "#7C3AED",
        "accent-purple-light": "#9D5CF5",
        "accent-blue": "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "app-bg":
          "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.10) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(59,130,246,0.07) 0%, transparent 55%)",
        "streak-gradient": "linear-gradient(135deg, #FF6B2B 0%, #FF8C5A 100%)",
        "purple-gradient": "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.6)",
        "glow-purple": "0 0 24px rgba(124,58,237,0.45)",
        "glow-orange": "0 0 24px rgba(255,107,43,0.55)",
        "glow-blue": "0 0 24px rgba(59,130,246,0.45)",
      },
      keyframes: {
        flamePulse: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.08)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 16px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.65)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "flame-pulse": "flamePulse 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
