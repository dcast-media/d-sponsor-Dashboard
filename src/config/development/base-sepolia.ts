import Network from "@/utils/networks/networks";
import { Base } from "@thirdweb-dev/chains";
import contractABI from "@/abi/dsponsorAdmin.json";

const devBaseSepolia = {
  chainId: 84532,
  chainName: "base-sepolia",
  chainNameProvider: "base-sepolia-testnet",
  network: Network.BASE_SEPOLIA,
  chainObject: Base,
  logoURL: "/images/base-logo.png",
  explorerBaseURL: "https://sepolia.basescan.org",
  relayerURL: process.env.DEV ? process.env.DEV : "https://relayer.dsponsor.com",
  rpcURL: "https://sepolia.base.org",
  subgraphURL: "https://api.studio.thegraph.com/proxy/65744/dsponsor-base-sepolia/version/latest",
  smartContracts: {
    DSPONSORADMIN: {
      address: "0x5cF7F046818E5Dd71bd3E004f2040E0e3C59467D",
      feeBps: "400",
      abi: contractABI
    },
    DSPONSORMP: {
      address: "0xdf42633BD40e8f46942e44a80F3A58d0Ec971f09",
      feeBps: "400",
      minimalBidBps: "1000",
      previousBidAmountBps: "500"
    },
    NATIVE: {
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      symbol: "ETH"
    },
    WNATIVE: {
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      symbol: "WETH"
    },
    USDC: {
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimals: 6,
      symbol: "USDC"
    },
    WETH: {
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      symbol: "WETH"
    },
    UNISWAP_QUOTER: {
      address: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6" // "0xC5290058841028F1614F3A6F0F5816cAd0df5E27"
    }
  },

  features: {
    crossmint: {
      enabled: true,
      config: {
        projectId: "82d192a5-c754-4280-a6cb-cb3d7b0f9bd9",
        priceLimit: 0.25,

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

export default devBaseSepolia;
