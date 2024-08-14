"use client";
import { globalStateAtom } from "@/context/atoms";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import { useAtom } from "jotai";
import NavList from "./NavList";

export function NavDrawer() {
  const [state, setState] = useAtom(globalStateAtom);

  return (
    <Drawer
      className={`${state.darkMode ? "bg-cypress-green" : "bg-white"}`}
      placement="right"
      open={state.showMobileMenu}>
      <div className="mb-2 flex items-center justify-between p-4">
        <Typography
          variant="h5"
          className={`${state.darkMode ? "text-white" : "text-black"}`}>
          Cypress
        </Typography>
        <IconButton
          variant="text"
          className={`${state.darkMode ? "text-white" : "text-black"}`}
          onClick={() => {
            setState({ ...state, showMobileMenu: !state.showMobileMenu });
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>
      <List>
        <NavList />
      </List>
    </Drawer>
  );
}
