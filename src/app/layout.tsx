import { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation/Navigation";
import Cart from "@/components/shop/Cart";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Provider as JotaiProvider } from "jotai";
import { NavDrawer } from "@/components/Navigation/NavDrawer";
import LoadingScreen from "@/components/LoadingScreen";

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
            <Navigation />
            <Suspense fallback={<div>Loading...</div>}>
              <Cart />
              <NavDrawer />
              <LoadingScreen />
            </Suspense>
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
