export const GetAllAdOffers = async () => {
  // Requête pour récupérer tous les NewDSponsorNFTs
  const GET_DATA = `
    query Homepage_LastOffers {
      adOffers(orderBy: creationTimestamp, orderDirection: desc, first: 20, where: { and: [{ disable: false }] }) {
        id # offerId
        # --> Fetch and parse https://github.com/dcast-media/dips/blob/dip-0002/antho31/dip-0002.md#example-schema-json
        # to get creator & offer info  (you may have token_metadata info too)
        # offer.name, offer.image
        metadataURL

        nftContract {
          id # DSponsorNFT smart contract address
          allowList # defines if there is a token allowlist
          # default mint price
          prices(where: { enabled: true }) {
            currency # ERC20 smart contract
            amount # wei, mind decimals() function to transform in human readable value !
            enabled
          }

          # get all tokens
          tokens {
            tokenId
            mint {
              transactionHash # if = null => not minted yet, so it's available
            }
            setInAllowList # define if is in allowlist
          }
        }
      }
    }
  `;


  // Exécutez la requête pour obtenir tous les NFTs
  const resultat = await execute(GET_DATA, {});
return resultat.data.adOffers;
};

