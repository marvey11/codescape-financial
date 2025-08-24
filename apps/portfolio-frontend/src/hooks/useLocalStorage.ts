import { useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T | (() => T),
) => {
  // `useState`'s initializer function is lazy, so `getInitialValue` runs only once.
  const [value, setValue] = useState<T>(() =>
    getInitialValue(key, defaultValue),
  );

  useEffect(() => {
    // Only attempt to write to localStorage if in a browser environment.
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as [T, typeof setValue];
};

const getInitialValue = <T>(key: string, defaultValue: T | (() => T)): T => {
  // Calculate the fallback value once.
  // This will be returned if localStorage is unavailable, parsing fails, or key isn't found.
  const fallbackValue: T =
    typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : defaultValue;

  // Check if window is defined (i.e., we are in a browser environment).
  // If not, return the fallback immediately as localStorage is not available.
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const jsonValue = localStorage.getItem(key);
    // If a value exists in localStorage and is not null/undefined, attempt to parse it.
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    // Log any errors during localStorage access or JSON parsing,
    // but fall back to the default value without crashing.
    console.error(`Error parsing localStorage key "${key}":`, e);
  }

  // If localStorage is empty, or there was an error, return the calculated fallback value.
  return fallbackValue;
};
