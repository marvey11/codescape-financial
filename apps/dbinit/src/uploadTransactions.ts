import { parseFromCSV, TransactionData } from "@csfin/codi";
import { AddTransactionDTO, dateToISO8601, TransactionServiceClient } from "@csfin/core";

/** main() -- IIFE */
(async () => {
  const cliArgs = process.argv.slice(2);

  if (cliArgs.length < 2) {
    console.error("Please specify the account ID and the transaction CSV file as a CLI arguments");
    process.exit(255);
  }

  const [accountID, ...csvFiles] = cliArgs;

  try {
    parseFromCSV([...new Set<string>(csvFiles)], { delimiter: ";" }).then((data: TransactionData[]) => {
      processTransactions(Number.parseInt(accountID), data);
    });
  } catch (error) {
    console.error(error);
    process.exit(254);
  }
})();

const processTransactions = (accountID: number, data: TransactionData[]) => {
  const client = new TransactionServiceClient();

  data.map(transformTransactionData).forEach((dto) => {
    client.addOne(accountID, dto).catch(async () => {
      console.error(dto.isin);
    });
  });
};

const transformTransactionData = (t: TransactionData) => {
  const dto = new AddTransactionDTO();
  dto.type = t.type;
  dto.isin = t.isin;
  dto.date = dateToISO8601(t.date);
  dto.shares = t.shares;
  dto.price = t.price;
  return dto;
};
