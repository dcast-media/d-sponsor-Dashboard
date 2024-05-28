import shuffleArray from "../../../utils/shuffleArray";
import fetchListingPriceAndSymbol from "./fetchListingPriceAndSymbol";
import fetchMarketplaceListings from "./fetchMarketplaceListings";

async function fetchRandomListingsForMarketplace(options) {
    const chainId = options?.chainId || "11155111";
    const listings = await fetchMarketplaceListings({ chainId });
    const listingsForBids = [];
    const listingsForBuyNow = [];

    const activeListings = listings.filter(
        (listing) =>
            Number(listing.endTime) > Math.floor(Date.now() / 1000) &&
            (listing.listingType === "Auction" || listing.listingType === "Direct")
    );

    //FIXME: Should return a new array instead of mutating the original one
    shuffleArray(activeListings);

    for (const listing of activeListings) {
        if (listingsForBids.length < 3 && listing.listingType === "Auction") {
            const listingForBidToAdd = await fetchListingPriceAndSymbol(
                listing,
                chainId
            );
            listingsForBids.push(listingForBidToAdd);
        } else if (
            listingsForBuyNow.length < 3 &&
            listing.listingType === "Direct"
        ) {
            const listingForBuyToAdd = await fetchListingPriceAndSymbol(
                listing,
                chainId
            );
            listingsForBuyNow.push(listingForBuyToAdd);
        }

        if (listingsForBids.length === 3 && listingsForBuyNow.length === 3) {
            break;
        }
    }
    return { listingsForBids, listingsForBuyNow };
}

export default fetchRandomListingsForMarketplace;
