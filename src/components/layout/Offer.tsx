import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Meta from "@/components/Meta";
import { ethers } from "ethers";
import Image from "next/image";
import { useContract, useContractWrite, useContractRead, useAddress } from "@thirdweb-dev/react";
import Tippy from "@tippyjs/react";
import OfferSkeleton from "@/components/ui/skeletons/OfferSkeleton";
import { fetchOffer } from "@/utils/graphql/fetchOffer";
import Integration from "@/components/features/offer/offerManagement/Integration";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import ResponsiveTooltip from "@/components/ui/ResponsiveTooltip";
import Form from "@/components/features/offer/search/SearchForm";
import "tippy.js/dist/tippy.css";
import AdValidation from "@/components/features/offer/AdValidation";
import Details from "@/components/features/token/accordion/Details";
import config from "@/config/config";
import { useSwitchChainContext } from "@/hooks/useSwitchChainContext";
import { features } from "@/data/features";
import UpdateOffer from "@/components/features/offer/offerManagement/UpdateOffer";
import ChangeMintPrice from "@/components/features/offer/offerManagement/ChangeMintPrice";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { BadgePercentIcon, BlocksIcon, RefreshCwIcon } from "lucide-react";
import Disable from "@/components/ui/misc/Disable";
import TokenCard from "@/components/ui/cards/TokenCard";
import { addLineBreaks } from "@/utils/misc/addLineBreaks";

