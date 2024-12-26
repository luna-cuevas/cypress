"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { Accordion } from "../Accordion";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Option, Select, Slider } from "@material-tailwind/react";

const sortOptions = [
  { name: "Relevance", value: "relevance", current: true },
  { name: "Best Rating", value: "best_selling", current: false },
  { name: "Newest", value: "created_at", current: false },
  { name: "Price: Low to High", value: "price_asc", current: false },
  { name: "Price: High to Low", value: "price_desc", current: false },
];

const filters = [
  {
    id: "size",
    name: "Size",
    buttonStyles:
      "flex w-full items-center !justify-between py-3 lg:py-1 h-full items-center text-sm text-gray-400 hover:text-gray-500",
    bodyStyles: "pt-4",
    options: [
      { value: "XS", label: "XS", checked: false, width: "w-14" },
      { value: "S", label: "S", checked: false, width: "w-10" },
      { value: "M", label: "M", checked: false, width: "w-10" },
      { value: "L", label: "L", checked: false, width: "w-10" },
      { value: "XL", label: "XL", checked: false, width: "w-12" },
      { value: "XXL", label: "XXL", checked: false, width: "w-14" },
    ],
  },
  {
    id: "vendor",
    name: "Brand",
    buttonStyles:
      "flex w-full items-center !justify-between py-3 lg:py-1 h-full items-center text-sm text-gray-400 hover:text-gray-500",
    bodyStyles: "pt-4",
    options: [],
  },
];

