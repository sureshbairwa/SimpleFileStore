

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider"
import SideNavbar from "@/components/SideNavbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SimpleFileStore",
  description: "SimpleFileStore is a modern web app that lets users securely upload, organize, and share their files with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {




  return (
    <html lang="en"  suppressHydrationWarning>
      <body
        
      > 
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        
        <Navbar />
        <div className="flex ">
        
           
          <SideNavbar />
          <main className="  md:ml-64    p-3.5 w-full ">{children}</main>
        </div>
       
        <Toaster position="top-right"/>
        </ThemeProvider>
      </body>
    </html>
  );
}
