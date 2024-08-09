import { BigNumber } from "ethers";
import { getMinimalBidPerToken } from "@/utils/bids/getMinimalBidPerToken";
import { getMinimalBuyoutPricePerToken } from "@/utils/bids/getMinimalBuyoutPricePerToken";

/**
 * Computes various bid-related amounts and checks for errors based on the auction parameters.
 * This function handles calculations for bid validation, bonus rewards, and payment distribution.
 *
 * @param {BigNumber} newBidPerToken - The bid amount per token that the new bidder is willing to pay.
 * @param {BigNumber} quantity - The number of tokens being bid on.
 * @param {BigNumber} reservePricePerToken - The minimum price per token that must be met or exceeded.
 * @param {BigNumber} buyoutPricePerToken - The price per token at which the auction will end immediately.
 * @param {BigNumber} previousPricePerToken - The price per token from the previous bid.
 * @param {BigNumber} minimalAuctionBps - The minimum basis points (bps) for the auction.
 * @param {number} bonusRefundBps - The basis points used to calculate the bonus refund for the previous bidder.
 * @param {number} royaltyBps - The basis points allocated to the creator as a royalty.
 * @param {number} protocolFeeBps - The basis points allocated to the protocol as a fee.
 *
 * @returns {Object} An object containing all the calculated values related to the bid,
 *                   such as minimal bid amounts, bonus refunds, and distribution of funds.
 *
 * @example
 * const result = computeBidAmounts(
 *   BigNumber.from("500000000000000000"), // newBidPerToken (0.5 ETH)
 *   BigNumber.from("1"),                  // quantity
 *   BigNumber.from("300000000000000000"), // reservePricePerToken (0.3 ETH)
 *   BigNumber.from("1000000000000000000"), // buyoutPricePerToken (1 ETH)
 *   BigNumber.from("450000000000000000"),  // previousPricePerToken (0.45 ETH)
 *   BigNumber.from("500"),                // minimalAuctionBps (5%)
 *   BigNumber.from("100"),                // bonusRefundBps (1%)
 *   BigNumber.from("200"),                // royaltyBps (2%)
 *   BigNumber.from("50")                  // protocolFeeBps (0.5%)
 * );
 *
 * console.log(result);
 *
 * // The result object will contain all computed values such as:
 * // - minimalBidPerToken
 * // - minimalBuyoutPerToken
 * // - nextReservePricePerToken
 * // - totalBidAmount
 * // - refundBonusAmount
 * // - newAmount
 * // - protocolFeeAmount
 * // - royaltyAmount
 * // - listerAmount
 */
export function computeBidAmounts(
  newBidPerToken: BigNumber,
  quantity: BigNumber,
  reservePricePerToken: BigNumber,
  buyoutPricePerToken: BigNumber,
  previousPricePerToken: BigNumber,
  minimalAuctionBps: number,
  bonusRefundBps: number,
  royaltyBps: number,
  protocolFeeBps: number
) {
  const totalBidAmount = newBidPerToken.mul(quantity);

  previousPricePerToken = previousPricePerToken ?? "0";

  const errors: string[] = [];

  if (BigNumber.from(quantity) <= BigNumber.from("0")) {
    errors.push("Quantity must be greater than 0");
  }

  if (BigNumber.from(minimalAuctionBps) <= BigNumber.from(bonusRefundBps)) {
    errors.push("Minimal auction bps must be greater than bonus reward bps");
  }

  const minimalBidPerToken = BigNumber.from(
    getMinimalBidPerToken(previousPricePerToken, reservePricePerToken, minimalAuctionBps)
  );

  const minimalBuyoutPerToken = getMinimalBuyoutPricePerToken(
    previousPricePerToken,
    buyoutPricePerToken,
    minimalAuctionBps,
    bonusRefundBps
  );

  if (newBidPerToken < minimalBidPerToken) {
    errors.push(
      `New bid per token must be greater than ${minimalBidPerToken.toString()} (minimal bid per token) - ${newBidPerToken.toString()}`
    );
  }

  const refundBonusPerToken = BigNumber.from(bonusRefundBps)
    .mul(BigNumber.from(previousPricePerToken))
    .div(BigNumber.from("10000"));

  const refundBonusAmount = BigNumber.from(quantity).mul(refundBonusPerToken);

  const refundAmountToPreviousBidder = BigNumber.from(quantity)
    .mul(BigNumber.from(previousPricePerToken))
    .add(refundBonusAmount);

  if (refundAmountToPreviousBidder.gte(totalBidAmount)) {
    errors.push("Reward exceeds new bid amount");
  }

  const newPricePerToken = BigNumber.from(newBidPerToken).sub(refundBonusPerToken);
  const newAmount = newPricePerToken.mul(BigNumber.from(quantity));

  const newRefundBonusPerToken = BigNumber.from(bonusRefundBps)
    .mul(newPricePerToken)
    .div(BigNumber.from("10000"));
  const newRefundBonusAmount = BigNumber.from(quantity).mul(newRefundBonusPerToken);

  const newRefundAmount = newAmount.add(newRefundBonusAmount);
  const newProfitAmount = newRefundAmount.sub(totalBidAmount);

  const protocolFeeAmount = BigNumber.from(newAmount)
    .mul(BigNumber.from(protocolFeeBps))
    .div(BigNumber.from("10000"));
  const royaltyAmount = BigNumber.from(newAmount)
    .mul(BigNumber.from(royaltyBps))
    .div(BigNumber.from("10000"));
  const listerAmount = BigNumber.from(newAmount).sub(protocolFeeAmount).sub(royaltyAmount);

  const nextReservePricePerToken = newAmount.mul(BigNumber.from("110")).div(BigNumber.from("100"));

  // note: if quantity = 1 :
  // - newBidPerToken = totalBidAmount
  // - refundBonusPerToken = refundBonusAmount
  // - newPricePerToken = newAmount
  // - newRefundBonusPerToken = newRefundBonusAmount

  if (errors.length) {
    console.error("errors on bid amounts", errors);
  }

  return {
    minimalBidPerToken: minimalBidPerToken.toString(),
    minimalBuyoutPerToken,
    nextReservePricePerToken: nextReservePricePerToken.toString(),

    newBidPerToken: newBidPerToken.toString(),
    totalBidAmount: totalBidAmount.toString(), // how much the bidder will pay => refundBonusAmount + newAmount

    /**
     * details about the price
     */
    refundBonusPerToken: refundBonusPerToken.toString(),
    refundBonusAmount: refundBonusAmount.toString(), // bonus the previous bidder will get
    refundAmountToPreviousBidder: refundAmountToPreviousBidder.toString(),

    newPricePerToken: newPricePerToken.toString(),
    newAmount: newAmount.toString(), // next bid amount

    /**
     * if another valid bid is placed...
     */
    newRefundBonusPerToken: newRefundBonusPerToken.toString(),
    newRefundBonusAmount: newRefundBonusAmount.toString(),
    newRefundAmount: newRefundAmount.toString(), // how much the bidder will receive if he is outbid
    newProfitAmount: newProfitAmount.toString(), // profit amount the bidder will receive if he is outbid

    /**
     * else if bid is successful (bidder will receive nft, no reward / no refund)
     */
    protocolFeeAmount: protocolFeeAmount.toString(), // how much the protocol will receive
    royaltyAmount: royaltyAmount.toString(), // how much the creator will receive
    listerAmount: listerAmount.toString() // how much the lister will receive
  };
}
