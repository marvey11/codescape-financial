import { FLOATING_POINT_TOLERANCE } from "../constants.js";

const areEffectivelyEqual = (
  a: number,
  b: number,
  tolerance: number = FLOATING_POINT_TOLERANCE,
): boolean => {
  return isEffectivelyZero(a - b, tolerance);
};

const isEffectivelyZero = (
  num: number,
  tolerance: number = FLOATING_POINT_TOLERANCE,
): boolean => {
  return Math.abs(num) <= tolerance;
};

export { areEffectivelyEqual, isEffectivelyZero };
