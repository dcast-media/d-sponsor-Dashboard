/**
 * Formats a token ID by truncating the middle part if it exceeds 6 characters.
 *
 * @param {string} str - The token ID string to format.
 * @returns {string} - The formatted token ID.
 */
export function formatTokenId(str: string): string {
  if (str?.length <= 6) {
    return str;
  }
  return str?.slice(0, 3) + "..." + str?.slice(-3);
}