type Props = {
  children: React.ReactNode;
  title?: string;
  subCategories: {
    name: string;
    href: string;
    breadcrumb: string;
    image: string;
  }[];
  productCount?: number;
  vendors: string[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductFilters({
  children,
  title,
  subCategories,
  productCount,
  vendors,
}: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState(4);
  const [sortKey, setSortKey] = useState("");
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const sortFilter = searchParams.get("sort");
  const sizes = Array.from(selectedSizes).join(",");
  const router = useRouter();
  const pathName = usePathname();
  let pathSegments = pathName.split("/").filter(Boolean);
  const [value, setValue] = useState("relevance");
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  if (sortFilter) {
    pathSegments.push(sortFilter);
  }

  const handleSizeChange = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);

    const params = new URLSearchParams(searchParams.toString());
    if (newSizes.length > 0) {
      params.set("sizes", newSizes.join(","));
    } else {
      params.delete("sizes");
    }
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    const params = new URLSearchParams(searchParams.toString());
    params.set("grid", newSize.toString());
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleVendorChange = (vendor: string) => {
    const newVendors = selectedVendors.includes(vendor)
      ? selectedVendors.filter((v) => v !== vendor)
      : [...selectedVendors, vendor];
    setSelectedVendors(newVendors);

    const params = new URLSearchParams(searchParams.toString());
    if (newVendors.length > 0) {
      params.set("vendors", newVendors.join(","));
    } else {
      params.delete("vendors");
    }
    router.push(`${pathName}?${params.toString()}`);
  };

  useEffect(() => {
    const gridParam = searchParams.get("grid");
    if (gridParam) {
      setGridSize(Number(gridParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const vendorsParam = searchParams.get("vendors");
    if (vendorsParam) {
      setSelectedVendors(vendorsParam.split(","));
    }
  }, [searchParams]);

  // Remove the slider styles and add grid button styles
  const gridButtonStyles = {
    base: `h-8 w-8 flex items-center justify-center rounded-md border transition-all duration-200`,
    active: `border-black bg-black text-white dark:border-white dark:bg-white dark:text-black active:bg-black active:text-white focus:bg-black focus:text-white`,
    inactive: `border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600`,
  };

  return (
    <div className="bg-white dark:bg-black">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="py-4">
          <ol role="list" className="flex items-center space-x-1">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
            </li>
            {pathSegments.map((segment, index) => {
              let href = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;

              if (segment === "created_at") {
                segment = "New Arrivals";
                href = "/shop?sort=created_at";
              }

              if (segment === "best_selling") {
                segment = "Best Sellers";
                href = "/shop?sort=best_selling";
              }

              return (
                <li key={segment} className="flex items-center">
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300 dark:text-gray-600">
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                  <Link
                    href={href}
                    aria-current={isLast ? "page" : undefined}
                    className={classNames(
                      isLast
                        ? "font-semibold text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                      "ml-2 text-xs capitalize"
                    )}>
                    {segment}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {productCount} {productCount === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    aria-hidden="true"
                  />
                </MenuButton>
              </div>

              <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value}>
                      {({ active }) => (
                        <Link
                          href={{
                            pathname: pathName,
                            query: {
                              ...Object.fromEntries(searchParams.entries()),
                              sort: option.value,
                            },
                          }}
                          className={classNames(
                            active ? "bg-gray-100 dark:bg-gray-800" : "",
                            "block px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white"
                          )}>
                          {option.name}
                        </Link>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            {/* Desktop Grid Size Control */}
            <Menu as="div" className="relative flex text-left items-end">
              <MenuButton className="group inline-flex mt-auto text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                <Squares2X2Icon
                  className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                  aria-hidden="true"
                />
              </MenuButton>

              <MenuItems className="absolute  right-0 z-10 mt-2 w-40 origin-bottom-left rounded-md bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4">
                  <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Grid Size
                  </div>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleGridSizeChange(size)}
                        className={`${gridButtonStyles.base} ${
                          gridSize === size
                            ? gridButtonStyles.active
                            : gridButtonStyles.inactive
                        }`}
                        title={`${size} columns`}>
                        <div
                          className="grid gap-0.5"
                          style={{
                            gridTemplateColumns: `repeat(${Math.min(
                              size,
                              3
                            )}, minmax(0, 1fr))`,
                          }}>
                          {Array(Math.min(size, 6))
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 bg-current rounded-sm"
                              />
                            ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </MenuItems>
            </Menu>

            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}>
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile filter dialog */}
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}>
          <div className="fixed inset-0 bg-black/25 dark:bg-black/50" />

          <div className="fixed inset-0 z-40 flex">
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-900 py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white dark:bg-gray-900 p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setMobileFiltersOpen(false)}>
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Grid Size Control */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    Grid Layout
                  </h3>
                  <div className="flex items-center gap-2">
                    {[2, 3, 4, 5].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          handleGridSizeChange(size);
                          setMobileFiltersOpen(false);
                        }}
                        className={`${gridButtonStyles.base} ${
                          gridSize === size
                            ? gridButtonStyles.active
                            : gridButtonStyles.inactive
                        }`}
                        title={`${size} columns`}>
                        <div
                          className="grid gap-0.5"
                          style={{
                            gridTemplateColumns: `repeat(${Math.min(
                              size,
                              3
                            )}, minmax(0, 1fr))`,
                          }}>
                          {Array(Math.min(size, 6))
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 bg-current rounded-sm"
                              />
                            ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories Section */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-6">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Categories
                  </h3>
                  <div className="mt-4 space-y-4">
                    {subCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Size Filters */}
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-gray-900 px-2 py-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          {section.id === "size" ? (
                            <div className="flex flex-wrap gap-3">
                              {section.options.map((option) => (
                                <div
                                  key={option.value}
                                  className={`flex items-center justify-center ${
                                    option.width
                                  } h-8 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 cursor-pointer ${
                                    selectedSizes.includes(option.value)
                                      ? "bg-black dark:bg-white border-black dark:border-white"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleSizeChange(option.value)
                                  }>
                                  <span
                                    className={`text-sm font-medium ${
                                      selectedSizes.includes(option.value)
                                        ? "text-white dark:text-black"
                                        : "text-gray-600 dark:text-gray-400"
                                    }`}>
                                    {option.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {vendors.map((vendor) => (
                                <div
                                  key={vendor}
                                  className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
                                    selectedVendors.includes(vendor)
                                      ? "bg-black dark:bg-white text-white dark:text-black"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                  }`}
                                  onClick={() => handleVendorChange(vendor)}>
                                  <span className="text-sm font-medium">
                                    {vendor}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Desktop filter section */}
        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Categories
                </h3>
                <div className="mt-4 space-y-4">
                  {subCategories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {filters.map((section) => (
                <Disclosure
                  as="div"
                  key={section.id}
                  className="border-b border-gray-200 dark:border-gray-700 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full dark:bg-white/5 px-2 items-center justify-between bg-gray-600/5 py-3 text-sm text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        {section.id === "size" ? (
                          <div className="flex flex-wrap gap-3">
                            {section.options.map((option) => (
                              <div
                                key={option.value}
                                className={`flex items-center justify-center ${
                                  option.width
                                } h-8 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 cursor-pointer ${
                                  selectedSizes.includes(option.value)
                                    ? "bg-black dark:bg-white border-black dark:border-white"
                                    : ""
                                }`}
                                onClick={() => handleSizeChange(option.value)}>
                                <span
                                  className={`text-sm font-medium ${
                                    selectedSizes.includes(option.value)
                                      ? "text-white dark:text-black"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}>
                                  {option.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {vendors.map((vendor) => (
                              <div
                                key={vendor}
                                className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
                                  selectedVendors.includes(vendor)
                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                                onClick={() => handleVendorChange(vendor)}>
                                <span className="text-sm font-medium">
                                  {vendor}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </form>

            {/* Product grid */}
            <div className="lg:col-span-3">
              {React.cloneElement(children as React.ReactElement, { gridSize })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
