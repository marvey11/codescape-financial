import "reflect-metadata";

import config from "config";
import express from "express";

import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import {
  QuoteDataController,
  SecuritiesController,
  SecuritiesExchangeController,
  TransactionController
} from "./controllers";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(() => {
    useContainer(Container);

    const app = express();

    app.use(express.json());

    useExpressServer(app, {
      routePrefix: "/api",
      classTransformer: true,
      validation: true,
      controllers: [QuoteDataController, SecuritiesController, SecuritiesExchangeController, TransactionController]
    });

    const port: number = config.get("express.port");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
