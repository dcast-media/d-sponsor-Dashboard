import Network from "@/utils/networks/networks";
import contractABI from "@/abi/dsponsorAdmin.json";
import { Base } from "@thirdweb-dev/chains";

const prodBase = {
  chainId: 8453,
  chainName: "base",
  chainNameProvider: "base",
  chainObject: Base,
  network: Network.BASE_MAINNET,
  logoURL: "/images/base-logo.png",
  explorerBaseUrl: "https://basescan.org",

  rpcURL: "https://mainnet.base.org",
  smartContracts: {
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
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      symbol: "USDC"
    },
    WETH: {
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      symbol: "WETH"
    },
    UNISWAP_QUOTER: {
      address: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a"
    },
    DSPONSORADMIN: {
      address: "0xC6cCe35375883872826DdF3C30557F16Ec4DD94c",
      abi: contractABI
    },
    DSPONSORMP: {
      address: "0x86aDf604B5B72d270654F3A0798cabeBC677C7fc"
    }
  },
  features: {
    crossmint: {
      enabled: false,

      config: {
        projectId: "82d192a5-c754-4280-a6cb-cb3d7b0f9bd9",
        priceLimit: 0.25,

        bidCollectionId: "",
        buyCollectionId: "",
        mintCollectionId: "",

        environment: "production",

        currency: "EUR",
        locale: "en-EN",
        paymentMethod: "fiat"
      }
    }
  }
};

export default prodBase;
