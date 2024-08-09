import { executeQuery } from "@/utils/graphql/helper/executeQuery";
import config from "@/config/config";

/**
 * Fetches all listed tokens from the marketplace for a specific blockchain chain ID.
 *
 * @param {string} chainId - The ID of the blockchain chain to fetch tokens from.
 * @param {boolean} allTokens - Flag to include all tokens or filter out tokens with no marketplace listings.
 * @returns {Promise<Array>} - A promise that resolves to an array of tokens with their details.
 */
export const fetchHome = async (chainId, allTokens) => {
  const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const GET_DATA = `
    query getAllMarketplaceListings($currentTimestamp: Int!) {
      adOffers {
        id
        disable
        metadataURL
        nftContract {
          royalty {
            bps
          }
          tokens(first: 1000) {
            tokenId
            mint {
              blockTimestamp
              tokenData
              totalPaid
              currency
            }
            nftContract {
              id # = assetContract
              adOffers {
                id
                metadataURL # offerMetadata
              }
              prices {
                currency # ERC20 smart contract
                amount # wei, mind decimals() function to transform in human readable value !
                enabled
              }
            }
            marketplaceListings(
              first: 1000
              orderBy: endTime
              orderDirection: asc
            ) {
              id # listingId
              quantity
              # METADATA - if INVALID, ignore this listing
              # offerMetadata = adOffers[0].metadataURL
              # if tokenData?.length
              #    if offerMetadata.offer.token_metadata.name exists => replace all {tokenData} by tokenData value
              #    (same for offerMetadata.offer.token_metadata.description & offerMetadata.offer.token_metadata.image)
              # NAME = offerMetadata.offer.token_metadata.name || offerMetadata.offer.name || INVALID
              # DESCRIPTION = offerMetadata.offer.token_metadata.description || offerMetadata.offer.description || INVALID
              # IMAGE = offerMetadata.offer.token_metadata.image || offerMetadata.offer.image || INVALID
              token {
                tokenId
                nftContract {
                  id # = assetContract
                  royalty {
                    bps
                  }
                  adOffers {
                    id
                    metadataURL # offerMetadata
                    disable
                  }
                }
                mint {
                  tokenData
                }
              }

              # listingType = 0 <-> 'Direct', listingType = 1 <-> 'Auction'
              # 'Direct' or 'Auction'
              listingType

              currency # ERC20 smart contract addr
              # PRICE
              # if listingType = 'Direct'
              #    price = buyoutPricePerToken
              # else if listingType = 'Auction'
              #    price = bids[0].totalBidAmount || reservePricePerToken
              reservePricePerToken
              buyoutPricePerToken
              bids(orderBy: totalBidAmount, orderDirection: desc) {
                 creationTimestamp
                bidder
                totalBidAmount
                status
                newPricePerToken
                totalBidAmount
                paidBidAmount
                refundBonus
                refundAmount
                refundProfit
              }

              lister

              startTime
              endTime

              # 'UNSET', 'CREATED', 'COMPLETED' or 'CANCELLED'
              status

              # will be useful later
              tokenType
              transferType
              rentalExpirationTimestamp
            }
          }
        }
      }
    }
  `;

  type QueryType = {
    adOffers: [
      {
        id: string;
        disable: boolean;
        metadataURL: string;
        nftContract: {
          royalty: {
            bps: string;
          };
          tokens: [
            {
              tokenId: string;
              mint: {
                blockTimestamp: string;
                tokenData: string;
                totalPaid: string;
                currency: string;
              };
              nftContract: {
                id: string;
                adOffers: [
                  {
                    id: string;
                    metadataURL: string;
                    disable: boolean;
                  }
                ];
                prices: [
                  {
                    currency: string;
                    amount: string;
                    enabled: boolean;
                  }
                ];
              };
              marketplaceListings: [
                {
                  id: string;
                  quantity: string;
                  token: {
                    tokenId: string;
                    nftContract: {
                      id: string;
                      royalty: {
                        bps: string;
                      };
                      adOffers: [
                        {
                          id: string;
                          metadataURL: string;
                          disable: boolean;
                        }
                      ];
                    };
                    mint: {
                      tokenData: string;
                    };
                  };
                  listingType: string;
                  currency: string;
                  reservePricePerToken: string;
                  buyoutPricePerToken: string;
                  bids: [
                    {
                      creationTimestamp: string;
                      bidder: string;
                      totalBidAmount: string;
                      status: string;
                      newPricePerToken: string;
                      paidBidAmount: string;
                      refundBonus: string;
                      refundAmount: string;
                      refundProfit: string;
                    }
                  ];
                  lister: string;
                  startTime: string;
                  endTime: string;
                  status: string;
                  tokenType: string;
                  transferType: string;
                  rentalExpirationTimestamp: string;
                }
              ];
            }
          ];
        };
      }
    ];
  };

  const chainConfig = config[chainId];
  const variables = {
    currentTimestamp
  };

  const response = (await executeQuery(path.href, GET_DATA, variables)) as QueryType;

  const mappedListedToken = response?.adOffers
    .map((offer) => {
      const newOffer = {
        ...offer,
        disable: offer.disable,
        nftContract: {
          ...offer.nftContract,
          tokens: allTokens
            ? offer.nftContract.tokens
            : offer.nftContract.tokens.filter(
                (token) => token.mint && token.marketplaceListings.length > 0
              )
        }
      };

      return newOffer;
    })
    .flatMap((offer) =>
      offer.nftContract.tokens.map((token) => ({
        ...token,
        disable: offer.disable,
        offerId: offer.id,
        tokenData: token.mint?.tokenData ? token.mint.tokenData : null,
        chainConfig: chainConfig
      }))
    )
    .sort(
      (a, b) =>
        Number(b.marketplaceListings[0]?.startTime) - Number(a.marketplaceListings[0]?.startTime)
    );

  return mappedListedToken;
};
