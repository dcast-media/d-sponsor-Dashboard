/**
 * Checks if the given path matches the match string.
 *
 * @param {string} path - The path to check.
 * @param {string} match - The string to match against the path.
 * @returns {boolean} - Returns true if the path matches the match string, otherwise false.
 */
export function isChildrenPageActive(path, match) {
  if (path && match) {
    if (path === match) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * Checks if any page in the given pages array has a path that matches the given path.
 *
 * @param {Array<{path: string}>} pages - The array of pages to check.
 * @param {string} path - The path to match against the pages.
 * @returns {boolean} - Returns true if any page in the array has a matching path, otherwise false.
 */
export function isParentPageActive(pages, path) {
  if (pages) {
    return pages.some((page) => page.path === path);
  }
  return false;
}
