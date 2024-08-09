import { Address } from "thirdweb";

export type NftContract = {};

export type AdOfferParameterLink = {
  id: string;
  enable: boolean;
  adOffer: AdOffer;
  adParameter: AdParameter;
};

export type AdOfferParameterLinks = AdOfferParameterLink[];

export type AdParameter = {
  id: string;
  base: string;
  variants: string[];
  adOffers: AdOfferParameterLink[];
  proposals: AdProposal[];
  currentProposals: CurrentProposal[];
};

export type AdParameters = AdParameter[];

export type AdProposal = {
  id: string;
  adOffer: AdOffer;
  token: Token;
  adParameter: AdParameter;
  status: AdProposalStatus;
  data: string;
  rejectReason?: string;
  creationTimestamp: bigint;
  lastUpdateTimestamp: bigint;
};

export type AdProposalStatus =
  | "CURRENT_ACCEPTED"
  | "CURRENT_PENDING"
  | "CURRENT_REJECTED"
  | "PREV_ACCEPTED"
  | "PREV_PENDING"
  | "PREV_REJECTED";

export type Mint = {
  id: string;
  contractAddress: Address;
  tokenId: bigint;
  from: Address;
  to: Address;
  currency: Address;
  amount: bigint;
  tokenData: string;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: Address;
  revenueTransaction: RevenueTransaction;
  token: Token;
  feeMethodology: FeeMethodology;
  amountSentToProtocol: bigint;
  protocolRecipient: Address;
  totalPaid: bigint;
};

export type RevenueTransaction = {
  id: Address;
  blockTimestamp: bigint;
  protocolFees: CallWithProtocolFee[];
  marketplaceBids: MarketplaceBid[];
  marketplaceDirectBuys: MarketplaceDirectBuy[];
  marketplaceOffers: MarketplaceOffer[];
  mints: Mint[];
};

export type CallWithProtocolFee = {
  id: Address;
  target: Address;
  currency: Address;
  fee: bigint;
  enabler: Address;
  spender: Address;
  referralAdditionalInformation: string;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: Address;
  revenueTransaction?: RevenueTransaction;
  referralAddresses: Address[];
  referralUnitShare?: number;
  referralNb?: number;
  epochCurrencyRevenue: EpochCurrencyRevenue;
};

export type EpochCurrencyRevenue = {
  id: string;
  year: number;
  month: number;
  currency: Address;
  totalAmount: bigint;
  callsWithProtocolFee: CallWithProtocolFee[];
};

export type MarketplaceBid = {
  id: string;
  listing: MarketplaceListing;
  bidder: Address;
  quantity: bigint;
  newPricePerToken: bigint;
  totalBidAmount: bigint;
  paidBidAmount: bigint;
  refundBonus: bigint;
  refundProfit: bigint;
  currency: Address;
  status: Status;
  creationTxHash: Address;
  revenueTransaction?: RevenueTransaction;
  creationTimestamp: bigint;
  lastUpdateTimestamp: bigint;
  feeMethodologyN: FeeMethodology;
  amountSentToProtocol?: bigint;
  protocolRecipient?: Address;
  amountSentToSeller?: bigint;
  sellerRecipient?: Address;
  amountSentToCreator?: bigint;
  creatorRecipient?: Address;
};

export type TokenPrice = {
  id: string;
  currency: Address;
  amount: bigint;
  enabled: boolean;
  token: Token;
};

export type UpdateUser = {
  id: Address;
  tokenId: bigint;
  user: Address;
  expires: bigint;
  blockNumber: bigint;
  blockTimestamp: bigint;
  transactionHash: Address;
};

export type MarketplaceDirectBuy = {
  id: Address;
  listing: MarketplaceListing;
  buyer: Address;
  quantityBought: bigint;
  totalPricePaid: bigint;
  revenueTransaction: RevenueTransaction;
  feeMethodology?: FeeMethodology;
  amountSentToProtocol: bigint;
  protocolRecipient: Address;
  amountSentToSeller: bigint;
  sellerRecipient: Address;
  amountSentToCreator: bigint;
  creatorRecipient: Address;
};

export type ListingType = "Direct" | "Auction";

export type TokenType = "ERC1155" | "ERC721" | "ERC20";

export type TransferType = "Rent" | "Sale";

export type Status = "UNSET" | "CREATED" | "COMPLETED" | "CANCELLED";

export type FeeParamsForContract = {
  id: Address;
  feeRecipient: Address;
  feeBps: bigint;
  lastUpdateTimestamp: bigint;
};

export type MarketplaceListing = {
  id: string;
  origin: Address;
  listingType: ListingType;
  lister: Address;
  token: Token;
  startTime: bigint;
  endTime: bigint;
  quantity: bigint;
  currency: Address;
  reservePricePerToken: bigint;
  buyoutPricePerToken: bigint;
  tokenType: TokenType;
  transferType: TransferType;
  rentalExpirationTimestamp: bigint;
  status: Status;
  creationTimestamp: bigint;
  lastUpdateTimestamp: bigint;
  completedBid: MarketplaceBid;
  bids: MarketplaceBid[];
  directBuys: MarketplaceDirectBuy[];
};

export type FeeMethodology = "ADDED_TO_AMOUNT" | "CUT_TO_AMOUNT";

export type MarketplaceOffer = {
  id: string;
  origin: Address;
  offeror: Address;
  token: Token;
  quantity: bigint;
  currency: Address;
  totalprice: bigint;
  tokenType: TokenType;
  transferType: TransferType;
  expirationTimestamp: bigint;
  rentalExpirationTimestamp: bigint;
  status: Status;
  revenueTransaction?: RevenueTransaction;
  referralAdditionalInformation?: string;
  creationTimestamp: bigint;
  lastUpdateTimestamp?: bigint;
  feeMethodology?: FeeMethodology;
  amountSentToProtocol?: bigint;
  protocolRecipient?: Address;
  amountSentToSeller?: bigint;
  sellerRecipient?: Address;
  amountSentToCreator?: bigint;
  creatorRecipient: Address;
};

export type Token = {
  id: string;
  nftContract: NftContract;
  tokenId: bigint;
  setInAllowList: boolean;
  mint: Mint;
};

export type CurrentProposal = {
  id: string;
  adOffer: AdOffer;
  token: Token;
  adParameter: AdParameter;
  pendingProposal: AdProposal;
  acceptedProposal: AdProposal;
  rejectedProposal: AdProposal;
};

export type AdOffer = {
  id: string;
  origin: Address;
  disable: boolean;
  name: string;
  metadataURL: string;
  nftContract: NftContract;
  initialCreator: Address;
  creationTimestamp: bigint;
  admins: Address[];
  validators: Address[];
  adParameters: AdOfferParameterLink[];
  allProposals: AdProposal[];
  currentProposals: CurrentProposal[];
};

export type AdOffers = AdOffer[];
