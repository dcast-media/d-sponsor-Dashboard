import React from "react";
import Image from "next/image";
import Link from "next/link";
import "tippy.js/dist/tippy.css";
import {useChainContext} from "../../contexts/hooks/useChainContext";
import {useAppContext} from "../../contexts/hooks/useAppContext";

const Review_adProposal_items = () => {
  const {chainName} = useChainContext();
  const { sortedTrendingCategoryItemData } = useAppContext();
  const offerAddress = "0x17c923c242c3217bd27e8f402a3608c2c8689618c12723d585fa19d7657ff06a0c000000";

  return (
    <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
      {sortedTrendingCategoryItemData.map((item) => {
        const { id, image, title, price, maxToken, tokenId, ownerName, offerId, isAlreadyMinted } = item;
        const itemLink = image.split("/").slice(-1).toString().replace(".jpg", "").replace(".gif", "");
        return (
          <article key={id}>
            <div className={`dark:bg-jacarta-700 ${isAlreadyMinted ? "dark:border-jacarta-700" : "border-green"}  rounded-2.5xl block border-2 bg-white p-[1.1875rem] transition-shadow hover:shadow-lg`}>
              <figure className="relative">
                <Link href={`/${chainName}/offer/${offerAddress}`}>
                  <Image width={230} height={230} src={image} alt="item 5" className="w-full h-[230px] rounded-[0.625rem] object-cover" />
                </Link>
              </figure>
              <div className="mt-7 flex items-center justify-between">
                <Link href={`/${chainName}/offer/${offerAddress}`}>
                  <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">{title}</span>
                </Link>
              </div>
              <div className="mt-2 text-sm flex justify-between">
                <span className="dark:text-jacarta-200 text-jacarta-700 mr-1">{price}</span>
                <span className={`${isAlreadyMinted ? "dark:text-jacarta-300" : "dark:text-green"}`}>
                  {tokenId}/{maxToken}
                </span>
              </div>

              <div className="mt-8 flex items-center justify-between">
                {ownerName ? (
                  <p className="dark:text-white font-display text-sm font-semibold">{ownerName}</p>
                ) : (
                  <Link href={`/${chainName}/offer/${offerAddress}`} className="text-accent font-display text-sm font-semibold">
                    Buy now
                  </Link>
                )}

                <Link href={`/${chainName}/offer/${offerAddress}`} className="group flex items-center">
                  <svg className="icon icon-history group-hover:fill-accent dark:fill-jacarta-200 fill-jacarta-500 mr-1 mb-[3px] h-4 w-4">
                    <use xlinkHref="/icons.svg#icon-history"></use>
                  </svg>
                  <span className="group-hover:text-accent font-display dark:text-jacarta-200 text-sm font-semibold">View History</span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Review_adProposal_items;
