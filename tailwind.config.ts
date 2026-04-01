import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#08080d",
          card: "rgba(0,0,0,0.3)",
          elevated: "rgba(15,15,25,0.95)",
        },
        accent: {
          cyan: "#00d4ff",
          green: "#00ff9d",
          pink: "#ff3e8e",
          gold: "#ffd700",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        "fade-up-1": "fadeUp 0.5s ease 0.08s both",
        "fade-up-2": "fadeUp 0.5s ease 0.16s both",
        "fade-up-3": "fadeUp 0.5s ease 0.24s both",
        "fade-up-4": "fadeUp 0.5s ease 0.32s both",
        shake: "shake 0.4s ease-in-out",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-5px)" },
          "40%": { transform: "translateX(5px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
