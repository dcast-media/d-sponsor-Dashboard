import React from "react";
import Link from "next/link";

import { useChainContext } from "@/hooks/useChainContext";
import config from "@/config/config";
import displayOrCheckKnownAddress from "@/utils/addresses/displayOrCheckKnownAddress";
import { Address } from "thirdweb";

const Details = ({
  chainId,
  contractAddress,
  isUserOwner,
  initialCreator,
  isToken = true,
  status,
  listerAddress,
  offerData
}: {
  chainId: number;
  contractAddress: Address;
  isUserOwner?: Address;
  initialCreator: Address;
  isToken?: boolean;
  status?: string;
  listerAddress?: Address;
  offerData: any;
}) => {
  const { currentChainObject } = useChainContext();

  const chainName = config[chainId]?.chainName;
  const chainExplorer = currentChainObject?.explorerBaseURL;

  return (
    <>
      <div className="scrollbar-custom overflow-x-auto rounded-lg dark:bg-secondaryBlack">
        {/* <!-- Details --> */}
        <div className="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">
          <div className=" dark:bg-secondaryBlack rounded-t-2lg rounded-b-2lg rounded-tl-none bg-white p-6 md:p-10">
            <div className="mb-2 flex items-center">
              <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Contract Address:</span>
              <Link
                href={`${chainExplorer}/address/${contractAddress}`}
                target="_blank"
                className="text-primaryPink hover:text-jacarta-100"
              >
                {contractAddress}
              </Link>
            </div>
            <div className="mb-2 flex items-center">
              <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Contract Creator:</span>
              <Link
                href={`/profile/${initialCreator}`}
                target="_blank"
                className="text-primaryPink hover:text-jacarta-100"
              >
                {displayOrCheckKnownAddress(initialCreator)}
              </Link>
            </div>

            {isToken && (
              <div className="mb-2 flex items-center">
                <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Owner:</span>
                {isUserOwner || (listerAddress && status) ? (
                  <div>
                    <Link
                      href={`/profile/${status === "CREATED" ? listerAddress : isUserOwner}`}
                      className="text-primaryPink hover:text-jacarta-100 mr-2"
                    >
                      {status === "CREATED" ? listerAddress : isUserOwner}
                    </Link>
                  </div>
                ) : (
                  "No owner"
                )}
              </div>
            )}
            <div className="flex flex-col gap-2 justify-center">
              {offerData?.metadata?.offer?.valid_from && offerData?.metadata?.offer?.valid_to && (
                <div className="flex items-center">
                  <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Validity Period:</span>
                  <span className="text-jacarta-900 dark:text-white">
                    {new Date(offerData?.metadata?.offer?.valid_from).toLocaleDateString() ?? ""} to{" "}
                    {new Date(offerData?.metadata?.offer?.valid_to).toLocaleDateString() ?? ""}
                  </span>
                </div>
              )}
              {offerData?.nftContract?.royalty?.bps && (
                <div className="flex items-center">
                  <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Royalties:</span>
                  <span className="text-jacarta-900 dark:text-white">
                    {Number(offerData?.nftContract?.royalty?.bps) / 100}%
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Token Standard:</span>
                <span className="text-jacarta-900 dark:text-white">ERC-721</span>
              </div>
              <div className="flex items-center">
                <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">Blockchain:</span>
                <span className="text-jacarta-900 dark:text-white">{chainName}</span>
              </div>
              {offerData?.metadata?.offer?.terms && (
                <div className="flex items-center">
                  <span className="dark:text-jacarta-100 mr-2 min-w-[9rem]">
                    Terms and conditions:
                  </span>
                  <Link
                    href={offerData?.metadata?.offer?.terms ?? "#"}
                    className="text-primaryPink hover:text-jacarta-100"
                    target="_blank"
                  >
                    <span>{offerData?.metadata?.offer?.terms ?? ""}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
