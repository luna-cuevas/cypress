import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";
import HotjarInit from "@/utils/HotJarInit";
import Cart from "@/components/shop/Cart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@glidejs/glide/dist/css/glide.core.min.css";
import { AuthProvider } from "@/context/AuthContext";
import Template from "./template";
import { NavDrawer } from "@/components/Navigation/NavDrawer";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Cypress",
  description: "Cypress Fashion",
  metadataBase: new URL(`${process.env.BASE_URL}`),

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
    <html lang="en" className={`dark h-full  overflow-x-hidden w-screen`}>
      <body className="bg-white h-full dark:bg-black ">
        <AuthProvider>
          <SessionProvider>
            <div className="main-container h-full relative w-screen overflow-x-hidden">
              <HotjarInit />
              <LoadingScreen />
              <Navigation />
              <Cart />
              <Template>{children}</Template>
              <Footer />
              <NavDrawer />
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
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
