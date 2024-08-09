import React, { SetStateAction } from "react";

/**
 * Copies the given text to the clipboard and updates the state to indicate
 * that the text has been copied.
 *
 * This function utilizes the Clipboard API to copy the text and handles any
 * errors that may occur during the process. It also updates the provided state
 * function to reflect the success of the copy operation.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @param {function} setCopied - A state updater function (e.g., from `useState`)
 *                                to update the state indicating whether the text
 *                                has been successfully copied.
 *
 * @returns {Promise<void>} - A promise that resolves when the copy operation
 *                             is complete. In case of an error, it logs the error
 *                             to the console.
 *
 * @throws {Error} - Throws an error if the copy operation fails.
 *
 * @example
 * // Example usage in a React component:
 * const [copied, setCopied] = useState(false);
 * const handleCopy = async () => {
 *   await handleCopy("Text to copy", setCopied);
 *   // `copied` state will be set to `true` if the copy was successful.
 * };
 *
 * // React component might render:
 * // <button onClick={handleCopy}>Copy Text</button>
 * // {copied && <p>Text copied!</p>}
 */
const handleCopy = async (text: string, setCopied: React.Dispatch<SetStateAction<boolean>>) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  } catch (error) {
    console.error(error);
  }
};

export default handleCopy;
