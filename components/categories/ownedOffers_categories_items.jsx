'use client';
import React, { useEffect, useState } from "react";
// import { tranding_category_filter } from "../../data/categories_data";
// import CategoryItem from "./categoryItem";
// import { trendingCategoryData } from "../../data/categories_data";
// import Tippy from "@tippyjs/react";
// import Recently_added_dropdown from "../dropdown/recently_added_dropdown";
// import { useSelector, useDispatch } from "react-redux";
// import { updateTrendingCategoryItemData } from "../../redux/counterSlice";
// import Review_adProposal_data from "./review_adProposal_items";
import OfferItem from "../cards/offerItem";
import Link from "next/link";
import Image from "next/image";
import {useChainContext} from "../../contexts/hooks/useChainContext";

const OwnedOffers_categories_items = ({ data, isPendinAdsOnOffer, isOwner }) => {
  const {chainName} = useChainContext();

  // const [itemdata, setItemdata] = useState(trendingCategoryData);
  // const dispatch = useDispatch();
  // const { trendingCategorySorText } = useSelector((state) => state.counter);
  // const [filterVal, setFilterVal] = useState(0);

  // const handleFilter = (category) => {
  //   if (category !== "all") {
  //     setItemdata(trendingCategoryData.filter((item) => item.category === category));
  //   } else {
  //     setItemdata(trendingCategoryData);
  //   }
  // };
  //
  // const sortText = [
  //   {
  //     id: 1,
  //     text: "Recently Added",
  //   },
  //   {
  //     id: 2,
  //     text: "Price: Low to High",
  //   },
  //   {
  //     id: 3,
  //     text: "Price: high to low",
  //   },
  //   {
  //     id: 4,
  //     text: "Auction Ending Soon",
  //   },
  // ];

  // useEffect(() => {
  //   dispatch(updateTrendingCategoryItemData(itemdata.slice(0, 8)));
  // }, [itemdata, dispatch]);

  if (!data) {
    return (
      <div className="flex w-full justify-center">
        <Image src="/images/loading-bullet.svg" alt="icon" width={60} height={60} />
      </div>
    );
  }
  return (
    <>
      {isPendinAdsOnOffer && isOwner && (
        <div className="dark:bg-jacarta-700 dark:text-jacarta-300 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-3 flex gap-4 justify-center items-center mb-6">
          <span className="bg-red rounded-2xl dark:text-white  px-2">!</span>
          <span> You have 1 or more ads proposals to check on your offer </span>
        </div>
      )}

      {/* <!-- Grid --> */}
      {data.length > 0 ? (
        <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
          {data?.map((item, index) => {
            return <OfferItem item={item} key={index} url={`/${chainName}/offer/${item.id}`} isOwner={isOwner} />;
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <span>You have no offers yet...</span>
          <Link href={`/${chainName}/offer/create`} className="bg-accent shadow-accent-volume hover:bg-accent-dark w-36 rounded-full py-3 px-8 text-center font-semibold text-white transition-all">
            Create
          </Link>
        </div>
      )}
    </>
  );
};

export default OwnedOffers_categories_items;
