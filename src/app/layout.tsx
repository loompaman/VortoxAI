import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VortoxAI - AI-Powered Viral Content Creation Tools",
  description: "Create viral content with AI. Get proven design prompts, automated TikTok slideshows, and viral video guides that help you create content that actually converts.",
  icons: {
    icon: '/favicon.svg?v=4',
    shortcut: '/favicon.svg?v=4',
    apple: '/favicon.svg?v=4',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg?v=4" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg?v=4" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
