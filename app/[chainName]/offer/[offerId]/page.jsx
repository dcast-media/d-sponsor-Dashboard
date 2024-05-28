import OfferPageContainer from "../../../../containers/OfferPageContainer/OfferPageContainer";
import {headers} from "next/headers";
import fetchOffer from "../../../../providers/ChainProvider/methods/fetchOffer";

export async function generateMetadata({
                                           params,
                                       }) {
    const offerId = params.offerId;
    const chainName = params.chainName;

    // We use headers as a way to get the chainID
    const headersList = headers()
    const chainID= headersList.get('chainID')

    const offer = await fetchOffer({chainID,offerId})

    return {
        title: `${offer?.metadata?.offer?.name} || DSponsor | smarter monetization for your content`,
        description: offer?.metadata?.offer?.description,
        keywords: `DSponsor, offer, ${offer?.metadata?.offer?.name}, ${offer?.metadata?.offer?.description}`,
    }
}
export default async function OfferPage({params}) {
    const offerId = params.offerId;


    // We use headers as a way to get the chainID
    const headersList = headers()
    const chainID= headersList.get('chainID')

    const offer = await fetchOffer({chainID,offerId})

    return (
        <div className="pt-[5.5rem] lg:pt-24">
            <div className="dark:bg-jacarta-800 relative py-16 md:py-24">
                <OfferPageContainer offerId={offerId} offer={offer} />
            </div>
        </div>
    )
}
