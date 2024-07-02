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
import { trajanRegular } from "@/lib/fonts";

const sortOptions = [
  { name: "Relevance", value: "relevance", current: true },
  { name: "Best Rating", value: "best_selling", current: false },
  { name: "Newest", value: "created_at", current: false },
  { name: "Price: Low to High", value: "price_asc", current: false },
  { name: "Price: High to Low", value: "price_desc", current: false },
];
const subCategories = [
  {
    name: "All",
    href: "/shop",
    breadcrumb: "shop",
  },
  {
    name: "Pants",
    href: "/shop/pants",
    breadcrumb: "pants",
  },
  {
    name: "Shirts",
    href: "/shop/shirts",
    breadcrumb: "shirts",
  },
];
const filters = [
  {
    id: "size",
    name: "Size",
    buttonStyles:
      "flex w-full  items-center !justify-between py-3 text-sm text-gray-400 hover:text-gray-500",
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
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductFilters({ children, title }: Props) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState("");
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const sizes = Array.from(selectedSizes).join(",");
  const router = useRouter();
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);

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
            <form className="mt-4 border-t border-gray-200">
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
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop View */}
      <main className="mx-auto max-w-screen  mt-6   h-full w-full">
        <div className="flex flex-col  justify-between border-y border-gray-200 pt-2  mx-auto">
          <nav aria-label="Breadcrumb" className="pb-2 pl-2 border-b lg:w-full">
            <ol role="list" className="flex max-w-2xl items-center space-x-1">
              <li className="flex items-center">
                <Link
                  href={`/`}
                  className="font-medium text-xs text-gray-500 hover:text-gray-600">
                  Home
                </Link>
              </li>
              {pathSegments.map((segment, index) => {
                const href = "/" + pathSegments.slice(0, index + 1).join("/");
                const isLast = index === pathSegments.length - 1;

                return (
                  <li key={segment} className="flex items-center">
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
          <h1
            className={`${trajanRegular.className} px-[2%] mt-2 lg:w-full lg:text-xl font-bold text-2xl tracking-widest text-black dark:text-white`}>
            {title}
          </h1>
          <div className="flex items-center lg:w-full px-[2%]">
            <div className=" w-full justify-between flex gap-2">
              <div className="w-full flex gap-4 items-center">
                {subCategories.map((category) => (
                  <Link
                    className={`text-sm  text-black dark:text-white
                      ${
                        pathSegments
                          .slice(-1)
                          .includes(category.breadcrumb.toLowerCase())
                          ? `${trajanRegular.className} underline font-bold`
                          : ""
                      }
                      `}
                    key={category.name}
                    href={category.href}>
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="lg:w-full hidden lg:flex justify-end">
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

                <Menu
                  as="div"
                  className="relative my-auto inline-block text-left">
                  <div>
                    <MenuButton className="group inline-flex gap-4 justify-center text-base font-medium dark:text-white dark:hover:text-gray-300">
                      Sort
                      <ChevronDownIcon
                        className="h-7 w-7 text-black dark:text-white "
                        aria-hidden="true"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute bg-white dark:bg-cypress-green right-0 z-10  w-40 py-2 origin-top-right rounded-xl  shadow-2xl ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        {({ focus }) => (
                          <button
                            type="button"
                            onClick={() => {
                              setSortKey(option.value);
                              sortOptions.forEach((item) => {
                                item.current = false;
                              });
                              option.current = true;
                            }}
                            className={classNames(
                              option.current
                                ? "font-medium dark:text-white text-white bg-cypress-green-light bg-opacity-80"
                                : "text-gray-600 dark:text-gray-300",
                              focus
                                ? "bg-cypress-green-light dark:bg-opacity-50 bg-opacity-60 text-white"
                                : "",
                              "block w-full my-0 px-4 py-2 text-sm "
                            )}>
                            {option.name}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
                <div className="hidden lg:block">
                  <Accordion
                    title="View"
                    buttonStyles="flex w-full items-center justify-between  py-3 text-sm text-black hover:text-gray-500"
                    bodyStyles="pt-6"
                    view={true}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className=" p-2 text-gray-400 hover:text-gray-500  lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}>
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className=" pt-6 h-full">
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
