import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CursorFX } from "@/components/CursorFX";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Greenleaf | The CEO Matcha",
  description: "A premium scrollytelling experience for Greenleaf Coffee Co.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-dark">
      <body className={inter.className}>
        <Navbar />
        <CursorFX />
        {children}
        <Footer />
      </body>
    </html>
  );
}
