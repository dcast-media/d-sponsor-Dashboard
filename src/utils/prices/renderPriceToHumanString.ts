/**
 * Renders a decimal price to a human-readable string with adaptive precision.
 *
 * @param {number} decimalPrice - The price in decimal form.
 * @param {string} currencySymbol - The symbol of the currency.
 * @returns {string} - The formatted price with adaptive precision.
 */
function renderPriceToHumanString(decimalPrice, currencySymbol) {
  let precision;
  if (decimalPrice >= 10) {
    precision = 2;
  } else if (decimalPrice >= 0.1) {
    precision = 3;
  } else {
    precision = 6;
  }

  const formattedPrice = Number(decimalPrice).toFixed(precision);

  // Add spaces as thousands separators
  const parts = formattedPrice.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${parts.join(".")} ${currencySymbol}`;
}

export default renderPriceToHumanString;
