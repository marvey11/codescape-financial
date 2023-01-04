import { AddSecurityDTO } from "../dto";
import { ServiceClientBase } from "./ServiceClientBase";

export class SecurityServiceClient extends ServiceClientBase {
  public readonly ENDPOINT = "/securities";

  public addOne = async (data: AddSecurityDTO): Promise<void> =>
    this.sendRequest({ url: this.ENDPOINT, method: "POST", data: data });
}
