import { z } from "zod";
import { DateStringSchema, IsinStringSchema } from "./zod-schema.types";

const RawStockSplitSchema = z.object({
  splitDate: DateStringSchema,
  splitRatio: z.number().positive(),
});

const RawStockSplitRecordSchema = z.record(
  IsinStringSchema,
  z.array(RawStockSplitSchema),
);

type RawStockSplitData = z.infer<typeof RawStockSplitSchema>;
type RawStockSplitListData = z.infer<typeof RawStockSplitRecordSchema>;

const RawDividendSchema = z.object({
  date: DateStringSchema,
  dividendPerShare: z.number().positive(),
  shares: z.number().positive(),
  exchangeRate: z.number().positive().optional(),
});

const RawDividendRecordSchema = z.object({
  isin: IsinStringSchema,
  dividends: z.array(RawDividendSchema),
});

const RawDividendRecordListSchema = z.array(RawDividendRecordSchema);

type RawDividendData = z.infer<typeof RawDividendSchema>;
type RawDividendRecordData = z.infer<typeof RawDividendRecordSchema>;
type RawDividendRecordListData = z.infer<typeof RawDividendRecordListSchema>;

export {
  RawDividendRecordListSchema,
  RawDividendRecordSchema,
  RawDividendSchema,
  RawStockSplitRecordSchema,
  RawStockSplitSchema,
};
export type {
  RawDividendData,
  RawDividendRecordData,
  RawDividendRecordListData,
  RawStockSplitData,
  RawStockSplitListData,
};
