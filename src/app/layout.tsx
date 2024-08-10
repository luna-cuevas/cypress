import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { arpona, trajan, trajanRegular, trajanLight } from "../lib/fonts";
import Footer from "@/components/Footer";
import HotjarInit from "@/utils/HotJarInit";
import Cart from "@/components/shop/Cart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoginModal from "@/components/Navigation/LoginModal";
import "@glidejs/glide/dist/css/glide.core.min.css";
import { AuthProvider } from "@/context/AuthContext";
import Template from "./template";

export const metadata: Metadata = {
  title: "Cypress",
  description: "Cypress Fashion",
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
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
  return (
    <html lang="en" className={`dark !${trajan.className} overflow-x-hidden`}>
      <body className="bg-white  dark:bg-gray-900 ">
        <AuthProvider>
          <div className="main-container relative">
            <HotjarInit />
            {/* <LoadingScreen /> */}
            <Navigation />
            <LoginModal />
            <Cart />
            <Template>{children}</Template>
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
        </AuthProvider>
      </body>
    </html>
  );
}
