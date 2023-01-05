import jsonData from "./default.json";

const getAPIBaseURL = () => jsonData.api.baseURL;

const getDatabaseConfig = () => jsonData.database;

const getExpressPort = () => jsonData.express.port;

export { getAPIBaseURL, getDatabaseConfig, getExpressPort };
