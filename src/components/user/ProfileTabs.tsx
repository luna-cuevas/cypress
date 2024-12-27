"use client";

import React, { useEffect, useState } from "react";
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
import type { User } from "@supabase/supabase-js";
import { useSupabase } from "@/lib/supabase";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import LoadingScreen from "../common/LoadingScreen";

const TABS = [
  {
    label: "Profile Information",
    value: "profile",
  },
  {
    label: "Order History",
    value: "orders",
  },
  {
    label: "Favorites",
    value: "favorites",
  },
];

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const supabase = useSupabase();
  const [state] = useAtom(globalStateAtom);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", state.user?.id)
        .single();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.user?.id) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [state.user?.id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!state.user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none p-0 overflow-x-auto"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-cypress-green dark:border-cypress-green shadow-none",
        }}>
        {TABS.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={`${
              activeTab === value
                ? "text-cypress-green"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            } font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 min-w-0 whitespace-nowrap`}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody className="mt-4 sm:mt-8">
        <TabPanel value="profile">
          <ProfileForm initialProfile={profile} user={state.user} />
        </TabPanel>
        <TabPanel value="orders">
          <OrderHistory />
        </TabPanel>
        <TabPanel value="favorites">
          <FavoritesList />
        </TabPanel>
      </TabsBody>
    </Tabs>
  );
}
