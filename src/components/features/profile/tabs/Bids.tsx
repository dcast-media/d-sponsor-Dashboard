import React, { useState, useEffect, useCallback } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import Link from "next/link";
import { useChainContext } from "@/hooks/useChainContext";
import formatAndRound from "@/utils/prices/formatAndRound";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Loader2Icon } from "lucide-react";

const Bids = ({ marketplaceBids, isLoading }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredLastActivities, setFilteredLastActivities] = useState<any[]>([]);

  const { currentChainObject } = useChainContext();
  const chainId = currentChainObject?.chainId;

  const formatBidTransactions = useCallback(
    (bids: any) => {
      if (!bids) return [];

      let tempBids: any[] = [];

      bids?.forEach(async (bid) => {
        let tempBid: any = {};

        if (bid?.refundProfit > 0 && bid?.status !== "COMPLETED") {
          tempBid.type = "outbid";
        } else if (bid?.status === "COMPLETED") {
          tempBid.type = "completed";
        } else {
          tempBid.type = "bid";
        }

        const tokenId = bid?.listing?.token?.tokenId;
        const offerId = bid?.listing?.token?.nftContract?.adOffers[0]?.id;

        tempBid.date = new Date(bid?.creationTimestamp * 1000);
        tempBid.transactionHash = bid?.creationTxHash;
        tempBid.refundAmount = BigNumber.from(bid?.refundProfit);
        tempBid.refundDate = new Date(bid?.lastUpdateTimestamp * 1000);
        tempBid.refundBid = BigNumber.from(bid?.refundAmount).sub(
          BigNumber.from(bid?.refundProfit)
        );
        tempBid.currencyAddress = bid?.currency;
        tempBid.bidAmount = BigNumber.from(bid?.paidBidAmount);
        tempBid.tokenName =
          bid?.listing?.token?.nftContract?.adOffers[0]?.name +
          (bid?.listing?.token?.mint?.tokenData ? " #" + bid?.listing?.token?.mint?.tokenData : "");
        tempBid.tokenLink = `/${chainId}/offer/${offerId}/${tokenId}`;

        let currency;
        for (const key in currentChainObject?.smartContracts) {
          if (
            currentChainObject?.smartContracts[key]?.address.toLowerCase() ===
            bid?.currency.toLowerCase()
          ) {
            currency = currentChainObject?.smartContracts[key];
            break;
          }
        }

        tempBid.currency = currency;

        tempBids.push(tempBid);
      });

      return tempBids;
    },
    [chainId, currentChainObject?.smartContracts]
  );

  useEffect(() => {
    if (startDate && endDate) {
      let filteredActivities = marketplaceBids.filter((activity) => {
        const activityDate = new Date(activity?.creationTimestamp * 1000);
        return (
          activityDate.getTime() >= startDate.getTime() &&
          activityDate.getTime() <= endDate.getTime()
        );
      });

      // use the function to format
      filteredActivities = formatBidTransactions(filteredActivities);
      filteredActivities = filteredActivities.sort((a, b) => b.date - a.date).filter(Boolean);

      setFilteredLastActivities(filteredActivities);
    } else {
      const formattedMarketplaceBids = formatBidTransactions(marketplaceBids);
      const sortedMarketplaceBids = formattedMarketplaceBids
        ?.sort((a, b) => b.date - a.date)
        .filter(Boolean);
      setFilteredLastActivities(sortedMarketplaceBids);
    }
  }, [startDate, endDate, marketplaceBids, formatBidTransactions]);

  const toDisplayType = (type) => {
    switch (type) {
      case "bid":
        return "Ongoing Bid";
      case "outbid":
        return "Outbidded";
      case "completed":
        return "Auction Won";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center gap-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-white text-lg font-bold flex items-center gap-2">
            Bids {isLoading && <Loader2Icon className="animate-spin w-4 h-auto" />}
          </span>
          <div>
            <DateRangePicker
              aria-label="Select date range"
              size="sm"
              onChange={(value) => {
                const startDateObject = value?.start;
                const endDateObject = value?.end;

                const startDate = new Date(
                  startDateObject.year,
                  startDateObject.month - 1,
                  startDateObject.day
                );
                const endDate = new Date(
                  endDateObject.year,
                  endDateObject.month - 1,
                  endDateObject.day
                );

                setStartDate(startDate);
                setEndDate(endDate);
              }}
            />
          </div>
        </div>

        <p className="text-jacarta-100 text-sm">
          Each transaction that represents a bid or outbid on a listing is displayed here.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full rounded-2lg overflow-x-auto hide-scrollbar">
            <thead className="text-white text-left bg-primaryPurple rounded-2lg">
              <tr className="bg-jacarta-50 dark:bg-primaryPurple rounded-2lg text-base">
                <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                  Status
                </th>
                <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                  Token
                </th>
                <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                  Bid Date
                </th>
                <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                  Bid Amount
                </th>
                <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                  Refund Bid
                </th>
                <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                  Refund Profit
                </th>
              </tr>
            </thead>
            <tbody className="rounded-2lg overflow-x-auto">
              {filteredLastActivities?.map((activity, index) => {
                return (
                  <tr key={index}>
                    <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                      {toDisplayType(activity?.type)}
                    </td>
                    <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                      <Link
                        href={activity?.tokenLink}
                        className="text-primaryPurple hover:text-opacity-80"
                      >
                        {activity?.tokenName}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                      {new Date(activity?.date).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                      {formatAndRound(
                        formatUnits(activity?.bidAmount, activity?.currency?.decimals)
                      )}{" "}
                      {activity?.currency?.symbol}
                    </td>
                    <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                      {activity?.refundBid && activity?.refundBid > 0
                        ? `${formatAndRound(
                            formatUnits(activity?.refundBid, activity?.currency?.decimals)
                          )} ${activity?.currency?.symbol}`
                        : "-"}{" "}
                    </td>
                    <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                      {activity?.refundAmount && activity?.refundAmount > 0
                        ? `${formatAndRound(
                            formatUnits(activity?.refundAmount, activity?.currency?.decimals)
                          )} ${activity?.currency?.symbol}`
                        : "-"}{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Bids;
