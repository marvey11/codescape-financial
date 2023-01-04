import { CreateAccountDTO } from "../dto";
import { ServiceClientBase } from "./ServiceClientBase";

export class AccountServiceClient extends ServiceClientBase {
  public readonly ENDPOINT = "/accounts";

  public addOne = async (data: CreateAccountDTO): Promise<void> =>
    this.sendRequest({ url: this.ENDPOINT, method: "POST", data: data });
}
