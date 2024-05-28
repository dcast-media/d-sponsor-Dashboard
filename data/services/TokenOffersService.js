// import { execute } from "../../.graphclient";
// import { gql } from "@apollo/client";

export const GetTokenAdOffer = async (offerId, tokenId) => {
  // Requête pour récupérer tous les NewDSponsorNFTs
  const GET_DATA = `
    query TokenOfferDetails($offerId: ID!, $tokenId: ID!) {
      # replace by the $offerId
      adOffers(where: { id: $offerId }) {
        # METADATA - if INVALID, ignore this listing
        # try to fetch metadataURL
        # if tokenData?.length
        #    if offerMetadata.offer.token_metadata.name exists => replace all {tokenData} by tokenData value
        #    (same for offerMetadata.offer.token_metadata.description & offerMetadata.offer.token_metadata.image)
        # NAME = offerMetadata.offer.token_metadata.name || offerMetadata.offer.name || "(Invalid name)"
        # DESCRIPTION = offerMetadata.offer.token_metadata.description || offerMetadata.offer.description || "(Invalid description)"
        # IMAGE = offerMetadata.offer.token_metadata.image || offerMetadata.offer.image || defaultImage (ex: d>sponsor logo)
        metadataURL

        initialCreator # from which address the offer has been created
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
          allowList # defines if there is a token allowlist
          royaltyBps # creator royalties (690 = 6.90%)
          # default mint price
          prices(where: { enabled: true }) {
            currency # ERC20 smart contract
            amount # wei, mind decimals() function to transform in human readable value !
            enabled
          }

          # to replace by $tokenId
          tokens(where: { tokenId: $tokenId }) {
            
            tokenId
            mint {
              transactionHash # if = null => not minted yet, so it's available
              to # address who receives the token
              tokenData # data linked to token id, search ticker for SiBorg ad offer for example
            }
            setInAllowList # to check is allowList (above) is true, define if is in allowlist
            # current ad data proposals, per adParameter
            currentProposals {
              adParameter {
                id
                base
                variants
              }
              acceptedProposal {
                id
                data
              }
              pendingProposal {
                id
                data
              }
              rejectedProposal {
                id
                data
                rejectReason
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

  throw new Error("Not implemented yet");
  // Exécutez la requête pour obtenir tous les NFTs
  // const resultat = await execute(GET_DATA, { offerId: offerId, tokenId: tokenId});

 // return resultat?.data?.adOffers[0];
};
export const GetAdOffer = async (offerId) => {
  // Requête pour récupérer tous les NewDSponsorNFTs
  const GET_DATA = `
    query TokenOfferDetails($offerId: ID!) {
      # replace by the $offerId
      adOffers(where: { id: $offerId }) {
        # METADATA - if INVALID, ignore this listing
        # try to fetch metadataURL
        # if tokenData?.length
        #    if offerMetadata.offer.token_metadata.name exists => replace all {tokenData} by tokenData value
        #    (same for offerMetadata.offer.token_metadata.description & offerMetadata.offer.token_metadata.image)
        # NAME = offerMetadata.offer.token_metadata.name || offerMetadata.offer.name || "(Invalid name)"
        # DESCRIPTION = offerMetadata.offer.token_metadata.description || offerMetadata.offer.description || "(Invalid description)"
        # IMAGE = offerMetadata.offer.token_metadata.image || offerMetadata.offer.image || defaultImage (ex: d>sponsor logo)
        metadataURL

        initialCreator # from which address the offer has been created
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
          allowList # defines if there is a token allowlist
          royaltyBps # creator royalties (690 = 6.90%)
          # default mint price
          prices(where: { enabled: true }) {
            currency # ERC20 smart contract
            amount # wei, mind decimals() function to transform in human readable value !
            enabled
          }

          # to replace by $tokenId
          tokens {
            tokenId
            mint {
              transactionHash # if = null => not minted yet, so it's available
              to # address who receives the token
              tokenData # data linked to token id, search ticker for SiBorg ad offer for example
            }
            setInAllowList # to check is allowList (above) is true, define if is in allowlist
            # current ad data proposals, per adParameter
            currentProposals {
              adParameter {
                id
                base
                variants
              }
              acceptedProposal {
                data
              }
              pendingProposal {
                id
                data
              }
              rejectedProposal {
                data
                rejectReason
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

    throw new Error("Not implemented yet");

  // Exécutez la requête pour obtenir tous les NFTs
  // const resultat = await execute(GET_DATA, { offerId: offerId});
  //   console.log(resultat);
  // return resultat?.data?.adOffers[0];
};
export const GetAllTokenbyOfferForAUser = async (ownerAddress) => {

const options = { method: "GET", headers: { accept: "application/json" } };
let nftFilterIds;
 try {
   const response = await fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?owner=${ownerAddress}&withMetadata=true&pageSize=100`, options);
   const data = await response.json();


  nftFilterIds = data.ownedNfts.map(({ contract: { address }, tokenId }) => `${address.toLowerCase()}-${tokenId}`);

 } catch (err) {
   console.error(err);
   return;
 }
  const GET_DATA = `
    query AdSpacesOwnedByUser($ids: [ID!]) {
      tokens(where: { id_in: $ids }, first: 1000) {
        id
        tokenId

        nftContract {
          id
          adOffers {
            metadataURL
            id
            adParameters(where: { enable: true }) {
              enable
              adParameter {
                id # adParameter value, ex: imageURL-320x50 or linkURL
                base # ex: imageURL or linkURL
                variants # ex: ["320x50"]
              }
            }
          }
        }

        tokenId

        user {
          user # user address if rented
          expires # need to check if rent is not expired
        }

        mint {
          transactionHash
          tokenData # data linked to token id, search ticker for SiBorg ad offer for example
        }

        # current ad data proposals, per adParameter
        currentProposals {
          adOffer {
            id # offerId
            metadataURL
          }
          adParameter {
            id # base-variants.join('-')
            base
            variants
          }
          acceptedProposal {
            id # proposalID
            data
          }
          pendingProposal {
            id # proposalID
            data
          }
          rejectedProposal {
            id # proposalID
            data
            rejectReason
          }
        }

        # proposal submissions history
        allProposals(orderBy: creationTimestamp, orderDirection: desc) {
          adParameter {
            id
          }
          adOffer {
            id # offerId
            metadataURL
          }
          status
          data
          rejectReason
          creationTimestamp
          lastUpdateTimestamp
        }
      }
    }
  `;

    throw new Error("Not implemented yet");

    // Exécutez la requête pour obtenir tous les NFTs
  // const resultat = await execute(GET_DATA, { ids: nftFilterIds });

  // return resultat.data.tokens;
};

