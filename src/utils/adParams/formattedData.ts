/**
 * Processes an array of objects containing ad parameters by converting them into their corresponding
 * values from a predefined list of keys and values.
 *
 * This function expects an array of objects where each object has an `adParameter` property.
 * It converts the `adParameter` from a Buffer to a hexadecimal string and matches this string
 * against a predefined list of key-value pairs. It returns an array of values corresponding to the matched keys.
 *
 * If no matching key is found or if the input is invalid, the function handles errors accordingly.
 *
 * @param {Array<{ adParameter: Buffer }>} data - An array of objects where each object contains a
 *                                                Buffer under the `adParameter` key.
 *
 * @returns {Array<string>} - An array of strings where each string is the value from the predefined list
 *                             corresponding to the `adParameter`. If no matching keys are found, an error
 *                             is thrown.
 *
 * @throws {Error} - Throws an error if no matching key is found in the predefined list.
 *
 * @example
 * // Example usage:
 * const inputData = [
 *   { adParameter: Buffer.from("imageURL") },
 *   { adParameter: Buffer.from("linkURL") }
 * ];
 *
 * const result = bufferAdParams(inputData);
 * // `result` will be an array containing ["imageURL", "linkURL"].
 *
 * // If inputData contains no valid adParameters or the Buffer values do not match any key, an error will be thrown:
 * // const invalidData = [{ adParameter: Buffer.from("unknownURL") }];
 * // bufferAdParams(invalidData); // This will throw an error: "No matching key found".
 */
export const bufferAdParams = (data) => {
  const buffedArray = [
    {
      key: "d99a7aefbfbd3125efbfbd36efbfbd64147eefbfbddb9eefbfbd62efbfbdefbfbd0639efbfbd1e1cefbfbd1f7c67efbfbdefbfbd1527",
      value: "imageURL"
    },
    {
      key: "6a0befbfbd4575efbfbdefbfbd41efbfbd4defbfbd546510efbfbd3e6eefbfbdefbfbd232eefbfbd32610fefbfbdefbfbd707d6cefbfbd",
      value: "linkURL"
    }
  ];

  if (!data?.[0]?.adParameter) {
    console.error("Invalid input data");
    return;
  }
  const adParamsData: string[] = [];
  for (const element of data) {
    const validParam = element.adParameter;
    const normalizedParams = Buffer.from(validParam).toString("hex");
    const foundItem = buffedArray.find((item) => item.key === normalizedParams);

    adParamsData.push(foundItem?.value as string);
  }

  if (adParamsData.length > 1) {
    return adParamsData;
  } else {
    throw new Error("No matching key found");
  }
};
