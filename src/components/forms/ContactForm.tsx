"use client";
import React, { useState } from "react";
import { Button, Input, Textarea, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";

type Props = {};

const ContactForm = (props: Props) => {
  const [selectedSupport, setSelectedSupport] = useState("General Inquiry");
  const [messageSent, setMessageSent] = useState<{
    message?: string;
    loading: boolean;
  }>({
    message: "",
    loading: false,
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setMessageSent({ loading: true });
    e.preventDefault();

    const email = (e.currentTarget.email as HTMLInputElement).value;
    const name =
      (e.currentTarget.firstName as HTMLInputElement).value +
      " " +
      (e.currentTarget.lastName as HTMLInputElement).value;
    const message = (e.currentTarget.message as HTMLInputElement).value;
    const typeOfSupport =
      (e.currentTarget.typeOfSupport as HTMLInputElement).value ||
      selectedSupport;
    console.log({
      name,
      email,
      message,
      typeOfSupport,
    });

    if (!name || !email || !message || !typeOfSupport) {
      setMessageSent({
        message: "Please fill in all the fields",
        loading: false,
      });
      toast.error("Please fill in all the fields");
      return;
    }

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        typeOfSupport,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.message == "Message sent successfully") {
      setMessageSent({
        message: "Message sent successfully",
        loading: false,
      });
    } else {
      setMessageSent({
        message: "An error occurred. Please try again.",
        loading: false,
      });
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="flex flex-col min-h-max mx-auto text-center dark:text-white max-w-6xl px-6">
      <Typography
        variant="h1"
        className="mb-8 !text-4xl md:!text-6xl lg:!text-7xl !font-['arpona'] font-extralight tracking-wide">
        We&apos;re Here to Help
      </Typography>
      <Typography className="!font-['arpona'] mb-10 lg:mb-12 font-light text-base lg:text-xl mx-auto max-w-2xl tracking-wide leading-relaxed">
        Whether it&apos;s a question about our services, a request for technical
        assistance, or suggestions for improvement, our team is eager to hear
        from you.
      </Typography>
      <div className="grid grid-cols-1 gap-8 items-start justify-center">
        {messageSent.message == "Message sent successfully" ? (
          <div className="flex flex-col gap-8 max-w-xl m-auto p-16 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm rounded-none border border-white/10">
            <Typography
              variant="h4"
              className="text-white !font-['arpona'] tracking-widest font-light">
              Message Sent Successfully
            </Typography>
            <Typography className="!font-['arpona'] font-light text-lg tracking-wide leading-relaxed">
              Thank you for reaching out to us. We will get back to you as soon
              as possible.
            </Typography>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(e);
            }}
            className="flex flex-col gap-12 max-w-4xl w-full mx-auto bg-gradient-to-b dark:from-white/5 from-black/5  to-transparent backdrop-blur-sm  p-12 lg:p-16 rounded-none border border-black/10 dark:border-white/10">
            <Typography
              variant="small"
              className="text-left !font-['arpona'] text-xl tracking-widest font-light">
              Select Type of Inquiry
            </Typography>
            <div className="flex flex-wrap gap-6 relative">
              <Button
                onClick={() => setSelectedSupport("General Inquiry")}
                variant="outlined"
                className={`!font-['arpona'] text-base tracking-wider  py-4 px-8 max-w-fit bg-transparent transition-all duration-500 rounded-none ${
                  selectedSupport !== "General Inquiry"
                    ? "dark:text-white border border-black/20 dark:border-white/20 hover:border-white"
                    : "bg-white text-black border-2 dark:border-white border-black/20  hover:bg-white/90"
                }`}>
                <input
                  type="radio"
                  id="generalInquiry"
                  name="typeOfSupport"
                  value="General Inquiry"
                  className="w-full cursor-pointer absolute h-full top-0 left-0 bottom-0 right-0 opacity-0"
                />
                General Inquiry
              </Button>
              <Button
                onClick={() => setSelectedSupport("Product Support")}
                variant="outlined"
                className={`!font-['arpona']  text-base tracking-wider py-4 px-8 max-w-fit bg-transparent transition-all duration-500 rounded-none ${
                  selectedSupport !== "Product Support"
                    ? "dark:text-white border dark:border-white/20 border-black/20 hover:border-white"
                    : "bg-white text-black border-2 dark:border-white border-black/20 hover:bg-white/90"
                }`}>
                <input
                  type="radio"
                  id="productSupport"
                  name="typeOfSupport"
                  value="Product Support"
                  className="w-full cursor-pointer absolute h-full top-0 left-0 bottom-0 right-0 opacity-0"
                />
                Product Support
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <Typography
                  variant="small"
                  className="mb-3 text-left !font-['arpona'] text-sm tracking-widest uppercase">
                  First Name
                </Typography>
                <Input
                  size="lg"
                  placeholder="First Name"
                  name="firstName"
                  className="!font-['arpona'] bg-transparent border-white/20 text-white focus:border-white transition-all duration-500 rounded-none tracking-wider"
                  containerProps={{
                    className: "min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <Typography
                  variant="small"
                  className="mb-3 text-left !font-['arpona'] text-sm tracking-widest uppercase">
                  Last Name
                </Typography>
                <Input
                  size="lg"
                  placeholder="Last Name"
                  name="lastName"
                  className="!font-['arpona'] bg-transparent border-white/20 text-white focus:border-white transition-all duration-500 rounded-none tracking-wider"
                  containerProps={{
                    className: "!min-w-full",
                  }}
                  labelProps={{
                    className: "hidden",
                  }}
                  crossOrigin={undefined}
                />
              </div>
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-3 text-left !font-['arpona'] text-sm tracking-widest uppercase">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@email.com"
                name="email"
                className="!font-['arpona'] bg-transparent border-white/20 text-white focus:border-white transition-all duration-500 rounded-none tracking-wider"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
                crossOrigin={undefined}
              />
            </div>
            <div>
              <Typography
                variant="small"
                className="mb-3 text-left !font-['arpona'] text-sm tracking-widest uppercase">
                Your Message
              </Typography>
              <Textarea
                rows={6}
                placeholder="Message"
                name="message"
                className="!font-['arpona'] bg-transparent border-white/20 text-white focus:border-white transition-all duration-500 rounded-none tracking-wider resize-none"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={messageSent.loading}
              className="!font-['arpona'] text-base tracking-widest uppercase w-full md:w-1/3 m-auto bg-white text-black hover:bg-white/90 transition-all duration-500 rounded-none py-4">
              {messageSent.loading ? (
                <div
                  role="status"
                  className="flex m-auto align-middle w-fit my-auto mx-auto text-black rounded-xl">
                  <svg
                    aria-hidden="true"
                    className="m-auto w-6 h-6 animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
