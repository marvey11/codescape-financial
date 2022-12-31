import { parseFromCSV, TransactionData } from "@csfin/codi";
import { AddTransactionDTO } from "@csfin/core";
import { TransactionServiceClient } from "./clients";

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
  const { isin, type, date, price, shares } = t;

  const dto = new AddTransactionDTO();
  dto.isin = isin;
  dto.type = type;
  dto.date = date;
  dto.price = price;
  dto.shares = shares;

  return dto;
};
