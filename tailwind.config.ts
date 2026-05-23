import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 6s ease-in-out infinite",
        "fade-up": "fadeUp .6s cubic-bezier(.2,.8,.2,1) both",
        "fade-down": "fadeDown .5s ease-out both",
        "fade-in": "fadeIn .35s ease-out both",
        "pop-in": "popIn .2s cubic-bezier(.2,.8,.2,1) both",
        "pulse-ring": "pulseRing 2s ease-in-out infinite",
        "glow-box": "glowBox 2s ease-in-out infinite",
        "expand": "expand .3s ease-out both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        popIn: {
          from: { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.2)", opacity: "0.2" },
        },
        glowBox: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(99,102,241,0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(99,102,241,0.8)" },
        },
        expand: {
          from: { maxHeight: "0", opacity: "0" },
          to: { maxHeight: "500px", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
