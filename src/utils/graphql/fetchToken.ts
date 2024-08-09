import { executeQuery } from "@/utils/graphql/helper/executeQuery";
import config from "@/config/config";

type Royalty = {
  bps: number;
};

type MarketplaceListing = {
  listingType: string;
  status: string;
  startTime: number;
  endTime: number;
  lister: string;
  id: string;
  reservePricePerToken: string;
  buyoutPricePerToken: string;
  currency: string;
  quantity: number;
  directBuys: {
    id: string;
    listing: {
      id: string;
      listingType: string;
    };
    buyer: string;
    quantityBought: number;
    totalPricePaid: string;
    revenueTransaction: {
      blockTimestamp: number;
    };
    feeMethodology: string;
    amountSentToProtocol: string;
    protocolRecipient: string;
    amountSentToSeller: string;
    sellerRecipient: string;
    amountSentToCreator: string;
    creatorRecipient: string;
  }[];
  token: {
    tokenId: string;
    id: string;
    nftContract: {
      id: string;
      royalty: Royalty;
      adOffers: {
        id: string;
        metadataURL: string;
        disable: boolean;
      }[];
    };
    mint: {
      tokenData: string;
    };
  };
  bids: {
    id: string;
    listing: any; // Could be a reference to the listing, need more context
    bidder: string;
    quantity: number;
    newPricePerToken: string;
    totalBidAmount: string;
    paidBidAmount: string;
    refundBonus: string;
    refundAmount: string;
    refundProfit: string;
    currency: string;
    status: string;
    creationTxHash: string;
    revenueTransaction: any; // Could be further defined if needed
    creationTimestamp: number;
    lastUpdateTimestamp: number;
    feeMethodology: string;
    amountSentToProtocol: string;
    protocolRecipient: string;
    amountSentToSeller: string;
    sellerRecipient: string;
    amountSentToCreator: string;
    creatorRecipient: string;
  }[];
};

type MarketplaceOffer = {
  id: string;
  offeror: string;
  expirationTimestamp: number;
  currency: string;
  totalPrice: string;
  status: string;
  creationTimestamp: number;
  tokenType: string;
  transferType: string;
  rentalExpirationTimestamp?: number;
};

type Proposal = {
  adOffer: {
    id: string;
  };
  adParameter: {
    id: string;
    base: string;
    variants: string[];
  };
  acceptedProposal?: {
    id: string;
    status: string;
    data: string;
    creationTimestamp: number;
  };
  pendingProposal?: {
    id: string;
    status: string;
    data: string;
    creationTimestamp: number;
  };
  rejectedProposal?: {
    id: string;
    status: string;
    data: string;
    rejectReason?: string;
    creationTimestamp: number;
  };
};

type ProposalHistory = {
  adParameter: {
    id: string;
  };
  status: string;
  data: string;
  rejectReason?: string;
  creationTimestamp: number;
  lastUpdateTimestamp: number;
};

type Mint = {
  transactionHash: string | null;
  from: string;
  currency: string;
  to: string;
  tokenData: string | null;
  revenueTransaction?: {
    id: string;
    blockTimestamp: number;
  };
  amount: string;
  totalPaid: string;
};

type Token = {
  tokenId: string;
  mint: Mint | null;
  marketplaceListings: MarketplaceListing[];
  marketplaceOffers: MarketplaceOffer[];
  setInAllowList: boolean;
  currentProposals: Proposal[];
  allProposals: ProposalHistory[];
};

type NFTContract = {
  id: string;
  maxSupply: number;
  royalty: Royalty;
  prices: {
    currency: string;
    amount: string;
    enabled: boolean;
  }[];
  tokens: Token[];
};

type AdParameter = {
  id: string;
  base: string;
  variants: string[];
};

type AdParameterEnable = {
  enable: boolean;
  adParameter: AdParameter;
};

type AdOffer = {
  metadataURL: string;
  id: string;
  disable: boolean;
  admins: string[];
  initialCreator: string;
  creationTimestamp: number;
  adParameters: AdParameterEnable[];
  nftContract: NFTContract;
};

type OfferAndTokenInfoResponse = {
  adOffers: AdOffer[];
};

/**
 * Fetches detailed information about an advertisement offer and its specific token.
 *
 * This function queries the GraphQL endpoint to retrieve comprehensive details about an advertisement offer (`offerId`)
 * and a specific token (`tokenId`) associated with that offer. It includes metadata about the offer, information about
 * the NFT contract, token details, marketplace listings, offers, and proposals. Additionally, it checks if the token can
 * still be minted and returns this information.
 *
 * The returned data includes:
 * - Metadata of the advertisement offer
 * - Details about the NFT contract, including pricing and royalty information
 * - Information about the specific token, including its mint details, marketplace listings, offers, and proposals
 * - Historical proposals and current proposals for the token
 *
 * @param {string} chainId - The ID of the blockchain chain to query.
 * @param {string} offerId - The ID of the advertisement offer to query.
 * @param {string} tokenId - The ID of the token to fetch details for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array containing detailed information about the
 *                                  advertisement offer and the specified token.
 */
