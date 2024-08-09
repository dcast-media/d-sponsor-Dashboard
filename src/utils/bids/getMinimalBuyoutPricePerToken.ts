import { BigNumber } from "ethers";

/**
 * Calculates the minimal buyout price per token based on previous price, buyout price,
 * minimal auction basis points (bps), and bonus refund basis points (bps).
 *
 * This function determines the minimal price per token required to meet either:
 * 1. The price derived from adding a bonus refund to the previous price, or
 * 2. The price derived from applying minimal auction basis points to the previous price.
 *
 * If the previous price per token is greater than zero, it compares these two calculated prices
 * and returns the higher value. If the previous price is zero or not provided, it defaults to the
 * buyout price per token.
 *
 * @param {BigNumber} previousPricePerToken - The price per token from the previous sale or auction.
 *                                                   If not provided or zero, defaults to "0".
 * @param {BigNumber} buyoutPricePerToken - The buyout price per token for the current auction.
 * @param {number} minimalAuctionBps - The minimal auction basis points (bps) as a percentage multiplier.
 * @param {number} bonusRefundBps - The bonus refund basis points (bps) as a percentage multiplier.
 *
 * @returns {string} - The minimal buyout price per token as a string, which is either:
 *                      - The higher value between the required minimal price from the buyout price
 *                        and the minimal auction bps, or
 *                      - The buyout price per token if the previous price per token is zero or not provided.
 *
 * @example
 * // Example usage:
 * const previousPrice = "100";
 * const buyoutPrice = "120";
 * const minimalAuctionBps = 500; // 5%
 * const bonusRefundBps = 1000;   // 10%
 * const minimalPrice = getMinimalBuyoutPricePerToken(previousPrice, buyoutPrice, minimalAuctionBps, bonusRefundBps);
 * // `minimalPrice` will be the higher of:
 * // - 100 + (100 * 10%) = 110
 * // - 100 + (100 * 5%) = 105
 * // Result: "120" if it is greater than both, otherwise "110" or "105".
 */
export function getMinimalBuyoutPricePerToken(
  previousPricePerToken: BigNumber,
  buyoutPricePerToken: BigNumber,
  minimalAuctionBps: number,
  bonusRefundBps: number
) {
  previousPricePerToken = previousPricePerToken ?? "0";

  if (BigNumber.from(previousPricePerToken) > BigNumber.from("0")) {
    const requiredMinimalPricePerTokenFromBuyoutPrice = BigNumber.from(buyoutPricePerToken).add(
      BigNumber.from(previousPricePerToken)
        .mul(BigNumber.from(bonusRefundBps))
        .div(BigNumber.from("10000"))
    );

    const requiredMinimalPricePerTokenFromMinimalAuctionBps = BigNumber.from(
      previousPricePerToken
    ).add(
      BigNumber.from(previousPricePerToken)
        .mul(BigNumber.from(minimalAuctionBps))
        .div(BigNumber.from("10000"))
    );

    const result =
      requiredMinimalPricePerTokenFromBuyoutPrice >
      requiredMinimalPricePerTokenFromMinimalAuctionBps
        ? requiredMinimalPricePerTokenFromBuyoutPrice
        : requiredMinimalPricePerTokenFromMinimalAuctionBps;
    return result.toString();
  } else {
    return buyoutPricePerToken.toString();
  }
}
