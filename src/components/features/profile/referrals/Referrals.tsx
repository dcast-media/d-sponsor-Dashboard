import React, { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { ClipboardIcon } from "@heroicons/react/20/solid";
import handleCopy from "@/utils/misc/handleCopy";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import Input from "@/components/ui/Input";

const Referrals = ({ userAddr, userData }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [ranking, setRanking] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const inputRef = React.useRef<any>();

  let frontURL;
  if (typeof window !== "undefined") {
    frontURL = window.location.origin;
  }

  useEffect(() => {
    if (userData) {
      setRanking(userData?.rankings[0]);
    }
  }, [userData]);

  return (
    <div className="bg-secondaryBlack p-6 rounded-lg relative grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <div className="font-semibold text-xl md:text-2xl">
          <span className="text-primaryPurple">Share your referral link</span>
          <span className="text-white"> to boost your boxes.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `Participate in @siborgapp's "bid to earn" auction to secure ad space NFT on @siborgapp search results!\n\nEarn perks with boxes and get rewarded when outbid! 💰\n\n#Web3Monetization #DigitalRWA #SiBorgAds\n ${frontURL}/?_rid=${userAddr}`
              );
              const url = `https://twitter.com/intent/tweet?text=${text}`;
              window.open(url, "_blank");
            }}
            className={`bg-primaryPurple hover:bg-opacity-80 rounded-2lg text-white p-2 flex items-center justify-center text-center gap-2`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
              className="text-white w-5 h-5 fill-white"
            >
              <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
            </svg>
            <span className="block">Share on X</span>
          </button>

          <div className="relative w-full h-full">
            <Input
              ref={inputRef}
              disabled
              value={`${frontURL}/?_rid=${userAddr}`}
              className="pr-12 h-full w-full border border-primaryPurple rounded-2lg p-2 focus:border-primaryPurple focus:ring-transparent dark:bg-primaryBlack dark:text-white"
            />
            <Tippy content={copied ? "Copied!" : "Copy"} placement="top" trigger="click">
              <button
                onClick={() => {
                  handleCopy(`${frontURL}/?_rid=${userAddr}`, setCopied);
                }}
                className="absolute right-0 top-0 h-full px-4 text-white hover:text-jacarta-100 rounded-r-lg"
              >
                <ClipboardIcon className="h-5 w-5" />
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <div className="h-full flex items-center justify-end">
        <div className="h-full w-full md:w-1/2 border border-primaryPurple bg-primaryBlack text-white p-6 rounded-lg relative">
          <Popover isOpen={isHovered}>
            <PopoverTrigger className="focus:ring-transparent focus:border-transparent">
              <button
                className="absolute top-0 right-0 p-2 focus:ring-transparent focus:border-transparent"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <InformationCircleIcon className="h-4 w-4 text-white hover:text-jacarta-100 cursor-help" />
              </button>
            </PopoverTrigger>

            <PopoverContent>
              <div className="px-3 py-2 text-white text-xs md:text-sm">
                This is the number of referrals you have
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex items-center text-center justify-center">
            <span className="text-white text-4xl md:text-8xl font-semibold">
              {ranking?.nbProtocolFeeReferrals ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-center text-center mt-1">
            <span className="text-white text-xs md:text-sm">Number of Referrals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
