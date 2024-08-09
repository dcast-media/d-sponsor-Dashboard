import formatAndRoundPrice from "@/utils/prices/formatAndRound";
import Link from "next/link";
import ModalHelper from "@/components/ui/modals/Helper";
import { addLineBreaks } from "@/utils/misc/addLineBreaks";
import { formatTokenId } from "@/utils/tokens/formatTokenId";
import React, { useState } from "react";
import { formatUnits } from "ethers/lib/utils";

export default function TokenDetails({
  chainId,
  offerId,
  marketplaceListings,
  latestListing,
  token,
  tokenId,
  royalties,
  tokenName,
  tokenDescription,
  currencySymbol,
  creatorAmount,
  protocolFeeAmount,
  totalAmount,
  listerAmount,
  royaltiesAmount,
  tokenPriceBN,
  tokenStatus,
  isMintDisabled,
  currencyDecimals
}) {
  const [showEntireDescription, setShowEntireDescription] = useState(false);

  const modalHelper = {
    title: "Protocol Fees",
    body: (
      <div className="flex flex-col gap-8">
        <span className="text-jacarta-100 text-sm">
          The protocol fees (4%) are used to maintain the platform and the services provided. The
          fees are calculated based on the price of the ad space and are automatically deducted from
          the total amount paid by the buyer.
        </span>

        {token?.mint === null && (
          <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2 list-disc text-sm" style={{ listStyleType: "disc" }}>
              <li>
                <span className="text-white">
                  Amount sent to the creator: {formatAndRoundPrice(creatorAmount)} {currencySymbol}
                </span>
              </li>
              <li>
                <span className="text-white">
                  Protocol fees: {formatAndRoundPrice(protocolFeeAmount)} {currencySymbol}
                </span>
              </li>
              <li>
                <span className="text-white">
                  Total: {formatAndRoundPrice(totalAmount)} {currencySymbol}
                </span>
              </li>
            </ul>
          </div>
        )}

        {token?.mint !== null && (
          <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2 list-disc text-sm" style={{ listStyleType: "disc" }}>
              <li>
                <span className="text-white">
                  Amount sent to the lister: {formatAndRoundPrice(listerAmount)} {currencySymbol}
                </span>
              </li>
              <li>
                <span className="text-white">
                  Royalties sent to the creator: {formatAndRoundPrice(royaltiesAmount)}{" "}
                  {currencySymbol}
                </span>
              </li>
              <li>
                <span className="text-white">
                  Protocol fees: {formatAndRoundPrice(protocolFeeAmount)} {currencySymbol}
                </span>
              </li>
              <li>
                <span className="text-white">
                  Total: {formatAndRoundPrice(totalAmount)} {currencySymbol}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  };

  const showPrice =
    (tokenStatus !== "MINTED" &&
      (latestListing?.status === "CREATED" || marketplaceListings?.length <= 0)) ||
    (!isMintDisabled && tokenStatus === "MINTABLE");

  const validFrom = token?.metadata?.valid_from;
  const validTo = token?.metadata?.valid_to;

  return (
    <React.Fragment>
      <Link href={`/${chainId}/offer/${offerId}`} className="flex">
        <h2 className="font-display text-jacarta-900 mb-4 dark:hover:text-primaryPurple text-3xl font-semibold dark:text-white">
          {tokenName}
        </h2>
      </Link>

      <div className="mb-8 flex items-center gap-4 whitespace-nowrap flex-wrap">
        {showPrice && (
          <div className="flex items-center">
            <span className="text-green text-sm font-medium tracking-tight mr-2">
              {!!tokenPriceBN && tokenPriceBN > 0
                ? `${formatAndRoundPrice(formatUnits(tokenPriceBN, currencyDecimals)) ?? 0} ${currencySymbol ?? ""}`
                : "Free"}
            </span>

            <ModalHelper {...modalHelper} size="small" />
          </div>
        )}

        <span className="dark:text-jacarta-100 text-jacarta-100 text-sm">
          Space #{" "}
          <strong className="dark:text-white">
            {tokenId?.toString() ?? formatTokenId(tokenId?.toString())}
          </strong>{" "}
        </span>

        <span className="text-jacarta-100 block text-sm ">
          Creator <strong className="dark:text-white">{royalties}% royalties</strong>
        </span>

        {validFrom && (
          <span className="text-jacarta-100 text-sm flex flex-wrap gap-1">
            Ownership period:{" "}
            <strong className="dark:text-white">
              {(() => {
                const date = new Date(validFrom);
                return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} at ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
              })()}
            </strong>{" "}
            to{" "}
            <strong className="dark:text-white">
              {validTo && new Date(validTo).toLocaleString()}
            </strong>
          </span>
        )}
      </div>

      {showEntireDescription ? (
        <p className="dark:text-jacarta-100 mb-10">
          {addLineBreaks(tokenDescription)}{" "}
          {tokenDescription?.length > 1000 && (
            <button onClick={() => setShowEntireDescription(false)} className="text-primaryPurple">
              Show less
            </button>
          )}
        </p>
      ) : (
        <div>
          <p className="dark:text-jacarta-100 mb-10">
            {tokenDescription?.length > 1000
              ? addLineBreaks(tokenDescription?.slice(0, 1000) + "...")
              : addLineBreaks(tokenDescription)}{" "}
            {tokenDescription?.length > 1000 && (
              <button onClick={() => setShowEntireDescription(true)} className="text-primaryPurple">
                Show more
              </button>
            )}
          </p>
        </div>
      )}
    </React.Fragment>
  );
}
