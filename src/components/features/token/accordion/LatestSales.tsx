import Link from "next/link";
import React, { useState } from "react";
import renderDateToHumanString from "@/utils/dates/renderDateToHumanString";
import renderPriceToHumanString from "@/utils/prices/renderPriceToHumanString";
import formatLongAddress from "@/utils/addresses/formatLongAddress";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const LastestSales = ({ sales }) => {
  const [visibleListings, setVisibleListings] = useState(1);

  const handleViewMore = () => {
    setVisibleListings((prev) => Math.min(prev + 5, sales.length));
  };

  const handleViewLess = () => {
    setVisibleListings((prev) => Math.max(prev - 5, 1));
  };

  return (
    <div className="overflow-x-auto mt-4">
      <div className="w-full text-left min-w-[736px] border dark:border-primaryPink dark:border-opacity-10 dark:bg-primaryBlack dark:text-white rounded-2lg">
        <table className="w-full mx-auto text-left rounded-2lg">
          <thead className="rounded-2lg">
            <tr className="bg-jacarta-50 dark:bg-primaryPurple rounded-2lg text-base">
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">Type</th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Owner
              </th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Amount
              </th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Sale Time
              </th>
            </tr>
          </thead>
          <tbody>
            {sales &&
              sales.length > 0 &&
              sales.slice(0, visibleListings).map((listing, listingIndex) => (
                <React.Fragment key={listingIndex}>
                  {listing.map((sale, saleIndex) => (
                    <tr key={saleIndex}>
                      <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                        {sale?.listing?.listingType}
                      </td>
                      <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                        <Link
                          href={`/profile/${sale.address}`}
                          className="text-primaryPink hover:text-jacarta-100"
                        >
                          {formatLongAddress(sale.address)}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                        {renderPriceToHumanString(sale?.amount, sale.currency?.currencySymbol)}
                      </td>
                      <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                        {renderDateToHumanString(new Date(Math.max(0, parseInt(sale.date) * 1000)))}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>

      <div className="text-center flex items-center justify-center gap-4 mt-4 mx-auto">
        {visibleListings > 1 && (
          <button
            className="px-4 py-2 bg-secondaryBlack hover:bg-opacity-80 text-white rounded-lg"
            onClick={handleViewLess}
          >
            <span className="flex items-center gap-1">
              View Less <ChevronUpIcon className="h-4 w-4" />
            </span>
          </button>
        )}
        {visibleListings < sales.length && (
          <button
            className="px-4 py-2 bg-secondaryBlack hover:bg-opacity-80 text-white rounded-lg"
            onClick={handleViewMore}
          >
            <span className="flex items-center gap-1">
              View More <ChevronDownIcon className="h-4 w-4" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LastestSales;
