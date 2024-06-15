import { Sedan } from "next/font/google";
import localFont from "next/font/local";

export const sedan = Sedan({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const arpona = localFont({
  src: "../../public/fonts/arpona-thin.otf",
  display: "swap",
});

export const trajan = localFont({
  src: "../../public/fonts/trajan-extralight.ttf",
  display: "swap",
});

export const trajanRegular = localFont({
  src: "../../public/fonts/trajan-regular.otf",
  display: "swap",
});
