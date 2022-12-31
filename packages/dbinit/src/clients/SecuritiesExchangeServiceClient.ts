import { AddExchangeDTO } from "@csfin/core";
import { ServiceClientBase } from "./ServiceClientBase";

export class SecuritiesExchangeServiceClient extends ServiceClientBase {
  public readonly ENDPOINT = "/exchanges";

  public addOne = async (data: AddExchangeDTO): Promise<void> =>
    this.sendRequest({ url: this.ENDPOINT, method: "POST", data: data });
}
