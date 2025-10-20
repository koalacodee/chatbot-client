import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { env, PublicEnvScript } from "next-runtime-env";
import { getLocale, isRTL } from "@/lib/utils";
import { RTL_LANGUAGES } from "@/constants/translations";

const roboto = localFont({
  src: "../public/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf",
  variable: "--font-roboto",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SmartHelp - Intelligent Customer Service",
    template: "%s | SmartHelp",
  },
  description:
    "SmartHelp intelligent chatbot with support ticket integration for seamless customer service",
  keywords: [
    "chatbot",
    "support",
    "AI",
    "Next.js",
    "customer service",
    "ticket system",
    "SmartHelp",
  ],
  authors: [{ name: "SmartHelp Team" }],
  creator: "SmartHelp",
  publisher: "SmartHelp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(env("NEXT_PUBLIC_BASE_URL") || "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/smarthelp.png", sizes: "32x32", type: "image/png" },
      { url: "/smarthelp.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/smarthelp.png",
    apple: "/smarthelp.png",
  },
  openGraph: {
    title: "SmartHelp",
    description:
      "SmartHelp intelligent chatbot with support ticket integration",
    url: "/",
    siteName: "SmartHelp",
    images: [
      {
        url: "/smarthelp.png",
        width: 1200,
        height: 630,
        alt: "SmartHelp",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartHelp",
    description:
      "SmartHelp intelligent chatbot with support ticket integration",
    images: ["/smarthelp.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLocale();
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      dir={isRTL(lang ?? "en") ? "rtl" : "ltr"}
      className={`${roboto.variable}`}
    >
      <head>
        <PublicEnvScript />
      </head>
      <body
        className="min-h-screen bg-background font-sans antialiased text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
