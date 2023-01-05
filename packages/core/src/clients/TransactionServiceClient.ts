import axios, { AxiosRequestTransformer } from "axios";
import { AddTransactionDTO } from "../dto";
import { ServiceClientBase } from "./ServiceClientBase";

export class TransactionServiceClient extends ServiceClientBase {
  protected createEndPoint = (accountID: number) => `/accounts/${accountID}/transactions`;

  public addOne = async (accountID: number, data: AddTransactionDTO): Promise<void> =>
    this.sendRequest({
      url: this.createEndPoint(accountID),
      method: "POST",
      data: data,
      transformRequest: [
        // first, execute the transformer that simplifies the date...
        (data: AddTransactionDTO) => ({
          ...data,
          date: this.simplifyDateString(data.date)
        }),

        // ... and then run all the default transformers after that
        ...(axios.defaults.transformRequest as AxiosRequestTransformer[])
      ]
    });

  /** Converts a Date object to a simplified ISO 8601 date format string in the form "YYYY-MM-DD". */
  private simplifyDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
}
