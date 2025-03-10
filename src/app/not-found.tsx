import Link from "next/link";
import type { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "404 - Page Not Found | Cypress Clothiers",
  description:
    "Sorry, the page you are looking for does not exist. Please return to the homepage or contact support for assistance.",
  robots: {
    index: false, // Prevent indexing
    follow: true, // Allow following links
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "404 - Page Not Found",
    description:
      "Sorry, the page you are looking for does not exist. Please return to the homepage or contact support for assistance.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "404 - Page Not Found",
      },
    ],
  },
};

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-70px)] place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we could not find the page you are looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Go back home
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
