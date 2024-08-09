import React, { useMemo, useState } from "react";
import TokenCardSkeleton from "@/components/ui/skeletons/TokenCardSkeleton";
import TokenCard from "@/components/ui/cards/TokenCard";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Auction } from "@/types/auctions";

const MainAuctions = ({ auctions, isAuctionsLoading }) => {
  const [mount, setMount] = useState(false);
  const [hotAuctions, setHotAuctions] = useState([]);
  const [isInformationHovered, setIsInformationHovered] = useState(false);

  useMemo(() => {
    if (!mount && auctions && auctions.length > 0) {
      const tempHotAuctions = auctions
        ?.filter(
          (auction) =>
            auction?.status === "CREATED" &&
            auction?.listingType === "Auction" &&
            Number(auction?.quantity) > 0 &&
            new Date(Number(auction?.startTime) * 1000).getTime() < Date.now() &&
            new Date(Number(auction?.endTime) * 1000).getTime() > Date.now()
        )
        .sort((a, b) => b.numberOfBids - a.numberOfBids);

      const slicedHotAuctions = tempHotAuctions.slice(0, 4);

      setHotAuctions(slicedHotAuctions);
      setMount(true);
    }
  }, [auctions, mount]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-semibold text-white flex items-center gap-2">
        <Popover placement="top-start" isOpen={isInformationHovered}>
          <PopoverTrigger>
            <InformationCircleIcon
              className="h-6 w-6 text-white cursor-pointer"
              onMouseEnter={() => setIsInformationHovered(true)}
              onMouseLeave={() => setIsInformationHovered(false)}
            />
          </PopoverTrigger>
          <PopoverContent className="bg-secondaryBlack shadow border border-white border-opacity-10">
            <div className="px-1 py-2">
              <div className="text-small">
                Hot auctions are live auctions with the most bids, they are the most popular
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <span>Hot Auctions 🔥 </span>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!isAuctionsLoading ? (
          <>
            {hotAuctions?.map((auction: Auction, index) => (
              <TokenCard
                key={index}
                item={auction.item}
                isToken={true}
                listingType={auction?.listingType}
                isListing={auction?.listingType === "Direct"}
                isAuction={auction?.listingType === "Auction"}
                url={
                  !auction?.tokenData
                    ? `/${auction?.chainId}/offer/${auction?.offerId}/${auction?.tokenId}`
                    : `/${auction?.chainId}/offer/${auction.item.nftContract?.adOffers[0]?.id}/${auction.tokenId}?tokenData=${auction.item.mint?.tokenData}`
                }
                currencyDecimals={auction?.currencyDecimals}
              />
            ))}
          </>
        ) : (
          <>
            <TokenCardSkeleton />
            <TokenCardSkeleton />
            <TokenCardSkeleton />
            <TokenCardSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default MainAuctions;
