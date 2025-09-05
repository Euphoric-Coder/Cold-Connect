/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF5FF",
          100: "#DCEBFF",
          200: "#B9D6FF",
          300: "#8BB8FF",
          400: "#5C96DB", // Primary blue
          500: "#3A7BD5",
          600: "#2C64C0",
          700: "#24519D",
          800: "#1F4382",
          900: "#1C386B",
        },
        secondary: {
          50: "#F4F0FF",
          100: "#E9E0FF",
          200: "#D2C1FF",
          300: "#B79DFF",
          400: "#8A4CFF", // Primary purple
          500: "#7830FF",
          600: "#6720EF",
          700: "#5617C7",
          800: "#4713A2",
          900: "#3B1185",
        },
        accent: {
          50: "#ECFEFE",
          100: "#D8FDFD",
          200: "#B2F9FA",
          300: "#83F0F4",
          400: "#50E6C2", // Primary teal
          500: "#32D4B5",
          600: "#20B39A",
          700: "#1B907D",
          800: "#187566",
          900: "#156057",
        },
        success: {
          50: "#EEFDF2",
          100: "#DAFBE4",
          200: "#B6F5CB",
          300: "#7FE9A8",
          400: "#4ADA83",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        dark: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #5C96DB 0%, #8A4CFF 50%, #50E6C2 100%)",
        "gradient-hover":
          "linear-gradient(135deg, #3A7BD5 0%, #6720EF 50%, #32D4B5 100%)",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 20px rgba(0, 0, 0, 0.1)",
        button: "0 2px 6px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
