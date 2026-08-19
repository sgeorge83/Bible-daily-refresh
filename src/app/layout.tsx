import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Daily Refresh — Bible Reading Habit",
  description: "A tiny daily Bible reading to encourage you in God's Word.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 text-gray-800 antialiased">
        <header className="border-b border-sky-100 bg-white/70 backdrop-blur sticky top-0 z-50">
          <nav className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
            <a href="/" className="font-bold text-lg text-sky-700 tracking-tight">Daily Refresh</a>
            <div className="flex gap-4 text-sm font-medium">
              <a href="/" className="hover:text-sky-600">Today</a>
              <a href="/history" className="hover:text-sky-600">History</a>
              <a href="/settings" className="hover:text-sky-600">Settings</a>
            </div>
          </nav>
        </header>
        <Providers><main className="max-w-2xl mx-auto px-4 py-8">{children}</main></Providers>
        <footer className="text-center text-xs text-gray-400 py-6">
          Scripture from the <a href="https://ebible.org/web/" className="underline" target="_blank" rel="noopener">World English Bible</a> (Public Domain)
        </footer>
      </body>
    </html>
  );
}
