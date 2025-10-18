/**
 * Shared theme configuration for consistent design across the platform
 * This ensures both dashboard and client apps use the same design tokens
 */

export const theme = {
  colors: {
    light: {
      background: "#ffffff",
      foreground: "#171717",
      muted: "#f5f5f5",
      "muted-foreground": "#737373",
      border: "#e5e5e5",
      input: "#f9f9f9",
      ring: "#3b82f6",
      card: "#ffffff",
      "card-foreground": "#171717",
      popover: "#ffffff",
      "popover-foreground": "#171717",
      primary: "#2563eb",
      "primary-foreground": "#ffffff",
      secondary: "#f3f4f6",
      "secondary-foreground": "#111827",
      accent: "#e0f2fe",
      "accent-foreground": "#075985",
      success: "#16a34a",
      "success-foreground": "#ffffff",
      warning: "#facc15",
      "warning-foreground": "#1a1a1a",
      info: "#0ea5e9",
      "info-foreground": "#ffffff",
      destructive: "#dc2626",
      "destructive-foreground": "#ffffff",
    },
    dark: {
      background: "#0a0a0a",
      foreground: "#ededed",
      muted: "#1f1f1f",
      "muted-foreground": "#a3a3a3",
      border: "#27272a",
      input: "#111111",
      ring: "#60a5fa",
      card: "#111111",
      "card-foreground": "#ededed",
      popover: "#111111",
      "popover-foreground": "#ededed",
      primary: "#3b82f6",
      "primary-foreground": "#f9fafb",
      secondary: "#1e293b",
      "secondary-foreground": "#e2e8f0",
      accent: "#0ea5e9",
      "accent-foreground": "#f0f9ff",
      success: "#22c55e",
      "success-foreground": "#052e16",
      warning: "#eab308",
      "warning-foreground": "#1a1a1a",
      info: "#38bdf8",
      "info-foreground": "#082f49",
      destructive: "#ef4444",
      "destructive-foreground": "#fef2f2",
    },
  },
  animations: {
    // Framer Motion animation presets matching dashboard
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut" },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4, ease: "easeOut" },
    },
    slideInFromLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.4, ease: "easeOut" },
    },
    slideInFromRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.4, ease: "easeOut" },
    },
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
  typography: {
    fontFamily: {
      sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
      mono: ["var(--font-geist-mono)", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
} as const;

export type Theme = typeof theme;
export type AnimationPreset = keyof typeof theme.animations;
export type ColorScale = keyof typeof theme.colors.light;
