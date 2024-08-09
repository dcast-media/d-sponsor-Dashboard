import knownAddresses from "@/data/knownAddresses";
import { Address } from "thirdweb";

/**
 * Checks if a given address is in the known addresses list and returns a formatted string
 * that either includes the known identity information or simply returns the address itself.
 *
 * This function is typically used to verify if an address is recognized and to present
 * a user-friendly display of the address, including an indication of verification by the SiBorg Team.
 *
 * @param {Address} address - The address to be checked against the known addresses list.
 * @returns {string} - A formatted string that includes the known name and a shortened version of the address
 *                     with a verification mark if found in the known addresses list,
 *                     or the full address if it is not recognized.
 *
 * @example
 * // When the address is known:
 * const address = "0x1234567890abcdef1234567890abcdef12345678";
 * const displayText = displayOrCheckKnownAddress(address);
 * // `displayText` might return something like:
 * // "Alice 0x1234...5678 - ✅ Identity verified by SiBorg Team"
 *
 * // When the address is unknown:
 * const unknownAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdef";
 * const displayTextUnknown = displayOrCheckKnownAddress(unknownAddress);
 * // `displayTextUnknown` will return the full address as:
 * // "0xabcdefabcdefabcdefabcdefabcdefabcdef"
 *
 * @requires @/data/known-addresses.js - A module that exports an object mapping known addresses
 *                                        to their corresponding identity information (e.g., name).
 */
export default function displayOrCheckKnownAddress(address: Address): string {
  const known = knownAddresses[address];

  if (known) {
    return `${known.name} ${address.slice(0, 6)}...${address.slice(-4)} - ✅ Identity verified by SiBorg Team`;
  } else {
    return `${address}`;
  }
}
