import config from "@/config/config";
import { Address } from "@thirdweb-dev/sdk";

interface AdParameter {
  adParameter: {
    id: string;
    base: string;
    variants: string[];
  };
}

interface Royalty {
  bps: string;
  receiver: string;
}

interface PriceStructure {
  creatorAmount: string;
  protocolFeeAmount: string;
  totalAmount: string;
}

interface PriceStructureFormatted {
  creatorAmount: string;
  protocolFeeAmount: string;
  totalAmount: string;
}

interface Price {
  currency: string;
  amount: string;
  currencySymbol: string;
  currencyDecimals: string;
  currencyPriceUSDC: string;
  currencyPriceUSDCFormatted: string;
  minterAddress: string;
  protocolFeeBps: string;
  mintPriceStructure: PriceStructure;
  mintPriceStructureFormatted: PriceStructureFormatted;
  mintPriceStructureUsdcFormatted: PriceStructureFormatted;
}

interface MarketplaceListing {
  id: string;
  quantity: string;
  listingType: string;
  startTime: string;
  endTime: string;
  currency: string;
  buyoutPricePerToken: string;
  reservePricePerToken: string;
  status: string;
  bids: any[];
  currencySymbol: string;
  currencyDecimals: string;
  currencyPriceUSDC: string;
  currencyPriceUSDCFormatted: string;
  marketplaceAddress: string;
  protocolFeeBps: string;
  minimalBidBps: string;
  previousBidAmountBps: string;
  bidPriceStructure: any;
  bidPriceStructureFormatted: any;
  bidPriceStructureUsdcFormatted: any;
  buyPriceStructure: any;
  buyPriceStructureFormatted: any;
  buyPriceStructureUsdcFormatted: any;
}

interface Token {
  tokenId: string;
  setInAllowList: boolean;
  marketplaceListings: MarketplaceListing[];
  nftContract: {
    id: string;
    allowList: boolean;
    maxSupply: string;
    royalty: Royalty;
    prices: Price[];
  };
  mint: {
    tokenData: string;
    blockTimestamp: string;
  };
  prices: any[];
  metadata: any;
}

interface NftContract {
  id: string;
  allowList: boolean;
  maxSupply: string;
  royalty: Royalty;
  prices: Price[];
  tokens: Token[];
}

interface Metadata {
  creator: {
    name: string;
    description: string;
    image: string;
    external_link: string;
    categories: string[];
  };
  offer: {
    name: string;
    description: string;
    image: string;
    terms: string;
    external_link: string;
    valid_from: string;
    valid_to: string;
    categories: string[];
    token_metadata: any;
  };
}

interface ResponseType {
  id: string;
  disable: boolean;
  metadataURL: string;
  name: string;
  initialCreator: string;
  validators: any;
  admins: string[];
  creationTimestamp: string;
  adParameters: AdParameter[];
  nftContract: NftContract;
  metadata: Metadata;
}

/**
 * Fetches all tokens owned by a specific user address for a given blockchain chain ID.
 *
 * @param {string} ownerAddress - The address of the user whose tokens are to be fetched.
 * @param {string} chainId - The ID of the blockchain chain to fetch tokens from.
 * @returns {Promise<Array>} - A promise that resolves to an array of tokens owned by the user, with additional chain configuration.
 */
export const fetchAllTokensProfile = async (ownerAddress: Address, chainId: number) => {
  const options = { method: "GET", headers: { accept: "application/json" } };
  const response = await fetch(
    `https://relayer.dsponsor.com/api/${chainId}/account/${ownerAddress}/tokens`,
    options
  );

  const data = (await response.json()) as ResponseType[];

  const resultMappedData = data?.map((item) => {
    const combinedData = {
      ...item,
      chainConfig: config[chainId]
    };
    return combinedData;
  });

  return resultMappedData;
};
