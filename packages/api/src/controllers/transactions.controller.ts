import { AddTransactionDTO } from "@csfin/core";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Get, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { TransactionService } from "../services";

@Service()
@JsonController()
export class TransactionController {
  constructor(private service: TransactionService) {}

  @Get("/transactions")
  async getAll(@Res() response: Response): Promise<Response> {
    return this.service
      .getAll()
      .then((transactions) => response.status(StatusCodes.OK).send(transactions))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Get("/transactions/:isin")
  async getAllByISIN(@Res() response: Response, @Param("isin") isin: string): Promise<Response> {
    return this.service
      .getAllByISIN(isin)
      .then((transactions) => response.status(StatusCodes.OK).send(transactions))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }

  @Post("/transactions")
  async addOne(@Body({ required: true }) data: AddTransactionDTO, @Res() response: Response): Promise<Response> {
    return this.service
      .addOne(data)
      .then((result) => response.status(StatusCodes.CREATED).send(result))
      .catch((error) => response.status(StatusCodes.BAD_REQUEST).send({ message: error.message }));
  }
}
