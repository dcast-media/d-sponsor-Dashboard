/**
 * Checks if the provided path matches the specified match string.
 *
 * This function compares two strings, `path` and `match`, and returns `true` if they are equal.
 * It performs a check only if both parameters are defined and not null.
 *
 * @param {string} path - The path string to be compared.
 * @param {string} match - The string to compare the path against.
 * @returns {boolean} - Returns `true` if `path` and `match` are equal and both are defined;
 *                      otherwise, returns `false`.
 *
 * @example
 * // Example usage:
 * const currentPath = "/home";
 * const targetPath = "/home";
 * const isMatch = pathChecking(currentPath, targetPath);
 * // `isMatch` will be true because both strings are equal.
 *
 * // If either `path` or `match` is not provided:
 * const result = pathChecking(null, "/home");
 * // `result` will be false because the `path` is not defined.
 */
export default function pathChecking(path, match) {
  if (path && match) {
    if (path === match) {
      return true;
    }
    return false;
  }
  return false;
}
