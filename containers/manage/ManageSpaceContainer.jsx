'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import User_items from "../../components/user/User_items";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAddress } from "@thirdweb-dev/react";

import { fetchDataFromIPFS } from "../../data/services/ipfsService";
import fetchAdsOffersForUser from "../../providers/ChainProvider/methods/fetchAdsOffersForUser";
import fetchAllTokensOfferForUser from "../../providers/ChainProvider/methods/fetchAllTokensOfferForUser";

const ManageSpaceContainer = ({address: userAddress}) => {
  const router = useRouter();
  const address = useAddress();
  const [createdData, setCreatedData] = useState(null);
  const [mappedownedAdProposals, setMappedownedAdProposals] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isPendinAdsOnOffer, setIsPendinAdsOnOffer] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (userAddress) {
      const fetchAdsOffers = async () => {
        const offers = await fetchAdsOffersForUser(userAddress);
        // const ownedAdProposals = await GetAllTokenbyOfferForAUser(userAddress);
        const ownedAdProposals = await fetchAllTokensOfferForUser(userAddress);
        console.log({ownedAdProposals});
        const mappedOffers = [];
        for (const element of offers) {
          let isPending = false;
          const destructuredIPFSResult = await fetchDataFromIPFS(element.metadataURL);
          const pendingProposals = element.nftContract.tokens;
          for (const isPendingAds of pendingProposals) {
            if (isPendingAds.currentProposals.length > 0 && isPendingAds.currentProposals[0].pendingProposal !== null) {
              isPending = true;
              setIsPendinAdsOnOffer(true);
              break;
            }
          }
          const combinedData = {
            isPending: isPending,
            ...element,
            metadata : destructuredIPFSResult,
          };
          mappedOffers.push(combinedData);
        }
        console.log(mappedOffers);
        const mappedownedAdProposals = [];

        setCreatedData(mappedOffers);


        console.log({ownedAdProposals});

        for (const element of ownedAdProposals) {
          if (!element.nftContract?.adOffers[0]?.metadataURL) {
            continue;
          }

          const combinedData = {
            ...element,
            ...(element?.mint?.tokenData ? { tokenData: element.mint.tokenData } : {}),
          };
          mappedownedAdProposals.push(combinedData);
        }
        console.log(mappedownedAdProposals);
        setMappedownedAdProposals(mappedownedAdProposals);
      };
      if(address === userAddress) setIsOwner(true);
      fetchAdsOffers();
    }
  }, [userAddress, router, address]);
  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  return (
    <>
      <div className=" " key="5">
        {/* <!-- Banner --> */}
        <div className="relative sm:h-[250px] h-[150px]">
          <Image fill={true} src="/images/gradient_creative.jpg" alt="banner" className="w-full h-full object-cover" />
        </div>
        {/* <!-- end banner --> */}
        <section className="dark:bg-jacarta-800 bg-light-base relative ">
          {/* <!-- Avatar --> */}
          <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <div className="container">
              <div className="text-center">
                <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100  inline-flex items-center justify-center rounded-full border bg-white py-1.5 px-4">
                  <Tippy hideOnClick={false} content={copied ? <span>copied</span> : <span>copy</span>}>
                    <button className="js-copy-clipboard dark:text-jacarta-200 max-w-[150px] select-none overflow-hidden text-ellipsis whitespace-nowrap">
                      <CopyToClipboard text="userId" onCopy={() => setCopied(true)}>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{userAddress}</span>
                      </CopyToClipboard>
                    </button>
                  </Tippy>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- end profile --> */}
        <User_items createdData={createdData} mappedownedAdProposals={mappedownedAdProposals} isPendinAdsOnOffer={isPendinAdsOnOffer} isOwner={isOwner} />
      </div>
    </>
  );
};

export default ManageSpaceContainer;
