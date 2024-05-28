export default function getChainId(chainName) {
    switch (chainName) {
        case 'sepolia':
            return 11155111;
        case 'arbitrum-one':
            return 42161;
        case 'arbitrum-sepolia':
            return 421614;
        case 'polygon-mumbai':
            return 80001;
        case 'polygon':
            return 137;
        case 'ethereum':
            return 1;
        default:
            console.warn(`Unknown chainName: ${chainName} - Using default chainId: 11155111`);
            return getChainId('sepolia');
    }
}
