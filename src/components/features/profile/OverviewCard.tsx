import { InformationCircleIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";

const OverviewCard = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex p-[1px] bg-primaryBlack hover:-translate-y-1 duration-300 rounded-lg"
      style={{
        backgroundImage:
          "linear-gradient(176deg, #ea465c, #8a4cef 18%, #b649ac 51%, #ea465c 86%, #8a4cef)"
      }}
    >
      <div className="flex flex-col justify-between p-6 bg-primaryBlack rounded-lg relative w-full">
        <Popover isOpen={isHovered}>
          <PopoverTrigger>
            <button
              className="absolute top-0 right-0 p-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <InformationCircleIcon className="h-4 w-4 text-white hover:text-jacarta-100 cursor-help" />
            </button>
          </PopoverTrigger>

          <PopoverContent>
            <div className="px-3 py-2 text-white text-xs md:text-sm">{card.informations}</div>
          </PopoverContent>
        </Popover>
        <div className="flex items-center text-center justify-center">
          <span className="text-white text-4xl md:text-8xl font-semibold">{card.value}</span>
        </div>
        <div className="flex items-center justify-center text-center mt-1">
          <span className="text-white text-xs md:text-sm">{card.label}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
