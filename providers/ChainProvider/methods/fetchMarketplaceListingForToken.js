export default async function fetchMarketplaceListingForToken(options) {
    const chainId = options?.chainId || '11155111';
    const tokenId = options?.tokenId || null;
    const nftContractAddress = options?.offer?.nftContract.id || null;

    const path = new URL(`https://relayer.dsponsor.com/api/${chainId}/graph`);
    const query = `query getMarketplaceListingsForToken {
            marketplaceListings(
                orderBy: id, orderDirection: desc
            where: {
                token_ : { id: "${nftContractAddress}-${tokenId}"}
            }
        ) {
        
                id # listingId
        
            # METADATA - if INVALID, ignore this listing
            # try to fetch metadataURL
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
                        adOffers {
                            metadataURL # offerMetadata
                        }
                        royaltyBps # bps -> 690 == 6.90 %
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
        }`

    const start = new Date();
    const response = await fetch(path,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query})
    });
    console.info(` ✓ [Relayer] ${new Date().toISOString()} [FETCH]: last market listing for token in ${new Date() - start}ms`);
    const json = await response.json();
    const listings = json?.data?.marketplaceListings ?? [];
    return listings;
}
