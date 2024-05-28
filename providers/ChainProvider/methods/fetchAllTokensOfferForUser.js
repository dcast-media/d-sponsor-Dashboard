export default async function fetchAllTokensOfferForUser(userAddress, options) {
    const chainId = options?.chainId || '11155111';

    const graphPath = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);
    const nftPath = new URL(`https://relayer.dsponsor.com/api/${chainId}/account/${userAddress}/tokens`);

    let nftFilterIds;
    const response = await fetch(nftPath, {
        method: "GET",
        headers: {
            accept: "application/json"
        }
    });
    const ownedNfts = await response.json();

    // nftFilterIds = ownedNfts.map(({contract: {address}, tokenId}) => `${address.toLowerCase()}-${tokenId}`);
    nftFilterIds = ownedNfts.map(({nftContract: {id}, id: tokenId}) => `${id.toLowerCase()}-${tokenId}`);

    const query = `
        query AdSpacesOwnedByUser($ids: [ID!]) {
      tokens(where: { id_in: [${nftFilterIds.map(id => `"${id}"`).join(', ')}] }, first: 1000) {
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
    }`;

    const start = new Date();
    const responseGraph = await fetch(graphPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query})
    });
    console.info(` ✓ [Relayer] ${new Date().toISOString()} [FETCH]: last user ${userAddress} offers in ${new Date() - start}ms`);
    const json = await responseGraph.json();
    console.log({json})
    return json?.data?.tokens ?? [];
}
