import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import activityToTopPoints from "@/utils/tables/activityToTopPoints";
import activityToTopRewarded from "@/utils/tables/activityToTopRewarded";
import activityToHighestTransactions from "@/utils/tables/activityToHighestTransactions";
import config from "@/config/config";
import { useChainContext } from "@/hooks/useChainContext";
import Cards from "@/components/features/leaderboard/Cards";
import formatLongAddress from "@/utils/addresses/formatLongAddress";
import { useAddress } from "@thirdweb-dev/react";
import { getAddress } from "ethers/lib/utils";

const renderTable = (data, columns, userAddress) => {
  if (!data || data.length === 0 || !Array.isArray(data)) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="w-full text-left min-w-[736px] border dark:border-primaryPink dark:border-opacity-10 dark:bg-primaryBlack dark:text-white rounded-2lg">
      <table className="w-full rounded-2lg overflow-hidden">
        <thead className="rounded-2lg border border-primaryPurple">
          <tr className="bg-jacarta-50 dark:bg-primaryPurple rounded-2lg">
            {columns.map((col, index) => (
              <th key={index} className="py-3 px-4 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr
              key={index}
              className={`${userAddress && item.address && getAddress(item.address) === getAddress(userAddress) ? (index === 0 ? "bg-primaryPurple bg-opacity-10 border-primaryPurple border" : "bg-primaryPurple bg-opacity-10") : "border-t border-opacity-10 border-jacarta-100 dark:border-primaryPink dark:border-opacity-10"}`}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-4 px-4">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Tables = ({ activity }) => {
  const { currentChainObject } = useChainContext();
  const [activeBlockchain] = useState(currentChainObject?.chainId);
  const [itemActive, setItemActive] = useState(1);
  const [, setChainId] = useState();
  const [filteredActivity, setFilteredActivity] = useState([]);

  const [, setBlockChainOptions] = useState<any[]>([]);
  const [leaderboards, setLeaderboards] = useState({});

  const address = useAddress();
  const chainExplorer = currentChainObject?.explorerBaseURL;

  useEffect(() => {
    const filteredActivity = activity?.filter(
      (item) => Number(item?.chainId) === Number(activeBlockchain)
    );
    setChainId(filteredActivity[0]?.chainId);
    setFilteredActivity(filteredActivity[0]);

    setLeaderboards({
      topPoints: activityToTopPoints(filteredActivity[0]?.rankings, address),
      // topHolders: activityToTopHolders(filteredActivity[0]?.rankings, address),
      topRewarded: activityToTopRewarded(filteredActivity[0]?.rankings, address),
      topSpenders: activityToHighestTransactions(filteredActivity[0]?.lastActivities, address)
    });
  }, [activeBlockchain, activity, address]);

  useEffect(() => {
    const chains = Object.entries(config).map((value) => {
      return value[1]?.chainId;
    });

    setBlockChainOptions(chains);
  }, []);

  const pointColumns = [
    { header: "Rank", render: (item) => item.rank },
    {
      header: "Wallet",
      render: (item) => (
        <Link href={`/profile/${item.address}`}>
          <span className="text-primaryPink hover:text-jacarta-100">{item.addressDisplay}</span>
        </Link>
      )
    },
    { header: "Total Boxes", render: (item) => item.totalPoints }
  ];

  const rewardedColumns = [
    { header: "Rank", render: (item) => item.rank },
    { header: "Total Amount Earned", render: (item) => `${item.totalReceived} USDC` },
    {
      header: "Address",
      render: (item) => (
        <Link href={`/profile/${item.address}`}>
          <span className="text-primaryPink hover:text-jacarta-100">{item.addressDisplay}</span>
        </Link>
      )
    },
    { header: "# of Outbids", render: (item) => item.refunds }
  ];

  const highestTransactionsColumns = [
    { header: "Type", render: (item) => item.type },
    { header: "Date", render: (item) => `${item.date}` },
    {
      header: "Transaction",
      render: (item) => (
        <Link target="_blank" href={`${chainExplorer}/tx/${item.fullTransactionHash}`}>
          {/* to change */}
          <span className="text-primaryPink hover:text-jacarta-100">{item.transactionHash}</span>
        </Link>
      )
    },
    { header: "Boxes", render: (item) => item.points },
    {
      header: "Seller",
      render: (item) => (
        <Link href={`/profile/${item.enabler}`}>
          <span className="text-primaryPink hover:text-jacarta-100">
            {formatLongAddress(item.enablerDisplayAddr)}
          </span>
        </Link>
      )
    },
    {
      header: "Buyer",
      render: (item) => (
        <Link href={`/profile/${item.spender}`}>
          <span className="text-primaryPink hover:text-jacarta-100">
            {formatLongAddress(item.spenderDisplayAddr)}
          </span>
        </Link>
      )
    },
    {
      header: "Referrer",
      render: (item) => (
        <Link href={`/profile/${item.refAddr}`}>
          <span className="text-primaryPink hover:text-jacarta-100">
            {formatLongAddress(item.refAddrDisplayAddr)}
          </span>
        </Link>
      )
    }
  ];

  const columns = {
    topPoints: pointColumns,
    topRewarded: rewardedColumns,
    topSpenders: highestTransactionsColumns
  };

  const tabItem = [
    { id: 1, text: "Top Boxes", icon: "activity" },
    { id: 2, text: "Top Rewarded", icon: "activity" },
    { id: 3, text: "Top Spenders", icon: "activity" }
  ];

  return (
    <div className="container ">
      <h1 className="text-4xl font-medium text-center pt-8 pb-4 mb-4 dark:text-white">
        Leaderboard Rankings
      </h1>
      <div className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-4 flex-wrap items-center justify-between">
        <Cards activity={filteredActivity} />
      </div>
      <div className="hide-scrollbar overflow-x-auto">
        {/* <!-- Tabs Nav --> */}
        <Tabs className="tabs hide-scrollbar">
          <TabList className="nav nav-tabs hide-scrollbar mb-6 flex items-center justify-start  overflow-y-hidden border-b border-jacarta-100 pb-px dark:border-jacarta-800 md:justify-center">
            {tabItem.map(({ id, text, icon }) => {
              return (
                <Tab className="nav-item " key={id} onClick={() => setItemActive(id)}>
                  <button
                    className={
                      itemActive === id
                        ? "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white active"
                        : "nav-link hover:text-jacarta-900 text-jacarta-100 relative flex items-center whitespace-nowrap py-3 px-6 dark:hover:text-white"
                    }
                  >
                    <svg className="icon mr-1 h-5 w-5 fill-current">
                      <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
                    </svg>
                    <span className="font-display text-base font-medium">{text}</span>
                  </button>
                </Tab>
              );
            })}
          </TabList>

          {Object.entries(leaderboards).map(([key, data]) => (
            <TabPanel key={key}>
              <div className="max-w-2xl text-center mx-auto">
                {key === "topPoints" && (
                  <p className="text-jacarta-100 text-sm md:text-base mb-4">
                    Each transaction where a sale or auction closes rewards the seller, buyer, and
                    referrer based on the amount paid. Here are the profiles with the highest
                    rewards.
                  </p>
                )}

                {key === "topHolders" && (
                  <p className="text-jacarta-100 text-sm md:text-base mb-4">
                    Here is the list of wallets that acquired the most tokens, along with the total
                    amount spent.
                  </p>
                )}

                {key === "topRewarded" && (
                  <p className="text-jacarta-100 text-sm md:text-base mb-4">
                    For each outbid, the outbid bidder receives a bonus in addition to their bid.
                    Here is the list of those who received the most bonuses.
                  </p>
                )}

                {key === "topSpenders" && (
                  <p className="text-jacarta-100 text-sm md:text-base mb-4">
                    Each transaction where a sale or auction closes rewards the seller, buyer, and
                    referrer based on the amount paid. Here are the transactions with the highest
                    rewards.
                  </p>
                )}
              </div>
              <p className="text-xs text-jacarta-100 mb-4">Data is updated every 15 minutes</p>
              <div className="overflow-x-auto">{renderTable(data, columns[key], address)}</div>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Tables;
