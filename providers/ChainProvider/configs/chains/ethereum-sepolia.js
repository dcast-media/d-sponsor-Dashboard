export default {
  "chainName": "Ethereum Sepolia Testnet",
  "chainId": 11155111,
  "rpc": "https://ethereum-sepolia-rpc.publicnode.com",
  "nativeSymbol": "ETH",
  "graphApiUrl": "https://api.studio.thegraph.com/proxy/65744/dsponsor-sepolia/version/latest/",
  "relayerApiUrl":"https://relayer.dsponsor.com/api/11155111",
  "explorer": "https://sepolia.etherscan.io",
  "contracts": {
    "DSponsorAdmin": "0xdf42633BD40e8f46942e44a80F3A58d0Ec971f09"
  },
  "assets": {
    "USDC": {
      "contract": "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      "decimals": 6,
      "symbol": "USDC"
    },
    "USDT": {
      "contract": "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
      "decimals": 6,
      "symbol": "USDT"
    },
    "WNATIVE": {
      "contract": "0x543dDb01Ba47acB11de34891cD86B675F04840db",
      "decimals": 18,
      "symbol": "WNATIVE"
    },
    "NATIVE": {
      "contract": "0x0000000000000000000000000000000000000000",
      "decimals": 18,
      "symbol": "NATIVE"
    },
    "ETH": {
      "contract": "0x0000000000000000000000000000000000000000",
      "decimals": 18,
      "symbol": "ETH"
    },
    "WETH": {
      "contract": "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      "decimals": 18,
      "symbol": "WETH"
    }
  }
}
