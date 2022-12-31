import axios from "axios";
import config from "config";

const client = axios.create({ baseURL: config.get("api.host") + "/api" });

export { client as clientInstance };
