import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Omkar Lute — Web3 & AI",
  description: "Portfolio of Omkar Lute: Web3 Developer & AI Engineer.",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: { title: "Omkar Lute", description: "Web3 & AI Portfolio", type: "website" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
