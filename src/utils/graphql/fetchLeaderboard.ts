interface ProtocolFeeCurrency {
  address: string;
  decimals: number;
  symbol: string;
}

interface Metadata {
  name: string;
  description: string;
  image: string;
  terms: string;
  external_link: string;
  valid_from: string;
  valid_to: string;
  categories: string[];
  token_metadata: {
    name: string;
    description: string;
    image: string;
    external_url: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

interface Listing {
  tokenId: string;
  contractAddress: string;
  offerId: string;
  tokenData: string;
  metadata: Metadata;
}

interface LastBid {
  blockTimestamp: string;
  bidderAddr: string;
  listingId: string;
  listing: Listing;
  lastBidderDisplayAddr: string;
  date: string;
}

interface FormattedAmounts {
  fee: string;
  usdcAmount: string;
}

interface LastActivity {
  blockTimestamp: string;
  transactionHash: string;
  type: string;
  currency: string;
  fee: string;
  enabler: string;
  spender: string;
  refAddr: string;
  referralAddresses: string[];
  symbol: string;
  decimals: number;
  usdcAmount: string;
  formattedAmounts: FormattedAmounts;
  points: number;
  date: string;
}

interface FormattedCurrencyAmounts {
  symbol: string;
  priceUSDC: string;
  totalSpent: string;
  totalReceived: string;
  bidSpent: string;
  bidRefundReceived: string;
  totalProtocolFee: string;
}

export interface CurrencyAmounts {
  totalSpent: string;
  totalReceived: string;
  bidSpent: string;
  bidRefundReceived: string;
  totalProtocolFee: string;
  formatted: FormattedCurrencyAmounts;
  buySpent?: string;
}

interface UsdcAmounts {
  totalSpent: string;
  totalReceived: string;
  bidSpent: string;
  bidRefundReceived: string;
  totalProtocolFee: string;
}

export interface Ranking {
  points: number;
  addr: string;
  balance: number;
  nbBids: number;
  nbRefunds: number;
  nbProtocolFeeBuys: number;
  nbProtocolFeeSells: number;
  nbProtocolFeeReferrals: number;
  usdcAmounts: UsdcAmounts;
  currenciesAmounts: Record<string, CurrencyAmounts>;
  holdersRank: number;
  spendersRank: number;
  bidRefundsRank: number;
  totalProtocolFeeRank: number;
  displayAddr: string;
  nbWinningBids?: number;
  bidSpent?: string;
  nbBuys?: number;
}

interface LeaderboardType {
  lastUpdate: string;
  protocolFeeCurrency: ProtocolFeeCurrency;
  totalBids: number;
  totalProtocolRevenueUSDCAmount: string;
  totalSpentUSDCAmount: string;
  totalBidRefundUSDCAmount: string;
  nbRevenueCalls: number;
  nbHolders: number;
  lastBid: LastBid;
  lastActivities: LastActivity[];
  rankings: Ranking[];
}

/**
 * Fetches marketplace activity data for a given chain ID.
 *
 * Retrieves activity data from the marketplace API endpoint for the specified blockchain chain.
 * This function provides information on recent activities in the marketplace, such as transactions,
 * events, or other relevant activities.
 *
 * @param {string} chainId - The ID of the blockchain chain to fetch activity data from.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the marketplace activity data.
 */
export const fetchLeaderboard = async (chainId) => {
  const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/activity`);

  const response = await fetch(path.href);
  const data = (await response.json()) as LeaderboardType;

  return data;
};
