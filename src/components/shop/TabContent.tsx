"use client";

import { useState } from "react";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
export default function TabContent({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("description");
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
                  ? "border-cypress-green text-cypress-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
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
            <p className=" text-gray-700">
              {product?.description || "No description found."}
            </p>
          </div>
        )}
        {activeTab === "highlights" && (
          <div className="mt-4">
            <ul
              role="list"
              className="list-disc space-y-2 text-sm text-gray-700">
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
