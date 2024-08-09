import { getAddress } from "ethers/lib/utils";

interface Activity {
  totalProtocolFeeRank: number;
  points: number;
  displayAddr: string;
  addr: string;
}

interface FormattedActivityItem {
  rank: number;
  totalPoints: number;
  addressDisplay: string;
  address: string;
}

type FormattedActivity = FormattedActivityItem[];

/**
 * Converts activity data to top holders format.
 * @param {Array<Activity>} activity - The activity data.
 * @param {string} userAddress - The user address.
 * @returns {Array<FormattedActivity>} Formatted top holders data.
 */
const activityToTopPoints = (activity: Activity[], userAddress?: string): FormattedActivity => {
  if (userAddress === undefined) {
    return [...activity]
      ?.sort((a, b) => a.totalProtocolFeeRank - b.totalProtocolFeeRank)
      ?.map((ranking) => ({
        rank: ranking.totalProtocolFeeRank,
        totalPoints: ranking.points,
        addressDisplay: ranking.displayAddr,
        address: ranking.addr
      }));
  }

  const userActivity = activity?.filter(
    (item) => getAddress(item.addr) === getAddress(userAddress)
  );
  const otherActivity = activity;

  const sortedOtherActivity = [...otherActivity]?.sort(
    (a, b) => a.totalProtocolFeeRank - b.totalProtocolFeeRank
  );

  const sortedActivity = [...userActivity, ...sortedOtherActivity];

  return sortedActivity?.map((ranking) => ({
    rank: ranking.totalProtocolFeeRank,
    totalPoints: ranking.points,
    addressDisplay: getAddress(ranking.addr) === getAddress(userAddress) ? "You" : ranking.addr,
    address: ranking.addr
  }));
};

export default activityToTopPoints;
