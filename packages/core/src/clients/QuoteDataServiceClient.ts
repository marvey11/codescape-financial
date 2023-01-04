import { AddQuoteDataDTO } from "../dto";
import { ServiceClientBase } from "./ServiceClientBase";

export class QuoteDataServiceClient extends ServiceClientBase {
  public readonly ENDPOINT = "/quotes";

  public add = async (data: AddQuoteDataDTO): Promise<void> =>
    this.sendRequest({ url: this.ENDPOINT, method: "POST", data: data });
}
