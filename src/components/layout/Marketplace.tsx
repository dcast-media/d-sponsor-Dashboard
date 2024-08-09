import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Sidebar from "@/components/features/marketplace/Sidebar";
import "tippy.js/dist/tippy.css";
import Meta from "@/components/Meta";
import TokenCard from "@/components/ui/cards/TokenCard";
import { useAddress } from "@thirdweb-dev/react";
import { fetchMarketplace } from "@/utils/graphql/fetchMarketplace";
import { useChainContext } from "@/hooks/useChainContext";
import config from "@/config/config";
import TokenCardSkeleton from "@/components/ui/skeletons/TokenCardSkeleton";

const Marketplace = () => {
  const router = useRouter();
  const address = useAddress();

  const [listedAuctionToken, setListedAuctionToken] = useState<any[]>([]);

  const [isOwner] = useState<boolean>(false);
  const [filterTypes, setFilterTypes] = useState<any[]>([]);

  const { currentChainObject } = useChainContext();
  const chainId = currentChainObject?.chainId;

  const fetchAllListedTokenRef = React.useRef(false);

  useEffect(() => {
    if (chainId) {
      const fetchAdsOffers = async () => {
        if (fetchAllListedTokenRef.current) return;
        fetchAllListedTokenRef.current = true;

        try {
          const listingArray: any[] = [];

          for (const [chainId] of Object.entries(config)) {
            const listings = await fetchMarketplace(chainId);
            listingArray.push(...listings);
          }

          setListedAuctionToken(listingArray);
        } catch (error) {
          console.error("Error fetching marketplace listings:", error);
        } finally {
          fetchAllListedTokenRef.current = false;
        }
      };

      if (chainId) fetchAdsOffers();
    }
  }, [router, address, chainId]);

  const filteredTokens = useMemo(() => {
    if (filterTypes.length === 0) return listedAuctionToken;

    const filterCategories = {
      status: filterTypes.filter((f: any) => f.category === "status").map((f: any) => f.type),
      chain: filterTypes.filter((f: any) => f.category === "chain").map((f: any) => f.type)
    };

    return listedAuctionToken?.filter((item) => {
      const statusMatch =
        filterCategories.status.length === 0 ||
        filterCategories.status.includes(item.marketplaceListings[0]?.listingType);
      const chainMatch =
        filterCategories.chain.length === 0 ||
        filterCategories.chain.includes(item.chainConfig.network);
      return statusMatch && chainMatch;
    });
  }, [listedAuctionToken, filterTypes]);

  const metadata = {
    title: "Marketplace || SiBorg Ads - The Web3 Monetization Solution",
    keyword:
      "audience engagement, web3, creator economic, NFT, creator monetization, creator economy, creator token, creator coin, creator tokenization, creator economy",

    desc: "Explore the future of media monetization. SiBorg Ads decentralized platform offers tokenized advertising spaces for dynamic and sustainable media funding."
  };

  return (
    <>
      <Meta {...metadata} />
      <section className="relative pt-16 pb-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <Image
            width={1920}
            height={789}
            src="/img/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="px-6 py-16 xl:px-24">
          {/* Filters / Sorting */}
          {/* <div className="flex flex-wrap justify-between">
          <div className="flex space-x-2 mb-2">
            <button className="js-collections-toggle-filters flex h-10 group flex-shrink-0 items-center justify-center space-x-1 rounded-lg border border-jacarta-100 bg-white py-1.5 px-4 font-display text-sm font-semibold text-jacarta-100 hover:bg-primaryPurple hover:border-primaryPurple dark:hover:bg-primaryPurple dark:border-jacarta-800 dark:bg-secondaryBlack">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-4 w-4 fill-jacarta-700 dark:fill-white group-hover:fill-white">
                <path fill="none" d="M0 0H24V24H0z"></path>
                <path d="M21 4v2h-1l-5 7.5V22H9v-8.5L4 6H3V4h18zM6.404 6L11 12.894V20h2v-7.106L17.596 6H6.404z"></path>
              </svg>
              <span className="mt-0.5 dark:text-white group-hover:text-white">Filters</span>
            </button>

            <button className="lex h-10 group flex-shrink-0 items-center justify-center space-x-1 rounded-lg border border-jacarta-100 bg-white py-1.5 px-4 font-medium text-2xs hover:bg-primaryPurple hover:border-primaryPurple dark:hover:bg-primaryPurple dark:border-jacarta-800 dark:bg-secondaryBlack">
              <span className="mt-0.5 dark:text-white group-hover:text-white">Clear All</span>
            </button>
          </div>

          {/* View / Sorting */}
          {/* <Sorting /> */}
          {/*</div> */}
          {/* end filters / sorting */}

          <div className="lg:flex w-full mt-6">
            {/* Sidebar */}
            <Sidebar setFilterTypes={setFilterTypes} />
            {/* end sidebar */}
            {/* Content */}
            <div className="js-collections-content w-full">
              <div className="mb-8 pb-px">
                <h1 className="pt-3 mb-2 font-display text-2xl font-medium text-jacarta-900 dark:text-white">
                  Explore Marketplace
                </h1>
                <p className="dark:text-jacarta-100 font-medium text-2xs">
                  {filteredTokens?.length ?? 0} items
                </p>
              </div>
              <>
                {/* <!-- Grid --> */}
                {listedAuctionToken?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
                    {filteredTokens?.map((item, index) => {
                      return (
                        <TokenCard
                          item={item}
                          key={index}
                          url={
                            !item.mint?.tokenData
                              ? `/${item?.chainConfig?.chainId}/offer/${item?.offerId}/${item?.tokenId}`
                              : `/${item?.chainConfig?.chainId}/offer/${item?.nftContract?.adOffers[0]?.id}/${item?.tokenId}?tokenData=${item?.mint?.tokenData}`
                          }
                          isOwner={isOwner}
                          isToken={true}
                          listingType={item?.marketplaceListings[0]?.listingType}
                          isListing={item?.marketplaceListings[0]?.listingType}
                          isAuction={item?.marketplaceListings[0]?.listingType === "Auction"}
                          currencyDecimals={item?.currencyDecimals}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(15)].map((_, index) => (
                      <TokenCardSkeleton key={index} widthSize={230} />
                    ))}
                  </div>
                )}
              </>
            </div>{" "}
            {/* end content */}
          </div>
        </div>
      </section>
    </>
  );
};
export default Marketplace;
