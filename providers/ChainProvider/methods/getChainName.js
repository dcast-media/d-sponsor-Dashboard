export default function getChainName(chainId) {
    const id = parseInt(chainId);
    switch (id) {
        case 11155111:
            return 'sepolia';
        case 42161:
            return 'arbitrum-one';
        case 421614:
            return 'arbitrum-sepolia';
        case 80001:
            return 'polygon-mumbai';
        case 137:
            return 'polygon';
        case 1:
            return 'ethereum';
        default:
            console.warn(`Unknown chainId: ${chainId} - Using default chainId: 11155111`);
            return getChainName(11155111);
    }
}
