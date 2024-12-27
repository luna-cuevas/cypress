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

type Props = {
  initialProfile: any; // We'll type this properly later
  user: User;
};

export default function ProfileForm({ initialProfile, user }: Props) {
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();
  const [date, setDate] = useState<Date | undefined>(
    initialProfile?.birth_date ? new Date(initialProfile.birth_date) : undefined
  );

  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    email: user?.email || "",
    confirmEmail: user?.email || "",
    gender: initialProfile?.gender || "",
    birthDate: initialProfile?.birth_date || "",
    location: initialProfile?.location || "",
    phoneNumber: initialProfile?.phone_number || "",
    language: initialProfile?.language || "",
    skills: initialProfile?.skills || "",
  });

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
        id: user.id,
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

  return (
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

        {/* Email Fields */}
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              className="mb-2 font-medium text-gray-900 dark:text-white">
              Email
            </Typography>
            <Input
              name="email"
              type="email"
              size="lg"
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
              type="email"
              size="lg"
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

        {/* Gender and Birth Date */}
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full">
            <Typography
              variant="small"
              className="mb-2 font-medium text-gray-900 dark:text-white">
              Gender
            </Typography>
            <Select
              name="gender"
              value={formData.gender}
              onChange={(value) =>
                handleChange({
                  target: { name: "gender", value },
                } as any)
              }
              labelProps={{
                className: "hidden",
              }}
              className="!border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white">
              <Option value="">Select Gender</Option>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
              <Option value="prefer_not_to_say">Prefer not to say</Option>
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
                  placeholder="Birth Date"
                  value={date ? format(date, "PP") : ""}
                  onChange={() => {}}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full !border-gray-300 dark:!border-gray-700 focus:!border-cypress-green dark:focus:!border-cypress-green bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  crossOrigin={undefined}
                />
              </PopoverHandler>
              <PopoverContent>
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  footer={false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Location and Phone */}
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
        <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
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
        <button
          type="submit"
          className="mt-6 w-1/3 mx-auto bg-cypress-green hover:bg-cypress-green-dark text-white font-medium py-2 px-4 rounded transition-colors duration-200">
          Save Changes
        </button>
      </div>
    </form>
  );
}
