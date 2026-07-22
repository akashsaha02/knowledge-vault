import type { Metadata } from "next";
import Script from "next/script";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme-mode');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}else{document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export const metadata: Metadata = {
  title: "Knowledge Vault",
  description: "Your personal knowledge vault for notes, snippets, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Script id="theme-mode-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <AntdRegistry>
          <AppProviders
            fontFamily="var(--font-sans), sans-serif"
            fontMono="var(--font-mono), monospace"
          >
            {children}
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
