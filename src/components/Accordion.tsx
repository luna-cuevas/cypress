import React, { useEffect, useState } from "react";
import {
  Accordion as MTAccordion,
  AccordionHeader,
  AccordionBody,
  Slider,
} from "@material-tailwind/react";
import { MinusIcon, PlusIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  title: string;
  buttonStyles: string;
  bodyStyles: string;
  view?: boolean;
  body?: {
    name?: string;
    value?: string | number;
    href?: string;
    label?: string;
    checked?: boolean;
  }[];
  checked?: { [key: string]: boolean };
  setChecked?: (value: any) => void;
  handleSizeClick?: (e: any) => void;
};

function Icon({ id, open }: { id: number; open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        open ? "transform rotate-180" : ""
      } h-5 w-5 transition-transform
         dark:text-white text-black
       `}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function Accordion({
  title,
  body,
  buttonStyles,
  handleSizeClick,
  checked,
  view,
  setChecked,
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useAtom(globalStateAtom);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    let viewValue = "";
    if (sliderValue <= 32) {
      viewValue = "small";
    } else if (sliderValue <= 65) {
      viewValue = "medium";
    } else if (sliderValue <= 100) {
      viewValue = "large";
    }

    // Update the 'view' parameter
    params.set("view", viewValue);

    // Navigate to the updated URL without removing other parameters
    router.push(`?${params.toString()}`);
  }, [sliderValue]);

  return (
    <MTAccordion
      className=" h-fit my-auto border-b relative w-full lg:w-fit lg:border-0 overflow-visible"
      open={open}
      icon={<Icon id={1} open={open} />}>
      <AccordionHeader
        className="w-full border-0  lg:border lg:border-gray-300 rounded-full py-0 lg:px-2 px-4 "
        onClick={() => setOpen((prev) => !prev)}>
        <div className={`${buttonStyles}   w-full`}>
          <h2 className="text-sm  text-black dark:text-white font-medium">
            {view ? (
              <Squares2X2Icon className="h-3 w-3" aria-hidden="true" />
            ) : (
              title
            )}
          </h2>
        </div>
      </AccordionHeader>
      <AccordionBody
        className={`
      ${
        open
          ? "lg:max-h-screen h-auto py-2 lg:border border-gray-200  dark:border-white"
          : "lg:max-h-0 py-0 overflow-hidden"
      }
          ${view && "right-0"}
        flex flex-col w-auto  rounded-lg drop-shadow-sm  transition-all  z-50 duration-300 lg:absolute top-full  bg-white dark:bg-transparent lg:dark:bg-cypress-green  `}>
        {body ? (
          body.map((option, optionIdx) => {
            return checked ? (
              <div
                key={optionIdx}
                className="flex lg:px-4 px-8  border-b last:border-b-0 last:pb-0  gap-0 py-2 ">
                <input
                  id={`filter-${option.value}-${optionIdx}`}
                  name={`${option.value}[]`}
                  type="checkbox"
                  checked={checked[option.value as string]}
                  defaultValue={option.value}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSizeClick && handleSizeClick(e);
                    setChecked &&
                      setChecked((prev: any) => ({
                        ...prev,
                        [option.value as string]: !prev[option.value as string],
                      }));
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`filter-${option.value}-${optionIdx}`}
                  className="ml-3 text-sm lg:text-base text-black dark:text-white w-full cursor-pointer">
                  {option.label}
                </label>
              </div>
            ) : (
              <div
                key={optionIdx}
                className="flex lg:px-4 px-8 border-b last:border-b-0 last:pb-0  gap-0 py-2 ">
                <Link
                  href={option.href || "#"}
                  className=" text-sm  text-black dark:text-white w-full cursor-pointer">
                  {option.name}
                </Link>
              </div>
            );
          })
        ) : (
          <div
            key={title}
            className="flex lg:px-4 px-8 w-full bg-white gap-0 py-0 ">
            <Slider
              onChange={(e) => {
                setSliderValue(Number(e.target.value));
              }}
              defaultValue={sliderValue}
              value={sliderValue}
              step={33}
              max={99}
              className="text-cypress-green-light my-2 min-w-[80px] max-w-[100px] w-full"
              barClassName="rounded-none bg-cypress-green"
              thumbClassName="[&::-moz-range-thumb]:rounded-none [&::-webkit-slider-thumb]:rounded-none [&::-moz-range-thumb]:-mt-[4px] [&::-webkit-slider-thumb]:-mt-[4px]"
              trackClassName="[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent rounded-none !bg-cypress-green/10 border border-cypress-green/20"
            />{" "}
          </div>
        )}
      </AccordionBody>
    </MTAccordion>
  );
}
