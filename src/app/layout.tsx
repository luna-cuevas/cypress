import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
