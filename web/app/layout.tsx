// import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@/app/custom.css";
import { Providers } from "@/app/providers";
import NavbarWrapper from "@/components/navbar-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

import type { Metadata } from "next";

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
            <SidebarProvider>
              <NavbarWrapper />
              <main className="flex-1 flex justify-center md:pt-0 pt-14">
                <div className="w-full">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
} 