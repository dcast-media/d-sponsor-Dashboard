/**
 * Converts a date into a human-readable string representing the time elapsed since that date.
 * This function provides a relative time string that describes how long ago a specific date was,
 * from seconds up to months. It is useful for displaying time-related information in a user-friendly format.
 *
 * @param {Date} date - The date to be converted into a human-readable format.
 * @returns {string} - A string representing the elapsed time since the given date.
 *                      The format varies from seconds, minutes, hours, to days or months,
 *                      depending on how much time has passed.
 *
 * @example
 * // Example usage:
 * const pastDate = new Date('2024-07-01T12:00:00Z');
 * const humanReadableString = renderDateToHumanString(pastDate);
 * // If today is August 6, 2024, `humanReadableString` might be "1 month ago" or "36 days ago",
 * // depending on the exact current date and time.
 *
 * // If the date is very recent, the output might be something like:
 * // "5 minutes ago" or "2 seconds ago".
 */
function renderDateToHumanString(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate

  if (months > 0) {
    return `on ${date.toLocaleDateString()}`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

export default renderDateToHumanString;
