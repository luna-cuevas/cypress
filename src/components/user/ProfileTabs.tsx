"use client";

import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import ProfileForm from "./ProfileForm";
import OrderHistory from "./OrderHistory";
import FavoritesList from "./FavoritesList";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import LoadingScreen from "../common/LoadingScreen";
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const TABS = [
  {
    label: "Profile Information",
    value: "profile",
    icon: UserIcon,
  },
  {
    label: "Order History",
    value: "orders",
    icon: ShoppingBagIcon,
  },
  {
    label: "Favorites",
    value: "favorites",
    icon: HeartIcon,
  },
];

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const [state] = useAtom(globalStateAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.user) {
      setIsLoading(false);
    }
  }, [state.user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!state.user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            Access Your Account
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please log in to view your personalized account dashboard.
          </p>
          <a
            href="/login"
            className="inline-block bg-cypress-green hover:bg-cypress-green-light text-white font-medium px-6 py-3 rounded-md transition-colors duration-200">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-6 lg:px-8">
      <Tabs value={activeTab} className="min-h-[600px]">
        <TabsHeader
          className="bg-transparent border-b border-gray-200 dark:border-gray-800 rounded-none p-0 overflow-x-auto max-w-full no-scrollbar"
          indicatorProps={{
            className:
              "bg-transparent border-b-2 border-cypress-green dark:border-cypress-green shadow-none",
          }}>
          {TABS.map(({ label, value, icon: Icon }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              className={`${
                activeTab === value
                  ? "text-cypress-green dark:text-cypress-green"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              } font-medium text-xs sm:text-sm px-2 sm:px-6 py-4 min-w-0 whitespace-nowrap md:flex-1 transition-colors duration-200`}>
              <div className="flex items-center justify-center sm:justify-start">
                <Icon className="h-5 w-5 mr-2 hidden sm:block" />
                <span>{label}</span>
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="pt-6 pb-8 px-0 sm:px-4 md:px-6">
          <TabPanel value="profile" className="p-0">
            <ProfileForm user={state.user} />
          </TabPanel>
          <TabPanel value="orders" className="p-0">
            <OrderHistory />
          </TabPanel>
          <TabPanel value="favorites" className="p-0">
            <FavoritesList />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}
