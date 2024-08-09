import React, { useState, useEffect } from "react";
import "tippy.js/dist/tippy.css";
import { features } from "@/data/features";
import Link from "next/link";
import { useChainContext } from "@/hooks/useChainContext";
import { getAddress } from "ethers/lib/utils";
import { DateRangePicker } from "@nextui-org/date-picker";

const Activity = ({ userAddr, chainId }) => {
  const [copied, setCopied] = useState(false);
  const [, setUserData] = useState(null);
  const [ranking, setRanking] = useState<any>(null);
  const [lastActivities, setLastActivities] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredLastActivities, setFilteredLastActivities] = useState<any>(null);
  const [mount, setMount] = useState(false);

  const { currentChainObject } = useChainContext();
  const chainExplorer = currentChainObject?.explorerBaseURL;

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [copied]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `https://relayer.dsponsor.com/api/${chainId}/activity?userAddress=${userAddr}`,
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

      let lastActivities = features.canFilterTransactionsWithWETH
        ? data?.lastActivities.filter(
            (activity) => activity.symbol === "WETH" && activity.points > 0
          )
        : data?.lastActivities.filter((activity) => activity.points > 0);

      setUserData(data);
      setRanking(data?.rankings[0]);
      setLastActivities(lastActivities);
      setMount(true);
    };

    if (userAddr && chainId && !mount) {
      fetchData();
    }
  }, [userAddr, chainId, mount]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredActivities = lastActivities?.filter((activity: any) => {
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
    <>
      <div className="flex flex-col justify-center max-w-4xl mx-auto">
        <div className="flex flex-col justify-center gap-8">
          <div className="flex flex-col justify-center gap-16 mt-4">
            <div className={`flex flex-col gap-16`}>
              <div className="flex flex-col justify-center gap-4">
                <div className="flex items-center gap-4 justify-between">
                  <span className="text-white text-lg font-bold">{/* Activity */}</span>
                  <p className="text-left text-xs text-jacarta-100">
                    Data is updated every 15 minutes
                  </p>
                </div>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
                  <div className="flex flex-col bg-primaryPurple text-white items-center justify-center p-4 rounded-2lg">
                    <span className="text-2xl font-bold">{ranking?.points ?? 0}</span>
                    <span>Boxes</span>
                  </div>

                  <div className="flex flex-col bg-primaryPurple text-white items-center justify-center p-4 rounded-2lg">
                    <span className="text-2xl font-bold">{ranking?.nbBids ?? 0}</span>
                    <span>Bids</span>
                  </div>

                  <div className="flex flex-col bg-primaryPurple text-white items-center justify-center p-4 rounded-2lg">
                    <span className="text-2xl font-bold">{ranking?.nbRefunds ?? 0}</span>
                    <span>Outbids</span>
                  </div>

                  <div className="flex flex-col bg-primaryPurple text-white items-center justify-center p-4 rounded-2lg">
                    <span className="text-2xl font-bold">
                      ${ranking?.usdcAmounts.bidRefundReceived ?? 0}
                    </span>
                    <span>Rewarded</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-white text-lg font-bold">Boxes</span>
              <div className="dark:bg-secondaryBlack dark:text-jacarta-100 rounded-2lg bg-white p-3 flex gap-4 justify-center items-center">
                <p className="text-center text-white">
                  Boxes are a new type of incentive introduced in the SiBorg ecosystem. The content
                  of the boxes will be revealed later and will include various rewards. The number
                  of boxes received is proportionate to the value of the bid. This means the higher
                  a user&apos;s bid, the higher the reward will be if they win the auction.
                  {/* The more active you are on the platform, the more boxes you earn! The more
                        boxes you have, the better the surprises you&apos;ll get. You gain boxes by
                        participating in a token sale, whether as a buyer, seller, or even a
                        referrer! 💸 */}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="flex w-full items-center justify-between">
                <span className="text-white text-lg font-bold">Transactions</span>
                <div>
                  <DateRangePicker
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
                Each transaction where a sale or auction closes rewards the seller, buyer, and
                referrer based on the amount paid. Here are the transactions for each role that
                reward this profile.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full rounded-2lg overflow-x-auto hide-scrollbar">
                  <thead className="text-white bg-primaryPurple rounded-2lg">
                    <tr className="bg-jacarta-50 dark:bg-primaryPurple rounded-2lg text-base">
                      <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                        Operation
                      </th>
                      <th className="py-3 px-4 font-medium text-jacarta-100 dark:text-jacarta-100">
                        Date
                      </th>
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
                            <Link
                              target="_blank"
                              href={`${chainExplorer}/tx/${activity?.transactionHash}`}
                            >
                              <span className="text-primaryPurple hover:text-opacity-80">
                                {activity?.transactionHash.slice(0, 6) +
                                  "..." +
                                  activity?.transactionHash.slice(-4)}
                              </span>
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                            {getAddress(activity?.spender) === getAddress(userAddr)
                              ? activity?.points
                              : 0}
                          </td>
                          <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                            {getAddress(activity?.enabler) === getAddress(userAddr)
                              ? activity?.points
                              : 0}
                          </td>
                          <td className="py-4 px-4 text-jacarta-100 dark:text-jacarta-100">
                            {getAddress(activity?.refAddr) === getAddress(userAddr)
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Activity;
