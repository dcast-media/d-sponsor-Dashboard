import React from "react";
import {headers} from "next/headers";
import TokenPageContainer from "../../../../../containers/TokenPageContainer/TokenPageContainer";
import fetchOfferToken from "../../../../../providers/ChainProvider/methods/fetchOfferToken";
import fetchMarketplaceListingForToken from "../../../../../providers/ChainProvider/methods/fetchMarketplaceListingForToken";

export async function generateMetadata({
                                           params,
                                       }) {
    const offerId = params.offerId;
    const tokenId = params.tokenId;
    const chainName = params.chainName;


    // We use headers as a way to get the chainID
    const headersList = headers()

    const offer = await fetchOfferToken({chainName,offerId,tokenId})

    return {
        title: `${offer?.metadata?.offer?.name} - Token ${tokenId} || DSponsor | smarter monetization for your content`,
        description: offer?.metadata?.offer?.description,
        keywords: `DSponsor, offer, ${offer?.metadata?.offer?.name}, ${offer?.metadata?.offer?.description}`,
    }
}
export default async function TokenPage({params}) {
    const offerId = params.offerId;
    const tokenId = params.tokenId;

    // We use headers as a way to get the chainID
    const headersList = headers()
    const chainID= headersList.get('chainID')

    const offer = await fetchOfferToken({chainID,offerId,tokenId})
    const listings = await fetchMarketplaceListingForToken({chainID,tokenId, offer})
    console.dir({listings},{depth:10})

    return (
        <div className="pt-[5.5rem] lg:pt-24">
            <div className="dark:bg-jacarta-800 relative py-16 md:py-24">
                <TokenPageContainer offerId={offerId} tokenId={tokenId} offer={offer} listings={listings}/>
            </div>
        </div>
    )
}
