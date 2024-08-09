//https://github.com/alchemyplatform/alchemy-sdk-js/blob/ff5c576ddb5b23eb9f4a2b5c7a7f725dcdc9c091/src/util/const.ts#L45
const networks = {
  ETH_MAINNET: "mainnet",
  ETH_GOERLI: "goerli",
  ETH_SEPOLIA: "sepolia",
  OPT_MAINNET: "optimism",
  OPT_GOERLI: "optimism-goerli",
  OPT_SEPOLIA: "optimism-sepolia",
  ARB_MAINNET: "arbitrum",
  ARB_GOERLI: "arbitrum-goerli",
  ARB_SEPOLIA: "arbitrum-sepolia",
  MATIC_MAINNET: "matic",
  MATIC_MUMBAI: "maticmum",
  MATIC_AMOY: "maticamoy",
  ASTAR_MAINNET: "astar-mainnet",
  POLYGONZKEVM_MAINNET: "polygonzkevm-mainnet",
  POLYGONZKEVM_TESTNET: "polygonzkevm-testnet",
  BASE_MAINNET: "base",
  BASE_GOERLI: "base-goerli",
  BASE_SEPOLIA: "base-sepolia",
  ZKSYNC_MAINNET: "zksync-mainnet",
  ZKSYNC_SEPOLIA: "zksync-sepolia"
};

export type NetworkType = (typeof networks)[keyof typeof networks];

export default networks;
