import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FirstMate - Online Gallery",
  description: "A personal online gallery to share moments with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full`}>
      <body className="min-h-full bg-gray-50 font-[family-name:var(--font-outfit)] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">{children}</main>
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
