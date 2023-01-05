import axios from "axios";
import { getAPIBaseURL } from "../config";

const client = axios.create({ baseURL: getAPIBaseURL() });

export { client as clientInstance };
