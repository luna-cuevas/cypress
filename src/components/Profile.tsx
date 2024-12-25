// components/ProfilePage.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useAuth } from "@/context/AuthContext";
import { useSupabase } from "@/lib/supabase";

import {
  Input,
  Typography,
  Select,
  Option,
  Popover,
  PopoverHandler,
  PopoverContent,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

// day picker
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import OrderHistory from "./OrderHistory";
import FavoritesList from "./FavoritesList";

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

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [state, setState] = useAtom(globalStateAtom);
  const { user } = useAuth();
  const supabase = useSupabase();
  const [isLoaded, setIsLoaded] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    email: "",
    confirmEmail: "",
    location: "",
    phoneNumber: "",
    language: "",
    skills: "",
  });

  useEffect(() => {
    if (!user) return;

    const loadUserProfile = async () => {
      try {
        // Get user profile data from Supabase
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setFormData({
          firstName: user.user_metadata.first_name || "",
          lastName: user.user_metadata.last_name || "",
          email: user.email || "",
          confirmEmail: user.email || "",
          gender: profile?.gender || "",
          birthDate: profile?.birth_date || "",
          location: profile?.location || "",
          phoneNumber: profile?.phone_number || "",
          language: profile?.language || "",
          skills: profile?.skills || "",
        });

        if (profile?.birth_date) {
          setDate(new Date(profile.birth_date));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserProfile();
  }, [user, supabase]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData({
        ...formData,
        birthDate: format(selectedDate, "yyyy-MM-dd"),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.email !== formData.confirmEmail) {
      alert("Emails do not match.");
      return;
    }

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      });

      if (updateError) throw updateError;

      // Update profile in profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user?.id,
        gender: formData.gender,
        birth_date: formData.birthDate,
        location: formData.location,
        phone_number: formData.phoneNumber,
        language: formData.language,
        skills: formData.skills,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // Update global state
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          email: formData.email,
          user_metadata: {
            ...prev.user!.user_metadata,
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
        customer: {
          ...prev.customer!,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      }));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile. Please try again.");
    }
  };

  if (!user || !isLoaded) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-8 py-12">
        <Tabs value={activeTab} className="mb-8">
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
              {/* Profile Form */}
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  {/* First and Last Name */}
                  <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        First Name
                      </Typography>
                      <Input
                        name="firstName"
                        size="lg"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Last Name
                      </Typography>
                      <Input
                        name="lastName"
                        size="lg"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                  </div>

                  {/* Gender and Birth Date */}
                  <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        I&apos;m
                      </Typography>
                      <Select
                        name="gender"
                        size="lg"
                        labelProps={{
                          className: "hidden",
                        }}
                        value={formData.gender}
                        onChange={(value) =>
                          setFormData({ ...formData, gender: value as string })
                        }
                        className="!border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white">
                        <Option value="">Select Gender</Option>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="non-binary">Non-binary</Option>
                        <Option value="prefer-not-to-say">
                          Prefer not to say
                        </Option>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Birth Date
                      </Typography>
                      <Popover placement="bottom">
                        <PopoverHandler>
                          <Input
                            name="birthDate"
                            size="lg"
                            onChange={() => null}
                            placeholder="Select a Date"
                            value={
                              formData.birthDate
                                ? format(new Date(formData.birthDate), "PPP")
                                : ""
                            }
                            labelProps={{
                              className: "hidden",
                            }}
                            className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            readOnly
                            crossOrigin={undefined}
                          />
                        </PopoverHandler>
                        <PopoverContent>
                          <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            showOutsideDays
                            className="border-0 dark:bg-black dark:text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Email and Confirm Email */}
                  <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Email
                      </Typography>
                      <Input
                        name="email"
                        size="lg"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Confirm Email
                      </Typography>
                      <Input
                        name="confirmEmail"
                        size="lg"
                        type="email"
                        placeholder="Confirm Email"
                        value={formData.confirmEmail}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                  </div>

                  {/* Location and Phone Number */}
                  <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Location
                      </Typography>
                      <Input
                        name="location"
                        size="lg"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Phone Number
                      </Typography>
                      <Input
                        name="phoneNumber"
                        size="lg"
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                  </div>

                  {/* Language and Skills */}
                  <div className="flex flex-col items-end gap-4 md:flex-row">
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Language
                      </Typography>
                      <Input
                        name="language"
                        size="lg"
                        placeholder="Language"
                        value={formData.language}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                    <div className="w-full">
                      <Typography
                        variant="small"
                        className="mb-2 font-medium text-gray-900 dark:text-white">
                        Skills
                      </Typography>
                      <Input
                        name="skills"
                        size="lg"
                        placeholder="Skills"
                        value={formData.skills}
                        onChange={handleChange}
                        labelProps={{
                          className: "hidden",
                        }}
                        className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        crossOrigin={undefined}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      className="bg-cypress-green text-white px-6 py-2 rounded-md hover:bg-cypress-green-light transition-colors duration-200">
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </TabPanel>
            <TabPanel value="orders">
              <OrderHistory />
            </TabPanel>
            <TabPanel value="favorites">
              <FavoritesList />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
