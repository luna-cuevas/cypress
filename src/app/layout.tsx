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
  maximumScale: 5, // Allow users to zoom for better accessibility
  userScalable: true, // Enable scaling for accessibility
  themeColor: "#000000",
  colorScheme: "dark light",
};

export async function generateMetadata(): Promise<Metadata> {
  // Base URL for the site
  const baseUrl = "https://cypressclothiers.com";

  // Product images for better representation
  const productImageUrl = `${baseUrl}/images/featured-product.jpg`;
  const logoUrl = `${baseUrl}/cypress-logo.svg`;

  // Create structured data for organization
  const organizationSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cypress Clothiers",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 512,
      height: 512,
      caption: "Cypress Clothiers logo",
    },
    sameAs: [
      "https://www.instagram.com/cypress.dtx",
      "https://twitter.com/cypressclothiers",
      "https://www.facebook.com/cypressclothiers",
      "https://www.pinterest.com/cypressclothiers",
    ],
    description:
      "Premium menswear brand offering minimalist, high-quality designs for the modern gentleman.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-CYPRESS",
      contactType: "customer service",
      email: "support@cypressclothiers.com",
      availableLanguage: "English",
    },
    foundingDate: "2022",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3948 Buena Vista St, #102",
      addressLocality: "Dallas",
      addressRegion: "TX",
      postalCode: "75204",
      addressCountry: "US",
    },
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
    description:
      "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman.",
    publisher: {
      "@type": "Organization",
      name: "Cypress Clothiers",
      logo: logoUrl,
    },
  };

  // Create structured data for the store as a business
  const storeSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Cypress Clothiers",
    image: logoUrl,
    "@id": `${baseUrl}/#store`,
    url: baseUrl,
    telephone: "+1-800-CYPRESS",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "3948 Buena Vista St, #102",
      addressLocality: "Dallas",
      addressRegion: "TX",
      postalCode: "75204",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.80664,
      longitude: -96.80338,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "17:00",
      },
    ],
    sameAs: ["https://www.instagram.com/cypress.dtx"],
  };

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
      languages: {
        "en-US": `${baseUrl}/en-us`,
      },
    },
    title: {
      template: "%s | Cypress Clothiers",
      default:
        "Cypress Clothiers - Premium Minimalist Menswear for the Modern Gentleman",
    },
    description:
      "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman. Shop our curated collection of essentials.",
    icons: [
      {
        url: "/cypress-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
        rel: "apple-touch-icon",
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
      "business casual",
      "ethically made clothes",
      "high-quality menswear",
      "wardrobe essentials",
    ].join(", "),
    robots: {
      index: true,
      follow: true,
      nocache: process.env.NODE_ENV !== "production",
      googleBot: {
        index: true,
        follow: true,
        nocache: process.env.NODE_ENV !== "production",
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "E-commerce, Fashion, Menswear, Premium Clothing",
    openGraph: {
      images: [
        {
          url: "/og-image.jpg", // Replace with a high-quality promotional image
          width: 1200,
          height: 630,
          alt: "Premium minimalist menswear collection at Cypress Clothiers",
        },
        {
          url: logoUrl,
          width: 512,
          height: 512,
          alt: "Cypress Clothiers logo",
        },
      ],
      title:
        "Cypress Clothiers - Premium Minimalist Menswear for the Modern Gentleman",
      description:
        "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman.",
      url: baseUrl,
      type: "website",
      locale: "en_US",
      siteName: "Cypress Clothiers",
      countryName: "United States",
      emails: ["contact@cypressclothiers.com"],
      phoneNumbers: ["+1-800-CYPRESS"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Cypress Clothiers - Premium Minimalist Menswear",
      description:
        "Discover premium minimalist menswear at Cypress Clothiers. Thoughtfully crafted garments combining timeless design, quality materials, and precise tailoring for the modern gentleman.",
      site: "@cypress_dtx",
      creator: "@cypress_dtx",
      images: [
        {
          url: "/twitter-card.jpg", // Replace with a Twitter-optimized image
          alt: "Premium minimalist menswear collection at Cypress Clothiers",
          width: 1200,
          height: 630,
        },
      ],
    },
    applicationName: "Cypress Clothiers",
    referrer: "origin-when-cross-origin",
    authors: [{ name: "Cypress Clothiers", url: baseUrl }],
    creator: "Cypress Clothiers",
    publisher: "Cypress Clothiers",
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },
    verification: {
      google: "google-site-verification-code", // Replace with your actual verification code
      yandex: "yandex-verification-code", // Replace with your actual verification code if using Yandex
      yahoo: "yahoo-verification-code", // Replace with your actual verification code if using Yahoo
    },
    appleWebApp: {
      capable: true,
      title: "Cypress Clothiers",
      statusBarStyle: "black-translucent",
    },
    bookmarks: [
      `${baseUrl}/shop`,
      `${baseUrl}/collections/new-arrivals`,
      `${baseUrl}/collections/best-sellers`,
    ],
    other: {
      "theme-color": "#000000",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black",
      "format-detection": "telephone=no",
      "json-ld": JSON.stringify([
        organizationSchema,
        websiteSchema,
        storeSchema,
      ]),
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
