const fetchMarketplaceListings = async (options) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const chainId = options?.chainId || '11155111';
    const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);

    const query = `query getAllMarketplaceListings {
      # totalListings = data.marketplaceListings.length
      marketplaceListings(
        orderBy: endTime
        orderDirection: asc
        where: {
          and: [
            {
              status: CREATED
              quantity_gt: 0
              startTime_lte: ${currentTimestamp} 
              endTime_gte: ${currentTimestamp} 
            }
          ]
        }
      ) {
        id # listingId
        token {
          tokenId
          nftContract {
            id # = assetContract
            adOffers {
              id
              name
              metadataURL # offerMetadata
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
        bids(orderBy: totalBidAmount, orderDirection: desc, first: 1) {
          bidder
          totalBidAmount
          status
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
  `;

    const start = new Date();
    const response = await fetch(path,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query})
    });
    console.info(` ✓ [Relayer] ${new Date().toISOString()} [FETCH]: all marketplace listings - ${new Date() - start}ms`);
    const json = await response.json();
    const listings = json?.data?.marketplaceListings ?? [];
    return listings;
};

export default fetchMarketplaceListings;
