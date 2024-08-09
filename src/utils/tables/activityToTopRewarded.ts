import { getAddress } from "ethers/lib/utils";

interface CurrencyAmounts {
  bidRefundReceived: number;
}

interface Activity {
  bidRefundsRank: number;
  usdcAmounts: {
    bidRefundReceived: number;
  };
  displayAddr: string;
  addr: string;
  nbRefunds: number;
  chainId: number;
  dPoints?: number;
  currenciesAmounts?: {
    [currency: string]: CurrencyAmounts;
  };
}

interface FormattedActivity {
  rank: number;
  totalReceived: number;
  addressDisplay: string;
  address: string;
  refunds: number;
  chainId: number;
  dPoints: number;
  details: {
    currency: string;
    totalReceived: number;
  }[];
}

/**
 * Converts activity data to top rewarded format.
 * @param {Array<Activity>} activity - The activity data.
 * @param {string} userAddress - The user's address.
 * @returns {Array<FormattedActivity>} Formatted top rewarded data.
 */
const activityToTopRewarded = (activity: Activity[], userAddress?: string): FormattedActivity[] => {
  if (userAddress === undefined) {
    return [...activity]
      ?.sort((a, b) => a.bidRefundsRank - b.bidRefundsRank)
      ?.map((ranking) => ({
        rank: ranking.bidRefundsRank,
        totalReceived: ranking.usdcAmounts.bidRefundReceived,
        addressDisplay: ranking.displayAddr,
        address: ranking.addr,
        refunds: ranking.nbRefunds,
        chainId: ranking.chainId,
        dPoints: ranking.dPoints ?? 0,
        details: Object.entries(ranking.currenciesAmounts || {})?.map(([currency, amounts]) => ({
          currency,
          totalReceived: amounts.bidRefundReceived
        }))
      }));
  }

  const userActivity = activity?.filter(
    (item) => getAddress(item.addr) === getAddress(userAddress)
  );
  const otherActivity = activity;

  const sortedOtherActivity = [...otherActivity]?.sort(
    (a, b) => a.bidRefundsRank - b.bidRefundsRank
  );

  const sortedActivity = [...userActivity, ...sortedOtherActivity];

  return sortedActivity?.map((ranking) => ({
    rank: ranking.bidRefundsRank,
    totalReceived: ranking.usdcAmounts.bidRefundReceived,
    addressDisplay: getAddress(ranking.addr) === getAddress(userAddress) ? "You" : ranking.addr,
    address: ranking.addr,
    refunds: ranking.nbRefunds,
    chainId: ranking.chainId,
    dPoints: ranking.dPoints ?? 0,
    details: Object.entries(ranking.currenciesAmounts || {})?.map(([currency, amounts]) => ({
      currency,
      totalReceived: amounts.bidRefundReceived
    }))
  }));
};

export default activityToTopRewarded;
