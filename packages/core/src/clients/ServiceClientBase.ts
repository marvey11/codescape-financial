import { AxiosInstance, AxiosRequestConfig } from "axios";
import { clientInstance } from "./AxiosBaseClient";

/**
 * Abstract base class for REST API service clients.
 */
export abstract class ServiceClientBase {
  /**
   * Then underlying `AxiosInstance`.
   */
  private instance: AxiosInstance;

  constructor() {
    this.instance = clientInstance;
  }

  /** Returns this client's underlying `AxiosInstance`. */
  protected getInstance = () => this.instance;

  /**
   * Executes a service request.
   *
   * @param config the configuration instance
   * @returns the data
   */
  protected sendRequest = async <T>(config: AxiosRequestConfig): Promise<T> =>
    this.getInstance()
      .request<T>(config)
      .then((response) => response.data);
}
