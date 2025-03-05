"use client";

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import type { User } from "@supabase/supabase-js";
import {
  Input,
  Typography,
  Select,
  Option,
  Popover,
  PopoverHandler,
  PopoverContent,
  Spinner,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";
import { LockClosedIcon } from "@heroicons/react/24/outline";

// Define proper types for profile data
type ProfileData = {
  user: User;
  profile: {
    id: string;
    gender?: string;
    birth_date?: string | null;
    location?: {
      address1?: string;
      address2?: string;
      city?: string;
      state?: string;
      zip_code?: string;
    };
    phone_number?: string;
  };
};

type Props = {
  user: User;
};

export default function ProfileForm({ user }: Props) {
  const [state, setState] = useAtom(globalStateAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: null as string | null,
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/account/get-profile?userId=${user.id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);

        // Update form data with fetched profile
        setFormData({
          firstName: data.user.user_metadata?.first_name || "",
          lastName: data.user.user_metadata?.last_name || "",
          gender: data.profile?.gender || "",
          birthDate: data.profile?.birth_date || null,
          address1: data.profile?.location?.address1 || "",
          address2: data.profile?.location?.address2 || "",
          city: data.profile?.location?.city || "",
          state: data.profile?.location?.state || "",
          zipCode: data.profile?.location?.zip_code || "",
          phoneNumber: data.profile?.phone_number || "",
        });

        // Set date for date picker if birth_date exists
        if (data.profile?.birth_date) {
          setDate(new Date(data.profile.birth_date));
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        setError(error.message || "Failed to load profile data");
        toast.error(
          error.message ||
            "Failed to load profile data. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData({
        ...formData,
        birthDate: format(selectedDate, "yyyy-MM-dd"),
      });
    } else {
      setFormData({
        ...formData,
        birthDate: null,
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/account/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setIsUpdatingPassword(false);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/account/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          birthDate: formData.birthDate,
          location: {
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update global state
      setState((prev) => ({
        ...prev,
        user: {
          ...prev.user!,
          user_metadata: {
            ...prev.user!.user_metadata,
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
        customer: {
          ...prev.customer!,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      }));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        "An error occurred while updating your profile. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Spinner className="h-12 w-12 text-cypress-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px]">
        <p className="text-red-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-cypress-green hover:bg-cypress-green-dark text-white font-medium rounded-md transition-colors duration-200">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Personal Information Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-light tracking-wide text-gray-900 dark:text-white  mb-8 pb-2 border-b border-gray-100 dark:border-gray-800">
            Personal Information
          </h3>
          <div className="space-y-8">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </Typography>
                <Input
                  name="firstName"
                  size="lg"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </Typography>
                <Input
                  name="lastName"
                  size="lg"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Gender and Birth Date */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </Typography>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={(value) =>
                    handleChange({ target: { name: "gender", value } } as any)
                  }
                  labelProps={{ className: "hidden" }}
                  className="!border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light">
                  <Option value="">Select Gender</Option>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="non_binary">Non-binary</Option>
                  <Option value="other">Other</Option>
                  <Option value="prefer_not_to_say">Prefer not to say</Option>
                </Select>
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Birth Date
                </Typography>
                <Popover placement="bottom">
                  <PopoverHandler>
                    <Input
                      name="birthDate"
                      size="lg"
                      placeholder="Birth Date"
                      value={date ? format(date, "PP") : ""}
                      onChange={() => {}}
                      labelProps={{ className: "hidden" }}
                      className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white cursor-pointer !appearance-none font-light"
                      crossOrigin={undefined}
                    />
                  </PopoverHandler>
                  <PopoverContent className="p-0 z-50">
                    <DayPicker
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown"
                      defaultMonth={date || new Date(2000, 0)}
                      footer={false}
                      className="border-0"
                      classNames={{
                        caption:
                          "flex justify-center py-2 relative items-center",
                        caption_label: "text-sm font-medium hidden",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gray-500 dark:text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm relative p-0 rounded-md",
                        day: "h-9 w-9 p-0 font-normal",
                        day_selected:
                          "bg-cypress-green text-white hover:bg-cypress-green-dark rounded-md",
                        day_today: "text-cypress-green font-bold",
                        day_outside:
                          "text-gray-500 dark:text-gray-400 opacity-50",
                        day_disabled:
                          "text-gray-500 dark:text-gray-400 opacity-50",
                        day_hidden: "invisible",
                        dropdown:
                          "![&::-webkit-calendar-picker-indicator]:hidden ![&::-webkit-inner-spin-button]:hidden after:!content-none !appearance:none p-1 bg-gray-50 dark:bg-gray-200 mr-4 rounded-md border border-gray-200 dark:border-gray-700",
                        dropdown_month:
                          "mr-4 !appearance-none !bg-transparent pl-2 pr-6 py-1 rounded border-0 outline-none focus:ring-0",
                        dropdown_year:
                          "!appearance-none !bg-transparent pl-2 pr-6 py-1 rounded border-0 outline-none focus:ring-0",
                        dropdown_icon: "hidden",
                        vhidden: "hidden",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-light tracking-wide text-gray-900 dark:text-white  mb-8 pb-2 border-b border-gray-100 dark:border-gray-800">
            Shipping Address
          </h3>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Address Line 1
                </Typography>
                <Input
                  name="address1"
                  size="lg"
                  placeholder="Address Line 1"
                  value={formData.address1}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>

              <div className="sm:col-span-2">
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Address Line 2 (Optional)
                </Typography>
                <Input
                  name="address2"
                  size="lg"
                  placeholder="Apartment, suite, etc."
                  value={formData.address2}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  City
                </Typography>
                <Input
                  name="city"
                  size="lg"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  State
                </Typography>
                <Input
                  name="state"
                  size="lg"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  ZIP Code
                </Typography>
                <Input
                  name="zipCode"
                  size="lg"
                  placeholder="ZIP"
                  value={formData.zipCode}
                  onChange={handleChange}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  crossOrigin={undefined}
                />
              </div>

              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </Typography>
                <Input
                  name="phoneNumber"
                  type="tel"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const phoneNumber = e.target.value.replace(/\D/g, "");
                    const formattedPhoneNumber =
                      phoneNumber.length > 0
                        ? phoneNumber
                            .replace(
                              /(\d{0,3})(\d{0,3})(\d{0,4})/,
                              (_, p1, p2, p3) => {
                                let parts = [];
                                if (p1) parts.push(`(${p1}`);
                                if (p2) parts.push(`) ${p2}`);
                                if (p3) parts.push(`-${p3}`);
                                return parts.join("");
                              }
                            )
                            .trim()
                        : "";

                    handleChange({
                      target: {
                        name: "phoneNumber",
                        value: formattedPhoneNumber,
                      },
                    } as any);
                  }}
                  className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                  labelProps={{ className: "hidden" }}
                  crossOrigin={undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8">
          <h3 className="text-lg font-light tracking-wide text-gray-900 dark:text-white  flex items-center mb-8 pb-2 border-b border-gray-100 dark:border-gray-800">
            <LockClosedIcon className="w-5 h-5 mr-2 inline" />
            Account Security
          </h3>
          <div className="space-y-6">
            {!isUpdatingPassword ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Protect your account with a strong, unique password that you
                  do not use for other websites.
                </p>
                <button
                  type="button"
                  onClick={() => setIsUpdatingPassword(true)}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-800 dark:text-white font-medium transition-colors duration-200">
                  Change Password
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Typography
                      variant="small"
                      className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </Typography>
                    <Input
                      type="password"
                      name="newPassword"
                      size="lg"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      labelProps={{ className: "hidden" }}
                      className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                      crossOrigin={undefined}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Typography
                      variant="small"
                      className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </Typography>
                    <Input
                      type="password"
                      name="confirmNewPassword"
                      size="lg"
                      placeholder="Confirm new password"
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      labelProps={{ className: "hidden" }}
                      className="w-full !border-gray-200 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white font-light"
                      crossOrigin={undefined}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUpdatingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                      });
                    }}
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-md text-gray-800 dark:text-white font-medium transition-colors duration-200">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handlePasswordSubmit(e as any)}
                    className="px-6 py-2.5 bg-cypress-green hover:bg-cypress-green-light text-white font-medium rounded-md transition-colors duration-200">
                    Update Password
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Your password should be at least 8 characters and include a
                  combination of numbers, letters, and special characters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="w-fit px-10 py-3 bg-cypress-green hover:bg-cypress-green-light text-white font-medium rounded-md transition-colors duration-200">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
