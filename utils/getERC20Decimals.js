import {erc20Contract} from "../containers/MarketplaceContainer/marketplace.config";
import {readContract} from "thirdweb";

export default async function getERC20Decimals(currencyContractAddress, chainId) {
    const erc20ContractAdd = erc20Contract(chainId, currencyContractAddress);

    const decimalsResponse = await readContract({
        contract: erc20ContractAdd,
        method: "decimals",
    });

    return { decimals: decimalsResponse };
};
