import { Injectable } from "@nestjs/common";

@Injectable()
export class TaxCalculationService {
  // --- Tax Constants for German Law ---
  private static readonly GERMAN_ABGELTUNGSTEUER_RATE = 0.25; // 25%
  private static readonly SOLIDARITY_SURCHARGE_RATE = 0.055; // 5.5% of the tax
  private static readonly MAX_FOREIGN_TAX_CREDIT_RATE = 0.15; // Maximum 15% can be credited

  /**
   * Calculates the total taxes on a dividend payment according to German tax law.
   * @param grossDividendInEur The gross dividend amount in the portfolio's base currency.
   * @param foreignWithholdingTaxRate The withholding tax rate of the stock's country of origin.
   * @returns The total tax amount.
   */
  calculateDividendTaxes(
    grossDividendInEur: number,
    foreignWithholdingTaxRate: number,
  ): number {
    // 1. Foreign tax actually paid, converted to EUR.
    const foreignTaxPaidInEur = grossDividendInEur * foreignWithholdingTaxRate;

    // 2. Determine the creditable portion of the foreign tax.
    const creditableForeignTaxRate = Math.min(
      foreignWithholdingTaxRate,
      TaxCalculationService.MAX_FOREIGN_TAX_CREDIT_RATE,
    );
    const foreignTaxCreditInEur = grossDividendInEur * creditableForeignTaxRate;

    // 3. Calculate the full German capital gains tax before any credits.
    const fullGermanCapitalGainsTax =
      grossDividendInEur * TaxCalculationService.GERMAN_ABGELTUNGSTEUER_RATE;

    // 4. Calculate the German tax that is still due after applying the credit.
    const germanTaxDue = Math.max(
      0,
      fullGermanCapitalGainsTax - foreignTaxCreditInEur,
    );

    // 5. Calculate the solidarity surcharge on the German tax that is actually due.
    const solidaritySurcharge =
      germanTaxDue * TaxCalculationService.SOLIDARITY_SURCHARGE_RATE;

    // 6. The total tax for the DTO is the sum of all tax components.
    const totalTaxes = foreignTaxPaidInEur + germanTaxDue + solidaritySurcharge;

    return totalTaxes;
  }

  /**
   * Calculates the capital gains tax on a sale of shares.
   * @param realizedGain The profit from the sale.
   * @returns The total tax amount.
   */
  calculateCapitalGainsTax(realizedGain: number): number {
    if (realizedGain <= 0) {
      return 0;
    }

    const capitalGainsTax =
      realizedGain * TaxCalculationService.GERMAN_ABGELTUNGSTEUER_RATE;
    const solidaritySurcharge =
      capitalGainsTax * TaxCalculationService.SOLIDARITY_SURCHARGE_RATE;

    return capitalGainsTax + solidaritySurcharge;
  }
}
