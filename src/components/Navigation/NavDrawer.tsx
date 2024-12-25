"use client";
import { globalStateAtom } from "@/context/atoms";
import { Drawer, IconButton, Typography, List } from "@material-tailwind/react";
import { useAtom } from "jotai";
import NavList from "./NavList";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@material-tailwind/react";

export function NavDrawer() {
  const [state, setState] = useAtom(globalStateAtom);
  const path = usePathname();

  const closeDrawer = () => setState({ ...state, showMobileMenu: false });

  const theme = {
    drawer: {
      defaultProps: {
        size: 300,
        overlay: true,
        placement: "right",
        overlayProps: undefined,
        className: "",
        dismiss: undefined,
        onClose: undefined,
        transition: {
          type: "tween",
          duration: 0.3,
        },
      },
      styles: {
        base: {
          drawer: {
            position: "fixed",
            zIndex: "z-[9999]",
            pointerEvents: "pointer-events-auto",
            backgroundColor: "bg-white dark:bg-gray-900",
            boxSizing: "box-border",
            width: "w-full",
            boxShadow: "shadow-2xl shadow-blue-gray-900/10",
          },
          overlay: {
            position: "fixed",
            inset: "inset-0",
            width: "w-full",
            height: "h-full",
            pointerEvents: "pointer-events-auto",
            zIndex: "z-[9995]",
            backgroundColor: "bg-black",
            backgroundOpacity: "bg-opacity-60",
            backdropBlur: "backdrop-blur-sm",
          },
        },
      },
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Drawer
        placement="right"
        open={state.showMobileMenu}
        onClose={closeDrawer}
        className="p-0 bg-white !max-h-none dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Typography
            variant="h6"
            className="font-medium text-gray-900 dark:text-white">
            Menu
          </Typography>
          <IconButton
            variant="text"
            size="sm"
            onClick={closeDrawer}
            className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <List className="p-0 h-screen bg-white dark:bg-gray-900">
          <NavList />
        </List>
      </Drawer>
    </ThemeProvider>
  );
}
