import { isAddress } from "ethers/lib/utils";

/**
 * Shortens an Ethereum address to a more readable format.
 *
 * This function takes an Ethereum address and shortens it to a format that includes
 * only the first 6 and the last 4 characters of the address, separated by an ellipsis (`...`).
 * This makes the address easier to display in a user interface, while still keeping enough
 * of the address to differentiate between addresses.
 *
 * If the input is the string "You", it returns "You" as is. If the input is not a valid Ethereum
 * address, it returns "unknown.eth".
 *
 * @param {Address} address - The Ethereum address to be shortened. This should be a valid Ethereum address
 *                            or a string like "You".
 * @returns {string} - A shortened version of the address in the format `0x1234...abcd`, "unknown.eth"
 *                      if the address is invalid, or "You" if the input address is "You".
 *
 * @example
 * // Example usage:
 * const address = "0x1234567890abcdef1234567890abcdef12345678";
 * const shortAddress = shortenAddress(address);
 * // `shortAddress` will be "0x123456...5678".
 *
 * // If the address is invalid:
 * const invalidAddress = "invalidAddress";
 * const result = shortenAddress(invalidAddress);
 * // `result` will be "unknown.eth".
 *
 * // If the address is "You":
 * const userAddress = "You";
 * const userResult = shortenAddress(userAddress);
 * // `userResult` will be "You".
 */
const shortenAddress = (address: string): string => {
  if (address === "You") return address;

  if (!isAddress(address)) return "unknown.eth";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default shortenAddress;
