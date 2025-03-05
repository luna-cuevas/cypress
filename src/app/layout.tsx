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
import type { Viewport } from "next";

// Define structured data types
type StructuredData = Record<string, unknown>;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  // Base URL for the site
  const baseUrl = "https://cypressclothiers.com";

  // Create structured data for organization
  const organizationSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cypress Clothiers",
    url: baseUrl,
    logo: `${baseUrl}/cypress-logo.svg`,
    sameAs: [
      "https://www.instagram.com/cypressclothiers",
      "https://twitter.com/cypressclothiers",
      // Add other social media links as needed
    ],
    description:
      "Premium menswear brand offering minimalist, high-quality designs for the modern gentleman.",
  };

  // Create structured data for website
  const websiteSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cypress Clothiers",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    title: {
      template: "%s | Cypress Clothiers",
      default: "Cypress Clothiers - Refined Minimalist Menswear",
    },
    description:
      "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman.",
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
      "premium menswear",
      "minimalist clothing",
      "high-end fashion",
      "designer menswear",
      "luxury essentials",
      "modern tailoring",
      "sustainable fashion",
      "quality fabrics",
      "timeless design",
      "men's essentials",
      "sophisticated style",
      "clean aesthetics",
      "sartorial excellence",
      "premium shirts",
      "designer pants",
      "luxury denim",
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
    category: "E-commerce, Fashion, Menswear",
    openGraph: {
      images: [
        {
          url: "/images/og-home.jpg",
          width: 1200,
          height: 630,
          alt: "Cypress Clothiers - Refined Minimalist Menswear",
        },
      ],
      title: "Cypress Clothiers - Refined Minimalist Menswear",
      description:
        "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman.",
      url: baseUrl,
      type: "website",
      locale: "en_US",
      siteName: "Cypress Clothiers",
    },
    twitter: {
      card: "summary_large_image",
      title: "Cypress Clothiers - Refined Minimalist Menswear",
      description:
        "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman.",
      site: "@cypressclothiers",
      creator: "@cypressclothiers",
      images: [
        {
          url: "/images/og-home.jpg",
          alt: "Cypress Clothiers - Refined Minimalist Menswear",
          width: 1200,
          height: 630,
        },
      ],
    },

    authors: [{ name: "Cypress Clothiers" }],
    creator: "Cypress Clothiers",
    publisher: "Cypress Clothiers",
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },
    other: {
      "theme-color": "#000000",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black",
      "format-detection": "telephone=no",
      "json-ld": JSON.stringify([organizationSchema, websiteSchema]),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
          theme="light"
        />
      </body>
    </html>
  );
}
