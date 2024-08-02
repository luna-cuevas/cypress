"use client";
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import NextJsImage from "./NextJsImage";
import "yet-another-react-lightbox/styles.css";

type Images = {
  src: string;
  alt: string;
}[];

export default function Carousel({ slides }: { slides: Images }) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const toggleOpen = (state: boolean) => () => setOpen(state);

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  return (
    <>
      <Lightbox
        index={index}
        slides={slides}
        plugins={[Inline]}
        on={{
          view: updateIndex,
          click: toggleOpen(true),
        }}
        carousel={{
          padding: 0,
          spacing: 0,
          imageProps: {
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          },
          imageFit: "cover",
        }}
        render={{ slide: NextJsImage }}
        inline={{
          style: {
            width: "100%",
            height: "100%",
            maxWidth: "900px",
            aspectRatio: "3 / 2",
            margin: "0 auto",
          },
        }}
      />

      <Lightbox
        open={open}
        close={toggleOpen(false)}
        index={index}
        slides={slides}
        on={{ view: updateIndex }}
        animation={{ fade: 0 }}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      />
    </>
  );
}
