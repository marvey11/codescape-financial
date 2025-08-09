import { z } from "zod";

const DATE_STRING_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const DateStringSchema = z
  .string()
  .regex(DATE_STRING_REGEX, "Invalid date format. Expected YYYY-MM-DD.");

const ISIN_STRING_REGEX = /^[A-Z]{2}[A-Z0-9]{9}\d$/;
const IsinStringSchema = z
  .string()
  .regex(ISIN_STRING_REGEX, "Invalid ISIN format.");

export { DateStringSchema, IsinStringSchema };
