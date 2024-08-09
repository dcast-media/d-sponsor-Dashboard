import React from "react";

/**
 * Converts newline characters (`\n`) in a string into `<br>` elements for rendering in React.
 * This function is useful when you want to preserve line breaks in a string
 * when displaying it in a React component.
 *
 * @param {string} text - The input text that may contain newline characters.
 * @returns {React.ReactNode} - A React fragment containing the text with `<br>` elements inserted
 *                              where newlines occur, or the original input if it's not a string.
 *
 * @example
 * // Example usage:
 * const text = "Hello\nWorld";
 * const formattedText = addLineBreaks(text);
 * // `formattedText` will render as:
 * // Hello
 * // <br />
 * // World
 *
 * // Rendering in a component:
 * // <div>{formattedText}</div>
 *
 * // If the input is not a string, it will return the input as is:
 * const nonStringInput = 42;
 * const unchangedInput = addLineBreaks(nonStringInput);
 * // `unchangedInput` will be 42.
 */
export function addLineBreaks(text: string): React.ReactNode {
  if (typeof text !== "string") return text;

  return text.split("\n").map((line, index, array) => (
    <div key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </div>
  ));
}
