import { AddTransactionDTO } from "../dto";
import { ServiceClientBase } from "./ServiceClientBase";

export class TransactionServiceClient extends ServiceClientBase {
  protected createEndPoint = (accountID: number) => `/accounts/${accountID}/transactions`;

  public addOne = async (accountID: number, data: AddTransactionDTO): Promise<void> =>
    this.sendRequest({
      url: this.createEndPoint(accountID),
      method: "POST",
      data: data
    });
}
