import { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation/Navigation";
import Cart from "@/components/shop/Cart";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Provider as JotaiProvider } from "jotai";
import { NavDrawer } from "@/components/Navigation/NavDrawer";
import LoadingScreen from "@/components/common/IntroAnimation";

export const metadata: Metadata = {
  title: "Cypress",
  description: "Cypress - Your Ultimate Destination for Luxury Fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="w-screen overflow-x-hidden">
        <JotaiProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation />
              <Cart />
              <NavDrawer />
              <LoadingScreen />
              <main>{children}</main>
              <Footer />
            </Suspense>
          </AuthProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
