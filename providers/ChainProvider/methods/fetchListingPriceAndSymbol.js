import {erc20Contract, ERC20SymbolsAndDecimals} from "../../../containers/MarketplaceContainer/marketplace.config";
import {readContract} from "thirdweb";
import getERC20Decimals from "../../../utils/getERC20Decimals";

export default async function fetchListingPriceAndSymbol(listing, chainId)  {
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
