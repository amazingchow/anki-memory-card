import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import "./custom.css";
import { Providers } from "./providers";
import NavbarWrapper from "../components/navbar-wrapper";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anki AI",
  description: "AI-powered flashcard learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={inter.className}> */}
      <body>
        <Providers>
          <div className="min-h-screen bg-background">
            <NavbarWrapper />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 