import Tippy from "@tippyjs/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "tippy.js/dist/tippy.css";
import TimerCard from "../timer/TimerCard";
import { shortenAddress, useAddress } from "@thirdweb-dev/react";
import { getAddress, formatUnits } from "ethers/lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber } from "ethers";

const TokenCard = ({
  item,
  url = "",
  isToken = false,
  isSelectionActive,
  isOwner,
  isAuction = false,
  isListing = false,
  listingType,
  disableLink,
  availableToSubmitAdFromOwnedTokens,
  createdOffersProposals,
  offer,
  offers,
  isDisabled,
  currencyDecimals,
  tokenId
}: {
  item: any;
  url?: string;
  isToken?: boolean;
  isSelectionActive?: boolean;
  isOwner?: boolean;
  isAuction?: boolean;
  isListing?: boolean;
  listingType?: string;
  disableLink?: boolean;
  availableToSubmitAdFromOwnedTokens?: boolean;
  createdOffersProposals?: boolean;
  offer?: any;
  offers?: any;
  isDisabled?: boolean;
  currencyDecimals?: number;
  tokenId?: string;
}) => {
  const [price, setPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState<string | null>(null);
  const [currencyToken, setCurrencyToken] = useState(null);
  const [itemData, setItemData] = useState<any>({});
  const [itemStatut, setItemStatut] = useState<string | null>(null);
  const [lastSalePrice, setLastSalePrice] = useState(null);
  const [lastBidder, setLastBidder] = useState(null);
  const [isLastBidder, setIsLastBidder] = useState(false);
  const [itemProposals, setItemProposals] = useState<any>(null);
  const [availableToSubmitAd, setAvailableToSubmitAd] = useState(false);
  const [isPendingAdsOnOffer, setIsPendingAdsOnOffer] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const address = useAddress();

  useEffect(() => {
    if (offers) {
      // we want to get all the proposals for the current item (accept, reject, pending, all)
      // for that we filter the offers to match the offer with the current offer that contains the current item
      const itemOffer = offers?.find((offer) => offer?.id === item?.offerId);

      // itemOffers is an item that contains nftContract which contains tokens that contains the tokenId
      // we need to get the token item from the tokens array where the tokenId matches the current item tokenId
      const tokenOffers = itemOffer?.nftContract?.tokens?.find(
        (token) =>
          !!token?.tokenId && !!item?.tokenId && BigInt(token?.tokenId) === BigInt(item?.tokenId)
      );

      // then we get the proposals for the current item
      // we get the accepted, pending, rejected and all proposals
      // token offers has a "all proposals" key that contains all the proposals
      // we filter the proposals to get the accepted, pending and rejected proposals
      // for that we can use the status key of the proposal "CURRENT_ACCEPTED", "CURRENT_PENDING", "CURRENT_REJECTED"
      const allProposals = tokenOffers?.allProposals;
      const acceptedProposals = allProposals?.filter(
        (proposal) => proposal?.status === "CURRENT_ACCEPTED"
      );
      const pendingProposals = allProposals?.filter(
        (proposal) => proposal?.status === "CURRENT_PENDING"
      );
      const rejectedProposals = allProposals?.filter(
        (proposal) => proposal?.status === "CURRENT_REJECTED"
      );

      const itemProposals = {
        name: item?.metadata?.name,
        pendingProposals,
        rejectedProposals,
        acceptedProposals,
        allProposals
      };

      setItemProposals(itemProposals);
    }
  }, [offers, item]);

  useEffect(() => {
    // the sponsor can submit an ads if one of the following conditions is met:
    // - the item has no pending proposals AND no accepted proposals
    // - there is one rejected proposal more recent than the last accepted proposal and the last pending proposal
    // each proposal has a creationTimestamp and a lastUpdateTimestamp

    if (itemProposals) {
      const { pendingProposals, rejectedProposals, acceptedProposals } = itemProposals;

      if (pendingProposals?.length === 0 && acceptedProposals?.length === 0) {
        setAvailableToSubmitAd(true);
        return;
      }

      const lastAcceptedProposal = acceptedProposals?.sort(
        (a, b) => Number(b?.lastUpdateTimestamp) - Number(a?.lastUpdateTimestamp)
      )[0];
      const lastPendingProposal = pendingProposals?.sort(
        (a, b) => Number(b?.lastUpdateTimestamp) - Number(a?.ladtUpdateTimestamp)
      )[0];
      const lastRejectedProposal = rejectedProposals?.sort(
        (a, b) => Number(b?.lastUpdateTimestamp) - Number(a?.lastUpdateTimestamp)
      )[0];

      if (
        lastRejectedProposal &&
        lastAcceptedProposal &&
        Number(lastRejectedProposal?.lastUpdateTimestamp) >
          Number(lastAcceptedProposal?.lastUpdateTimestamp) &&
        lastPendingProposal &&
        Number(lastRejectedProposal?.lastUpdateTimestamp) >
          Number(lastPendingProposal?.lastUpdateTimestamp)
      ) {
        setAvailableToSubmitAd(true);
        return;
      }

      setAvailableToSubmitAd(false);
    }
  }, [itemProposals]);

  useEffect(() => {
    if (item) {
      let lastSalePrice;

      if (item?.marketplaceListings?.length > 0) {
        // we look for the latest completed listing
        const latestListings = item?.marketplaceListings?.sort(
          (a, b) => Number(b.id) - Number(a.id)
        );

        // now we iterate through each listing and send the first one that is finished, else we return null
        const latestListing = latestListings?.find((listing) => listing?.status === "COMPLETED");
        const isLatestListingFinished = latestListing?.status === "COMPLETED";

        if (isLatestListingFinished) {
          // if yes we get the last sale price
          if (latestListing?.listingType === "Direct") {
            // direct price
            lastSalePrice = formatUnits(
              BigInt(latestListing?.buyoutPricePerToken),
              Number(latestListing?.currencyDecimals)
            );
          } else if (latestListing?.listingType === "Auction") {
            // auction price
            lastSalePrice = formatUnits(
              BigInt(latestListing?.bids[0]?.paidBidAmount),
              Number(latestListing?.currencyDecimals)
            );
          }
        }
      }

      if (!lastSalePrice && item?.mint !== null) {
        // we handle the mint case
        const mintPrice = item?.mint?.totalPaid;
        if (mintPrice) {
          lastSalePrice = formatUnits(BigInt(mintPrice), Number(item?.currencyDecimals));
        }
      }

      if (lastSalePrice) {
        setLastSalePrice(lastSalePrice);
      } else {
        setLastSalePrice(null);
      }
    } else {
      setLastSalePrice(null);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const sortedListings = item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id));
    if (!sortedListings) return;

    const lastBidder = sortedListings[0]?.bids?.[0]?.bidder;

    setLastBidder(lastBidder);
  }, [item]);

  useEffect(() => {
    if (address && lastBidder && getAddress(address) === getAddress(lastBidder)) {
      setIsLastBidder(true);
    }
  }, [address, lastBidder]);

  useEffect(() => {
    if (offer) {
      const pendingProposals = offer?.allProposals?.filter(
        (proposal) => proposal?.status === "CURRENT_PENDING"
      );

      if (pendingProposals?.length > 0) {
        setIsPendingAdsOnOffer(true);
      } else {
        setIsPendingAdsOnOffer(false);
      }
    }
  }, [offer]);

  function formatDate(dateIsoString: string): string {
    if (!dateIsoString) return "date not found";
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateIsoString).toLocaleDateString("en-EN", options);
  }

  useEffect(() => {
    if (!item) return;

    if (!isToken && !isListing && !isAuction) {
      setItemStatut("OFFER");
      setPrice(item?.nftContract.prices?.[0]?.mintPriceStructureFormatted?.totalAmount);
      const totalPrice = item?.nftContract.prices[0]?.mintPriceStructure?.totalAmount;
      if (currencyDecimals && totalPrice) {
        const formattedTotalPrice = formatUnits(
          BigNumber.from(totalPrice),
          Number(currencyDecimals)
        );
        setTotalPrice(formattedTotalPrice);
      }
      setCurrencyToken(item?.nftContract?.prices[0]?.currencySymbol);
      return;
    }

    if (isToken && item?.marketplaceListings?.length <= 0 && item?.mint === null) {
      setItemStatut("TOKENMINTABLE");
      setPrice(item?.nftContract?.prices[0]?.mintPriceStructureFormatted?.totalAmount);
      const totalPrice = item?.nftContract?.prices[0]?.mintPriceStructure?.totalAmount;

      if (currencyDecimals && totalPrice) {
        const formattedTotalPrice = formatUnits(
          BigNumber.from(totalPrice),
          Number(currencyDecimals)
        );
        setTotalPrice(formattedTotalPrice);
      }
      setCurrencyToken(item?.nftContract?.prices[0]?.currencySymbol);
      return;
    }
    if (isToken && item?.marketplaceListings?.length <= 0 && item.mint !== null) {
      setPrice(null);
      setCurrencyToken(item?.nftContract?.prices[0]?.currencySymbol);
      setItemStatut("TOKENMINTED");
      return;
    }
    if (isToken && isAuction && listingType === "Auction") {
      setPrice(
        item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
          ? item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
              ?.bidPriceStructureFormatted?.minimalBidPerToken
          : item?.bidPriceStructureFormatted?.minimalBidPerToken
      );
      const totalPrice = item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
        ? item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
            ?.bidPriceStructure?.minimalBidPerToken
        : item?.bidPriceStructure?.minimalBidPerToken;
      if (currencyDecimals && totalPrice) {
        const formattedTotalPrice = formatUnits(
          BigNumber.from(totalPrice),
          Number(currencyDecimals)
        );
        setTotalPrice(formattedTotalPrice);
      }
      setCurrencyToken(
        item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
          ? item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
              ?.currencySymbol
          : item?.currencySymbol
      );

      setItemStatut("AUCTION");
      return;
    }
    if (isToken && item?.marketplaceListings?.length > 0 && listingType === "Direct") {
      setPrice(
        item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
          ?.buyPriceStructureFormatted?.buyoutPricePerToken
      );
      const totalPrice = item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
        ?.buyPriceStructure?.buyoutPricePerToken;
      if (currencyDecimals && totalPrice) {
        const formattedTotalPrice = formatUnits(
          BigNumber.from(totalPrice),
          Number(currencyDecimals)
        );
        setTotalPrice(formattedTotalPrice);
      }
      setCurrencyToken(
        item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]?.currencySymbol
      );
      setItemStatut("DIRECT");
    }
  }, [
    item,
    isToken,
    isListing,
    isAuction,
    listingType,
    currencyDecimals,
    itemData,
    tokenId,
    totalPrice,
    offer
  ]);

  useEffect(() => {
    if (!item) return;

    let data = null;
    if (isToken) {
      data = item?.metadata ? item?.metadata : null;
    } else {
      data = item?.metadata?.offer ? item?.metadata?.offer : null;
    }

    setItemData(data);
  }, [item, isToken]);

  const {
    name = "OfferName",
    image = "/images/gradient_creative.jpg",
    valid_from = null,
    valid_to = null
  } = itemData ?? {};

  useEffect(() => {
    const fetchImage = async (image) => {
      // get url image instead of ipfs:// starting url
      if (image?.startsWith("ipfs://")) {
        const storage = new ThirdwebStorage({ clientId: "6f375d41f2a33f1f08f6042a65d49ec9" });
        const ipfsUrl = await storage.resolveScheme(image);
        setImageUrl(ipfsUrl);
      } else {
        setImageUrl(image);
      }
    };

    if (image) {
      fetchImage(image);
    } else {
      setImageUrl(null);
    }
  }, [image]);

  const offerItemCard = (
    <article className="relative h-full">
      {item?.isPending && isOwner && (
        <div className="absolute -top-2 -right-2 rounded-2xl bg-red rounded-2xl dark:text-white px-2">
          !
        </div>
      )}

      <div
        style={{
          transitionDuration: "500ms"
        }}
        className="dark:bg-secondaryBlack h-full cursor-pointer dark:hover:bg-opacity-80 box-border hover:border-2 duration-1000 hover:duration-1000 hover:-translate-y-1 dark:hover:border-2 dark:border-jacarta-100 dark:border-opacity-10 border-opacity-10 border-jacarta-900 relative rounded-2xl flex flex-col border bg-white p-4 transition-shadow hover:shadow-lg text-jacarta-100"
      >
        <div className="relative">
          <figure>
            {isSelectionActive ? (
              imageUrl && (
                <Image
                  src={imageUrl ?? "/images/gradient_creative.jpg"}
                  alt="logo"
                  height={230}
                  width={230}
                  className="w-full lg:h-full object-cover rounded-lg"
                  loading="lazy"
                />
              )
            ) : (
              <>
                {imageUrl && (
                  <Image
                    src={imageUrl ?? "/images/gradient_creative.jpg"}
                    alt="logo"
                    height={230}
                    width={230}
                    className="w-full lg:h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                )}
              </>
            )}
          </figure>

          <Tippy
            content={item?.chainConfig?.network}
            placement="top"
            className="bg-jacarta-300 text-jacarta-900 box-border hover:border-2 dark:hover:border-2 hover:-m-1 duration-400 dark:hover:bg-jacarta-800 dark:border-jacarta-100 dark:border-opacity-10 border-opacity-10 border border-jacarta-900 hover:bg-jacarta-800 dark:text-jacarta-100 rounded-md p-2"
          >
            <div
              style={{ background: "rgba(54, 58, 93, 0.7)", backdropFilter: "blur(20px)" }}
              className={`absolute ${!isToken ? "-bottom-1" : "bottom-8"} -right-2 flex items-center whitespace-nowrap rounded-md py-1 px-2`}
            >
              <Image
                src={item?.chainConfig?.logoURL}
                width={17}
                height={17}
                alt="logo"
                loading="lazy"
              />
            </div>
          </Tippy>
          {isToken && (
            <Tippy
              content={`token  # ${item?.tokenData ? item?.tokenData : item?.mint?.tokenData ? item?.mint?.tokenData : item?.tokenId}`}
              placement="top"
              className="bg-jacarta-300 text-jacarta-900 box-border hover:border-2 dark:hover:border-2 hover:-m-1 duration-400 dark:hover:bg-jacarta-800 dark:border-jacarta-100 dark:border-opacity-10 border-opacity-10 border border-jacarta-900 hover:bg-jacarta-800 dark:text-jacarta-100 rounded-md p-2"
            >
              <div
                style={{ background: "rgba(54, 58, 93, 0.7)", backdropFilter: "blur(20px)" }}
                className="absolute backdrop-blur-1 -bottom-1 -right-2 dark:border-jacarta-800 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2"
              >
                <span className="text-primaryPink text-sm font-medium tracking-tight">
                  #{" "}
                  {item?.tokenData
                    ? item?.tokenData
                    : item.mint?.tokenData
                      ? item.mint?.tokenData
                      : item.tokenId}
                </span>
              </div>
            </Tippy>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="mt-4 flex items-center justify-between gap-2">
            {isSelectionActive ? (
              <span className="font-display  text-primaryBlack hover:text-primaryPurple text-base dark:text-white flex items-center gap-1">
                {availableToSubmitAd && availableToSubmitAdFromOwnedTokens && (
                  <ResponsiveTooltip text="You can submit an ad for this item">
                    <ExclamationCircleIcon className="h-5 w-5 text-red dark:text-red" />
                  </ResponsiveTooltip>
                )}
                {createdOffersProposals && isPendingAdsOnOffer && (
                  <ResponsiveTooltip text="You have 1 or more ads proposals to check on your offer">
                    <ExclamationCircleIcon className="h-5 w-5 text-red dark:text-red" />
                  </ResponsiveTooltip>
                )}{" "}
                <ResponsiveTooltip text={name}>{name}</ResponsiveTooltip>
              </span>
            ) : (
              <div className="overflow-hidden text-ellipsis whitespace-nowrap ">
                <span className="font-display  text-primaryBlack hover:text-primaryPurple text-base dark:text-white flex items-center gap-1">
                  {availableToSubmitAd && availableToSubmitAdFromOwnedTokens && (
                    <ResponsiveTooltip text="You can submit an ad for this item">
                      <ExclamationCircleIcon className="h-5 w-5 text-red dark:text-red" />
                    </ResponsiveTooltip>
                  )}
                  {createdOffersProposals && isPendingAdsOnOffer && (
                    <ResponsiveTooltip text="You have 1 or more ads proposals to check on your offer">
                      <ExclamationCircleIcon className="h-5 w-5 text-red dark:text-red" />
                    </ResponsiveTooltip>
                  )}{" "}
                  <ResponsiveTooltip text={name}>{name}</ResponsiveTooltip>
                </span>
              </div>
            )}

            {isDisabled && (
              <span className="text-red text-xs min-w-[100px] text-end font-medium tracking-tight">
                ❌ Disabled
              </span>
            )}

            {currencyToken &&
            price &&
            (item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]?.status ===
              "CREATED" ||
              itemStatut === "TOKENMINTABLE") ? (
              <div className="dark:border-jacarta-800 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                <span className="text-green text-sm font-medium tracking-tight">
                  {!!totalPrice && parseFloat(totalPrice) > 0
                    ? `${price ?? 0} ${currencyToken}`
                    : "Free"}
                </span>
              </div>
            ) : (
              itemStatut === "AUCTION" && (
                <span
                  className={`${item.status === "CREATED" ? "text-primaryPurple" : item.status !== "OUTBID" ? "text-green" : "text-red"} text-xs min-w-[100px] text-end font-medium tracking-tight`}
                >
                  {item.status}
                </span>
              )
            )}
          </div>
          <div className="mt-2 text-xs flex items-center justify-between gap-2 ">
            <div>
              {!isToken ? (
                <span className="dark:text-jacarta-100 text-jacarta-100">
                  {formatDate(valid_from)} - {formatDate(valid_to)}
                </span>
              ) : (!isAuction &&
                  !isListing &&
                  itemStatut !== "TOKENMINTABLE" &&
                  itemStatut !== "DIRECT") ||
                (item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
                  ?.status !== "CREATED" &&
                  itemStatut !== "TOKENMINTABLE") ? (
                <div className="flex  w-full gap-2 items-center ">
                  <span className="text-jacarta-100">Sold</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="h-6 w-6 fill-red"
                  >
                    <path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                  </svg>
                </div>
              ) : (
                (itemStatut === "AUCTION" ||
                  itemStatut === "DIRECT" ||
                  itemStatut === "TOKENMINTABLE") && (
                  <div className="flex justify-between w-full items-center gap-4">
                    <div className="flex gap-2 items-center justify-center">
                      <span className="dark:text-jacarta-100 text-jacarta-100">
                        {listingType === "Auction"
                          ? "Live Auction"
                          : listingType === "Direct" || itemStatut === "TOKENMINTABLE"
                            ? "Buy Now"
                            : null}{" "}
                      </span>

                      {listingType === "Auction" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          className="h-6 w-6 fill-[#ce44ea]"
                        >
                          <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                          className="h-6 w-6 fill-orange"
                        >
                          <path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                        </svg>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
            {/* {!isToken ? (
              <span className="dark:text-jacarta-100 text-jacarta-100">
                {formatDate(valid_from)} - {formatDate(valid_to)}
              </span>
            ) : (
              <span className={`${adStatut === 0 ? "text-red" : adStatut === 1 ? "text-green" : adStatut === 2 ? "text-primaryPurple" : ""} text-sm font-bold`}>
                {adStatut === 0 ? "❌ Rejected" : adStatut === 1 ? "✅ Accepted" : adStatut === 2 ? "🔍 Pending" : "Ad space available"}
              </span>
            )} */}
            {item?.endTime &&
              item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]?.status ===
                "CREATED" && (
                <div className="dark:border-jacarta-800 flex items-center whitespace-nowrap rounded-md border p-1">
                  <TimerCard endTime={item.endTime} />
                </div>
              )}
          </div>
        </div>

        {lastBidder &&
          item?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]?.status !==
            "COMPLETED" && (
            <div className={`flex items-center gap-1 mt-4 text-sm`}>
              Last Bidder:{" "}
              <span className={`${isLastBidder ? "text-primaryPurple" : "text-jacarta-100"}`}>
                {isLastBidder ? "You" : shortenAddress(lastBidder)}
              </span>
            </div>
          )}
        {lastSalePrice && Number(lastSalePrice) > 0 && (
          <div className="flex items-center mt-4 text-sm text-jacarta-100">
            Last Sale: {lastSalePrice} {currencyToken}
          </div>
        )}
      </div>
    </article>
  );

  if (disableLink) {
    return <div className="h-full">{offerItemCard}</div>;
  } else {
    return (
      <Link href={url ?? "#"} className="h-full">
        {offerItemCard}
      </Link>
    );
  }
};

export default TokenCard;
