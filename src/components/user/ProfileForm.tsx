"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  Input,
  Typography,
  Select,
  Option,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { toast } from "react-toastify";

type Props = {
  initialProfile: any;
  user: User;
};

export default function ProfileForm({ initialProfile, user }: Props) {
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();
  const [date, setDate] = useState<Date | undefined>(
    initialProfile?.birth_date ? new Date(initialProfile.birth_date) : undefined
  );
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    gender: initialProfile?.gender || "",
    birthDate: initialProfile?.birth_date || null,
    location: initialProfile?.location || "",
    phoneNumber: initialProfile?.phone_number || "",
  });

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
        birthDate: "",
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
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

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
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      });

      if (updateError) throw updateError;

      // Update profile in profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        gender: formData.gender,
        birth_date: formData.birthDate || null,
        location: formData.location,
        phone_number: formData.phoneNumber,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

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

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Personal Information
          </h3>
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
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
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white"
                  crossOrigin={undefined}
                />
              </div>
              <div>
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
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Gender and Birth Date */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-900 dark:text-white">
                  Gender
                </Typography>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={(value) =>
                    handleChange({ target: { name: "gender", value } } as any)
                  }
                  labelProps={{ className: "hidden" }}
                  className="!border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white">
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
                  className="mb-2 font-medium text-gray-900 dark:text-white">
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
                      className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white cursor-pointer !appearance-none "
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
                      className="border-0 "
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

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
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
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white"
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-900 dark:text-white">
                  Phone Number
                </Typography>
                <Input
                  name="phoneNumber"
                  size="lg"
                  type="tel"
                  id="phoneNumber"
                  pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const phoneNumber = e.target.value;
                    const formattedPhoneNumber = phoneNumber.replace(
                      /(\d{3})(\d{3})(\d{4})/,
                      "($1) $2-$3"
                    );
                    handleChange({
                      target: {
                        name: "phoneNumber",
                        value: formattedPhoneNumber,
                      },
                    } as any);
                  }}
                  labelProps={{ className: "hidden" }}
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white"
                  crossOrigin={undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Security
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-900 dark:text-white">
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
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white"
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-2 font-medium text-gray-900 dark:text-white">
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
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white"
                  crossOrigin={undefined}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Leave password fields empty if you do not want to change it.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 w-fit mx-auto">
          <button
            type="submit"
            className="w-fit sm:w-auto px-8 py-3 bg-cypress-green hover:bg-cypress-green-dark text-white font-medium rounded transition-colors duration-200">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
