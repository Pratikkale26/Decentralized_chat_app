import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChatAppProvider } from "@/Components/ChatAppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat DApp",
  description: "A decentralized chat application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChatAppProvider>
          {children}
        </ChatAppProvider>
      </body>
    </html>
  );
}
