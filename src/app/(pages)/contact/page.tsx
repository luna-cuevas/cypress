import ContactForm from "@/components/forms/ContactForm";
import React from "react";

function page() {
  return (
    <section className="min-h-[calc(100vh-90px)] -z-10 py-20 px-4 sm:px-8">
      <ContactForm />
    </section>
  );
}

export default page;
