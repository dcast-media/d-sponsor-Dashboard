import { describe, it, expect } from "vitest";
import activityToTopSpenders from "../utils/activityToTopSpenders";

describe("activityToTopSpenders", () => {
  const mockActivity = [
    {
      spendersRank: 1,
      usdcAmounts: {
        totalSpent: "1000"
      },
      displayAddr: "0x9a7F...e766",
      addr: "0x9a7FAC267228f536A8f250E65d7C4CA7d39De766",
      balance: 10,
      chainId: 11155111,
      currenciesAmounts: {
        "0x123": {
          totalSpent: "1000"
        }
      }
    },
    {
      spendersRank: 2,
      usdcAmounts: {
        totalSpent: "500"
      },
      displayAddr: "0x9a7F...e766",
      addr: "0x9a7FAC267228f536A8f250E65d7C4CA7d39De766",
      balance: 5,
      chainId: 11155111
      // No currenciesAmounts provided here
    }
  ];

  it("should format activity data correctly", () => {
    const result = activityToTopSpenders(mockActivity);
    expect(result).toEqual([
      {
        rank: 1,
        totalSpent: "1000",
        address: "0x9a7FAC267228f536A8f250E65d7C4CA7d39De766",
        addressDisplay: "0x9a7F...e766",
        dPoints: 0,
        balance: 10,
        chainId: 11155111,
        details: [
          {
            currency: "0x123",
            totalSpent: "1000"
          }
        ]
      },
      {
        rank: 2,
        totalSpent: "500",
        address: "0x9a7FAC267228f536A8f250E65d7C4CA7d39De766",
        addressDisplay: "0x9a7F...e766",
        dPoints: 0,
        balance: 5,
        chainId: 11155111,
        details: []
      }
    ]);
  });
});
