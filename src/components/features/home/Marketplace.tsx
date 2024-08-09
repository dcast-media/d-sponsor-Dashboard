import React, { useState, useMemo } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import TokenCardSkeleton from "@/components/ui/skeletons/TokenCardSkeleton";
import TokenCard from "@/components/ui/cards/TokenCard";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import Input from "@/components/ui/Input";

const onAuctionCondition = (auction, mint, direct) => {
  return (
    (auction?.status === "CREATED" &&
      (auction?.listingType === "Auction" || (auction?.listingType === "Direct" && direct)) &&
      Number(auction?.quantity) > 0 &&
      new Date(Number(auction?.startTime) * 1000) < new Date() &&
      new Date(Number(auction?.endTime) * 1000) > new Date()) ||
    (mint && auction?.item?.mint === null)
  );
};

const MarketplaceHome = ({ auctions, setAllTokens, allTokens, isAuctionsLoading }) => {
  const [filterName, setFilterName] = useState("");
  const [sortOption, setSortOption] = useState("Ending soon");
  const [filterOption, setFilterOption] = useState("All tokens");
  const [isInformationHovered, setIsInformationHovered] = useState(false);

  const filteredAuctions = useMemo(() => {
    let tempAuctions = [...auctions];

    // keep enabled minted tokens and tokens already minted (updated)
    tempAuctions = [...tempAuctions].filter(
      (auction) =>
        (auction?.item?.nftContract?.prices[0]?.enabled === true || auction?.item?.mint !== null) &&
        new Date(auction?.item?.metadata?.valid_to).getTime() >= Date.now() &&
        auction?.item?.disable === false
    );

    if (!allTokens) {
      tempAuctions = [...tempAuctions].filter(
        (auction) =>
          auction?.status === "CREATED" &&
          new Date(auction?.startTime * 1000).getTime() < Date.now() &&
          new Date(auction?.endTime * 1000).getTime() > Date.now()
      );
    }

    if (filterName && filterName.length > 0 && filterName !== "") {
      tempAuctions = [...tempAuctions].filter((auction) =>
        auction.name?.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterOption === "Listed tokens") {
      tempAuctions = tempAuctions.filter(
        (auction) => auction?.listingType === "Auction" || auction?.listingType === "Direct"
      );
    } else if (filterOption === "On auction") {
      tempAuctions = [...tempAuctions].filter((auction) =>
        onAuctionCondition(auction, false, false)
      );
    } else if (filterOption === "Sold") {
      tempAuctions = [...tempAuctions].filter((auction) => auction?.sold);
    }

    if (sortOption && sortOption.length > 0 && sortOption !== "") {
      tempAuctions = [...tempAuctions];

      switch (sortOption) {
        case "Price: low to high": {
          let liveAuctions = [...tempAuctions].filter((auction) =>
            onAuctionCondition(auction, true, true)
          );
          liveAuctions = [...liveAuctions].sort(
            (a, b) =>
              (a.listingType === "Auction"
                ? a.auctionPrice
                : a.listingType === "Direct"
                  ? a.directPrice
                  : a.mintPrice) -
              (b.listingType === "Auction"
                ? b.auctionPrice
                : b.listingType === "Direct"
                  ? b.directPrice
                  : b.mintPrice)
          );

          const otherAuctions = tempAuctions.filter(
            (auction) => !onAuctionCondition(auction, true, true)
          );

          tempAuctions = [...liveAuctions, ...otherAuctions];

          break;
        }
        case "Price: high to low": {
          let liveAuctions = [...tempAuctions].filter((auction) =>
            onAuctionCondition(auction, true, true)
          );
          liveAuctions = [...liveAuctions]
            .sort(
              (a, b) =>
                (a.listingType === "Auction"
                  ? a.auctionPrice
                  : a.listingType === "Direct"
                    ? a.directPrice
                    : a.mintPrice) -
                (b.listingType === "Auction"
                  ? b.auctionPrice
                  : b.listingType === "Direct"
                    ? b.directPrice
                    : b.mintPrice)
            )
            .reverse();

          let otherAuctions = [...tempAuctions].filter(
            (auction) => !onAuctionCondition(auction, true, true)
          );

          tempAuctions = [...liveAuctions, ...otherAuctions];
          break;
        }
        case "Ending soon": {
          let liveAuctions = [...tempAuctions]?.filter(
            (auction) => onAuctionCondition(auction, true, true) && auction?.endTime
          );
          liveAuctions = [...liveAuctions]?.sort((a, b) => a.endTime - b.endTime);

          const otherAuctions = [...tempAuctions]?.filter(
            (auction) => !onAuctionCondition(auction, true, true) || !auction?.endTime
          );

          tempAuctions = [...liveAuctions, ...otherAuctions];
          break;
        }
        case "Newest":
          tempAuctions = [...tempAuctions].sort((a, b) => b.startTime - a.startTime);
          break;
        case "Sort by name":
          tempAuctions = [...tempAuctions].sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }

      if (sortOption !== "Sort by name") {
        tempAuctions = [...tempAuctions];
      }
    } else {
      tempAuctions = [...tempAuctions].sort((a, b) => a.name.localeCompare(b.name)); // default sort
    }

    return tempAuctions;
  }, [filterName, filterOption, sortOption, auctions, allTokens]);

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xl text-white font-semibold flex items-center gap-2">
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
                The marketplace lists all available ad spaces for sale, you can filter and sort them
                as you wish
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <span>Marketplace</span>
      </span>
      <div className="flex flex-col gap-20 md:gap-8">
        <div className="flex flex-col md:flex-row items-center gap-2 h-10">
          <Input
            type="text"
            placeholder="Filter by category"
            name="search"
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
            }}
          />
          <div className="grid grid-cols-2 md:flex h-full gap-2 w-full md:w-8/12">
            {}

            <Menu as="div" className="py-4 md:py-0 h-full w-full">
              <MenuButton className="bg-secondaryBlack rounded-xl w-full h-full flex items-center justify-center hover:bg-opacity-80 border border-jacarta-100 border-opacity-10">
                <div className="flex items-center gap-1">
                  {filterOption} <ChevronDownIcon className="w-5 h-5" />
                </div>
              </MenuButton>

              <MenuItems
                anchor="bottom start"
                className={`rounded-xl flex flex-col gap-2 [--anchor-gap:1rem] bg-secondaryBlack p-2 border border-jacarta-100 border-opacity-10`}
              >
                <MenuItem>
                  <button
                    onClick={() => {
                      setFilterOption("All tokens");
                      setAllTokens(true);
                    }}
                    className="hover:bg-primaryBlack p-2 rounded-lg w-full pr-12 md:pr-24"
                  >
                    <span>All tokens</span>
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={() => {
                      setFilterOption("On auction");
                      setAllTokens(false);
                    }}
                    className="hover:bg-primaryBlack p-2 rounded-lg w-full pr-12 md:pr-24"
                  >
                    <span>On auction</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>

            <Menu as="div" className="py-4 md:py-0 h-full w-full">
              <MenuButton className="bg-secondaryBlack rounded-xl w-full h-full flex items-center justify-center hover:bg-opacity-80 border border-jacarta-100 border-opacity-10">
                <div className="flex items-center gap-1">
                  {sortOption ?? "Sort by"} <ChevronDownIcon className="w-5 h-5" />
                </div>
              </MenuButton>

              <MenuItems
                anchor="bottom start"
                className={`rounded-xl flex flex-col gap-2 [--anchor-gap:1rem] bg-secondaryBlack p-2 border border-jacarta-100 border-opacity-10`}
              >
                <MenuItem>
                  <button
                    onClick={() => {
                      setSortOption("Sort by name");
                    }}
                    className="hover:bg-primaryBlack p-2 rounded-lg w-full pr-12 md:pr-24"
                  >
                    <span>Sort by name</span>
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={() => {
                      setSortOption("Price: low to high");
                    }}
                    className="hover:bg-primaryBlack p-2 rounded-lg w-full pr-12 md:pr-24"
                  >
                    <span>Price: low to high</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      setSortOption("Price: high to low");
                    }}
                    className="hover:bg-primaryBlack p-2 rounded-lg w-full pr-12 md:pr-24"
                  >
                    <span>Price: high to low</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => {
                      setSortOption("Ending soon");
                    }}
                    className="hover:bg-primaryBlack p-2 rounded-lg w-full pr-12 md:pr-24"
                  >
                    <span>Ending soon</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {!isAuctionsLoading ? (
            <>
              {filteredAuctions?.map((auction, index) => (
                <TokenCard
                  key={index}
                  item={auction.item}
                  isToken={true}
                  listingType={auction?.listingType}
                  isListing={auction?.listingType}
                  isAuction={auction?.listingType === "Auction"}
                  url={
                    !auction?.tokenData
                      ? `/${auction?.chainId}/offer/${auction?.offerId}/${auction?.tokenId}`
                      : `/${auction?.chainId}/offer/${auction.item?.nftContract?.adOffers[0]?.id}/${auction?.tokenId}?tokenData=${auction.item?.mint?.tokenData}`
                  }
                  currencyDecimals={auction?.currencyDecimals}
                  tokenId={auction?.tokenId}
                  offer={auction}
                />
              ))}
            </>
          ) : (
            <>
              {Array.from({ length: 12 }).map((_, index) => (
                <TokenCardSkeleton key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHome;