const Offer = () => {
  const router = useRouter();

  const offerId = router.query?.offerId;
  const chainId = router.query?.chainName as string;
  const [refusedValidatedAdModal, setRefusedValidatedAdModal] = useState<boolean>(false);
  const [offerData, setOfferData] = useState<any>(null);
  const [royalties, setRoyalties] = useState<number | null>(null);
  const [, setCurrency] = useState(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [, setPrice] = useState<number | null>(null);
  const [imageModal, setImageModal] = useState(false);
  const [showEntireDescription, setShowEntireDescription] = useState<boolean>(false);
  const [pendingProposalData, setPendingProposalData] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const address = useAddress();
  const { contract: DsponsorAdminContract } = useContract(
    config[chainId]?.smartContracts?.DSPONSORADMIN?.address,
    config[chainId]?.smartContracts?.DSPONSORADMIN?.abi
  );
  const { mutateAsync } = useContractWrite(DsponsorAdminContract, "reviewAdProposals");
  const [urlFromChild, setUrlFromChild] = useState("");
  const [successFullRefuseModal, setSuccessFullRefuseModal] = useState(false);
  const [tokenData, setTokenData] = useState("");
  const [isWordAlreadyTaken, setIsWordAlreadyTaken] = useState(false);
  const { contract: tokenContract } = useContract(
    offerData?.nftContract?.prices?.[0]?.currency,
    "token"
  );
  const { data: symbolContract } = useContractRead(tokenContract, "symbol");
  const { data: decimalsContract } = useContractRead(tokenContract, "decimals");
  const NATIVECurrency = config[chainId]?.smartContracts?.NATIVE;
  const { setSelectedChain } = useSwitchChainContext();
  const [, setCanChangeMintPrice] = useState(false);
  const [offerManagementActiveTab, setOfferManagementActiveTab] = useState("integration");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [accordionActiveTab, setAccordionActiveTab] = useState<string[]>([]);

  const { data: bps } = useContractRead(DsponsorAdminContract, "feeBps");
  const maxBps = 10000;

  let tokenCurrencyAddress = offerData?.nftContract?.prices[0]?.currency;

  const {
    description = "description not found",
    id = "1",
    name = "DefaultName"
  } = offerData?.metadata?.offer ? offerData.metadata.offer : {};

  useEffect(() => {
    if (offerData?.metadata?.offer?.image) {
      setImageUrl(offerData.metadata.offer.image);
    } else {
      setImageUrl("/images/gradient_creative.jpg");
    }
  }, [offerData]);

  const [itemProposals, setItemProposals] = useState<any | null>(null);
  const [mediaShouldValidateAnAd, setMediaShouldValidateAnAd] = useState(false);
  const [
    sponsorHasAtLeastOneRejectedProposalAndNoPending,
    setSponsorHasAtLeastOneRejectedProposalAndNoPending
  ] = useState(false);
  const [offers, setOffers] = useState<any[] | null>(null);
  const [isMedia, setIsMedia] = useState(false);

  const fetchAllOffersRef = React.useRef(false);

  useEffect(() => {
    const fetchOffers = async () => {
      if (fetchAllOffersRef.current) return;
      fetchAllOffersRef.current = true;

      try {
        const offers = await fetchOffer(chainId, offerId);
        setOffers(offers);

        const offerData = offers?.filter((offer) => Number(offer?.id) === Number(offerId))[0];
        const offerDataFinal = {
          ...offerData,
          chainConfig: offers?.filter((offer) => Number(offer?.id) === Number(offerId))[0]
            ?.chainConfig
        };

        setOfferData(offerDataFinal);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        fetchAllOffersRef.current = false;
      }
    };

    if (chainId) {
      fetchOffers();
    }
  }, [chainId, offerId]);

  useEffect(() => {
    if (offerData && address) {
      if (offerData?.admins?.includes(address?.toLowerCase())) {
        setIsMedia(true);
      } else {
        setIsMedia(false);
      }
    }
  }, [address, offerData]);

  useEffect(() => {
    if (offers) {
      // we want to get all the proposals for all the items from an offer (accept, reject, pending, all)
      // for that we filter the offers to associate the offer with the offerId
      const itemsOffers = offers?.filter((offer) => offer?.id === offerId);

      // we extract the only element from the array
      const tokenOffers = itemsOffers[0];

      // then we get the proposals for the offer but the offer contains multiple tokens in the nftContract key
      // we get the accepted, pending, rejected and all proposals
      // so we need get every proposals for every tokens in the nftContract key of tokenOffers
      // we filter the proposals to get the accepted, pending and rejected proposals
      // for that we can use the status key of the proposal "CURRENT_ACCEPTED", "CURRENT_PENDING", "CURRENT_REJECTED"
      const allProposals = tokenOffers?.nftContract?.tokens?.map((token) => {
        const acceptedProposals = token?.allProposals?.filter(
          (proposal) => proposal?.status === "CURRENT_ACCEPTED"
        );
        const pendingProposals = token?.allProposals?.filter(
          (proposal) => proposal?.status === "CURRENT_PENDING"
        );
        const rejectedProposals = token?.allProposals?.filter(
          (proposal) => proposal?.status === "CURRENT_REJECTED"
        );

        return {
          acceptedProposals,
          pendingProposals,
          rejectedProposals
        };
      });

      // we flatten the array of proposals
      const acceptedProposals = allProposals?.map((proposal) => proposal?.acceptedProposals).flat();
      const pendingProposals = allProposals?.map((proposal) => proposal?.pendingProposals).flat();
      const rejectedProposals = allProposals?.map((proposal) => proposal?.rejectedProposals).flat();

      const itemProposals = {
        name: name ?? "",
        pendingProposals,
        rejectedProposals,
        acceptedProposals,
        allProposals
      };

      setItemProposals(itemProposals);
    }
  }, [name, offers, offerId]);

  useEffect(() => {
    if (!itemProposals) return;
    // now we want to check one thing from the sponsor side and one thing from the media side
    // we want to check if the sponsor has at least one rejected proposal and no pending proposal
    // we want to check if the media should validate an ad or not (i.e. if the media has at least one pending proposal)

    // we check if the sponsor has only rejected proposals
    const sponsorHasAtLeastOneRejectedProposal = itemProposals?.rejectedProposals?.length > 0;
    const sponsorHasNoPendingProposal = itemProposals?.pendingProposals?.length === 0;
    const lastAcceptedProposalTimestamp =
      parseFloat(
        itemProposals?.acceptedProposals?.sort(
          (a, b) => b?.creationTimestamp - a?.creationTimestamp
        )[0]?.lastUpdateTimestamp
      ) * 1000;
    const lastRefusedProposalTimestamp =
      parseFloat(
        itemProposals?.rejectedProposals?.sort(
          (a, b) => b?.creationTimestamp - a?.creationTimestamp
        )[0]?.lastUpdateTimestamp
      ) * 1000;
    const sponsorHasNoMoreRecentValidatedProposal =
      new Date(lastAcceptedProposalTimestamp) <= new Date(lastRefusedProposalTimestamp);

    setSponsorHasAtLeastOneRejectedProposalAndNoPending(
      sponsorHasAtLeastOneRejectedProposal &&
        sponsorHasNoPendingProposal &&
        sponsorHasNoMoreRecentValidatedProposal
    );

    // now we check if the media should validate an ad
    const mediaShouldValidateAnAd = itemProposals?.pendingProposals?.length > 0;
    setMediaShouldValidateAnAd(mediaShouldValidateAnAd);
  }, [itemProposals]);

  useEffect(() => {
    const fetchImage = async (imageUrlLocal) => {
      const storage = new ThirdwebStorage({ clientId: "6f375d41f2a33f1f08f6042a65d49ec9" });
      try {
        const ipfsUrl = await storage.resolveScheme(imageUrlLocal);
        setImageUrl(ipfsUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("ipfs://")) {
      fetchImage(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (chainId) {
      setSelectedChain(config[chainId]?.network);
    }
  }, [chainId, setSelectedChain]);

  useEffect(() => {
    if (
      address &&
      (address?.toLowerCase() === offerData?.nftContract?.owner?.newOwner?.toLowerCase() ||
        offerData?.admins?.includes(address.toLowerCase()))
    ) {
      setCanChangeMintPrice(true);
      setIsOwner(true);
    }
  }, [address, offerData]);

  useEffect(() => {
    if (!offerData) return;
    try {
      const currencyTokenObject: any = {};
      if (
        !decimalsContract &&
        !symbolContract &&
        tokenCurrencyAddress === "0x0000000000000000000000000000000000000000"
      ) {
        currencyTokenObject.symbol = NATIVECurrency.symbol;
        currencyTokenObject.decimals = NATIVECurrency.decimals;
      } else {
        currencyTokenObject.symbol = symbolContract;
        currencyTokenObject.decimals = decimalsContract;
      }

      if (!bps || !maxBps) {
        return;
      }

      if (!offerData?.nftContract?.prices[0]?.amount) {
        return;
      }

      const bigIntPrice =
        (BigInt(offerData?.nftContract?.prices[0]?.amount) * (BigInt(bps) + BigInt(maxBps))) /
        BigInt(maxBps);
      const formatPrice = parseFloat(
        ethers.utils.formatUnits(bigIntPrice, currencyTokenObject.decimals)
      );

      setPrice(Number(Math.ceil(formatPrice * 1000) / 1000));
      setCurrency(currencyTokenObject);
    } catch (e) {
      console.error("Error: Currency not found for address", offerData?.nftContract?.prices[0], e);
    }
  }, [symbolContract, decimalsContract, offerData, bps, NATIVECurrency, tokenCurrencyAddress]);

  useEffect(() => {
    if (offerData?.nftContract?.royalty?.bps) {
      setRoyalties(offerData?.nftContract?.royalty?.bps / 100);
    } else {
      setRoyalties(0);
    }
  }, [offerData]);

  const handleSubmit = async (submissionArgs) => {
    try {
      await mutateAsync({
        args: [submissionArgs]
      });
      setRefusedValidatedAdModal(true);
      setSuccessFullRefuseModal(true);
    } catch (error) {
      console.error("Erreur de validation du token:", error);
      setSuccessFullRefuseModal(false);
      throw error;
    }
  };
  const handleUrlChange = (newUrl, tokenData) => {
    setIsWordAlreadyTaken(false);
    setUrlFromChild(newUrl);
    setTokenData(tokenData);
    for (const token of offerData.nftContract.tokens) {
      if (token.mint === null) return;
      if (tokenData?.toLowerCase() === token.mint.tokenData?.toLowerCase()) {
        setIsWordAlreadyTaken(true);
      }
    }
  };
  const metadata = {
    title: `Offer || SiBorg Ads - The Web3 Monetization Solution`,
    keyword:
      "audience engagement, web3, creator economic, NFT, creator monetization, creator economy, creator token, creator coin, creator tokenization, creator economy",

    desc: "Explore the future of media monetization. SiBorg Ads decentralized platform offers tokenized advertising spaces for dynamic and sustainable media funding."
  };
  if (!offerData || offerData.length === 0) {
    return (
      <div>
        <OfferSkeleton />
      </div>
    );
  }

  return (
    <Accordion.Root
      type="multiple"
      value={accordionActiveTab}
      onValueChange={setAccordionActiveTab}
    >
      <Meta {...metadata} />
      {/*  <!-- Item --> */}
      <section className="relative lg:mt-24 lg:pt-12  mt-24 pt-12 pb-8">
        <div className="container flex justify-center mb-6">
          <h1 className="text-jacarta-900 font-bold font-display mb-6 text-center text-5xl dark:text-white md:text-left lg:text-6xl xl:text-6xl">
            Offer{" "}
          </h1>
        </div>
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            width={750}
            height={750}
            src={imageUrl ?? "/images/gradient_creative.jpg"}
            alt="gradient"
            className="h-auto w-full object-cover aspect-square"
          />
        </picture>
        <div className="container">
          {/* <!-- Item --> */}

          <div className="md:flex md:flex-wrap" key={id}>
            {/* <!-- Image --> */}
            <figure className="mb-8 md:w-2/5 relative md:flex-shrink-0 md:flex-grow-0 md:basis-auto lg:w-1/2 w-full flex justify-center items-start">
              <button
                className="w-full md:sticky md:top-0 right-0"
                onClick={() => setImageModal(true)}
              >
                {imageUrl && (
                  <img
                    src={imageUrl ?? "/images/gradient_creative.jpg"}
                    alt="image"
                    className="rounded-2xl cursor-pointer h-auto object-cover w-full aspect-square"
                  />
                )}
              </button>

              {/* <!-- Modal Backdrop --> */}
              {imageModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setImageModal(false);
                    }
                  }}
                >
                  {/* <!-- Modal --> */}
                  <div className="modal-dialog !my-0 flex items-center justify-center">
                    <div className="modal fade show block">
                      <div className="modal-dialog !my-0 flex items-center justify-center items-start">
                        <img
                          src={imageUrl ?? "/images/gradient_creative.jpg"}
                          alt="image"
                          className="h-auto object-cover w-full rounded-2xl aspect-square"
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-close absolute top-6 right-6"
                        onClick={() => setImageModal(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="h-6 w-6 fill-white"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* <!-- end modal --> */}
                </div>
              )}
            </figure>

            {/* <!-- Details --> */}
            <div className="md:w-3/5 md:basis-auto md:pl-8 lg:w-1/2 lg:pl-[3.75rem]">
              {/* <!-- Collection / Likes / Actions --> */}
              <div className="mb-3 flex">
                {/* <!-- Collection --> */}
                <div className="flex items-center">
                  <Link
                    href={`/profile/${offerData?.initialCreator}`}
                    className="text-primaryPurple mr-2 text-sm font-bold"
                  >
                    {offerData?.initialCreator}
                  </Link>
                </div>
              </div>

              <h2 className="font-display text-jacarta-900 mb-4 text-3xl font-semibold dark:text-white">
                {name}
              </h2>

              <div className="mb-8 flex items-center flex-wrap gap-2 space-x-4 whitespace-nowrap">
                {offerData?.nftContract?.allowList && (
                  <span className="dark:text-jacarta-100 text-jacarta-100 text-sm">
                    {offerData?.nftContract?.maxSupply -
                      offerData?.nftContract?.tokens?.filter((item) => item.mint != null)?.length}
                    /{offerData?.nftContract?.maxSupply} available
                  </span>
                )}
                <span className="text-jacarta-100 block text-sm dark:text-white">
                  Creator <strong>{royalties}% royalties</strong>
                </span>
              </div>

              {showEntireDescription ? (
                <p className="dark:text-jacarta-100 mb-10">
                  {addLineBreaks(description)}{" "}
                  {description?.length > 1000 && (
                    <button
                      onClick={() => setShowEntireDescription(false)}
                      className="text-primaryPurple"
                    >
                      Show less
                    </button>
                  )}
                </p>
              ) : (
                <div>
                  <p className="dark:text-jacarta-100 mb-10">
                    {description?.length > 1000
                      ? addLineBreaks(description?.slice(0, 1000) + "...")
                      : addLineBreaks(description)}{" "}
                    {description?.length > 1000 && (
                      <button
                        onClick={() => setShowEntireDescription(true)}
                        className="text-primaryPurple"
                      >
                        Show more
                      </button>
                    )}
                  </p>
                </div>
              )}

              {(offerData?.disable === true ||
                new Date(offerData?.metadata?.offer?.valid_to).getTime() < Date.now() ||
                offerData?.nftContract?.prices[0]?.enabled === false) && <Disable isOffer={true} />}

              {isOwner && (
                <div className="dark:bg-secondaryBlack dark:border-jacarta-800 border-jacarta-100 rounded-2lg border bg-white p-8">
                  <div className=" sm:flex sm:flex-wrap">
                    <span className="dark:text-jacarta-100 text-jacarta-100 text-sm">
                      This page allows you to oversee submitted ads, offering tools to either
                      approve or reject them. Approve ads to make them live or reject those that
                      don&apos;t meet your standards, streamlining the content that reaches your
                      audience while maintaining quality control on your platform.{" "}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Accordion.Item value="search">
        {!offerData?.nftContract?.allowList && (
          <div className="container flex flex-col justify-center">
            <Accordion.Header className="w-full">
              <Accordion.Trigger
                className={`${accordionActiveTab.includes("search") && "bg-primaryPurple"} w-full flex items-center justify-center gap-4 mb-6 border border-primaryPurple hover:bg-primaryPurple cursor-pointer p-2 rounded-lg`}
              >
                <h2 className="text-jacarta-900 font-bold font-display text-center text-3xl dark:text-white ">
                  Search
                </h2>
                <ChevronDownIcon
                  className={`w-6 h-6 duration-300 ${accordionActiveTab.includes("search") && "transform rotate-180"}`}
                />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="mb-4">
              <div className="dark:bg-secondaryBlack mb-6 dark:border-jacarta-800 border-jacarta-100 rounded-2lg border bg-white p-8">
                <div className=" sm:flex sm:flex-wrap">
                  <span className="dark:text-jacarta-100 text-jacarta-100 text-sm">
                    You can check if a word is available for purchase by using the search bar.
                    Simply type the word into the search bar and press enter to see if it is
                    available. This feature allows you to quickly find out if the word you are
                    interested in is free for acquisition.{" "}
                  </span>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <Form offerId={offerId} onUrlChange={handleUrlChange} />
              </div>
              {urlFromChild && (
                <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
                  <article className="relative">
                    <div className="dark:bg-secondaryBlack dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-100">
                      {isWordAlreadyTaken ? (
                        <span className="text-red  ">This word is already taken ❌</span>
                      ) : (
                        <span className="text-green ">This word is available 🎉</span>
                      )}
                      <figure className="mt-2">
                        <Link href={urlFromChild ?? "#"}>
                          {imageUrl && (
                            <Image
                              src={imageUrl ?? ""}
                              alt="logo"
                              height={230}
                              width={230}
                              className="rounded-[0.625rem] w-full lg:h-[230px] object-contain"
                              loading="lazy"
                            />
                          )}
                        </Link>
                      </figure>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <Tippy content={<span className="p-2">{name}</span>}>
                          <Link
                            href={urlFromChild ?? "#"}
                            className="overflow-hidden text-ellipsis whitespace-nowrap min-w-[120px]"
                          >
                            <span className="font-display  text-jacarta-900 hover:text-primaryPurple text-base dark:text-white ">
                              {name}
                            </span>
                          </Link>
                        </Tippy>

                        <Tippy content={<span className="p-2">{tokenData}</span>}>
                          <div className="dark:border-jacarta-800 border-jacarta-100 max-w-[100px] overflow-hidden text-ellipsis flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                            <span className="text-green text-sm font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
                              {" "}
                              {tokenData}
                            </span>
                          </div>
                        </Tippy>
                      </div>
                    </div>
                  </article>
                </div>
              )}
            </Accordion.Content>
          </div>
        )}
      </Accordion.Item>

      <Accordion.Item value="tokens">
        <div className="container">
          <Accordion.Header className="w-full">
            <Accordion.Trigger
              className={`${accordionActiveTab.includes("tokens") && "bg-primaryPurple"} w-full flex items-center justify-center gap-4 mb-6 border border-primaryPurple hover:bg-primaryPurple cursor-pointer p-2 rounded-lg`}
            >
              <h2 className="text-jacarta-900 font-bold font-display text-center text-3xl dark:text-white ">
                Tokens
              </h2>
              <ChevronDownIcon
                className={`w-6 h-6 duration-300 ${accordionActiveTab.includes("tokens") && "transform rotate-180"}`}
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content>
            <div className="dark:bg-secondaryBlack mb-6 dark:border-jacarta-800 border-jacarta-100 rounded-2lg border bg-white p-4">
              <div className="sm:flex justify-center items-center sm:flex-wrap">
                <span className="dark:text-jacarta-100 text-jacarta-100 text-sm text-center">
                  This section allows you to see every tokens associated with the offer.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {offerData?.nftContract?.tokens?.map((token, index) => {
                const currencyDecimals =
                  token?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
                    ?.listingType === "Auction" ||
                  token?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
                    ?.listingType === "Direct"
                    ? Number(
                        token?.marketplaceListings?.sort((a, b) => Number(b.id) - Number(a.id))[0]
                          ?.currencyDecimals
                      )
                    : Number(token?.nftContract?.prices[0]?.currencyDecimals);

                const finalToken = {
                  ...token,
                  chainConfig: offerData?.chainConfig,
                  currencyDecimals
                };

                return (
                  <TokenCard
                    key={index}
                    item={finalToken}
                    isToken={true}
                    url={`/${chainId}/offer/${offerId}/${finalToken?.tokenId}`}
                    currencyDecimals={currencyDecimals}
                  />
                );
              })}
            </div>
          </Accordion.Content>
        </div>
      </Accordion.Item>

      <Accordion.Item value="adValidation">
        <div className="container">
          {features.canSeeSubmittedAds && (
            <>
              <Accordion.Header className="w-full">
                <Accordion.Trigger
                  className={`${accordionActiveTab.includes("adValidation") && "bg-primaryPurple"} w-full flex items-center justify-center gap-4 mb-6 border border-primaryPurple hover:bg-primaryPurple cursor-pointer p-2 rounded-lg`}
                >
                  {isOwner && sponsorHasAtLeastOneRejectedProposalAndNoPending && (
                    <ResponsiveTooltip text="You have at least one rejected proposal and no pending proposal.">
                      <ExclamationCircleIcon className="w-6 h-6 text-red" />
                    </ResponsiveTooltip>
                  )}
                  {isMedia && mediaShouldValidateAnAd && (
                    <ResponsiveTooltip text="You have at least one ad to validate or to refuse.">
                      <ExclamationCircleIcon className="w-6 h-6 text-red" />
                    </ResponsiveTooltip>
                  )}
                  <h2 className="text-jacarta-900 font-bold font-display text-center text-3xl dark:text-white ">
                    Ad Validation
                  </h2>
                  <ChevronDownIcon
                    className={`w-6 h-6 duration-300 ${accordionActiveTab.includes("adValidation") && "transform rotate-180"}`}
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <AdValidation
                  setSuccessFullRefuseModal={setSuccessFullRefuseModal}
                  setSelectedItems={setSelectedItems}
                  selectedItems={selectedItems}
                  offer={offerData}
                  offerId={offerId as string}
                  isOwner={isOwner}
                  handleSubmit={handleSubmit}
                  successFullRefuseModal={successFullRefuseModal}
                  setRefusedValidatedAdModal={setRefusedValidatedAdModal}
                  refusedValidatedAdModal={refusedValidatedAdModal}
                  sponsorHasAtLeastOneRejectedProposalAndNoPending={
                    sponsorHasAtLeastOneRejectedProposalAndNoPending
                  }
                  setSponsorHasAtLeastOneRejectedProposalAndNoPending={
                    setSponsorHasAtLeastOneRejectedProposalAndNoPending
                  }
                  mediaShouldValidateAnAd={mediaShouldValidateAnAd}
                  isMedia={isMedia}
                  itemTokenId={offerData?.nftContract?.id}
                  pendingProposalData={pendingProposalData}
                  setPendingProposalData={setPendingProposalData}
                />
              </Accordion.Content>
            </>
          )}
        </div>
      </Accordion.Item>

      <Accordion.Item value="offerManagement">
        {isOwner && (
          <div className="container">
            <Accordion.Header className="w-full">
              <Accordion.Trigger
                className={`${accordionActiveTab.includes("offerManagement") && "bg-primaryPurple"} w-full flex items-center justify-center gap-4 mb-6 border border-primaryPurple hover:bg-primaryPurple cursor-pointer p-2 rounded-lg`}
              >
                <h2 className="text-jacarta-900 font-bold font-display text-center text-3xl dark:text-white ">
                  Offer Management
                </h2>
                <ChevronDownIcon
                  className={`w-6 h-6 duration-300 ${accordionActiveTab.includes("offerManagement") && "transform rotate-180"}`}
                />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="mb-8">
              <Tabs className="tabs">
                <TabList className="nav nav-tabs hide-scrollbar mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-800 md:justify-center">
                  <Tab
                    className="nav-item"
                    onClick={() => setOfferManagementActiveTab("integration")}
                  >
                    <button
                      className={
                        offerManagementActiveTab === "integration"
                          ? "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-4 dark:hover:text-white active font-semibold"
                          : "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-4 dark:hover:text-white font-semibold"
                      }
                    >
                      <span className="mr-2">
                        <BlocksIcon className="w-4 h-4" />
                      </span>
                      Integration
                    </button>
                  </Tab>
                  <Tab
                    className="nav-item"
                    key={id}
                    onClick={() => setOfferManagementActiveTab("updateOffer")}
                  >
                    <button
                      className={
                        offerManagementActiveTab === "updateOffer"
                          ? "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-4 dark:hover:text-white active font-semibold"
                          : "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-4 dark:hover:text-white font-semibold"
                      }
                    >
                      <span className="mr-2">
                        <RefreshCwIcon className="w-4 h-4" />
                      </span>
                      Update Offer
                    </button>
                  </Tab>
                  <Tab
                    className="nav-item"
                    onClick={() => setOfferManagementActiveTab("changeMintPrice")}
                  >
                    <button
                      className={
                        offerManagementActiveTab === "changeMintPrice"
                          ? "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-4 dark:hover:text-white active font-semibold"
                          : "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-4 dark:hover:text-white font-semibold"
                      }
                    >
                      <span className="mr-2">
                        <BadgePercentIcon className="w-4 h-4" />
                      </span>
                      Change Initial Price
                    </button>
                  </Tab>
                </TabList>

                <TabPanel>
                  <Integration
                    chainId={chainId}
                    offerId={offerId}
                    offerTokens={offerData?.nftContract?.tokens}
                  />
                </TabPanel>
                <TabPanel>
                  <UpdateOffer offer={offerData} />
                </TabPanel>
                <TabPanel>
                  <ChangeMintPrice offer={offerData} />
                </TabPanel>
              </Tabs>
            </Accordion.Content>
          </div>
        )}
      </Accordion.Item>

      <Accordion.Item value="details">
        <div className="container">
          <Accordion.Header className="w-full">
            <Accordion.Trigger
              className={`${accordionActiveTab.includes("details") && "bg-primaryPurple"} w-full flex items-center justify-center gap-4 mb-6 border border-primaryPurple hover:bg-primaryPurple cursor-pointer p-2 rounded-lg`}
            >
              <h2 className="text-jacarta-900 font-bold font-display text-center text-3xl dark:text-white ">
                Details
              </h2>
              <ChevronDownIcon
                className={`w-6 h-6 duration-300 ${accordionActiveTab.includes("details") && "transform rotate-180"}`}
              />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="mb-8">
            <Details
              contractAddress={offerData?.nftContract?.id}
              initialCreator={offerData?.initialCreator}
              isToken={false}
              offerData={offerData}
              chainId={parseFloat(chainId)}
            />
          </Accordion.Content>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default Offer;
