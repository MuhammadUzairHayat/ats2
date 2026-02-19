/**
 * Utility functions for text processing and formatting
 */

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The input string to capitalize
 * @returns The capitalized string
 */
export const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

/**
 * Formats experience array into a readable string
 * @param experience - Array with years and months
 * @returns Formatted experience string
 */
export const formatExperience = (experience: string[]): string => {
  const years = experience[0];
  const months = experience[1];

  const yearText = years === "1" ? "year" : "years";
  const monthText = months === "1" ? "month" : "months";

  const parts = [];

  if (years && years !== "0") {
    parts.push(`${years} ${yearText}`);
  }

  if (months && months !== "0") {
    parts.push(`${months} ${monthText}`);
  }

  return parts.length > 0 ? parts.join(", ") : "";
};

/* _______________________________________
   Status flag constants
   _________________________________________
*/
const STATUS_FLAGS = ["active", "onHold", "rejected"] as const;

/* _______________________________________
   Convert status flag index to string value
   _________________________________________
*/
export const getStatusFlagString = (statusFlagIndex: number): string => {
  return STATUS_FLAGS[statusFlagIndex] || STATUS_FLAGS[0];
};

/* _______________________________________
   Convert status flag string to index value
   _________________________________________
*/
export const getStatusFlagIndex = (statusFlagString: string): number => {
  return STATUS_FLAGS.indexOf(
    statusFlagString as (typeof STATUS_FLAGS)[number]
  );
};

/* _______________________________________
   Convert string to standard title case with exceptions
   _________________________________________
*/
export function toStandardTitleCase(str: string): string {
  const exceptions = new Set([
    "in",
    "of",
    "and",
    "or",
    "the",
    "a",
    "an",
    "bin",
    "bint",
    "ibn",
    "ur",
    "al",
    "for",
  ]);

  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index, arr) => {
      const hyphenParts = word
        .split("-")
        .map((part, hyphenIndex, hyphenArr) => {
          // Check if this part is an exception word
          const isException = exceptions.has(part);
          const isFirstWord = index === 0 && hyphenIndex === 0;
          const isLastWord =
            index === arr.length - 1 && hyphenIndex === hyphenArr.length - 1;

          // Keep exception words lowercase unless they're at the very start or end
          if (isException && !isFirstWord && !isLastWord) {
            return part;
          }

          return part.charAt(0).toUpperCase() + part.slice(1);
        });

      return hyphenParts.join("-");
    })
    .join(" ");
}