export const fetchToken = async (chainId, offerId, tokenId) => {
  const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);

  const GET_DATA = `
    query OfferAndTokenInfo($offerId: ID!, $tokenId: ID!) {
      adOffers(
        first: 1000
        where: {id: $offerId}
      ) {
        # --> Fetch and parse https://github.com/dcast-media/dips/blob/dip-0002/antho31/dip-0002.md#example-schema-json
        # to get creator & offer info  (you may have token_metadata info too)
        # offer.name, offer.image, offer.description
        # if token_metadata: token_metadata.name,
        metadataURL
        id # offerId
        disable
        admins
        initialCreator
        creationTimestamp # data (unix time)
        adParameters(where: { enable: true }) {
          enable
          adParameter {
            id # adParameter value, ex: imageURL-320x50 or linkURL
            base # ex: imageURL or linkURL
            variants # ex: ["320x50"]
          }
        }

        nftContract {
          id # DSponsorNFT smart contract address
          maxSupply
          royalty {
            bps
          }
          prices {
            currency # ERC20 smart contract
            amount # wei, mind decimals() function to transform in human readable value !
            enabled
          }
          tokens(
            # you can paginate with this type or filtering
            # where: { and: [{ tokenId_lte: "200" }, { tokenId_lte: "100" }]
            first: 1000
            orderBy: tokenId
            where: { tokenId: $tokenId }
          ) {
            tokenId
            mint {
              transactionHash # if = null => not minted yet, so it's available
              from
              currency
              to # address who receives the token
              tokenData # data linked to token id, search ticker for SiBorg ad offer for example
              revenueTransaction {
                id
                blockTimestamp
              }
              amount
              totalPaid
            }
            marketplaceListings {
              listingType
              status
              startTime
              endTime
              lister
              id
              reservePricePerToken
              buyoutPricePerToken
              currency
              quantity
              directBuys {
                id
                listing {
                  id
                  listingType
                }
                buyer
                quantityBought
                totalPricePaid
                revenueTransaction {
                  blockTimestamp
                }
                feeMethodology
                amountSentToProtocol
                protocolRecipient
                amountSentToSeller
                sellerRecipient
                amountSentToCreator
                creatorRecipient
              }
              token {
                tokenId
                id
                nftContract {
                  id
                  royalty {
                    bps
                  }
                  adOffers {
                    id
                    metadataURL
                    disable
                  }
                }
                mint {
                  tokenData
                }
              }
              bids {
                id
                listing
                bidder
                quantity
                newPricePerToken
                totalBidAmount
                paidBidAmount
                refundBonus
                refundAmount
                refundProfit
                currency
                status
                creationTxHash
                revenueTransaction
                creationTimestamp
                lastUpdateTimestamp
                feeMethodology
                amountSentToProtocol
                protocolRecipient
                amountSentToSeller
                sellerRecipient
                amountSentToCreator
                creatorRecipient
              }
            }
            marketplaceOffers {
              id
              offeror
              expirationTimestamp
              currency
              totalPrice
              status
              creationTimestamp
              tokenType
              transferType
              rentalExpirationTimestamp
            }
            setInAllowList
            currentProposals {
              adOffer {
                id
              }
              adParameter {
                id
                base
                variants
              }
              acceptedProposal {
                id
                status
                data
                creationTimestamp
              }
              pendingProposal {
                id
                status
                data
                creationTimestamp
              }
              rejectedProposal {
                id
                status
                data
                rejectReason
                creationTimestamp
              }
            }

            # proposal submissions history
            allProposals(orderBy: creationTimestamp, orderDirection: desc) {
              adParameter {
                id
              }
              status
              data
              rejectReason
              creationTimestamp
              lastUpdateTimestamp
            }
          }
        }
      }
    }
  `;

  const response = (await executeQuery(path.href, GET_DATA, {
    offerId,
    tokenId
  })) as OfferAndTokenInfoResponse;

  const chainConfig = config[chainId];

  const resultMappedData = response?.adOffers
    .map((element) => {
      const sortByTokenId = element.nftContract.tokens.sort((a, b) => {
        if (a.tokenId < b.tokenId) {
          return -1;
        } else if (a.tokenId > b.tokenId) {
          return 1;
        } else {
          return 0;
        }
      });

      const tokenIdAllowedToMint =
        sortByTokenId.find((token) => token.mint === null)?.tokenId || false;

      const combinedData = {
        ...element,
        chainConfig: chainConfig,
        tokenIdAllowedToMint: tokenIdAllowedToMint
      };

      return combinedData;
    })
    .filter((item) => item !== null);

  return resultMappedData;
};
