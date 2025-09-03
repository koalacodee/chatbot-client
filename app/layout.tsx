import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const roboto = localFont({
  src: "../public/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf",
  variable: "--font-roboto",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Chatbot Support - Intelligent Customer Service",
    template: "%s | AI Chatbot Support",
  },
  description:
    "Intelligent chatbot with support ticket integration for seamless customer service",
  keywords: [
    "chatbot",
    "support",
    "AI",
    "Next.js",
    "customer service",
    "ticket system",
  ],
  authors: [{ name: "AI Chatbot Team" }],
  creator: "AI Chatbot Support",
  publisher: "AI Chatbot Support",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "AI Chatbot Support",
    description: "Intelligent chatbot with support ticket integration",
    url: "/",
    siteName: "AI Chatbot Support",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Chatbot Support",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chatbot Support",
    description: "Intelligent chatbot with support ticket integration",
    images: ["/twitter-image.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${roboto.variable}`}>
      <head />
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
