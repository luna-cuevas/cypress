import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
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
    <html lang="en" className={`dark !${trajan.className}`}>
      <body className="bg-gray-200 relative dark:bg-gray-900 ">
        <div className="main-container">
          <HotjarInit />
          <LoadingScreen />
          <Navigation />
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
