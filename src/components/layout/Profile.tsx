import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "tippy.js/dist/tippy.css"; // optional
import Meta from "@/components/Meta";
import Overview from "@/components/features/profile/Overview";
import Referrals from "@/components/features/profile/Referrals";
import Tabs from "@/components/features/profile/Tabs";
import { useAddress } from "@thirdweb-dev/react";
import { fetchAllOffersProfile } from "@/utils/graphql/fetchAllOffersProfile";
import { fetchAllTokensProfile } from "@/utils/graphql/fetchAllTokensProfile";
import { useChainContext } from "@/hooks/useChainContext";
import config from "@/config/config";
import { getAddress } from "ethers/lib/utils";
import { features } from "@/data/features";
import { Address } from "thirdweb";

const metadata = {
  title: "Profile || SiBorg Ads - The Web3 Monetization Solution",
  keyword:
    "audience engagement, web3, creator economic, NFT, creator monetization, creator economy, creator token, creator coin, creator tokenization, creator economy",
  desc: "Profile your ad spaces on SiBorg Ads."
};

const Profile = () => {
  const router = useRouter();
  const address = useAddress();
  const [createdData, setCreatedData] = useState<any>(null);
  const [mappedOwnedAdProposals, setMappedOwnedAdProposals] = useState<any[]>([]);
  const [listedAuctionToken, setListedAuctionToken] = useState(null);
  const [tokenAuctionBids, setTokenAuctionBids] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { currentChainObject } = useChainContext();
  const [isPendingAdsOnOffer, setIsPendingAdsOnOffer] = useState(false);
  const [initialWallet, setInitialWallet] = useState<Address | null>(null);
  const [, setMount] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [createdOffers, setCreatedOffers] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [lastActivities, setLastActivities] = useState(null);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [marketplaceBids, setMarketplaceBids] = useState(false);
  const [, setIsLoadingOwnedTokens] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userAddress = router.query.address as Address;
  const chainId = currentChainObject?.chainId;
  const chainConfig = config[chainId as number];

  useEffect(() => {
    if (address && userAddress && getAddress(address) === getAddress(userAddress)) {
      setIsUserConnected(true);
    } else {
      setIsUserConnected(false);
    }
  }, [address, userAddress]);

  useEffect(() => {
    if (createdOffers) {
      // we need to check the number of pending offers on the user's offer
      // but if there is already an accepted offer, we don't count it
      const pendingOffers = createdOffers?.filter(
        (offer) =>
          offer?.allProposals?.filter((proposal) => proposal?.status === "CURRENT_PENDING").length >
          0
      );

      if (pendingOffers.length > 0) {
        setIsPendingAdsOnOffer(true);
      } else {
        setIsPendingAdsOnOffer(false);
      }
    }
  }, [createdOffers]);

  useEffect(() => {
    if (address && !initialWallet) {
      setInitialWallet(address as Address);
    }
  }, [address, initialWallet]);

  useEffect(() => {
    if (address && initialWallet && address !== initialWallet) {
      setInitialWallet(address as Address);
      router.push(`/profile/${address}`);
    }
  }, [address, initialWallet, router]);

  const fetchDataRef = React.useRef(false);
  const fetchCreatedDataRef = React.useRef(false);
  const fetchOwnedAdProposalsRef = React.useRef(false);
  const fetchAllDataRef = React.useRef(false);

  const fetchDataByUserAddress = React.useCallback(
    async (fetchFunction) => {
      const dataArray: any[] = [];

      for (const [chainId] of Object.entries(config)) {
        const data = await fetchFunction(userAddress, chainId);
        dataArray?.push(...data);
      }
      return dataArray;
    },
    [userAddress]
  );

  const fetchCreatedData = React.useCallback(async () => {
    if (fetchCreatedDataRef.current) {
      return;
    }
    fetchCreatedDataRef.current = true;

    try {
      setIsLoadingBids(true);
      const offersByUserAddressArray = await fetchDataByUserAddress(fetchAllOffersProfile);

      let allUserBids;
      offersByUserAddressArray?.forEach((offer) => {
        offer?.nftContract?.tokens?.forEach((token) =>
          token?.marketplaceListings?.forEach((listing) =>
            listing?.bids?.forEach((bid) => {
              if (userAddress && bid?.bidder?.toLowerCase() === userAddress?.toLowerCase()) {
                allUserBids = allUserBids ? [...allUserBids, bid] : [bid];
              }
            })
          )
        );
      });

      setMarketplaceBids(allUserBids);
      setIsLoadingBids(false);

      const createdOffers = offersByUserAddressArray?.filter(
        (offer) =>
          offer?.admins?.includes(userAddress?.toLowerCase()) ||
          offer?.initialCreator?.toLowerCase() === userAddress?.toLowerCase()
      );

      setCreatedOffers(createdOffers);
      setCreatedData(createdOffers);

      let allLatestListings;
      offersByUserAddressArray?.forEach((element) => {
        element?.nftContract?.tokens?.forEach((token) => {
          const lastListing = token?.marketplaceListings?.sort(
            (a, b) => Number(b?.id) - Number(a?.id)
          )[0];

          const filterCondition =
            lastListing?.status === "CREATED" &&
            lastListing?.quantity > 0 &&
            lastListing?.lister?.toLowerCase() === userAddress?.toLowerCase();

          if (lastListing && filterCondition) {
            const listingWithChainConfig = {
              ...lastListing,
              chainConfig: element.chainConfig
            };

            allLatestListings = allLatestListings
              ? [...allLatestListings, listingWithChainConfig]
              : [listingWithChainConfig];
          }
        });
      });

      const mappedListedToken = allLatestListings
        ?.filter((element) => element?.listingType === "Auction")
        ?.map((element) => ({
          ...element,
          ...element?.token,
          marketplaceListings: [element],
          listingStatus: handleListingsStatusType(element?.status),
          chainConfig: element?.chainConfig,
          tokenData: element?.token.mint.tokenData,
          startTime: element?.startTime,
          endTime: element?.endTime,
          offerId: element?.token?.nftContract?.adOffers[0]?.id
        }));

      setListedAuctionToken(mappedListedToken);

      // get all tokens with a bid from the user
      let auctionBidsTokensArray;
      offersByUserAddressArray?.forEach((element) => {
        element?.nftContract?.tokens?.forEach((tokenElement) => {
          if (tokenElement?.marketplaceListings?.length > 0) {
            const listings = tokenElement?.marketplaceListings?.sort(
              (a, b) => Number(b.id) - Number(a.id)
            );
            const lastLiveAuctionListing = listings?.find(
              (listing) => listing?.status === "CREATED" && listing?.listingType === "Auction"
            );

            const lastUserBid = lastLiveAuctionListing?.bids?.find(
              (bid) => bid?.bidder === userAddress?.toLowerCase()
            );

            if (lastUserBid) {
              const token = {
                ...element,
                marketplaceListings: [tokenElement?.lastLiveAuction],
                status: handleBidsStatusType(lastUserBid?.status),
                listingStatus: handleListingsStatusType(tokenElement?.lastLiveAuction?.status),
                metadata: lastLiveAuctionListing?.token?.metadata,
                tokenData: lastLiveAuctionListing?.token?.mint?.tokenData,
                offerId: lastLiveAuctionListing?.token?.nftContract?.adOffers[0]?.id,
                tokenId: lastLiveAuctionListing?.token?.tokenId,
                endTime: lastLiveAuctionListing?.endTime
              };

              auctionBidsTokensArray = auctionBidsTokensArray
                ? [...auctionBidsTokensArray, token]
                : [token];
            }
          }
        });
      });

      setTokenAuctionBids(auctionBidsTokensArray);
    } catch (error) {
      console.error("Error fetching created data:", error);
    } finally {
      fetchCreatedDataRef.current = false;
    }
  }, [fetchDataByUserAddress, userAddress]);

  const fetchProfileData = React.useCallback(async () => {
    if (fetchDataRef.current) {
      return;
    }
    fetchDataRef.current = true;

    setIsLoadingTransactions(true);

    try {
      const data = await fetch(
        `https://relayer.dsponsor.com/api/${chainId}/activity?userAddress=${userAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((err) => console.error(err));

      let lastActivities = features?.canFilterTransactionsWithWETH
        ? data?.lastActivities.filter(
            (activity) => activity.symbol === "WETH" && activity.points > 0
          )
        : data?.lastActivities.filter((activity) => activity.points > 0);

      setLastActivities(lastActivities);

      setUserData(data);
      setMount(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingTransactions(false);
      fetchDataRef.current = false;
    }
  }, [chainId, userAddress]);

  const fetchOwnedAdProposals = React.useCallback(async () => {
    if (fetchOwnedAdProposalsRef.current) {
      return;
    }
    fetchOwnedAdProposalsRef.current = true;

    setIsLoadingOwnedTokens(true);

    try {
      const ownedAdProposalsArray = await fetchDataByUserAddress(fetchAllTokensProfile);

      const mappedOwnedAdProposals = ownedAdProposalsArray.flatMap((element) =>
        element.nftContract.tokens.map((token) => ({
          ...token,
          ...(token.mint.tokenData ? { tokenData: token.mint.tokenData } : {}),
          chainConfig: element.chainConfig,
          adParameters: element.adParameters,
          id: `${element.id}-${token.tokenId}`,
          offerId: element.id,
          disable: element.disable,
          endTime: token?.marketplaceListings?.length > 0 && token?.marketplaceListings[0]?.endTime
        }))
      );

      setMappedOwnedAdProposals(mappedOwnedAdProposals);
    } catch (error) {
      console.error("Error fetching owned ad proposals:", error);
    } finally {
      setIsLoadingOwnedTokens(false);
      fetchOwnedAdProposalsRef.current = false;
    }
  }, [fetchDataByUserAddress]);

  useEffect(() => {
    if (userAddress && chainId) {
      const fetchAllManageData = async () => {
        if (fetchAllDataRef.current) {
          return;
        }
        fetchAllDataRef.current = true;

        setIsLoading(true);

        if (chainId && userAddress) {
          try {
            await fetchProfileData();
            await fetchCreatedData();
            await fetchOwnedAdProposals();
          } catch (error) {
            console.error("Error fetching manage data:", error);
          } finally {
            fetchAllDataRef.current = false;
            setIsLoading(false);
          }
        }
      };

      if (address && userAddress && getAddress(address) === getAddress(userAddress)) {
        setIsOwner(true);
      }

      fetchAllManageData();
    }
  }, [
    userAddress,
    address,
    chainId,
    chainConfig,
    fetchProfileData,
    fetchCreatedData,
    fetchOwnedAdProposals
  ]);

  const handleListingsStatusType = (status) => {
    switch (status) {
      case "CREATED":
        return "Active";
      case "COMPLETED":
        return "Finished";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "Active";
    }
  };

  const handleBidsStatusType = (status) => {
    switch (status) {
      case "CREATED":
        return "HIGHEST BIDDER";
      case "CONFIRMED":
        return "AUCTION WON";
      case "CANCELLED":
        return "OUTBID";
      default:
        return "HIGHEST BIDDER";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  return (
    <>
      <Meta {...metadata} />

      <div className=" " key="5">
        <div className="max-w-5xl mx-auto" style={{ marginTop: "10rem" }}>
          <div className="flex flex-col gap-16 mx-4">
            <Overview
              userData={userData}
              ownedTokens={mappedOwnedAdProposals}
              isLoading={isLoading}
              manageAddress={userAddress}
            />

            {isUserConnected && <Referrals userData={userData} userAddr={address} />}

            <Tabs
              mappedownedAdProposals={mappedOwnedAdProposals}
              createdData={createdData}
              listedAuctionToken={listedAuctionToken}
              tokenAuctionBids={tokenAuctionBids}
              isPendingAdsOnOffer={isPendingAdsOnOffer}
              isOwner={isOwner}
              manageAddress={userAddress}
              offers={createdOffers}
              isLoadingTransactions={isLoadingTransactions}
              lastActivities={lastActivities}
              isLoadingBids={isLoadingBids}
              marketplaceBids={marketplaceBids}
              isLoading={isLoading}
              fetchCreatedData={fetchCreatedData}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
