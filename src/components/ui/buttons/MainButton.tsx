import Link from "next/link";
import React from "react";

const whiteClass =
  "text-primaryPurple mb-6 flex items-center justify-center hover:bg-opacity-80 rounded-full bg-white py-3 px-8 text-center font-semibold transition-all hover:text-white";

const purpleClass =
  "bg-primaryPurple  mb-6 flex items-center justify-center hover:bg-opacity-80 rounded-full py-3 px-8 text-center font-semibold text-white transition-all";

const MainButton = ({
  link,
  isPurple,
  text,
  isFullWidth
}: {
  link?: string;
  isPurple?: boolean;
  text: string;
  isFullWidth?: boolean;
}) => {
  return (
    <>
      {link ? (
        <Link
          href={link ?? ""}
          className={`${isFullWidth && "w-full"} ${isPurple ? purpleClass : whiteClass}`}
        >
          {text}
        </Link>
      ) : (
        <button className={`${isFullWidth && "w-full"} ${isPurple ? purpleClass : whiteClass}`}>
          {text}
        </button>
      )}
    </>
  );
};

export default MainButton;
