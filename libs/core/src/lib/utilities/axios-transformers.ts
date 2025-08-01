import { isValidISODateString } from "./dateutils.js";

const transformDateStringsToDates = (input: unknown): unknown => {
  // Base case: if not an object or is null, return as is.
  if (typeof input !== "object" || input === null) {
    return input;
  }

  // Handle arrays by recursively transforming each item, returning a new array.
  if (Array.isArray(input)) {
    return input.map((item) => transformDateStringsToDates(item));
  }

  // Handle objects: create a new object with transformed values.
  const result: { [key: string]: unknown } = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string" && isValidISODateString(value)) {
      // If the value is a string that looks like a date, convert it.
      result[key] = new Date(value);
    } else if (typeof value === "object" && value !== null) {
      // If the value is another object, recurse.
      result[key] = transformDateStringsToDates(value);
    } else {
      // Otherwise, just copy the value.
      result[key] = value;
    }
  }

  return result;
};

export { transformDateStringsToDates };
