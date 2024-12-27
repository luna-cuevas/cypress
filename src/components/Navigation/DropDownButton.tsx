"use client";

import { globalStateAtom } from "@/context/atoms";
import { Bars2Icon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const DropDownButton = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const path = usePathname();
  return (
    <IconButton
      size="sm"
      variant="text"
      onClick={() =>
        setState({ ...state, showMobileMenu: !state.showMobileMenu })
      }
      className="ml-auto mr-4 lg:hidden max-w-none">
      <Bars2Icon
        className={` h-6 w-6  dark:text-white group-hover:text-black dark:group-hover:text-white`}
      />
    </IconButton>
  );
};

export default DropDownButton;
