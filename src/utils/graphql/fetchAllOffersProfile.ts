import { executeQuery } from "@/utils/graphql/helper/executeQuery";
import config from "@/config/config";
import { Address } from "@thirdweb-dev/sdk";

/**
 * Fetches all offers profile for a given user address and chain ID.
 *
 * @param {string} userAddress - The address of the user.
 * @param {number} chainId - The ID of the blockchain chain.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of offer profiles.
 */
export const fetchAllOffersProfile = async (userAddress: Address, chainId: number) => {
  const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);

  const GET_DATA = `
    query OffersManagedByUser($userAddress: ID!) {
      adOffers(
        first: 1000
      ) {
        metadataURL
        disable
        name
        admins
        initialCreator
        id # offerId
        allProposals {
          id
          adOffer
          token
          adParameter
          status
          data
          rejectReason
          creationTimestamp
          lastUpdateTimestamp
        }
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
          prices {
            currency # ERC20 smart contract
            amount # wei, mind decimals() function to transform in human readable value !
            enabled
          }
          owner
          tokens(
            # you can paginate with this type or filtering
            # where: { and: [{ tokenId_lte: "200" }, { tokenId_lte: "100" }]
            first: 1000
            orderBy: tokenId
          ) {
            tokenId
            mint {
              transactionHash # if = null => not minted yet, so it's available
              to # address who receives the token
              tokenData # data linked to token id, search ticker for SiBorg ad offer for example
            }
            marketplaceListings {
              id # listingId
              quantity
              token {
                tokenId

                nftContract {
                  id # = assetContract
                  royalty {
                    bps
                  }
                  owner {
                    newOwner
                    previousOwner
                  }
                  adOffers {
                    id
                    metadataURL # offerMetadata
                    disable
                  }
                  prices {
                    currency # ERC20 smart contract
                    amount # wei, mind decimals() function to transform in human readable value !
                    enabled
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
              bids(orderBy: totalBidAmount, orderDirection: desc, first: 1000) {
                  id
                  bidder
                  quantity
                  refundBonus
                  refundAmount
                  refundProfit
                  paidBidAmount
                  status
                  currency
                  creationTimestamp
                  lastUpdateTimestamp
                  creationTxHash
                  listing {
                    token {
                      tokenId
                      mint {
                        tokenData
                      }
                      nftContract {
                        adOffers(first: 1, orderBy: creationTimestamp, orderDirection: desc) {
                          id
                          name
                        }
                      }
                    }
                  }
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
            setInAllowList # to check is allowList (above) is true, define if is in allowlist
            # current ad data proposals, per adParameter
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

  type QueryType = {
    adOffers: {
      metadataURL: string;
      disable: boolean;
      name: string;
      admins: Address[];
      initialCreator: Address;
      id: string;
      allProposals: {
        id: string;
        adOffer: string;
        token: string;
        adParameter: string;
        status: string;
        data: string;
        rejectReason: string;
        creationTimestamp: string;
        lastUpdateTimestamp: string;
      }[];
      creationTimestamp: string;
      adParameters: {
        enable: boolean;
        adParameter: {
          id: string;
          base: string;
          variants: string[];
        };
      }[];
      nftContract: {
        id: string;
        prices: {
          currency: Address;
          amount: string;
          enabled: boolean;
        }[];
        owner: Address;
        tokens: {
          tokenId: string;
          mint: {
            transactionHash: string;
            to: Address;
            tokenData: string;
          };
          marketplaceListings: {
            id: string;
            quantity: string;
            token: {
              tokenId: string;
              nftContract: {
                id: string;
                royalty: {
                  bps: string;
                };
                owner: {
                  newOwner: Address;
                  previousOwner: Address;
                };
                adOffers: {
                  id: string;
                  metadataURL: string;
                  disable: boolean;
                }[];
                prices: {
                  currency: Address;
                  amount: string;
                  enabled: boolean;
                }[];
              };
              mint: {
                tokenData: string;
              };
            };
            listingType: string;
            currency: Address;
            reservePricePerToken: string;
            buyoutPricePerToken: string;
            bids: {
              id: string;
              bidder: Address;
              quantity: string;
              refundBonus: string;
              refundAmount: string;
              refundProfit: string;
              paidBidAmount: string;
              status: string;
              currency: Address;
              creationTimestamp: string;
              lastUpdateTimestamp: string;
              creationTxHash: string;
              listing: {
                token: {
                  tokenId: string;
                  mint: {
                    tokenData: string;
                  };
                  nftContract: {
                    adOffers: {
                      id: string;
                      name: string;
                    }[];
                  };
                };
              };
            }[];
            lister: Address;
            startTime: string;
            endTime: string;
            status: string;
            tokenType: string;
            transferType: string;
            rentalExpirationTimestamp: string;
          };
          setInAllowList: boolean;
          currentProposals: {
            adOffer: {
              id: string;
            };
            adParameter: {
              id: string;
              base: string;
              variants: string[];
            };
            acceptedProposal: {
              id: string;
              status: string;
              data: string;
              creationTimestamp: string;
            };
            pendingProposal: {
              id: string;
              status: string;
              data: string;
              creationTimestamp: string;
            };
            rejectedProposal: {
              id: string;
              status: string;
              data: string;
              rejectReason: string;
              creationTimestamp: string;
            };
          }[];
          allProposals: {
            adParameter: {
              id: string;
            };
            status: string;
            data: string;
            rejectReason: string;
            creationTimestamp: string;
            lastUpdateTimestamp: string;
          }[];
        }[];
      };
    }[];
  };

  const response = (await executeQuery(path.href, GET_DATA, {
    userAddress: userAddress
  })) as QueryType;
  const chainConfig = config[chainId];

  const resultMappedData = response?.adOffers
    .map((element) => {
      const sortByTokenId = element.nftContract.tokens.sort((a, b) => {
        const tokenIdA = BigInt(a.tokenId);
        const tokenIdB = BigInt(b.tokenId);
        if (tokenIdA < tokenIdB) return -1;
        if (tokenIdA > tokenIdB) return 1;
        return 0;
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
