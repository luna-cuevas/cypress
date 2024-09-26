// components/ProfilePage.tsx

"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/utils/protectedRoute";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

import {
  Input,
  Typography,
  Select,
  Option,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";

// day picker
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";

// @heroicons/react
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ProfilePage = () => {
  const [state, setState] = useAtom(globalStateAtom);
  const [isLoaded, setIsLoaded] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "", // Initialize as needed
    birthDate: "", // Initialize as needed
    email: "", // Initialize based on customer
    confirmEmail: "", // Initialize based on customer
    location: "", // Initialize based on addresses
    phoneNumber: "", // Initialize based on customer
    language: "",
    skills: "",
  });

  useEffect(() => {
    if (!state.customer) return;
    setFormData({
      ...formData,
      firstName: state.customer.firstName || "",
      lastName: state.customer.lastName,
      email: state.customer.email,
      confirmEmail: state.customer.email,
      phoneNumber: state.customer.phone,
    });
  }, [state.customer]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

    // Client-side validation
    if (formData.email !== formData.confirmEmail) {
      alert("Emails do not match.");
      return;
    }

    try {
      // Update standard customer fields
      const updateCustomerMutation = `
        mutation customerUpdate($input: CustomerUpdateInput!) {
          customerUpdate(input: $input) {
            customer {
              id
              firstName
              lastName
              email
              phone
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const updateCustomerVariables = {
        input: {
          id: state.customer.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
        },
      };

      const customerResponse = await fetch("/api/updateCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: updateCustomerMutation,
          variables: updateCustomerVariables,
        }),
      });

      const customerData = await customerResponse.json();

      if (customerData.data.customerUpdate.userErrors.length > 0) {
        // Handle user errors
        customerData.data.customerUpdate.userErrors.forEach((error: any) => {
          alert(error.message);
        });
        return;
      }

      // Update metafields
      const updateMetafieldsMutation = `
        mutation customerUpdate($input: CustomerUpdateInput!) {
          customerUpdate(input: $input) {
            customer {
              id
              metafields(namespace: "custom") {
                key
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const updateMetafieldsVariables = {
        input: {
          id: state.customer.id,
          metafields: [
            {
              namespace: "custom",
              key: "gender",
              value: formData.gender,
              type: "single_line_text_field",
            },
            {
              namespace: "custom",
              key: "birth_date",
              value: formData.birthDate,
              type: "date",
            },
            {
              namespace: "custom",
              key: "language_preference",
              value: formData.language,
              type: "single_line_text_field",
            },
            {
              namespace: "custom",
              key: "skills",
              value: formData.skills,
              type: "multi_line_text_field",
            },
          ],
        },
      };

      const metafieldsResponse = await fetch("/api/updateCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: updateMetafieldsMutation,
          variables: updateMetafieldsVariables,
        }),
      });

      const metafieldsData = await metafieldsResponse.json();

      if (metafieldsData.data.customerUpdate.userErrors.length > 0) {
        // Handle user errors
        metafieldsData.data.customerUpdate.userErrors.forEach((error: any) => {
          alert(error.message);
        });
        return;
      }

      alert("Profile updated successfully!");

      // Optionally, refetch customer data to update global state
      // ...
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile. Please try again.");
    }
  };

  return (
    state.customer &&
    isLoaded && (
      <form onSubmit={handleSubmit}>
        <section className="px-8 py-20 container mx-auto">
          <Typography variant="h5" color="blue-gray">
            Basic Information
          </Typography>
          <Typography
            variant="small"
            className="text-gray-600 font-normal mt-1">
            Update your profile information below.
          </Typography>
          <div className="flex flex-col mt-8">
            {/* First and Last Name */}
            <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  First Name
                </Typography>
                <Input
                  name="firstName"
                  size="lg"
                  placeholder="Emma"
                  value={formData.firstName}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Last Name
                </Typography>
                <Input
                  name="lastName"
                  size="lg"
                  placeholder="Roberts"
                  value={formData.lastName}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Gender and Birth Date */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
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
                  className="border-t-blue-gray-200 aria-[expanded=true]:border-t-primary">
                  <Option value="">Select Gender</Option>
                  <Option>Male</Option>
                  <Option>Female</Option>
                  <Option>Non-binary</Option>
                  <Option>Prefer not to say</Option>
                </Select>
              </div>
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
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
                      className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
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
                      captionLayout="dropdown"
                      className="border-0"
                      classNames={{
                        caption:
                          "flex justify-center py-2 mb-4 relative items-center",
                        caption_label: "hidden",
                        nav: "flex items-center",
                        nav_button:
                          "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                        nav_button_previous: "absolute left-1.5",
                        nav_button_next: "absolute right-1.5",
                        table: "w-full border-collapse",
                        head_row: "flex !font-medium text-gray-900",
                        head_cell: "m-0.5 w-9 !font-normal text-sm",
                        row: "flex w-full mt-2",
                        cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 !font-normal",
                        day_range_end: "day-range-end",
                        day_selected:
                          "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                        day_today: "rounded-md bg-gray-200 text-gray-900",
                        day_outside:
                          "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                        day_disabled: "text-gray-500 opacity-50",
                        day_hidden: "invisible",
                      }}
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
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Email
                </Typography>
                <Input
                  name="email"
                  size="lg"
                  type="email"
                  placeholder="emma@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Confirm Email
                </Typography>
                <Input
                  name="confirmEmail"
                  size="lg"
                  type="email"
                  placeholder="emma@mail.com"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Location and Phone Number */}
            <div className="mb-6 flex flex-col items-end gap-4 md:flex-row">
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Location
                </Typography>
                <Input
                  name="location"
                  size="lg"
                  placeholder="Florida, USA"
                  value={formData.location}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Phone Number
                </Typography>
                <Input
                  name="phoneNumber"
                  size="lg"
                  type="tel"
                  placeholder="+123 0123 456 789"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Language and Skills */}
            <div className="flex flex-col items-end gap-4 md:flex-row">
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Language
                </Typography>
                <Input
                  name="language"
                  size="lg"
                  placeholder="English"
                  value={formData.language}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
              <div className="w-full">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium">
                  Skills
                </Typography>
                <Input
                  name="skills"
                  size="lg"
                  placeholder="Web Development, Design"
                  value={formData.skills}
                  onChange={handleChange}
                  labelProps={{
                    className: "hidden",
                  }}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  crossOrigin={undefined}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                Update Profile
              </button>
            </div>
          </div>
        </section>
      </form>
    )
  );
};

export default ProfilePage;
