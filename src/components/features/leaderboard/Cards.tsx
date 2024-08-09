import React, { useState } from "react";
import Link from "next/link";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";

const Cards = ({ activity }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleMouseEnter = (icon) => {
    setHoveredIcon(icon);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  return (
    <>
      <div
        className="flex p-[1px] bg-primaryBlack hover:-translate-y-1 duration-300 rounded-lg"
        style={{
          backgroundImage:
            "linear-gradient(176deg, #ea465c, #8a4cef 18%, #b649ac 51%, #ea465c 86%, #8a4cef)"
        }}
      >
        <div className="relative dark:bg-primaryBlack h-full w-full flex-grow flex-shrink flex-basis-[200px] overflow-hidden dark:border-jacarta-100 dark:border-opacity-10 border-jacarta-100 rounded-2lg border flex flex-col gap-4 bg-white p-8">
          <div className="absolute top-0 right-0 p-2">
            <Popover placement="top" isOpen={hoveredIcon === "lastBidder"}>
              <PopoverTrigger>
                <InformationCircleIcon
                  className="h-5 w-5 text-white cursor-pointer"
                  onMouseEnter={() => handleMouseEnter("lastBidder")}
                  onMouseLeave={handleMouseLeave}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-secondaryBlack shadow border border-white border-opacity-10">
                <div className="px-1 py-2">
                  <div className="text-small">
                    This is the address of the last bidder in all auctions
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center sm:flex sm:flex-wrap">
            <p className="dark:text-white font-medium">Last Bidder</p>
            <Link
              href={`/profile/${activity?.lastBid?.bidderAddr}`}
              className="text-primaryPink hover:text-white font-semibold w-[125px] text-ellipsis whitespace-nowrap overflow-hidden"
            >
              {activity?.lastBid?.bidderAddr}
            </Link>
          </div>
        </div>
      </div>
      <div
        className="flex p-[1px] bg-primaryBlack hover:-translate-y-1 duration-300 rounded-lg"
        style={{
          backgroundImage:
            "linear-gradient(176deg, #ea465c, #8a4cef 18%, #b649ac 51%, #ea465c 86%, #8a4cef)"
        }}
      >
        <div className="relative dark:bg-primaryBlack h-full w-full flex-grow flex-shrink flex-basis-[200px] overflow-hidden dark:border-jacarta-100 dark:border-opacity-10 border-jacarta-100 rounded-2lg border flex flex-col gap-4 bg-white p-8">
          <div className="absolute top-0 right-0 p-2">
            <Popover placement="top" isOpen={hoveredIcon === "totalReward"}>
              <PopoverTrigger>
                <InformationCircleIcon
                  className="h-5 w-5 text-white cursor-pointer"
                  onMouseEnter={() => handleMouseEnter("totalReward")}
                  onMouseLeave={handleMouseLeave}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-secondaryBlack shadow border border-white border-opacity-10">
                <div className="px-1 py-2">
                  <div className="text-small">
                    This is the total amount rewarded with outbid refunds
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center sm:flex sm:flex-wrap">
            <p className="dark:text-white font-medium">Total Rewards</p>
            <span className="text-jacarta-100 font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
              ${activity?.totalBidRefundUSDCAmount}
            </span>
          </div>
        </div>
      </div>
      <div
        className="flex p-[1px] bg-primaryBlack hover:-translate-y-1 duration-300 rounded-lg"
        style={{
          backgroundImage:
            "linear-gradient(176deg, #ea465c, #8a4cef 18%, #b649ac 51%, #ea465c 86%, #8a4cef)"
        }}
      >
        <div className="relative dark:bg-primaryBlack h-full w-full flex-grow flex-shrink flex-basis-[200px] overflow-hidden dark:border-jacarta-100 dark:border-opacity-10 border-jacarta-100 rounded-2lg border flex flex-col gap-4 bg-white p-8">
          <div className="absolute top-0 right-0 p-2">
            <Popover placement="top" isOpen={hoveredIcon === "totalSales"}>
              <PopoverTrigger>
                <InformationCircleIcon
                  className="h-5 w-5 text-white cursor-pointer"
                  onMouseEnter={() => handleMouseEnter("totalSales")}
                  onMouseLeave={handleMouseLeave}
                />
              </PopoverTrigger>
              <PopoverContent className="bg-secondaryBlack shadow border border-white border-opacity-10">
                <div className="px-1 py-2">
                  <div className="text-small">This is the total amount spent in all auctions</div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center sm:flex sm:flex-wrap">
            <p className="dark:text-white font-medium">Total Sales</p>
            <span className="text-jacarta-100 font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
              ${activity?.totalSpentUSDCAmount}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards;
