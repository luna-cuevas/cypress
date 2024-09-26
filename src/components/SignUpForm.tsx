"use client";
import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordShown, setPasswordShown] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setIsSignedUp(true);
        toast.success(data.message);
        // Optionally, reset the form
        setForm({
          ...form,
          firstName: "",
          lastName: "",
          password: "",
        });

        // after 5 seconds, redirect to login page
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        const errors = data.userErrors;
        errors.forEach((error: any) => {
          toast.error(error.message);
        });
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast.error(error.message || "Sign-up failed");
    }
  };

  if (isSignedUp) {
    return (
      <div className="h-screen p-4 flex items-center  rounded-md">
        <p className="max-w-2xl mx-auto text-xl text-center">
          Thank you for signing up! You will be redirected to the login page in
          a few seconds.
        </p>
      </div>
    );
  }

  return (
    <section className="grid text-center h-screen items-center p-8">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign Up
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your details to create an account
        </Typography>
        <form
          onSubmit={handleSignUp}
          className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="firstName">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900">
                First Name
              </Typography>
            </label>
            <Input
              id="firstName"
              color="gray"
              size="lg"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
              crossOrigin={undefined}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lastName">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900">
                Last Name
              </Typography>
            </label>
            <Input
              id="lastName"
              color="gray"
              size="lg"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
              crossOrigin={undefined}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900">
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
              crossOrigin={undefined}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900">
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              name="password"
              value={form.password}
              onChange={handleChange}
              labelProps={{
                className: "hidden",
              }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
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
              crossOrigin={undefined}
            />
          </div>
          <Button
            type="submit"
            color="gray"
            size="lg"
            className="mt-6"
            fullWidth>
            Sign Up
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-gray-900">
              Login
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
