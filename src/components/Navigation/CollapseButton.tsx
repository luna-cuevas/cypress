"use client";

import { Collapse } from "@material-tailwind/react";
import React from "react";
import NavList from "./NavList";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {};

const CollapseButton = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  return (
    <Collapse
      open={state.showMobileMenu}
      className=" w-full  justify-end ml-auto">
      <NavList />
    </Collapse>
  );
};

export default CollapseButton;
