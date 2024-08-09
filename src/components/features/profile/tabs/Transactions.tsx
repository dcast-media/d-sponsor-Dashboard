import React, { useState, useEffect } from "react";
import { getAddress } from "ethers/lib/utils";
import { DateRangePicker } from "@nextui-org/date-picker";
import Link from "next/link";
import { useChainContext } from "@/hooks/useChainContext";
import { Loader2Icon } from "lucide-react";

const Transactions = ({ manageAddress, lastActivities, isLoading }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredLastActivities, setFilteredLastActivities] = useState<any[]>([]);

  const { currentChainObject } = useChainContext();
  const chainExplorer = currentChainObject?.explorerBaseURL;

  useEffect(() => {
    if (startDate && endDate) {
      const filteredActivities = lastActivities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return (
          activityDate.getTime() >= startDate.getTime() &&
          activityDate.getTime() <= endDate.getTime()
        );
      });

      setFilteredLastActivities(filteredActivities);
    } else {
      setFilteredLastActivities(lastActivities);
    }
  }, [startDate, endDate, lastActivities]);

  const toDisplayType = (type) => {
    switch (type) {
      case "buy":
        return "Bought";
      case "auction":
        return "Auction Closed";
      case "mint":
        return "Minted";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-white text-lg font-bold flex items-center gap-2">
          Transactions {isLoading && <Loader2Icon className="animate-spin w-4 h-auto" />}
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
        Each transaction where a sale or auction closes rewards the seller, buyer, and referrer
        based on the amount paid. Here are the transactions for each role that reward this profile.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full rounded-2lg overflow-x-auto hide-scrollbar">
          <thead className="text-white bg-primaryPurple rounded-2lg">
            <tr className="bg-jacarta-50 dark:bg-primaryPurple rounded-2lg text-base">
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Operation
              </th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">Date</th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Transaction Hash
              </th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Buyer Boxes
              </th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Seller Boxes
              </th>
              <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                Referrer Boxes
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
                    {new Date(activity?.date).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                    <Link target="_blank" href={`${chainExplorer}/tx/${activity?.transactionHash}`}>
                      <span className="text-primaryPurple hover:text-opacity-80">
                        {activity?.transactionHash?.slice(0, 6) +
                          "..." +
                          activity?.transactionHash?.slice(-4)}
                      </span>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                    {activity?.spender &&
                    manageAddress &&
                    getAddress(activity?.spender) === getAddress(manageAddress)
                      ? activity?.points
                      : 0}
                  </td>
                  <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                    {activity?.enabler &&
                    manageAddress &&
                    getAddress(activity?.enabler) === getAddress(manageAddress)
                      ? activity?.points
                      : 0}
                  </td>
                  <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                    {activity?.refAddr &&
                    manageAddress &&
                    getAddress(activity?.refAddr) === getAddress(manageAddress)
                      ? activity?.points
                      : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
