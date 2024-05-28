// import getChainId from "./getChainId.js";

export default async function fetchOfferToken(options) {

    const chainName = options?.chainName || 'sepolia'
    // const chainId = getChainId(chainName);
    const chainId = 11155111;
    const offerId = options?.offerId;
    const tokenId = options?.tokenId;

    console.log({chainName, chainId, offerId, tokenId})
    if(!offerId || !tokenId) {
        console.trace('Missing offerId or tokenId')
        return null;
    }


    const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);
    const query = ` query TokenOfferDetails {
      # replace by the $offerId
      adOffers(where: { id: "${options.offerId.toString()}" }) {
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
          tokens(where: { tokenId: "${options.tokenId.toString()}" }) {
            
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
    }`;

    const start = new Date();
    const response = await fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query})
    });
    const json = await response.json();
    const offer = json?.data?.adOffers?.[0] ?? null;
    console.info(` ✓ [Relayer] ${new Date().toISOString()} [FETCH][${chainId}]: Token Offer <${offerId}:${tokenId}> in ${new Date() - start}ms - Has offer: ${!!offer}`);
    return offer;

}
