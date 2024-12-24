"use client";
import { useEffect, useState } from "react";
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
import { Option, Select } from "@material-tailwind/react";

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
      "flex w-full  items-center !justify-between py-3 lg:py-1 h-full items-center text-sm text-gray-400 hover:text-gray-500",
    bodyStyles: "pt-6",
    options: [
      { value: "s", label: "S", checked: false },
      { value: "m", label: "M", checked: false },
      { value: "l", label: "L", checked: false },
    ],
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
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductFilters({
  children,
  title,
  subCategories,
  productCount,
}: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
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

  if (sortFilter) {
    pathSegments.push(sortFilter);
  }

  const handleSizeClick = (e: any) => {
    const value = e.target.defaultValue;
    setSelectedSizes((prevSelectedSizes) => {
      const newSelectedSizes = new Set(prevSelectedSizes);
      if (newSelectedSizes.has(value)) {
        newSelectedSizes.delete(value);
      } else {
        newSelectedSizes.add(value);
      }
      return newSelectedSizes;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedSizes.size > 0) {
      params.set("sizes", sizes);
    }
    if (selectedSizes.size === 0) {
      params.delete("sizes");
    }
    if (sortKey) {
      params.set("sort", sortKey);
    }
    if (view) {
      params.set("view", view);
    }
    router.push(`?${params.toString()}`);
  }, [selectedSizes, sortKey]);

  return (
    <div className="h-full w-full overflow-hidden">
      <nav aria-label="Breadcrumb" className="md:py-4 py-2 px-[2%] lg:w-full ">
        <ol role="list" className="flex max-w-2xl items-center space-x-1">
          <li className="flex items-center">
            <Link
              href={`/`}
              className="font-medium text-xs text-gray-500 hover:text-gray-600">
              Home
            </Link>
          </li>
          {pathSegments.map((segment, index) => {
            let href = "/" + pathSegments.slice(0, index + 1).join("/");
            const isLast = index === pathSegments.length - 1;

            if (segment == "created_at") {
              segment = "New Arrivals";
              href = "/shop?sort=created_at";
            }

            if (segment == "best_selling") {
              segment = "Best Sellers";
              href = "/shop?sort=best_selling";
            }

            return (
              <li key={segment} className="flex items-center capitalize">
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-4 mr-0 text-gray-300">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
                <Link
                  href={href}
                  aria-current={
                    index === pathSegments.length - 1 ? "page" : undefined
                  }
                  className={
                    isLast
                      ? "font-bold text-xs text-gray-900 dark:text-white"
                      : "font-medium text-xs text-gray-500 hover:text-gray-600"
                  }>
                  {segment}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile filter dialog */}
      <Dialog
        className="relative z-[100000000] lg:hidden"
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}>
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex ">
          <DialogPanel
            transition
            className="relative ml-auto flex bg-white dark:bg-gray-900 h-full w-full max-w-xs transform flex-col overflow-y-auto py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md  p-2 text-gray-400"
                onClick={() => setMobileFiltersOpen(false)}>
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 border-t border-gray-200">
              <Accordion
                title="Categories"
                buttonStyles="flex w-full items-center justify-between py-3 text-base font-medium text-gray-400 hover:text-gray-500"
                bodyStyles="pt-6"
                body={subCategories.map((category) => {
                  return {
                    name: category.name,
                    href: category.href,
                  };
                })}
              />

              {filters.map((section) => (
                <Accordion
                  key={section.id}
                  title={section.name}
                  checked={checked}
                  setChecked={setChecked}
                  buttonStyles={section.buttonStyles}
                  bodyStyles={section.bodyStyles}
                  body={section.options}
                  handleSizeClick={handleSizeClick}
                />
              ))}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop View */}
      <main className="mx-auto max-w-screen mt-4  h-full w-full">
        <div className="flex flex-col  justify-between   mx-auto">
          <h1
            className={`!font-['trajan'] px-[2%] lg:w-full lg:text-xl font-bold text-2xl tracking-widest text-black dark:text-white`}>
            {title}
          </h1>

          {/* {sortFilter == "created_at" ? (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0 }}
              className=" ">
              <div className="xl:h-[50vh] h-[40vh] w-full my-4 flex flex-col md:grid md:grid-cols-2 px-[2%] py-0 overflow-hidden">
                <div className="relative  md:h-full h-3/4">
                  <Image
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                    placeholder="blur"
                    src={subCategories[0].image}
                    alt="Product image"
                    className="h-full w-full  object-cover object-center "
                  />
                </div>
                <div className=" bg-[#F6F6F4] md:p-4 pl-2 flex h-1/4 md:h-full">
                  <div className="md:mx-auto my-auto">
                    <h2 className="md:text-2xl text-base">New Arrivals</h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      The just-in styles for the new season. Explore the new
                      classics.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : sortFilter == "best_selling" ? (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0 }}
              className=" ">
              <div className="xl:h-[50vh] h-[40vh] w-full my-4 flex flex-col md:grid md:grid-cols-2 px-[2%] py-0 overflow-hidden">
                <div className="relative  md:h-full h-3/4">
                  <Image
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                    placeholder="blur"
                    src={subCategories[1].image}
                    alt="Product image"
                    className="h-full w-full  object-cover object-center "
                  />
                </div>
                <div className=" bg-[#F6F6F4] md:p-4 pl-2 flex h-1/4 md:h-full">
                  <div className="md:mx-auto my-auto">
                    <h2 className="md:text-2xl text-base">Bestsellers</h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      Our signature favorites.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="w-full h-full my-4 flex  overflow-x-scroll overflow-y-hidden px-[2%] py-0 lg:grid lg:grid-cols-5 gap-2">
              {subCategories.map((category, index) => {
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className=" ">
                    <Link
                      href={category.href}
                      className="text-xs relative text-gray-500 hover:text-gray-600">
                      <div className="relative bg-black rounded-sm lg:rounded-lg aspect-h-12 aspect-w-11 w-[200px] lg:w-full ">
                        <Image
                          fill
                          priority
                          quality={100}
                          sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                          placeholder="blur"
                          src={category.image}
                          alt="Product image"
                          className="h-full w-full opacity-80 rounded-sm lg:rounded-lg object-cover object-center "
                        />
                      </div>
                      <p className="absolute font-light text-white text-base bottom-6 left-6 h-fit">
                        {category.name}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )} */}

          <div className="flex items-center mt-2 lg:w-full px-[2%]">
            <div className=" w-full justify-between hidden lg:flex gap-2">
              <div className="w-full flex gap-4 items-center">
                <div className="hidden lg:block border-b border-gray-300">
                  <Accordion
                    title="Categories"
                    buttonStyles="flex w-full items-center justify-between py-3 lg:py-1 text-base font-medium text-gray-400 hover:text-gray-500"
                    bodyStyles="pt-6 "
                    body={subCategories.map((category) => {
                      return {
                        name: category.name,
                        href: category.href,
                      };
                    })}
                  />
                </div>

                <div className="hidden lg:block border-b border-gray-300">
                  {filters.map((section) => (
                    <Accordion
                      key={section.id}
                      title={section.name}
                      checked={checked}
                      setChecked={setChecked}
                      buttonStyles={section.buttonStyles}
                      bodyStyles={section.bodyStyles}
                      body={section.options}
                      handleSizeClick={handleSizeClick}
                    />
                  ))}
                </div>
              </div>

              <div className="lg:w-full hidden gap-2 lg:flex justify-end">
                <div className="text-sm w-fit items-center gap-2 flex text-gray-600 dark:text-gray-400">
                  <h3 className="w-fit flex h-fit my-auto">
                    {productCount} items
                  </h3>
                  |<h3 className="w-fit flex h-fit my-auto">Sort by:</h3>
                </div>
                <div className="flex ">
                  <Select
                    className="text-black dark:text-white"
                    label="Sort"
                    variant="static"
                    value={value}
                    containerProps={{
                      style: {
                        width: "fit-content",
                        minWidth: "150px",
                        height: "40px",
                        padding: "0px",
                        margin: "auto 0",
                        // color: "white",
                      },
                    }}
                    labelProps={{
                      style: {
                        display: "none",
                        color: "white",
                      },
                    }}
                    onChange={(val: any) => {
                      setValue(val);
                      setSortKey(val);
                      sortOptions.forEach((item) => {
                        item.current = item.value === val;
                      });
                    }}>
                    {sortOptions.map((option, index) => (
                      <Option
                        value={option.value}
                        key={index}
                        className="block placeholder:text-white w-full px-1 text-sm text-black ">
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-between lg:hidden">
              <h3 className="w-full h-fit my-auto text-gray-600 text-sm">
                {productCount} items
              </h3>

              <button
                type="button"
                className=" p-2 w-full max-w-[150px] justify-end gap-2 flex text-gray-600 hover:text-cypress-green  lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}>
                <span className="text-sm ">Filters & Sort</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <section aria-labelledby="products-heading" className=" pt-4 h-full">
          <div className="grid grid-cols-1 h-full gap-x-2 gap-y-2 lg:grid-cols-4">
            {/* Product grid */}
            <div className="lg:col-span-4 px-0  h-full w-full overflow-y-scroll">
              {children}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
