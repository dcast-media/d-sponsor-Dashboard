import { toUtf8Bytes, keccak256 } from "ethers/lib/utils";

/**
 * Converts a normalized string into a `BigInt` representing its unique identifier.
 * This function is typically used to match or identify a token by converting its data string
 * into a standardized format and then hashing it to generate a unique token ID.
 *
 * @param {string} s - The input string to be converted to a token ID. This string will be normalized
 *                     and hashed to ensure a unique representation.
 *
 * @returns {BigInt} - The resulting token ID as a `BigInt`, which is derived from hashing the normalized
 *                      version of the input string using the Keccak-256 hashing algorithm.
 *
 * @description
 * - The input string is first converted to lowercase to ensure case insensitivity.
 * - It is then normalized using Unicode normalization form "NFKD" to standardize the characters.
 * - Diacritic marks are removed from the string to avoid variations caused by accents or other marks.
 * - Non-alphanumeric characters are stripped out to ensure that only letters and digits are included.
 * - The resulting normalized string is converted to UTF-8 bytes and hashed using Keccak-256.
 * - The hash is then converted to a `BigInt` to produce the final token ID.
 *
 * @example
 * // Example usage:
 * const tokenString = "ExampleToken!";
 * const tokenId = stringToUint256(tokenString);
 * // `tokenId` will be a `BigInt` representing the hash of the normalized string "exampletoken".
 */
export default function stringToUint256(s: string): bigint {
  const normalized = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/gi, "");

  return BigInt(keccak256(toUtf8Bytes(normalized)));
}
