import React from "react";
import Image from "next/image";
import "tippy.js/themes/light.css";
import TokenCard from "@/components/ui/cards/TokenCard";

const AuctionListedTokens = ({ data, isOwner, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Image src="/images/loading-bullet.svg" alt="icon" width={60} height={60} />
      </div>
    );
  }

  return (
    <>
      {/* <!-- Grid --> */}
      <div className="dark:bg-secondaryBlack dark:text-jacarta-100 rounded-2lg bg-white p-3 flex gap-4 justify-center items-center mb-6">
        <span>
          {" "}
          This section lists all owned tokens currently placed in auction.
          <br />
        </span>
      </div>
      {data?.length > 0 ? (
        <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
          {data?.map((item, index) => {
            let currencyDecimals = 0;
            if (item?.prices?.length > 0) {
              currencyDecimals = item?.prices[0]?.currencyDecimals;
            } else {
              currencyDecimals = item?.marketplaceListings?.sort(
                (a, b) => Number(b?.id) - Number(a?.id)
              )[0]?.currencyDecimals;
            }

            return (
              <TokenCard
                item={item}
                listingType={"Auction"}
                key={index}
                url={
                  !item.tokenData
                    ? `/${item?.chainConfig?.chainId}/offer/${item?.nftContract?.adOffers[0]?.id}/${item.tokenId}`
                    : `/${item?.chainConfig?.chainId}/offer/${item?.nftContract?.adOffers[0]?.id}/${item.tokenId}?tokenData=${item.tokenData}`
                }
                isOwner={isOwner}
                isToken={true}
                isAuction={true}
                isListing={true}
                currencyDecimals={currencyDecimals}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <span>{isOwner ? "You have no auctions yet..." : "No auctions..."}</span>
        </div>
      )}
    </>
  );
};

export default AuctionListedTokens;
