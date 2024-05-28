import { readContract, getContract, sendTransaction } from "thirdweb";
import {
  erc20Contract,
  ERC20SymbolsAndDecimals,
  // queryClient,
} from "../../containers/MarketplaceContainer/marketplace.config.js";
// import { gql } from "@apollo/client";
import { fetchDataFromIPFS } from "../../data/services/ipfsService";

//////////////////////////////////////////////////////////////////////////
/////////////////////////// for /marketplace ////////////////////////////
//////////////////////////////////////////////////////////////////////////
const fetchAllMpListings = async () => {
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const GET_ALL_MP_LISTINGS_DATA = gql`
    query getAllMarketplaceListings {
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

  try {
    // const { data } = await queryClient.query({
    //   query: GET_ALL_MP_LISTINGS_DATA,
    // });

    return data;
  } catch (error) {
    console.log("Error fetching all mp listings", error);
    return null;
  }
};

// for /marketplace : func to fetch 3 random listings
async function fetchRandomListingsForMarketplace(chainId) {
  const allMpListings = await fetchAllMpListings();
  const listingsForBids = [];
  const listingsForBuyNow = [];

  const activeListings = allMpListings.marketplaceListings.filter(
    (listing) =>
      Number(listing.endTime) > Math.floor(Date.now() / 1000) &&
      (listing.listingType === "Auction" || listing.listingType === "Direct")
  );
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

// for /marketplace && /user-view
const fetchListingPriceAndSymbol = async (listing, chainId) => {
  let decimals;

  const erc20ContractAdd = erc20Contract(chainId, listing.currency);
  const symbol = await readContract({
    contract: erc20ContractAdd,
    method: "symbol",
  });

  if (symbol === "USDC" || symbol === "WETH") {
    decimals = ERC20SymbolsAndDecimals[symbol].decimals;
  } else {
    const { decimals: fetchedDecimals } = await getERC20Decimals(
      erc20ContractAdd,
      chainId
    );
    decimals = fetchedDecimals;
  }

  if (listing.listingType === "Auction") {
    const reservePricePerToken =
      Number(listing.reservePricePerToken) / 10 ** decimals;
    let winningBidPricePerToken = 0;
    if (listing.bids.length > 0) {
      winningBidPricePerToken = listing.bids[0].totalBidAmount / 10 ** decimals;
    }
    return {
      ...listing,
      symbol,
      decimals,
      price: Math.max(winningBidPricePerToken, reservePricePerToken),
    };
  } else if (listing.listingType === "Direct") {
    const buyoutPricePerToken =
      Number(listing.buyoutPricePerToken) / 10 ** decimals;
    return { ...listing, symbol, decimals, price: buyoutPricePerToken };
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// for listingWpriceAndSymbol
const getERC20Decimals = async (currencyContractAddress, chainId) => {
  const erc20ContractAdd = erc20Contract(chainId, currencyContractAddress);

  const decimalsResponse = await readContract({
    contract: erc20ContractAdd,
    method: "decimals",
  });

  return { decimals: decimalsResponse };
};

//////////////////////////////////////////////////////////////////////////
/////////////////////////// for /user-view ////////////////////////////
//////////////////////////////////////////////////////////////////////////

// for /marketplace/assetContract/tokenId (user-view)
export const fetchFirstValidListing = async (assetContract, tokenId) => {
  const GET_ALL_LISTINGS_DATA = gql`
    query getMarketplaceListingsForToken ($assetContract: Bytes, $tokenId: BigInt) {
    
      marketplaceListings(    
        orderBy: id, orderDirection: desc
        where: {        
            token_ : { id: "${assetContract}-${tokenId}"}      
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
              id
              name
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
   }
  `;

  try {
    const { data } = await queryClient.query({
      query: GET_ALL_LISTINGS_DATA,
    });
    const listings = data.marketplaceListings;

    // no listing
    if (listings.length === 0) {
      return { error: "No listings available" };
    }

    //finding the first valid one
    for (const listing of listings) {
      if (isValidListing(listing)) {
        return listing;
      } else if (
        !isValidListing(listing) ||
        listing.status === "CANCELLED" ||
        listing.status === "UNSET" ||
        listing.status === "COMPLETED"
      ) {
        return { error: "No valid listing available" };
      }
    }
  } catch (error) {
    console.log("Error fetching latest listing id:", error);
    return null;
  }
};

const isValidListing = (listing) => {
  return (
    listing.token &&
    listing.token.nftContract &&
    listing.token.nftContract.adOffers &&
    listing.token.nftContract.adOffers.length > 0
  );
};

//////////////////////////////////////////////////////////////////////////
/////////////////////////// for listing ad OFFER ////////////////////////////
//////////////////////////////////////////////////////////////////////////
export const fetchListingAdOffer = async (listing) => {
  try {
    const tokenData = listing.token.mint.tokenData;
    const offerMetadata = listing.token.nftContract.adOffers[0].metadataURL;

    if (!offerMetadata) {
      console.log("no offer metadata found for listing : ", listing);
      return null;
    }

    const parsedOfferInformation = await parseOfferMetadata(
      offerMetadata,
      tokenData
    );
    return { ...listing, offer: parsedOfferInformation };
  } catch (error) {
    console.log("Error fetching item info:", error);
    return null;
  }
};

export const parseOfferMetadata = async (offerMetadata, tokenData) => {
  if (!offerMetadata) return {};

  const isIPFSLink = offerMetadata.startsWith("ipfs://");
  const isHTTPSLink = offerMetadata.startsWith("https://");

  let metadataUrl = "";

  if (isIPFSLink) {
    const ipfsHash = offerMetadata.split("ipfs://")[1];
    metadataUrl = `https://nftstorage.link/ipfs/${ipfsHash}`;
  } else if (isHTTPSLink) {
    metadataUrl = offerMetadata;
  }
  const ipfsData = await fetchDataFromIPFS(metadataUrl);
  if (!ipfsData.offer || !ipfsData.offer.token_metadata) return {};

  const parsed_token_metadata = ipfsData.offer.token_metadata;

  ipfsData.offer.description = parsed_token_metadata.description.replace(
    /{tokenData}/g,
    tokenData
  );
  ipfsData.offer.image = parsed_token_metadata.image.replace(
    /{tokenData}/g,
    tokenData
  );
  ipfsData.offer.name = parsed_token_metadata.name.replace(
    /{tokenData}/g,
    tokenData
  );

  return ipfsData.offer;
};

export {
  fetchAllMpListings,
  fetchRandomListingsForMarketplace,
  fetchListingPriceAndSymbol,
};
