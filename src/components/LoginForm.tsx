// components/LoginForm.tsx

"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const [state, setState] = useAtom(globalStateAtom);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic client-side validation
    if (!form.email || !form.password) {
      toast.error("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Fetch customer data
        const customerResponse = await fetch("/api/getCustomer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const customerData = await customerResponse.json();

        if (customerData.customer) {
          setState({
            ...state,
            customer: customerData.customer,
            cartOpen: true, // Optionally open the cart
          });
        }

        toast.success("Successfully logged in!");
        router.push("/"); // Redirect to profile or home
      } else {
        const errors = data.userErrors;
        errors.forEach((error: any) => {
          toast.error(error.message);
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <section className="grid text-center min-h-[calc(100vh-264px)] items-center p-8">
      <div>
        <Typography variant="h3" className="mb-2 font-bold dark:text-white">
          Sign In
        </Typography>
        <Typography className="mb-16 text-black font-normal text-[18px] dark:text-white">
          Enter your email and password to sign in
        </Typography>
        <form
          onSubmit={handleLogin}
          className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900 dark:text-white">
                Your Email
              </Typography>
            </label>
            <Input
              crossOrigin={null}
              id="email"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full text-black dark:text-white placeholder:opacity-100 focus:ring-0 border-black dark:border-white focus:!border-cypress-green focus:ring-transparent border-1"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900 dark:text-white">
                Password
              </Typography>
            </label>
            <Input
              crossOrigin={null}
              size="lg"
              placeholder="********"
              name="password"
              value={form.password}
              onChange={handleChange}
              labelProps={{
                className: "hidden",
              }}
              className="w-full text-black dark:text-white placeholder:opacity-100 focus:ring-0 border-black dark:border-white focus:!border-cypress-green focus:ring-transparent border-1"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisibility}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <Button
            type="submit"
            color="gray"
            size="lg"
            className="mt-6 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            fullWidth
            disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </Button>
          <div className="!mt-4 flex justify-between">
            <Typography
              variant="small"
              color="gray"
              className="text-center font-normal dark:text-white">
              Not registered?{" "}
              <Link
                href="/signup"
                className="font-medium text-gray-900 dark:text-white">
                Create account
              </Link>
            </Typography>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium dark:text-white">
              Forgot password
            </Typography>
          </div>
          {/* <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth>
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            Sign in with Google
          </Button> */}
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
