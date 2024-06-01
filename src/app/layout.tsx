import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Cypress",
  description: "Cypress Fashion",
  viewport: "width=device-width, initial-scale=1",
  icons: [
    {
      rel: "icon",
      href: "/cypress-logo.svg",
      url: "/cypress-logo.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-200 relative">
        <LoadingScreen />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
