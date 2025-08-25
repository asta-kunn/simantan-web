/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Enables dark mode via class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
      },
      maxWidth: {
        xs: "20rem",
        sm: "24rem",
        md: "28rem",
        lg: "32rem",
        xl: "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem",
        full: "100%",
      },
      colors: {
        primary: {
          normal: {
            DEFAULT: "#2E7D32", // Darker forest green
            hover: "#1B5E20", 
            active: "#0A3D0A",
          },
          soft: {
            DEFAULT: "#E8F5E9", // Light mint green
          },
        },
        secondary: {
          normal: {
            DEFAULT: "#66BB6A", // Medium green
            hover: "#4CAF50",
            active: "#388E3C",
          },
          soft: {
            DEFAULT: "#F1F8E9", // Very light green
          },
        },
        success: {
          normal: {
            DEFAULT: "#43A047", // Success green
            hover: "#388E3C",
            active: "#2E7D32",
          },
          soft: {
            DEFAULT: "#E8F5E9",
          },
        },
        info: {
          normal: {
            DEFAULT: "#81C784", // Light green
            hover: "#66BB6A",
            active: "#4CAF50",
          },
          soft: {
            DEFAULT: "#F1F8E9",
          },
        },
        warning: {
          normal: {
            DEFAULT: "#558B2F", // Olive green
            hover: "#33691E",
            active: "#1B5E20",
          },
          soft: {
            DEFAULT: "#F1F8E9",
          },
        },
        danger: {
          normal: {
            DEFAULT: "#C62828", // Keep red for danger
            hover: "#B71C1C",
            active: "#8B0000",
          },
          soft: {
            DEFAULT: "#FFEBEE",
          },
        },
        disable: {
          normal: {
            DEFAULT: "#B8B8B9",
          },
          soft: {
            DEFAULT: "#E8E8E8",
          },
        },
        tertiary: {
          normal: {
            DEFAULT: "#A5D6A7", // Light green
            active: "#81C784",
          },
          soft: {
            DEFAULT: "#F1F8E9",
          },
        },
        "plm-grey": {
          DEFAULT: "#D2DEEB",
        },
        "plm-rose": {
          DEFAULT: "#9A0101",
        },
        neutral: {
          gray: "#959697",
        },
        system: {
          divider: "#D2DEEB",
          input: "#F4F7FA",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "none",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        red: "#B32017",
        "dark-red": "#7F1710",
        "soft-red": "#F7E9E8",
      },
      fontSize: {
        xs: "0.5rem",
        sm: "0.6rem",
        md: "0.7rem",
        base: "0.7rem",
        lg: "0.8rem",
        xl: "1rem",
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
