import Network from "@/utils/networks/networks";
import contractABI from "@/abi/dsponsorAdmin.json";
import { Sepolia } from "@thirdweb-dev/chains";

const devEthereumSepolia = {
  chainId: 11155111,
  chainName: "sepolia",
  chainNameProvider: "sepolia",
  network: Network.ETH_SEPOLIA,
  chainObject: Sepolia,
  logoURL: "/images/ethereum-logo.png",
  explorerBaseUrl: "https://sepolia.etherscan.io",

  rpcURL: "https://ethereum-sepolia-rpc.publicnode.com",
  smartContracts: {
    NATIVE: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      symbol: "ETH"
    },
    WNATIVE: {
      address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
      symbol: "WETH"
    },
    USDC: {
      address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      decimals: 6,
      symbol: "USDC"
    },
    WETH: {
      address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
      symbol: "WETH"
    },
    UNISWAP_QUOTER: {
      address: "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3"
    },
    DSPONSORADMIN: {
      address: "0x10E0447dDB66f1d33E6b10dB5099FBa231ceCE5C",
      abi: contractABI
    },
    DSPONSORMP: {
      address: "0x0B7f100940f4152D01B42A626ab73f7A62dd7cdC"
    }
  },
  features: {
    crossmint: {
      enabled: true,
      config: {
        projectId: "82d192a5-c754-4280-a6cb-cb3d7b0f9bd9",
        priceLimit: 0.000005,

        bidCollectionId: "e22acedd-c541-40b7-b194-89c494fe0a9e",
        buyCollectionId: "a092b1ee-b2c0-42b7-aede-e4f67aab9e91",
        mintCollectionId: "9d83e973-d852-4b9d-80a8-0da10c8ae451",

        environment: "staging",

        currency: "EUR",
        locale: "en-EN",
        paymentMethod: "fiat"
      }
    }
  }
};

export default devEthereumSepolia;
