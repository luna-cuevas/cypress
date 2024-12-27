"use client";
import { handleSubscribe } from "@/utils/handleNewsLetterSignUp";
import { Motion } from "@/utils/Motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Footer = () => {
  const path = usePathname();
  const [signUpStatus, setSignUpStatus] = useState({ message: "", status: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (signUpStatus.status === "error") {
      setTimeout(() => setSignUpStatus({ message: "", status: "" }), 3000);
    }
  }, [signUpStatus]);

  if (path === "/") return null;

  const shopCategories = [
    { title: "Shop All", url: "/shop" },
    { title: "Shirting", url: "/shop/shirts" },
    { title: "T-Shirts", url: "/shop/t-shirts" },
    { title: "Trousers", url: "/shop/pants" },
    { title: "Denim", url: "/shop/denim" },
    { title: "Footwear", url: "/shop/footwear" },
    { title: "Accessories", url: "/shop/accessories" },
  ];

  const footerLinks = {
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    support: [
      { label: "Shipping", href: "/shipping-policy" },
      { label: "Returns", href: "/returns-policy" },
    ],
    legal: [
      { label: "Terms", href: "/terms-of-service" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await handleSubscribe(e);

    if (response.status === "error") {
      setSignUpStatus({ message: response.message, status: "error" });
      toast.error(response.message);
    } else {
      setSignUpStatus({ message: response.message, status: "success" });
      toast.success(response.message);
    }
  };

  return (
    isLoaded && (
      <Motion
        type="footer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5 }}
        className="relative w-full border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto px-2 sm:px-3 lg:px-4">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
              {/* Left Section - Newsletter */}
              <div className="py-8 lg:pr-8">
                {signUpStatus.status === "" ? (
                  <form
                    onSubmit={onSubmit}
                    className="flex flex-col w-3/4 mx-auto lg:mx-0">
                    <h2 className="text-xs uppercase tracking-wider mb-3">
                      Newsletter
                    </h2>
                    <div className="flex w-full gap-4 items-center">
                      <input
                        className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 pb-1 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        name="email"
                        type="email"
                        placeholder="Newsletter Sign Up"
                        id="email"
                      />
                      <button
                        type="submit"
                        className="text-xs uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors pb-1">
                        →
                      </button>
                    </div>
                  </form>
                ) : (
                  <p
                    className={`text-${
                      signUpStatus.status === "success" ? "green" : "red"
                    }-500 text-xs`}>
                    {signUpStatus.message}
                  </p>
                )}
              </div>

              {/* Center Section - Navigation */}
              <div className="py-8 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 justify-center">
                  <div>
                    <h2 className="text-xs uppercase tracking-wider mb-3">
                      Shop
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {shopCategories.map(({ title, url }) => (
                        <Link
                          key={title}
                          href={url}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors whitespace-nowrap">
                          {title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xs uppercase tracking-wider mb-3">
                      Info
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                      {[
                        ...footerLinks.company,
                        ...footerLinks.support,
                        ...footerLinks.legal,
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors whitespace-nowrap">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Social */}
              <div className="py-8 lg:pl-8">
                <div className="flex gap-4 justify-center">
                  <Link
                    href="https://www.instagram.com"
                    className="hover:opacity-70 transition-opacity">
                    <Image
                      className="dark:invert"
                      src="/socials-logos/instagram.svg"
                      alt="Instagram"
                      width={16}
                      height={16}
                    />
                  </Link>
                  <Link
                    href="https://www.facebook.com"
                    className="hover:opacity-70 transition-opacity">
                    <Image
                      className="dark:invert"
                      src="/socials-logos/facebook.svg"
                      alt="Facebook"
                      width={16}
                      height={16}
                    />
                  </Link>
                  <Link
                    href="https://www.twitter.com"
                    className="hover:opacity-70 transition-opacity">
                    <Image
                      className="dark:invert"
                      src="/socials-logos/twitter.svg"
                      alt="Twitter"
                      width={16}
                      height={16}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden py-6 px-[2%]">
            <div className="space-y-6">
              {/* Newsletter */}
              <div className="pb-6  border-b border-gray-200 dark:border-gray-700">
                {signUpStatus.status === "" ? (
                  <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <h2 className="text-xs uppercase tracking-wider">
                      Newsletter
                    </h2>
                    <div className="flex gap-4 items-end">
                      <input
                        className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 pb-1 text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                        name="email"
                        type="email"
                        placeholder="Newsletter Sign Up"
                        id="email-mobile"
                      />
                      <button
                        type="submit"
                        className="text-xs uppercase tracking-wider hover:text-gray-600 dark:hover:text-gray-300 transition-colors pb-1">
                        →
                      </button>
                    </div>
                  </form>
                ) : (
                  <p
                    className={`text-${
                      signUpStatus.status === "success" ? "green" : "red"
                    }-500 text-xs`}>
                    {signUpStatus.message}
                  </p>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-xs uppercase tracking-wider mb-2">
                    Shop
                  </h2>
                  <div className="space-y-1">
                    {shopCategories.map(({ title, url }) => (
                      <Link
                        key={title}
                        href={url}
                        className="block text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xs uppercase tracking-wider mb-2">
                    Info
                  </h2>
                  <div className="space-y-1">
                    {[
                      ...footerLinks.company,
                      ...footerLinks.support,
                      ...footerLinks.legal,
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="flex gap-4 justify-center">
                <Link
                  href="https://www.instagram.com"
                  className="hover:opacity-70 transition-opacity">
                  <Image
                    className="dark:invert"
                    src="/socials-logos/instagram.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link
                  href="https://www.facebook.com"
                  className="hover:opacity-70 transition-opacity">
                  <Image
                    className="dark:invert"
                    src="/socials-logos/facebook.svg"
                    alt="Facebook"
                    width={16}
                    height={16}
                  />
                </Link>
                <Link
                  href="https://www.twitter.com"
                  className="hover:opacity-70 transition-opacity">
                  <Image
                    className="dark:invert"
                    src="/socials-logos/twitter.svg"
                    alt="Twitter"
                    width={16}
                    height={16}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright - Both Layouts */}
          <div className="py-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[10px] text-gray-600 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} Cypress Clothiers. All rights
              reserved.
            </p>
          </div>
        </div>
      </Motion>
    )
  );
};

export default Footer;
