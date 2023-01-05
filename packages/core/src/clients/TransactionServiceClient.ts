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
        (data: AddTransactionDTO) => {
          const d = data.date;

          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, "0");
          const day = d.getDate().toString().padStart(2, "0");

          return {
            ...data,
            date: `${year}-${month}-${day}`
          };
        },

        // ... and then run all the default transformers after that
        ...(axios.defaults.transformRequest as AxiosRequestTransformer[])
      ]
    });
}
