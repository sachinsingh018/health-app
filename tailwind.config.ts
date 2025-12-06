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
                primary: {
                    DEFAULT: "#0E2A24",
                    50: "#f0f9f4",
                    100: "#dcf2e3",
                    200: "#bce4ca",
                    300: "#8fcea7",
                    400: "#5ab07d",
                    500: "#36915f",
                    600: "#27754d",
                    700: "#215e3f",
                    800: "#1d4c35",
                    900: "#193f2d",
                    950: "#0E2A24",
                },
                accent: {
                    gold: "#D4B77D",
                    neon: "#4EFFD2",
                    warning: "#FF5A5F",
                    yellow: "#F7D774",
                },
                surface: "#112F27",
                card: "#0F2520",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Space Grotesk", "Sora", "sans-serif"],
            },
            boxShadow: {
                neon: "0 0 20px #4EFFD2AA",
                "neon-sm": "0 0 10px #4EFFD2AA",
                "neon-lg": "0 0 30px #4EFFD2AA",
                gold: "0 0 12px #D4B77D88",
                "gold-sm": "0 0 6px #D4B77D88",
                warning: "0 0 10px #FF5A5F80",
            },
            animation: {
                "float": "float 3s ease-in-out infinite",
                "pulse-neon": "pulse-neon 2s ease-in-out infinite",
                "pulse-soft": "pulse-soft 3s ease-in-out infinite",
                "bounce-slow": "bounce-slow 2s ease-in-out infinite",
                "glow": "glow 2s ease-in-out infinite",
                "slide-up": "slide-up 0.3s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "shake": "shake 0.5s ease-in-out",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "pulse-neon": {
                    "0%, 100%": { opacity: "1", boxShadow: "0 0 10px #4EFFD2AA" },
                    "50%": { opacity: "0.8", boxShadow: "0 0 20px #4EFFD2AA" },
                },
                "pulse-soft": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
                "bounce-slow": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                glow: {
                    "0%, 100%": { boxShadow: "0 0 5px #4EFFD2AA" },
                    "50%": { boxShadow: "0 0 20px #4EFFD2AA, 0 0 30px #4EFFD2AA" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
                    "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
                },
            },
            backgroundImage: {
                "gradient-primary": "linear-gradient(to bottom, #0E2A24, #112F27)",
                "gradient-card": "linear-gradient(to bottom, #0F2520, #112F27)",
                "gradient-mint": "linear-gradient(to right, #4EFFD2, #0E2A24)",
            },
        },
    },
    plugins: [],
};
export default config;

