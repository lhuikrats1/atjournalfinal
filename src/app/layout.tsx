import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "atjournal | Terminal",
  description: "Automated trading journal platform with high-performance analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(
        inter.variable, 
        mono.variable,
        "font-sans bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground relative min-h-screen"
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
