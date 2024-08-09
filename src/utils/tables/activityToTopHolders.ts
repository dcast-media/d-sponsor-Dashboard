import { getAddress } from "ethers/lib/utils";

interface CurrencyAmounts {
  totalSpent: number;
}

interface Activity {
  holdersRank: number;
  usdcAmounts: {
    totalSpent: number;
  };
  displayAddr: string;
  addr: string;
  balance: number;
  chainId: number;
  dPoints?: number;
  currenciesAmounts?: {
    [currency: string]: CurrencyAmounts;
  };
}

interface FormattedActivity {
  rank: number;
  totalSpent: number;
  addressDisplay: string;
  address: string;
  balance: number;
  chainId: number;
  dPoints: number;
  details: {
    currency: string;
    totalSpent: number;
  }[];
}

/**
 * Converts activity data to top holders format.
 * @param {Array<Activity>} activity - The activity data.
 * @param {string} [userAddress] - The user's address.
 * @returns {Array<FormattedActivity>} Formatted top holders data.
 */
const activityToTopHolders = (activity: Activity[], userAddress?: string): FormattedActivity[] => {
  if (userAddress === undefined) {
    return [...activity]
      ?.sort((a, b) => a.holdersRank - b.holdersRank)
      ?.map((ranking) => ({
        rank: ranking.holdersRank,
        totalSpent: ranking.usdcAmounts.totalSpent,
        addressDisplay: ranking.displayAddr,
        address: ranking.addr,
        balance: ranking.balance,
        chainId: ranking.chainId,
        dPoints: ranking.dPoints ?? 0,
        details: Object.entries(ranking.currenciesAmounts || {})?.map(([currency, amounts]) => ({
          currency,
          totalSpent: amounts.totalSpent
        }))
      }));
  }

  const userActivity = activity?.filter(
    (item) => getAddress(item.addr) === getAddress(userAddress)
  );
  const otherActivity = activity;

  const sortedOtherActivity = [...otherActivity]?.sort((a, b) => a.holdersRank - b.holdersRank);

  const sortedActivity = [...userActivity, ...sortedOtherActivity];

  return sortedActivity?.map((ranking) => ({
    rank: ranking.holdersRank,
    totalSpent: ranking.usdcAmounts.totalSpent,
    addressDisplay: getAddress(ranking.addr) === getAddress(userAddress) ? "You" : ranking.addr,
    address: ranking.addr,
    balance: ranking.balance,
    chainId: ranking.chainId,
    dPoints: ranking.dPoints ?? 0,
    details: Object.entries(ranking.currenciesAmounts || {})?.map(([currency, amounts]) => ({
      currency,
      totalSpent: amounts.totalSpent
    }))
  }));
};

export default activityToTopHolders;
