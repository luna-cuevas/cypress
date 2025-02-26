"use client";

import { useState } from "react";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
export default function TabContent({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("description");
  console.log("product", product);
  return (
    <>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-between">
          {["description", "highlights"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={classNames(
                activeTab === tab
                  ? "border-cypress-green text-cypress-green dark:text-cypress-green-light"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600",
                "whitespace-nowrap w-full py-4 px-1 border-b-2 font-medium text-base"
              )}
              onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {activeTab === "description" && (
          <div className="text-sm">
            {product?.descriptionHtml ? (
              <div
                className="text-gray-700 dark:text-gray-300 gap-2 flex flex-col"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : product?.description ? (
              <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                No description found.
              </p>
            )}
          </div>
        )}
        {activeTab === "highlights" && (
          <div className="mt-4">
            <ul
              role="list"
              className="list-disc space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {product?.highlights
                ? product?.highlights.map((highlight: any, index: number) => (
                    <li key={index} className="">
                      {highlight}
                    </li>
                  ))
                : "No highlights found"}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
