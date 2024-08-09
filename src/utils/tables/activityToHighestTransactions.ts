import { getAddress } from "ethers/lib/utils";

interface Activity {
  type: string;
  date: string;
  transactionHash: string;
  points: number;
  spender: string;
  enabler: string;
  refAddr: string;
}

interface FormattedActivityItem {
  type: string;
  date: string;
  transactionHash: string;
  fullTransactionHash: string;
  points: number;
  spender: string;
  enabler: string;
  refAddr: string;
  spenderDisplayAddr: string;
  enablerDisplayAddr: string;
  refAddrDisplayAddr: string;
  address?: string;
}

type FormattedActivity = FormattedActivityItem[];

/**
 * Converts activity type to display type.
 * @param {string} type - The activity type.
 * @returns {string} The display type.
 */
const toDisplayType = (type: string): string => {
  let displayType;

  switch (type) {
    case "buy":
      displayType = "Buy";
      break;
    case "auction":
      displayType = "Auction closed";
      break;
    case "mint":
      displayType = "Mint";
      break;
    default:
      displayType = "Unknown";
      break;
  }

  return displayType;
};

/**
 * Converts activity data to top holders format.
 * @param {Array<Activity>} activity - The activity data.
 * @param {string} userAddress - The user address.
 * @returns {Array<FormattedActivity>} Formatted top holders data.
 */
const activityToTopHolders = (activities: Activity[], userAddress?: string): FormattedActivity => {
  if (userAddress === undefined) {
    return [...activities]
      ?.sort((a, b) => b.points - a.points)
      ?.map((activity) => ({
        type: toDisplayType(activity.type),
        date: new Date(activity.date).toLocaleString(),
        transactionHash:
          activity.transactionHash.slice(0, 6) + "..." + activity.transactionHash.slice(-4),
        fullTransactionHash: activity.transactionHash,
        points: activity.points,
        spender: activity.spender,
        enabler: activity.enabler,
        refAddr: activity.refAddr,
        spenderDisplayAddr: activity.spender,
        enablerDisplayAddr: activity.enabler,
        refAddrDisplayAddr: activity.refAddr
      }));
  }

  const userActivity = [...activities]?.filter(
    (item) => getAddress(item.spender) === getAddress(userAddress)
  );
  const otherActivity = activities;

  const sortedOtherActivity = [...otherActivity]?.sort((a, b) => b.points - a.points);

  const sortedActivity = [...userActivity, ...sortedOtherActivity];

  return [...sortedActivity]?.map((activity) => ({
    type: toDisplayType(activity.type),
    date: new Date(activity.date).toLocaleString(),
    transactionHash:
      activity.transactionHash.slice(0, 6) + "..." + activity.transactionHash.slice(-4),
    fullTransactionHash: activity.transactionHash,
    points: activity.points,
    spender: getAddress(activity.spender),
    enabler: getAddress(activity.enabler),
    refAddr: getAddress(activity.refAddr),
    spenderDisplayAddr:
      getAddress(activity.spender) === getAddress(userAddress) ? "You" : activity.spender,
    enablerDisplayAddr:
      getAddress(activity.enabler) === getAddress(userAddress) ? "You" : activity.enabler,
    refAddrDisplayAddr:
      getAddress(activity.refAddr) === getAddress(userAddress) ? "You" : activity.refAddr,
    address:
      getAddress(activity.refAddr) === getAddress(userAddress) ||
      getAddress(activity.enabler) === getAddress(userAddress) ||
      getAddress(activity.spender) === getAddress(userAddress)
        ? getAddress(userAddress)
        : getAddress(activity.refAddr)
  }));
};

export default activityToTopHolders;
