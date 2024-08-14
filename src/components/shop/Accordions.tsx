"use client";
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export function Accordions() {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion open={open === 1}>
        <AccordionHeader
          className="text-md border-t-2 font-normal text-gray-600 dark:text-gray-400 hover:text-cypress-green focus:text-cypress-green dark:focus:text-cypress-green-light focus:font-bold"
          onClick={() => handleOpen(1)}>
          Product Details
        </AccordionHeader>
        <AccordionBody className="dark:text-gray-200">
          We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2}>
        <AccordionHeader
          className="text-md font-normal text-gray-600 dark:text-gray-400 hover:text-cypress-green focus:text-cypress-green dark:focus:text-cypress-green-light focus:font-bold"
          onClick={() => handleOpen(2)}>
          Shipping & Returns
        </AccordionHeader>
        <AccordionBody className="dark:text-gray-200">
          We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams.
        </AccordionBody>
      </Accordion>
    </>
  );
}
