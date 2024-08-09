import { BigNumber } from "ethers";

/**
 * Calculates the minimal bid price per token based on the previous price, reserve price,
 * and minimal auction basis points (bps). This function is useful for determining the
 * minimum bid amount required in an auction setting.
 *
 * @param {BigNumber} previousPricePerToken - The previous price per token. If not provided,
 *                                                   it defaults to "0". It should be a numeric value
 *                                                   in string format or a number.
 * @param {BigNumber} reservePricePerToken - The reserve price per token. This is the minimum
 *                                                  price that must be met if the previous price is zero
 *                                                  or not available. It should be a numeric value
 *                                                  in string format or a number.
 * @param {number} minimalAuctionBps - The minimal auction basis points (bps) to be applied. This is used
 *                                     to calculate the minimum increase percentage for the bid price.
 *                                     It should be an integer representing the bps.
 *
 * @returns {string} - The calculated minimal bid price per token as a string. This value is computed as:
 *                      - The previous price plus a percentage based on the minimal auction bps if the
 *                        previous price is greater than zero, or
 *                      - The reserve price per token if the previous price is zero or not available.
 *
 * @example
 * // Example usage:
 * const previousPrice = "100";
 * const reservePrice = "90";
 * const bps = 500; // 5% in bps
 * const minimalBid = getMinimalBidPerToken(previousPrice, reservePrice, bps);
 * // `minimalBid` will be "105", which is 100 + 5% of 100.
 *
 * // If the previous price is not provided:
 * const minimalBidWithReserve = getMinimalBidPerToken(null, reservePrice, bps);
 * // `minimalBidWithReserve` will be "90", the reserve price.
 */
export function getMinimalBidPerToken(
  previousPricePerToken: BigNumber,
  reservePricePerToken: BigNumber,
  minimalAuctionBps: number
) {
  previousPricePerToken = previousPricePerToken ?? "0";

  const requiredMinimalPricePerToken =
    BigNumber.from(previousPricePerToken) > BigNumber.from("0")
      ? BigNumber.from(previousPricePerToken)
          .mul(BigNumber.from(minimalAuctionBps))
          .div(BigNumber.from("10000"))
          .add(BigNumber.from(previousPricePerToken))
      : BigNumber.from(reservePricePerToken);

  return requiredMinimalPricePerToken.toString();
}
