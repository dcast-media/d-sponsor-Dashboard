import HomePageContainer from '../containers/HomePage/HomePageContainer';
import fetchLastOffers from "../providers/ChainProvider/methods/fetchLastOffers";
export default async function DefaultPage() {
    const chainID = 11155111;
    const lastOffers = await fetchLastOffers(chainID);
    return <HomePageContainer lastOffers={lastOffers} />
}
