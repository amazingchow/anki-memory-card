import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./custom.css";
import { Providers } from "./providers";
import Navbar from "../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anki Memory Card",
  description: "A flashcard application for learning English words",
  icons: {
    icon: [
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 