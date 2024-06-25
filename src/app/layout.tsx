import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  sedan,
  arpona,
  trajan,
  trajanRegular,
  trajanLight,
} from "../lib/fonts";
import Footer from "@/components/Footer";
import HotjarInit from "@/components/HotJarInit";
import Cart from "@/components/Cart";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import fetchProducts from "@/app/utils/fetchProducts";
import LoginModal from "@/components/Navigation/LoginModal";

export const metadata: Metadata = {
  title: "Cypress",
  description: "Cypress Fashion",
  icons: [
    {
      rel: "icon",
      href: "/cypress-logo.svg",
      url: "/cypress-logo.svg",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await fetchProducts();
  return (
    <html lang="en" className={`dark !${trajan.className} overflow-x-hidden`}>
      <body className="bg-white relative dark:bg-gray-900 ">
        <div className="main-container ">
          <HotjarInit />
          <LoadingScreen />
          <Navigation products={products} />
          <LoginModal />
          <Cart />

          {children}
          <Footer />
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={true}
          pauseOnHover={true}
        />
      </body>
    </html>
  );
}
