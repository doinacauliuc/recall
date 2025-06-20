import type { Metadata } from "next";
import { Geist, Geist_Mono, League_Spartan, Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/app/hooks/userContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}


      </body>
    </html>
  );
}
