import type { Metadata } from "next";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

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
      className={`${notoSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <AppProviders fontFamily="var(--font-noto-sans), sans-serif">
            {children}
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
