import { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation/Navigation";
import Cart from "@/components/shop/Cart";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Provider as JotaiProvider } from "jotai";
import { NavDrawer } from "@/components/Navigation/NavDrawer";
import LoadingScreen from "@/components/common/LoadingScreen";
import IntroAnimation from "@/components/common/IntroAnimation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTransition from "@/components/common/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://cypressclothiers.com"),
    alternates: {
      canonical: "https://cypressclothiers.com/",
    },
    title: {
      template: "%s | Cypress Clothiers",
      default: "Cypress Clothiers - Premium Fashion & Lifestyle",
    },
    description:
      "Discover premium fashion and lifestyle products at Cypress Clothiers. Shop the latest trends in clothing, accessories, and more with worldwide shipping.",
    icons: [
      {
        url: "/cypress-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        color: "#ffffff",
      },
      {
        url: "/cypress-logo.svg",
        type: "image/svg+xml",
        sizes: "32x32",
        color: "#ffffff",
      },
      {
        url: "/cypress-logo.svg",
        type: "image/svg+xml",
        sizes: "180x180",
        rel: "apple-touch-icon",
        color: "#ffffff",
      },
    ],
    manifest: "/manifest.json",
    keywords: [
      "fashion",
      "clothing",
      "accessories",
      "lifestyle",
      "premium fashion",
      "online shopping",
      "designer clothes",
      "fashion store",
      "trendy fashion",
      "luxury fashion",
      "sustainable fashion",
      "worldwide shipping",
    ].join(", "),
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        nocache: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "E-commerce",
    openGraph: {
      images: [
        {
          url: "/cypress-logo.svg",
          width: 1200,
          height: 630,
          alt: "Cypress Clothiers - Premium Fashion & Lifestyle",
        },
      ],
      title: "Cypress Clothiers - Premium Fashion & Lifestyle",
      description:
        "Discover premium fashion and lifestyle products at Cypress Clothiers. Shop the latest trends in clothing, accessories, and more with worldwide shipping.",
      url: "https://cypressclothiers.com",
      type: "website",
      locale: "en_US",
      siteName: "Cypress Clothiers",
    },
    twitter: {
      card: "summary_large_image",
      title: "Cypress Clothiers - Premium Fashion & Lifestyle",
      description:
        "Discover premium fashion and lifestyle products at Cypress Clothiers. Shop the latest trends in clothing, accessories, and more with worldwide shipping.",
      site: "@cypressclothiers",
      creator: "@cypressclothiers",
      images: [
        {
          url: "/cypress-logo.svg",
          alt: "Cypress Clothiers - Premium Fashion & Lifestyle",
          width: 1200,
          height: 630,
        },
      ],
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },

    authors: [{ name: "Cypress Clothiers Team" }],
    creator: "Cypress Clothiers",
    publisher: "Cypress Clothiers",
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="w-screen overflow-x-hidden relative">
        <JotaiProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingScreen />}>
              <Navigation />
              <Cart />
              <NavDrawer />
              <IntroAnimation />
              <PageTransition />
              <main>{children}</main>
              <Footer />
            </Suspense>
          </AuthProvider>
        </JotaiProvider>
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
          theme="dark"
        />
      </body>
    </html>
  );
}
